import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";
import { Button } from "./Button";

// --- EmptyState Variants ---

const emptyState = cva(
  ["flex flex-col items-center justify-center text-center", "w-full"],
  {
    variants: {
      size: {
        sm: "gap-3 p-5",
        md: "gap-4 p-8",
        lg: "gap-5 p-12",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const iconWrapper = cva(
  [
    "rounded-full flex items-center justify-center shrink-0",
    "bg-[var(--color-brand-light)]",
  ],
  {
    variants: {
      size: {
        sm: "w-10 h-10",
        md: "w-14 h-14",
        lg: "w-[72px] h-[72px]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const iconStyles = cva("text-[var(--color-brand)]", {
  variants: {
    size: {
      sm: "text-[20px]",
      md: "text-[28px]",
      lg: "text-[36px]",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const titleStyles = cva(
  [
    "font-medium font-[var(--font-display)]",
    "text-[var(--color-text-primary)]",
    "leading-tight",
  ],
  {
    variants: {
      size: {
        sm: "text-base",
        md: "text-lg",
        lg: "text-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const descriptionStyles = cva(
  ["text-[var(--color-text-muted)]", "leading-relaxed", "max-w-[320px]"],
  {
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
  },
);

// --- Types ---

// type EmptyStateSize = "sm" | "md" | "lg";

export interface EmptyStateProps extends VariantProps<typeof emptyState> {
  icon?: string;
  title: string;
  description?: React.ReactNode;

  action?: {
    label: string;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    variant?: "primary" | "secondary" | "ghost" | "danger";
  };

  className?: string;
}

// --- Component ---

export function EmptyState({
  icon = "ti ti-inbox",
  title,
  description,
  action,
  size,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn(emptyState({ size }), className)}>
      {/* Icon */}
      <div className={cn(iconWrapper({ size }))}>
        <i className={cn(icon, iconStyles({ size }))} aria-hidden="true" />
      </div>
      {/* Text */}
      <div className="flex flex-col gap-1.5">
        <p className={cn(titleStyles({ size }))}>{title}</p>

        {description && (
          <p className={cn(descriptionStyles({ size }))}>{description}</p>
        )}
      </div>

      {/* Action */}
      {action && (
        <Button
          variant={action.variant ?? "primary"}
          size="md"
          onClick={action.onClick}
          className="mt-1"
        >
          {action.label}
        </Button>
      )}
    </div>
  );
}
