/**
 * Configuração central da aplicação.
 * Alterar nome, marca, CTA e limites experimentais aqui — nada disso deve
 * ficar hardcoded em componentes.
 */

export const APP_NAME = "MOVEO";

export const APP_CONFIG = {
  name: APP_NAME,
  tagline: "Avaliação funcional do movimento do ombro",
  logo: null as string | null, // caminho para logo, se houver
  colors: {
    primary: "#2B5CE6",
    primaryDark: "#1E44B8",
    right: "#2B5CE6",
    left: "#12A594",
    warn: "#E6A62B",
    danger: "#E14B4B",
  },

  // Texto institucional exibido em telas de abertura / rodapé
  institutionalText:
    "Ferramenta de acompanhamento funcional do movimento do ombro por câmera.",

  // Chamada para ação configurável ao final do relatório
  cta: {
    enabled: true,
    title: "Quer avaliar esses resultados com um especialista?",
    buttonLabel: "AGENDAR AVALIAÇÃO",
    whatsapp: "", // ex: "5511999999999" — deixe vazio para ocultar o botão de WhatsApp
    phone: "", // ex: "+55 11 99999-9999"
    scheduleUrl: "", // link externo de agendamento, se houver
  },

  // Parâmetros do protocolo de teste
  protocol: {
    repetitionsPerMovement: 3,
    calibrationDurationMs: 2000,
    countdownSeconds: 3,
    peakHoldMs: 500,
    movements: ["flexion", "abduction"] as const,
    sides: ["right", "left"] as const,
  },

  // Limites experimentais — ainda não validados clinicamente.
  // Usados apenas para categorizar visualmente, nunca como critério médico.
  thresholds: {
    trunkCompensation: {
      minimalMaxDeg: 6,
      moderateMaxDeg: 14,
      // acima de moderateMaxDeg => "elevada"
    },
    consistency: {
      // desvio padrão relativo (%) entre repetições
      highMaxPct: 8,
      moderateMaxPct: 18,
      // acima de moderateMaxPct => "baixa"
    },
    sideDifference: {
      // diferença percentual entre lados considerada "notável" apenas para
      // destaque visual — não é critério diagnóstico
      notablePct: 15,
    },
    positioning: {
      minShoulderWidthRatio: 0.12, // ombros muito estreitos no frame => longe demais
      maxShoulderWidthRatio: 0.32, // ombros muito largos no frame => perto demais
      centerToleranceRatio: 0.12, // desvio horizontal tolerado do centro do frame
    },
    movementDetection: {
      startDeltaDeg: 6, // variação mínima de ângulo para considerar início de movimento
      startFrames: 4, // nº de frames consecutivos com variação para confirmar início
      peakStableFrames: 6, // frames com variação pequena para confirmar pico
      peakStableToleranceDeg: 2.5,
      returnToNeutralDeg: 15, // ângulo abaixo do qual consideramos "voltou ao neutro"
    },
    landmarkVisibilityMin: 0.5,
  },

  // Textos podem ser trocados sem alterar componentes
  copy: {
    disclaimerHome:
      "Esta ferramenta avalia características do movimento e não realiza diagnóstico médico.",
    disclaimerFinal:
      "Este teste utiliza estimativa de movimento por câmera e pode sofrer influência do posicionamento, iluminação, roupa e qualidade da câmera. Os resultados descrevem o movimento observado durante esta avaliação e não identificam lesões ou condições médicas. Se você apresenta dor, perda de força, limitação importante, trauma recente ou outros sintomas, procure avaliação profissional.",
  },
} as const;

export type AppConfig = typeof APP_CONFIG;
