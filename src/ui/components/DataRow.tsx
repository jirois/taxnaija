import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";

export type DataRowVariant =
  | "default"
  | "deduction"
  | "highlight"
  | "total"
  | "separator";

export interface DataRowProps {
  label: React.ReactNode;
  value?: React.ReactNode;
  variant?: DataRowVariant;
  labelHint?: string; // small muted text below the label
  prefix?: string; // prepended to value e.g. "−"
  icon?: string; // Tabler icon before label
  className?: string;
}

// cva
const rowVariants = cva("flex items-start justify-between gap-3", {
  variants: {
    variant: {
      default: "py-[9px]",
      deduction: "py-[9px]",
      highlight: "py-[9px] bg-brand-light -mx-5 px-5",
      total: "py-3 border-t border-border-strong",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const labelVariants = cva("font-body leading-[1.4] ", {
  variants: {
    variant: {
      default: "text-sm text-text-muted font-normal",

      deduction: "text-sm text-brand font-normal",

      highlight: "text-sm text-text-muted font-normal",

      total: "text-base text-text-brand font-semibold",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const valueVariants = cva("shrink-0 text-right", {
  variants: {
    variant: {
      default: "font-body text-sm font-medium text-text-brand",
      deduction: "font-body text-sm font-medium text-brand-text",
      highlight: "font-body text-sm font-medium text-text-brand",
      total: "font-display text-lg font-normal text-text-brand",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

const iconVariants = cva("text-sm shrink-0 mt-[1px] align-baseline", {
  variants: {
    variant: {
      default: "text-text-muted",
      deduction: "text-brand-text",
      highlight: "text-text-muted",
      total: "text-text-brand",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export function DataRow({
  label,
  value,
  variant = "default",
  labelHint,
  prefix,
  icon,
  className,
}: DataRowProps) {
  // Separator variant
  if (variant === "separator") {
    return (
      <div className={cn("flex items-center gap-2.5 py-2 pb-1", className)}>
        {label && (
          <span className="font-body text-xs font-semibold uppercase tracking-[0.07em] text-text-muted whitespace-nowrap">
            {label}
          </span>
        )}
        <span className="flex-1 h-px bg-border" />
      </div>
    );
  }
  return (
    <div className={cn(rowVariants({ variant }), className)}>
      {/* Label Side */}

      <div className="flex items-start gap-1.5 min-w-0">
        {icon && (
          <i
            className={cn(icon, iconVariants({ variant }))}
            aria-hidden="true"
          />
        )}

        <div className="min-w-0">
          <span
            className={labelVariants({
              variant,
            })}
          >
            {label}
          </span>

          {labelHint && (
            <p className="mt-0.5 text-xs text-text-muted leading-[1.4]">
              {labelHint}
            </p>
          )}
        </div>
      </div>

      {/* Value Side */}

      {value !== undefined && (
        <span
          className={valueVariants({
            variant,
          })}
        >
          {prefix && <span className="mr-px">{prefix}</span>}

          {value}
        </span>
      )}
    </div>
  );
}
