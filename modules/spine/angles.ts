import { Point2D } from "@/lib/types";

/**
 * Ângulo de uma linha entre dois pontos em relação à horizontal, em graus.
 * Usado para descrever a postura estática (linha dos ombros, do quadril,
 * inclinação da cabeça) — nunca como diagnóstico, apenas como observação
 * descritiva de um instante (ver seção "Postura observada" no resultado).
 */
export function tiltFromHorizontal(a: Point2D, b: Point2D): number {
  return (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
}
