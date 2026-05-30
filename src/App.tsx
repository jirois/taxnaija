import { useState } from "react";
import { SaveProgressModal } from "./ui/components/SaveProgressModal";

export default function App() {
  const [saveOpen, setSaveOpen] = useState(false);

  // 👇 your main form state (example)
  const [formData, setFormData] = useState({
    income: 50000 as number,
    state: "",
    employmentType: "employed",
  });
  // -------------------------------
  // 1. OPEN MODAL (manual trigger)
  // -------------------------------
  const openSaveModal = () => {
    setSaveOpen(true);
  };

  // -------------------------------
  // 2. CLOSE MODAL
  // -------------------------------
  const closeSaveModal = () => {
    setSaveOpen(false);
  };

  return (
    <>
      <div className="text-red text-3xl font-bold">
        <h1>TaxNaija</h1>
      </div>

      <button onClick={openSaveModal}>Save Progress</button>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <input
          placeholder="Income"
          value={formData.income ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              income: Number(e.target.value),
            }))
          }
        />

        <input
          placeholder="State"
          value={formData.state ?? ""}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              state: e.target.value,
            }))
          }
        />
      </div>

      {/* =========================
          SAVE PROGRESS MODAL
      ========================== */}
      <SaveProgressModal
        open={saveOpen}
        onClose={closeSaveModal}
        formData={{
          state: formData.state,
        }}
        fileName="taxnaija-progress"
      />
    </>
  );
}
