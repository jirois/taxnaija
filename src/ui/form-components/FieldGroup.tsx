import React, { useId } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { FieldLabel } from "./FieldLabel";
import { FieldError } from "./FieldError";

// --- Styles ---
const fieldGroup = cva("flex flex-col w-full gap-0");

// Types

export interface FieldGroupProps {
  label: string;
  error?: string;
  hint?: string;
  pidginHint?: string;
  showPidgin?: boolean;
  required?: boolean;
  tooltip?: React.ReactNode;
  autoCalc?: boolean;
  children: React.ReactNode;
  className?: string;

  //** if provided, label htmlFor points here */
  htmlFor?: string;
}

// --- Component ---
export function FieldGroup({
  label,
  error,
  hint,
  pidginHint,
  showPidgin = false,
  required = false,
  tooltip,
  autoCalc = false,
  children,
  className,
  htmlFor,
}: FieldGroupProps) {
  const id = useId();

  const errorId = `${id}-error`;

  const hasError = Boolean(error);

  return (
    <div className={cn(fieldGroup(), className)}>
      <FieldLabel
        htmlFor={htmlFor}
        required={required}
        tooltip={tooltip}
        hint={hint}
        pidginHint={pidginHint}
        showPidgin={showPidgin}
        autoCalc={autoCalc}
      >
        {label}
      </FieldLabel>

      {children}

      {hasError && <FieldError id={errorId}>{error}</FieldError>}
    </div>
  );
}

// Hook

// eslint-disable-next-line react-refresh/only-export-components
export function useFieldIds(externalId?: string) {
  const generated = useId();

  const id = externalId ?? generated;

  return {
    id,
    errorId: `${id}-error`,
    hintId: `${id}-hint`,
  };
}
