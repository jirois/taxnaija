import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

// --- ProgressBar ---

const progressTrack = cva("w-full overflow-hidden relative bg-border");

const progressFill = cva("absolute left-0 top-0 h-full", {
  variants: {
    variant: {
      primary: "bg-[var(--color-brand)]",
      success: "bg-[var(--color-green-400)]",
      warning: "bg-[var(--color-warning)]",
      danger: "bg-[var(--color-danger)]",
    },
  },
  defaultVariants: {
    variant: "primary",
  },
});

interface ProgressBarProps extends VariantProps<typeof progressFill> {
  value?: number;
  label?: string;
  height?: number;
  showLabel?: boolean;
  className?: string;
}

export function ProgressBar({
  value,
  label = "Progress",
  height = 4,
  showLabel = false,
  variant,
  className,
}: ProgressBarProps) {
  const isIndeterminate = value === undefined;

  const pct = isIndeterminate ? undefined : Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {/* Label */}
      {showLabel && pct !== undefined && (
        <div className="flex items-center justify-between mb-1.5 text-xs text-text-muted font-medium">
          <span>{label}</span>
          <span>{pct}%</span>
        </div>
      )}
      {/* Track */}
      <div
        role="progressbar"
        aria-label={label}
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        className={cn(progressTrack())}
        style={{
          height,
          borderRadius: height,
        }}
      >
        {isIndeterminate ? (
          <div
            className={cn(
              "absolute h-full animate-indeterminate",
              progressFill({ variant }),
            )}
            style={{
              width: "40%",
              borderRadius: height,
            }}
          />
        ) : (
          <div
            className={cn(progressFill({ variant }))}
            style={{
              width: `${pct}%`,
              borderRadius: height,
            }}
          />
        )}
      </div>
    </div>
  );
}

// --- Step Progress ---

const stepSegment = cva("flex-1 rounded-full transition-colors duration-200", {
  variants: {
    state: {
      pending: "bg-border",
      active: "bg-brand",
      done: "bg-green-200",
    },
  },
});

interface StepProgressProps {
  current: number;
  total: number;
  labels?: string[];
  className?: string;
}

export function StepProgress({
  current,
  total,
  labels,
  className,
}: StepProgressProps) {
  return (
    <div className={cn("w-full", className)}>
      {/* Segments */}
      <div className={cn("flex gap-1", labels && "mb-2.5")}>
        {Array.from({ length: total }, (_, i) => {
          const step = i + 1;

          const state =
            step < current ? "done" : step === current ? "active" : "pending";

          return (
            <div
              key={i}
              className={cn(
                stepSegment({
                  state: state as "pending" | "active" | "done",
                }),
              )}
              style={{
                height: 4,
              }}
            />
          );
        })}
      </div>

      {/* Labels */}
      {labels && (
        <div className="flex justify-between">
          {labels.map((label, i) => {
            const step = i + 1;

            const active = step === current;
            const done = step < current;

            return (
              <span
                key={i}
                className={cn(
                  "text-xs",
                  active
                    ? "text-brand font-medium"
                    : done
                      ? "text-muted"
                      : "text-gray-400",
                )}
              >
                {label}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
