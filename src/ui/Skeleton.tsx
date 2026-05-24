import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

const skeleton = cva("inline-block bg-[length:800px_100%] animate-shimmer", {
  variants: {
    variant: {
      default:
        "bg-[linear-gradient(90deg,var(--color-border)_25%,var(--color-surface)_50%,var(--color-border)_75%)]",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = "var(--radius-sm)",
  className,
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(skeleton(), className)}
      style={{
        width,
        height,
        borderRadius,
      }}
    />
  );
}

export function SkeletonText({
  lines = 3,
  lastLineWidth = "65%",
}: {
  lines?: number;
  lastLineWidth?: string;
}) {
  return (
    <div className="flex flex-col gap-2" aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={14}
          width={i === lines - 1 ? lastLineWidth : "100%"}
        />
      ))}
    </div>
  );
}

const card = cva(
  "p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] flex flex-col gap-2",
);

export function SkeletonStatCard() {
  return (
    <div className={card()} aria-hidden="true">
      <Skeleton width="45%" height={11} />
      <Skeleton width="60%" height={28} />
    </div>
  );
}

const summaryCard = cva(
  "p-5 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] flex flex-col gap-3",
);

export function SkeletonSummaryCard() {
  return (
    <div className={summaryCard()} aria-hidden="true">
      <Skeleton width="40%" height={13} />
      {[1, 2, 3, 4, 5].map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <Skeleton width="60%" height={13} />
          <Skeleton width="20%" height={13} />
        </div>
      ))}
      <div className="h-px bg-border my-1" />
      <div className="flex justify-between">
        <Skeleton width="30%" height={18} />
        <Skeleton width="25%" height={18} />
      </div>
    </div>
  );
}
