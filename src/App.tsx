import { LandingPage } from "./pages/Landing";

export default function App() {
  return (
    <>
      <LandingPage
        lang="en"
        onStartFiling={() => {
          console.log("Navigate to filing flow");
        }}
        onCalculate={() => {
          console.log("Navigate to calculator");
        }}
        onLearn={() => {
          console.log("Navigate to learn page");
        }}
      />
    </>
  );
}
