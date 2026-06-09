import { LangChip } from "../ui/components/Badge";
import { AutoSaveIndicator } from "../ui/AutoSaveIndicator";
import { PidginModeModal } from "../ui/components/PidginModeModal";
import type { Language } from "../state/store";
import type { SaveState } from "../ui/AutoSaveIndicator";

import { cva } from "class-variance-authority";
import { useState } from "react";
import { DeadlinePill } from "../ui/components/DeadlinePill";

const topbarVariants = cva(
  "sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/70",
);

const logoVariants = cva(
  "flex items-center gap-2 bg-transparent p-0 cursor-pointer shrink-0",
);

const logoIconVariants = cva(
  "flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white italic text-lg",
);

const rightActionsVariants = cva("hidden md:flex items-center gap-3 shrink-0");

const navItem = cva(
  [
    "flex items-center gap-2 rounded-md px-3 py-2 cursor-pointer",
    "text-sm transition-colors duration-200",
  ],
  {
    variants: {
      active: {
        true: "bg-brand/10 text-brand font-medium",
        false: "text-text-body hover:bg-brand/10 hover:bg-surface-muted",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

const mobileNavItemVariants = cva(
  "flex w-full items-center gap-3 rounded-md px-4 py-3 text-left transition-colors",
  {
    variants: {
      active: {
        true: "bg-brand/10 text-brand font-medium",
        false: "text-text-body hover:bg-surface-muted",
      },
    },
    defaultVariants: {
      active: false,
    },
  },
);

export interface TopbarProps {
  currentPath: string;
  lang: Language;
  onLangChange: (lang: Language) => void;
  saveStatus?: SaveState;
  onLogoClick: () => void;
  onNavClick: (path: string) => void;
}

const NAV = [
  {
    path: "/learn",
    en: "Learn",
    pg: "Learn",
    icon: "ti ti-school",
  },
  {
    path: "/file",
    en: "File",
    pg: "File",
    icon: "ti ti-file-text",
  },
  {
    path: "/calculate",
    en: "Calculator",
    pg: "Calculate",
    icon: "ti ti-calculator",
  },
  {
    path: "/about",
    en: "About",
    pg: "About",
    icon: "ti ti-info-circle",
  },
];

export function Topbar({
  currentPath,
  lang,
  onLangChange,
  saveStatus = "idle",
  onLogoClick,
  onNavClick,
}: TopbarProps) {
  const [pidginModal, setPidginModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPg = lang === "pidgin";

  const handleLanguageChange = (next: Language) => {
    if (next === "pidgin" && lang === "en") {
      setPidginModal(true);
      return;
    }
    onLangChange(next);
  };

  return (
    <>
      <header className={topbarVariants()}>
        <div className="mx-auto flex h-14 items-center px-4 lg:px-6">
          {/* Logo */}
          <button
            type="button"
            onClick={onLogoClick}
            aria-label="TaxNaija Home"
            className={logoVariants()}
          >
            <div className={logoIconVariants()}>₦</div>

            <span className="text-base font-bold text-brand font-display">
              TaxNaija
            </span>
          </button>

          {/* Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-1 ml-8"
          >
            {NAV.map((link) => {
              const active = currentPath.startsWith(link.path);

              return (
                <button
                  key={link.path}
                  type="button"
                  aria-current={active ? "page" : undefined}
                  onClick={() => onNavClick(link.path)}
                  className={navItem({
                    active,
                  })}
                >
                  <i className={link.icon} aria-hidden="true" />
                  {isPg ? link.pg : link.en}
                </button>
              );
            })}
          </nav>
          <div className="flex-1" />

          {/*  Desktop Actions */}
          <div className={rightActionsVariants()}>
            <DeadlinePill />

            <AutoSaveIndicator state={saveStatus} />

            <LangChip value={lang} onChange={handleLanguageChange} />
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <LangChip value={lang} onChange={handleLanguageChange} />
            <button
              type="button"
              aria-label="Open Menu"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-text-muted transition-colors"
            >
              <i
                className={
                  mobileMenuOpen ? "ti ti-x text-xl" : "ti ti-menu-2 text-xl"
                }
              />
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="p-4 space-y-2">
              {NAV.map((item) => {
                const active = currentPath.startsWith(item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      onNavClick(item.path);
                      setMobileMenuOpen(false);
                    }}
                    className={mobileNavItemVariants({ active })}
                  >
                    <i className={item.icon} />

                    <span>{isPg ? item.pg : item.en}</span>
                  </button>
                );
              })}
            </div>
            <div className="border-t border-border p-4 space-y-4">
              <DeadlinePill />

              <AutoSaveIndicator state={saveStatus} />
            </div>
          </div>
        )}
      </header>

      <PidginModeModal
        open={pidginModal}
        onClose={() => setPidginModal(false)}
        onConfirm={() => {
          onLangChange("pidgin");
          setPidginModal(false);
        }}
      />
    </>
  );
}
