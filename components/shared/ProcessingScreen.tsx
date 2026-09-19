"use client";

import { useEffect, useState } from "react";
import { ScreenShell } from "../ui/Card";

const DEFAULT_STEPS = [
  "Organizando as medições...",
  "Comparando os lados...",
  "Calculando amplitudes...",
  "Observando compensações...",
  "Preparando seu resultado...",
];

/**
 * Tela de processamento compartilhada entre os módulos de joelho e coluna.
 * O módulo de ombro mantém sua própria versão original.
 */
export function ProcessingScreen({ steps = DEFAULT_STEPS }: { steps?: string[] }) {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }, 350);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <ScreenShell className="items-center justify-center text-center">
      <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-moveo-primarySoft">
        <div className="h-14 w-14 animate-spin rounded-full border-4 border-moveo-primary border-t-transparent" />
      </div>
      <h1 className="text-xl font-bold text-moveo-ink">Analisando seu movimento</h1>
      <p className="mt-3 text-sm text-moveo-muted">{steps[stepIndex]}</p>
    </ScreenShell>
  );
}
