import type { ReliefBreakdown as ReliefBreakdownType } from "../../tax-engine/types";
import { TooltipChip } from "./TooltipChip";
import { cva } from "class-variance-authority";

const reliefBreakdownVariants = cva("flex flex-col");

const emptyStateVariants = cva("py-2 text-sm italic text-text-primary");

const reliefRowVariants = cva(
  "flex items-start justify-between gap-3 border-b border-border",
  {
    variants: {
      compact: {
        true: "py-1.5",
        false: "py-2.5",
      },
    },
    defaultVariants: {
      compact: false,
    },
  },
);

const iconWrapperVariants = cva(
  "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-brand/10",
);

const reliefLabelVariants = cva("", {
  variants: {
    compact: {
      true: "text-xs",
      false: "text-sm",
    },
  },
  defaultVariants: {
    compact: false,
  },
});

const reliefAmountVariants = cva("font-medium text-brand", {
  variants: {
    compact: {
      true: "text-sm",
      false: "text-base",
    },
  },
  defaultVariants: {
    compact: false,
  },
});

const totalRowVariants = cva("flex items-center justify-between pt-3");

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export interface ReliefBreakdownProps {
  reliefs: ReliefBreakdownType;
  showZero?: boolean;
  compact?: boolean;
  className?: string;
}

interface ReliefRow {
  key: keyof Omit<ReliefBreakdownType, "total">;
  label: string;
  icon: string;
  tip: string;
  cap?: string;
}

const RELIEF_ROWS: ReliefRow[] = [
  {
    key: "pension",
    label: "Pension contribution",
    icon: "ti ti-building-bank",
    tip: "Employee pension contribution deductible under PRA 2014 and NTA 2025",
  },
  {
    key: "rent",
    label: "Rent relief",
    icon: "ti ti-home",
    tip: "20% of annual rent paid, capped at ₦500,000.",
    cap: "₦500,000 cap",
  },
  {
    key: "insurance",
    label: "Life insurance premium",
    icon: "ti ti-shield-heart",
    tip: "Deductible up to 10% of gross income.",
    cap: "10% of gross income",
  },
  {
    key: "nhf",
    label: "NHF contribution",
    icon: "ti ti-home-2",
    tip: "National Housing Fund contribution.",
  },
  {
    key: "nhis",
    label: "NHIS contribution",
    icon: "ti ti-heart-rate-monitor",
    tip: "National Health Insurance contribution.",
  },
];

export function ReliefBreakdown({
  reliefs,
  showZero = false,
  compact = false,
  className,
}: ReliefBreakdownProps) {
  const visibleRows = RELIEF_ROWS.filter(
    (row) => showZero || reliefs[row.key] > 0,
  );

  if (visibleRows.length === 0) {
    return (
      <p className={emptyStateVariants()}>
        No reliegs claimed - add pension, rent or insurance amounts above.
      </p>
    );
  }

  return (
    <div className={`${reliefBreakdownVariants()} ${className ?? ""}`}>
      {visibleRows.map((row) => (
        <div
          key={row.key}
          className={reliefRowVariants({
            compact,
          })}
        >
          {/* Left */}
          <div className="flex min-w-0 flex-1 items-start gap-2">
            <div className={iconWrapperVariants()}>
              <i
                className={`${row.icon} text-brand text-sm`}
                aria-hidden="true"
              />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1 5">
                <span
                  className={reliefLabelVariants({
                    compact,
                  })}
                >
                  {row.label}
                </span>

                {!compact && (
                  <TooltipChip label="how it works">
                    {row.tip}

                    {row.cap && (
                      <span className="mt-1 block font-medium">
                        Cap: {row.cap}
                      </span>
                    )}
                  </TooltipChip>
                )}
              </div>

              {!compact && row.cap && (
                <p className="mt-0 5 text-xs text-text-body"></p>
              )}
            </div>
          </div>

          {/* Right */}
          <div className="shrink-0 text-right">
            <span
              className={reliefAmountVariants({
                compact,
              })}
            >
              - {fmt(reliefs[row.key])}
            </span>
          </div>
        </div>
      ))}
      {/* Total */}

      <div className={totalRowVariants()}>
        <span className="text-sm font-semibold text-text-body">
          Total reliefs
        </span>

        <span className="font-display text-lg text-brand">
          - {fmt(reliefs.total)}
        </span>
      </div>
    </div>
  );
}
