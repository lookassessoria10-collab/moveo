/**
 * Verifica sinais de alerta que sugerem que o teste ativo de movimento não
 * é o passo mais indicado no momento. Não tenta diagnosticar — apenas
 * direciona para avaliação profissional quando qualquer resposta é "sim".
 *
 * Genérico por design: cada módulo (ombro, joelho, coluna) define seu
 * próprio conjunto de perguntas de segurança, mas todas seguem o mesmo
 * formato — um mapa de chave para resposta booleana — e a regra é sempre a
 * mesma: qualquer resposta "sim" interrompe o teste.
 */
export function hasSafetyConcern<T extends object>(answers: T): boolean {
  return Object.values(answers).some(Boolean);
}
