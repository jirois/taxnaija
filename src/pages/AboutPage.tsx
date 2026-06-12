import { cva } from "class-variance-authority";
import { Card } from "../ui/Card";
import { ExternalLink } from "../ui/ExternalLink";
import { TaxYearBadge } from "../ui/components/Badge";
import type { Language } from "../state/store";

interface AboutPageProps {
  lang: Language;
}

const sectionVariants = cva("space-y-6");

const missionGridVariants = cva([
  "grid gap-6",
  "grid-cols-1",
  "md:grid-cols-2",
  "rounded-3xl",
  "bg-brand",
  "p-6 md:p-10",
]);

const contributionGridVariants = cva([
  "grid gap-4",
  "grid-cols-1",
  "md:grid-cols-2",
]);

const iconContainerVariants = cva([
  "flex h-9 w-9 items-center justify-center",
  "rounded-lg",
  "bg-brand/15",
]);

const CONTRIBUTION_AREAS = [
  {
    icon: "ti ti-language",
    title: "Translations",
    body: "Add Yoruba, Hausa, or Igbo locale files. No code knowledge needed — just JSON.",
    path: "src/i18n/locales/",
  },
  {
    icon: "ti ti-building-bank",
    title: "State IRS data",
    body: "Add portal URLs and submission info for your state.",
    path: "src/ui/StatePortalCard.tsx",
  },
  {
    icon: "ti ti-calculator",
    title: "Tax engine",
    body: "Keep NTA 2025 brackets accurate.",
    path: "src/tax-engine/",
  },
  {
    icon: "ti ti-code",
    title: "UI components",
    body: "Build features, improve accessibility, or fix bugs.",
    path: "src/ui/",
  },
];

export function AboutPage({ lang }: AboutPageProps) {
  const isPg = lang === "pidgin";

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-20">
      {/* Header */}

      <section className="mb-16 text-center">
        <TaxYearBadge className="mb-4" />

        <h1
          className="
            font-display
            text-4xl
            md:text-5xl
            lg:text-6xl
            text-text-primary
          "
        >
          About TaxNaija
        </h1>

        <p
          className="
            mx-auto
            mt-5
            max-w-2xl
            text-base
            leading-8
            text-text-muted
            md:text-lg
          "
        >
          {isPg
            ? "TaxNaija na free, open source project wey go help Nigerians file tax returns correctly."
            : "TaxNaija is a free and open source tax filing assistant built specifically for Nigerians."}
        </p>
      </section>
      {/* Mission */}

      <section className="mb-16">
        <div className={missionGridVariants()}>
          {[
            {
              icon: "ti ti-eye",
              title: "Our vision",
              body: isPg
                ? "Every Nigerian go fit file tax without confusion."
                : "Every Nigerian can file taxes confidently and correctly.",
            },
            {
              icon: "ti ti-heart",
              title: "Why we built this",
              body: isPg
                ? "Tax tools dey expensive and confusing."
                : "Tax software is often expensive and difficult to understand.",
            },
          ].map((item) => (
            <div key={item.title}>
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                  <i className={item.icon} aria-hidden />
                </div>

                <h3 className="font-semibold text-white">{item.title}</h3>
              </div>

              <p className="leading-7 text-white/85">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Open Source */}

      <section className={sectionVariants()}>
        <div>
          <h2 className="font-display text-3xl text-text-primary">
            Open Source
          </h2>

          <p className="mt-3 max-w-3xl leading-8 text-text-muted">
            {isPg
              ? "Anybody fit inspect the code and contribute."
              : "The entire codebase is public so anyone can inspect, audit, and improve it."}
          </p>
        </div>

        {/* Links */}

        <div className="flex flex-wrap gap-3">
          <ExternalLink href="https://github.com/taxnaija/taxnaija">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border
                border-border
                bg-background
                px-4
                py-2
                text-sm
                font-medium
              "
            >
              <i className="ti ti-brand-github" />
              taxnaija/taxnaija
            </div>
          </ExternalLink>

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-border
              px-4
              py-2
              text-sm
              text-text-muted
            "
          >
            <i className="ti ti-license" />
            MIT License
          </div>
        </div>

        {/* Contributions */}

        <div>
          <h3 className="mb-4 text-lg font-semibold text-text-primary">
            {isPg ? "How you fit contribute" : "How to contribute"}
          </h3>

          <div className={contributionGridVariants()}>
            {CONTRIBUTION_AREAS.map((area) => (
              <Card key={area.title}>
                <div className="flex items-start gap-4">
                  <div className={iconContainerVariants()}>
                    <i className={`${area.icon} text-brand`} aria-hidden />
                  </div>

                  <div className="flex-1">
                    <h4 className="font-semibold text-text-primary">
                      {area.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-text-muted">
                      {area.body}
                    </p>

                    <code
                      className="
                        mt-3
                        inline-block
                        rounded-md
                        border
                        border-border
                        bg-bg-surface
                        px-2
                        py-1
                        text-xs
                      "
                    >
                      {area.path}
                    </code>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>
      {/* Legal */}

      <section className="mt-16">
        <Card>
          <h3
            className="
              mb-3
              text-xs
              font-semibold
              uppercase
              tracking-wider
              text-text-muted
            "
          >
            Legal Disclaimer
          </h3>

          <p className="leading-7 text-text-muted">
            TaxNaija is an educational tool and does not constitute professional
            tax advice. While every effort is made to ensure compliance with the
            Nigeria Tax Act 2025, users should verify all calculations with
            qualified tax professionals or their State Internal Revenue Service.
          </p>
        </Card>
      </section>
    </div>
  );
}
