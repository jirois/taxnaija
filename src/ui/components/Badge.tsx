import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";

// Shared styles
const badgeBase = cva(
  "inline-flex items-center gap-1.5 whitespace-nowrap transition-colors",
);

const pillBadge = cva(
  "rounded-full border px-2.5 py-1 text-xs font-semibold font-body",
);

const softBadge = cva(
  "rounded-md border px-2.5 py-1.5 text-xs font-medium font-body",
);

// TaxYearBadge

const taxYearBadgeStyles = cva(
  [
    badgeBase(),
    pillBadge(),
    "text-primary",
    "bg-primary-light",
    "border-green-200",
  ].join(" "),
);

export interface TaxYearBadgeProps {
  year?: number;
  act?: string;
  className?: string;
}

export function TaxYearBadge({
  year = 2026,
  act = "NTA 2025",
  className,
}: TaxYearBadgeProps) {
  return (
    <span
      aria-label={`Tax year ${year} under ${act}`}
      className={cn(taxYearBadgeStyles(), className)}
    >
      <i className="ti ti-receipt-tax text-[11px]" aria-hidden />
      {act} - {year} Tax Year
    </span>
  );
}

// LangChip

const langGroup = cva(
  "inline-flex overflow-hidden rounded-full border border-border-strong",
);

const langButton = cva(
  "px-3 py-1 text-xs font-semibold font-body transition-colors",
  {
    variants: {
      active: {
        true: "bg-primary text-white",
        false: "bg-transparent text-text-muted hover:bg-surface",
      },
      bordered: {
        true: "border-r border-border-strong",
        false: "",
      },
    },
    defaultVariants: {
      active: false,
      bordered: false,
    },
  },
);

export interface LangChipProps {
  value: "en" | "pidgin";
  onChange: (lang: "en" | "pidgin") => void;
  className?: string;
}

export function LangChip({ value, onChange, className }: LangChipProps) {
  const opts: Array<{ key: "en" | "pidgin"; label: string }> = [
    { key: "en", label: "English" },
    { key: "pidgin", label: "Pidgin" },
  ];

  return (
    <div
      role="group"
      aria-label="Select language"
      className={cn(langGroup(), className)}
    >
      {opts.map((opt, index) => {
        const active = value === opt.key;

        return (
          <button
            key={opt.key}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt.key)}
            className={cn(
              langButton({
                active,
                bordered: index === 0,
              }),
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

const exemptBadgeStyles = cva(
  [
    badgeBase(),
    pillBadge(),
    "text-text-primary",
    "bg-primary-light",
    "border-green-200",
  ].join(" "),
);

export interface ExemptBadgeProps {
  label?: string;
  className?: string;
}

export function ExemptBadge({
  label = "Tax-free band",
  className,
}: ExemptBadgeProps) {
  return (
    <span className={cn(exemptBadgeStyles(), className)}>
      <i className="ti ti-shield-check text-[11px]" aria-hidden="true" />
      {label}
    </span>
  );
}

// MinWageBadge

const minWageBadgeStyles = cva(
  [
    badgeBase(),
    softBadge(),
    "text-text-primary",
    "bg-primary-light",
    "border-green-200",
  ].join(" "),
);

export interface MinWageBadgeProps {
  className?: string;
}

export function MinWageBadge({ className }: MinWageBadgeProps) {
  return (
    <span
      role="note"
      aria-label="Income is at or below the national minimum wage - exempt from PAYE"
      className={cn(minWageBadgeStyles(), className)}
    >
      <i className="ti ti-currency-naira text-[13px]" aria-hidden="true" />
      Minimum wage exempt - no PAYE deduction required
    </span>
  );
}

// StepChip

export type StepChipState = "done" | "active" | "pending";

const stepChipButton = cva(
  "inline-flex items-center gap-2 text-xs font-body transition-colors",
  {
    variants: {
      state: {
        done: "text-text-muted",
        active: "text-text-primary font-semibold",
        pending: "text-text-muted",
      },
      clickable: {
        true: "cursor-pointer",
        false: "cursor-default",
      },
    },
  },
);

const stepDot = cva(
  "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
  {
    variants: {
      state: {
        done: "bg-primary text-white",
        active: "bg-primary text-white",
        pending: "bg-border text-text-muted",
      },
    },
  },
);

export interface StepChipProps {
  step: number;
  label: string;
  state: StepChipState;
  onClick?: () => void;
  className?: string;
}

export function StepChip({
  step,
  label,
  state,
  onClick,
  className,
}: StepChipProps) {
  const clickable = Boolean(onClick) && state !== "pending";

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={!clickable}
      aria-current={state === "active" ? "step" : undefined}
      className={cn(
        stepChipButton({
          state,
          clickable,
        }),
        className,
      )}
    >
      <span className={cn(stepDot({ state }))}>
        {state === "done" ? (
          <i className="ti ti-check text-[11px]" aria-hidden="true" />
        ) : (
          <span className="text-[10px] font-semibold">{step}</span>
        )}
      </span>
      {label}
    </button>
  );
}

// AutoCalcBadge

const autoCalcBadgeStyles = cva(
  [
    badgeBase(),
    "rounded-full border border-border bg-surface",
    "px-2 py-0.5",
    "text-xs font-medium text-text-muted",
    "font-body",
  ].join(" "),
);

export interface AutoCalcBadgeProps {
  className?: string;
}

export function AutoCalcBadge({ className }: AutoCalcBadgeProps) {
  return (
    <span
      title="This value is automatically calculated from your salary"
      className={cn(autoCalcBadgeStyles(), className)}
    >
      <i className="ti ti-calculator text-[10px]" aria-hidden="true" />
      auto-calculated
    </span>
  );
}

const requiredMarkStyles = cva("ml-0.5 text-sm leading-none text-danger");

export interface RequiredMarkProp {
  className?: string;
}

export function RequiredMark({ className }: RequiredMarkProp) {
  return (
    <span
      aria-label="required"
      title="This field is required"
      className={cn(requiredMarkStyles(), className)}
    >
      *
    </span>
  );
}
