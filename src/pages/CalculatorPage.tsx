import { useMemo, useState } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

import { computeTax } from "../tax-engine/compute";
import { MoneyInput } from "../ui/form-components/MoneyInput";
import { SelectInput } from "../ui/form-components/SelectInput";
import { Divider } from "../ui/Divider";
import { StatCard } from "../ui/components/StatCard";
import { BracketBar } from "../ui/components/BracketBar";
import { BracketTable } from "../ui/components/BracketTable";
import { EffectiveRateGauge } from "../ui/components/EffectiveRateGauge";
import { ReliefBreakdown } from "../ui/components/ReliefBreakdown";
import { DataRow } from "../ui/components/DataRow";
import { EmptyState } from "../ui/EmptyState";
import { TaxYearBadge } from "../ui/components/Badge";
import { ZeroTaxBanner } from "../ui/components/Banner";
import { Button } from "../ui/Button";
import type { Language } from "../state/store";

// CVA
const pageWrapper = cva(
  "mx-auto max-w-7xl min-h-screen px-4 py-8 md:px-6 lg:px-8",
);

const header = cva(
  "mb-8 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between",
);

const title = cva("font-display text-3xl md:text-4xl text-text-primary");

const description = cva(
  "max-w-2xl text-sm md:text-base text-text-muted leading-relaxed",
);

const layoutGrid = cva(
  "grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr] xl:grid-cols-[420px_1fr]",
);

const sidebar = cva(
  "flex flex-col gap-5 rounded-2xl border bg-card p-5 shadow-sm lg:sticky lg:top-24",
);

const sectionCard = cva("rounded-2xl border bg-card p-5 shadow-sm");

const statGrid = cva("grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3");

const resultsColumn = cva("flex flex-col gap-5");

const emptyStateCard = cva(
  "flex min-h-[320px] items-center justify-center rounded-2xl border bg-card",
);

const ctaCard = cva(
  "rounded-2xl border border-green-200 bg-green-50 p-6 text-center",
);

// Helpers

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

const pct = (r: number) => `${(r * 100).toFixed(1)}%`;

const EMPLOYMENT_ITEMS = [
  { value: "employed", label: "Employed (PAYE)" },
  { value: "self-employed", label: "Self-employed" },
  { value: "both", label: "Employed + Side Income" },
];

export interface CalculatorPageProps {
  lang: Language;
  onStartFiling: () => void;
}

// Component
export function CalculatorPage({ lang, onStartFiling }: CalculatorPageProps) {
  const isPg = lang === "pidgin";

  const [empType, setEmpType] = useState("employed");
  const [salary, setSalary] = useState<number>();
  const [selfIncome, setSelfIncome] = useState<number>();
  const [otherInc, setOtherInc] = useState<number>();
  const [pension, setPension] = useState<number>();
  const [rent, setRent] = useState<number>();
  const [insurance, setInsurance] = useState<number>();

  const hasIncome = Boolean(salary || selfIncome);

  const result = useMemo(() => {
    if (!hasIncome) return null;

    return computeTax({
      income: {
        employmentType: empType as "employed" | "self-employed" | "both",
        monthlySalary: empType !== "self-employed" ? salary : undefined,
        annualSelfIncome: empType !== "employed" ? selfIncome : undefined,
        otherAnnualIncome: otherInc,
      },
      deductions: {
        pensionContribution: pension,
        annualRentPaid: rent,
        lifeInsurancePremium: insurance,
      },
    });
  }, [
    empType,
    salary,
    selfIncome,
    otherInc,
    pension,
    rent,
    insurance,
    hasIncome,
  ]);

  const reset = () => {
    setSelfIncome(undefined);
    setOtherInc(undefined);
    setPension(undefined);
    setRent(undefined);
    setInsurance(undefined);
  };

  return (
    <div className={pageWrapper()}>
      {/* Header */}

      <div className={header()}>
        <div>
          <TaxYearBadge />

          <h1 className={title()}>Tax Calculator</h1>

          <p className={description()}>
            {isPg
              ? "Enter your income make you see your tax immediately."
              : "Enter your income to see your NTA 2025 liability instantly."}
          </p>
        </div>

        {hasIncome && (
          <Button variant="ghost" size="sm" onClick={reset}>
            Reset
          </Button>
        )}
      </div>

      {/* Main Layout */}
      <div className={layoutGrid()}>
        {/* Sidebar */}

        <div className={sidebar()}>
          <SelectInput
            label="Employment Type"
            value={empType}
            onChange={setEmpType}
            items={EMPLOYMENT_ITEMS}
          />

          {empType !== "self-employed" && (
            <MoneyInput
              label="Monthly Salary"
              value={salary}
              onChange={setSalary}
              showAnnual
            />
          )}
          {empType !== "employed" && (
            <MoneyInput
              label="Annual Self Income"
              value={selfIncome}
              onChange={setSelfIncome}
            />
          )}

          <MoneyInput
            label="Other Income"
            value={otherInc}
            onChange={setOtherInc}
          />

          <Divider label="Reliefs & Deductions" />
          <MoneyInput label="Pension" value={pension} onChange={setPension} />

          <MoneyInput label="Annual Rent" value={rent} onChange={setRent} />

          <MoneyInput
            label="Life Insurance"
            value={insurance}
            onChange={setInsurance}
          />
        </div>

        {/* Result */}

        <div className={resultsColumn()}>
          {!result && (
            <div className={emptyStateCard()}>
              <EmptyState
                icon="ti ti-calculator"
                title="Enter your income"
                description="Your tax breakdown will appear here."
              />
            </div>
          )}
          {result && (
            <>
              {result.annualTax === 0 && <ZeroTaxBanner />}
              <div className={statGrid()}>
                <StatCard label="Annual Tax" value={fmt(result.annualTax)} />
                <StatCard label="Monthly PAYE" value={fmt(result.monthlyTax)} />

                <StatCard
                  label="Effective Rate"
                  value={pct(result.effectiveRate)}
                />
              </div>
              <div className={sectionCard()}>
                <DataRow label="Gross Income" value={fmt(result.grossIncome)} />

                <DataRow
                  label="Chargeable Income"
                  value={fmt(result.chargeableIncome)}
                  variant="highlight"
                />
              </div>
              {result.reliefs.total > 0 && (
                <div className={sectionCard()}>
                  <ReliefBreakdown reliefs={result.reliefs} />
                </div>
              )}

              <div className={sectionCard()}>
                <BracketBar
                  bracketResults={result.bracketResults}
                  chargeableIncome={result.chargeableIncome}
                  showLegend
                />
              </div>

              <div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <BracketTable
                    bracketResults={result.bracketResults}
                    chargeableIncome={result.chargeableIncome}
                  />
                </div>
              </div>

              <div className={cn(sectionCard(), "flex justify-center")}>
                <EffectiveRateGauge
                  effectiveRate={result.effectiveRate}
                  annualTax={result.annualTax}
                  chargeableIncome={result.chargeableIncome}
                  size={200}
                />
              </div>

              <div className={ctaCard()}>
                <h3 className="mb-2 text-lg font-semibold">File Officially</h3>

                <p className="mb-4 text-sm text-text-muted">
                  Generate your government-ready PDF return.
                </p>

                <Button variant="primary" onClick={onStartFiling}>
                  File My Return
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
