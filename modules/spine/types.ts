// Tipos do módulo de avaliação funcional da coluna (tronco).
// Segue o mesmo padrão do módulo de ombro e joelho.

import { PainDuringMovement, Point2D } from "@/lib/types";

export type SpineTest = "flexion" | "lateralRight" | "lateralLeft" | "extension";

export interface SpineMovementFrame {
  timestamp: number;
  shoulderMid: Point2D;
  hipMid: Point2D;
  trunkAngle: number; // ângulo assinado tronco x vertical (graus) — ver lib/angles.ts
}

export interface SpineAttempt {
  test: SpineTest;
  repetitionIndex: number;
  frames: SpineMovementFrame[];
  maxAngle: number;
  startTimestamp: number;
  peakTimestamp: number;
  endTimestamp: number;
  duration: number;
  averageAngularVelocity: number;
  hipCompensation: number; // deslocamento lateral do quadril em relação ao neutro (graus-equivalente)
}

export interface SpineTestResult {
  test: SpineTest;
  attempts: SpineAttempt[];
  averageMaxAngle: number;
  bestMaxAngle: number;
  consistency: {
    stdDev: number;
    relativeStdDevPct: number;
    label: "alta" | "moderada" | "baixa";
    declined: boolean;
  };
  pain: PainDuringMovement;
}

export interface SpineSafetyAnswers {
  recentTrauma: boolean;
  severePain: boolean;
  suddenWeaknessLoss: boolean;
  difficultyStanding: boolean;
}

export interface SpineIntakeInfo {
  painArea: "neck" | "upperBack" | "lowerBack" | "multiple" | "no_pain";
  initialPain: number;
  problemDuration: "today" | "days" | "weeks" | "months" | "over_6_months" | "no_pain";
}

export interface SpineCalibrationBaseline {
  neutralTrunkAngle: number;
  neutralHipMidX: number;
  capturedAt: number;
}

export interface StaticPosture {
  shoulderTiltDeg: number; // positivo = ombro direito mais alto
  hipTiltDeg: number;
  headTiltDeg: number;
}

export interface SpineAssessmentResult {
  completedAt: number;
  intake: SpineIntakeInfo;
  results: SpineTestResult[]; // flexion, lateralRight, lateralLeft, extension
  lateralDifference: number | null; // |lateralRight - lateralLeft|
  staticPosture: StaticPosture | null;
  summary: string[];
  isDemo: boolean;
}
