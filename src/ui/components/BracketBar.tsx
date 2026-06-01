import { useState } from "react";
import type { BracketResult } from "../../tax-engine/types";
import { cva } from "class-variance-authority";
import clsx from "clsx";

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

const pct = (r: number) => `${(r * 100).toFixed(0)}%`;

// Band Color Map

const BAND_STYLES: Record<number, { bg: string; text: string; label: string }> =
  {
    0.0: { bg: "bg-gray-100", text: "text-gray-600", label: "0%" },
    0.15: { bg: "bg-green-200", text: "text-green-900", label: "15%" },
    0.18: { bg: "bg-green-300", text: "text-green-900", label: "18%" },
    0.21: { bg: "bg-green-500", text: "text-white", label: "21%" },
    0.23: { bg: "bg-green-600", text: "text-white", label: "23%" },
    0.25: { bg: "bg-green-800", text: "text-white", label: "25%" },
  };

function bandColor(rate: number) {
  return (
    BAND_STYLES[rate] ?? {
      bg: "bg-gray-100",
      text: "text-gray-600",
      label: pct(rate),
    }
  );
}

//   cva base (Bar Container)
const barContainer = cva("flex overflow-hidden relative rounded-full gap-px", {
  variants: {
    size: {
      sm: "h-4",
      md: "h-6",
      lg: "h-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

// Segment cva
const segment = cva(
  "flex items-center justify-center relative transition duration-150",
  {
    variants: {
      hovered: {
        true: "brightness-90",
        false: "",
      },
    },
  },
);

// Legend item
const legendItem = cva("flex items-center gap-2 text-xs text-gray-500");

export interface BracketBarProps {
  bracketResults: BracketResult[];
  chargeableIncome: number;
  height?: number;
  showLabels?: boolean;
  showLegend?: boolean;
}

export function BracketBar({
  bracketResults,
  chargeableIncome,
  height = 32,
  showLabels = true,
  showLegend = true,
}: BracketBarProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const total = chargeableIncome || 1;
  const visible = bracketResults.filter((b) => b.taxableAmount > 0);

  if (visible.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-full bg-gray-200 text-xs text-gray-500"
        style={{ height }}
      >
        Enter income to see breakdown
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {/* STACKED BAR */}
      <div className={barContainer({ size: "md" })} style={{ height }}>
        {visible.map((band, idx) => {
          const proportion = band.taxableAmount / total;
          const color = bandColor(band.rate);
          const isHovered = hoveredIdx === idx;
          const isZero = band.rate === 0;

          return (
            <div
              key={idx}
              className={clsx(segment({ hovered: isHovered }), color.bg)}
              style={{
                flex: proportion,
                minWidth: proportion > 0.04 ? undefined : 4,
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              aria-label={`${color.label} band : ${fmt(
                band.taxableAmount,
              )} taxable, ${fmt(band.taxCharged)} tax`}
            >
              {/* LABEL INSIDE SEGMENT */}
              {showLabels && proportion > 0.08 && (
                <span className={clsx("text-xs font-semibold", color.text)}>
                  {isZero ? "0%" : color.label}
                </span>
              )}
              {/* TOOLTIP */}
              {isHovered && (
                <div className="absolute bottom-full mb-2 left-1/2 translate-x-1/2 gray-900 text-gray-50 text-xs rounded px-3 py-2 shadow-md whitespace-nowrap z-50">
                  <p className={clsx("font-semibold mb-1", color.text)}>
                    {isZero ? "Zero-rate band (0%)" : `${color.label} band`}
                  </p>
                  <p>Taxable: {fmt(band.taxableAmount)}</p>
                  <p>Tax: {isZero ? "₦0" : fmt(band.taxCharged)}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {showLegend && (
        <div className="flex flex-wrap gap-x-3 gap-y-2">
          {visible.map((band, idx) => {
            const color = bandColor(band.rate);
            const isZero = band.rate === 0;

            return (
              <div key={idx} className={legendItem()}>
                <span className={clsx("w-2.5 h-2.5 rounded-sm", color.bg)}>
                  <span>
                    {isZero ? "0% (tax-free)" : color.label} -{" "}
                    {fmt(band.taxableAmount)}
                  </span>
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
