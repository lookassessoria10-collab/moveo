/**
 * Configuração central da plataforma (nome, marca, cores, CTA, textos
 * institucionais). Válida para todas as regiões (ombro, joelho, coluna,
 * postura).
 *
 * Identidade visual adaptada para a UORT (Unidade Ortopédica
 * Traumatológica) a partir dos materiais de marca fornecidos: paleta
 * teal + navy e logo em public/brand/.
 *
 * O bloco `protocol` e `thresholds` abaixo é específico do módulo OMBRO
 * (mantido aqui por compatibilidade com o código já existente). Os módulos
 * de joelho, coluna e postura têm sua própria configuração em
 * config/modules/knee.ts, config/modules/spine.ts e config/modules/posture.ts.
 */

export const APP_NAME = "UORT";

export const APP_CONFIG = {
  name: APP_NAME,
  tagline: "Análise de Movimento UORT",
  logo: "/brand/uort-logo.jpg" as string | null, // wordmark em fundo claro — ver public/brand/
  colors: {
    primary: "#128C90",
    primaryDark: "#0B6367",
    // Ritmo de duas cores do próprio material de marca da UORT (teal +
    // navy lado a lado nos títulos) — usado para diferenciar lado
    // direito/esquerdo nos gráficos comparativos.
    right: "#128C90",
    left: "#1B3A4B",
    warn: "#D9A441",
    danger: "#D64545",
    // Tom intermediário entre o teal e o navy — só para diferenciar o card
    // de POSTURA dos demais na tela inicial (JOELHO já usa `left`/navy).
    posture: "#3E6E86",
  },

  // Texto institucional exibido em telas de abertura / rodapé
  institutionalText:
    "Ferramenta de análise de movimento por câmera da UORT — Unidade Ortopédica Traumatológica.",

  // Chamada para ação configurável ao final do relatório
  cta: {
    enabled: true,
    title: "Quer avaliar esses resultados com um especialista?",
    buttonLabel: "AGENDAR AVALIAÇÃO",
    whatsapp: "", // ex: "5511999999999" — deixe vazio para ocultar o botão de WhatsApp
    phone: "", // ex: "+55 11 99999-9999"
    scheduleUrl: "", // link externo de agendamento, se houver
  },

  // Parâmetros do protocolo de teste — específicos do módulo Ombro.
  protocol: {
    repetitionsPerMovement: 3,
    calibrationDurationMs: 2000,
    countdownSeconds: 3,
    peakHoldMs: 500,
    movements: ["flexion", "abduction"] as const,
    sides: ["right", "left"] as const,
  },

  // Limites experimentais do módulo Ombro — ainda não validados
  // clinicamente. Usados apenas para categorizar visualmente, nunca como
  // critério médico. Necessitam validação clínica antes de qualquer uso
  // como critério diagnóstico.
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
