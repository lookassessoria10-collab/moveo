import { MovementFrame } from "./types";
import { APP_CONFIG } from "@/config/app";

export type CompensationLabel = "mínima" | "moderada" | "elevada";

/**
 * Classifica a compensação do tronco a partir da variação máxima (em graus)
 * observada em relação à posição neutra. Limites definidos em
 * config/app.ts — são experimentais, não critérios médicos.
 */
export function classifyTrunkCompensation(maxCompensationDeg: number): CompensationLabel {
  const { minimalMaxDeg, moderateMaxDeg } = APP_CONFIG.thresholds.trunkCompensation;
  const abs = Math.abs(maxCompensationDeg);
  if (abs <= minimalMaxDeg) return "mínima";
  if (abs <= moderateMaxDeg) return "moderada";
  return "elevada";
}

/** Maior desvio absoluto do tronco em relação ao ângulo neutro, entre os frames de uma tentativa. */
export function calculateMaxTrunkCompensation(
  frames: MovementFrame[],
  neutralTrunkAngle: number
): number {
  let max = 0;
  for (const frame of frames) {
    const deviation = Math.abs(frame.trunkAngle - neutralTrunkAngle);
    if (deviation > max) max = deviation;
  }
  return max;
}

/**
 * Estima o ângulo do braço no momento em que a compensação do tronco passa
 * a ser relevante (ultrapassa o limite "mínimo"). Retorna null quando o
 * limite nunca é ultrapassado durante a tentativa — nesse caso, não há
 * compensação relevante detectada e a amplitude total já é confiável.
 */
export function calculateAngleBeforeCompensation(
  frames: MovementFrame[],
  neutralTrunkAngle: number
): number | null {
  const { minimalMaxDeg } = APP_CONFIG.thresholds.trunkCompensation;
  for (const frame of frames) {
    const deviation = Math.abs(frame.trunkAngle - neutralTrunkAngle);
    if (deviation > minimalMaxDeg) {
      return frame.armAngle;
    }
  }
  return null;
}
