import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

const copyButton = cva(
  [
    "inline-flex items-center justify-center",
    "transition-all duration-150 east-out",
    "cursor-pointer flext-shrink-0",
    "focus-visible:outline-none",
    "focus-visible:ring-2 focus-visible:ring-brand/30",
    "active:scale-[0.96]",
  ],
  {
    variants: {
      mode: {
        icon: "border",
        inline: "border font-medium gap-1.5",
      },
      size: {
        sm: "",
        md: "",
      },
      copied: {
        true: "",
        false: "",
      },
    },
    compoundVariants: [
      // --- ICON MODE -----
      {
        mode: "icon",
        size: "sm",
        className: "h-7 w-7 rounded-sm",
      },
      {
        mode: "icon",
        size: "md",
        className: "h-7 w-[34px] rounded-sm",
      },
      {
        mode: "icon",
        copied: false,
        className: "border-border bg-transparent text-text-mute",
      },
      {
        mode: "icon",
        copied: true,
        className: "border-green-200 bg-primary-light text-brand",
      },

      // --- INLINE MODE ---

      {
        mode: "inline",
        size: "sm",
        className: "px-2.5 py-1 text-xs rounded-md",
      },
      {
        mode: "inline",
        size: "md",
        className: "px-3 py-1.5 text-sm rounded-md",
      },
      {
        mode: "inline",
        copied: false,
        className: "border-border bg-transparent text-text-muted",
      },
      {
        mode: "inline",
        copied: true,
        className: "border-border bg-transparent text-text-muted",
      },
    ],
    defaultVariants: {
      mode: "icon",
      size: "md",
      copied: false,
    },
  },
);

export interface CopyButtonProps
  extends
    Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "size">,
    VariantProps<typeof copyButton> {
  text: string;
  label?: string;
}

export function CopyButton({
  text,
  label = "Copy",
  mode,
  size,
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // fallback
      const el = document.createElement("textarea");

      el.value = text;

      document.body.appendChild(el);

      el.select();

      await navigator.clipboard.writeText(el.value);

      document.body.removeChild(el);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);
    }
  };

  const iconSize = size === "sm" ? "text-[13px]" : "text-[15px]";

  return (
    <button
      aria-label={copied ? "Copied" : label}
      onClick={handleCopy}
      className={cn(
        copyButton({
          mode,
          size,
          copied,
        }),
        className,
      )}
      {...props}
    >
      <i
        className={cn(copied ? "ti ti-check" : "ti ti-copy", iconSize)}
        aria-hidden
      />
      {mode === "inline" && <span>{copied ? "Copied" : label}</span>}
    </button>
  );
}
