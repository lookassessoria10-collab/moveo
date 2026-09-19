"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PainScale } from "@/components/PainScale";
import { useKneeStore } from "../../store";

export function InitialPainScreen() {
  const intake = useKneeStore((s) => s.intake);
  const setIntake = useKneeStore((s) => s.setIntake);
  const setScreen = useKneeStore((s) => s.setScreen);
  const [value, setValue] = useState(intake.initialPain);

  return (
    <ScreenShell className="justify-between">
      <div>
        <h1 className="text-2xl font-bold text-moveo-ink">
          Quanto seu joelho está incomodando agora?
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
