import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Tooltip, type TooltipPlacement } from "./Tooltip";

const iconButton = cva(
  [
    "inline-flex items-center justify-center",
    "border rounded-md flex-shrink-0",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-offset-2",
    "active:scale-[0.94]",
    "disabled:opacity-50 disabled:pointer-events-none",
  ],
  {
    variants: {
      variant: {
        default: [
          "bg-surface-elevated",
          "border-border",
          "text-text-primary",
          "hover:bg-surface",
          "focus-visible:ring-brand",
        ],

        ghost: [
          "bg-transparent",
          "border-transparent",
          "text-text-muted",
          "hover:bg-surface",
          "focus-visible:ring-brand",
        ],

        danger: [
          "bg-red-50",
          "border-border",
          "text-danger",
          "hover:bg-red-100",
          "focus-visible:ring-danger",
        ],
      },

      size: {
        sm: "h-9 w-9 sm:h-8 sm:w-8",
        md: "h-11 w-11 sm:h-9 sm:w-9",
        lg: "h-13 w-13 sm:h-11 sm:w-11",
      },
    },

    defaultVariants: {
      variant: "ghost",
      size: "md",
    },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof iconButton> & {
    icon: string;
    label: string;
    tooltipPlacement?: TooltipPlacement;
    showTooltip?: boolean;
  };

export function IconButton({
  icon,
  label,
  variant,
  size,
  tooltipPlacement = "top",
  showTooltip = true,
  className,
  disabled,
  ...props
}: Props) {
  const button = (
    <button
      aria-label={label}
      disabled={disabled}
      className={cn(iconButton({ variant, size }), className)}
      {...props}
    >
      <i className={icon} aria-hidden="true" />
    </button>
  );

  if (!showTooltip) return button;

  return (
    <Tooltip content={label} placement={tooltipPlacement}>
      {button}
    </Tooltip>
  );
}
