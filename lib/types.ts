// Tipos centrais do domínio de avaliação de movimento.
// Mantidos separados de qualquer componente visual.

export type Side = "right" | "left";
export type Movement = "flexion" | "abduction";

export interface Point2D {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

export interface FrameLandmarks {
  nose: Point2D;
  leftShoulder: Point2D;
  rightShoulder: Point2D;
  leftElbow: Point2D;
  rightElbow: Point2D;
  leftWrist: Point2D;
  rightWrist: Point2D;
  leftHip: Point2D;
  rightHip: Point2D;
}

export interface MovementFrame {
  timestamp: number;
  shoulder: Point2D;
  elbow: Point2D;
  wrist: Point2D;
  hip: Point2D;
  trunkAngle: number; // inclinação do tronco em relação à vertical (graus)
  armAngle: number; // ângulo do braço estimado para o movimento em questão (graus)
}

export type MovementPhase =
  | "IDLE"
  | "READY"
  | "ASCENDING"
  | "PEAK"
  | "DESCENDING"
  | "COMPLETED";

export interface PainDuringMovement {
  hadPain: boolean;
  intensity?: number; // 0-10
  moment?: "start" | "middle" | "near_limit" | "throughout" | "unknown";
}

export interface MovementAttempt {
  side: Side;
  movement: Movement;
  repetitionIndex: number; // 1-based
  frames: MovementFrame[];
  maxAngle: number;
  startTimestamp: number;
  peakTimestamp: number;
  endTimestamp: number;
  duration: number; // ms, início -> pico
  averageAngularVelocity: number; // graus / segundo
  maxTrunkCompensation: number; // graus, variação em relação à posição neutra
  angleBeforeCompensation: number | null; // graus, estimativa
}

export interface MovementBlockResult {
  side: Side;
  movement: Movement;
  attempts: MovementAttempt[];
  averageMaxAngle: number;
  bestMaxAngle: number;
  consistency: {
    stdDev: number;
    relativeStdDevPct: number;
    label: "alta" | "moderada" | "baixa";
    declined: boolean; // reduziu progressivamente entre repetições
  };
  pain: PainDuringMovement;
}

export interface CalibrationBaseline {
  shoulderWidthPx: number;
  hipMidpoint: Point2D;
  shoulderMidpoint: Point2D;
  neutralTrunkAngle: number;
  neutralArmAngleRight: number;
  neutralArmAngleLeft: number;
  capturedAt: number;
}

export interface SafetyAnswers {
  recentTrauma: boolean;
  severePain: boolean;
  suddenWeakness: boolean;
  cannotMoveArm: boolean;
}

export interface IntakeInfo {
  symptomSide: Side | "both" | "testing";
  initialPain: number; // 0-10
  problemDuration:
    | "today"
    | "days"
    | "weeks"
    | "months"
    | "over_6_months"
    | "no_pain";
}

export interface SideComparisonMetric {
  right: number | null;
  left: number | null;
  absoluteDifference: number | null;
  percentageDifference: number | null;
}

export interface AssessmentComparison {
  flexionMaxAngle: SideComparisonMetric;
  abductionMaxAngle: SideComparisonMetric;
  angleBeforeCompensationFlexion: SideComparisonMetric;
  angleBeforeCompensationAbduction: SideComparisonMetric;
}

export interface AssessmentResult {
  completedAt: number;
  intake: IntakeInfo;
  blocks: MovementBlockResult[]; // até 4 blocos: flex/abd x right/left
  comparison: AssessmentComparison;
  movementIndex: number | null; // 0-100, experimental
  summary: string[]; // frases geradas por regras
  isDemo: boolean;
}
