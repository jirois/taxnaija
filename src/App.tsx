import { FormStep } from "./ui/form-components/FormStep";

export default function App() {
  return (
    <>
      <div className="text-red text-3xl font-bold">
        <h1>TaxNaija</h1>
      </div>
      <div>
        <FormStep
          stepNumber={5}
          title="Review & Submit"
          subtitle="Confirm all details before generating your tax PDF"
          nav={{
            onBack: () => console.log("back"),
            onContinue: () => console.log("submit"),
            isFinalStep: true,
            continueLoading: false,
          }}
        >
          <div>Summary goes here...</div>
        </FormStep>
      </div>
    </>
  );
}
