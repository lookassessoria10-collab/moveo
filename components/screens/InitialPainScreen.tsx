"use client";

import { useState } from "react";
import { ScreenShell } from "../ui/Card";
import { Button } from "../ui/Button";
import { PainScale } from "../PainScale";
import { useAssessmentStore } from "@/stores/assessmentStore";

export function InitialPainScreen() {
  const intake = useAssessmentStore((s) => s.intake);
  const setIntake = useAssessmentStore((s) => s.setIntake);
  const setScreen = useAssessmentStore((s) => s.setScreen);
  const [value, setValue] = useState(intake.initialPain);

  return (
    <ScreenShell className="justify-between">
      <div>
        <h1 className="text-2xl font-bold text-moveo-ink">
          Quanto seu ombro está incomodando agora?
        </h1>
        <div className="mt-10">
          <PainScale value={value} onChange={setValue} />
        </div>
      </div>
      <Button
        className="mt-8"
        onClick={() => {
          setIntake({ initialPain: value });
          setScreen("problemDuration");
        }}
      >
        CONTINUAR
      </Button>
    </ScreenShell>
  );
}
