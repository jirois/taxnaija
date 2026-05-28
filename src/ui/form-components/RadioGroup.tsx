import React, { useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { FieldLabel } from "./FieldLabel";
import { FieldError } from "./FieldError";

// Types

export interface RadioOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;
  disabled?: boolean;
}

// Styles

const groupLayout = cva("gap-2 w-full clear-both", {
  variants: {
    layout: {
      stack: "flex flex-col",
      grid: "grid grid-cols-1 sm:grid-cols-2 gap-3",
    },
  },
  defaultVariants: {
    layout: "stack",
  },
});

const radioCard = cva(
  [
    "relative w-full",
    "flex items-start gap-3",
    "rounded-[var(--radius-md)]",
    "border",
    "transition-all duration-150",
    "select-none",
    "p-3 sm:p-4",
  ],
  {
    variants: {
      state: {
        default: "border-border-strong bg-white",
        selected: "border-brand bg-brand-light",
        error: "border-danger bg-white",
      },
      disabled: {
        true: "opacity-55 cursor-not-allowed",
        false: "cursor-pointer hover:border-brand",
      },
    },
    defaultVariants: {
      state: "default",
      disabled: false,
    },
  },
);

const radioDot = cva(
  [
    "mt-0.5 shrink-0",
    "w-[18px] h-[18px]",
    "rounded-full border-2",
    "flex items-center justify-center",
    "transition-all duration-150",
  ],
  {
    variants: {
      selected: {
        true: "border-brand bg-brand",
        false: "border-border-strong bg-transparent",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);

const badgeStyles = cva(
  [
    "inline-flex items-center",
    "rounded-full",
    "px-2 py-0.5",
    "text-xs font-medium",
    "shrink-0",
  ],
  {
    variants: {
      selected: {
        true: "bg-brand-light border border-green-200 text-brand",
        false: "bg-gray-100 border border-border text-text-muted",
      },
    },
    defaultVariants: {
      selected: false,
    },
  },
);
// Props
export interface RadioGroupProps extends VariantProps<typeof groupLayout> {
  legend: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  hint?: string;
  pidginHint?: string;
  showPidgin?: boolean;
  required?: boolean;
  tooltip?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

// Component
export function RadioGroup({
  legend,
  value,
  onChange,
  options,
  layout,
  error,
  hint,
  pidginHint,
  showPidgin = false,
  required = false,
  tooltip,
  disabled = false,
  className,
}: RadioGroupProps) {
  const groupId = useId();
  const errorId = `${groupId}-error`;
  const hasError = Boolean(error);

  return (
    <fieldset className={cn("border-0 p-0 m-0 w-full", className)}>
      {/* Legend */}
      <legend className="w-full p-0">
        <FieldLabel
          required={required}
          tooltip={tooltip}
          hint={hint}
          pidginHint={pidginHint}
          showPidgin={showPidgin}
        >
          {legend}
        </FieldLabel>
      </legend>
      {/* Option */}
      <div className={cn(groupLayout({ layout }))}>
        {options.map((option) => {
          const isSelected = option.value === value;

          const isDisabled = disabled || option.disabled;

          const state = hasError
            ? "error"
            : isSelected
              ? "selected"
              : "default";

          const inputId = `${groupId}-${option.value}`;
          return (
            <label
              key={option.value}
              htmlFor={inputId}
              className={cn(
                radioCard({
                  state,
                  disabled: isDisabled,
                }),
              )}
            >
              {/* Native radio */}
              <input
                id={inputId}
                type="radio"
                name={groupId}
                value={option.value}
                checked={isSelected}
                disabled={isDisabled}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {/* Radio dot */}
              <span
                aria-hidden="true"
                className={cn(radioDot({ selected: isSelected }))}
              >
                {isSelected && (
                  <span className="w-1.75 h-1.75 rounded-full bg-white" />
                )}
              </span>
              {/* Icon */}
              {option.icon && (
                <i
                  className={cn(
                    option.icon,
                    "text-lg shrink-0 mt-px transition-colors",
                    isSelected ? "text-brand" : "text-text-muted",
                  )}
                  aria-hidden="true"
                />
              )}
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={cn(
                      "text-sm sm:text-base font-medium transition-colors",
                      isSelected ? "text-brand" : "text-text-primary",
                    )}
                  >
                    {option.label}
                  </span>

                  {option.badge && (
                    <span
                      className={cn(
                        badgeStyles({
                          selected: isSelected,
                        }),
                      )}
                    >
                      {option.badge}
                    </span>
                  )}
                </div>
                {option.description && (
                  <p className="mt-1 text-sm leading-relaxed text-text-muted ">
                    {option.description}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      {/* Error */}
      {hasError && <FieldError id={errorId}>{error}</FieldError>}
    </fieldset>
  );
}
