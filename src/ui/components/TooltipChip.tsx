import { useState, useId } from "react";
import { cva } from "class-variance-authority";
import clsx from "clsx";

// Chip Styles

const chipStyles = cva(
  "inline-flex items-center gap-1 rounded-full border px-2 py-[2px] text-xs font-medium transition-colors whitespace-nowrap cursot-pointer",
  {
    variants: {
      state: {
        closed: "text-amber-500 bg-amber-50 border-amber-100",
        open: "text-amber-700 bg-amber-100 border-amber-200",
      },
    },
    defaultVariants: {
      state: "closed",
    },
  },
);

// Panel Styles
const panelStyles = cva(
  "absolute z-50 min-w-[260px] max-w-[320px] rounded-md border border-neutral-200 bg-white shadow-md p-3 animate-in fade-in-0 zoom-in-95",
);

// Props

export interface TooltipChipProps {
  label: string;
  title?: string;
  children: React.ReactNode;
  placement?: "below" | "above";
}

// Component

export function TooltipChip({
  label,
  title,
  children,
  placement = "below",
}: TooltipChipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span className="relative inline-flex flex-col">
      {/* Chip button */}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className={chipStyles({ state: open ? "open" : "closed" })}
      >
        <i
          className={clsx(
            "text-[11px]",
            open ? "ti ti-x" : "ti ti-info-circle",
          )}
          aria-hidden="true"
        />
        {label}
      </button>

      {/* Panel */}
      {open && (
        <span
          id={id}
          role="region"
          aria-label={title ?? label}
          className={clsx(
            panelStyles(),
            placement === "below"
              ? `top-[cal(100%+8px)]`
              : `bottom-[calc(100%+8px)]`,
          )}
        >
          {/* top accent line */}
          <span className="absolute top-0 left-0 right-0 h-0.75 bg-amber-300 rounded-t-md" />

          {(title ?? label) && (
            <p className="text-sm font-semibold text-neutral-900 mb-1 mt-1">
              {title ?? label}
            </p>
          )}
          <div className="text-sm text-neutral-700 leading-relaxed">
            {children}
          </div>
        </span>
      )}
    </span>
  );
}
