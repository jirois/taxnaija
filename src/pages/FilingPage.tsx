/**
 * FilingPage.tsx
 * The core 4-step filing wizard. Each step is a self-contained component.
 */

import { useMemo } from "react";
import { computeTax } from "../tax-engine/compute";
import { FormStep } from "../ui/form-components/FormStep";
import { MoneyInput } from "../ui/form-components/MoneyInput";
import { SelectInput } from "../ui/form-components/SelectInput";
import { RadioGroup } from "../ui/form-components/RadioGroup";
import { Checkbox } from "../ui/form-components/CheckBox";
import { Toggle } from "../ui/Toggle";
import { Divider } from "../ui/Divider";
import { TaxSummaryCard } from "../ui/components/TaxSummaryCard";
import { DownloadModal } from "../ui/components/DownloadModal";
import { InfoAlert, PidginTip } from "../ui/components/Banner";
import { TooltipChip } from "../ui/components/TooltipChip";
import { AutoCalcBadge } from "../ui/components/Badge";
import type {
  PersonalSlice,
  IncomeSlice,
  DeductionSlice,
  WizardStep,
  Language,
} from "../state/store";
import { TextInput } from "../ui/form-components/TextInput";

// ── Nigerian states list ──────────────────────────────────────────────────────
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const stateItems = NIGERIAN_STATES.map((s) => ({ value: s, label: s }));

// Props
export interface FilingPageProps {
  step: WizardStep;
  lang: Language;
  personal: PersonalSlice;
  income: IncomeSlice;
  deductions: DeductionSlice;
  onUpdatePersonal: (p: Partial<PersonalSlice>) => void;
  onUpdateIncome: (p: Partial<IncomeSlice>) => void;
  onUpdateDeductions: (p: Partial<DeductionSlice>) => void;
  onNext: () => void;
  onBack: () => void;
  onMarkComplete: () => void;
  downloadModalOpen: boolean;
  onOpenDownload: () => void;
  onCloseDownload: () => void;
}

