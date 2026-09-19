"use client";

import { ScreenShell, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { average, standardDeviation } from "@/lib/movementMetrics";
import { useSpineStore } from "../../store";

const TEST_LABEL: Record<string, string> = {
  flexion: "Flexão anterior",
  lateralRight: "Inclinação lateral direita",
  lateralLeft: "Inclinação lateral esquerda",
  extension: "Extensão confortável",
};

export function TechnicalReportScreen() {
  const result = useSpineStore((s) => s.result);
  const setScreen = useSpineStore((s) => s.setScreen);

  if (!result) return null;

  return (
    <ScreenShell>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-moveo-ink">Dados detalhados</h1>
        <button className="text-sm text-moveo-primary" onClick={() => setScreen("results")}>
          Voltar
        </button>
      </div>
      <p className="mb-4 text-xs text-moveo-muted">
        Valores estimados a partir de visão computacional — não equivalem a goniometria clínica
        certificada, nem isolam segmentos específicos da coluna.
      </p>
      <div className="space-y-4">
        {result.results.map((r, i) => {
          const durations = r.attempts.map((a) => a.duration / 1000);
          const velocities = r.attempts.map((a) => a.averageAngularVelocity);
          const hipComp = r.attempts.map((a) => a.hipCompensation);
          return (
            <Card key={i}>
              <h3 className="text-sm font-bold text-moveo-ink">{TEST_LABEL[r.test]}</h3>
              <div className="mt-3 space-y-1 text-sm text-moveo-ink">
                {r.attempts.map((a) => (
                  <div key={a.repetitionIndex} className="flex justify-between">
                    <span className="text-moveo-muted">Rep {a.repetitionIndex}:</span>
                    <span className="font-medium">{Math.round(a.maxAngle)}°</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-moveo-border pt-1">
                  <span className="text-moveo-muted">Média:</span>
                  <span className="font-medium">{Math.round(r.averageMaxAngle)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Maior:</span>
                  <span className="font-medium">{Math.round(r.bestMaxAngle)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Tempo médio:</span>
                  <span className="font-medium">{average(durations).toFixed(1)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Velocidade angular média:</span>
                  <span className="font-medium">{Math.round(average(velocities))}°/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Compensação do quadril:</span>
                  <span className="font-medium">{Math.max(...hipComp).toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Desvio padrão entre reps:</span>
                  <span className="font-medium">
                    {standardDeviation(r.attempts.map((a) => a.maxAngle)).toFixed(1)}°
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Dor informada:</span>
                  <span className="font-medium">{r.pain.hadPain ? `${r.pain.intensity}/10` : "0/10"}</span>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      <Button className="mt-6" onClick={() => setScreen("results")}>
        VOLTAR AO RESULTADO
      </Button>
    </ScreenShell>
  );
}
