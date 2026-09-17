"use client";

import { ScreenShell, Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAssessmentStore } from "@/stores/assessmentStore";
import { APP_CONFIG } from "@/config/app";
import { classifyTrunkCompensation } from "@/lib/trunkCompensation";
import { IntakeInfo, Movement, Side } from "@/lib/types";

const SIDE_LABEL: Record<Side, string> = { right: "Direito", left: "Esquerdo" };
const MOVEMENT_LABEL: Record<Movement, string> = { flexion: "Flexão", abduction: "Abdução" };
const SYMPTOM_SIDE_LABEL: Record<IntakeInfo["symptomSide"], string> = {
  right: "Direito",
  left: "Esquerdo",
  both: "Ambos",
  testing: "Apenas testando",
};
const DURATION_LABEL: Record<IntakeInfo["problemDuration"], string> = {
  today: "Hoje",
  days: "Alguns dias",
  weeks: "Algumas semanas",
  months: "Alguns meses",
  over_6_months: "Mais de 6 meses",
  no_pain: "Sem dor relatada",
};

export function DoctorReportScreen() {
  const result = useAssessmentStore((s) => s.result);
  const setScreen = useAssessmentStore((s) => s.setScreen);

  if (!result) return null;
  const { intake, blocks, comparison, summary, completedAt, isDemo } = result;

  return (
    <ScreenShell>
      <div className="no-print mb-4 flex items-center justify-between">
        <button className="text-sm text-moveo-primary" onClick={() => setScreen("results")}>
          Voltar
        </button>
        <button className="text-sm font-semibold text-moveo-primary" onClick={() => window.print()}>
          Imprimir / Salvar PDF
        </button>
      </div>

      <Card>
        <div className="mb-4 flex items-center justify-between">
          <span className="text-lg font-bold text-moveo-ink">{APP_CONFIG.name}</span>
          <span className="text-xs text-moveo-muted">
            {new Date(completedAt).toLocaleString("pt-BR")}
          </span>
        </div>
        {isDemo && (
          <p className="mb-3 rounded bg-moveo-warn/15 px-3 py-1 text-xs font-semibold text-moveo-warn">
            Modo demonstração — dados fictícios
          </p>
        )}

        <h2 className="mb-2 text-sm font-bold uppercase text-moveo-muted">Contexto</h2>
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-moveo-muted">Lado sintomático: </span>
            {SYMPTOM_SIDE_LABEL[intake.symptomSide]}
          </div>
          <div>
            <span className="text-moveo-muted">Dor inicial: </span>
            {intake.initialPain}/10
          </div>
          <div className="col-span-2">
            <span className="text-moveo-muted">Tempo do problema: </span>
            {DURATION_LABEL[intake.problemDuration]}
          </div>
        </div>

        <h2 className="mb-2 text-sm font-bold uppercase text-moveo-muted">Medidas observadas</h2>
        <table className="mb-4 w-full text-sm">
          <thead>
            <tr className="border-b border-moveo-border text-left text-moveo-muted">
              <th className="py-1">Movimento</th>
              <th>Lado</th>
              <th>Média</th>
              <th>Compensação</th>
              <th>Dor</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map((b, i) => {
              const maxComp = Math.max(0, ...b.attempts.map((a) => a.maxTrunkCompensation));
              return (
                <tr key={i} className="border-b border-moveo-border/60">
                  <td className="py-1">{MOVEMENT_LABEL[b.movement]}</td>
                  <td>{SIDE_LABEL[b.side]}</td>
                  <td>{Math.round(b.averageMaxAngle)}°</td>
                  <td className="capitalize">{classifyTrunkCompensation(maxComp)}</td>
                  <td>{b.pain.hadPain ? `${b.pain.intensity}/10` : "0/10"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <h2 className="mb-2 text-sm font-bold uppercase text-moveo-muted">
          Comparação entre os lados
        </h2>
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="text-moveo-muted">Diferença de flexão: </span>
            {comparison.flexionMaxAngle.absoluteDifference !== null
              ? `${Math.round(comparison.flexionMaxAngle.absoluteDifference)}°`
              : "—"}
          </div>
          <div>
            <span className="text-moveo-muted">Diferença de abdução: </span>
            {comparison.abductionMaxAngle.absoluteDifference !== null
              ? `${Math.round(comparison.abductionMaxAngle.absoluteDifference)}°`
              : "—"}
          </div>
        </div>

        <h2 className="mb-2 text-sm font-bold uppercase text-moveo-muted">
          Observações automáticas
        </h2>
        <ul className="mb-4 list-disc space-y-1 pl-5 text-sm">
          {summary.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>

        <h2 className="mb-2 text-sm font-bold uppercase text-moveo-muted">Limitações</h2>
        <p className="text-xs leading-relaxed text-moveo-muted">{APP_CONFIG.copy.disclaimerFinal}</p>
      </Card>

      <div className="no-print mt-6">
        <Button variant="secondary" onClick={() => setScreen("results")}>
          VOLTAR
        </Button>
      </div>
    </ScreenShell>
  );
}
