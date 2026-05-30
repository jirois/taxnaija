import { useState, useRef } from "react";
import { cva } from "class-variance-authority";
import { ModalBase } from "./ModalBase";
import { Button } from "../Button";
import { CopyButton } from "../CopyButton";
import { InfoAlert } from "./Banner";
import type { TaxInput } from "../../tax-engine/types";

const tabButton = cva(
  [
    "flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium transition-colors",
    "border-r last:border-r-0",
  ],
  {
    variants: {
      active: {
        true: "bg-brand/10 text-primary",
        false: "text-text-muted hover:bg-text-muted/40",
      },
    },
  },
);

const panelCard = cva("flex flex-col gap-3");

const inputBox = cva(
  "flex items-center gap-2 px-3 py-2 rounded-md border bg-text-muted/40",
);

export interface SaveProgressModalProps {
  open: boolean;
  onClose: () => void;
  formData: Partial<TaxInput> & Record<string, unknown>;
  fileName?: string;
}

export function SaveProgressModal({
  open,
  onClose,
  formData,
  fileName = "taxnaija-progress",
}: SaveProgressModalProps) {
  const [downloaded, setDownloaded] = useState(false);
  const [activeTab, setActiveTab] = useState<"link" | "file">("link");
  const linkRef = useRef<HTMLInputElement>(null);

  const encoded = btoa(JSON.stringify(formData));
  const shareUrl = `${window.location.origin}${window.location.pathname}?progress=${encoded}`;
  const truncated =
    shareUrl.length > 80 ? shareUrl.slice(0, 77) + "_" : shareUrl;

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;
    a.download = `${fileName}-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();

    URL.revokeObjectURL(url);

    setDownloaded(true);

    setTimeout(() => setDownloaded(false), 3000);
  };

  const tabs = [
    { key: "link", label: "Shareable link", icon: "ti ti-link" },
    { key: "file", label: "Download file", icon: "ti ti-download" },
  ] as const;

  return (
    <ModalBase
      open={open}
      onClose={onClose}
      title="Save your progress"
      description="Your data never leaves your device - no account needed."
      size="sm"
      footer={
        <Button variant="ghost" size="md" onClick={onClose} fullWidth>
          Done
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Tab */}
        <div className="flex rounded-md border overflow-hidden">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={tabButton({ active: activeTab === tab.key })}
            >
              <i className={`${tab.icon} text-[14px]`} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* LINK TAB */}
        {activeTab === "link" && (
          <div className={panelCard()}>
            <p className="text-sm text-text-muted leading-relaxed">
              Copy this link and open it on any device to resume where you left
              off. Your data is encoded in the URL — nothing is stored on our
              servers.
            </p>

            <div className={inputBox()}>
              <i className="ti ti-link text-text-muted text-[14px]" />

              <input
                ref={linkRef}
                readOnly
                value={truncated}
                onClick={(e) => (e.target as HTMLInputElement).select()}
                className="flex-1 bg-transparent online-none text-xs font-mono text-bg-surface min-w-0"
              />
              <CopyButton
                text={shareUrl}
                label="copy link"
                mode="icon"
                size="sm"
              />
            </div>
          </div>
        )}

        {/* FILE TAB */}
        {activeTab === "file" && (
          <div className={panelCard()}>
            <p className="text-sm text-text-muted leading-relaxed">
              Download a JSON snapshot of your current data. You can re-import
              it later.
            </p>

            <Button
              variant={downloaded ? "secondary" : "primary"}
              size="md"
              fullWidth
              onClick={handleDownload}
              leftIcon={
                <i className={downloaded ? "ti ti-check" : "ti ti-download"} />
              }
            >
              {downloaded ? "Saved to Downloads" : `Download ${fileName}.json`}
            </Button>
          </div>
        )}

        {/* Privacy note */}
        <InfoAlert>
          <strong>Your privacy:</strong> TaxNaija never sends your financial
          data anywhere. All calculations happen in your browser.
        </InfoAlert>
      </div>
    </ModalBase>
  );
}
