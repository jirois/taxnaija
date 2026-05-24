/**
 * Toggle.tsx
 * Accessible on/off switch. Used for:
 *   - Pidgin mode (language switch)
 *   - Optional deduction fields (show/hide NHF, NHIS)
 *   - Any boolean preference
 *
 * Renders a <button role="switch"> with aria-checked for full a11y.
 * Label can appear left or right.
 */
import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

const track = cva(
  "relative inline-flex items-center shrink-0 rounded-full border transition-colors duration-200 ease-out cursor-pointer",
  {
    variants: {
      size: {
        sm: "w-8 h-4",
        md: "w-11 h-6",
      },
      checked: {
        true: "",
        false: "",
      },
      disabled: {
        true: "opacity-50 cursor-not-allowed",
      },
    },
    compoundVariants: [
      {
        checked: true,
        class: "bg-brand border-brand",
      },
      {
        checked: false,
        class: "bg-surface border-border",
      },
    ],
    defaultVariants: {
      size: "md",
      checked: false,
      disabled: false,
    },
  },
);

const knob = cva(
  "absolute rounded-full bg-white shadow transition-all duration-200 ease-out",
  {
    variants: {
      size: {
        sm: "h-3 w-3",
        md: "h-4 w-4",
      },
      checked: {
        true: "translate-x-full",
        false: "translate-x-0",
      },
    },
  },
);

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  labelSide?: "left" | "right";
  size?: "sm" | "md";
  disabled?: boolean;
  id?: string;
  hint?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  labelSide = "right",
  size = "md",
  disabled = false,
  id,
  hint,
}: ToggleProps) {
  return (
    <div className="inline-flex flex-col gap-1">
      <div
        className={cn(
          "inline-flex items-center gap-2",
          labelSide === "left" && "flex-row-reverse",
        )}
      >
        <button
          id={id}
          role="switch"
          aria-checked={disabled}
          onClick={() => !disabled && onChange(!checked)}
          className={track({ size, checked, disabled })}
        >
          <span
            className={cn(
              knob({ size, checked }),
              size === "sm" ? "left-0.5 top-0.5" : "left-1 top-1",
            )}
          />
          <span className="sr-only">{checked ? "on" : "off"}</span>
        </button>
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
      </div>
      {hint && <span className="text-xs text-text-muted pl-2">{hint}</span>}
    </div>
  );
}
