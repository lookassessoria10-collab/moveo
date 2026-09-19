"use client";

import { ScreenShell, Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { average, standardDeviation } from "@/lib/movementMetrics";
import { useKneeStore } from "../../store";
import { KneeTestResult } from "../../types";

const TEST_LABEL = { flexion: "Flexão", squat: "Agachamento", sitToStand: "Sentar e levantar" } as const;
const SIDE_LABEL = { right: "Direita", left: "Esquerda", both: "" } as const;

function TestBlock({ result }: { result: KneeTestResult }) {
  const durations = result.attempts.map((a) => a.duration / 1000);
  const velocities = result.attempts.map((a) => a.averageAngularVelocity);
  const compensations = result.attempts.map((a) => a.maxTrunkCompensation);

  return (
    <Card>
      <h3 className="text-sm font-bold text-moveo-ink">
        {TEST_LABEL[result.test]} {SIDE_LABEL[result.side]}
      </h3>
      <div className="mt-3 space-y-1 text-sm text-moveo-ink">
        {result.attempts.map((a) => (
          <div key={a.repetitionIndex} className="flex justify-between">
            <span className="text-moveo-muted">Rep {a.repetitionIndex}:</span>
            <span className="font-medium">{Math.round(a.maxAngle)}°</span>
          </div>
        ))}
        <div className="flex justify-between border-t border-moveo-border pt-1">
          <span className="text-moveo-muted">Média:</span>
          <span className="font-medium">{Math.round(result.averageMaxAngle)}°</span>
        </div>
        <div className="flex justify-between">
          <span className="text-moveo-muted">Maior:</span>
          <span className="font-medium">{Math.round(result.bestMaxAngle)}°</span>
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
          <span className="text-moveo-muted">Inclinação máxima do tronco:</span>
          <span className="font-medium">{Math.round(Math.max(...compensations))}°</span>
        </div>
        <div className="flex justify-between">
          <span className="text-moveo-muted">Desvio padrão entre reps:</span>
          <span className="font-medium">
            {standardDeviation(result.attempts.map((a) => a.maxAngle)).toFixed(1)}°
          </span>
        </div>
        {result.kneeAsymmetryDeg !== undefined && (
          <div className="flex justify-between">
            <span className="text-moveo-muted">Diferença média entre joelhos:</span>
            <span className="font-medium">{result.kneeAsymmetryDeg.toFixed(1)}°</span>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-moveo-muted">Dor informada:</span>
          <span className="font-medium">{result.pain.hadPain ? `${result.pain.intensity}/10` : "0/10"}</span>
        </div>
      </div>
    </Card>
  );
}

export function TechnicalReportScreen() {
  const result = useKneeStore((s) => s.result);
  const setScreen = useKneeStore((s) => s.setScreen);

  if (!result) return null;
  const blocks = [...result.flexionResults, result.squatResult, result.sitToStandResult].filter(
    (b): b is KneeTestResult => !!b
  );

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
        {blocks.map((b, i) => (
          <TestBlock key={i} result={b} />
        ))}
      </div>
      <Button className="mt-6" onClick={() => setScreen("results")}>
        VOLTAR AO RESULTADO
      </Button>
    </ScreenShell>
  );
}
