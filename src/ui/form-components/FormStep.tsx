import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { NavButtons, type NavButtonsProps } from "../NavButton";

// layout container
const stepWrapper = cva("flex flex-col h-full w-full");

// header spacing
const header = cva("mb-6");

// step badge row
const stepMeta = cva("flex items-center gap-3 mb-2");

// step number badge
const stepBadge = cva("w-6 h-6 rounded-full flex items-center justify-center", {
  variants: {
    variant: {
      default: "bg-brand text-white",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

// step label
const stepLabel = cva(
  "text-xs font-semibold uppercase tracking-widest text-brand",
);

// title
const title = cva("font-display text-2xl leading-tight text-text-primary");

// subtitle
const subtitleStyles = cva("text-base text-text-muted leading-relaxed");

// content area
const content = cva("flex flex-col gap-5 flex-1");

// footer (nav container spacing)
const footer = cva("pt-6 mt-auto");

export interface FormStepProps {
  stepNumber: number;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
  nav: NavButtonsProps;
  className?: string;
}

export function FormStep({
  stepNumber,
  title: stepTitle,
  subtitle,
  children,
  nav,
  className,
}: FormStepProps) {
  return (
    <div className={cn(stepWrapper(), className)}>
      {/* Header */}
      <div className={header()}>
        <div className={stepMeta()}>
          <span className={stepBadge()}>{stepNumber}</span>
          <span className={stepLabel()}>Step {stepNumber}</span>
        </div>
        <h2 className={title()}>{stepTitle}</h2>
        {subtitle && <p className={subtitleStyles()}>{subtitle}</p>}
      </div>
      {/* Body */}
      <div className={content()}>{children}</div>

      {/* Footer */}
      <div className={footer()}>
        <NavButtons {...nav} />
      </div>
    </div>
  );
}
