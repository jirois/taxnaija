import { cva } from "class-variance-authority";
import { ExternalLink } from "../ExternalLink";
import { CopyButton } from "../CopyButton";
import { InfoAlert } from "./Banner";

// State Data
export interface StateIRSInfo {
  state: string;
  irsName: string;
  portalUrl?: string;
  officeAddress?: string;
  phone?: string;
  notes?: string;
}

// eslint-disable-next-line react-refresh/only-export-components
export const STATE_REGISTRY: Record<string, StateIRSInfo> = {
  Lagos: {
    state: "Lagos",
    irsName: "Lagos State Internal Revenue Service (LIRS)",
    portalUrl: "https://www.lirs.gov.ng",
    officeAddress: "Revenue House, Lagos",
    phone: "0700-CALL-LIRS",
    notes: "Online filing available at e-Tax portal.",
  },
};

// Cva Styles

const card = cva(
  "border rounded-lg overflow-hidden bg-bg-elevated border-border ",
);

const header = cva(
  "flex items-start gap-3 bg-bg-surface border-b border-border",
);
const iconBox = cva(
  "w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 bg-brand-light border border-green-200",
);

const stepDot = cva(
  "w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center text-xs font-semibold ",
);

const stepLine = cva("w-px flex-1 bg-border mt-1");

const sectionTitle = cva(
  "text-xs uppercase tracking-wide font-semibold text-text-muted mb-3",
);

export interface StatePortalCardProps {
  stateOfResidence: string;
  className?: string;
}

function fallback(state: string): StateIRSInfo {
  return {
    state,
    irsName: `${state} State Internal Revenue Service`,
    portalUrl: "https://www.nrs.gov.ng",
    notes: `No registery entry yet for ${state}.`,
  };
}

export function StatePortalCard({
  stateOfResidence,
  className,
}: StatePortalCardProps) {
  const info = STATE_REGISTRY[stateOfResidence] ?? fallback(stateOfResidence);

  const steps = [
    {
      num: 1,
      head: "Download your return",
      body: "Generate your pre-filled tax return.",
    },
    {
      num: 2,
      head: "Submit online",
      body: info.portalUrl
        ? `Upload on ${info.irsName} portal.`
        : `Visit IRS office.`,
    },
    {
      num: 3,
      head: "Submit in person",
      body: info.officeAddress
        ? `Bring copies to ${info.officeAddress}`
        : "Visit nearest IRS office",
    },
    {
      num: 4,
      head: "Get receipt",
      body: "Collect stamped acknowledgment.",
    },
  ];

  return (
    <div className={card({ className })}>
      {/* HEADER */}
      <div className={header()}>
        <div className={iconBox()}>
          <i className="ti ti-building-bank text-primary text-lg" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-body text-sm font-semibold text-text-brand">
            {info.irsName}
          </p>

          {info.portalUrl && (
            <ExternalLink
              href={info.portalUrl}
              className="text-xs text-text-muted"
            >
              {info.portalUrl.replace(/^https?:\/\//, "")}
            </ExternalLink>
          )}
        </div>

        {info.portalUrl && (
          <CopyButton
            text={info.portalUrl}
            label="copy"
            mode="icon"
            size="sm"
          />
        )}
      </div>

      {/* BODY */}
      <div className="p-4">
        <p className={sectionTitle()}>Submission steps</p>

        <div className="flex flex-col">
          {steps.map((step, i) => (
            <div key={step.num} className="flex gap 3 pb-4 last:pb-0">
              {/* STEP INDICATOR */}
              <div className="flex flex-col items-center">
                <div className={stepDot()}>{step.num}</div>
                {i !== steps.length - 1 && <div className={stepLine()} />}
              </div>
              {/* STEP CONTENT */}
              <div>
                <p className="text-sm font-semibold text-text-brand">
                  {step.head}
                </p>
                <p className="text-sm text-text-muted leading-relaxed">
                  {step.body}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* PHONE */}
        {info.phone && (
          <div className="flex items-center gap-2 mt-4 p-2 border border-border rounded-md bg-bg-surface">
            <i className="ti ti-phone text-text-muted text-sm" />
            <span className="text-sm text-text-body flex-1">{info.phone}</span>
            <CopyButton text={info.phone} label="Copy" mode="icon" size="sm" />
          </div>
        )}
        {/* NOTES */}
        {info.notes && <InfoAlert className="mt-3">{info.notes}</InfoAlert>}
      </div>
    </div>
  );
}
