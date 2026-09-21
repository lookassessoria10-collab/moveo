// Tipos do módulo de observação de postura sentada.
// Diferente dos módulos de ombro/joelho/coluna, não há repetições de
// movimento: é uma captura única (a pessoa permanece parada, na posição em
// que costuma trabalhar) seguida de um resumo descritivo.

export type Side = "right" | "left";

export interface PostureSample {
  timestamp: number;
  trunkTiltDeg: number; // quadril->ombro em relação à vertical (0 = tronco ereto)
  neckTiltDeg: number; // ombro->orelha em relação à vertical (0 = cabeça alinhada sobre o ombro)
}

export interface PostureReading {
  trunkTiltDeg: number;
  neckTiltDeg: number;
  trunkTiltStdDev: number;
  neckTiltStdDev: number;
  capturedAt: number;
}

export interface PostureAssessmentResult {
  completedAt: number;
  reading: PostureReading;
  summary: string[];
  tips: readonly string[];
  isDemo: boolean;
}
