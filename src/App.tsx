import { TooltipChip } from "./ui/components/TooltipChip";

export default function App() {
  return (
    <>
      <div className="text-red text-3xl font-bold">
        <h1>TaxNaija</h1>
      </div>

      <div style={{ display: "flex", gap: 12 }}>
        <TooltipChip label="Rent relief">
          You can claim up to 20% of rent paid annually, capped at ₦500,000
          under NTA 2025.
        </TooltipChip>

        <TooltipChip label="Pension (8%)">
          Mandatory employee contribution under the Pension Reform Act 2014.
          Typically 8% of your monthly salary.
        </TooltipChip>
      </div>
    </>
  );
}
