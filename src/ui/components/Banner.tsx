import React, { useState } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";

// Shared Styles

const bannerShell = cva(
  [
    "flex items-start gap-3",
    "px-4 py-3",
    "border-b",
    "text-sm leading-relaxed",
    "font-body",
  ],
  {
    variants: {
      variant: {
        warning: "bg-warning-light border-amber-100 text-warning",
        danger: "bg-danger-light border-red-200 text-danger-text",
        success: "bg-primary-light border-green-200 text-text-primary",
        neutral: "bg-surface border-border text-text-muted",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

const alertShell = cva(
  [
    "flex items-start gap-3",
    "rounded-md",
    "border",
    "px-4 py-3",
    "text-sm leading-relaxed",
    "font-[var(--font-body)]",
  ],
  {
    variants: {
      variant: {
        info: "bg-info/40 border-blue-200 text-info",
        success: "bg-brand/40 border-green-200 text-text-primary",
        danger: "bg-danger/20 border-red-200 text-danger",
        pidgin: "bg-[#FEF0E8] border-[#F5C4A1] text-[#7C3010]",
      },
    },
  },
);

const dismissBtn = cva([
  "flex item-center justify-center",
  "h-6 w-6 shrink-0",
  "rounded-[var(--radius-sm)]",
  "bg-transparent",
  "opacity-60 hover:opacity-100",
  "transition-opacity",
]);

const titleClass = cva(["mb-1", "text-sm font-semibold"]);

// Base Components

interface BannerShellProps extends VariantProps<typeof bannerShell> {
  icon: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

function BannerShell({
  icon,
  children,
  onDismiss,
  variant,
  className,
}: BannerShellProps) {
  return (
    <div role="banner" className={cn(bannerShell({ variant }), className)}>
      <i className={cn(icon, "mt-0.5 shrink-0 text-base")} aria-hidden="true" />

      <div className="flex-1">{children}</div>

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className={dismissBtn()}
        >
          <i className="ti ti-x text-sm" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

interface AlertShellProps extends VariantProps<typeof alertShell> {
  icon: string;
  title?: string;
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

function AlertShell({
  icon,
  title,
  children,
  onDismiss,
  variant,
  className,
}: AlertShellProps) {
  return (
    <div role="alert" className={cn(alertShell({ variant }), className)}>
      <i
        className={cn(icon, "mt-0.5 shrink-0 text-[15px]")}
        aria-hidden="true"
      />
      <div className="flex-1">
        {title && <p className={titleClass()}>{title}</p>}
        <div>{children}</div>
      </div>

      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className={dismissBtn()}
        >
          <i className="ti ti-x text-sm" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

// Banners
interface BannerBaseProps {
  children?: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export interface DeadlineBannerProps extends BannerBaseProps {
  daysRemaining: number;
}

export function DeadlineBanner({
  daysRemaining,
  children,
  onDismiss,
  className,
}: DeadlineBannerProps) {
  const urgent = daysRemaining <= 14;

  return (
    <BannerShell
      icon={urgent ? "ti ti-alarm" : "ti ti-calendar-event"}
      variant="warning"
      onDismiss={onDismiss}
      className={className}
    >
      <strong>
        {daysRemaining <= 7
          ? `Only ${daysRemaining} day ${
              daysRemaining === 1 ? "" : "s"
            } left to file!`
          : `${daysRemaining} days to the March 31 filing deadline.`}
      </strong>
      {children && <span className="opacity-85"> {children} </span>}
    </BannerShell>
  );
}

export interface OverdueBannerProps extends BannerBaseProps {
  daysOverdue: number;
}

export function OverdueBanner({
  daysOverdue,
  children,
  onDismiss,
  className,
}: OverdueBannerProps) {
  return (
    <BannerShell
      icon="ti ti-alert-triangle-filled"
      variant="danger"
      onDismiss={onDismiss}
      className={className}
    >
      <strong>
        Your return is {daysOverdue} day
        {daysOverdue === 1 ? " " : "s"} overdue.
      </strong>{" "}
      Penalties of ₦50,000 minimum plus 10% of tax owed are accumulating.{" "}
      {children && <span>{children}</span>}
    </BannerShell>
  );
}

export function ZeroTaxBanner({
  children,
  onDismiss,
  className,
}: BannerBaseProps) {
  return (
    <BannerShell
      icon="ti ti-circle-check-filled"
      variant="success"
      onDismiss={onDismiss}
      className={className}
    >
      <strong>No tax owed.</strong> Your income falls within the ₦800,000
      zero-rate band under NTA 2025.{" "}
      <strong>You still need to file your annual return by March 31</strong>
      {children && <span>{children}</span>}
    </BannerShell>
  );
}
export function DisclaimerBanner({
  children,
  onDismiss,
  className,
}: BannerBaseProps) {
  return (
    <BannerShell
      icon="ti ti-shield"
      variant="neutral"
      onDismiss={onDismiss}
      className={className}
    >
      This tool guides your tax filing preparation but does not constitute
      professional tax advice. For complex situations, consult a certified tax
      professional or contact the{" "}
      <a
        href="https://www.nrs.gov.ng/"
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-text-primary underline"
      >
        Federal Inland Revenue Service
      </a>
      {children && <span>{children}</span>}
    </BannerShell>
  );
}

interface AlertBaseProps {
  children: React.ReactNode;
  title?: string;
  onDismiss?: () => void;
  className?: string;
}

export function InfoAlert({
  title,
  children,
  onDismiss,
  className,
}: AlertBaseProps) {
  return (
    <AlertShell
      icon="ti ti-info-circle"
      variant="info"
      title={title}
      onDismiss={onDismiss}
      className={className}
    >
      {children}
    </AlertShell>
  );
}

export function SuccessAlert({
  title,
  children,
  onDismiss,
  className,
}: AlertBaseProps) {
  return (
    <AlertShell
      icon="ti ti-circle-check"
      variant="success"
      title={title}
      onDismiss={onDismiss}
      className={className}
    >
      {children}
    </AlertShell>
  );
}

export function ErrorAlert({
  title,
  children,
  onDismiss,
  className,
}: AlertBaseProps) {
  return (
    <AlertShell
      icon="ti ti-alert-circle"
      variant="danger"
      title={title}
      onDismiss={onDismiss}
      className={className}
    >
      {children}
    </AlertShell>
  );
}

export interface PidginTipProps {
  children: React.ReactNode;
  onDismiss?: () => void;
  className?: string;
}

export function PidginTip({ children, onDismiss, className }: PidginTipProps) {
  return (
    <AlertShell
      icon="ti ti-message-circle"
      variant="pidgin"
      onDismiss={onDismiss}
      className={className}
    >
      <span className="italic"> {children}</span>
    </AlertShell>
  );
}

// Dismissible
export interface DismissibleProps {
  children: (dismiss: () => void) => React.ReactNode;
  storageKey?: string;
}

export function Dismissible({ children, storageKey }: DismissibleProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined" || !storageKey) {
      return true;
    }
    return localStorage.getItem(storageKey) !== "hidden";
  });

  const dismiss = () => {
    setVisible(false);

    if (storageKey) {
      localStorage.setItem(storageKey, "hidden");
    }
  };

  if (!visible) return null;

  return <>{children(dismiss)}</>;
}
