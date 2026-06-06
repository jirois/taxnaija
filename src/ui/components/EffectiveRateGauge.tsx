import { cva } from "class-variance-authority";

const pct = (r: number) => `${(r * 100).toFixed(1)}%`;

const statCard = cva("rounded-md border bg-muted/30 text-center p-2.5", {
  variants: {
    size: {
      default: "",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface EffectiveRateGaugeProps {
  effectiveRate: number;
  chargeableIncome: number;
  annualTax: number;
  size?: number;
  className?: string;
}

export function EffectiveRateGauge({
  effectiveRate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  chargeableIncome,
  annualTax,
  size = 200,
  className,
}: EffectiveRateGaugeProps) {
  const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;
  const cx = size / 2;
  const cy = size * 0.58;
  const r = size * 0.38;
  const stroke = size * 0.072;

  const START_DEG = 180;
  const TOTAL_DEG = 180;

  const MAX_RATE = 0.25;
  const clamped = Math.min(effectiveRate, MAX_RATE);
  const fillDeg = (clamped / MAX_RATE) * TOTAL_DEG;

  const toRad = (d: number) => (d * Math.PI) / 180;

  const arcPath = (startDeg: number, sweepDeg: number, radius: number) => {
    const sx = cx + radius * Math.cos(toRad(startDeg));
    const sy = cy + radius * Math.sin(toRad(startDeg));

    const endDeg = startDeg - sweepDeg;

    const ex = cx + radius * Math.cos(toRad(endDeg));
    const ey = cy + radius * Math.sin(toRad(endDeg));

    const large = sweepDeg > 180 ? 1 : 0;

    return `M ${sx} ${sy} A ${radius} ${radius} 0 ${large} 0 ${ex} ${ey}`;
  };

  const fillColor =
    effectiveRate < 0.1
      ? "#15803d"
      : effectiveRate < 0.18
        ? "#f5930b"
        : "#dc2626";

  const svgHeight = cy + stroke / 2 + 4;

  return (
    <div className={`flex flex-col items-center gap-2 ${className ?? ""}`}>
      <svg
        width={size}
        height={svgHeight}
        viewBox={`0 0 ${size} ${svgHeight}`}
        role="img"
        aria-label={`Effective tax rate: ${pct(effectiveRate)}`}
      >
        {/* Track */}
        <path
          d={arcPath(START_DEG, TOTAL_DEG, r)}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={stroke}
          strokeLinecap="round"
        />

        {/* Fill */}
        {fillDeg > 0 && (
          <path
            d={arcPath(START_DEG, fillDeg, r)}
            fill="none"
            stroke={fillColor}
            strokeWidth={stroke}
            strokeLinecap="round"
          />
        )}

        {/* Threshold ticks */}
        {[0.1, 0.18].map((threshold) => {
          const deg = START_DEG - (threshold / MAX_RATE) * TOTAL_DEG;

          const innerX = cx + (r - stroke / 2 - 2) * Math.cos(toRad(deg));

          const innerY = cy + (r - stroke / 2 - 2) * Math.sin(toRad(deg));

          const outerX = cx + (r + stroke / 2 + 2) * Math.cos(toRad(deg));

          const outerY = cy + (r + stroke / 2 + 2) * Math.sin(toRad(deg));

          return (
            <line
              key={threshold}
              x1={innerX}
              y1={innerY}
              x2={outerX}
              y2={outerY}
              stroke="#9ca3af"
              strokeWidth={1.5}
            />
          );
        })}

        {/* Rate */}
        <text
          x={cx}
          y={cy - r * 0.06}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={fillColor}
          fontSize={size * 0.13}
          fontWeight={700}
        >
          {pct(effectiveRate)}
        </text>

        <text
          x={cx}
          y={cy + r * 0.2}
          textAnchor="middle"
          dominantBaseline="middle"
          fill="#6b7280"
          fontSize={size * 0.062}
        >
          effective rate
        </text>

        {/* Scale labels */}
        <text
          x={cx - r - stroke / 2 - 4}
          y={cy + 4}
          textAnchor="end"
          fill="#6b7280"
          fontSize={size * 0.055}
        >
          0%
        </text>

        <text
          x={cx + r + stroke / 2 + 4}
          y={cy + 4}
          textAnchor="start"
          fill="#6b7280"
          fontSize={size * 0.055}
        >
          25%
        </text>
      </svg>

      {/* Stats */}

      <div className="grid w-full grid-cols-2 gap-2">
        <div className={statCard()}>
          <p className="text-lg font-semibold">{fmt(annualTax)}</p>
          <p className="text-xs text-text-body">Annual tax</p>
        </div>

        <div className={statCard()}>
          <p className="text-xs font-semibold">{pct(effectiveRate)}</p>
          <p className="text-xs text-text-body">On chargeable</p>
        </div>
      </div>
    </div>
  );
}
