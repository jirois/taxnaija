import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { AccordionGroup } from "../ui/AccordionItem";
import { TaxYearBadge } from "../ui/components/Badge";
import { DeadlinePill } from "../ui/components/DeadlinePill";
import { InfoAlert } from "../ui/components/Banner";
import { TAX_BRACKETS } from "../tax-engine/brackets";
import type { Language } from "../state/store";
import { cva } from "class-variance-authority";

// const sectionVariants = cva("space-y-4");

const sectionTitleVariants = cva(
  "font-display font-semibold tracking-tight text-foreground",
  {
    variants: {
      size: {
        sm: "text-xl",
        md: "text-2xl",
        lg: "text-3xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);

const conceptCardVariants = cva(
  [
    "flex",
    "gap-4",
    "rounded-2xl",
    "border",
    "bg-card",
    "p-4",
    "transition-all",
    "duration-200",
    "hover:shadow-md",
    "hover:border-primary/30",
  ].join(" "),
);

const conceptIconVariants = cva(
  [
    "flex",
    "h-10",
    "w-10",
    "items-center",
    "justify-center",
    "rounded-xl",
    "shrink-0",
  ].join(" "),
  {
    variants: {
      tone: {
        success: "bg-green-100 text-green-700",
        warning: "bg-amber-100 text-amber-700",
        danger: "bg-red-100 text-red-700",
      },
    },
    defaultVariants: {
      tone: "success",
    },
  },
);

const badgeVariants = cva(
  [
    "inline-flex",
    "items-center",
    "rounded-full",
    "px-2.5",
    "py-1",
    "text-xs",
    "font-medium",
  ].join(" "),
);

const bracketBadgeVariants = cva(
  [
    "flex",
    "h-6",
    "w-6",
    "items-center",
    "justify-center",
    "rounded-full",
    "font-semibold",
    "text-xs",
  ].join(" "),
);

const ctaVariants = cva(
  ["rounded-3xl", "border", "bg-card", "px-6", "py-10", "text-center"].join(
    " ",
  ),
);

export interface LearnPageProps {
  lang: Language;
  showPidgin?: boolean;
  onStartFiling: () => void;
}

const pct = (r: number) => `${(r * 100).toFixed(0)}%`;
const fmt = (n: number) =>
  n === Infinity ? "∞" : `₦${n.toLocaleString("en-NG")}`;

// Band colours matching BracketBar
const BAND_BG: Record<number, string> = {
  0: "#E8E8E3",
  0.15: "#BDE0CB",
  0.18: "#90C9A7",
  0.21: "#2E8B57",
  0.23: "#006B3F",
  0.25: "#003A22",
};
const BAND_TEXT: Record<number, string> = {
  0: "#3A3A35",
  0.15: "#003A22",
  0.18: "#003A22",
  0.21: "#FFFFFF",
  0.23: "#FFFFFF",
  0.25: "#FFFFFF",
};

const CONCEPT_CARDS = [
  {
    icon: "ti ti-building-bank",
    bg: "#E6F4EC",
    tone: "success",
    en: {
      title: "What is PAYE?",
      sub: "Understand how your employer deducts tax — and why you still need to file.",
    },
    pg: {
      title: "Wetin be PAYE?",
      sub: "Find out how your oga dey collect tax and why you still need to file.",
    },
  },
  {
    icon: "ti ti-shield-check",
    bg: "#E6F4EC",
    tone: "success",
    en: {
      title: "₦800k zero-rate band",
      sub: "The first ₦800,000 you earn is taxed at 0% under NTA 2025.",
    },
    pg: {
      title: "₦800k wey dem no tax",
      sub: "The first ₦800,000 wey you earn — government no go tax am.",
    },
  },
  {
    icon: "ti ti-home",
    bg: "#E6F4EC",
    tone: "success",
    en: {
      title: "Rent relief",
      sub: "20% of rent paid, up to ₦500,000 — reduces your taxable income.",
    },
    pg: {
      title: "Rent relief",
      sub: "20% of rent wey you pay — can reduce your tax, max ₦500,000.",
    },
  },
  {
    icon: "ti ti-clock",
    bg: "#FEF6E7",
    tone: "warning",
    en: {
      title: "March 31 deadline",
      sub: "File by March 31 every year or face penalties of ₦50,000+.",
    },
    pg: {
      title: "March 31 deadline",
      sub: "File before March 31 — if you miss am, dem go fine you ₦50,000 at least.",
    },
  },
  {
    icon: "ti ti-alert-triangle",
    bg: "#FEF0EF",
    tone: "danger",
    en: {
      title: "Late filing penalties",
      sub: "Fixed ₦50,000 + 10% of tax owed + daily interest. Avoid at all costs.",
    },
    pg: {
      title: "Fine for late filing",
      sub: "₦50,000 fixed fine + 10% of your tax + interest per day. No be small thing.",
    },
  },
  {
    icon: "ti ti-building-community",
    bg: "#E6F4EC",
    tone: "success",
    en: {
      title: "State IRS vs FIRS",
      sub: "Employees file with their state IRS. FIRS handles companies and expatriates.",
    },
    pg: {
      title: "State IRS vs FIRS",
      sub: "If you dey work for company, file with your state IRS — not FIRS.",
    },
  },
];

const FAQS = [
  {
    id: "f1",
    question: "If my employer deducts PAYE, do I still need to file?",
    answer:
      "Yes — always. PAYE is a tax collection mechanism, not a substitute for filing. Your annual return reconciles your employer's deductions against your actual liability. Not filing attracts a minimum penalty of ₦50,000.",
  },
  {
    id: "f2",
    question: "What documents do I need to file?",
    answer:
      "You need your payslip (for salary figures), rent receipt or tenancy agreement, pension contribution statement, and records of any other income. For NHF and NHIS, keep your contribution receipts.",
  },
  {
    id: "f3",
    question: "What is the difference between FIRS and my state IRS?",
    answer:
      "FIRS (Federal Inland Revenue Service) handles companies and expatriates. Your state IRS handles personal income tax for residents. As an employee or self-employed individual, you file with your state IRS — not FIRS.",
  },
  {
    id: "f4",
    question: "What is the ₦800,000 zero-rate band under NTA 2025?",
    answer:
      "The first ₦800,000 of your annual chargeable income is taxed at 0% under the NTA 2025 Fourth Schedule. You only pay tax on income above this amount. Even if your total income is at or below ₦800,000, you must still file a nil return.",
  },
  {
    id: "f5",
    question: "Can I claim rent relief if I pay cash?",
    answer:
      "Technically yes, but you need documentation. Request a handwritten receipt from your landlord, or pay by bank transfer so you have a record. FIRS may request proof during an audit.",
  },
  {
    id: "f6",
    question: "What is the minimum wage exemption?",
    answer:
      "Employees earning at or below the national minimum wage (₦70,000/month = ₦840,000/year) are exempt from PAYE deductions. However, you still need to file a nil return by March 31.",
  },
  {
    id: "f7",
    question: "Does TaxNaija store my data?",
    answer:
      "No. All computations happen entirely in your browser. Nothing is sent to any server. Your progress is saved to your browser's localStorage — it stays on your device only.",
  },
];

export function LearnPage({ lang, onStartFiling }: LearnPageProps) {
  const isPg = lang === "pidgin";

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <section className="mx-auto mb-14 max-w-4xl text-center">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          <TaxYearBadge />
          <DeadlinePill />
        </div>

        <h1 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
          {isPg ? "Make you learn before you file" : "Learn before you file"}
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
          {isPg
            ? "Many Nigerians no understand tax well. Spend 5 minutes learn the important things before you file."
            : "Most Nigerians don't fully understand their tax obligations. Spend 5 minutes learning the essentials before filing."}
        </p>
      </section>

      {/* Concept cards */}

      <section className="mb-16">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {isPg ? "Key concepts" : "Key concepts"}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {CONCEPT_CARDS.map((card) => {
            const text = isPg ? card.pg : card.en;

            return (
              <div key={card.en.title} className={conceptCardVariants()}>
                <div className={conceptIconVariants()}>
                  <i className={card.icon} aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <h3 className="mb-1 text-base font-semibold text-foreground">
                    {text.title}
                  </h3>

                  <p className="text-sm leading-6 text-muted-foreground">
                    {text.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Tax Bracket Table */}
      <section className="mb-16">
        <h2
          className={sectionTitleVariants({
            size: "md",
          })}
        >
          {isPg ? "NTA 2025 tax brackets" : "NTA 2025 progressive tax table"}
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-7 text-muted-foreground">
          {isPg
            ? "These na the official tax bands under Nigeria Tax Act 2025. The rates apply progressively."
            : "These are the official tax bands under the Nigeria Tax Act 2025. The rates apply progressively, meaning higher rates only apply to income within each band."}
        </p>

        <Card className="mt-6 overflow-hidden">
          {/* Mobile-safe horizontal scroll */}
          <div className="overflow-x-auto">
            <table className="min-w-180 w-full border-collapse">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Band
                  </th>

                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Income Range
                  </th>

                  <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Rate
                  </th>
                </tr>
              </thead>

              <tbody>
                {TAX_BRACKETS.map((b, index) => {
                  const to = b.width === Infinity ? Infinity : b.from + b.width;

                  const isZero = b.rate === 0;

                  return (
                    <tr key={b.from} className="border-b last:border-b-0">
                      <td className="px-4 py-4">
                        <span
                          className={bracketBadgeVariants()}
                          style={{
                            background: BAND_BG[b.rate] ?? "#E8E8E3",
                            color: BAND_TEXT[b.rate] ?? "#3A3A35",
                          }}
                        >
                          {index + 1}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm">
                        <div className="flex items-center gap-2">
                          <span>
                            {b.width === Infinity
                              ? `Above ${fmt(b.from)}`
                              : `${fmt(b.from)} – ${fmt(to)}`}
                          </span>

                          {isZero && (
                            <span className={badgeVariants()}>Tax Free</span>
                          )}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center text-base font-bold text-primary">
                        {pct(b.rate)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <InfoAlert className="mt-4">
          {isPg
            ? "Example: If your chargeable income na ₦2,000,000, the first ₦800,000 gets 0% tax and the remaining ₦1.2m gets 15%."
            : "Example: If your chargeable income is ₦2,000,000, the first ₦800,000 is taxed at 0% and the remaining ₦1.2 million is taxed at 15%."}
        </InfoAlert>
      </section>
      {/* FAQ */}
      <section className="mb-16">
        <h2
          className={sectionTitleVariants({
            size: "md",
          })}
        >
          {isPg ? "Questions wey people dey ask" : "Frequently asked questions"}
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
          {isPg
            ? "Answers to the common tax questions wey Nigerians dey ask."
            : "Answers to the most common questions Nigerians ask about tax filing."}
        </p>

        <Card className="mt-6 p-0 overflow-hidden">
          <AccordionGroup items={FAQS} />
        </Card>
      </section>
      <section className={ctaVariants()}>
        <div className="mx-auto max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {isPg ? "Now you know — make we file!" : "Ready to file?"}
          </h2>

          <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
            {isPg
              ? "The wizard go guide you step by step. E no go take long."
              : "The filing wizard will guide you through the process step-by-step. Most people finish in less than 10 minutes."}
          </p>

          <div className="mt-8 flex justify-center">
            <Button
              variant="primary"
              size="lg"
              onClick={onStartFiling}
              className="w-full sm:w-auto"
            >
              <span className="flex items-center justify-center gap-2">
                {isPg ? "Start filing" : "Start filing"}

                <i className="ti ti-arrow-right" aria-hidden="true" />
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
