import { CopyButton } from "./ui/CopyButton";
export default function App() {
  return (
    <div className="text-red text-8xl font-bold">
      <h1>TaxNaija</h1>

      <div className="flex items-center gap-2">
        <span>TIN-203949</span>

        <CopyButton text="TIN-203949" />
        <CopyButton
          text="https://taxnaija.gov.ng/portal"
          mode="inline"
          label="Copy link"
        />
        <CopyButton
          text="PAYE-REF-88921"
          mode="inline"
          size="md"
          label="Copy reference"
        />
        <CopyButton text="REG-882100" size="sm" />
      </div>
    </div>
  );
}
