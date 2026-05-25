import React from "react";
import { cva } from "class-variance-authority";
import { cn } from "../../lib/cn";

export interface FieldLabelProps {
  htmlFor?: string;
  required?: boolean;
  tooltip?: React.ReactNode;
  hint?: string;
  pidginHint?: string;
  showPidgin?: boolean;
  autoCalc?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Label container
const wrapper = cva("flex flex-col gap-1 mb-2");

// Label row
const row = cva("flex items-center gap-2 flex-wrap");

// Label text
const labelText = cva(
  "font-medium uppercase tracking-wider text-[11px] leading-tight text-text-muted",
);

//  Badge (auto calc)
const badge = cva(
  "inline-flex items-center gap-1 px-2 py-[2px] text-[10px] rounded-full border border-border bg-surface text-text-muted",
);

// Hint
const hintText = cva("text-xs text-text-mutex leading-relaxed");

// Pidgin hint
const pidginBox = cva(
  "text-xs italic text-[#7C3010] bg-[#FEF0E8] border border-[#F5C4A1] rounded-sm px-2 py-1 flex items-start gap-2",
);

export function FieldLabel({
  htmlFor,
  required,
  tooltip,
  hint,
  pidginHint,
  showPidgin,
  autoCalc,
  children,
  className,
}: FieldLabelProps) {
  const LabelTag = htmlFor ? "label" : "span";

  return (
    <div className={cn(wrapper(), className)}>
      {/* ROW */}
      <div className={row()}>
        <LabelTag
          htmlFor={htmlFor}
          className={cn(labelText(), htmlFor && "cursor-pointer")}
        >
          {children}
        </LabelTag>
        {required && (
          <span
            className="text-red-500 text-sm leading-none"
            aria-label="required"
          >
            *
          </span>
        )}
        {autoCalc && (
          <span className={badge()}>
            {/* replace icon-font later if needed */}
            <span className="text-[10px]">🧮</span>
            auto-calculated
          </span>
        )}
        {tooltip}
      </div>
      {/* HINT */}
      {hint && <p className={hintText()}>{hint}</p>}
      {/* PIDGIN */}
      {showPidgin && pidginHint && (
        <p className={pidginBox()}>
          <span className="text-[12px]">💬</span>
          {pidginHint}
        </p>
      )}
    </div>
  );
}
