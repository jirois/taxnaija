/**
 * DownloadModal.tsx
 */
import { useState } from "react";
import { cva } from "class-variance-authority";
import { ModalBase } from "./ModalBase";
import { Button } from "../Button";
import { Checkbox } from "../form-components/CheckBox";
import { SuccessAlert, InfoAlert } from "./Banner";

import type { TaxResult } from "../../tax-engine/types";

const fmt = (n: number) => `₦${Math.round(n).toLocaleString("en-NG")}`;

export type DownloadFormat = "return" | "computation";

export interface DownloadModalProps {
  open: boolean;
  onClose: () => void;
  taxResult: TaxResult;
  taxpayerName?: string;
  stateOfRes?: string;
  onDownload: (format: DownloadFormat) => Promise<void>;
}

const FORMAT_OPTIONS: Array<{
  key: DownloadFormat;
  label: string;
  desc: string;
  icon: string;
}> = [
  {
    key: "return",
    label: "Annual Tax Return",
    desc: "Government-ready form. Submit this to your state NRS .",
    icon: "ti ti-file-certificate",
  },
  {
    key: "computation",
    label: "Tax Computation Sheet",
    desc: "Detailed breakdown showing how your liability was calculated.",
    icon: "ti ti-file-analytics",
  },
];

// cva

const summaryCard = cva("overflow-hidden rounded-xl border border-border");

const summaryHeader = cva("flex items-center gap-3 bg-primary px-4 py-3");

const summaryRow = cva(
  "flex items-center justify-between px-4 py-3 border-b border-border last:border-b-0",
  {
    variants: {
      highlight: {
        true: "bg-primary-light",
        false: "",
      },
    },
  },
);

const formatOption = cva(
  [
    "flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-colors",
    "border-border-strong bg-bg-elevated",
  ],
  {
    variants: {
      selected: {
        true: "border-primary bg-primary-light",
        false: "hover:border-primary/40",
      },
    },
  },
);

const formatIcon = cva("mt-0.5 shrink-0 text-xl transition-colors", {
  variants: {
    selected: {
      true: "text-text-primary",
      false: "text-text-muted",
    },
  },
});

export function DownloadModal({
  open,
  onClose,
  taxResult,
  taxpayerName = "Taxpayer",
  stateOfRes = "Lagos",
  onDownload,
}: DownloadModalProps) {
  const [format, setFormat] = useState<DownloadFormat>("return");

  const [confirmed, setConfirmed] = useState(false);

  const [loading, setLoading] = useState(false);

  const [done, setDone] = useState(false);

  const handleDownload = async () => {
    if (!confirmed) return;

    setLoading(true);

    try {
      await onDownload(format);
      setDone(true);
    } finally {
      setLoading(false);
    }
  };

  const summaryRows = [
    {
      label: "Taxpayer",
      value: taxpayerName,
    },
    {
      label: "State",
      value: stateOfRes,
    },
    {
      label: "Tax year",
      value: String(taxResult.taxYear),
    },
    {
      label: "Gross income",
      value: fmt(taxResult.grossIncome),
    },
    {
      label: "Total reliefs",
      value: fmt(taxResult.reliefs.total),
    },
    {
      label: "Tax owed",
      value: fmt(taxResult.annualTax),
    },
  ];

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="Download tax return"
      description="Review the details below before generating your document."
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="primary"
            size="md"
            disabled={!confirmed || loading}
            loading={loading}
            onClick={handleDownload}
            leftIcon={
              !loading ? (
                <i className="ti ti-download text-[15px]" aria-hidden="true" />
              ) : undefined
            }
          >
            {done ? "Downloaded" : "Generate & download"}
          </Button>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Success */}
        {done && (
          <SuccessAlert title="Document generate">
            Your tax return has been saved to your Downloads folder. Attach it
            when submitting to your state IRS portal or office.
          </SuccessAlert>
        )}
        {/* Summary */}
        <div className={summaryCard()}>
          <div className={summaryHeader()}>
            <i
              className="ti ti-file-text text-lg text-white"
              aria-hidden="true"
            />
            <div>
              <p className="font-body text-lg font-medium text-primary">
                Return summary
              </p>
              <p className="font-body text-xs text-text-body">
                {stateOfRes} NRS - NTA 2025 - {taxResult.taxYear} tax year
              </p>
            </div>
          </div>

          <div>
            {summaryRows.map((row) => {
              const isTax = row.label === "Tax owed";
              return (
                <div
                  key={row.label}
                  className={summaryRow({
                    highlight: isTax,
                  })}
                >
                  <span className="font-body text-sm text-text-muted">
                    {row.label}
                  </span>
                  <span
                    className={
                      isTax
                        ? "font-display text-lg text-primary-text"
                        : "font-body text-sm font-medium text-text-primary"
                    }
                  >
                    {row.value}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Format selection */}
        <div>
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.06em] text-text-muted">
            Document format
          </p>
          <div className="flex flex-col gap-2">
            {FORMAT_OPTIONS.map((opt) => {
              const selected = format === opt.key;

              return (
                <label
                  key={opt.key}
                  htmlFor={`fmt-${opt.key}`}
                  className={formatOption({
                    selected,
                  })}
                >
                  <input
                    type="radio"
                    id={`fmt-${opt.key}`}
                    name="download-format"
                    value={opt.key}
                    checked={selected}
                    onChange={() => setFormat(opt.key)}
                    className="sr-only"
                  />
                  <i
                    className={`${opt.icon} ${formatIcon({ selected })}`}
                    aria-hidden="true"
                  />
                  <div>
                    <p
                      className={
                        selected
                          ? "font-body text-sm font-medium text-primary-text"
                          : "font-body text-sm font-medium text-text-primary"
                      }
                    >
                      {opt.label}
                    </p>
                    <p className="mt-1 font-body text-xs leading-5 text-text-muted">
                      {opt.desc}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Confirmation */}
        <Checkbox
          checked={confirmed}
          onChange={setConfirmed}
          label="I confirm that the information in this return is accurate and complete to the best of my knowledge. I understand I am legally responsible for the contents of this return."
          hint="You must confirm accuracy before"
          disabled={false}
        />
        {/* Info */}
        <InfoAlert>
          Generated documents are in PDF format. For online submission, upload
          to your state IRS portal. For physical submission, print two copies
          and keep one for your records.
        </InfoAlert>
      </div>
    </ModalBase>
  );
}
