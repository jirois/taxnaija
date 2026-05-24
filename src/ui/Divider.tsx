import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const divider = cva("w-full border-none bg-border shrink-0", {
  variants: {
    spacing: {
      none: "my-0",
      sm: "my-3",
      md: "my-5",
      lg: "my-8",
    },
  },
  defaultVariants: {
    spacing: "md",
  },
});

const dividerLabel = cva([
  "text-xs font-medium text-text-muted",
  "uppercase tracking-[0.07rem]",
  "whitespace-nowrap",
]);

export interface DividerProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof divider> {
  label?: React.ReactNode;
}

export function Divider({ label, spacing, className, ...props }: DividerProps) {
  // Simple divider
  if (!label) {
    return (
      <hr
        aria-hidden="true"
        className={cn(divider({ spacing }), "h-px", className)}
      />
    );
  }

  // Labeled divider
  return (
    <div
      role="separator"
      className={cn(
        "flex items-center gap-3 w-full",
        divider({ spacing }),
        className,
      )}
      {...props}
    >
      <span className="flex-1 h-px bg-border" />
      <span className={cn(dividerLabel())}>{label}</span>
      <span className="flex-1 h-px bg-border" />
    </div>
  );
}
