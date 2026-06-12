import { cva } from "class-variance-authority";
import { ExternalLink } from "../ui/ExternalLink";
import { DisclaimerBanner } from "../ui/components/Banner";

export interface FooterProps {
  onNavClick: (path: string) => void;
}

const footerLink = cva(
  "text-sm text-text-body transition-colors hover:text-brand text-left cursor-pointer",
);

const footerHeading = cva(
  "mb-3 text-xs font-semibold uppercase tracking-wider text-text-body",
);
const githubBadge = cva(
  "inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors hover:bg-brand/10",
);

export function Footer({ onNavClick }: FooterProps) {
  const year = new Date().getFullYear();

  const productLinks = [
    { label: "File your taxes", path: "/file" },
    { label: "Tax calculator", path: "/calculate" },
    { label: "Learn about tax", path: "/learn" },
    { label: "About", path: "/about" },
  ];

  const authorityLinks = [
    {
      label: "NRS",
      href: "https://www.nrs.gov.ng",
    },
    {
      label: "LIRS",
      href: "https://www.lirs.gov.ng",
    },
    {
      label: "FCT-IRS",
      href: "https://irs.fcta.gov.ng",
    },
  ];

  return (
    <footer className="mt-4 sm:mt-8 border-t bg-background ">
      <DisclaimerBanner />

      {/* Main Footer */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-sm italic text-white">
                ₦
              </div>
              <span className="font-semibold text-brand-hover">TaxNaija</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed text-text-body">
              Free, open-source Nigerian tax filing assistant built under NTA
              2025.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className={footerHeading()}>Product</h3>
            <div className="flex flex-col gap-2">
              {productLinks.map((link) => (
                <button
                  key={link.path}
                  onClick={() => onNavClick(link.path)}
                  className={footerLink()}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          {/* Authorities */}
          <div>
            <h3 className={footerHeading()}>Authorities</h3>

            <div className="flex flex-col gap-2">
              {authorityLinks.map((link) => (
                <ExternalLink
                  key={link.href}
                  href={link.href}
                  className={footerLink()}
                >
                  {link.label}
                </ExternalLink>
              ))}
            </div>
          </div>

          {/* Github */}
          <div className="flex items-start lg:justify-end">
            <ExternalLink href="https://github.com/taxnaija/taxnaija">
              <span className={githubBadge()}>
                <i
                  className="ti ti-brand-github text-base"
                  aria-hidden="true"
                />
                Open source on Github
              </span>
            </ExternalLink>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 text-center text-xs text-text-muted sm:px-6 md:flex-row md:items-center md:justify-between md:text-left lg:px-8">
          <p>
            © {year} TaxNaija. Not affiliated with FIRS or any government body.
          </p>
          <p>Nigeria Tax Act 2025 · Tax Year 2026</p>
        </div>
      </div>
    </footer>
  );
}
