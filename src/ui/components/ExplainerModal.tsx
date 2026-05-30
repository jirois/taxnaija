import { cva } from "class-variance-authority";
import { ModalBase } from "./ModalBase";
import { AccordionGroup } from "../AccordionItem";
import { ExternalLink } from "../ExternalLink";

// Types

export interface ExplainerFAQ {
  id: string;
  question: string;
  answer: React.ReactNode;
}

export interface ExplainerModalProps {
  open: boolean;
  onClose: () => void;
  concept: string;
  icon?: string;
  summary: React.ReactNode;
  reference?: string;
  refUrl?: string;
  example?: React.ReactNode;
  faqs?: readonly ExplainerFAQ[];
  pidginText?: React.ReactNode;
  showPidgin?: boolean;
}

// CVA Styles
const stack = cva("flex flex-col gap-5");

const titleWrap = cva("flex items-center gap-3");

const iconBox = cva(
  "flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-md bg-primary-light",
);

const summaryText = cva("text-base leading-[1.75] text-text-body");

const referenceBox = cva(
  "flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-2",
);

const pidginBox = cva(
  "rounded-md border border-[#F5C4A1] bg-[#FEF0E8] px-4 py-3",
);

const sectionTitle = cva(
  "mb-2 text-xs font-semibold uppercase tracking-[0.06em] text-text-muted",
);
const exampleBox = cva("rounded-md border border-border bg-surface p-4");

const exampleRows = cva("flex flex-col gap-2 text-sm");

const exampleRow = cva(
  "flex items-center justify-between border-b border-border py-2",
);

const exampleKey = cva("text-text-muted");

const exampleValue = cva("font-semibold text-text-primary");

const exampleTotal = cva(
  "flex items-center justify-between py-2 font-semibold text-primary",
);

// Component

export function ExplainerModal({
  open,
  onClose,
  concept,
  icon,
  summary,
  reference,
  refUrl,
  example,
  faqs,
  pidginText,
  showPidgin = false,
}: ExplainerModalProps) {
  return (
    <ModalBase
      open={open}
      onClose={onClose}
      size="md"
      title={
        <span className={titleWrap()}>
          {icon && (
            <span className={iconBox()}>
              <i
                className={`${icon} text-lg text-primary`}
                aria-hidden="true"
              />
            </span>
          )}
          <span>{concept}</span>
        </span>
      }
    >
      <div className={stack()}>
        {/* Summary */}
        <div className={summaryText()}>{summary}</div>

        {/* Legal Reference */}
        {reference && (
          <div className={referenceBox()}>
            <i
              className="ti ti-book shrink-0 text-sm text-text-muted"
              aria-hidden="true"
            />
            <span className="text-sm text-text-muted">
              Legal reference:&nbsp;
              {refUrl ? (
                <ExternalLink href={refUrl}>{reference}</ExternalLink>
              ) : (
                <strong className="text-text-body">{reference}</strong>
              )}
            </span>
          </div>
        )}

        {/* Pidgin Translation */}
        {showPidgin && pidginText && (
          <div className={pidginBox()}>
            <p className="mb-1.25 text-xs font-semibold uppercase tracking-[0.06em] text-[#7C3010]">
              <i className="ti ti-message-cirle mr-1.25" aria-hidden="true" />
              Pidgin English
            </p>
            <p className="m-0 text-sm italic leading-[1.7] text-[#7C3010]">
              {pidginText}
            </p>
          </div>
        )}

        {/* Example */}
        {example && (
          <div>
            <p className={sectionTitle()}>Worked example</p>
            <div className={exampleBox()}>{example}</div>
          </div>
        )}

        {/* FAQ */}
        {faqs && faqs.length > 0 && (
          <div>
            <p className={sectionTitle()}>Common questions</p>

            <AccordionGroup items={faqs} />
          </div>
        )}
      </div>
    </ModalBase>
  );
}

// Prebuilt Configs

