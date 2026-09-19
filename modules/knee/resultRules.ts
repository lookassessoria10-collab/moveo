import { KNEE_CONFIG } from "@/config/modules/knee";
import { calculateSideDifference } from "@/lib/movementMetrics";
import { KneeTestResult, SideComparisonMetric } from "./types";

const SIDE_LABEL = { right: "direito", left: "esquerdo" } as const;

/**
 * Gera um resumo textual determinístico (baseado em regras, sem IA
 * generativa) descrevendo apenas o que foi observado nos testes de joelho
 * — nunca um diagnóstico.
 */
export function generateKneeSummary(
  flexionResults: KneeTestResult[],
  flexionComparison: SideComparisonMetric,
  squatResult: KneeTestResult | null,
  sitToStandResult: KneeTestResult | null
): string[] {
  const sentences: string[] = [];
  const { notablePct } = KNEE_CONFIG.thresholds.sideDifference;

  if (
    flexionComparison.right !== null &&
    flexionComparison.left !== null &&
    flexionComparison.percentageDifference !== null &&
    flexionComparison.percentageDifference >= notablePct
  ) {
    const weaker = flexionComparison.right < flexionComparison.left ? "right" : "left";
    sentences.push(
      `Durante os testes, observamos menor amplitude do joelho ${SIDE_LABEL[weaker]} em comparação com o ${
        SIDE_LABEL[weaker === "right" ? "left" : "right"]
      }.`
    );
  } else if (flexionComparison.right !== null && flexionComparison.left !== null) {
    sentences.push(
      "Durante os testes, a amplitude de flexão do joelho foi semelhante entre os dois lados."
    );
  }

  if (squatResult) {
    const diff = squatResult.kneeAsymmetryDeg ?? 0;
    if (diff >= 8) {
      sentences.push(
        "No agachamento também foi observada diferença relevante entre os joelhos direito e esquerdo."
      );
    }
    if ((squatResult.maxHipLateralShift ?? 0) > 0) {
      sentences.push("Foi observado deslocamento lateral do quadril durante o agachamento.");
    }
    if (squatResult.consistency.declined) {
      sentences.push("A profundidade do agachamento reduziu ao longo das repetições.");
    }
  }

  if (sitToStandResult) {
    if (sitToStandResult.attempts.some((a) => a.handsUsed)) {
      sentences.push("Foi detectado uso de apoio das mãos durante o teste de sentar e levantar.");
    }
  }

  const painEntries = [...flexionResults, squatResult, sitToStandResult]
    .filter((r): r is KneeTestResult => !!r && r.pain.hadPain)
    .map((r) => ({ side: r.side, intensity: r.pain.intensity ?? 0, test: r.test }));
  if (painEntries.length > 0) {
    const worst = [...painEntries].sort((a, b) => b.intensity - a.intensity)[0];
    const testLabel =
      worst.test === "flexion" ? "flexão do joelho" : worst.test === "squat" ? "agachamento" : "sentar e levantar";
    sentences.push(`Você relatou dor ${worst.intensity}/10 durante o teste de ${testLabel}.`);
  }

  sentences.push("Estes dados descrevem apenas o movimento observado durante esta avaliação.");

  return sentences;
}
