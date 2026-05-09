/**
 * reliefs.ts — NTA 2025 personal relief and deduction calculations.
 *
 * Key NTA 2025 changes vs old PITA:
 *   • CRA (Consolidated Relief Allowance) ABOLISHED
 *   • Rent relief: 20% of rent, hard cap of ₦500,000 (not income-% based)
 *   • NHF and NHIS contributions now explicitly deductible (must claim in writing)
 *   • Life insurance remains deductible; we apply 10%-of-gross cap pending FIRS circular
 *   • Minimum tax abolished — no floor calculation needed
 */

import {
    PENSION_EMPLOYEE_MIN_RATE,
    RENT_RELIEF_RATE,
    RENT_RELIEF_NAIRA_CAP,
    INSURANCE_RELIEF_INCOME_CAP,
   
} from './brackets';
import type { DeductionInput, ReliefBreakdown } from './types';

// ── Individual relief calculators ─────────────────────────────────────────────
 
/**
 * Pension relief (Pension Reform Act 2014, preserved under NTA 2025).
 *
 * Mandatory minimum: 8% of annual employment salary.
 * Voluntary contributions above the minimum: also deductible (no upper cap).
 *
 * If `claimed` is omitted, we auto-calculate the 8% mandatory minimum.
 * If `claimed` is provided and > mandatory, the full claimed amount is allowed.
 * If `claimed` < 0, returns 0.
 *
 * @param annualEmploymentSalary  Employment income only (not self-employment)
 * @param claimed                 What the taxpayer actually contributed (optional)
 */

export function pensionRelief(annualEmploymentSalary: number, claimed?: number): number {
    if (annualEmploymentSalary <= 0) return 0; // no salary, no relief.
    if (claimed === undefined) {
        // Auto-calculate mandatory minimum: 8% of employment salary.
        return naira( annualEmploymentSalary * PENSION_EMPLOYEE_MIN_RATE);
    }
    return naira(Math.max(0, claimed)); // claimed amount, but not less than 0.

}

/**
 * Rent relief — NTA 2025 s.30(vi).
 *
 * Rule: 20% of annual rent paid, subject to a MAXIMUM OF ₦500,000.
 * The cap is a hard naira ceiling — NOT a percentage of income.
 *
 * This replaces the CRA under the old PITA.
 *
 * @param annualRentPaid  Total rent paid in the year
 */

export function rentRelief(annualRentPaid: number): number {
    if (annualRentPaid <= 0) return 0;
    const raw = annualRentPaid * RENT_RELIEF_RATE;
    return naira(Math.min(raw, RENT_RELIEF_NAIRA_CAP)); 
}

/**
 * Life insurance / annuity premium relief (NTA 2025 s.30).
 *
 * Premiums paid on life assurance or annuity contracts for self or spouse
 * are deductible. The NTA does not specify a percentage cap but we apply
 * 10% of gross income as a conservative ceiling pending FIRS guidance.
 *
 * @param premiumPaid  Annual life insurance premium
 * @param grossIncome  Total assessable income
 */
export function insuranceRelief(premiumPaid: number, grossIncome: number): number {
    if (premiumPaid <= 0 || grossIncome <= 0) return 0;
    const cap = grossIncome * INSURANCE_RELIEF_INCOME_CAP;
    return naira(Math.min(premiumPaid, cap));
}
/**
 * National Housing Fund (NHF) contribution relief.
 * 2.5% of monthly basic salary — deductible under NTA 2025.
 * Must be claimed in writing with documentation (NTA 2025 s.31).
 *
 * @param nhfContributed  Actual NHF amount deducted/contributed in the year
 */
export function nhfRelief(nhfContributed: number): number {
    return naira(Math.max(0, nhfContributed));
}

/**
 * National Health Insurance Scheme (NHIS) employee contribution relief.
 * Typically 5% of monthly basic salary — deductible under NTA 2025.
 *
 * @param nhisContributed  Actual NHIS amount deducted in the year
 */

export function nhisRelief(nhisContributed: number): number {
    return naira(Math.max(0, nhisContributed));
}

// ── Aggregated relief ─────────────────────────────────────────────────────────
 
/**
 * Compute all NTA 2025 reliefs in one call.
 *
 * @param deductions              User-supplied deduction figures
 * @param annualEmploymentSalary  Employment income (for pension auto-calc)
 * @param grossIncome             Total income (for insurance cap)
 */

export function computeReliefs(
    deductions: DeductionInput,
    annualEmploymentSalary: number,
    grossIncome: number,
    isSelfEmployed: boolean = false,
): ReliefBreakdown {
// Pension auto-calc only applies to PAYE employment income.
  // Self-employed taxpayers must explicitly claim pension contributions.

  const pensionBase = isSelfEmployed ? 0 : annualEmploymentSalary;  
  const pension = pensionRelief(pensionBase, deductions.pensionContribution);
    const rent = rentRelief(deductions.annualRentPaid ?? 0);
    const insurance = insuranceRelief(deductions.lifeInsurancePremium ?? 0, grossIncome);
    const nhf = nhfRelief(deductions.nhfContribution ?? 0);
    const nhis = nhisRelief(deductions.nhisContribution ?? 0);
    return { pension, rent, insurance, nhf, nhis, total: pension + rent + insurance + nhf + nhis };
}

// ── Utility ───────────────────────────────────────────────────────────────────

/** Round a number to the nearest naira (integer). */
function naira(amount: number): number {
    return Math.round(amount);
}