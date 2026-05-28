import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

export type FilingStatus =
  | "filed"
  | "not-filed"
  | "overdue"
  | "in-progress"
  | "pending";

export interface StatusBadgeProps extends VariantProps<typeof badgeVariants> {
  status: FilingStatus;
  className?: string;
}

const badgeVariants = cva(
  "inline-flex items-center whitespace-nowrap rounded-full border font-medium transition-colors",
  {
    variants: {
      status: {
        filed: "border-green-200 bg-green-50 text-green-700",
        "not-filed": "border-border bg-muted text-text-muted",
        overdue: "border-red-200 bg-red-50 text-red-700",
        "in-progress": "border-amber-200 bg-amber-50 text-amber-700",
        pending: "border-blue-200 bg-blue-50 text-blue-700",
      },
      size: {
        sm: "gap-1 px-2 py-0.5 text-xs",
        md: "gap-1.5 px-2.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const STATUS_MAP: Record<
  FilingStatus,
  {
    label: string;
    icon: string;
  }
> = {
  filed: {
    label: "Filed",
    icon: "ti ti-circle-check",
  },
  "not-filed": {
    label: "Not yet filed",
    icon: "ti ti-circle-dashed",
  },
  overdue: {
    label: "Overdue",
    icon: "ti ti-alert-circle",
  },
  "in-progress": {
    label: "In progress",
    icon: "ti ti-loader",
  },
  pending: {
    label: "Pending review",
    icon: "ti ti-clock",
  },
};

export function StatusBadge({ status, size, className }: StatusBadgeProps) {
  const cfg = STATUS_MAP[status];

  return (
    <span
      role="status"
      className={cn(
        badgeVariants({
          status,
          size,
        }),
        className,
      )}
    >
      <i
        className={cn(
          cfg.icon,
          size === "sm" ? "text-[11px]" : "text-[13px]",
          status === "in-progress" && "animate-spin",
        )}
        aria-hidden="true"
      />
      <span>{cfg.label}</span>
    </span>
  );
}
