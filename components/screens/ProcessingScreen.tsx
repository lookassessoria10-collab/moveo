"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "../ui/Card";

const STEPS = [
  "Organizando as medições...",
  "Comparando os lados...",
  "Calculando amplitudes...",
  "Observando compensações...",
  "Preparando seu resultado...",
];

export function ProcessingScreen() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
    }, 350);
    return () => clearInterval(interval);
  }, []);

  return (
    <ScreenShell className="items-center justify-center text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-moveo-primarySoft">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-moveo-primary border-t-transparent" />
      </div>
      <h1 className="text-xl font-bold text-moveo-ink">Analisando seu movimento</h1>
      <p className="mt-3 text-sm text-moveo-muted">{STEPS[stepIndex]}</p>
    </ScreenShell>
  );
}
