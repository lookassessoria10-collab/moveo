"use client";

import { useState } from "react";
import { ScreenShell } from "../ui/Card";
import { Button } from "../ui/Button";
import { OptionList } from "../ui/OptionList";
import { useAssessmentStore } from "@/stores/assessmentStore";
import { IntakeInfo } from "@/lib/types";

const OPTIONS: { value: IntakeInfo["symptomSide"]; label: string }[] = [
  { value: "right", label: "Direito" },
  { value: "left", label: "Esquerdo" },
  { value: "both", label: "Os dois" },
  { value: "testing", label: "Estou apenas testando" },
];

export function SymptomSideScreen() {
  const intake = useAssessmentStore((s) => s.intake);
  const setIntake = useAssessmentStore((s) => s.setIntake);
  const setScreen = useAssessmentStore((s) => s.setScreen);
  const [value, setValue] = useState(intake.symptomSide);

  return (
    <ScreenShell className="justify-between">
      <div>
        <h1 className="text-2xl font-bold text-moveo-ink">Qual ombro está incomodando?</h1>
        <p className="mt-2 text-sm text-moveo-muted">
          Essa informação é apenas contexto para o relatório.
        </p>
        <div className="mt-6">
          <OptionList options={OPTIONS} selected={value} onSelect={setValue} />
        </div>
      </div>
      <Button
        className="mt-8"
        onClick={() => {
          setIntake({ symptomSide: value });
          setScreen("initialPain");
        }}
      >
        CONTINUAR
      </Button>
    </ScreenShell>
  );
}
