import { StatePortalCard } from "../ui/components/StatePortalCard";
import { StatusBadge } from "../ui/components/StatusBadge";
import { DeadlinePill } from "../ui/components/DeadlinePill";
import { DeadlineBanner } from "../ui/components/Banner";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { getDeadlineInfo } from "../tax-engine/compute";
import type { Language } from "../state/store";
import { cva } from "class-variance-authority";
import { cn } from "../lib/cn";

export interface SubmitPageProps {
  lang: Language;
  stateOfRes: string;
  taxpayerName: string;
  annualTax: number;
  hasDownloaded: boolean;
  onDownload: () => void;
  onGoHome: () => void;
}

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

const KEEP_DOCS = [
  {
    icon: "ti ti-file-text",
    en: "A copy of your completed tax return (PDF)",
    pg: "Copy of your tax return PDF",
  },
  {
    icon: "ti ti-receipt",
    en: "Your stamped acknowledgment receipt from the IRS",
    pg: "Stamped receipt from the IRS — very important!",
  },
  {
    icon: "ti ti-building-bank",
    en: "Pension contribution statements for the year",
    pg: "Pension statement for the year",
  },
  {
    icon: "ti ti-home",
    en: "Tenancy agreement and rent payment receipts",
    pg: "Tenancy agreement and rent receipts",
  },
  {
    icon: "ti ti-file-invoice",
    en: "All payslips and P60/P45 equivalent documents",
    pg: "All your payslips",
  },
];

// CVA
const page = cva("mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8");

const grid = cva("grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]");

// const sectionCard = cva("rounded-2xl border border-border bg-card shadow-sm");

const sidebarCard = cva(
  "sticky top-24 rounded-2xl border border-border bg-card shadow-sm overflow-hidden",
);

// const iconBox = cva(
//   "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary",
// );

// const sectionTitle = cva(
//   "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
// );

