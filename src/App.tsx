import { AccordionGroup } from "./ui/AccordionItem";
export default function App() {
  return (
    <div className="text-red text-3xl font-bold">
      <h1>TaxNaija</h1>

      <AccordionGroup
        defaultOpenId="q1"
        items={[
          {
            id: "q1",
            question: "What is TaxNaija?",
            answer: "TaxNaija helps Nigerians calculate taxes easily.",
          },
          {
            id: "q2",
            question: "Do I need to register?",
            answer: "No, you can use it without registration.",
          },
          {
            id: "q3",
            question: "Is it mobile friendly?",
            answer: "Yes, it's fully responsive.",
          },
        ]}
      />
    </div>
  );
}
