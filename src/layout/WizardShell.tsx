import { Topbar } from "./topbar";
import { StepChip } from "../ui/components/Badge";
import { StepProgress } from "../ui/ProgressBar";
import { LivePreviewPanel } from "../ui/components/LivePreviewPanel";
import { ResetConfirmModal } from "../ui/components/ResetConfirmModal";
import { SaveProgressModal } from "../ui/components/SaveProgressModal";
import type { Language, WizardStep } from "../state/store";
import type { TaxInput } from "../tax-engine/types";
import type { SaveState } from "../ui/AutoSaveIndicator";
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  // Base styles that apply to ALL buttons
  "flex items-center w-full bg-transparent border-none text-left cursor-pointer transition-colors px-2.5 py-1.75 gap-1.75 rounded-md font-body text-sm duration-100 hover:bg-bg-elevated",
  {
    variants: {
      intent: {
        normal: "text-text-muted",
        danger: "text-danger",
      },
    },
    defaultVariants: {
      intent: "normal",
    },
  },
);

const STEPS = [
  { number: 1 as WizardStep, label: "Personal", icon: "ti ti-user" },
  { number: 2 as WizardStep, label: "Income", icon: "ti ti-currency-naira" },
  {
    number: 3 as WizardStep,
    label: "Deductions",
    icon: "ti ti-receipt-refund",
  },
  { number: 4 as WizardStep, label: "Review", icon: "ti ti-clipboard-check" },
];

export interface WizardShellProps {
  currentStep: WizardStep;
  lang: Language;
  onLangChange: (l: Language) => void;
  onLogoClick: () => void;
  onNavClick: (p: string) => void;
  saveStatus?: SaveState;
  taxInput: Partial<TaxInput>;
  onStepClick?: (s: WizardStep) => void;
  resetModalOpen: boolean;
  saveModalOpen: boolean;
  formData: Record<string, unknown>;
  onResetConfirm: () => void;
  onCloseReset: () => void;
  onCloseSave: () => void;
  children: React.ReactNode;
}

export function WizardShell({
  currentStep,
  lang,
  onLangChange,
  onLogoClick,
  onNavClick,
  saveStatus,
  taxInput,
  onStepClick,
  resetModalOpen,
  saveModalOpen,
  formData,
  onResetConfirm,
  onCloseReset,
  onCloseSave,
  children,
}: WizardShellProps) {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden bg-gray-50">
      <Topbar
        currentPath="/file"
        lang={lang}
        onLangChange={onLangChange}
        saveStatus={saveStatus}
        onLogoClick={onLogoClick}
        onNavClick={onNavClick}
      />
      <div className="flex-1 grid grid-cols-[1fr_400px] overflow-hidden">
        <div className="flex overflow-hidden">
          <nav
            aria-label="Filing wizard steps"
            className="w-50 shrink-0 border-r border-border bg-bg-surface px-6 py-4 flex flex-col gap-1.5 overflow-y-auto"
          >
            <p className="font-body text-xs font-medium uppercase text-text-muted tracking-[0.07em] mt-0 mr-0 mb-3 ml-1">
              Filing steps
            </p>
            {STEPS.map((step) => {
              const state =
                step.number < currentStep
                  ? "done"
                  : step.number === currentStep
                    ? "active"
                    : "pending";
              return (
                <StepChip
                  key={step.number}
                  step={step.number}
                  label={step.label}
                  state={state}
                  onClick={
                    state !== "pending" && onStepClick
                      ? () => onStepClick(step.number)
                      : undefined
                  }
                  className="px-2 py-2"
                />
              );
            })}
            <div className="mt-auto flex flex-col gap-1 border-t border-border pt-3">
              {[
                {
                  icon: "ti ti-trash",
                  label: "Reset form",
                  action: onResetConfirm,
                  danger: true,
                },
              ].map((btn) => (
                <button
                  key={btn.label}
                  type="button"
                  onClick={btn.action}
                  className={buttonVariants({
                    intent: btn.danger ? "danger" : "normal",
                  })}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "var(--color-bg-elevated)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  <i
                    className={`${btn.icon} text-[15px] shrink-0`}
                    aria-hidden="true"
                  />
                  {btn.label}
                </button>
              ))}
            </div>
          </nav>
          <div className="flex-1 overflow-y-auto px-8 py-7">
            <div className="mb-6">
              <StepProgress
                current={currentStep}
                total={4}
                labels={STEPS.map((s) => s.label)}
              />
            </div>
            {children}
          </div>
        </div>
        <LivePreviewPanel input={taxInput} className="border-l border-border" />
      </div>
      <ResetConfirmModal
        open={resetModalOpen}
        onClose={onCloseReset}
        onConfirm={onResetConfirm}
        hasProgress
      />
      <SaveProgressModal
        open={saveModalOpen}
        onClose={onCloseSave}
        formData={formData}
      />
    </div>
  );
}