// eslint-disable-next-line react-refresh/only-export-components
export const EXPLAINER_CONFIGS = {
  paye: {
    concept: "What is PAYE?",
    icon: "ti ti-building-bank",

    reference: "Personal Income Tax Act, s.81 (preserved under NTA 2025)",
    summary: (
      <>
        <p>
          <strong>Pay As You Earn (PAYE)</strong> is a system where your
          employer deducts income tax from your salary every month and remits it
          directly to the tax authority on your behalf.
        </p>

        <p className="mt-3">
          PAYE is a <em>collection mechanism</em> — not a substitute for filing.
          Even if your employer has deducted the correct tax all year, you are
          still legally required to file an annual return by{" "}
          <strong>March 31</strong>. Your employer&apos;s PAYE record and your
          self-reported return must match.
        </p>
      </>
    ),
    pidginText:
      "PAYE na the way your oga dey collect tax from your salary before im pay you. E no mean say you don file o! You still need submit your own return before March 31, otherwise dem fit fine you ₦50,000.",

    faqs: [
      {
        id: "paye-1",
        question: "If my employer deducts PAYE, can I get a refund?",

        answer:
          "Yes. If your employer over-deducted during the year — for example, if you had deductions not accounted for — your annual return can trigger a refund from the state IRS.",
      },

      {
        id: "paye-2",
        question: "What if I change jobs mid-year?",

        answer:
          "Each employer will issue a tax deduction card. You combine all income and deductions across employers on your single annual return.",
      },
    ],
  },

  rentRelief: {
    concept: "Rent relief under NTA 2025",

    icon: "ti ti-home",

    reference: "Nigeria Tax Act 2025, s.30(vi)",

    summary: (
      <>
        <p>
          Under the NTA 2025, you can deduct{" "}
          <strong>20% of your annual rent paid</strong>
          from your taxable income. This relief is subject to a hard ceiling of{" "}
          <strong>₦500,000</strong>
          regardless of how much rent you pay.
        </p>

        <p className="mt-3">
          This replaced the old Consolidated Relief Allowance (CRA) formula. The
          rent must be for your <strong>primary residence</strong> and you must
          be able to provide a tenancy agreement or receipt if audited.
        </p>
      </>
    ),
    example: (
      <div className={exampleRows()}>
        {[
          ["Annual rent paid", "₦1,800,000"],
          ["20% of rent", "₦360,000"],
          ["₦500,000 cap", "Not reached"],
          ["Rent relief applied", "₦360,000"],
        ].map(([k, v]) => (
          <div key={k} className={exampleRow()}>
            <span className={exampleKey()}>{k}</span>

            <strong className={exampleValue()}>{v}</strong>
          </div>
        ))}

        <div className={exampleTotal()}>
          <span>Tax saving (@ 15% rate)</span>
          <strong>₦54,000</strong>
        </div>
      </div>
    ),
    pidginText:
      "If you dey pay rent, 20% of wetin you pay fit reduce your tax. But dem cap am at ₦500,000 max. So even if you dey pay ₦5 million rent, e no go pass ₦500,000 relief.",
  },
  zeroBand: {
    concept: "₦800,000 zero-rate band",

    icon: "ti ti-shield-check",

    reference: "Nigeria Tax Act 2025, Fourth Schedule",
    summary: (
      <>
        <p>
          The NTA 2025 introduces a formal <strong>zero-rate band</strong>: the
          first ₦800,000 of your annual income is taxed at exactly{" "}
          <strong>0%</strong>. You owe nothing on this portion.
        </p>

        <p className="mt-3">
          This is different from the old threshold deduction — it is a proper
          bracket in the progressive rate table. Income above ₦800,000 is then
          taxed at <strong>15%</strong> up to ₦3 million, and higher rates above
          that.
        </p>

        <p className="mt-3">
          Important: even if your total income is at or below ₦800,000 and your
          tax is zero, you are
          <strong> still required to file a nil return</strong>.
        </p>
      </>
    ),
    pidginText:
      "The first ₦800,000 wey you earn every year, government no go collect tax from am at all — 0%. Na the NTA 2025 bring am. But remember: even if you no owe tax, you still need file your return before March 31.",

    faqs: [
      {
        id: "zero-1",

        question: "Does the ₦800k band apply to self-employed people too?",

        answer:
          "Yes. The zero-rate band applies to all taxpayers regardless of employment type — employed, self-employed, or both.",
      },

      {
        id: "zero-2",

        question: "What is a nil return?",

        answer:
          "A nil return is a tax return that shows zero tax owed. You must still file it by March 31 to avoid late filing penalties.",
      },
    ],
  },
} as const;
