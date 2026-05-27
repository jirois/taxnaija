import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

export type SaveState = "idle" | "saving" | "saved" | "error";

export interface AutoSaveIndicatorProps {
  state: SaveState;
  className?: string;
}

// Container Styles
const indicator = cva(
  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
  {
    variants: {
      state: {
        saving: "text-muted-foreground",
        saved: "text-primary bg-primary/10",
        error: "text-red-600 bg-red-100",
        idle: "hidden",
      },
      visible: {
        true: "animate-fade-in",
        false: "hidden",
      },
    },
    defaultVariants: {
      visible: true,
      state: "idle",
    },
  },
);

// spinner

function Spinner() {
  return (
    <svg
      className="w-3 h-3 animate-spin"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="8"
        cy="8"
        r="6"
        className="stroke-current opacity-30"
        strokeWidth="2"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        className="stroke-current"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// --- component ---
export function AutoSaveIndicator({
  state,
  className,
}: AutoSaveIndicatorProps) {
  if (state === "idle") return null;

  const content = {
    saving: "Saving...",
    saved: "Saved",
    error: "Not saved",
  };

  return (
    <div
      className={cn(indicator({ state, visible: true }), className)}
      role="status"
      aria-live="polite"
    >
      {state === "saving" ? (
        <Spinner />
      ) : (
        <i
          className={
            state === "saved"
              ? "ti ti-check text-text-primary"
              : "ti ti-alert-circle text-red-600"
          }
          aria-hidden="true"
        />
      )}
      <span>{content[state]}</span>
    </div>
  );
}
