import { CalculatorPage } from "./pages/CalculatorPage";
import { useNavigate } from "react-router-dom";

export default function App() {
  const navigate = useNavigate();
  return <CalculatorPage lang="en" onStartFiling={() => navigate("/file")} />;
}
