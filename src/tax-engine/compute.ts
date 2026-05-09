/**
 * compute.ts — Core NTA 2025 Nigerian Personal Income Tax engine.
 *
 * Entry point: computeTax(input) → TaxResult
 *
 * NTA 2025 structural changes implemented here:
 *   1. ₦800k is now a formal 0% band inside the bracket table (not a deduction)
 *   2. Chargeable income = grossIncome − reliefs (no threshold deduction subtracted)
 *      The 0% band handles the first ₦800k naturally
 *   3. Minimum tax ABOLISHED — no floor applied
 *   4. CRA abolished — only NTA 2025 reliefs (rent, pension, insurance, NHF, NHIS)
 */

import { TAX_ACT, TAX_YEAR, TAX_BRACKETS, ZERO_RATE_THRESHOLD, MINIMUM_WAGE_ANNUAL, LATE_FILING_PENALTY_FIXED, LATE_FILING_PENALTY_RATE, LATE_PAYMENT_INTEREST_RATE, FILING_DEADLINE_DAY, FILING_DEADLINE_MONTH } from './brackets.js';

import { computeReliefs } from './reliefs.js';

import type { TaxInput, TaxResult, BracketResult, PenaltyResult, DeadlineInfo } from './types.js';

// ── Main computation ──────────────────────────────────────────────────────────
 
/**
 * Compute the full NTA 2025 personal income tax liability.
 *
 * @example — PAYE employee, ₦200k/month salary, pays ₦600k rent/year
 * ```ts
 * computeTax({
 *   income: { employmentType: 'employed', monthlySalary: 200_000 },
 *   deductions: { annualRentPaid: 600_000 },
 * })
 * // annualTax ≈ ₦252,000  (effective rate ≈ 10.5%)
 * ```
 *
 * @example — Zero-rate band: income ≤ ₦800k
 * ```ts
 * computeTax({
 *   income: { employmentType: 'employed', monthlySalary: 60_000 },
 *   deductions: {},
 * })
 * // annualTax = 0  (₦720k gross < ₦800k zero-rate band)
 * ```
 */

export function computeTax(input: TaxInput): TaxResult {
    const taxYear = input.taxYear ?? TAX_YEAR;

    // ── Step 1: Derive income figures ───────────────────────────────────────
    const annualSalary = deriveAnnualSalary(input);
    const otherIncome = deriveOtherIncome(input);
    const grossIncome = annualSalary + otherIncome;

    // Edge case: zero gross income
    if (grossIncome <= 0 ) return buildZeroResult(taxYear)

    // ── Step 2: Compute NTA 2025 reliefs ────────────────────────────────────
    const isSelfEmployed = input.income.employmentType === 'self-employed';
    const reliefs = computeReliefs(input.deductions, annualSalary, grossIncome, isSelfEmployed);

      // ── Step 3: Chargeable income ────────────────────────────────────────────
  // Under NTA 2025, chargeable income = gross − deductions.
  // The ₦800k zero-rate band is handled inside the bracket table itself,
  // so we do NOT subtract it here as a threshold deduction.
  const chargeableIncome = Math.max(0, grossIncome - reliefs.total);


    // ── Step 4: Apply NTA 2025 progressive bracket table ────────────────────
    const brackets = applyBrackets(chargeableIncome);
    const annualTax = brackets.reduce((sum, b) => sum + b.taxCharged, 0);

     // ── Step 5: Flags ────────────────────────────────────────────────────────
     const zeroRateBandApplied = chargeableIncome <= ZERO_RATE_THRESHOLD
     const minimumWageExempt = grossIncome <= MINIMUM_WAGE_ANNUAL;

     // ── Step 6: Effective rates ──────────────────────────────────────────────
     const effectiveRate = grossIncome > 0 ? annualTax / grossIncome : 0;
        const effectiveRateOnChargeable = chargeableIncome > 0 ? annualTax / chargeableIncome : 0;


    return {
        taxYear,
        taxAct: TAX_ACT,
        annualSalary,
        otherIncome,
        grossIncome,
        reliefs,
        chargeableIncome,
        bracketResults: brackets,
        annualTax: naira(annualTax),
        monthlyTax: naira(annualTax / 12),
        zeroRateBandApplied,
        minimumWageExempt,
        effectiveRate,
        effectiveRateOnChargeable
    }
}

// ── Bracket engine ────────────────────────────────────────────────────────────
 
