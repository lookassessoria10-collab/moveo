"use client";

import { ScreenShell } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAssessmentStore } from "@/stores/assessmentStore";
import { warmUpSpeech } from "@/lib/useSpeech";

const TIPS = [
  "Coloque o celular apoiado",
  "Fique de frente para a câmera",
  "Deixe aproximadamente 2 metros entre você e o celular",
  "Certifique-se de que braços e tronco apareçam completamente",
  "Use um ambiente bem iluminado",
  "Evite roupas muito largas",
  "Deixe espaço para movimentar os braços",
  "Mantenha seu celular na posição vertical",
];

export function PreparationScreen() {
  const setScreen = useAssessmentStore((s) => s.setScreen);

  return (
    <ScreenShell className="justify-between">
      <div>
        <h1 className="text-2xl font-bold text-moveo-ink">Prepare o ambiente</h1>
        <p className="mt-2 text-sm text-moveo-muted">Para medir melhor seus movimentos:</p>
        <ul className="mt-5 space-y-3">
          {TIPS.map((tip) => (
            <li key={tip} className="flex items-start gap-3 text-sm text-moveo-ink">
              <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-moveo-primarySoft text-xs text-moveo-primary">
                ✓
              </span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
      <Button
        className="mt-8"
        onClick={() => {
          warmUpSpeech();
          setScreen("camera");
        }}
      >
        ABRIR CÂMERA
      </Button>
    </ScreenShell>
  );
}
