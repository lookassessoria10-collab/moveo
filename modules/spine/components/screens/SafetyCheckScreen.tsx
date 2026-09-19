"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useSpineStore } from "../../store";
import { SpineSafetyAnswers } from "../../types";
import { hasSafetyConcern } from "@/lib/safety";

const QUESTIONS: { key: keyof SpineSafetyAnswers; label: string }[] = [
  { key: "recentTrauma", label: "Você sofreu trauma importante recentemente?" },
  { key: "severePain", label: "Está com dor muito intensa?" },
  { key: "suddenWeaknessLoss", label: "Está com perda súbita importante de força?" },
  { key: "difficultyStanding", label: "Possui dificuldade importante para ficar em pé?" },
];

export function SafetyCheckScreen() {
  const setSafety = useSpineStore((s) => s.setSafety);
  const setScreen = useSpineStore((s) => s.setScreen);
  const [answers, setAnswers] = useState<SpineSafetyAnswers>({
    recentTrauma: false,
    severePain: false,
    suddenWeaknessLoss: false,
    difficultyStanding: false,
  });

  const handleContinue = () => {
    setSafety(answers);
    setScreen(hasSafetyConcern(answers) ? "safetyBlocked" : "preparation");
  };

  return (
    <ScreenShell className="justify-between">
      <div>
        <h1 className="text-2xl font-bold text-moveo-ink">Antes de começar</h1>
        <p className="mt-2 text-sm text-moveo-muted">
          Responda com sinceridade para sua segurança.
        </p>
        <div className="mt-6 space-y-4">
          {QUESTIONS.map((q) => (
            <div key={q.key} className="rounded-2xl border border-moveo-border bg-white p-4">
              <p className="mb-3 text-sm font-medium text-moveo-ink">{q.label}</p>
              <div className="flex gap-3">
                {[
                  { v: false, label: "Não" },
                  { v: true, label: "Sim" },
                ].map((opt) => (
                  <button
                    key={String(opt.v)}
                    onClick={() => setAnswers((a) => ({ ...a, [q.key]: opt.v }))}
                    className={`flex-1 rounded-xl border px-4 py-2 text-sm font-semibold ${
                      answers[q.key] === opt.v
                        ? "border-moveo-primary bg-moveo-primarySoft text-moveo-primary"
                        : "border-moveo-border bg-white text-moveo-ink"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Button className="mt-8" onClick={handleContinue}>
        CONTINUAR
      </Button>
    </ScreenShell>
  );
}
