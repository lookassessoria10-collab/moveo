import { SPINE_CONFIG } from "@/config/modules/spine";
import { SpineTestResult, StaticPosture } from "./types";

const TEST_LABEL: Record<string, string> = {
  flexion: "flexão anterior",
  lateralRight: "inclinação lateral direita",
  lateralLeft: "inclinação lateral esquerda",
  extension: "extensão",
};

/**
 * Gera um resumo textual determinístico (baseado em regras, sem IA
 * generativa) descrevendo apenas o movimento do tronco observado — nunca
 * um diagnóstico de coluna.
 */
export function generateSpineSummary(
  results: SpineTestResult[],
  lateralDifference: number | null,
  staticPosture: StaticPosture | null
): string[] {
  const sentences: string[] = [];
  const { notablePct } = SPINE_CONFIG.thresholds.sideDifference;

  const right = results.find((r) => r.test === "lateralRight");
  const left = results.find((r) => r.test === "lateralLeft");
  if (right && left && lateralDifference !== null) {
    const base = Math.max(right.averageMaxAngle, left.averageMaxAngle);
    const pct = base > 0 ? (lateralDifference / base) * 100 : 0;
    if (pct >= notablePct) {
      const larger = right.averageMaxAngle > left.averageMaxAngle ? "direita" : "esquerda";
      sentences.push(
        `Durante os movimentos avaliados, observamos maior amplitude de inclinação para a ${larger} em comparação com o outro lado.`
      );
    } else {
      sentences.push(
        "Durante os movimentos avaliados, a amplitude de inclinação lateral foi semelhante entre os dois lados."
      );
    }
  }

  const flexion = results.find((r) => r.test === "flexion");
  if (flexion) {
    sentences.push(
      flexion.consistency.declined
        ? "A flexão anterior apresentou redução de amplitude ao longo das repetições."
        : "A flexão anterior foi realizada de maneira consistente nas três repetições."
    );
  }

  if (staticPosture) {
    const { postureNotableTiltDeg } = SPINE_CONFIG.thresholds;
    if (Math.abs(staticPosture.shoulderTiltDeg) >= postureNotableTiltDeg) {
      sentences.push("Na posição inicial foi observada pequena diferença na linha dos ombros.");
    }
    if (Math.abs(staticPosture.hipTiltDeg) >= postureNotableTiltDeg) {
      sentences.push("Na posição inicial também foi observada pequena diferença na linha do quadril.");
    }
  }

  const painEntries = results
    .filter((r) => r.pain.hadPain)
    .map((r) => ({ test: r.test, intensity: r.pain.intensity ?? 0 }));
  if (painEntries.length > 0) {
    const worst = [...painEntries].sort((a, b) => b.intensity - a.intensity)[0];
    sentences.push(`Você relatou dor ${worst.intensity}/10 durante o movimento de ${TEST_LABEL[worst.test]}.`);
  }

  sentences.push("Estes dados descrevem apenas os movimentos registrados pela câmera durante este teste.");

  return sentences;
}
