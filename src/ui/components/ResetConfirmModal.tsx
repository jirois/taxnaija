import { cva } from "class-variance-authority";
import { ModalBase } from "./ModalBase";
import { Button } from "../Button";
import { ErrorAlert } from "./Banner";

const sectionLabelVariants = cva(
  "mb-2.5 text-xs font-semibold uppercase tracking-[0.06em] text-text-muted",
);

const lossItemVariants = cva(
  "flex items-center gap-2.5 border border-border bg-bg-surface px-3.5 py-2.5",
  {
    variants: {
      position: {
        first: "rounded-t-md",
        middle: "rounded-t-0",
        last: "rounded-b-md border-t-0",
        single: "rounded-md",
      },
    },
  },
);

const tipTextVariants = cva(
  "text-center text-sm leading-relaxed text-text-muted",
);

export interface ResetConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  hasProgress?: boolean;
}

const WILL_LOSE = [
  {
    icon: "ti ti-user",
    label: "Personal information (name, state, employment type)",
  },
  {
    icon: "ti ti-currency-naira",
    label: "Income figures (salary, side income)",
  },
  {
    icon: "ti ti-receipt-refund",
    label: "All deduction claims (pension, rent, insurance)",
  },
  {
    icon: "ti ti-calculator",
    label: "Your computed tax summary",
  },
];

export function ResetConfirmModal({
  open,
  onClose,
  onConfirm,
  hasProgress = true,
}: ResetConfirmModalProps) {
  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="Clear all data?"
      size="sm"
      closeOnBackdrop={false}
      footer={
        <div className="flex gap-2.5">
          <Button variant="secondary" size="md" onClick={onClose} fullWidth>
            Cancel
          </Button>

          <Button
            variant="danger"
            size="md"
            fullWidth
            onClick={() => {
              onConfirm();
              onClose();
            }}
            leftIcon={<i className="ti ti-trash text-[15px]" aria-hidden />}
          >
            Yes, clear everything
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <ErrorAlert>
          This action cannot be undone. All your filing data will be permanently
          deleted from this browser.
        </ErrorAlert>

        {hasProgress && (
          <div>
            <p className={sectionLabelVariants()}>You will lose</p>
            <div>
              {WILL_LOSE.map((item, index) => {
                const position =
                  WILL_LOSE.length === 1
                    ? "single"
                    : index === 0
                      ? "first"
                      : index === WILL_LOSE.length - 1
                        ? "last"
                        : "middle";

                return (
                  <div
                    key={item.label}
                    className={lossItemVariants({
                      position,
                    })}
                  >
                    <i
                      className={`${item.icon} shrink-0 text-[15px] text-danger`}
                    />
                    <span className="text-sm leading-snug text-text-body">
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p className={tipTextVariants()}>
          Tip: use(" ")
          <strong className="text-text-body">Save progress</strong> before
          resetting if you want to keep a copy
        </p>
      </div>
    </ModalBase>
  );
}
