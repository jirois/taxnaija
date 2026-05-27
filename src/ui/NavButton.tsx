import { cva, type VariantProps } from "class-variance-authority";
import { Button } from "./Button";
import { cn } from "../lib/cn";

// Styles
const navContainer = cva("flex items-center gap-3 border-t border-border", {
  variants: {
    sticky: {
      true: [
        "sticky bottom-0 left-0 right-0",
        "z-sticky",
        "bg-elevated/95 backdrop-blur",
        "px-4 py-3 sm:px-5",
      ],
      false: "pt-5",
    },
  },
  defaultVariants: {
    sticky: false,
  },
});

// Types

export interface NavButtonsProps extends VariantProps<typeof navContainer> {
  onBack?: () => void;
  onContinue: () => void;
  backLabel?: string;
  continueLabel?: string;
  continueLoading?: boolean;
  continueDisabled?: boolean;
  isFinalStep?: boolean;
  className?: string;
}

// --- Component ---
export function NavButtons({
  onBack,
  onContinue,
  backLabel = "Back",
  continueLabel = "Continue",

  continueLoading = false,
  continueDisabled = false,
  isFinalStep = false,
  sticky,

  className,
}: NavButtonsProps) {
  const finalLabel = isFinalStep ? "Download & Submit" : continueLabel;

  return (
    <div className={cn(navContainer({ sticky }), className)}>
      {/* Back button */}
      {onBack ? (
        <Button
          variant="secondary"
          size="md"
          onClick={onBack}
          leftIcon={
            <i className="ti ti-arrow-left text-[15px]" aria-hidden="true" />
          }
        >
          {backLabel}
        </Button>
      ) : (
        <div className="flex-1" />
      )}
      {/* Push continue to right */}
      {onBack && <div className="flex-1" />}

      {/* Continue / Submit */}
      <Button
        variant="primary"
        size="md"
        onClick={onContinue}
        loading={continueLoading}
        disabled={continueDisabled}
        rightIcon={
          !continueLoading ? (
            isFinalStep ? (
              <i className="ti ti-download text-[15px]" aria-hidden="true" />
            ) : (
              <i className="ti ti-arrow-right text-[15px]" aria-hidden="true" />
            )
          ) : undefined
        }
      >
        {finalLabel}
      </Button>
    </div>
  );
}
