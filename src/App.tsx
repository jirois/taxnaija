import { useState } from "react";
import { StatePortalCard } from "./ui/components/StatePortalCard";

export default function App() {
  const [stateOfResidence, setStateOfResidence] = useState("Lagos");
  return (
    <>
      <h1 className="text-red-600 text-3xl font-bold">TaxNaija</h1>

      <div className="max-w-3xl mx-auto p-6 space-y-4">
        <select
          value={stateOfResidence}
          onChange={(e) => setStateOfResidence(e.target.value)}
          className="w-full rounded-md border border-border bg-bg-elevated p-3"
        >
          <option value="Lagos">Lagos</option>
          <option value="Rivers">Rivers</option>
          <option value="Oyo">Oyo</option>
          <option value="Delta">Delta</option>
          <option value="Enugu">Enugu</option>
          <option value="Kano">Kano</option>
          <option value="FCT Abuja">FCT Abuja</option>
        </select>

        <StatePortalCard stateOfResidence={stateOfResidence} />
      </div>
    </>
  );
}
