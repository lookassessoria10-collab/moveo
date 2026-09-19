"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OptionList } from "@/components/ui/OptionList";
import { useKneeStore } from "../../store";
import { KneeIntakeInfo } from "../../types";

const OPTIONS: { value: KneeIntakeInfo["problemDuration"]; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "days", label: "Alguns dias" },
  { value: "weeks", label: "Algumas semanas" },
  { value: "months", label: "Alguns meses" },
  { value: "over_6_months", label: "Mais de 6 meses" },
  { value: "no_pain", label: "Não tenho dor" },
];

export function ProblemDurationScreen() {
  const intake = useKneeStore((s) => s.intake);
  const setIntake = useKneeStore((s) => s.setIntake);
  const setScreen = useKneeStore((s) => s.setScreen);
  const [value, setValue] = useState(intake.problemDuration);

  return (
    <ScreenShell className="justify-between">
      <div>
        <h1 className="text-2xl font-bold text-moveo-ink">Há quanto tempo isso começou?</h1>
        <p className="mt-2 text-sm text-moveo-muted">
          Essa informação não será usada para diagnosticar. É apenas contexto para o relatório.
        </p>
        <div className="mt-6">
          <OptionList options={OPTIONS} selected={value} onSelect={setValue} />
        </div>
      </div>
      <Button
        className="mt-8"
        onClick={() => {
          setIntake({ problemDuration: value });
          setScreen("safetyCheck");
        }}
      >
        CONTINUAR
      </Button>
    </ScreenShell>
  );
}
