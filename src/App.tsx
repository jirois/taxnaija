import { EffectiveRateGauge } from "./ui/components/EffectiveRateGauge";

export default function App() {
  return (
    <>
      <h1 className="text-red-600 text-3xl font-bold">TaxNaija</h1>

      <div className="mx-auto max-w-6xl space-y-6">
        <EffectiveRateGauge
          effectiveRate={0.082}
          annualTax={125000}
          chargeableIncome={1500000}
        />
      </div>
    </>
  );
}
