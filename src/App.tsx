import { EmptyState } from "./ui/EmptyState";
export default function App() {
  return (
    <div className="text-red text-3xl font-bold">
      <h1>TaxNaija</h1>

      <EmptyState
        title="No tax records yet"
        description="Your submitted filings will appear here once you complete your first return."
      />

      <EmptyState
        icon="ti ti-calculator"
        title="No calculation yet"
        description="Enter your income to see your tax breakdown."
        action={{
          label: "Start calculation",
          onClick: () => console.log("Navigate to calculator"),
          variant: "primary",
        }}
      />

      <EmptyState
        icon="ti ti-wifi-off"
        title="Unable to load data"
        description="Check your connection and try again."
        action={{
          label: "Retry",
          onClick: () => window.location.reload(),
        }}
      />
    </div>
  );
}
