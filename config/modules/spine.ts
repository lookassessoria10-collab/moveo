/**
 * Configuração experimental do módulo de avaliação funcional da coluna.
 * Independente da configuração do ombro e do joelho.
 *
 * Todos os limites abaixo (thresholds) são experimentais e ainda não
 * validados clinicamente. Necessitam validação clínica antes de qualquer
 * uso como critério diagnóstico.
 */
export const SPINE_CONFIG = {
  protocol: {
    repetitionsPerMovement: 3,
    calibrationDurationMs: 2000,
    countdownSeconds: 3,
  },
  thresholds: {
    consistency: {
      highMaxPct: 8,
      moderateMaxPct: 18,
    },
    sideDifference: {
      notablePct: 15,
    },
    movementDetection: {
      startDeltaDeg: 5,
      startFrames: 4,
      peakStableFrames: 6,
      peakStableToleranceDeg: 2,
      returnToNeutralDeg: 8,
    },
    hipCompensation: {
      minimalMaxDeg: 4,
      moderateMaxDeg: 10,
    },
    landmarkVisibilityMin: 0.55,
    // Diferença de altura entre ombros/quadril considerada digna de nota na
    // postura estática — apenas descritivo, nunca diagnóstico.
    postureNotableTiltDeg: 3,
    // Enquadramento/distância — ver lib/framing.ts. Proporções relativas
    // ao frame (0 a 1), não metros reais. A coluna só precisa do tronco
    // (nariz até quadril) bem enquadrado, não do corpo inteiro.
    framing: {
      minSpanRatio: 0.32,
      maxSpanRatio: 0.75,
      // Só existe checagem de orientação para testes de frente (inclinação
      // lateral). Ver lib/framing.ts — não há verificação confiável de
      // "está de lado?".
      orientationFrontalMinRatio: 0.3,
    },
  },
  copy: {
    disclaimerFinal:
      "Este teste utiliza estimativa de movimento por câmera e pode sofrer influência do posicionamento, iluminação, roupa e qualidade da câmera. Uma câmera 2D observa apenas uma projeção do corpo e não isola segmentos da coluna vertebral. Os resultados descrevem o movimento do tronco observado durante esta avaliação e não identificam escoliose, hérnias, protrusões ou qualquer outra condição da coluna. Se você apresenta dor, perda de força, dificuldade importante para ficar em pé, trauma recente ou outros sintomas, procure avaliação profissional.",
  },
} as const;

export type SpineConfig = typeof SPINE_CONFIG;
