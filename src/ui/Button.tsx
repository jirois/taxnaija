/**
 * Button.tsx
 * Primary interactive element. Four variants x two sizes x loading state
 *
 * Variants:
 *  primary  -- filled green, white text (main CTAs)
 *  secondary -- white bg, green border + text (secondary actions)
 *  ghost -- no border, muted text (tertiary actions)
 *  danger -- filled red (destructive: reset, delete)
 *
 * Sizes:
 *    md  (default) -- 40px height, 15px text
 *    sm  -- 32px height, 13px text
 *    lg -- 48px height, 16px text
 */

import React from "react";
export type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  children,
  style,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const base: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "6px",
    fontFamily: "var(--font-body)",
    fontWeight: "var(--weight-medium)" as React.CSSProperties["fontWeight"],
    lineHeight: 1,
    border: "1px solid transparent",
    borderRadius: "var(--radius-md)",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.52 : 1,
    transition: `background var(--duration-fast) var(--ease-out),
                     border-color var(--duration-fast) var(--ease-out),
                     opacity var(--duration-fast) var(--ease-out),
                     transform var(--duration-fast) var(--ease-out)`,
    width: fullWidth ? "100%" : undefined,
    whiteSpace: "nowrap",
    userSelect: "none",
    position: "relative",
    overflow: "hidden",
    // size
    ...sizeStyles[size],
  };

  const variantStyle = variantStyles[variant];

  return (
    <button
      disabled={isDisabled}
      style={{ ...base, ...variantStyle, ...style }}
      onMouseDown={(e) => {
        if (!isDisabled) e.currentTarget.style.transform = "scale(0.978";
      }}
      onMouseUp={(e) => {
        e.currentTarget.style.transform = "";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "";
      }}
      {...props}
    >
      {loading ? (
        <>
          <Spinner
            size={size === "sm" ? 12 : 14}
            color={
              variant === "primary" || variant === "danger"
                ? "white"
                : "var(--color-primary)"
            }
          />
          <span style={{ opacity: 0 }}>{children}</span>
        </>
      ) : (
        <>
          {leftIcon && (
            <span style={{ display: "flex", alignItems: "center" }}>
              {leftIcon}
            </span>
          )}
          {children}
          {rightIcon && (
            <span style={{ display: "flex", alignItems: "center" }}>
              {leftIcon}
            </span>
          )}
        </>
      )}
    </button>
  );
}

// ── Inline spinner (avoids circular dep with Spinner.tsx) ─────────────────────
function Spinner({
  size = 14,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      style={{ animation: "btn-spin 0.7s linear infinite", flexShrink: 0 }}
    >
      <style>{`@keyframes btn-spin { to { transform: rotate(360deg); } }`}</style>
      <circle
        cx="8"
        cy="8"
        r="6"
        stroke={color}
        strokeWidth="2"
        strokeOpacity="0.25"
      />
      <path
        d="M14 8a6 6 0 0 0-6-6"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Style maps ────────────────────────────────────────────────────────────────

const sizeStyles: Record<ButtonSize, React.CSSProperties> = {
  sm: { height: 32, padding: "0 12px", fontSize: "var(--text-sm)" },
  md: { height: 40, padding: "0 18px", fontSize: "var(--text-base)" },
  lg: { height: 48, padding: "0 24px", fontSize: "var(--text-md)" },
};

const variantStyles: Record<ButtonVariant, React.CSSProperties> = {
  primary: {
    background: "var(--color-primary)",
    borderColor: "var(--color-primary)",
    color: "#FFFFFF",
  },
  secondary: {
    background: "var(--color-bg-elevated)",
    borderColor: "var(--color-border-strong)",
    color: "var(--color-primary)",
  },
  ghost: {
    background: "transparent",
    borderColor: "transparent",
    color: "var(--color-text-muted)",
  },
  danger: {
    background: "var(--color-danger)",
    borderColor: "var(--color-danger)",
    color: "#FFFFFF",
  },
};
