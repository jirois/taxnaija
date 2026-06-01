import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { Skeleton } from "../Skeleton";
import { Tooltip } from "../Tooltip";

export type StatCardVariant = "default" | "primary" | "muted" | "danger";

export interface StatCardProps extends VariantProps<typeof statCardVariants> {
  label: string;
  value: string | number;
  unit?: string;
  tooltip?: string;
  previousValue?: number;
  currentRaw?: number;
  loading?: boolean;
  icon?: string;
  className?: string;
}

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

const statCardVariants = cva("rounded-xl transition-all", {
  variants: {
    variant: {
      default: "bg-elevated border border-border shadow-sm p-4",
      primary: "bg-brand border border-brand p-4",
      muted: "bg-bg-surface border border-border p-4",
      danger: "bg-danger-light border border-danger/20 p-4",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function StatCard({
  label,
  value,
  unit,
  tooltip,
  variant,
  previousValue,
  currentRaw,
  loading = false,
  icon,
  className,
}: StatCardProps) {
  if (loading) {
    return (
      <div className={cn(statCardVariants({ variant }), className)}>
        <Skeleton className="mb-3 h-3 w-1/2" />
        <Skeleton className="h-8 w-2/3" />
      </div>
    );
  }
  let delta: {
    dir: "up" | "down";
    label: string;
  } | null = null;

  if (
    previousValue !== undefined &&
    currentRaw !== undefined &&
    previousValue !== currentRaw
  ) {
    const diff = currentRaw - previousValue;

    delta = {
      dir: diff > 0 ? "up" : "down",
      label: `${diff > 0 ? "+" : ""}${fmt(Math.abs(diff))}`,
    };
  }

  const isPrimary = variant === "primary";
  const isDanger = variant === "danger";

  return (
    <div className={cn(statCardVariants({ variant }), className)}>
      {/* Label */}
      <div className="mb-2 flex items-center gap-1 5">
        {icon && (
          <i
            className={cn(
              icon,
              isPrimary ? "text-white/70" : "text-text-muted",
            )}
          />
        )}

        <span
          className={cn(
            "text-[11px] font-semibold uppercass tracking-wider",
            isPrimary ? "text-white/75" : "text-text-muted",
          )}
        >
          {label}
        </span>
        {tooltip && (
          <Tooltip content={tooltip} placement="top">
            <i
              className={cn(
                "ti ti-info-circle text-xs",
                isPrimary ? "text-white/50" : "text-text-muted",
              )}
            />
          </Tooltip>
        )}
      </div>
      {/* Value */}

      <div className="flex flex-wrap items-baseline gap-1">
        <span
          className={cn(
            "font-display text-3xl leading-none",
            isPrimary
              ? "text-white"
              : isDanger
                ? "text-danger"
                : "text-primary-text",
          )}
        >
          {value}
        </span>

        {unit && (
          <span
            className={cn(
              "text-xs",
              isPrimary ? "text-white/70" : "text-text-muted",
            )}
          >
            {unit}
          </span>
        )}
      </div>

      {/* Delta */}
      {delta && (
        <div className="mt-2 flex items-center gap-1">
          <i
            className={cn(
              delta.dir === "up" ? "ti ti-trending-up" : "ti ti-trending-down",
              "text-xs",
              isPrimary
                ? "text-white/70"
                : delta.dir === "up"
                  ? "text-danger"
                  : "text-primary",
            )}
          />

          <span
            className={cn(
              "text-xs",
              isPrimary
                ? "text-white/70"
                : delta.dir === "up"
                  ? "text-danger"
                  : "text-primary",
            )}
          >
            {delta.label} from last calculation
          </span>
        </div>
      )}
    </div>
  );
}
