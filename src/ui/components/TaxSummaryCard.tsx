import { cva } from "class-variance-authority";
import type { TaxResult } from "../../tax-engine/types";
import { DataRow } from "./DataRow";
import { BracketBar } from "./BracketBar";
import { BracketTable } from "./BracketTable";
import { ReliefBreakdown } from "./ReliefBreakdown";
import { TaxYearBadge, MinWageBadge } from "./Badge";
import { ZeroTaxBanner } from "./Banner";
import { SkeletonSummaryCard } from "../Skeleton";

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const pct = (r: number) => `${(r * 100).toFixed(1)}%`;

export type SummaryCardMode = "full" | "compact";

export interface TaxSummaryCardProps {
  result: TaxResult;
  taxpayerName?: string;
  stateOfRes?: string;
  mode?: SummaryCardMode;
  loading?: boolean;
  className?: string;
}

// CVA

const cardVariants = cva("overflow-hidden rounded-xl border bg-background");

const headerVariants = cva("flex items-start gap-3 bg-brand text-white", {
  variants: {
    compact: {
      true: "px-4 py-3",
      false: "px-5 py-4",
    },
  },
});

const bodyVariants = cva("", {
  variants: {
    compact: {
      true: "p-4",
      false: "p-5",
    },
  },
});

const statCardVariants = cva(
  "rounded-lg border p-3 text-center transition-colors",
  {
    variants: {
      featured: {
        true: "border-brand/20 bg-brand/5",
        false: "border-border bg-muted/30",
      },
    },
  },
);

export function TaxSummaryCard({
  result,
  taxpayerName = "Taxpayer",
  stateOfRes = "Lagos",
  mode = "full",
  loading = false,
  className,
}: TaxSummaryCardProps) {
  if (loading) return <SkeletonSummaryCard />;

  const isCompact = mode === "compact";
  const isZeroTax = result.annualTax === 0;

  return (
    <div className={cardVariants({ className })}>
      {/* Header */}
      <div className={headerVariants({ compact: isCompact })}>
        <div className="min-w-0 flex-1">
          <h3
            className={
              isCompact ? "font-display text-base" : "font-display text-lg"
            }
          >
            {taxpayerName}
          </h3>

          <p className="mt-1 text-xs text-white/70">
            {stateOfRes} State IRS · NTA 2025 · {result.taxYear} tax year
          </p>
        </div>

        <TaxYearBadge
          year={result.taxYear}
          className="border-white/25 bg-white/15 text-white"
        />
      </div>

      {/* Status banners */}
      {isZeroTax && <ZeroTaxBanner />}

      {result.minimumWageExempt && !isZeroTax && (
        <div className="border-b px-5 py-3">
          <MinWageBadge />
        </div>
      )}

      {/* Body */}
      <div className={bodyVariants({ compact: isCompact })}>
        {/* Income */}

        <DataRow variant="separator" label="Income" />

        <DataRow
          label="Annual employment salary"
          value={fmt(result.annualSalary)}
          icon="ti ti-briefcase"
        />

        {result.otherIncome > 0 && (
          <DataRow
            label="Other income"
            value={fmt(result.otherIncome)}
            icon="ti ti-currency-naira"
          />
        )}

        <DataRow
          label="Gross income"
          value={fmt(result.grossIncome)}
          variant="total"
        />

        {/* Reliefs */}

        {result.reliefs.total > 0 && (
          <>
            <DataRow
              variant="separator"
              label="Reliefs & deductions"
              className="mt-2"
            />

            {isCompact ? (
              <DataRow
                label="Total reliefs applied"
                value={fmt(result.reliefs.total)}
                variant="deduction"
                prefix="−"
              />
            ) : (
              <ReliefBreakdown reliefs={result.reliefs} compact={false} />
            )}
          </>
        )}

        {/* Chargeable income */}

        <DataRow variant="separator" className="mt-2" label />

        <DataRow
          label="Chargeable income"
          labelHint="Gross income − total reliefs"
          value={fmt(result.chargeableIncome)}
          variant="highlight"
          icon="ti ti-calculator"
        />

        {/* Bracket Breakdown */}

        {!isCompact && result.bracketResults.length > 0 && (
          <>
            <DataRow
              variant="separator"
              label="Tax calculation"
              className="mt-5"
            />

            <BracketBar
              bracketResults={result.bracketResults}
              chargeableIncome={result.chargeableIncome}
              height={28}
              showLegend={false}
            />

            <BracketTable
              bracketResults={result.bracketResults}
              chargeableIncome={result.chargeableIncome}
            />
          </>
        )}

        {/* Tax Liability */}

        <DataRow variant="separator" label="Tax liability" className="mt-5" />

        <div
          className={
            isCompact
              ? "mt-3 grid grid-cols-2 gap-3"
              : "mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3"
          }
        >
          <div className={statCardVariants({ featured: true })}>
            <p className="font-display text-xl text-brand">
              {fmt(result.annualTax)}
            </p>

            <p className="mt-1 text-xs font-semibold text-brand">Annual tax</p>

            <p className="text-xs text-muted-foreground">
              {result.taxYear} tax year
            </p>
          </div>

          <div className={statCardVariants()}>
            <p className="font-display text-lg">{fmt(result.monthlyTax)}</p>

            <p className="mt-1 text-xs font-semibold">Monthly (PAYE)</p>

            <p className="text-xs text-muted-foreground">Approx. deduction</p>
          </div>

          {!isCompact && (
            <div className={statCardVariants()}>
              <p className="font-display text-lg">
                {pct(result.effectiveRate)}
              </p>

              <p className="mt-1 text-xs font-semibold">Effective rate</p>

              <p className="text-xs text-muted-foreground">Of gross income</p>
            </div>
          )}
        </div>

        {/* Disclaimer */}

        <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
          Computed under the <strong>Nigeria Tax Act 2025</strong>. This is an
          estimate — verify with your state IRS.
        </p>
      </div>
    </div>
  );
}
