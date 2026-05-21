/**
 * index.ts — public API of the TaxNaija NTA 2025 tax engine
 *
 * Import from here in application code:
 *   import { computeTax, getDeadlineInfo, TAX_BRACKETS } from '@/tax-engine'
 */

export {computeTax, applyBrackets, computePenalty, getDeadlineInfo} from './compute.ts'

export {
    pensionRelief,
    rentRelief,
    insuranceRelief,
    nhfRelief,
    nhisRelief,
    computeReliefs,
} from './reliefs.ts'

export {
    TAX_ACT,
    TAX_YEAR,
    TAX_BRACKETS,
    BRACKET_LOWER_BOUNDS,
    ZERO_RATE_THRESHOLD,
    MINIMUM_TAX_ABOLISHED,
    CRA_ABOLISHED,
    PENSION_EMPLOYEE_MIN_RATE,
    RENT_RELIEF_RATE,
    RENT_RELIEF_NAIRA_CAP,
    INSURANCE_RELIEF_INCOME_CAP,
    NHF_RATE,
    NHIS_RATE,
    LATE_FILING_PENALTY_FIXED,
    LATE_FILING_PENALTY_RATE,
    FILING_DEADLINE_MONTH,
    FILING_DEADLINE_DAY,
    MINIMUM_WAGE_MONTHLY,
    MINIMUM_WAGE_ANNUAL
} from './brackets.ts'

export type {
    EmploymentType,
    IncomeInput,
    DeductionInput,
    TaxInput,
    TaxResult,
    BracketResult,
    ReliefBreakdown,
    PenaltyResult,
    DeadlineInfo
} from './types.ts'