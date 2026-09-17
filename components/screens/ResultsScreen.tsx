"use client";

import { ScreenShell, Card } from "../ui/Card";
import { Button } from "../ui/Button";
import { useAssessmentStore } from "@/stores/assessmentStore";
import { BodyMap } from "../BodyMap";
import { SideComparisonChart } from "../MovementChart";
import { classifyTrunkCompensation } from "@/lib/trunkCompensation";
import { APP_CONFIG } from "@/config/app";
import { Movement, MovementBlockResult, Side } from "@/lib/types";

const SIDE_LABEL: Record<Side, string> = { right: "Direito", left: "Esquerdo" };

function ShoulderCard({ side, blocks }: { side: Side; blocks: MovementBlockResult[] }) {
  const accent = side === "right" ? "text-moveo-right" : "text-moveo-left";
  const flexion = blocks.find((b) => b.side === side && b.movement === "flexion");
  const abduction = blocks.find((b) => b.side === side && b.movement === "abduction");
  const maxComp = Math.max(
    0,
    ...[...(flexion?.attempts ?? []), ...(abduction?.attempts ?? [])].map((a) => a.maxTrunkCompensation)
  );
  const painValues = [flexion?.pain, abduction?.pain].filter((p) => p?.hadPain);
  const worstPain = painValues.length
    ? Math.max(...painValues.map((p) => p?.intensity ?? 0))
    : null;

  return (
    <Card>
      <h3 className={`text-sm font-bold uppercase tracking-wide ${accent}`}>
        Ombro {SIDE_LABEL[side]}
      </h3>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-moveo-muted">Flexão máxima</p>
          <p className="text-2xl font-bold text-moveo-ink">
            {flexion ? `${Math.round(flexion.averageMaxAngle)}°` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-moveo-muted">Abdução</p>
          <p className="text-2xl font-bold text-moveo-ink">
            {abduction ? `${Math.round(abduction.averageMaxAngle)}°` : "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-moveo-muted">Dor relatada</p>
          <p className="text-2xl font-bold text-moveo-ink">
            {worstPain !== null ? `${worstPain}/10` : "0/10"}
          </p>
        </div>
        <div>
          <p className="text-xs text-moveo-muted">Compensação</p>
          <p className="text-2xl font-bold capitalize text-moveo-ink">
            {classifyTrunkCompensation(maxComp)}
          </p>
        </div>
      </div>
    </Card>
  );
}

export function ResultsScreen() {
  const result = useAssessmentStore((s) => s.result);
  const setScreen = useAssessmentStore((s) => s.setScreen);
  const reset = useAssessmentStore((s) => s.reset);

  if (!result) return null;
  const { blocks, comparison, movementIndex, summary, isDemo } = result;

  const movementLabel: Record<Movement, string> = { flexion: "Flexão", abduction: "Abdução" };

  return (
    <ScreenShell>
      {isDemo && (
        <div className="mb-4 rounded-xl bg-moveo-warn/15 px-4 py-2 text-center text-xs font-semibold text-moveo-warn">
          Modo demonstração — resultados fictícios
        </div>
      )}

      <h1 className="text-center text-2xl font-bold tracking-tight text-moveo-ink">
        SEU TESTE FUNCIONAL
      </h1>

      <div className="mt-6 flex justify-center">
        <BodyMap blocks={blocks} />
      </div>

      <div className="mt-6 space-y-4">
        <ShoulderCard side="right" blocks={blocks} />
        <ShoulderCard side="left" blocks={blocks} />
      </div>

      <Card className="mt-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-moveo-ink">
          Diferença entre os lados
        </h3>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {(["flexionMaxAngle", "abductionMaxAngle"] as const).map((key) => {
            const metric = comparison[key];
            return (
              <div key={key}>
                <p className="text-xs text-moveo-muted">
                  {key === "flexionMaxAngle" ? "Flexão" : "Abdução"}
                </p>
                <p className="text-2xl font-bold text-moveo-ink">
                  {metric.absoluteDifference !== null ? `${Math.round(metric.absoluteDifference)}°` : "—"}
                </p>
              </div>
            );
          })}
        </div>
        <div className="mt-4">
          <SideComparisonChart blocks={blocks} />
        </div>
      </Card>

      <Card className="mt-4">
        <h3 className="text-sm font-bold uppercase tracking-wide text-moveo-ink">Resumo</h3>
        <ul className="mt-3 space-y-2">
          {summary.map((line, i) => (
            <li key={i} className="text-sm leading-relaxed text-moveo-ink">
              {line}
            </li>
          ))}
        </ul>
      </Card>

      {movementIndex !== null && (
        <Card className="mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wide text-moveo-ink">
                Índice de movimento
              </h3>
              <p className="mt-1 max-w-[220px] text-xs text-moveo-muted">
                Experimental. Serve apenas para comparar seus próprios testes ao longo do tempo —
                não é um score clínico, de gravidade ou de saúde.
              </p>
            </div>
            <span className="text-4xl font-bold text-moveo-primary">{movementIndex}</span>
          </div>
        </Card>
      )}

      <div className="mt-6 space-y-3">
        <Button variant="secondary" onClick={() => setScreen("technicalReport")}>
          VER DADOS DETALHADOS
        </Button>
        <Button variant="secondary" onClick={() => setScreen("doctorReport")}>
          GERAR RESUMO
        </Button>
        <Button variant="ghost" onClick={reset}>
          REFAZER TESTE
        </Button>
      </div>

      {APP_CONFIG.cta.enabled && (
        <Card className="mt-6 text-center">
          <p className="text-sm font-semibold text-moveo-ink">{APP_CONFIG.cta.title}</p>
          <Button className="mt-3" onClick={() => {}}>
            {APP_CONFIG.cta.buttonLabel}
          </Button>
        </Card>
      )}

      <p className="mt-6 text-center text-xs leading-relaxed text-moveo-muted">
        {APP_CONFIG.copy.disclaimerFinal}
      </p>
    </ScreenShell>
  );
}
