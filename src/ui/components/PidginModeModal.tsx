import { cva } from "class-variance-authority";
import { ModalBase } from "./ModalBase";
import { Button } from "../Button";

const previewHeaderVariants = cva("px-4 py-2.5 border-b");

const previewColumnVariants = cva("px-3.5 py-3", {
  variants: {
    language: {
      english: "",
      pidgin: "bg-[#FFFAF7]",
    },
  },
  defaultVariants: {
    language: "english",
  },
});

const previewTextVariants = cva("text-sm leading-relaxed", {
  variants: {
    language: {
      english: "text-text-body",
      pidgin: "text-[#7C3010] italic",
    },
  },
  defaultVariants: {
    language: "english",
  },
});

const sectionLabelVariants = cva(
  "mb-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-text-muted",
);

export interface PidginModeModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const PREVIEW_PAIRS = [
  {
    en: "Do I still need to file if my employer deducts PAYE?",
    pg: "If my oga don dey collect tax from my salary, I still need file?",
  },
  {
    en: "Your tax liability for 2026 is ₦136,200.",
    pg: "The tax wey you go pay for 2026 na ₦136,200.",
  },
  {
    en: "Filing deadline: March 31 — 18 days remaining.",
    pg: "You get 18 days remain to file — March 31 dey come!",
  },
  {
    en: "Rent relief applied: 20% of rent, capped at ₦500,000.",
    pg: "We don add your rent relief — 20% of rent, but e no pass ₦500,000.",
  },
];

export function PidginModeModal({
  open,
  onClose,
  onConfirm,
}: PidginModeModalProps) {
  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="Switch to Pidgin English"
      description="Preview how the app will look - you can switch back at any time."
      size="md"
      footer={
        <div className="flex gap-2.5">
          <Button variant="ghost" size="md" onClick={onClose} fullWidth>
            Keep English
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={onConfirm}
            fullWidth
            rightIcon={<i className="ti ti-check text-[15px]" aria-hidden />}
          >
            Yes, use Pidgin
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Intro Card */}

        <div className="flex items-start gap-3 rounded-md border border-[#F5C4A1] bg-[#FEF0E8] p-4">
          <i
            className="ti ti-message-circle mt-0.5 shrink-0 text-xl text-[#7C3010]"
            aria-hidden
          />

          <div>
            <p className="mb-1 text-sm font-semibold text-[#7C3010]">
              Naija Pidgin mode
            </p>
            <p className="text-sm italic leading-relaxed text-[#7C3010]">
              We go translate the whole app to Nigerian Pidgin English. Tax
              explanations, form labels, error messages — everything go dey for
              Pidgin. No wahala, you fit switch back anytime.
            </p>
          </div>
        </div>

        {/* Preview Table */}

        <div>
          <p className={sectionLabelVariants()}>Side-by-side preview</p>

          <div className="overflow-hidden rounded-lg border border-border">
            {/* Header */}

            <div className="grid grid-cols-2">
              <div
                className={`${previewHeaderVariants()} bg-bg-surface border-r border-border`}
              >
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-text-muted">
                  English
                </span>
              </div>

              <div className={`${previewHeaderVariants()} bg-[#FEF0E8]`}>
                <span className="text-xs font-semibold uppercase tracking-[0.06em] text-[#7C3010]">
                  Pidgin NG
                </span>
              </div>
            </div>

            {/* Rows */}
            {PREVIEW_PAIRS.map((pair, index) => (
              <div
                key={index}
                className={`grid grid-cols-2 ${
                  index < PREVIEW_PAIRS.length - 1
                    ? "border-b border-border"
                    : ""
                }`}
              >
                <div
                  className={`${previewColumnVariants({
                    language: "english",
                  })} border-r border-border`}
                >
                  <p
                    className={previewTextVariants({
                      language: "english",
                    })}
                  >
                    {pair.en}
                  </p>
                </div>

                <div
                  className={previewColumnVariants({
                    language: "pidgin",
                  })}
                >
                  <p
                    className={previewTextVariants({
                      language: "pidgin",
                    })}
                  >
                    {pair.pg}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs leading-relaxed text-text-muted">
          Your language preference is saved locally in this browser. Switch back
          anytime from the language toggle in the top bar.
        </p>
      </div>
    </ModalBase>
  );
}
