/**
 * Configuração central da iniciativa de precisão (2026).
 *
 * Este arquivo concentra TODOS os números novos (tolerâncias, tempos,
 * faixas) introduzidos pelas melhorias de precisão combinadas com a
 * equipe. Ele não substitui config/app.ts nem config/modules/*.ts — esses
 * continuam sendo a configuração de cada módulo já existente (ombro,
 * joelho, coluna, postura) e não são alterados por esta iniciativa. A
 * ideia é que qualquer novo ajuste relacionado a "quão precisa é a
 * medição" tenha, a partir de agora, um único lugar para ser revisado, em
 * vez de espalhado por vários arquivos.
 *
 * Cada seção abaixo é preenchida no passo do plano indicado no comentário
 * — ainda vazia até chegarmos naquele passo, para não inventar números
 * antes de desenhar como cada checagem realmente vai funcionar.
 *
 * IMPORTANTE — nenhum valor aqui foi validado clinicamente. Campos
 * marcados como "PROVISÓRIO — revisar com equipe médica" (ver
 * `referenceRanges`, passo 8) nunca devem ser exibidos na tela do
 * paciente — apenas no modo de validação/profissional (passo 2).
 */

/**
 * Versão do algoritmo de medição, usada no modo de validação (passo 2)
 * para marcar cada linha do CSV exportado. Deve ser incrementada em
 * qualquer mudança que afete o VALOR medido (suavização, estabilização,
 * protocolo do ombro, uso de coordenadas 3D etc.) — não precisa mudar por
 * ajustes só visuais/de texto.
 *
 * Histórico:
 * - "2026.09-baseline": primeira marca, antes de qualquer mudança de
 *   cálculo desta iniciativa — usada para medir a linha de base do
 *   algoritmo atual (passo 2), antes de comparar com os passos seguintes.
 * - "2026.09-smoothing-v1": passo 3 — liga o suavizador de pontos do
 *   corpo (lib/smoothing.ts) que já existia pronto, mas não estava
 *   conectado em nenhum módulo. Só afeta o valor medido para quem coletar
 *   dados de validação a partir de agora — CSVs anteriores (baseline)
 *   têm "algorithmVersion" diferente e não devem ser comparados linha a
 *   linha com os novos sem levar essa mudança em conta.
 */
export const ALGORITHM_VERSION = "2026.09-smoothing-v1";

export const PRECISION_CONFIG = {
  // Passo 2 — modo de validação com goniômetro.
  validation: {},

  // Passo 3 — ligar o suavizador de pontos do corpo (lib/smoothing.ts).
  smoothing: {
    // Suavização por média móvel exponencial (EMA), aplicada a cada
    // ponto do corpo (ombro, cotovelo, joelho etc.) antes de qualquer
    // cálculo de ângulo — reduz o "tremor" quadro a quadro sem atrasar
    // muito a resposta ao movimento real.
    //
    // alpha = peso do quadro mais recente, de 0 a 1. Mais perto de 1 =
    // responde mais rápido, mas suaviza menos. Mais perto de 0 = mais
    // suave, mas com mais atraso. 0.35 é o valor com que
    // lib/smoothing.ts (PointEmaFilter) já foi escrito e testado
    // isoladamente — mantido aqui como o mesmo número, só que agora
    // documentado e num lugar central em vez de um valor padrão perdido
    // dentro da classe.
    emaAlpha: 0.35,
  },

  // Passo 4 — checagens antes de medir (inclinação do celular, luz).
  preCheck: {},

  // Passo 5 — estabilização por tempo + mediana + repetição extra.
  stabilization: {},

  // Passo 6 — compensação (ex.: tronco) detectada em tempo real.
  compensation: {},

  // Passo 7 — novo protocolo do ombro (flexão de perfil, elevação de frente).
  shoulderProtocol: {},

  // Passo 8 — indicador de confiabilidade do resultado (Alta/Média/Baixa).
  reliability: {},

  // Passo 8 — PROVISÓRIO, revisar com equipe médica antes de qualquer uso.
  // Nunca exibido na tela do paciente — só no modo de validação/profissional.
  referenceRanges: {},
} as const;

export type PrecisionConfig = typeof PRECISION_CONFIG;
