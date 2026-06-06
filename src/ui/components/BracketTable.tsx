import { cva } from "class-variance-authority";
import { ExemptBadge } from "./Badge";
import { TAX_BRACKETS } from "../../tax-engine/brackets";
import type { BracketResult } from "../../tax-engine/types";
import { cn } from "../../lib/cn";

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
const fmtPct = (r: number) => `${(r * 100).toFixed(0)}%`;

const fmtRange = (from: number, width: number) => {
  if (width === Infinity) {
    return `Above ${fmt(from)}`;
  }

  return `${fmt(from)} - ${fmt(from + width)}`;
};

export interface BracketTableProps {
  bracketResults: BracketResult[];
  chargeableIncome: number;
  compact?: boolean;
  className?: string;
}

// CVA

const tableCell = cva("border-b border-border whitespace-nowrap", {
  variants: {
    compact: {
      true: "px-2.5 py-1.5 text-xs",
      false: "px-3.5 py-2.5 text-sm",
    },
  },
  defaultVariants: {
    compact: false,
  },
});

const headerCell = cva(
  "uppercase tracking-[0.06em] text-text-muted font-semibold bg-bg-surface border-b border-border-strong whitespace-nowrap",
  {
    variants: {
      compact: {
        true: "px-2.5 py-1.5 text-xs",
        false: "px-3.5 py-2.5 text-xs",
      },
    },
  },
);

const rowVariants = cva("", {
  variants: {
    state: {
      active: "bg-brand-light opacity-100",
      exempt: "bg-bg-surface opacity-100",
      inactive: "bg-transparent opacity-40",
    },
  },
});

// Companent

export function BracketTable({
  bracketResults,
  chargeableIncome,
  compact = false,
  className,
}: BracketTableProps) {
  const resultByRate = new Map<number, BracketResult>();
  bracketResults.forEach((r) => resultByRate.set(r.rate, r));

  const totalTax = bracketResults.reduce((sum, r) => sum + r.taxCharged, 0);

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      <table className="w-full border-collapse font-body">
        <thead>
          <tr>
            {columns(compact).map((col) => (
              <th
                key={col.key}
                className={cn(
                  headerCell({ compact }),
                  col.align === "right" ? "text-right" : "text-left",
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TAX_BRACKETS.map((bracket, idx) => {
            const result = resultByRate.get(bracket.rate);

            const hasIncome = !!result && result.taxableAmount > 0;

            const isZero = bracket.rate === 0;

            const isLast = idx === TAX_BRACKETS.length - 1;

            const rowState = hasIncome
              ? isZero
                ? "exempt"
                : "active"
              : chargeableIncome > 0
                ? "inactive"
                : undefined;

            return (
              <tr
                key={bracket.rate}
                className={rowVariants({
                  state: rowState,
                })}
              >
                {/* Band */}

                <td
                  className={cn(
                    tableCell({
                      compact,
                    }),
                    isLast && "border-b-0",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "flex h-4.5 w-4.5 items-center justify-center rounded-full text-[10px] font-semibold",
                        hasIncome
                          ? isZero
                            ? "bg-border-strong text-text-muted"
                            : "bg-brand text-white"
                          : "bg-border text-text-muted",
                      )}
                    >
                      {idx + 1}
                    </span>

                    {isZero && hasIncome && <ExemptBadge />}
                  </div>
                </td>

                {!compact && (
                  <td
                    className={cn(
                      tableCell({
                        compact,
                      }),
                      isLast && "border-b-0",
                      hasIncome
                        ? isZero
                          ? "text-text-muted"
                          : "text-brand"
                        : "text-text-muted",
                    )}
                  >
                    {fmtRange(bracket.from, bracket.width)}
                  </td>
                )}

                {/* Rate */}

                <td
                  className={cn(
                    tableCell({
                      compact,
                    }),
                    isLast && "border-b-0",
                    hasIncome
                      ? isZero
                        ? "text-text-muted font-semibold"
                        : "text-brand font-semibold"
                      : "text-text-muted",
                  )}
                >
                  {fmtPct(bracket.rate)}
                </td>

                {/* Taxable */}

                <td
                  className={cn(
                    tableCell({
                      compact,
                    }),
                    isLast && "border-b-0",
                    "text-right",
                    hasIncome
                      ? isZero
                        ? "text-text-muted font-display"
                        : "text-text-primary font-display"
                      : "text-text-muted",
                  )}
                >
                  {hasIncome ? fmt(result!.taxableAmount) : "_"}
                </td>

                {/* Tax */}
                <td
                  className={cn(
                    tableCell({
                      compact,
                    }),
                    isLast && "border-b-0",
                    "text-right",
                    hasIncome
                      ? isZero
                        ? "text-text-muted"
                        : "font-display font-medium text-brand"
                      : "text-text-muted",
                  )}
                >
                  {hasIncome ? (isZero ? "₦0" : fmt(result!.taxCharged)) : "_"}
                </td>
              </tr>
            );
          })}

          {/* Total Row */}
          <tr className="bg-brand text-white">
            <td
              colSpan={compact ? 3 : 4}
              className={cn(
                compact ? "px-2.5 py-2.5 text-xs" : "px-3.5 py-3 text-sm",
                "font-semibold text-white/85",
              )}
            >
              Total income tax
            </td>

            <td
              className={cn(
                compact ? "px-2.5 py-2.5 text-base" : "px-3.5 py-3 text-xl",
                "text-right font-display text-white",
              )}
            >
              {fmt(totalTax)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

// Columns

function columns(compact: boolean) {
  const cols = [
    {
      key: "band",
      label: "Band",
      align: "left",
    },
    {
      key: "rate",
      label: "Rate",
      align: "left",
    },
    {
      key: "taxable",
      label: "Taxable",
      align: "right",
    },
    {
      key: "tax",
      label: "Tax",
      align: "right",
    },
  ];

  if (!compact) {
    cols.splice(1, 0, {
      key: "range",
      label: "Income Rand",
      align: "left",
    });
  }
  return cols;
}
