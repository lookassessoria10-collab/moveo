import { Point2D } from "@/lib/types";
import { angleBetweenPoints } from "@/lib/geometry";

/**
 * Ângulo bruto do joelho: vértice no joelho, entre quadril e tornozelo.
 * Convenção adotada: ~170-180° representa a perna estendida; o valor cai
 * conforme o joelho dobra (agachamento, sentar, flexão). Documentado aqui
 * porque a interface converte esse valor para "graus de flexão" (0 =
 * estendido) somando o complemento, o que é mais intuitivo para quem não
 * tem formação clínica.
 */
export function calculateKneeAngle(hip: Point2D, knee: Point2D, ankle: Point2D): number {
  return angleBetweenPoints(hip, knee, ankle);
}

/**
 * Converte o ângulo bruto do joelho (quadril-joelho-tornozelo) em "graus de
 * flexão", onde 0° = perna estendida e valores crescentes = joelho mais
 * dobrado. É apenas uma transformação de apresentação (180 - ânguloBruto),
 * não uma medição clínica adicional.
 */
export function kneeFlexionFromRawAngle(rawAngle: number): number {
  return Math.max(0, 180 - rawAngle);
}
