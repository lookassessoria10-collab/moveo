import { MovementAttempt, MovementBlockResult, SideComparisonMetric } from "./types";
import { APP_CONFIG } from "@/config/app";

/** Duração entre início e pico do movimento, em milissegundos. */
export function calculateMovementDuration(startTimestamp: number, peakTimestamp: number): number {
  return Math.max(0, peakTimestamp - startTimestamp);
}

/** Velocidade angular média aproximada, em graus por segundo. */
export function calculateAngularVelocity(
  angleDifferenceDeg: number,
  durationMs: number
): number {
  if (durationMs <= 0) return 0;
  return angleDifferenceDeg / (durationMs / 1000);
}

export function average(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function standardDeviation(values: number[]): number {
  if (values.length < 2) return 0;
  const avg = average(values);
  const variance = average(values.map((v) => (v - avg) ** 2));
  return Math.sqrt(variance);
}

export interface ConsistencyResult {
  stdDev: number;
  relativeStdDevPct: number;
  label: "alta" | "moderada" | "baixa";
  declined: boolean;
}

/**
 * Calcula a consistência entre repetições a partir dos ângulos máximos.
 * `declined` sinaliza quando houve redução progressiva (última rep menor
 * que a primeira, com queda relevante) — usado apenas para descrever o
 * movimento observado, nunca para inferir fadiga muscular como diagnóstico.
 */
export function calculateConsistency(maxAngles: number[]): ConsistencyResult {
  const avg = average(maxAngles);
  const stdDev = standardDeviation(maxAngles);
  const relativeStdDevPct = avg > 0 ? (stdDev / avg) * 100 : 0;

  const { highMaxPct, moderateMaxPct } = APP_CONFIG.thresholds.consistency;
  let label: ConsistencyResult["label"] = "baixa";
  if (relativeStdDevPct <= highMaxPct) label = "alta";
  else if (relativeStdDevPct <= moderateMaxPct) label = "moderada";

  const first = maxAngles[0];
  const last = maxAngles[maxAngles.length - 1];
  const declined = maxAngles.length >= 2 && first > 0 && (first - last) / first > 0.1;

  return { stdDev, relativeStdDevPct, label, declined };
}

/** Constrói a comparação lado a lado para uma métrica numérica (right/left podem ser null). */
export function calculateSideDifference(
  right: number | null,
  left: number | null
): SideComparisonMetric {
  if (right === null || left === null) {
    return { right, left, absoluteDifference: null, percentageDifference: null };
  }
  const absoluteDifference = Math.abs(right - left);
  const base = Math.max(right, left);
  const percentageDifference = base > 0 ? (absoluteDifference / base) * 100 : 0;
  return { right, left, absoluteDifference, percentageDifference };
}

/** Resume um conjunto de tentativas (3 repetições) de um lado+movimento em um MovementBlockResult parcial (sem pain, preenchido depois). */
export function summarizeAttempts(
  attempts: MovementAttempt[]
): Omit<MovementBlockResult, "side" | "movement" | "pain"> {
  const maxAngles = attempts.map((a) => a.maxAngle);
  return {
    attempts,
    averageMaxAngle: average(maxAngles),
    bestMaxAngle: Math.max(...maxAngles),
    consistency: calculateConsistency(maxAngles),
  };
}

/**
 * Índice de movimento experimental (0-100). Combina assimetria, amplitude
 * relativa ao melhor lado, consistência e compensação do tronco.
 * NÃO é um score clínico, de gravidade ou de saúde — serve apenas para
 * comparação da própria pessoa ao longo do tempo.
 */
export function calculateMovementIndex(blocks: MovementBlockResult[]): number | null {
  if (blocks.length === 0) return null;

  const byMovement = new Map<string, MovementBlockResult[]>();
  for (const block of blocks) {
    const arr = byMovement.get(block.movement) ?? [];
    arr.push(block);
    byMovement.set(block.movement, arr);
  }

  const subScores: number[] = [];

  for (const group of byMovement.values()) {
    const right = group.find((b) => b.side === "right");
    const left = group.find((b) => b.side === "left");

    // simetria: 100 quando os dois lados são iguais, cai com a diferença %
    if (right && left) {
      const diff = calculateSideDifference(right.averageMaxAngle, left.averageMaxAngle);
      const symmetryScore = Math.max(0, 100 - (diff.percentageDifference ?? 0));
      subScores.push(symmetryScore);
    }

    for (const block of group) {
      // amplitude: 100 quando atinge 180°, escala linear
      const amplitudeScore = Math.max(0, Math.min(100, (block.averageMaxAngle / 180) * 100));
      subScores.push(amplitudeScore);

      // consistência
      const consistencyScore =
        block.consistency.label === "alta" ? 100 : block.consistency.label === "moderada" ? 65 : 35;
      subScores.push(consistencyScore);

      // compensação: usa o pior (maior) valor entre as tentativas
      const maxCompensation = Math.max(...block.attempts.map((a) => a.maxTrunkCompensation));
      const { minimalMaxDeg, moderateMaxDeg } = APP_CONFIG.thresholds.trunkCompensation;
      let compensationScore = 100;
      if (maxCompensation > moderateMaxDeg) compensationScore = 40;
      else if (maxCompensation > minimalMaxDeg) compensationScore = 70;
      subScores.push(compensationScore);
    }
  }

  if (subScores.length === 0) return null;
  return Math.round(average(subScores));
}
