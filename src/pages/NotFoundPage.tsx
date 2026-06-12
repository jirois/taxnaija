import { cva } from "class-variance-authority";
import { Button } from "../ui/Button";
import type { Language } from "../state/store";

export interface NotFoundPageProps {
  lang: Language;
  onGoHome: () => void;
  onLearn: () => void;
}

// cva

const container = cva(
  [
    "flex",
    "min-h-[60vh]",
    "flex-col",
    "items-center",
    "justify-center",
    "px-6",
    "py-12",
    "text-center",
  ].join(" "),
);

const errorCode = cva(
  [
    "font-display",
    "italic",
    "leading-none",
    "text-border",
    "select-none",
    "text-[5rem]",
    "sm:text-[7rem]",
    "md:text-[9rem]",
  ].join(" "),
);

const title = cva(
  [
    "font-display",
    "font-normal",
    "text-2xl",
    "sm:text-3xl",
    "text-foreground",
  ].join(" "),
);

const description = cva(
  [
    "max-w-md",
    "text-sm",
    "sm:text-base",
    "leading-relaxed",
    "text-muted-foreground",
  ].join(" "),
);

const actions = cva(
  [
    "flex",
    "w-full",
    "max-w-sm",
    "flex-col",
    "gap-3",
    "sm:flex-row",
    "sm:justify-center",
  ].join(" "),
);

// Component

export function NotFoundPage({ lang, onGoHome, onLearn }: NotFoundPageProps) {
  const isPg = lang === "pidgin";

  return (
    <section className={container()}>
      {/* 404 */}
      <span className={errorCode()}>404</span>

      {/* Heading */}
      <h1 className={title()}>
        {isPg ? "This page no dey" : "Page not found"}
      </h1>

      {/* Description */}
      <p className={description()}>
        {isPg
          ? "The page wey you dey find no dey here. Abeg return go home make you continue your tax filing."
          : "The page you're looking for doesn't exist. Return home to continue filing your taxes."}
      </p>

      {/* Actions */}
      <div className={actions()}>
        <Button
          variant="primary"
          size="md"
          onClick={onGoHome}
          className="w-full sm:w-auto"
          leftIcon={<i className="ti ti-home" aria-hidden="true" />}
        >
          {isPg ? "Go home" : "Go home"}
        </Button>

        <Button
          variant="ghost"
          size="md"
          onClick={onLearn}
          className="w-full sm:w-auto"
        >
          {isPg ? "Learn about tax" : "Learn about tax"}
        </Button>
      </div>
    </section>
  );
}

export default NotFoundPage;
