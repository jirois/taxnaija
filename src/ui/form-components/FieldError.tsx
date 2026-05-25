import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";

export interface FieldErrorProps {
  // Matches input aria-describedby
  id?: string;
  children: React.ReactNode;
  className?: string;
}

// Styles

const fieldError = cva([
  "flex items-start gap-1.5 mt-1",
  "text-xs leading-relaxed",
  "text-[var(--color-danger)]",
  "animate-in fade-in slide-in-from-top-1 duration-150",
]);

const iconStyle = cva("shrink-0 text-[13px] mt-[2px]");

export function FieldError({ id, children, className }: FieldErrorProps) {
  return (
    <p id={id} role="alert" className={cn(fieldError(), className)}>
      {/* Replace later with SVG icon system */}
      <i className={cn("ti ti-alert-circle", iconStyle())} aria-hidden="true" />
      <span>{children}</span>
    </p>
  );
}
