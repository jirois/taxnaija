import { cva, type VariantProps } from "class-variance-authority";
import { getDeadlineInfo } from "../../tax-engine/compute";
import type { DeadlineInfo } from "../../tax-engine/types";
import { cn } from "../../lib/cn";

// cva
const deadlinePillVariants = cva(
  [
    "inline-flex items-center gap-1.5",
    "rounded-full border",
    "px-2.5 py-1",
    "text-xs font-semibold leading-none",
    "whitespace-nowrap",
    "transition-opacity",
    "font-body",
  ],
  {
    variants: {
      tone: {
        neutral: ["bg-surface", "border-border", "text-text-muted"],
        warning: ["bg-warning/40", "border-amber-200", "text-warning"],
        urgent: ["bg-warning/40", "border-amber-200", "text-warning"],
        overdue: ["bg-danger/40", "border-red-300", "text-danger"],
      },
      clickable: {
        true: "cursor-pointer hover:opacity-85",
        false: "cursor-default",
      },
    },
    defaultVariants: {
      tone: "neutral",
      clickable: false,
    },
  },
);

// Types

export interface DeadlinePillProps extends VariantProps<
  typeof deadlinePillVariants
> {
  taxYear?: number;
  referenceDate?: Date;
  onClick?: () => void;
  className?: string;
}

// Component

export function DeadlinePill({
  taxYear,
  referenceDate,
  onClick,
  className,
}: DeadlinePillProps) {
  const info = getDeadlineInfo(taxYear, undefined, referenceDate);

  const resolved = resolveStyle(info);

  return (
    <button
      type="button"
      onClick={onClick}
      title={onClick ? "View penalty details" : undefined}
      className={cn(
        deadlinePillVariants({
          tone: resolved.tone,
          clickable: !!onClick,
        }),
        className,
      )}
    >
      <i className={resolved.icon} aria-hidden="true" />
      <span>{resolved.label}</span>
    </button>
  );
}

// Style

function resolveStyle(info: DeadlineInfo): {
  label: string;
  icon: string;
  tone: "neutral" | "warning" | "urgent" | "overdue";
} {
  if (info.isOverdue) {
    return {
      label: `${Math.abs(info.daysRemaining)}d overdue - penalties apply`,
      icon: "ti ti-alert-triangle",
      tone: "overdue",
    };
  }
  const d = info.daysRemaining;

  if (d <= 7) {
    return {
      label: `${d} day${d === 1 ? "" : "s"} left - file today`,
      icon: "ti ti-flame",
      tone: "urgent",
    };
  }

  if (d <= 30) {
    return {
      label: `${d} days to March 31`,
      icon: "ti ti-clock",
      tone: "warning",
    };
  }

  if (d <= 60) {
    return {
      label: `${d} days to deadline`,
      icon: "ti ti-calender",
      tone: "warning",
    };
  }

  return {
    label: "File by March 31",
    icon: "ti ti-calendar-check",
    tone: "neutral",
  };
}
