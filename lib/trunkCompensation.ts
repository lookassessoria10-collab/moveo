import { APP_CONFIG } from "@/config/app";

export type CompensationLabel = "mínima" | "moderada" | "elevada";

export interface CompensationThresholds {
  minimalMaxDeg: number;
  moderateMaxDeg: number;
}

const SHOULDER_DEFAULT_THRESHOLDS = APP_CONFIG.thresholds.trunkCompensation;

/**
 * Classifica a compensação do tronco a partir da variação máxima (em graus)
 * observada em relação à posição neutra. São limites experimentais, não
 * critérios médicos. O padrão (quando `thresholds` é omitido) é o do
 * módulo Ombro, para não alterar nenhum comportamento existente; os
 * módulos de joelho e coluna passam seus próprios limites explicitamente
 * (ver config/modules/knee.ts e config/modules/spine.ts).
 */
export function classifyTrunkCompensation(
  maxCompensationDeg: number,
  thresholds: CompensationThresholds = SHOULDER_DEFAULT_THRESHOLDS
): CompensationLabel {
  const { minimalMaxDeg, moderateMaxDeg } = thresholds;
  const abs = Math.abs(maxCompensationDeg);
  if (abs <= minimalMaxDeg) return "mínima";
  if (abs <= moderateMaxDeg) return "moderada";
  return "elevada";
}

/**
 * Maior desvio absoluto do tronco em relação ao ângulo neutro, entre os
 * frames de uma tentativa. Genérico sobre qualquer tipo de frame que tenha
 * um campo `trunkAngle` — usado tanto pelo ombro quanto pelo joelho e
 * pela coluna.
 */
export function calculateMaxTrunkCompensation<T extends { trunkAngle: number }>(
  frames: T[],
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
 * Estima o valor do ângulo principal do movimento (braço, joelho, tronco...)
 * no momento em que a compensação do tronco passa a ser relevante
 * (ultrapassa o limite "mínimo"). Retorna null quando o limite nunca é
 * ultrapassado durante a tentativa — nesse caso, não há compensação
 * relevante detectada e a amplitude total já é confiável.
 *
 * `getPrimaryAngle` e `thresholds` têm valores padrão compatíveis com o
 * comportamento original do módulo Ombro (campo `armAngle`), para que o
 * código existente continue funcionando sem alterações.
 */
export function calculateAngleBeforeCompensation<T extends { trunkAngle: number }>(
  frames: T[],
  neutralTrunkAngle: number,
  getPrimaryAngle: (frame: T) => number = (f: any) => f.armAngle,
  thresholds: CompensationThresholds = SHOULDER_DEFAULT_THRESHOLDS
): number | null {
  for (const frame of frames) {
    const deviation = Math.abs(frame.trunkAngle - neutralTrunkAngle);
    if (deviation > thresholds.minimalMaxDeg) {
      return getPrimaryAngle(frame);
    }
  }
  return null;
}
