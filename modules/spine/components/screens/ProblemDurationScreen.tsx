"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OptionList } from "@/components/ui/OptionList";
import { useSpineStore } from "../../store";
import { SpineIntakeInfo } from "../../types";

const OPTIONS: { value: SpineIntakeInfo["problemDuration"]; label: string }[] = [
  { value: "today", label: "Hoje" },
  { value: "days", label: "Alguns dias" },
  { value: "weeks", label: "Algumas semanas" },
  { value: "months", label: "Alguns meses" },
  { value: "over_6_months", label: "Mais de 6 meses" },
  { value: "no_pain", label: "Não tenho dor" },
];

export function ProblemDurationScreen() {
  const intake = useSpineStore((s) => s.intake);
  const setIntake = useSpineStore((s) => s.setIntake);
  const setScreen = useSpineStore((s) => s.setScreen);
  const [value, setValue] = useState(intake.problemDuration);

  return (
    <ScreenShell className="justify-between">
      <div>
        <h1 className="text-2xl font-bold text-moveo-ink">Há quanto tempo?</h1>
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
