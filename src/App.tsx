import { FieldGroup } from "./ui/form-components/FieldGroup";

export default function App() {
  return (
    <div className="text-red text-3xl font-bold">
      <h1>TaxNaija</h1>

      <div className="max-w-md">
        <FieldGroup
          label="Annual Income"
          hint="Enter your gross yearly income"
          required
          // error={errors.income}
        >
          <input
            type="number"
            className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-[var(--color-brand)]"
          />
        </FieldGroup>
      </div>
    </div>
  );
}
