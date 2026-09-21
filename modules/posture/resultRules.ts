import { POSTURE_CONFIG } from "@/config/modules/posture";
import { PostureReading } from "./types";

function trunkSentence(deg: number): string {
  const { notableDeg, markedDeg } = POSTURE_CONFIG.thresholds.trunkTilt;
  if (deg >= markedDeg) {
    return "Foi observada uma inclinação mais acentuada do tronco em relação à vertical durante a captura.";
  }
  if (deg >= notableDeg) {
    return "Foi observada uma leve inclinação do tronco em relação à vertical durante a captura.";
  }
  return "O tronco foi observado próximo da posição vertical durante a captura.";
}

function neckSentence(deg: number): string {
  const { notableDeg, markedDeg } = POSTURE_CONFIG.thresholds.neckTilt;
  if (deg >= markedDeg) {
    return "Foi observado um deslocamento mais acentuado da cabeça à frente dos ombros — postura comumente associada ao uso prolongado de telas.";
  }
  if (deg >= notableDeg) {
    return "Foi observado um leve deslocamento da cabeça à frente dos ombros.";
  }
  return "A cabeça foi observada alinhada sobre os ombros.";
}

/**
 * Gera um resumo textual determinístico (baseado em regras, sem IA
 * generativa) descrevendo apenas a postura sentada observada durante a
 * captura — nunca um diagnóstico postural ou ergonômico.
 */
export function generatePostureSummary(reading: PostureReading): string[] {
  const sentences: string[] = [];
  const { instabilityDeg } = POSTURE_CONFIG.thresholds;

  sentences.push(trunkSentence(reading.trunkTiltDeg));
  sentences.push(neckSentence(reading.neckTiltDeg));

  if (reading.trunkTiltStdDev > instabilityDeg || reading.neckTiltStdDev > instabilityDeg) {
    sentences.push(
      "Houve variação de posição durante a captura; para um retrato mais preciso, tente permanecer parado(a) na próxima tentativa."
    );
  }

  sentences.push(
    "Estes dados descrevem apenas a postura observada neste instante e não substituem uma avaliação ergonômica presencial."
  );

  return sentences;
}
