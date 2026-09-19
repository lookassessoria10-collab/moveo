/**
 * Configuração experimental do módulo de avaliação funcional do joelho.
 * Independente da configuração do ombro (config/app.ts) — nenhum valor
 * aqui é compartilhado com o módulo de ombro.
 *
 * Todos os limites abaixo (thresholds) são experimentais e ainda não
 * validados clinicamente. Necessitam validação clínica antes de qualquer
 * uso como critério diagnóstico — servem apenas para categorizar
 * visualmente o movimento observado.
 */
export const KNEE_CONFIG = {
  protocol: {
    repetitionsPerMovement: 3,
    calibrationDurationMs: 2000,
    countdownSeconds: 3,
  },
  thresholds: {
    trunkCompensation: {
      minimalMaxDeg: 6,
      moderateMaxDeg: 14,
    },
    consistency: {
      highMaxPct: 8,
      moderateMaxPct: 18,
    },
    sideDifference: {
      notablePct: 15,
    },
    movementDetection: {
      startDeltaDeg: 8,
      startFrames: 4,
      peakStableFrames: 6,
      peakStableToleranceDeg: 3,
      returnToNeutralDeg: 15,
    },
    landmarkVisibilityMin: 0.5,
    // Deslocamento lateral do quadril (relativo à largura do quadril)
    // considerado relevante no agachamento — puramente descritivo.
    hipShiftNotableRatio: 0.15,
  },
  copy: {
    disclaimerFinal:
      "Este teste utiliza estimativa de movimento por câmera e pode sofrer influência do posicionamento, iluminação, roupa e qualidade da câmera. Os resultados descrevem o movimento observado durante esta avaliação e não identificam lesões ou condições do joelho. Se você apresenta dor, perda de força, instabilidade importante, trauma recente ou outros sintomas, procure avaliação profissional.",
  },
} as const;

export type KneeConfig = typeof KNEE_CONFIG;
