import { useState } from "react";

import { DownloadModal } from "./ui/components/DownloadModal";
import type { TaxResult } from "./tax-engine/types";
import { Button } from "./ui/Button";

export default function App() {
  const [open, setOpen] = useState(false);

  const taxResult: TaxResult = {
    taxYear: 2025,
    taxAct: "NTA 2025",
    annualSalary: 2400000,
    otherIncome: 0,
    grossIncome: 2400000,

    reliefs: {
      pension: 192000,
      rent: 240000,
      insurance: 0,
      nhf: 0,
      nhis: 0,
      total: 432000,
    },

    chargeableIncome: 1968000,
    bracketResults: [],
    annualTax: 175200,
    monthlyTax: 14600,

    zeroRateBandApplied: false,
    minimumWageExempt: false,

    effectiveRate: 0.073,
    effectiveRateOnChargeable: 0.089,
  };

  const handleDownload = async (format: "return" | "computation") => {
    console.log("Generating:", format);

    // Generate PDF here
    await new Promise((resolve) => setTimeout(resolve, 1500));

    console.log("Download complete");
  };

  return (
    <>
      <div className="text-red text-3xl font-bold">
        <h1>TaxNaija</h1>
      </div>
      <div className="bg-primary-light text-amber-200">
        <h2>Heading test</h2>
      </div>
      <Button variant="primary" onClick={() => setOpen(true)}>
        Download Return
      </Button>

      <DownloadModal
        open={open}
        onClose={() => setOpen(false)}
        taxResult={taxResult}
        taxpayerName="Ajiri Omas"
        stateOfRes="Delta"
        onDownload={handleDownload}
      />
    </>
  );
}
