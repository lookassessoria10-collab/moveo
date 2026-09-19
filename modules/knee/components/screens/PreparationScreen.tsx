"use client";

import { ScreenShell } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useKneeStore } from "../../store";

const TIPS = [
  "Coloque o celular apoiado, sem segurar",
  "Cada teste vai indicar se o celular deve ficar de frente ou de lado",
  "Use um ambiente bem iluminado e com espaço livre",
  "Evite roupas muito largas nas pernas",
  "Tenha uma cadeira estável por perto para o teste de sentar e levantar",
];

export function PreparationScreen() {
  const setScreen = useKneeStore((s) => s.setScreen);

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
      <Button className="mt-8" onClick={() => setScreen("camera")}>
        ABRIR CÂMERA
      </Button>
    </ScreenShell>
  );
}
