/**
 * brackets.ts - Nigeria Tax Act 2025, Fourth Schedule,
 * -------------------------------------------------------------------
 * Single source of truth for all personal income tax rates and statuatory
 * constants under the Nigeria Tax Act 2025 (NTA 2025).
 * 
 * Effective date: 1 January 2026 (signed 26 June 2025 by President Bola Ahmed Tinubu)
 * 
 * Key structural changes from the old PITA:
 *  - #800,000 is now a formal 0% band (not just a 'threshold deduction')
 *  - Consolidated Relief Allowance (CRA) abolished -- replaced by a rent relief.
 *  - Top rate raised from 24% -> 25%
 *  - Minimum tax (1% of gross) ABOLISHED under NTA 2025
 *  - Progressive bands completely restructured with far wider brackets.
 * 
 * References:
 * Nigeria Tax Act 2025, Fourth Schedule — Personal Income Tax Rate Table
 *   https://irs.gm.gov.ng/docs/national/NIGERIA_TAX_ACT_2025.pdf
 *   KPMG Nigeria NTA 2025 Advisory, June 2025
 *   Adeola Oyinlade & Co — PIT analysis, December 2025
 * --------------------------------------------------------------------
 */

/**The tax legislation this engine implements */
export const TAX_ACT = 'Nigeria Tax Act 2025' as const;

/** The tax year from which NTA 2025 is effective */
export const TAX_YEAR = 2026;

// ── Fourth Schedule: Progressive Rate Table ───────────────────────────────────
//
//  Annual income band         Marginal rate
//  ─────────────────────────  ─────────────
//  ₦0          – ₦800,000       0%   (full exemption band)
//  ₦800,001    – ₦3,000,000    15%   (band width: ₦2,200,000)
//  ₦3,000,001  – ₦12,000,000  18%   (band width: ₦9,000,000)
//  ₦12,000,001 – ₦25,000,000  21%   (band width: ₦13,000,000)
//  ₦25,000,001 – ₦50,000,000  23%   (band width: ₦25,000,000)
//  Above        ₦50,000,000   25%
//
// Source: confirmed against worked example in NTA 2025 legal commentary:
//   "if an individual earns ₦60,000,000: first ₦800k tax-free, next ₦2.2m @ 15%
//    (₦330,000), following ₦9m @ 18% (₦1,620,000), next ₦13m @ 21% (₦2,730,000),
//    next ₦25m @ 23% (₦5,750,000), remaining ₦10m @ 25% (₦2,500,000) = ₦12,930,000"
// ─────────────────────────────────────────────────────────────────────────────

/** Lower bound of each bracket (annual income) */
export const BRACKET_LOWER_BOUNDS = [
  0,
  800_000,
  3_000_000,
  12_000_000,
  25_000_000,
  50_000_000
] as const;

/**
 * Progressive tax brackets under the NTA 2025 fourth schedule,
 * 
 * Each entry:
 * from -- lower bound of this band (inclusive, ₦)
 *  width -- band width in ₦ (Infinity = unbounded top band)
 *  rate -- marginal rate applied to income within this band.
 */
export const TAX_BRACKETS = [
  { from: 0,          width: 800_000,    rate: 0.00 },
  { from: 800_000,    width: 2_200_000, rate: 0.15 },    
    { from: 3_000_000,  width: 9_000_000, rate: 0.18 },
    { from: 12_000_000, width: 13_000_000, rate: 0.21 },
    { from: 25_000_000, width: 25_000_000, rate: 0.23 },
    { from: 50_000_000, width: Infinity,   rate: 0.25 }
] as const;

export type TaxBracket = (typeof TAX_BRACKETS)[number];

// ── Tax-free threshold ─  ────────────────────────────────────────────────────────

/**
 * Annual income at or below which NO income tax is owed (NTA 2025 s.58 + Fourth Schedule).
 * Income at exactly this level falls entirely in the 0% band.
 */
