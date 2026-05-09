/**
 * types.ts - Shared TypeScript interfaces for the TaxNaija tax engine.
 * Pure data shapes. No framework dependencies.
 */

// ── Input types ───────────────────────────────────────────────────────────────

export type EmploymentType = 'employed' | 'self-employed' | 'both';

/**
 * Raw income figueres supplied by the user. All amounts in Nigerian Naira (₦).
 */
export interface IncomeInput {
    employmentType: EmploymentType;
    /**
     * Monthly gross salary - for 'employed or 'both'.
     * Engine multiplies by 12 to annalise.
     */
    monthlySalary?: number;
     /**
   * Annual gross self-employment / business income.
   * Use for 'self-employed'. For 'both', this is the non-salary portion.
   */
  annualSelfIncome?: number;

  /** Other annual income: rent received, dividends, casual earnings, etc */
    otherAnnualIncome?: number;
}

/**
 * Deductions and reliefs claimed by the taxpayer under NTA 2025.
 * All amounts in Naira (₦) per year.
 * All claims require written proof under NTA 2025 s.31-32.
 */

export interface DeductionInput {
    /**
   * Total pension contributions (employee share only) for the year.
   * Includes mandatory 8% + any voluntary top-up.
   * Omit to auto-calculate mandatory 8% of employment salary.
   */
    pensionContribution?: number;

 /**
   * Total rent paid in the tax year (₦).
   * Relief = 20% of this, capped at ₦500,000.
   * NTA 2025 s.30(vi).
   */
    annualRentPaid?: number;
    /**
   * Life insurance / annuity premiums paid (₦/year).
   * Must be for self or spouse, with a Nigerian insurer.
   * NTA 2025 s.30 — deductible in full subject to 10%-of-gross cap.
   */
    lifeInsurancePremium?: number;

     /**
   * National Housing Fund (NHF) contribution (₦/year).
   * Typically 2.5% of monthly basic salary.
   */
    nhfContribution?: number;

     /**
   * National Health Insurance Scheme (NHIS) employee contribution (₦/year).
   * Typically 5% of monthly basic salary.
   */
    nhisContribution?: number;
}

/** Full input to the tax computation engine */
export interface TaxInput {
    income: IncomeInput;
    deductions: DeductionInput;
    stateOfResidence?: string
    taxYear?: number

}

// ── Output types ─────────────────────────────────────────────────────────────
 
/** A single bracket's contribution to the total tax. */

export interface BracketResult{
    from: number // lower bound of band (₦)
    to: number // upper bound (₦). Infinity = unbounded top band.
    rate: number // marginal rate e.g. 0.15
    taxableAmount: number // income that fell in this band
    taxCharged: number // tax on this band. 
}

/** Computed relief amounts after applying NTA 2025 caps. */
export interface ReliefBreakdown {
    pension: number // pension relief claimed (₦)
    rent: number // effective rent relief(20% of rent, max ₦500k)
    insurance: number // effective life insurance relief (₦)
    nhf: number // NHF contribution (₦)
    nhis: number // NHIS contribution (₦)
    total: number // sum of all reliefs
}

/** Full output of the tax computation engine. */
export interface TaxResult {
    taxYear: number
    taxAct: string // 'Nigeria Tax Act 2025'
// ── Income ─────────────────────────────────────────────────────────────
    annualSalary: number // annualized salary income (₦)
    otherIncome: number // other income (rent, dividends, etc) (₦)
    grossIncome: number // total gross income (₦)

// ── Reliefs ───────────────────────────────────────────────────────────
    reliefs: ReliefBreakdown

// ── chargeable income ───────────────────────────────────────────────────

/** grossIncome - reliefs.total (floored at 0) */
chargeableIncome: number

// ── tax calculation ───────────────────────────────────────────────────────
bracketResults: BracketResult[] // breakdown of tax by bracket
annualTax: number // total annual tax owed (₦)
monthlyTax: number // annualTax / 12 (₦)


  // ── Flags ──────────────────────────────────────────────────────────────
  /** True when gross income ≤ ₦800,000 (zero-rate band). */
  zeroRateBandApplied: boolean;

  /** True when gross income < 840,000 (zero-rate band) */
  minimumWageExempt: boolean

   // ── Effective rates ───────────────────────────────────────────────────────
   effectiveRate: number // annualTax / grossIncome (e.g. 0.18 for 18%)
   effectiveRateOnChargeable: number // annualTax / chargeableIncome (e.g. 0.25 for 25%)


}

// ── Penalty ───────────────────────────────────────────────────────────────────

export interface PenaltyResult {
    fixedPenalty: number 
    percentagePenalty: number
    totalPenalty: number
    interestCharged: number
}

// ── Deadline ──────────────────────────────────────────────────────────────────
export interface DeadlineInfo {
    taxYear: number
    deadlineDate: Date
    daysRemaining: number
    isOverdue: boolean
    penaltyIfFiledToday: PenaltyResult | null
}