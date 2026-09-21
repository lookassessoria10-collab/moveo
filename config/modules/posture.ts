/**
 * Configuração experimental do módulo de observação de postura sentada.
 * Pensado como ferramenta de conscientização ergonômica (uso corporativo),
 * não como avaliação clínica. Independente da configuração do ombro, joelho
 * e coluna.
 *
 * Todos os limites abaixo (thresholds) são experimentais e ainda não
 * validados. Servem apenas para categorizar visualmente a postura
 * observada durante a captura — nunca como diagnóstico postural.
 */
export const POSTURE_CONFIG = {
  protocol: {
    captureDurationMs: 3500,
  },
  thresholds: {
    landmarkVisibilityMin: 0.55,
    // Enquadramento sentado: do nariz até o quadril (não é necessário ver
    // pernas/pés). Proporções relativas ao frame (0 a 1).
    framing: {
      minSpanRatio: 0.24,
      maxSpanRatio: 0.8,
      lateralMinNoseOffsetRatio: 0.15,
    },
    // Inclinação do tronco (quadril-ombro) em relação à vertical.
    trunkTilt: {
      notableDeg: 8,
      markedDeg: 15,
    },
    // Deslocamento da cabeça à frente dos ombros (ombro-orelha), expresso
    // como ângulo em relação à vertical — "postura de cabeça projetada
    // à frente" (associada popularmente ao uso prolongado de telas).
    neckTilt: {
      notableDeg: 15,
      markedDeg: 25,
    },
    // Desvio padrão acima disso durante a captura sugere que a pessoa se
    // moveu/ajustou a postura ao longo da medição, tornando a média menos
    // confiável — apenas um aviso, não invalida o resultado.
    instabilityDeg: 6,
  },
  copy: {
    disclaimerFinal:
      "Esta ferramenta observa a postura sentada durante um curto período de captura pela câmera e pode sofrer influência do posicionamento, iluminação, roupa e ângulo da câmera. Os resultados são descritivos e não constituem avaliação ergonômica profissional, diagnóstico médico ou fisioterapêutico. Em caso de dor persistente, procure avaliação profissional.",
    ergonomicsTips: [
      "Posicione a tela na altura dos olhos, com a borda superior próxima ao seu olhar.",
      "Mantenha os pés apoiados no chão ou em um apoio para os pés.",
      "Ajuste o encosto da cadeira para apoiar a região lombar.",
      "Mantenha os cotovelos próximos ao corpo, com ângulo de aproximadamente 90°.",
      "Faça pausas curtas e se movimente a cada 1 hora de trabalho sentado.",
    ],
  },
} as const;

export type PostureConfig = typeof POSTURE_CONFIG;
