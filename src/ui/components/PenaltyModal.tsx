import { cva } from "class-variance-authority";
import { ModalBase } from "./ModalBase";
import { Button } from "../Button";
import { ErrorAlert, InfoAlert } from "./Banner";

const penaltyRowVariants = cva("flex items-start gap-3 px-4 py-3", {
  variants: {
    type: {
      normal: "bg-bg-elevated",
      penalty: "bg-danger-light",
    },
    bordered: {
      true: "border-b border-border",
      false: "",
    },
  },
  defaultVariants: {
    type: "normal",
    bordered: true,
  },
});

const amountVariants = cva("font-display shrink-0", {
  variants: {
    intent: {
      normal: "text-text-primary",
      danger: "text-danger",
      inverse: "text-white",
    },
    size: {
      md: "text-lg",
      lg: "text-2xl",
    },
  },
  defaultVariants: {
    intent: "normal",
    size: "md",
  },
});

const stateCardVariants = cva(
  "flex-1 rounded-md border border-border bg-bg-surface p-3 text-centered",
);

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export interface PenaltyModalProps {
  open: boolean;
  onClose: () => void;
  daysOverdue: number;
  taxOwed: number;
  onStartFiling?: () => void;
}

export function PenaltyModal({
  open,
  onClose,
  daysOverdue,
  taxOwed,
  onStartFiling,
}: PenaltyModalProps) {
  const fixedPenalty = 50_000;
  const percentagePenalty = Math.round(taxOwed * 0.1);
  const yearsOverdue = daysOverdue / 365;
  const interestCharged = Math.round(taxOwed * 0.15 * yearsOverdue);
  const totalPenalty = fixedPenalty + percentagePenalty + interestCharged;

  const totalOwed = taxOwed + totalPenalty;

  const rows = [
    {
      label: "Original tax liability",
      value: fmt(taxOwed),
      sub: "Annual tax owed before penalties",
      icon: "ti ti-receipt",
      danger: false,
    },
    {
      label: "Fixed late filing penalty",
      value: fmt(fixedPenalty),
      sub: "Minimum statutory penalty (NTA 2025)",
      icon: "ti ti-alert-circle",
      danger: true,
    },
    {
      label: "Tax-based penalty",
      value: fmt(percentagePenalty),
      sub: "10% of tax owed",
      icon: "ti ti-percentage",
      danger: true,
    },
    {
      label: "Interest on unpaid tax",
      value: fmt(interestCharged),
      sub: `15% per annum × ${daysOverdue} days`,
      icon: "ti ti-trending-up",
      danger: true,
    },
  ];

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="Late filing penalties"
      description={`${daysOverdue} day${
        daysOverdue === 1 ? "" : "s"
      } overdue - Penalties accumulate daily`}
      size="md"
      footer={
        <div className="flex justify-end gap-2.5">
          <Button variant="ghost" size="md" onClick={onClose}>
            Close
          </Button>

          {onStartFiling && (
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                onClose();
                onStartFiling();
              }}
              rightIcon={
                <i className="ti ti-arrow-right text-[15px]" aria-hidden />
              }
            >
              File now - stop penalties
            </Button>
          )}
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <ErrorAlert title="Penalties are increasing every day">
          The longer you wait, the more interest accrues on your unpaid tax.
          Filing now stops the clock on daily interest.
        </ErrorAlert>

        {/* Breakdown */}
        <div className="overflow-hidden rounded-lg border">
          {rows.map((row, index) => (
            <div
              key={row.label}
              className={penaltyRowVariants({
                type: row.danger ? "penalty" : "normal",
                bordered: index < rows.length - 1,
              })}
            >
              <i
                className={`${row.icon} mt-0.5 shrink-0 text-base ${
                  row.danger ? "text-danger" : "text-bg-surface"
                }`}
                aria-hidden
              />

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{row.label}</p>
                <p className="text-xs text-text-muted">{row.sub}</p>
              </div>

              <span
                className={amountVariants({
                  intent: row.danger ? "danger" : "normal",
                })}
              >
                {row.value}
              </span>
            </div>
          ))}

          {/* Total */}

          <div className="flex items-center gap-3 bg-danger px-4 py-4">
            <i className="ti ti-sum shrink-0 text-lg text-white" aria-hidden />
            <div className="flex-1">
              <p className="text-sm text-white/80">Total amount now owed</p>
              <p className="text-xs text-white/60">
                Tax owed + all penalities + interest
              </p>
            </div>

            <span
              className={amountVariants({
                intent: "inverse",
                size: "lg",
              })}
            >
              {fmt(totalOwed)}
            </span>
          </div>
        </div>

        <InfoAlert>
          Filing your return now stops further interest accrual. You may
          negotiate a payment plan with your state IRS, but you must file first.
        </InfoAlert>

        {/* Stats */}
        <div className="flex gap-4 justify-center">
          {[
            {
              label: "Days overdue",
              value: daysOverdue,
            },
            {
              label: "Penalty total",
              value: `₦${Math.round(totalPenalty / 1000)}k`,
            },
            {
              label: "Daily interest",
              value: fmt(Math.round((taxOwed * 0.15) / 365)),
            },
          ].map((item) => (
            <div key={item.label} className={stateCardVariants()}>
              <p className="font-display text-xl text-danger">{item.value}</p>

              <p className="text-xs text-text-muted">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </ModalBase>
  );
}
