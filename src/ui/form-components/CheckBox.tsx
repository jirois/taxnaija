import React, { useEffect, useId, useRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { FieldError } from "./FieldError";

// styles

const checkboxWrapper = cva("flex flex-col gap-1 w-full");

const checkboxLabel = cva(
  ["flex items-start gap-2.5", "select-none", "transition-opacity", "w-full"],
  {
    variants: {
      disabled: {
        true: "cursor-not-allowed opacity-55",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      disabled: false,
    },
  },
);

const checkboxBox = cva(
  [
    "relative shrink-0",
    "flex items-center justify-center",
    "rounded-[var(--radius-sm)]",
    "transition-all duration-150",
    "mt-0.5",
  ],
  {
    variants: {
      state: {
        default: "border-[2px] border-border-strong bg-white",
        checked: "border-brand bg-brand",
        indeterminate: "border-brand bg-brand",
        error: "border-danger bg-white",
      },
      size: {
        sm: "w-4 h-4",
        md: "w-[18px] h-[18px]",
        lg: "w-5 h-5",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
    },
  },
);

const labelText = cva("leading-relaxed text-text-body", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const hintText = cva("ml-7 text-xs text-text-muted leading-relaxed");

// Types

export interface CheckboxProps extends VariantProps<typeof checkboxBox> {
  label: React.ReactNode;
  checked: boolean;
  onChange: (checked: boolean) => void;
  indeterminate?: boolean;
  error?: string;
  disabled: boolean;
  hint?: string;
  id?: string;
  className?: string;
}

// Component

export function Checkbox({
  label,
  checked,
  onChange,
  indeterminate = false,
  error,
  disabled = false,
  hint,
  id: externalId,
  className,
  size,
}: CheckboxProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;
  const hasError = Boolean(error);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate;
    }
  }, [indeterminate]);

  const state = hasError
    ? "error"
    : indeterminate
      ? "indeterminate"
      : checked
        ? "checked"
        : "default";

  return (
    <div className={cn(checkboxWrapper(), className)}>
      <label
        htmlFor={id}
        className={cn(
          checkboxLabel({
            disabled,
          }),
        )}
      >
        {/* Hidden native input */}
        <input
          ref={inputRef}
          id={id}
          type="checkbox"
          checked={checked}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        {/* Custom box */}
        <span
          aria-hidden="true"
          className={cn(
            checkboxBox({
              state,
              size,
            }),
          )}
        >
          {indeterminate ? (
            <span className="w-2 h-0.5 rounded bg-white" />
          ) : checked ? (
            <i
              className="ti ti-check text-[11px] text-white"
              aria-hidden="true"
            />
          ) : null}
        </span>
        {/* Label */}
        <span
          className={cn(
            labelText({
              size,
            }),
          )}
        >
          {label}
        </span>
      </label>

      {/* Hint */}
      {hint && <p className={hintText()}></p>}
      {/* Error */}
      {hasError && (
        <FieldError id={errorId} className="ml-7">
          {error}
        </FieldError>
      )}
    </div>
  );
}
