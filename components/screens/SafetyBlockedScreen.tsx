"use client";

import { ScreenShell } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAssessmentStore } from "@/stores/assessmentStore";

export function SafetyBlockedScreen() {
  const reset = useAssessmentStore((s) => s.reset);

  return (
    <ScreenShell className="justify-between">
      <div className="mt-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-moveo-warn/15 text-3xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold text-moveo-ink">
          Talvez este teste não seja o melhor primeiro passo neste momento.
        </h1>
        <p className="mt-3 text-base text-moveo-muted">
          Procure uma avaliação profissional antes de realizar os movimentos.
        </p>
      </div>
      <Button variant="secondary" className="mt-8" onClick={reset}>
        VOLTAR AO INÍCIO
      </Button>
    </ScreenShell>
  );
}
