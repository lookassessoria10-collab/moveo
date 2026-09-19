// Tipos do módulo de avaliação funcional do joelho.
// Segue o mesmo padrão comprovado do módulo de ombro (lib/types.ts), mas
// isolado aqui para não acoplar o núcleo compartilhado a um único módulo.

import { PainDuringMovement, Point2D } from "@/lib/types";

export type Side = "right" | "left";
export type KneeTest = "flexion" | "squat" | "sitToStand";

export interface KneeMovementFrame {
  timestamp: number;
  hip: Point2D;
  knee: Point2D;
  ankle: Point2D;
  trunkAngle: number; // inclinação do tronco em relação à vertical (graus)
  kneeAngle: number; // ângulo bruto quadril-joelho-tornozelo (graus)
  // Campos extras usados apenas em agachamento / sentar-levantar:
  otherKneeAngle?: number; // ângulo do joelho oposto, para simetria
  hipLateralShift?: number; // deslocamento horizontal do quadril em relação ao neutro
  handsNearHip?: boolean; // indício de apoio das mãos (sentar e levantar)
}

export interface KneeAttempt {
  test: KneeTest;
  side: Side | "both";
  repetitionIndex: number;
  frames: KneeMovementFrame[];
  maxAngle: number;
  startTimestamp: number;
  peakTimestamp: number;
  endTimestamp: number;
  duration: number; // ms, início -> pico
  averageAngularVelocity: number; // graus / segundo
  maxTrunkCompensation: number; // graus, variação em relação à posição neutra
  handsUsed?: boolean; // apenas sentar-e-levantar
}

export interface KneeTestResult {
  test: KneeTest;
  side: Side | "both";
  attempts: KneeAttempt[];
  averageMaxAngle: number;
  bestMaxAngle: number;
  consistency: {
    stdDev: number;
    relativeStdDevPct: number;
    label: "alta" | "moderada" | "baixa";
    declined: boolean;
  };
  pain: PainDuringMovement;
  // Extras específicos do agachamento (ver modules/knee/angles.ts)
  kneeAsymmetryDeg?: number; // diferença média entre joelho direito e esquerdo
  maxHipLateralShift?: number;
}

export interface KneeSafetyAnswers {
  recentTrauma: boolean;
  severePain: boolean;
  cannotBearWeight: boolean;
  visibleDeformity: boolean;
  suddenMovementLoss: boolean;
}

export interface KneeIntakeInfo {
  symptomSide: Side | "both" | "testing";
  initialPain: number;
  problemDuration: "today" | "days" | "weeks" | "months" | "over_6_months" | "no_pain";
}

export interface KneeCalibrationBaseline {
  neutralTrunkAngle: number;
  neutralKneeAngleRight: number;
  neutralKneeAngleLeft: number;
  neutralHipMidX: number; // usado para medir deslocamento lateral do quadril no agachamento
  capturedAt: number;
}

export interface SideComparisonMetric {
  right: number | null;
  left: number | null;
  absoluteDifference: number | null;
  percentageDifference: number | null;
}

export interface KneeAssessmentResult {
  completedAt: number;
  intake: KneeIntakeInfo;
  flexionResults: KneeTestResult[]; // um por lado
  squatResult: KneeTestResult | null;
  sitToStandResult: KneeTestResult | null;
  flexionComparison: SideComparisonMetric;
  summary: string[];
  isDemo: boolean;
}
