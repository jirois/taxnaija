import React, { useId, useRef, useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { FieldLabel } from "./FieldLabel";
import { FieldError } from "./FieldError";

// helpers
const fmt = (n: number) => n.toLocaleString("en-NG");
const nairaFmt = (n: number) => `₦${fmt(n)}`;

// styles
const shell = cva(
  [
    "flex items-center overflow-hidden",
    "rounded-md border",
    "transition-all duration-150",
    "focus-within:ring-2",
  ],
  {
    variants: {
      state: {
        default:
          "border-border-strong bg-surface-elevated focus-within:border-brand focus-within:ring-brand/20",
        error:
          "border-danger bg-surface-elevated focus-within:border-danger focus-within:ring-danger/20",
      },
      disabled: {
        true: "bg-surface opacity-65",
        false: "",
      },
      readOnly: {
        true: "bg-surface",
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
      readOnly: false,
    },
  },
);

const prefixStyles = cva(
  [
    "flex items-center justify-center shrink-0",
    "border-r border-border",
    "font-display",
    "select-none",
  ],
  {
    variants: {
      size: {
        sm: "w-8 text-sm",
        md: "w-9 text-base",
        lg: "w-11 text-lg",
      },
      inactive: {
        true: "text-text-muted",
        false: "text-brand",
      },
    },
    defaultVariants: {
      size: "md",
      inactive: false,
    },
  },
);

const inputStyles = cva(
  [
    "flex-1 min-w-0 bg-transparent border-none outline-none",
    "font-body text-text-primary",
    "placeholder:text-text-placholder",
    "text-right",
  ],
  {
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-3 text-base",
        lg: "h-12 px-4 text-lg",
      },
      inactive: {
        true: "cursor-not-allowed opacity-65",
        false: "cursor-text",
      },
    },
    defaultVariants: {
      size: "md",
      inactive: false,
    },
  },
);

const annualText = cva("mt-1 flex items-center gap-1 text-xs text-text-muted");

// types

export interface MoneyInputProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      "value" | "onChange" | "size"
    >,
    Omit<VariantProps<typeof shell>, "state" | "disabled" | "readOnly"> {
  label: string;
  value: number | undefined;
  onChange: (value: number | undefined) => void;
  error?: string;
  hint?: string;
  pidginHint?: string;
  showPidgin?: boolean;
  required?: boolean;
  tooltip?: React.ReactNode;
  autoCalc?: boolean;
  showAnnual?: boolean;
  className?: string;
}

// Component

export function MoneyInput({
  label,
  value,
  onChange,
  error,
  hint,
  pidginHint,
  showPidgin = false,
  required = false,
  tooltip,
  placeholder = "0",
  min,
  max,
  disabled = false,
  readOnly = false,
  autoCalc = false,
  showAnnual = false,
  id: externalId,
  className,
  size,
  ...props
}: MoneyInputProps) {
  const generatedId = useId();
  const id = externalId ?? generatedId;
  const errorId = `${id}-error`;
  const hasError = Boolean(error);
  const inputRef = useRef<HTMLInputElement>(null);

  // --- display state ---

  const [focused, setFocused] = useState(false);
  const [rawStr, setRawStr] = useState("");

  const displayValue = focused ? rawStr : value !== undefined ? fmt(value) : "";

  // handlers
  const handleFocus = () => {
    setFocused(true);
    setRawStr(value !== undefined ? String(value) : "");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const stripped = e.target.value.replace(/[^0-9]/g, "");

    setRawStr(stripped);

    const num = stripped === "" ? undefined : Number(stripped);

    onChange(num);
  };

  const handleBlur = () => {
    setFocused(false);

    if (value === undefined) return;

    const minNum = min !== undefined ? Number(min) : undefined;

    const maxNum = max !== undefined ? Number(max) : undefined;

    let next = value;

    if (minNum !== undefined && !Number.isNaN(minNum)) {
      next = Math.max(next, minNum);
    }

    if (maxNum !== undefined && !Number.isNaN(maxNum)) {
      next = Math.min(next, maxNum);
    }

    if (next !== value) {
      onChange(next);
    }
  };

  const annual = showAnnual && value ? value * 12 : null;

  const inactive = disabled || readOnly;

  return (
    <div className={cn("flex w-full flex-col", className)}>
      <FieldLabel
        htmlFor={id}
        required={required}
        tooltip={tooltip}
        hint={hint}
        pidginHint={pidginHint}
        showPidgin={showPidgin}
        autoCalc={autoCalc}
      >
        {label}
      </FieldLabel>
      {/* Input shell */}
      <div
        className={cn(
          shell({
            state: hasError ? "error" : "default",
            disabled,
            readOnly,
            size,
          }),
        )}
      >
        {/* N Prefix */}
        <span
          className={cn(
            prefixStyles({
              size,
              inactive,
            }),
          )}
        >
          ₦
        </span>
        <input
          ref={inputRef}
          id={id}
          inputMode="numeric"
          pattern="[0-9]*"
          disabled={disabled}
          readOnly={readOnly}
          aria-required={required}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          placeholder={placeholder}
          value={displayValue}
          onFocus={handleFocus}
          onChange={handleChange}
          onBlur={handleBlur}
          className={cn(
            inputStyles({
              size,
              inactive,
            }),
          )}
          {...props}
        />
      </div>

      {/* Annual projection */}
      {annual !== null && (
        <p className={annualText()}>
          <span className="opacity-60">x12 per year</span>

          <strong className="font-display font-normal text-text-primary ">
            {nairaFmt(annual)}
          </strong>
          <span className="opacity-60">/year</span>
        </p>
      )}
      {hasError && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}
