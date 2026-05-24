import React, { useRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

// --- styles ---

const itemWrapper = cva("border-b border-border", {
  variants: {
    bordered: {
      true: "",
      false: "border-b-0",
    },
  },
});

const buttonBase = cva(
  [
    "w-full flex items-center justify-between gap-3",
    "py-4",
    "text-left",
    "font-medium font-[var(--font-body)]",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand",
  ],
  {
    variants: {
      open: {
        true: "text-brand",
        false: "text-text-primary",
      },
    },
  },
);

const iconBase = cva("text-[16px] shrink-0 transition-transform duration-300", {
  variants: {
    open: {
      true: "rotate-180 text-brand",
      false: "rotate-0 text-text-muted",
    },
  },
});

const contentBase = cva(
  "overflow-hidden transition-[max-height] duration-500 ease-out",
);

// --- Accordion item ---
export interface AccordionItemProps {
  question: React.ReactNode;
  answer: React.ReactNode;
  open?: boolean;
  onToggle?: () => void;
  defaultOpen?: boolean;
  bordered?: boolean;
}

export function AccordionItem({
  question,
  answer,
  open,
  onToggle,
  defaultOpen = false,
  bordered = true,
}: AccordionItemProps) {
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const [height, setHeight] = React.useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;

  const toggle = () => {
    if (isControlled) onToggle?.();
    else setInternalOpen((v) => !v);
  };

  React.useLayoutEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <div className={cn(itemWrapper({ bordered }))}>
      <button
        aria-expanded={isOpen}
        onClick={toggle}
        className={cn(buttonBase({ open: isOpen }))}
      >
        <span className="flex-1">{question}</span>

        <i
          className={cn("ti ti-chevron-down", iconBase({ open: isOpen }))}
          aria-hidden="true"
        />
      </button>

      <div
        ref={contentRef}
        className={contentBase()}
        style={{
          maxHeight: isOpen ? `${height}px` : "0px",
        }}
      >
        <div className="pb-4 text-base text-text-body leading-relaxed">
          {answer}
        </div>
      </div>
    </div>
  );
}

// --- Accordion Group ---

export interface AccordionGroupProps {
  items: Array<{
    id: string;
    question: React.ReactNode;
    answer: React.ReactNode;
  }>;
  defaultOpenId?: string;
}

export function AccordionGroup({ items, defaultOpenId }: AccordionGroupProps) {
  const [openId, setOpenId] = React.useState<string | null>(
    defaultOpenId ?? null,
  );

  return (
    <div className="w-full">
      {items.map((item) => (
        <AccordionItem
          key={item.id}
          question={item.question}
          answer={item.answer}
          open={openId === item.id}
          onToggle={() => setOpenId(openId === item.id ? null : item.id)}
        />
      ))}
    </div>
  );
}
