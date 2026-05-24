import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const button = cva(
  [
    "inline-flex items-center justify-center gap-2 cursor-pointer",
    "font-medium rounded-md border",
    "transition-all duration-150 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:opacity-50 disabled:pointer-events-none",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        primary:
          "bg-brand text-white border-brand hover:opacity-90 focus-visible:ring-brand ",

        secondary:
          "bg-surface text-brand border-border hover:bg-surface-elevated",

        ghost: "bg-transparent border-transparent text-muted hover:bg-surface",

        danger:
          "bg-danger text-white border-danger hover:opacity-90 focus-visible:ring-danger",
      },

      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
      },

      fullWidth: {
        true: "w-full",
      },
    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof button> & {
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

export function Button({
  className,
  variant,
  size,
  fullWidth,
  loading,
  leftIcon,
  rightIcon,
  children,
  disabled,
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      disabled={isDisabled}
      className={cn(button({ variant, size, fullWidth }), className)}
      {...props}
    >
      {loading ? (
        <span className="animate-pulse">Loading...</span>
      ) : (
        <>
          {leftIcon && <span className="flex items-center">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="flex items-center">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
