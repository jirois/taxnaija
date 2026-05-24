import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/cn";

// --- Spinner variants ----
const spinnerVariants = cva("inline-block animate-spin shrink-0", {
  variants: {
    size: {
      sm: "h-4 w-4 sm:h-3 sm:w-3",
      md: "h-5 w-5 sm:h-4 sm:w-4",
      lg: "h-8 w-8 sm:h-6 sm:w-6",
    },
    color: {
      primary: "text-brand",
      white: "text-white",
      muted: "text-text-muted",
      inherit: "text-current",
    },
  },
  defaultVariants: {
    size: "md",
    color: "primary",
  },
});

export interface SpinnerProps extends VariantProps<typeof spinnerVariants> {
  label?: string;
}

export function Spinner({ size, color, label = "loading" }: SpinnerProps) {
  return (
    <svg
      className={cn(spinnerVariants({ size, color }))}
      viewBox="0 0 24 24"
      fill="none"
      role="status"
      aria-label={label}
    >
      {/* Track ring */}
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="2"
        strokeOpacity="0.18"
      />
      {/* Active arc */}
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// --- Full-page loading overlay ---
export function SpinnerOverlay({ label = "Loading" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="
     fixed inset-0 z-300
     flex items-center justify-center
     bg-[rgba(250,250,247,0.72)]
     backdrop-blur-[2px]
     "
    >
      <div className="flex flex-col items-center gap-3">
        <Spinner size="lg" />
        <p className="text-sm text-text-muted">{label}</p>
      </div>
    </div>
  );
}

// --- Inline spinner row ----

export function SpinnerRow({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-2 py-3 text-sm text-text-muted">
      <Spinner size="sm" color="muted" />
      <span>{label}</span>
    </div>
  );
}
