"use client";

import { ScreenShell } from "../ui/Card";
import { Button } from "../ui/Button";

/**
 * Tela de bloqueio de segurança compartilhada entre os módulos de joelho e
 * coluna (o módulo de ombro mantém sua própria versão original em
 * components/screens/SafetyBlockedScreen.tsx, para não alterar seu
 * comportamento existente).
 */
export function SafetyBlockedScreen({ onReset }: { onReset: () => void }) {
  return (
    <ScreenShell className="justify-between">
      <div className="mt-10 text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-moveo-warn/15 text-3xl">
          ⚠️
        </div>
        <h1 className="text-2xl font-bold text-moveo-ink">
          Talvez esta avaliação não seja o melhor primeiro passo neste momento.
        </h1>
        <p className="mt-3 text-base text-moveo-muted">
          Procure uma avaliação profissional antes de realizar os movimentos.
        </p>
      </div>
      <Button variant="secondary" className="mt-8" onClick={onReset}>
        VOLTAR AO INÍCIO
      </Button>
    </ScreenShell>
  );
}
