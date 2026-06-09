import { Button } from "../ui/Button";
import { DeadlinePill } from "../ui/components/DeadlinePill";
import { TaxYearBadge } from "../ui/components/Badge";
import { Card } from "../ui/Card";
import { ExternalLink } from "../ui/ExternalLink";
import type { Language } from "../state/store";
import { cva } from "class-variance-authority";

// const sectionVariants = cva("mx-auto w-full max-w-7xl");

const heroVariants = cva("flex flex-col items-center text-center", {
  variants: {
    spacing: {
      default: "gap-5 py-12 md:py-16",
    },
  },
  defaultVariants: {
    spacing: "default",
  },
});

const statCardVariants = cva("bg-background p-4 md:p-5 text-center");

const featureCardVariants = cva("h-full");

const ctaVariants = cva("rounded-2xl bg-brand text-text-body", {
  variants: {
    size: {
      default: "px-6 py-10 md:px-8 md:py-12",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface LandingPageProps {
  lang: Language;
  onStartFiling: () => void;
  onLearn: () => void;
  onCalculate: () => void;
}

const STATS = [
  { v: "₦800k", en: "Zero-rate band", pg: "No tax below this" },
  { v: "6", en: "NTA 2025 tax brackets", pg: "Tax brackets" },
  { v: "March 31", en: "Annual filing deadline", pg: "File before this date" },
  { v: "₦50k+", en: "Minimum late penalty", pg: "Fine if you file late" },
];

const FEATURES = [
  {
    i: "ti ti-shield-check",
    t: "NTA 2025 accurate",
    en: "Built on the Fourth Schedule — every bracket, every cap.",
    pg: "Based on the real NTA 2025 — all correct.",
  },
  {
    i: "ti ti-lock",
    t: "100% private",
    en: "All calculations happen in your browser. No data sent to any server.",
    pg: "Everything dey happen inside your device. We no send anything.",
  },
  {
    i: "ti ti-message-circle",
    t: "Pidgin support",
    en: "Switch the entire interface to Nigerian Pidgin English.",
    pg: "Na option wey you dey use now — works great!",
  },
  {
    i: "ti ti-code",
    t: "Open source",
    en: "The entire codebase is public. Verify the maths yourself.",
    pg: "The code dey open — anybody fit check the calculation.",
  },
  {
    i: "ti ti-file-text",
    t: "PDF generation",
    en: "Download a complete, government-ready tax return PDF.",
    pg: "Download your complete tax form PDF — ready to submit.",
  },
  {
    i: "ti ti-clock",
    t: "Deadline tracking",
    en: "Never miss March 31. Live countdown in the top bar.",
    pg: "We go remind you about March 31 deadline.",
  },
];

const HOW = [
  {
    n: "01",
    en: "Answer simple questions about your income and deductions",
    pg: "Answer simple questions about your salary and deductions",
  },
  {
    n: "02",
    en: "We calculate your NTA 2025 tax liability in real time",
    pg: "We go calculate your tax under NTA 2025 immediately",
  },
  {
    n: "03",
    en: "Download your pre-filled, government-ready PDF return",
    pg: "Download your form — e don ready to submit",
  },
  {
    n: "04",
    en: "Submit to your state IRS online or in person",
    pg: "Submit to your state IRS online or for their office",
  },
];

export function LandingPage({
  lang,
  onStartFiling,
  onLearn,
  onCalculate,
}: LandingPageProps) {
  const isPg = lang === "pidgin";

  return (
    <div>
      {/* Hero section */}
      <section className={heroVariants()}>
        <div className="flex flex-wrap items-center justify-center gap-2">
          <TaxYearBadge />
          <DeadlinePill />
        </div>
        <p className="text-sm text-text-body">
          Free - Open source - Nigeria Tax Act 2025
        </p>

        <h1 className="max-w-3xl whitespace-pre-line text-4xl font-display leading-tight md:text-6xl">
          {isPg
            ? "File your tax correct.\nYou no need accountant."
            : "File your taxes correctly.\nNo accountant needed."}
        </h1>

        <p className="max-w-2xl text-base leading-relaxed text-text-body md:text-lg">
          {isPg
            ? "TaxNaija go guide you step by step..."
            : "TaxNaija guides you through your annual return..."}
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" onClick={onStartFiling}>
            Start filing →
          </Button>

          <Button variant="ghost" size="lg" onClick={onLearn}>
            Learn about tax first
          </Button>
        </div>
        <p className="text-sm text-text-body">
          Takes under 10 minutes · Free of charge · No account required
        </p>
      </section>

      {/* Stat section */}
      <section className="mb-14 grid grid-cols-2 overflow-hidden rounded-xl border md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.v} className={statCardVariants()}>
            <p className="mb-1 font-display text-2xl text-brand">{s.v}</p>

            <p className="text-xs leading-relaxed text-text-body">
              {isPg ? s.pg : s.en}
            </p>
          </div>
        ))}
      </section>

      {/* How it works */}
      <section className="mb-14">
        <h2 className="mb-8 text-center text-3xl font-display">
          {isPg ? "How e work" : "How it works"}
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {HOW.map((step) => (
            <div
              key={step.n}
              className="flex gap-4 rounded-xl border bg-brand/10 p-5"
            >
              <span className="font-display text-3xl italic text-brand/40">
                {step.n}
              </span>
              <p className="leading-relaxed text-text-body">
                {isPg ? step.pg : step.en}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Why tax naija */}
      <section className="mb-16">
        <h2 className="mb-8 text-center text-3xl font-display">Why TaxNaija</h2>
        <div className="grid grid-cols-1 gap04 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.t} className={featureCardVariants()}>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-brand/10">
                <i className={feature.i} aria-hidden="true" />
              </div>
              <h3 className="mb-2 font-semibold">{feature.t}</h3>
              <p className="text-sm leading-relaxed text-text-body">
                {isPg ? feature.pg : feature.en}
              </p>
            </Card>
          ))}
        </div>
      </section>

      <section className={ctaVariants()}>
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 text-center">
          <h2 className="text-3xl font-display text-bg-surface">
            {isPg
              ? "File your return today — na free!"
              : "File your return today — it's free."}
          </h2>
          <p className="text-white/65">
            {isPg
              ? "March 31 dey come. File now so you no go pay fine."
              : "The March 31 deadline approaches. File now to avoid penalties."}
          </p>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button variant="secondary" size="lg" onClick={onStartFiling}>
              Start filing →
            </Button>
            <Button variant="ghost" size="lg" onClick={onCalculate}>
              Try the calculator first
            </Button>
          </div>
          <ExternalLink
            href="https://github.com/taxnaija/taxnaija"
            className="text-sm text-text-body"
          >
            <i className="ti ti-brand-github" />
            View source on GitHub
          </ExternalLink>
        </div>
      </section>
    </div>
  );
}
