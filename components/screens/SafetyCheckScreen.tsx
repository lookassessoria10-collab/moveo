"use client";

import { useState } from "react";
import { ScreenShell } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAssessmentStore } from "@/stores/assessmentStore";
import { SafetyAnswers } from "@/lib/types";
import { hasSafetyConcern } from "@/lib/safety";

const QUESTIONS: { key: keyof SafetyAnswers; label: string }[] = [
  { key: "recentTrauma", label: "Você sofreu uma queda ou trauma importante recentemente?" },
  { key: "severePain", label: "Você está com dor muito intensa neste momento?" },
  { key: "suddenWeakness", label: "Você perdeu força de forma súbita?" },
  { key: "cannotMoveArm", label: "Você não consegue movimentar o braço?" },
];

export function SafetyCheckScreen() {
  const setSafety = useAssessmentStore((s) => s.setSafety);
  const setScreen = useAssessmentStore((s) => s.setScreen);
  const [answers, setAnswers] = useState<SafetyAnswers>({
    recentTrauma: false,
    severePain: false,
    suddenWeakness: false,
    cannotMoveArm: false,
  });

  const handleContinue = () => {
    setSafety(answers);
    if (hasSafetyConcern(answers)) {
      setScreen("safetyBlocked");
    } else {
      setScreen("preparation");
    }
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
