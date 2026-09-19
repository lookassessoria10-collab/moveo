"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useKneeStore } from "../../store";
import { KneeSafetyAnswers } from "../../types";
import { hasSafetyConcern } from "@/lib/safety";

const QUESTIONS: { key: keyof KneeSafetyAnswers; label: string }[] = [
  { key: "recentTrauma", label: "Você sofreu uma queda ou trauma importante recentemente?" },
  { key: "severePain", label: "Você está com dor muito intensa neste momento?" },
  { key: "cannotBearWeight", label: "Você não consegue apoiar o peso na perna?" },
  { key: "visibleDeformity", label: "Você percebeu deformidade após algum trauma?" },
  { key: "suddenMovementLoss", label: "Você apresentou perda súbita importante de movimento?" },
];

export function SafetyCheckScreen() {
  const setSafety = useKneeStore((s) => s.setSafety);
  const setScreen = useKneeStore((s) => s.setScreen);
  const [answers, setAnswers] = useState<KneeSafetyAnswers>({
    recentTrauma: false,
    severePain: false,
    cannotBearWeight: false,
    visibleDeformity: false,
    suddenMovementLoss: false,
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
