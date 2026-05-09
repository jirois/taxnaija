/**
 * compute.test.ts — TaxNaija NTA 2025 engine test suite
 *
 * Test strategy:
 *   1. Bracket boundary tests — verify each band transition exactly
 *   2. Worked examples from NTA 2025 legal commentary (source-verified)
 *   3. Relief calculation tests — caps, auto-calc, combinations
 *   4. Edge cases — zero income, minimum wage, high earner
 *   5. Penalty tests — late filing and interest
 *   6. Deadline tests — days remaining, overdue detection
 */

import { describe, it, expect } from 'vitest'
import { computeTax, applyBrackets, computePenalty, getDeadlineInfo } from './compute.js'
import { pensionRelief, rentRelief, insuranceRelief, nhfRelief, nhisRelief } from './reliefs.js'
import type { TaxInput } from './types.js'

// ── Helper ────────────────────────────────────────────────────────────────────

/** Build a minimal TaxInput for an employed taxpayer with no deductions. */
function employed(monthlySalary: number, deductions: TaxInput['deductions'] = {}): TaxInput {
  return {
    income: { employmentType: 'employed', monthlySalary },
    deductions,
  }
}

function selfEmployed(annualIncome: number, deductions: TaxInput['deductions'] = {}): TaxInput {
  return {
    income: { employmentType: 'self-employed', annualSelfIncome: annualIncome },
    deductions,
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. ZERO-RATE BAND — income ≤ ₦800,000
// ─────────────────────────────────────────────────────────────────────────────

describe('Zero-rate band (₦0 – ₦800,000)', () => {
  it('pays zero tax when gross income is exactly ₦800,000', () => {
    // ₦66,667/month × 12 ≈ ₦800,000
    const r = computeTax(employed(66_667))
    expect(r.annualTax).toBe(0)
    expect(r.zeroRateBandApplied).toBe(true)
  })

  it('pays zero tax on ₦500,000 annual (well below threshold)', () => {
    const r = computeTax(employed(41_667))
    expect(r.annualTax).toBe(0)
  })

  it('pays zero tax on ₦0 income', () => {
    const r = computeTax(employed(0))
    expect(r.annualTax).toBe(0)
    expect(r.grossIncome).toBe(0)
  })

  it('flags minimum wage exemption for gross ≤ ₦840,000', () => {
    const r = computeTax(employed(70_000)) // ₦840,000/year = min wage
    expect(r.minimumWageExempt).toBe(true)
    expect(r.annualTax).toBe(0)
  })

  it('correctly annualises monthly salary × 12', () => {
    const r = computeTax(employed(100_000))
    expect(r.annualSalary).toBe(1_200_000)
    expect(r.grossIncome).toBe(1_200_000)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 2. BRACKET TRANSITIONS — tested at exact boundary values
// ─────────────────────────────────────────────────────────────────────────────

describe('NTA 2025 bracket transitions', () => {
  // NOTE: These tests use selfEmployed() so no pension auto-deduction is applied.
  // Pension only auto-calculates for 'employed' type. Self-employed have no mandatory
  // pension deduction unless explicitly specified. This lets us test brackets cleanly.

  it('Band 2 (15%): ₦1,200,000 chargeable → 0% on ₦800k + 15% on ₦400k = ₦60,000', () => {
    // Use selfEmployed with no deductions so chargeableIncome = grossIncome
    const r = computeTax(selfEmployed(1_200_000))
    expect(r.chargeableIncome).toBe(1_200_000)
    expect(r.annualTax).toBe(60_000)
  })

  it('Band 2 top: ₦3,000,000 chargeable → 0% on ₦800k + 15% on ₦2.2m = ₦330,000', () => {
    // Confirmed in NTA 2025 legal commentary source
    const r = computeTax(selfEmployed(3_000_000))
    expect(r.grossIncome).toBe(3_000_000)
    expect(r.chargeableIncome).toBe(3_000_000)
    expect(r.annualTax).toBe(330_000)
  })

  it('Band 3 (18%): ₦6,000,000 chargeable → ₦330k + 18% on ₦3m = ₦870,000', () => {
    // 0% on ₦800k = ₦0, 15% on ₦2.2m = ₦330k, 18% on ₦3m = ₦540k
    // Total = ₦870,000 — confirmed in NTA 2025 commentary source
    const r = computeTax(selfEmployed(6_000_000))
    expect(r.annualTax).toBe(870_000)
  })

  it('Band 4 (21%): ₦15,000,000 chargeable → correct calculation', () => {
    // 0% on ₦800k   = ₦0
    // 15% on ₦2.2m  = ₦330,000
    // 18% on ₦9m    = ₦1,620,000
    // 21% on ₦3m    = ₦630,000
    // Total          = ₦2,580,000
    const r = computeTax(selfEmployed(15_000_000))
    expect(r.annualTax).toBe(2_580_000)
  })

  it('Band 5 (23%): ₦30,000,000 chargeable', () => {
    // 0% on ₦800k   = ₦0
    // 15% on ₦2.2m  = ₦330,000
    // 18% on ₦9m    = ₦1,620,000
    // 21% on ₦13m   = ₦2,730,000
    // 23% on ₦5m    = ₦1,150,000
    // Total          = ₦5,830,000
    const r = computeTax(selfEmployed(30_000_000))
    expect(r.annualTax).toBe(5_830_000)
  })

  it('Top band (25%): ₦60,000,000 chargeable = ₦12,930,000 — NTA 2025 official worked example', () => {
    // Exact worked example from NTA 2025 legal commentary (Adeola Oyinlade & Co, Dec 2025):
    // First ₦800k:  ₦0
    // 15% on ₦2.2m: ₦330,000
    // 18% on ₦9m:   ₦1,620,000
    // 21% on ₦13m:  ₦2,730,000
    // 23% on ₦25m:  ₦5,750,000
    // 25% on ₦10m:  ₦2,500,000
    // Total:         ₦12,930,000
    const r = computeTax(selfEmployed(60_000_000))
    expect(r.grossIncome).toBe(60_000_000)
    expect(r.annualTax).toBe(12_930_000)
  })

  it('employed ₦1.2m/year: auto-pension (8%) deducted before brackets', () => {
    // gross ₦1.2m, pension = 8% × ₦1.2m = ₦96,000
    // chargeableIncome = ₦1,200,000 − ₦96,000 = ₦1,104,000
    // Tax: 0% on ₦800k = ₦0, 15% on ₦304,000 = ₦45,600
    const r = computeTax(employed(100_000)) // ₦1.2m/year
    expect(r.reliefs.pension).toBe(96_000)
    expect(r.chargeableIncome).toBe(1_104_000)
    expect(r.annualTax).toBe(45_600)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 3. BRACKET ENGINE (applyBrackets)
// ─────────────────────────────────────────────────────────────────────────────

describe('applyBrackets()', () => {
  it('returns empty array for zero chargeable income', () => {
    expect(applyBrackets(0)).toEqual([])
  })

  it('returns only the 0% band for ₦500,000', () => {
    const results = applyBrackets(500_000)
    expect(results).toHaveLength(1)
    expect(results[0]?.rate).toBe(0)
    expect(results[0]?.taxCharged).toBe(0)
    expect(results[0]?.taxableAmount).toBe(500_000)
  })

  it('returns 0% + 15% bands for ₦1,500,000', () => {
    const results = applyBrackets(1_500_000)
    expect(results).toHaveLength(2)
    expect(results[0]?.rate).toBe(0)
    expect(results[0]?.taxableAmount).toBe(800_000)
    expect(results[1]?.rate).toBe(0.15)
    expect(results[1]?.taxableAmount).toBe(700_000)
    expect(results[1]?.taxCharged).toBe(105_000)
  })

  it('all 6 bands appear for ₦60,000,000', () => {
    const results = applyBrackets(60_000_000)
    expect(results).toHaveLength(6)
    expect(results.map(r => r.rate)).toEqual([0, 0.15, 0.18, 0.21, 0.23, 0.25])
  })

  it('top band has to: Infinity', () => {
    const results = applyBrackets(60_000_000)
    expect(results[5]?.to).toBe(Infinity)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 4. RENT RELIEF (NTA 2025 s.30(vi))
// ─────────────────────────────────────────────────────────────────────────────

describe('rentRelief()', () => {
  it('returns 20% of rent when below ₦500k cap', () => {
    // ₦1,000,000 × 20% = ₦200,000 (below cap)
    expect(rentRelief(1_000_000)).toBe(200_000)
  })

  it('caps at ₦500,000 regardless of rent amount', () => {
    // ₦3,000,000 × 20% = ₦600,000 → capped at ₦500,000
    expect(rentRelief(3_000_000)).toBe(500_000)
    expect(rentRelief(10_000_000)).toBe(500_000)
  })

  it('₦2,500,000 rent × 20% = ₦500,000 exactly at cap', () => {
    expect(rentRelief(2_500_000)).toBe(500_000)
  })

  it('₦2,499,999 rent × 20% = ₦499,999.80 → rounds to ₦500,000', () => {
    // 2,499,999 × 0.20 = 499,999.8 → rounds to 500,000
    expect(rentRelief(2_499_999)).toBe(500_000)
  })

  it('returns 0 for zero rent', () => {
    expect(rentRelief(0)).toBe(0)
  })

  it('returns 0 for negative input', () => {
    expect(rentRelief(-1000)).toBe(0)
  })

  it('rent relief reduces taxable income: employed ₦250k/month + ₦3m rent', () => {
    // gross ₦3m, pension auto 8% of ₦3m = ₦240k, rent relief = ₦500k (capped)
    // chargeableIncome = ₦3m - ₦240k - ₦500k = ₦2,260,000
    // Tax: 0% on ₦800k = 0, 15% on ₦1.46m = ₦219,000
    const r = computeTax(employed(250_000, { annualRentPaid: 3_000_000 }))
    expect(r.reliefs.rent).toBe(500_000)
    expect(r.chargeableIncome).toBe(2_260_000)
    expect(r.annualTax).toBe(219_000)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 5. PENSION RELIEF
// ─────────────────────────────────────────────────────────────────────────────

describe('pensionRelief()', () => {
  it('auto-calculates 8% of annual salary when not specified', () => {
    // ₦200k/month = ₦2.4m/year → pension = ₦192,000
    expect(pensionRelief(2_400_000)).toBe(192_000)
  })

  it('uses claimed amount when provided and valid', () => {
    expect(pensionRelief(2_400_000, 300_000)).toBe(300_000)
  })

  it('allows voluntary contributions above 8%', () => {
    // Employee contributing 15% voluntarily
    const voluntary = 2_400_000 * 0.15 // ₦360,000
    expect(pensionRelief(2_400_000, voluntary)).toBe(360_000)
  })

  it('returns 0 for negative claim', () => {
    expect(pensionRelief(2_400_000, -1000)).toBe(0)
  })

  it('returns 0 when salary is zero', () => {
    expect(pensionRelief(0)).toBe(0)
  })

  it('pension reduces chargeable income correctly', () => {
    // ₦200k/month, auto pension: 8% of ₦2.4m = ₦192k
    const r = computeTax(employed(200_000))
    expect(r.reliefs.pension).toBe(192_000)
    expect(r.chargeableIncome).toBe(2_400_000 - 192_000) // ₦2,208,000
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 6. INSURANCE RELIEF
// ─────────────────────────────────────────────────────────────────────────────

describe('insuranceRelief()', () => {
  it('deducts full premium when below 10% cap', () => {
    // 10% of ₦2.4m = ₦240,000 cap; premium ₦100k < cap
    expect(insuranceRelief(100_000, 2_400_000)).toBe(100_000)
  })

  it('caps at 10% of gross income', () => {
    // 10% of ₦2.4m = ₦240,000 cap; premium ₦300k → capped at ₦240k
    expect(insuranceRelief(300_000, 2_400_000)).toBe(240_000)
  })

  it('returns 0 for zero premium', () => {
    expect(insuranceRelief(0, 2_400_000)).toBe(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 7. NHF AND NHIS RELIEFS
// ─────────────────────────────────────────────────────────────────────────────

describe('NHF and NHIS reliefs', () => {
  it('nhfRelief passes through exact amount', () => {
    expect(nhfRelief(48_000)).toBe(48_000)
  })

  it('nhisRelief passes through exact amount', () => {
    expect(nhisRelief(120_000)).toBe(120_000)
  })

  it('both reliefs reduce chargeableIncome', () => {
    const r = computeTax(employed(200_000, {
      nhfContribution: 48_000,
      nhisContribution: 120_000,
    }))
    expect(r.reliefs.nhf).toBe(48_000)
    expect(r.reliefs.nhis).toBe(120_000)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 8. COMBINED RELIEFS
// ─────────────────────────────────────────────────────────────────────────────

describe('Combined reliefs', () => {
  it('stacks multiple reliefs correctly', () => {
    // ₦200k/month, ₦2.4m/year salary
    // Pension (auto 8%): ₦192,000
    // Rent (₦3m): capped at ₦500,000
    // Insurance (₦100k): ₦100,000
    // Total reliefs: ₦792,000
    const r = computeTax(employed(200_000, {
      annualRentPaid: 3_000_000,
      lifeInsurancePremium: 100_000,
    }))
    expect(r.reliefs.pension).toBe(192_000)
    expect(r.reliefs.rent).toBe(500_000)
    expect(r.reliefs.insurance).toBe(100_000)
    expect(r.reliefs.total).toBe(792_000)
    // Chargeable: ₦2,400,000 - ₦792,000 = ₦1,608,000
    expect(r.chargeableIncome).toBe(1_608_000)
    // Tax: 0% on ₦800k = 0; 15% on ₦808,000 = ₦121,200
    expect(r.annualTax).toBe(121_200)
  })

  it('reliefs cannot push chargeableIncome below zero', () => {
    const r = computeTax(employed(50_000, {
      pensionContribution: 2_000_000, // absurdly high claim
      annualRentPaid: 5_000_000,
    }))
    expect(r.chargeableIncome).toBeGreaterThanOrEqual(0)
    expect(r.annualTax).toBeGreaterThanOrEqual(0)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 9. SELF-EMPLOYED AND BOTH
// ─────────────────────────────────────────────────────────────────────────────

describe('Employment type variations', () => {
  it('self-employed: uses annualSelfIncome directly, no auto-pension', () => {
    // self-employed has no auto-pension, so chargeableIncome = grossIncome
    const r = computeTax({
      income: { employmentType: 'self-employed', annualSelfIncome: 6_000_000 },
      deductions: {},
    })
    expect(r.annualSalary).toBe(6_000_000)
    expect(r.chargeableIncome).toBe(6_000_000)
    expect(r.annualTax).toBe(870_000)
  })

  it('both: combines monthlySalary × 12 + annualSelfIncome', () => {
    const r = computeTax({
      income: {
        employmentType: 'both',
        monthlySalary: 200_000,
        annualSelfIncome: 1_200_000,
      },
      deductions: {},
    })
    // ₦2.4m salary + ₦1.2m self = ₦3.6m gross
    expect(r.grossIncome).toBe(3_600_000)
  })

  it('both: pension auto-calc uses only employment salary', () => {
    const r = computeTax({
      income: {
        employmentType: 'both',
        monthlySalary: 200_000,
        annualSelfIncome: 1_200_000,
      },
      deductions: {}, // pension auto-calc
    })
    // 8% of ₦2.4m employment salary = ₦192,000
    expect(r.reliefs.pension).toBe(192_000)
  })

  it('otherAnnualIncome adds to gross for all employment types', () => {
    const r = computeTax({
      income: {
        employmentType: 'employed',
        monthlySalary: 100_000,
        otherAnnualIncome: 600_000,
      },
      deductions: {},
    })
    expect(r.grossIncome).toBe(1_800_000)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 10. EFFECTIVE RATES
// ─────────────────────────────────────────────────────────────────────────────

describe('Effective rates', () => {
  it('effective rate is 0 for zero-band income', () => {
    const r = computeTax(employed(50_000)) // ₦600k/year
    expect(r.effectiveRate).toBe(0)
  })

  it('effective rate is less than marginal rate', () => {
    const r = computeTax(employed(500_000)) // ₦6m/year
    expect(r.effectiveRate).toBeLessThan(0.18)
  })

  it('effective rate on ₦60m (self-employed) is ~21.6%', () => {
    // ₦12,930,000 / ₦60,000,000 = 21.55% ≈ 21.6%
    const r = computeTax(selfEmployed(60_000_000))
    const pct = Math.round(r.effectiveRate * 1000) / 10
    expect(pct).toBeCloseTo(21.6, 0)
  })

  it('monthlyTax is annualTax / 12', () => {
    const r = computeTax(employed(250_000))
    expect(r.monthlyTax).toBe(Math.round(r.annualTax / 12))
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 11. PENALTY COMPUTATION
// ─────────────────────────────────────────────────────────────────────────────

describe('computePenalty()', () => {
  it('returns zeros for zero days overdue', () => {
    const p = computePenalty(1_000_000, 0)
    expect(p.totalPenalty).toBe(0)
  })

  it('fixed penalty is ₦50,000', () => {
    const p = computePenalty(500_000, 30)
    expect(p.fixedPenalty).toBe(50_000)
  })

  it('percentage penalty is 10% of tax owed', () => {
    const p = computePenalty(500_000, 30)
    expect(p.percentagePenalty).toBe(50_000)
  })

  it('interest accrues proportionally by days', () => {
    const p30  = computePenalty(1_000_000, 30)
    const p60  = computePenalty(1_000_000, 60)
    expect(p60.interestCharged).toBeCloseTo(p30.interestCharged * 2, 0)
  })

  it('totalPenalty = fixed + percentage + interest', () => {
    const p = computePenalty(1_000_000, 365)
    expect(p.totalPenalty).toBe(p.fixedPenalty + p.percentagePenalty + p.interestCharged)
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 12. DEADLINE INFO
// ─────────────────────────────────────────────────────────────────────────────

describe('getDeadlineInfo()', () => {
  it('is overdue when past March 31', () => {
    const pastDate = new Date('2027-05-01') // past March 31 2027
    const info = getDeadlineInfo(2026, undefined, pastDate)
    expect(info.isOverdue).toBe(true)
    expect(info.daysRemaining).toBeLessThan(0)
  })

  it('is not overdue before deadline', () => {
    const earlyDate = new Date('2026-12-01') // before March 31 2027
    const info = getDeadlineInfo(2026, undefined, earlyDate)
    expect(info.isOverdue).toBe(false)
    expect(info.daysRemaining).toBeGreaterThan(0)
  })

  it('deadline date is March 31 of taxYear+1', () => {
    const info = getDeadlineInfo(2026)
    expect(info.deadlineDate.getFullYear()).toBe(2027)
    expect(info.deadlineDate.getMonth()).toBe(2) // March = 2 (0-indexed)
    expect(info.deadlineDate.getDate()).toBe(31)
  })

  it('includes penalty when overdue and taxResult provided', () => {
    const pastDate  = new Date('2027-05-15')
    const mockResult = computeTax(employed(250_000))
    const info = getDeadlineInfo(2026, mockResult, pastDate)
    expect(info.penaltyIfFiledToday).not.toBeNull()
    expect(info.penaltyIfFiledToday!.fixedPenalty).toBe(50_000)
  })

  it('penaltyIfFiledToday is null when not overdue', () => {
    const earlyDate = new Date('2027-01-01')
    const mockResult = computeTax(employed(250_000))
    const info = getDeadlineInfo(2026, mockResult, earlyDate)
    expect(info.penaltyIfFiledToday).toBeNull()
  })
})

// ─────────────────────────────────────────────────────────────────────────────
// 13. RESULT METADATA
// ─────────────────────────────────────────────────────────────────────────────

describe('Result metadata', () => {
  it('taxAct is "Nigeria Tax Act 2025"', () => {
    const r = computeTax(employed(100_000))
    expect(r.taxAct).toBe('Nigeria Tax Act 2025')
  })

  it('taxYear defaults to 2026', () => {
    const r = computeTax(employed(100_000))
    expect(r.taxYear).toBe(2026)
  })

  it('custom taxYear is preserved', () => {
    const r = computeTax({ ...employed(100_000), taxYear: 2027 })
    expect(r.taxYear).toBe(2027)
  })
})