export function SubmitPage({
  lang,
  stateOfRes,
  taxpayerName,
  annualTax,
  hasDownloaded,
  onDownload,
  onGoHome,
}: SubmitPageProps) {
  const isPg = lang === "pidgin";
  const info = getDeadlineInfo();
  const daysRemaining = info.daysRemaining;

  return (
    <div className={page()}>
      {/* Deadline Banner */}
      {info.isOverdue && daysRemaining <= 30 && (
        <div>
          <DeadlineBanner daysRemaining={daysRemaining} />
        </div>
      )}
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status="in-progress" />
            <DeadlinePill />
          </div>

          <h1 className="font-display text-3xl text-text-primary md:text-4xl">
            {isPg ? "How to submit your return" : "Submission guide"}
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-text-body md:text-base">
            {isPg
              ? `${taxpayerName}, your return don ready. Follow the steps below to submit am.`
              : `${taxpayerName}, your return is ready. Follow the steps below to complete your submission.`}
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className={grid()}>
        {/* Mobile-first:
            Summary first on mobile
            Content first on desktop
        */}
        <aside className="order-1 lg:order-2">
          {/* Download Reminder */}
          {!hasDownloaded ? (
            <div className="flex flex-col gap-4 rounded-2xl border border-border bg-brand-light p-5 sm:flex-row sm:items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white">
                <i
                  className="ti ti-download text-2xl text-brand"
                  aria-hidden="true"
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-text-primary">
                  {isPg
                    ? "Download your tax return first"
                    : "Download your tax return first"}
                </p>
                <p className="mt-1 text-sm text-text-body">
                  {isPg
                    ? "Generate your official PDF before you go submit."
                    : "Generate your government-ready PDF before submitting."}
                </p>
              </div>
              <Button
                variant="primary"
                onClick={onDownload}
                className="w-full sm:w-auto"
              >
                <i className="t ti-download mr-2" />
                {isPg ? "Download" : "Download PDF"}
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-border bg-brand-light p-5">
              <div className="flex items-start gap-3">
                <i
                  className="ti ti-circle-check text-2xl text-brand"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold text-text-primary">
                    {isPg ? "Return downloaded!" : "Return downloaded"}
                  </p>
                  <p className="mt-1 text-sm text-text-body">
                    {isPg
                      ? "Your PDF don ready. Now follow the steps below to submit am to your state IRS."
                      : "Your PDF is saved to Downloads. Follow the steps below to complete your filing."}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* State IRS Submission Guide */}
          <Card className="overflow-hidden rounded-2xl border">
            <div className="border-b bg-text-muted/30 px-6 py-4">
              <h2 className="text-lg font-semibold">
                {isPg
                  ? `${stateOfRes} IRS Submission`
                  : `${stateOfRes} IRS Submission Guide`}
              </h2>
              <p className="mt-1 text-sm text-text-body">
                {isPg
                  ? "Follow these steps submit your tax return."
                  : "Follow the instructions provided by your State Internal Revenue Service."}
              </p>
            </div>
            <div className="p-6">
              <StatePortalCard stateOfResidence={stateOfRes} />
            </div>
          </Card>

          {/* Record Keeping */}
          <Card className="rounded-2xl border p-6">
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-text-muted">
              {isPg
                ? "Documents to keep (minimum 6 years)"
                : "Documents to keep — minimum 6 years"}
            </p>
            <div className="space-y-3">
              {KEEP_DOCS.map((doc) => (
                <div
                  key={doc.en}
                  className="flex items-start gap-3 rounded-xl p-2"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand/10">
                    <i className={doc.icon} aria-hidden="true" />
                  </div>

                  <span className="text-sm leading-relaxed">
                    {isPg ? doc.pg : doc.en}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Audit Warning */}
          <div className="rounded-2xl border border-blue-500 bg-blue-50 p-5">
            <div className="flex gap-3">
              <i
                className="ti ti-info-circle mt-0.5 text-xl text-blue-700"
                aria-hidden="true"
              />
              <p className="text-sm leading-relaxed text-blue-900">
                {isPg
                  ? "NRS fit conduct audit up to 6 years after filing. Keep all your receipts and documents safe throughout this period."
                  : "NRS can conduct tax audits up to 6 years after filing. Keep all supporting documents safely for at least six years."}
              </p>
            </div>
          </div>

          {/* Sidbar */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <Card className={sidebarCard()}>
              <div className="bg-brand p-4">
                <p className="text-sm font-semibold text-white">
                  {isPg ? "Your tax summary" : "Tax summary"}
                </p>
                <p className="mt-1 text-xs text-white/70">
                  {stateOfRes} NRS - NTA 2025
                </p>
              </div>
              <div className="p-4">
                {[
                  {
                    label: isPg ? "Annual tax owed" : "Annual tax owed",
                    value: fmt(annualTax),
                    bold: true,
                  },
                  {
                    label: isPg ? "Per month" : "Monthly equivalent",
                    value: fmt(Math.round(annualTax / 12)),
                    bold: false,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between border-b border-border py-3 last:border-none"
                  >
                    <span className="text-sm text-text-muted">{row.label}</span>
                    <span
                      className={cn(
                        row.bold
                          ? "font-display text-lg text-primary"
                          : "text-sm font-medium text-foreground",
                      )}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick stats */}
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand/10">
                    <i className="ti ti-calendar text-brand" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {isPg ? "Deadline" : "Submission Deadline"}
                    </p>
                    <p className="text-xs text-text-muted">
                      March 31, {new Date().getFullYear()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-100">
                    <i className="ti ti-shield-check text-emerald-600" />
                  </div>

                  <div>
                    <p className="text-sm font-medium">
                      {isPg ? "Retention" : "Document Retention"}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      6 years minimum
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            <Button
              variant="ghost"
              size="sm"
              onClick={onGoHome}
              className="w-full"
            >
              <i className="ti ti-home mr-2 text-sm" />
              {isPg ? "Return to home" : "Back to home"}
            </Button>
          </aside>
        </aside>
      </div>
      {/* ───────────────── Bottom CTA ───────────────── */}
      <section className="mt-10">
        <Card className="p-6 text-center">
          <div className="mx-auto max-w-2xl">
            <h3 className="font-display text-xl text-foreground">
              {isPg ? "Submission almost complete" : "You're almost done"}
            </h3>

            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {isPg
                ? "After you submit to your State IRS, keep all receipts and acknowledgment documents safe."
                : "Once submitted to your State IRS, keep all receipts, acknowledgments and supporting documents safely for future reference."}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              {!hasDownloaded && (
                <Button onClick={onDownload}>
                  <i className="ti ti-download mr-2" />
                  {isPg ? "Download Return" : "Download PDF Return"}
                </Button>
              )}

              <Button variant="outline" onClick={onGoHome}>
                <i className="ti ti-home mr-2" />
                {isPg ? "Go Home" : "Return Home"}
              </Button>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}
