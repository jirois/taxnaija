import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const externalLink = cva(
  [
    "inline-flex items-center gap-1",
    "font-medium text-brand",
    "transition-colors duration-150",
    "hover:underline",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-brand",
    "focus-visible:ring-offset-2",
    "rounded-sm",
    "touch-manipulation",
  ],
  {
    variants: {
      size: {
        sm: "text-xs sm:text-sm",
        md: "text-sm sm:text-base",
        lg: "text-base sm:text-lg",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
const iconStyles = cva("shrink-0", {
  variants: {
    size: {
      sm: "text-[10px] sm:text-xs",
      md: "text-xs sm:text-sm",
      lg: "text-sm sm:text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

export interface ExternalLinkProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof externalLink> {
  href: string;
  children: React.ReactNode;
  showIcon?: boolean;
}

export function ExternalLink({
  href,
  children,
  showIcon = true,
  size,
  className,
  ...props
}: ExternalLinkProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(externalLink({ size }), className)}
      {...props}
    >
      <span>{children}</span>

      {showIcon && (
        <i
          className={cn("ti ti-external-link", iconStyles({ size }))}
          aria-label="(opens in new tab)"
        />
      )}
    </a>
  );
}
