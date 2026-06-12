/**
 * App.tsx
 * Root component — client-side router + global state wiring.
 *
 * Route map:
 *   /           → LandingPage  (PageShell)
 *   /learn      → LearnPage    (PageShell)
 *   /file       → FilingPage   (WizardShell)
 *   /calculate  → CalculatorPage (PageShell)
 *   /submit     → SubmitPage   (PageShell)
 *   /about      → AboutPage    (PageShell)
 *   *           → NotFoundPage (PageShell)
 */

import { useEffect, useState } from "react";
import { computeTax } from "./tax-engine/compute";
import { useFilingStore, selectTaxInput } from "./state/store";

//Layout
import { PageShell } from "./layout/PageShell";
import { WizardShell } from "./layout/WizardShell";

// Pages
import { LandingPage } from "./pages/Landing";
import { LearnPage } from "./pages/LearnPage";
import { FilingPage } from "./pages/FilingPage";
import { CalculatorPage } from "./pages/CalculatorPage";
import { SubmitPage } from "./pages/SubmitPage";
import { AboutPage } from "./pages/AboutPage";
import { NotFoundPage } from "./pages/NotFoundPage";

//Hash router

function usePath() {
  const getPath = () => window.location.hash.replace("#", "") || "/";
  const [path, setPath] = useState(getPath);
  useEffect(() => {
    const handler = () => setPath(getPath());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return path;
}

function navigate(to: string) {
  window.location.hash = to;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Root app

export default function App() {
  const path = usePath();

  // Store slices
  const lang = useFilingStore((s) => s.lang);
  const step = useFilingStore((s) => s.step);
  const personal = useFilingStore((s) => s.personal);
  const income = useFilingStore((s) => s.income);
  const deductions = useFilingStore((s) => s.deductions);
  const ui = useFilingStore((s) => s.ui);
  const hasCompletedFiling = useFilingStore((s) => s.hasCompletedFiling);

  // Actions
  const setLang = useFilingStore((s) => s.setLang);
  const nextStep = useFilingStore((s) => s.nextStep);
  const prevStep = useFilingStore((s) => s.prevStep);
  const setStep = useFilingStore((s) => s.setStep);
  const updatePersonal = useFilingStore((s) => s.updatePersonal);
  const updateIncome = useFilingStore((s) => s.updateIncome);
  const updateDeductions = useFilingStore((s) => s.updateDeductions);
  const markComplete = useFilingStore((s) => s.markComplete);
  const resetAll = useFilingStore((s) => s.resetAll);
  const openModal = useFilingStore((s) => s.openModal);
  const closeModal = useFilingStore((s) => s.closeModal);

  // Derived tax result for SubmitPage
  const taxInput = selectTaxInput({
    lang,
    step,
    personal,
    income,
    deductions,
    ui,
    hasCompletedFiling,
    setLang,
    setStep,
    nextStep,
    prevStep,
    updatePersonal,
    updateIncome,
    updateDeductions,
    markComplete,
    resetAll,
    setSaveStatus: () => {},
    openModal,
    closeModal,
  });

  const taxResult = () => {
    try {
      if (!income.monthlySalary && !income.annualSelfIncome) return null;
      return computeTax(taxInput);
    } catch {
      return null;
    }
  };

  // Shared nav handlers
  const navHandlers = {
    onLogoClick: () => navigate("/"),
    onNavClick: (p: string) => navigate(p),
    onLangChange: setLang,
    currentPath: path,
    lang,
    saveStatus: ui.saveStatus,
  };

  // Filing Wizard
  if (path.startsWith("/file")) {
    return (
      <WizardShell
        currentStep={step}
        lang={lang}
        onLangChange={setLang}
        onLogoClick={() => navigate("/")}
        onNavClick={navigate}
        saveStatus={ui.saveStatus}
        taxInput={taxInput}
        onStepClick={setStep}
        resetModalOpen={ui.modals.reset}
        saveModalOpen={ui.modals.saveProgress}
        formData={{ personal, income, deductions }}
        onResetConfirm={() => {
          resetAll();
          closeModal("reset");
        }}
        onCloseReset={() => closeModal("reset")}
        onCloseSave={() => closeModal("saveProgress")}
      >
        <FilingPage
          step={step}
          lang={lang}
          personal={personal}
          income={income}
          deductions={deductions}
          onUpdatePersonal={updatePersonal}
          onUpdateIncome={updateIncome}
          onUpdateDeductions={updateDeductions}
          onNext={step === 4 ? () => navigate("/submit") : nextStep}
          onBack={step === 1 ? () => navigate("/") : prevStep}
          onMarkComplete={markComplete}
          downloadModalOpen={ui.modals.download}
          onOpenDownload={() => openModal("download")}
          onCloseDownload={() => closeModal("download")}
        />
      </WizardShell>
    );
  }

  // All other pages in PageShell
  const pageContent = (() => {
    if (path === "/" || path === "") {
      return (
        <LandingPage
          lang={lang}
          onStartFiling={() => navigate("/file")}
          onLearn={() => navigate("/learn")}
          onCalculate={() => navigate("/calculate")}
        />
      );
    }
    if (path.startsWith("/learn")) {
      return (
        <LearnPage
          lang={lang}
          showPidgin={lang === "pidgin"}
          onStartFiling={() => navigate("/file")}
        />
      );
    }
    if (path.startsWith("/calculate")) {
      return (
        <CalculatorPage lang={lang} onStartFiling={() => navigate("/file")} />
      );
    }
    if (path.startsWith("/submit")) {
      return (
        <SubmitPage
          lang={lang}
          stateOfRes={personal.stateOfRes}
          taxpayerName={personal.fullName || "Taxpayer"}
          annualTax={taxResult()?.annualTax ?? 0}
          hasDownloaded={hasCompletedFiling}
          onDownload={() => openModal("download")}
          onGoHome={() => navigate("/")}
        />
      );
    }
    if (path.startsWith("/about")) {
      return <AboutPage lang={lang} />;
    }
    return (
      <NotFoundPage
        lang={lang}
        onGoHome={() => navigate("/")}
        onLearn={() => navigate("/learn")}
      />
    );
  })();

  return <PageShell {...navHandlers}>{pageContent}</PageShell>;
}