/**
 * Walk the NTA 2025 Fourth Schedule bracket table.
 * Returns only brackets with taxable income > 0.
 *
 * The 0% band (₦0–₦800k) is included in results when applicable so the UI
 * can render it as "Tax-free band: ₦800,000 @ 0%".
 */
export function applyBrackets(chargeableIncome: number): BracketResult[] {
    if (chargeableIncome <= 0) return []

    const results: BracketResult[] = []
    let remaining = chargeableIncome

    for (const bracket of TAX_BRACKETS){
        if (remaining <= 0) break

        const bandWidth = bracket.width === Infinity ? remaining: bracket.width
        const taxableInBand = Math.min(remaining, bandWidth)
        const taxCharged = naira(taxableInBand * bracket.rate)
       
        // Always include the band if income falls in it (even 0% band, for transparency)

        results.push({
            from: bracket.from,
            to: bracket.width === Infinity ? Infinity : bracket.from + bandWidth,
            rate: bracket.rate,
            taxableAmount: naira(taxableInBand),
            taxCharged,
        })
        remaining -= taxableInBand
    }
    return results
}

// ── Penalty calculation ───────────────────────────────────────────────────────
 
/**
 * Calculate NTA 2025 / NTAA 2025 late filing and late payment penalties.
 *
 * @param taxOwed      Original annual tax liability
 * @param daysOverdue  Days past the March 31 deadline
 */

export function computePenalty(taxOwed: number, daysOverdue: number): PenaltyResult{
    if (daysOverdue <= 0 || taxOwed <= 0){
        return {fixedPenalty: 0, percentagePenalty: 0, interestCharged: 0, totalPenalty: 0}
    }
    const fixedPenalty  = LATE_FILING_PENALTY_FIXED
    const percentagePenalty  = naira(taxOwed * LATE_FILING_PENALTY_RATE)
    const yearsOverdue = daysOverdue / 365
    const interestCharged  =naira(taxOwed * LATE_PAYMENT_INTEREST_RATE * yearsOverdue)
    const totalPenalty = fixedPenalty + percentagePenalty + interestCharged

    return {fixedPenalty, percentagePenalty, interestCharged, totalPenalty}
}

// ── Filing deadline ───────────────────────────────────────────────────────────
 
/**
 * Returns deadline info for the given tax year.
 * Optional `taxResult` enables penalty projection.
 */
export function getDeadlineInfo(
    taxYear: number = TAX_YEAR,
    taxResult?: TaxResult,
    referenceDate: Date = new Date()
): DeadlineInfo {
    const deadlineDate = new Date(taxYear + 1, FILING_DEADLINE_MONTH - 1, FILING_DEADLINE_DAY)
    const msPerDay = 86_400_000
    const diffMs = deadlineDate.getTime() - referenceDate.getTime()
    const daysRemaining = Math.ceil(diffMs / msPerDay)
    const isOverdue = daysRemaining < 0
    const daysOverdue = isOverdue ? Math.abs(daysRemaining) : 0

    const penaltyIfFiledToday = isOverdue && taxResult ? computePenalty(taxResult.annualTax, daysOverdue): null

    return {taxYear, deadlineDate, daysRemaining, isOverdue, penaltyIfFiledToday}
}
// ── Income derivation ────────────────────────────────────────────────────────
function deriveAnnualSalary(input: TaxInput): number {
    const {employmentType, monthlySalary, annualSelfIncome} = input.income
    if (employmentType === 'self-employed') return naira(annualSelfIncome ?? 0)
        return naira((monthlySalary ?? 0) * 12)
}

function deriveOtherIncome(input: TaxInput): number {
    const {employmentType, annualSelfIncome, otherAnnualIncome} = input.income
    const other = otherAnnualIncome ?? 0
    if (employmentType === 'both') return naira((annualSelfIncome ?? 0) + other)
        return naira(other)
}


// ── Helpers ──────────────────────────────────────────────────────────────────
function naira(value: number): number {
    return Math.round(value)
}

function buildZeroResult(taxYear: number): TaxResult {
    return {
        taxYear,
        taxAct: TAX_ACT,
        annualSalary: 0,
        otherIncome: 0,
        grossIncome: 0,
        reliefs: {pension: 0, rent: 0, insurance: 0, nhf: 0, nhis: 0, total: 0},
        chargeableIncome: 0,
        bracketResults: [],
        annualTax: 0,
        monthlyTax: 0,
        zeroRateBandApplied: true,
        minimumWageExempt: true,
        effectiveRate: 0,
        effectiveRateOnChargeable: 0,
    }
}