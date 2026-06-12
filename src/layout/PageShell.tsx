import { Topbar } from "./topbar";
import { Footer } from "./footer";
import type { Language } from "../state/store";
import type { SaveState } from "../ui/AutoSaveIndicator";

export interface PageShellProps {
  currentPath: string;
  lang: Language;
  onLangChange: (l: Language) => void;
  onLogoClick: () => void;
  onNavClick: (p: string) => void;
  saveStatus?: SaveState;
  maxWidth?: number;
  noPad?: boolean;
  children: React.ReactNode;
}

export function PageShell({
  currentPath,
  lang,
  onLangChange,
  onLogoClick,
  onNavClick,
  saveStatus,
  maxWidth = 960,
  noPad = false,
  children,
}: PageShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-">
      <Topbar
        currentPath={currentPath}
        lang={lang}
        onLangChange={onLangChange}
        saveStatus={saveStatus}
        onLogoClick={onLogoClick}
        onNavClick={onNavClick}
      />
      <main
        id="main-content"
        tabIndex={-1}
        className={`flex-1 w-full ${noPad ? "" : "mx-auto px-6"}`}
        style={{ maxWidth: noPad ? undefined : maxWidth }}
      >
        {children}
      </main>
      <Footer onNavClick={onNavClick} />
    </div>
  );
}
