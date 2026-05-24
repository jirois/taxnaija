import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const card = cva("rounded-lg overflow-hidden tranition-all", {
  variants: {
    variant: {
      default: "bg-surface-elevated border border-border shadow-sm",
      surface: "bg-surface border border-border",
      outline: "bg-transparent border border-border-strong",
      accent:
        "bg-surface-elevated border border-border border-l-4 border-l-brand rounded-r-lg",
    },
    padding: {
      none: "",
      sm: "p-3 sm:p-3.5",
      md: "p-4 sm:p-5",
      lg: "p-6 sm:p-7",
    },
  },
  defaultVariants: {
    variant: "default",
    padding: "md",
  },
});

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof card> {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  as?: React.ElementType;
}

export function Card({
  variant,
  padding,
  header,
  footer,
  className,
  as: Tag = "div",
  children,
  ...props
}: CardProps) {
  return (
    <Tag className={cn(card({ variant, padding }), className)} {...props}>
      {header && (
        <>
          <div className="pb-0">{header}</div>
          <Divider />
        </>
      )}
      <div>{children}</div>
      {footer && (
        <>
          <Divider />
          <div className="pt-0">{footer}</div>
        </>
      )}
    </Tag>
  );
}

function Divider() {
  return <div className="h-px bg-border w-full" />;
}
