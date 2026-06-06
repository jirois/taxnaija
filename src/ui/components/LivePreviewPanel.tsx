import { useEffect, useRef, useState } from "react";
import { computeTax } from "../../tax-engine/compute";
import type { TaxInput, TaxResult } from "../../tax-engine/types";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { StatCard } from "./StatCard";
import { BracketBar } from "./BracketBar";
import { BracketTable } from "./BracketTable";
import { ReliefBreakdown } from "./ReliefBreakdown";
import { DataRow } from "./DataRow";
import { EmptyState } from "../EmptyState";
import { Divider } from "../Divider";
import { TaxYearBadge, ExemptBadge } from "./Badge";
import { ZeroTaxBanner } from "./Banner";
import { SkeletonStatCard, SkeletonSummaryCard } from "../Skeleton";

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

const pct = (r: number) => `${(r * 100).toFixed(1)}%`;

const livePreviewVariants = cva("flex h-full flex-col border-l bg-background");

const headerVariants = cva(
  "flex items-center justify-between border-b px-4 py-3",
);

const bodyVariants = cva("relative flex-1 overflow-y-auto p-4");

const statGridVariants = cva("grid grid-cols-2 gap-3");

const overlayVariants = cva(
  "absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm",
);

interface Props {
  input: Partial<TaxInput>;
  debounceMs?: number;
  className?: string;
}

export function LivePreviewPanel({
  input,
  debounceMs = 300,
  className,
}: Props) {
  const [result, setResult] = useState<TaxResult | null>(null);
  const [loading, setLoading] = useState(false);

  const timerRef =
    useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const previousResult = useRef<TaxResult | null>(null);

  const hasIncome = Boolean(
    input.income?.monthlySalary ||
    input.income?.annualSelfIncome ||
    input.income?.otherAnnualIncome,
  );

  useEffect(() => {
    if (!hasIncome) {
      // Defer state updates to avoid synchronous setState within effect
      clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setResult(null);
        setLoading(false);
      }, 0);
      return;
    }

    clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setLoading(true);
      try {
        const safeInput: TaxInput = {
          income: {
            employmentType: input.income?.employmentType ?? "employed",
            monthlySalary: input.income?.monthlySalary ?? 0,
            annualSelfIncome: input.income?.annualSelfIncome ?? 0,
            otherAnnualIncome: input.income?.otherAnnualIncome ?? 0,
          },
          deductions: {
            pensionContribution: input.deductions?.pensionContribution,
            annualRentPaid: input.deductions?.annualRentPaid ?? 0,
            lifeInsurancePremium: input.deductions?.lifeInsurancePremium ?? 0,
            nhfContribution: input.deductions?.nhfContribution ?? 0,
            nhisContribution: input.deductions?.nhisContribution ?? 0,
          },
          stateOfResidence: input.stateOfResidence,
          taxYear: input.taxYear,
        };
        const computed = computeTax(safeInput);

        previousResult.current = computed;

        setResult(computed);
      } catch {
        setResult(previousResult.current);
      } finally {
        setLoading(false);
      }
    }, debounceMs);

    return () => clearTimeout(timerRef.current);
  }, [input, hasIncome, debounceMs]);

  return (
    <div className={cn(livePreviewVariants(), className)}>
      {/* Header */}
      <div className={headerVariants()}>
        <div className="flex items-center gap-2">
          <i className="ti ti-calculator text-brand text-base" />

          <span className="text-sm font-semibold">Live Preview</span>
        </div>

        <div className="flex items-center gap-2">
          {loading && (
            <svg className="size-3 animate-spin" viewBox="0 0 16 16">
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                opacity=".25"
                fill="none"
              />
              <path
                d="M14 8a6 6 0 0 0-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          )}

          <TaxYearBadge year={result?.taxYear ?? 2026} />
        </div>
      </div>

      {/* Body */}

      <div className={bodyVariants()}>
        {!hasIncome && !loading && (
          <EmptyState
            icon="ti ti-calculator"
            title="Enter your income"
            description="Your real time NTA 2025 tax summary will appear here."
            size="sm"
          />
        )}
        {loading && !result && (
          <div className="flex flex-col gap-3">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonSummaryCard />
          </div>
        )}

        {result && !loading && (
          <div className="flex flex-col gap-4">
            {result.annualTax === 0 && <ZeroTaxBanner />}

            <div className={statGridVariants()}>
              <StatCard
                label="Annual tax"
                value={fmt(result.annualTax)}
                variant={result.annualTax === 0 ? "muted" : "primary"}
                icon="ti ti-receipt"
              />
              <StatCard
                label="Monthly PAYE"
                value={fmt(result.monthlyTax)}
                variant="default"
                icon="ti ti-calendar-month"
              />
            </div>
            <StatCard
              label="Effective rate"
              value={pct(result.effectiveRate)}
              unit="of gross income"
              variant="muted"
              icon="ti ti-percentage"
            />
            <Divider label="Income" />

            <div>
              <DataRow label="Gross income" value={fmt(result.grossIncome)} />

              {result.reliefs.total > 0 && (
                <DataRow
                  label="Total reliefs"
                  value={fmt(result.reliefs.total)}
                  prefix="_"
                  variant="deduction"
                />
              )}

              <DataRow
                label="Chargeable income"
                value={fmt(result.chargeableIncome)}
                variant="highlight"
              />
            </div>

            {result.reliefs.total > 0 && (
              <>
                <Divider label="Reliefs Applied" />

                <ReliefBreakdown reliefs={result.reliefs} compact />
              </>
            )}
            {result.zeroRateBandApplied && (
              <div className="flex justify-center">
                <ExemptBadge
                  label={`₦${Math.min(
                    result.chargeableIncome,
                    800000,
                  ).toLocaleString("en-NG")} in zero-rate band`}
                />
              </div>
            )}

            <Divider label="Tax Brackets" />

            <BracketBar
              bracketResults={result.bracketResults}
              chargeableIncome={result.chargeableIncome}
              height={24}
              showLegend
            />
            <BracketTable
              bracketResults={result.bracketResults}
              chargeableIncome={result.chargeableIncome}
              compact
            />
          </div>
        )}
        {loading && result && (
          <div className={overlayVariants()}>
            <svg
              className="size-6 animate-spin text-primary"
              viewBox="0 0 16 16"
            >
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="2"
                opacity=".25"
                fill="none"
              />
              <path
                d="M14 8a6 6 0 0 0-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
