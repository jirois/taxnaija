import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

export type TooltipPlacement = "top" | "bottom" | "left" | "right";

const tooltip = cva(
  [
    "absolute z-dropdown",
    "pointer-events-none whitespace-normal",
    "rounded-sm px-2.5 py-1.5",
    "font-body text-xs leading-[1.5]",
    "bg-gray-900 text-[#FAFAF7]",
    "transition-opacity duration-150 ease-out",
    "hidden sm:block",
  ],
  {
    variants: {
      placement: {
        top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
        bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
        left: "right-full top-1/2 -translate-y-1/2 mr-2",
        right: "left-full top-1/2 -translate-y-1/2 ml-2",
      },

      visible: {
        true: "opacity-100",
        false: "opacity-0",
      },
    },

    defaultVariants: {
      placement: "top",
      visible: false,
    },
  },
);

export interface TooltipProps extends VariantProps<typeof tooltip> {
  content: React.ReactNode;
  delay?: number;
  maxWidth?: number;
  children: React.ReactElement;
}

export function Tooltip({
  content,
  placement,
  delay = 400,
  maxWidth = 240,
  children,
}: TooltipProps) {
  const [visible, setVisible] = React.useState(false);

  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = () => {
    timer.current = setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hide = () => {
    if (timer.current) clearTimeout(timer.current);
    setVisible(false);
  };

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocusCapture={show}
      onBlurCapture={hide}
    >
      {children}

      {content && (
        <span
          role="tooltip"
          aria-hidden={!visible}
          className={cn(
            tooltip({
              placement,
              visible,
            }),
          )}
          style={{ maxWidth }}
        >
          {content}
        </span>
      )}
    </span>
  );
}
