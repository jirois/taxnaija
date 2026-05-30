import React, { useEffect, useRef, useId, useCallback } from "react";
import { createPortal } from "react-dom";
import { cva } from "class-variance-authority";
import { IconButton } from "../IconButton";

// Size map

const sizeStyles = cva(
  "w-full max-h-[92vh] bg-bg-elevated shadow-2xl flex flex-col overflow-hidden",
  {
    variants: {
      size: {
        sm: "max-w-[400px]",
        md: "max-w-[520px]",
        lg: "max-w-[640px]",
        full: "max-w-full rounded-b-none rounded-t-2xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
// Backdrop

const backdropStyles = cva(
  "fixed inset-0 bg-black/50 backdrop-blur-sm z-[var(--z-modal)] animate-fade-in",
);

// Panel wrapper
const wrapperStyles = cva(
  "fixed inset-0 z-[var(--z-modal)] flex overflow-y-auto",
  {
    variants: {
      size: {
        full: "items-end justify-center p-0",
        default: "items-center justify-center p-4",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

// Header

const headerStyles = cva(
  "flex items-start gap-3 px-5 py-5 border-b border-border",
);

// Body / Footer

const bodyStyles = "flex-1 overflow-y-auto p-5";

const footerStyles = "border-t border-border px-5 py-3 bg-elevated";

// CONSTANTS

const FOCUSABLE =
  "a[href], button:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex='-1'])";

// Types

export type ModalSize = "sm" | "md" | "lg" | "full";

export interface ModalBaseProps {
  open: boolean;
  onClose: () => void;
  title: React.ReactNode;
  description?: React.ReactNode;
  size?: ModalSize;
  closeOnBackdrop?: boolean;
  showClose?: boolean;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  initialFocusRef?: React.RefObject<HTMLElement>;
}

// Component

export function ModalBase({
  open,
  onClose,
  title,
  description,
  size = "md",
  closeOnBackdrop = true,
  showClose = true,
  headerRight,
  footer,
  children,
  initialFocusRef,
}: ModalBaseProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<Element | null>(null);

  // Lock scroll
  useEffect(() => {
    if (!open) return;
    triggerRef.current = document.activeElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // restore focus
  useEffect(() => {
    if (!open && triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus();
    }
  }, [open]);

  // initial focus
  useEffect(() => {
    if (!open) return;

    const frame = requestAnimationFrame(() => {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
      } else {
        const first = panelRef.current?.querySelector<HTMLElement>(FOCUSABLE);
        first?.focus();
      }
    });
    return () => cancelAnimationFrame(frame);
  }, [open, initialFocusRef]);

  // escape
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // focus trap
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key !== "Tab") return;

      const panel = panelRef.current;

      if (!panel) return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE),
      );

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [],
  );

  if (!open) return null;

  return createPortal(
    <>
      {/* BACKDROP */}
      <div
        aria-hidden="true"
        onClick={closeOnBackdrop ? onClose : undefined}
        className={backdropStyles()}
      />

      {/* WRAPPER */}
      <div
        className={wrapperStyles({
          size: size === "full" ? "full" : "default",
        })}
      >
        {/* PANEL */}
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onKeyDown={handleKeyDown}
          className={sizeStyles({ size })}
        >
          {/* HEADER */}
          <div className={headerStyles()}>
            <div className="flex-1 min-w-0">
              <h2
                id={titleId}
                className="text-xl font-normal font-display text-text-primary leading-snug"
              >
                {title}
              </h2>
              {description && (
                <p className="mt-1 text-sm text-text-muted leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {headerRight}

            {showClose && (
              <IconButton
                icon="ti ti-x"
                label="Close"
                variant="ghost"
                size="md"
                onClick={onClose}
              />
            )}
          </div>

          {/* BODY */}
          <div className={bodyStyles}>{children}</div>

          {/* FOOTER */}
          {footer && <div className={footerStyles}>{footer}</div>}
        </div>
      </div>
    </>,
    document.body,
  );
}