export const ZERO_RATE_THRESHOLD = 800_000;

// ── Minimum tax — ABOLISHED ───────────────────────────────────────────────────
 
/**
 * Under old PITA, a minimum tax of 1% of gross income applied when computed
 * tax was lower than 1% of gross.
 *
 * The NTA 2025 ABOLISHES this minimum tax rule for individuals.
 * If your chargeable income after reliefs produces zero or near-zero tax,
 * you simply owe zero tax.
 */
export const MINIMUM_TAX_ABOLISHED = true; 

// ── Reliefs under NTA 2025 ────────────────────────────────────────────────────
 
/**
 * Consolidated Relief Allowance (CRA) — ABOLISHED under NTA 2025.
 * The CRA (₦200k + 1% of gross or 20% of gross) no longer applies.
 * It is replaced by the specific reliefs below.
 */
export const CRA_ABOLISHED = true;

/**
 * Rent relief: 20% of annual rent paid, capped at ₦500,000.
 * NTA 2025 s.30(vi).
 * The cap is a hard naira ceiling — NOT income-percentage-based.
 */
export const RENT_RELIEF_RATE = 0.20;
export const RENT_RELIEF_NAIRA_CAP = 500_000; // hard ₦500,000 ceiling.

/**
 * Pension employee contribution rate (minimum, Pension Reform Act 2014 s.11).
 * Employee must contribute at least 8% of monthly emolument.
 * Contributions are deductible from income before tax.
 * Voluntary contributions above minimum remain deductible — no statutory cap.
 */
export const PENSION_EMPLOYEE_MIN_RATE = 0.08; 

/**
 * Life insurance / annuity relief — NTA 2025 s.30.
 * Premiums paid on life insurance or annuity contracts (for self or spouse)
 * are deductible. No specific percentage cap stated — deductible in full
 * subject to proof (NTA 2025 s.31-32 — must be claimed in writing with docs).
 *
 * We apply a reasonable 10% of gross income cap consistent with pre-NTA
 * practice and FIRS administrative guidance, pending further circulars.
 */
export const INSURANCE_RELIEF_INCOME_CAP = 0.10; 

/**
 * National Housing Fund (NHF) contribution — deductible.
 * 2.5% of monthly basic salary. Deductible but must be claimed in writing.
 */
export const NHF_RATE = 0.025;

/**
 * National Health Insurance Scheme (NHIS) contribution — deductible.
 * Standard employee share is 5% of monthly basic salary.
 * Deductible but must be claimed in writing with documentation.
 */
export const NHIS_RATE = 0.05


// ── Penalty constants (NTA 2025 / NTAA 2025) ─────────────────────────────────
 
/** Minimum fixed penalty for late filing (₦). NTAA 2025. */
export const LATE_FILING_PENALTY_FIXED = 500_000;

/** Percentage of tax owed added as additional late penalty. */
export const LATE_FILING_PENALTY_RATE = 0.10;

/** Annual interest rate applied to unpaid tax (CBN benchmark-linked). */
export const LATE_PAYMENT_INTEREST_RATE = 0.15

// ── PAYE / Filing calendar ────────────────────────────────────────────────────
 
/** Month (1-indexed) by which annual returns must be filed. */
export const FILING_DEADLINE_MONTH = 3  // March

/** Day of month for filing deadline. */
export const FILING_DEADLINE_DAY = 31

/**
 * Minimum wage exemption: employees earning at or below the national
 * minimum wage (₦70,000/month = ₦840,000/year effective May 2024) are
 * exempt from PAYE deductions. The NTA 2025 retains this.
 * Note: ₦840,000 > ₦800,000 zero-rate threshold, so minimum wage earners
 * pay zero tax under both rules.
 */
export const MINIMUM_WAGE_MONTHLY = 70_000;
export const MINIMUM_WAGE_ANNUAL = MINIMUM_WAGE_MONTHLY * 12; // ₦840,000/year effective May 2024.