export function FilingPage({
  step,
  lang,
  personal,
  income,
  deductions,
  onUpdatePersonal,
  onUpdateIncome,
  onUpdateDeductions,
  onNext,
  onBack,
  onMarkComplete,
  downloadModalOpen,
  onOpenDownload,
  onCloseDownload,
}: FilingPageProps) {
  const isPg = lang === "pidgin";

  // Derive TaxResult for Review step
  const taxResult = useMemo(() => {
    if (!income.monthlySalary && !income.annualSelfIncome) return null;
    return computeTax({
      income: {
        employmentType: personal.employmentType,
        monthlySalary: income.monthlySalary,
        annualSelfIncome: income.annualSelfIncome,
        otherAnnualIncome: income.otherAnnualIncome,
      },
      deductions: {
        pensionContribution: deductions.pensionContribution,
        annualRentPaid: deductions.annualRentPaid,
        lifeInsurancePremium: deductions.lifeInsurancePremium,
        nhfContribution: deductions.includeNhf
          ? deductions.nhfContribution
          : undefined,
        nhisContribution: deductions.includeNhis
          ? deductions.nhisContribution
          : undefined,
      },
      stateOfResidence: personal.stateOfRes,
    });
  }, [personal, income, deductions]);

  // -- Step 1: Personal
  if (step === 1) {
    return (
      <FormStep
        stepNumber={1}
        title={isPg ? "Your personal info" : "Personal information"}
        subtitle={
          isPg
            ? "This go help us send your return go the right tax office."
            : "This determines which tax authority handles your return."
        }
        nav={{
          onContinue: onNext,
          continueDisabled: !personal.fullName || !personal.stateOfRes,
        }}
      >
        <TextInput
          label={isPg ? "Your full name" : "Full legal name"}
          required
          placeholder="e.g. Adaeze Okonkwo"
          hint={
            isPg
              ? "As e dey on your BVN or NIN"
              : "As it appears on your BVN or NIN"
          }
          value={personal.fullName}
          onChange={(e) => onUpdatePersonal({ fullName: e.target.value })}
        />

        <SelectInput
          label={isPg ? "State where you dey stay" : "State of residence"}
          required
          hint={
            isPg
              ? "This go route your return to the correct IRS office"
              : "Routes your return to the correct state IRS office"
          }
          value={personal.stateOfRes}
          onChange={(v) => onUpdatePersonal({ stateOfRes: v })}
          items={stateItems}
        />

        <RadioGroup
          legend={isPg ? "How you take dey work?" : "Employment status"}
          required
          value={personal.employmentType}
          onChange={(v) =>
            onUpdatePersonal({
              employmentType: v as PersonalSlice["employmentType"],
            })
          }
          options={[
            {
              value: "employed",
              label: isPg ? "I dey work (PAYE)" : "Employed (PAYE)",
              description: isPg
                ? "Your oga dey deduct tax from your salary every month"
                : "Your employer deducts tax from your salary monthly",
              icon: "ti ti-briefcase",
              badge: isPg ? "Most common" : "Most common",
            },
            {
              value: "self-employed",
              label: isPg
                ? "I dey work for myself"
                : "Self-employed / Freelancer",
              description: isPg
                ? "You dey run your own business or you dey do contract work"
                : "You run your own business or work as a contractor",
              icon: "ti ti-user",
            },
            {
              value: "both",
              label: isPg
                ? "I get work + side hustle"
                : "Employed + side income",
              description: isPg
                ? "You get main job AND you dey do other business"
                : "Full-time job plus additional freelance or business income",
              icon: "ti ti-currency-naira",
            },
          ]}
        />

        {isPg && (
          <PidginTip>
            No worry — your data no dey go anywhere. Everything dey stay for
            your phone or laptop only. We no dey keep your information for any
            server.
          </PidginTip>
        )}
      </FormStep>
    );
  }

  // -- Step 2: Income
  if (step === 2) {
    const showSelfIncome = personal.employmentType !== "employed";
    const showMonthly = personal.employmentType !== "self-employed";

    return (
      <FormStep
        stepNumber={2}
        title={isPg ? "Your income" : "Your income"}
        subtitle={
          isPg
            ? "Put all the money wey you earn this year. Be honest — nobody go arrest you."
            : "Include all income for the tax year. Be honest — voluntary disclosure protects you."
        }
        nav={{
          onBack,
          onContinue: onNext,
          continueDisabled: !income.monthlySalary && !income.annualSelfIncome,
        }}
      >
        {showMonthly && (
          <MoneyInput
            label={isPg ? "Monthly gross salary" : "Monthly gross salary"}
            required
            showAnnual
            hint={
              isPg
                ? "The full salary before any deductions — check your payslip"
                : "Gross amount before deductions. Check your payslip — use gross, not net."
            }
            tooltip={
              <TooltipChip
                label={isPg ? "Gross vs net" : "Gross vs net"}
                title="Gross salary — not take-home"
              >
                {isPg
                  ? 'Use the amount before pension, tax, and other deductions. E dey on your payslip as "Gross Salary".'
                  : 'Use the amount before pension, tax, and other deductions are removed. It appears on your payslip as "Gross Salary".'}
              </TooltipChip>
            }
            value={income.monthlySalary}
            onChange={(v) => onUpdateIncome({ monthlySalary: v })}
          />
        )}

        {showSelfIncome && (
          <MoneyInput
            label={
              isPg
                ? "Annual self-employment income"
                : "Annual self-employment / business income"
            }
            required={!showMonthly}
            hint={
              isPg
                ? "Total money wey your business bring in for this year"
                : "Total annual revenue from self-employment or business activities"
            }
            value={income.annualSelfIncome}
            onChange={(v) => onUpdateIncome({ annualSelfIncome: v })}
          />
        )}

        <Divider
          label={isPg ? "Other income (optional)" : "Other income (optional)"}
          spacing="md"
        />

        <MoneyInput
          label={isPg ? "Other income (per year)" : "Other annual income"}
          hint={
            isPg
              ? "Rent collected, dividends, or any other income — annual total"
              : "Rental income, dividends, casual earnings — annual total"
          }
          value={income.otherAnnualIncome}
          onChange={(v) => onUpdateIncome({ otherAnnualIncome: v })}
        />
        <InfoAlert>
          {isPg
            ? "FIRS dey encourage voluntary disclosure. If you declare your income correct, e protect you from audit wahala later."
            : "FIRS encourages voluntary disclosure. Accurate filing protects you from audit issues and demonstrates good faith."}
        </InfoAlert>
      </FormStep>
    );
  }

  // -- Step 3: Deductions
  if (step === 3) {
    const annualSalary = (income.monthlySalary ?? 0) * 12;
    const autoPension = Math.round(annualSalary * 0.08);

    return (
      <FormStep
        stepNumber={3}
        title={isPg ? "Deductions & reliefs" : "Deductions & reliefs"}
        subtitle={
          isPg
            ? "These go reduce the tax wey you go pay — legally. Keep your receipts."
            : "These legally reduce your taxable income under NTA 2025. Keep your documentation."
        }
        nav={{
          onBack,
          onContinue: onNext,
        }}
      >
        {/* Pension */}
        <div>
          <div className="flex items-center gap-2  mb-1.5 flex-wrap">
            <span className="font-body text-xs font-semibold text-text-muted uppercase tracking-[0.06em]">
              {isPg ? "Pension contribution" : "Pension contribution"}
            </span>
            <AutoCalcBadge />
            <TooltipChip
              label={isPg ? "How pension work" : "How pension works"}
              title="Pension relief — PRA 2014"
            >
              {isPg
                ? "Minimum na 8% of your annual salary. E dey reduce your tax. If you dey contribute more than 8% voluntarily, you fit enter the extra amount."
                : "Minimum 8% of annual salary under PRA 2014. Reduces your taxable income. If you contribute more than 8% voluntarily, enter the full amount."}
            </TooltipChip>
          </div>
          <MoneyInput
            label=""
            hint={
              isPg
                ? `Auto-calculated: 8% of ₦${annualSalary.toLocaleString("en-NG")} = ₦${autoPension.toLocaleString("en-NG")}. Change only if you contribute more.`
                : `Auto-calculated at 8% of annual salary (₦${autoPension.toLocaleString("en-NG")}). Change only if contributing above the mandatory minimum.`
            }
            value={deductions.pensionContribution ?? autoPension}
            onChange={(v) => onUpdateDeductions({ pensionContribution: v })}
          />
        </div>

        {/* Rent */}
        <MoneyInput
          label={isPg ? "Annual rent paid" : "Annual rent paid"}
          hint={
            isPg
              ? "We go apply 20% of this amount, but e no go pass ₦500,000 (NTA 2025 s.30vi)"
              : "20% of this amount will be applied as relief, capped at ₦500,000 (NTA 2025 s.30vi)"
          }
          tooltip={
            <TooltipChip
              label={isPg ? "Rent relief" : "Rent relief"}
              title="Rent relief — NTA 2025 s.30(vi)"
            >
              {isPg
                ? "20% of your rent, maximum ₦500,000. Na your primary residence. Keep your tenancy agreement."
                : "20% of rent paid for your primary residence, capped at ₦500,000. Keep your tenancy agreement or payment receipts."}
            </TooltipChip>
          }
          value={deductions.annualRentPaid}
          onChange={(v) => onUpdateDeductions({ annualRentPaid: v })}
        />

        {/* Life insurance */}
        <MoneyInput
          label={isPg ? "Life insurance premium" : "Life insurance premium"}
          hint={
            isPg
              ? "Annual premium wey you pay to Nigerian insurer — maximum na 10% of your gross income"
              : "Annual premium paid to a registered Nigerian life insurer. Maximum deductible: 10% of gross income."
          }
          value={deductions.lifeInsurancePremium}
          onChange={(v) => onUpdateDeductions({ lifeInsurancePremium: v })}
        />
        <Divider
          label={isPg ? "Optional deductions" : "Optional deductions"}
          spacing="md"
        />

        {/* NHF toggle */}
        <div className="flex flex-col gap-3">
          <Toggle
            checked={deductions.includeNhf}
            onChange={(v) => onUpdateDeductions({ includeNhf: v })}
            label={
              isPg ? "Include NHF contribution" : "Include NHF contribution"
            }
            hint={
              isPg
                ? "2.5% of your monthly basic salary — National Housing Fund"
                : "2.5% of monthly basic salary — National Housing Fund contribution"
            }
          />
          {deductions.includeNhf && (
            <MoneyInput
              label={
                isPg ? "NHF contribution (per year)" : "NHF annual contribution"
              }
              hint={
                isPg
                  ? "Total NHF wey dem collect from your salary this year"
                  : "Total NHF deducted from your salary this year"
              }
              value={deductions.nhfContribution}
              onChange={(v) => onUpdateDeductions({ nhfContribution: v })}
            />
          )}
        </div>

        {/* NHIS toggle */}
        <div className="flex flex-col gap-3">
          <Toggle
            checked={deductions.includeNhis}
            onChange={(v) => onUpdateDeductions({ includeNhis: v })}
            label={
              isPg ? "Include NHIS contribution" : "Include NHIS contribution"
            }
            hint={
              isPg
                ? "5% of your basic salary — National Health Insurance Scheme"
                : "5% of basic salary — NHIS employee contribution"
            }
          />
          {deductions.includeNhis && (
            <MoneyInput
              label={
                isPg
                  ? "NHIS contribution (per year)"
                  : "NHIS annual contribution"
              }
              value={deductions.nhisContribution}
              onChange={(v) => onUpdateDeductions({ nhisContribution: v })}
            />
          )}
        </div>
        <InfoAlert>
          {isPg
            ? "All claims need proof o! Keep your receipts, payslips, and tenancy agreement. FIRS fit ask you to show am anytime."
            : "All deductions require documentation. Keep your rent receipts, pension statements, and insurance documents. FIRS may request proof during a review."}
        </InfoAlert>
      </FormStep>
    );
  }

  // -- Step 4: Review
  if (step === 4) {
    return (
      <FormStep
        stepNumber={4}
        title={isPg ? "Review your return" : "Review & submit"}
        subtitle={
          isPg
            ? "Check everything before you download your form."
            : "Review your tax computation before generating your return."
        }
        nav={{
          onBack,
          onContinue: () => {
            onMarkComplete();
            onOpenDownload();
          },
          continueLabel: isPg ? "Download & submit" : "Download & submit",
          isFinalStep: true,
          continueDisabled: !taxResult,
        }}
      >
        {taxResult ? (
          <>
            <TaxSummaryCard
              result={taxResult}
              taxpayerName={
                personal.fullName || (isPg ? "Taxpayer" : "Taxpayer")
              }
              stateOfRes={personal.stateOfRes}
              mode="full"
            />
            <Checkbox
              checked={false}
              onChange={() => {}}
              disabled={false}
              label={
                isPg
                  ? "I confirm say the information wey I provide correct and complete to the best of my knowledge. I know say I dey responsible for the content of this return."
                  : "I confirm that the information I have provided is accurate and complete to the best of my knowledge. I understand I am legally responsible for the contents of this return."
              }
              hint={
                isPg
                  ? "You must confirm before you download your form"
                  : "Required before downloading your tax return"
              }
            />
          </>
        ) : (
          <InfoAlert title={isPg ? "No income entered" : "No income entered"}>
            {isPg
              ? "Go back to Step 2 enter your salary before we fit calculate your tax."
              : "Please go back to Step 2 and enter your income before reviewing."}
          </InfoAlert>
        )}
        {/* Download modal */}
        {taxResult && (
          <DownloadModal
            open={downloadModalOpen}
            onClose={onCloseDownload}
            taxResult={taxResult}
            taxpayerName={personal.fullName || "Taxpayer"}
            stateOfRes={personal.stateOfRes}
            onDownload={async () => {
              // PDF generation wired in Phase 2
              await new Promise((r) => setTimeout(r, 1500));
            }}
          />
        )}
      </FormStep>
    );
  }
  return null;
}
