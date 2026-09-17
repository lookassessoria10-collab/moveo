"use client";

import { ScreenShell, Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAssessmentStore } from "@/stores/assessmentStore";
import { RepetitionConsistencyChart } from "../MovementChart";
import { average, standardDeviation } from "@/lib/movementMetrics";
import { Movement, Side } from "@/lib/types";

const SIDE_LABEL: Record<Side, string> = { right: "Direita", left: "Esquerda" };
const MOVEMENT_LABEL: Record<Movement, string> = { flexion: "Flexão", abduction: "Abdução" };

export function TechnicalReportScreen() {
  const result = useAssessmentStore((s) => s.result);
  const setScreen = useAssessmentStore((s) => s.setScreen);

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
        certificada.
      </p>

      <div className="space-y-4">
        {result.blocks.map((block, idx) => {
          const durations = block.attempts.map((a) => a.duration / 1000);
          const velocities = block.attempts.map((a) => a.averageAngularVelocity);
          const compensations = block.attempts.map((a) => a.maxTrunkCompensation);
          const angleBefore = block.attempts
            .map((a) => a.angleBeforeCompensation)
            .filter((v): v is number => v !== null);

          return (
            <Card key={idx}>
              <h3 className="text-sm font-bold text-moveo-ink">
                {MOVEMENT_LABEL[block.movement]} {SIDE_LABEL[block.side]}
              </h3>
              <div className="mt-3 space-y-1 text-sm text-moveo-ink">
                {block.attempts.map((a) => (
                  <div key={a.repetitionIndex} className="flex justify-between">
                    <span className="text-moveo-muted">Rep {a.repetitionIndex}:</span>
                    <span className="font-medium">{Math.round(a.maxAngle)}°</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-moveo-border pt-1">
                  <span className="text-moveo-muted">Média:</span>
                  <span className="font-medium">{Math.round(block.averageMaxAngle)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Maior:</span>
                  <span className="font-medium">{Math.round(block.bestMaxAngle)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Tempo médio de elevação:</span>
                  <span className="font-medium">{average(durations).toFixed(1)}s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Velocidade angular média:</span>
                  <span className="font-medium">{Math.round(average(velocities))}°/s</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Inclinação máxima do tronco:</span>
                  <span className="font-medium">{Math.round(Math.max(...compensations))}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Amplitude antes de compensação:</span>
                  <span className="font-medium">
                    {angleBefore.length ? `${Math.round(average(angleBefore))}°` : "não detectada"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Desvio padrão entre reps:</span>
                  <span className="font-medium">{standardDeviation(block.attempts.map((a) => a.maxAngle)).toFixed(1)}°</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-moveo-muted">Dor informada:</span>
                  <span className="font-medium">
                    {block.pain.hadPain ? `${block.pain.intensity}/10` : "0/10"}
                  </span>
                </div>
              </div>
              <div className="mt-3">
                <RepetitionConsistencyChart block={block} />
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
