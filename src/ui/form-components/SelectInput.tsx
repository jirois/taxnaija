import React, { useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { FieldLabel } from "./FieldLabel";
import { FieldError } from "./FieldError";

// --- types ---
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectGroup {
  group: string;
  options: SelectOption[];
}

export type SelectItems = SelectOption[] | SelectGroup[];

function isGroups(items: SelectItems): items is SelectGroup[] {
  return items.length > 0 && "group" in items[0]!;
}

// --- styles ---

const selectBase = cva(
  [
    "w-full appearance-none",
    "rounded-[var(--radius-md)]",
    "border",
    "outline-none",
    "transition-all duration-150",
    "font-body",
    "bg-surface-elevated",
    "pr-10 pl-3",
    "focus:ring-2",
  ],
  {
    variants: {
      state: {
        default:
          "border-border-strong focus:border-brand focus:ring-brand-light",
        error: "border-danger focus:border-danger focus:ring-red-100",
      },
      size: {
        sm: "h-9 text-sm",
        md: "h-10 text-base",
        lg: "h-12 text-base",
      },
      disabled: {
        true: "opacity-60 cursor-not-allowed bg-surface",
        false: "cursor-pointer",
      },
      empty: {
        true: "text-text-placeholder",
        false: "text-text-primary",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
      disabled: false,
      empty: false,
    },
  },
);

const chevronBase = cva(
  [
    "absolute right-3 top-1/2 -translate-y-1/2",
    "pointer-events-none",
    "text-text-muted",
    "flex items-center justify-center",
  ],
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-[15px]",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

// --- Props ---

export interface SelectInputProps
  extends
    Omit<
      React.SelectHTMLAttributes<HTMLSelectElement>,
      "size" | "onChange" | "disabled"
    >,
    Omit<VariantProps<typeof selectBase>, "state" | "empty" | "disabled"> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  items: SelectItems;
  placeholder?: string;
  error?: string;
  hint?: string;
  pidginHint?: string;
  showPidgin?: boolean;
  required?: boolean;
  tooltip?: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

// --- Component ---
export function SelectInput({
  label,
  value,
  onChange,
  items,
  placeholder = "Select one…",
  error,
  hint,
  pidginHint,
  showPidgin = false,
  required = false,
  tooltip,
  disabled = false,
  size,
  id: externalId,
  className,
  ...props
}: SelectInputProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;
  const hasError = Boolean(error);

  return (
    <div className={cn("flex flex-col w-full gap-1.5", className)}>
      {/* Label */}
      <FieldLabel
        htmlFor={id}
        required={required}
        tooltip={tooltip}
        hint={hint}
        pidginHint={pidginHint}
        showPidgin={showPidgin}
      >
        {label}
      </FieldLabel>

      {/* Select wrapper */}
      <div className="relative w-full">
        <select
          id={id}
          value={value}
          disabled={disabled}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            selectBase({
              state: hasError ? "error" : "default",
              size,
              disabled,
              empty: !value,
            }),
            "max-width: 100% min-w-0 max-w-full truncate",
            "text-sm sm:text-base",
            "pr-10",
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {isGroups(items)
            ? items.map((group) => (
                <optgroup key={group.group} label={group.group}>
                  {group.options.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </option>
                  ))}
                </optgroup>
              ))
            : items.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
        </select>

        {/* Chrevron */}
        <span aria-hidden="true" className={cn(chevronBase({ size }))}>
          <i className="ti ti-chevron-down" />
        </span>
      </div>

      {/* Error */}
      {hasError && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
