import { ProgressBar } from "./ui/ProgressBar";

export default function App() {
  return (
    <div className="text-red text-8xl font-bold">
      <h1>TaxNaija</h1>

      <div>
        <ProgressBar value={70} variant="primary" showLabel />
      </div>
    </div>
  );
}
