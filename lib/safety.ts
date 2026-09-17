import { SafetyAnswers } from "./types";

/**
 * Verifica sinais de alerta que sugerem que o teste ativo de movimento não
 * é o passo mais indicado no momento. Não tenta diagnosticar — apenas
 * direciona para avaliação profissional quando qualquer resposta é "sim".
 */
export function hasSafetyConcern(answers: SafetyAnswers): boolean {
  return (
    answers.recentTrauma ||
    answers.severePain ||
    answers.suddenWeakness ||
    answers.cannotMoveArm
  );
}
