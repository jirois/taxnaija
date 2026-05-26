import React, { useId } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { FieldLabel } from "./FieldLabel";
import { FieldError } from "./FieldError";

// -- styles --

const inputWrapper = cva(
  [
    "flex items-center overflow-hidden",
    "rounded-[var(--radius-md)]",
    "border",
    "transition-all duration-150",
    "bg-surface-elevated",
    "focus-within:ring-2",
  ],
  {
    variants: {
      state: {
        default:
          "border-broder-strong focus-within:border-brand focus-within:ring-brand-light",
        error:
          "border-danger focus-within:border-danger focus-within:ring-red-100",
      },
      disabled: {
        true: "opacity-60 bg-surface cursor-not-allowed",
        false: "",
      },

      size: {
        sm: "h-9",
        md: "h-10",
        lg: "h-12",
      },
    },
    defaultVariants: {
      state: "default",
      size: "md",
      disabled: false,
    },
  },
);

const inputBase = cva(
  [
    "flex-1 min-w-0",
    "bg-transparent outline-none border-none",
    "font-body",
    "text-text-primary",
    "placeholder:text-text-placeholder",
    "disabled:cursor-not-allowed",
  ],
  {
    variants: {
      size: {
        sm: "text-sm px-3",
        md: "text-base px-3",
        lg: "text-base px-4",
      },
      hasPrefix: {
        true: "pl-2",
        false: "",
      },
      hasSuffix: {
        true: "pr-2",
        false: "",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const slotBase = cva("flex items-center shrink-0 text-text-muted");

export interface TextInputProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "prefix" | "size" | "disabled"
    >,
    Omit<VariantProps<typeof inputWrapper>, "disabled"> {
  label: string;
  error?: string;
  hint?: string;
  pidginHint?: string;
  showPidgin?: boolean;
  required?: boolean;
  tooltip?: React.ReactNode;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  id?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
}

export function TextInput({
  label,
  error,
  hint,
  pidginHint,
  showPidgin = false,
  required = false,
  tooltip,
  prefix,
  suffix,
  id: externalId,
  disabled = false,
  size,
  className,
  ...inputProps
}: TextInputProps) {
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

      {/* Input shell  */}
      <div
        className={cn(
          inputWrapper({
            state: hasError ? "error" : "default",
            disabled,
            size,
          }),
        )}
      >
        {/* Prefix */}
        {prefix && (
          <span className={cn(slotBase(), "pl-3 text-sm")}>{prefix}</span>
        )}
        {/* Input */}
        <input
          id={id}
          disabled={disabled}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={cn(
            inputBase({
              size,
              hasPrefix: !!prefix,
              hasSuffix: !!suffix,
            }),
          )}
          {...inputProps}
        />
        {/* Suffix */}
        {suffix && (
          <span className={cn(slotBase(), "pr-3 text-sm")}>{suffix}</span>
        )}
      </div>
      {/* Error */}
      {hasError && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
