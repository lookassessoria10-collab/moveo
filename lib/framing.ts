import { Point2D } from "./types";
import { distance } from "./geometry";

export interface FramingResult {
  ok: boolean;
  message: string;
}

/**
 * Verificações de enquadramento e distância compartilhadas entre os
 * módulos de joelho e coluna (o ombro usa sua própria checagem mais
 * simples em lib/positioning.ts, focada só na largura dos ombros).
 *
 * Uma câmera única não mede distância real em metros — por isso essas
 * funções usam proporções entre landmarks no próprio frame (0 a 1) como
 * proxy: cabeça/pés perto da borda ou uma extensão vertical do corpo
 * fora de uma faixa razoável indicam que a pessoa está perto demais,
 * longe demais, ou cortada no enquadramento. Isso ajuda a evitar que o
 * MediaPipe "alucine" a posição de pontos que estão fora do quadro.
 */
const EDGE_MARGIN = 0.05;

export function checkVerticalFraming(
  topPoint: Point2D,
  bottomPoint: Point2D,
  opts: { minSpanRatio: number; maxSpanRatio: number }
): FramingResult {
  if (topPoint.y < EDGE_MARGIN) {
    return { ok: false, message: "Afaste um pouco — a parte de cima do seu corpo está saindo do quadro." };
  }
  if (bottomPoint.y > 1 - EDGE_MARGIN) {
    return { ok: false, message: "Dê um passo para trás — seus pés estão saindo do quadro." };
  }
  const span = bottomPoint.y - topPoint.y;
  if (span > opts.maxSpanRatio) {
    return { ok: false, message: "Dê um passo para trás." };
  }
  if (span < opts.minSpanRatio) {
    return { ok: false, message: "Aproxime um pouco." };
  }
  return { ok: true, message: "Perfeito! Posição ideal." };
}

/**
 * Verifica se a orientação do corpo é compatível com a esperada para o
 * teste atual.
 *
 * Para "frontal" (agachamento, inclinação lateral da coluna): usa a razão
 * entre a largura dos ombros (eixo X) e a altura do tronco (ombro até
 * quadril) — de frente, essa razão é consideravelmente maior do que de
 * lado.
 *
 * Para "lateral" (flexão do joelho, sentar-e-levantar, flexão/extensão da
 * coluna): NÃO usa essa mesma razão — na prática, o MediaPipe
 * frequentemente estima uma largura de ombro maior do que a real mesmo
 * com a pessoa de perfil (o modelo foi treinado majoritariamente com
 * poses de frente/três-quartos), então tentar exigir uma razão pequena o
 * bastante só bloqueava usuários genuinamente de lado. Em vez disso, usa
 * a posição do nariz em relação ao centro dos ombros, normalizada pela
 * largura dos ombros: de frente, o nariz fica bem próximo do centro entre
 * os dois ombros; qualquer giro real do corpo/cabeça desloca o nariz
 * visivelmente para um lado. O limite é propositalmente baixo — o
 * objetivo é só rejeitar quem claramente esqueceu de virar, não exigir um
 * perfil perfeito de 90°.
 */
export function checkOrientation(
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  shoulderMid: Point2D,
  hipMid: Point2D,
  nose: Point2D,
  expected: "frontal" | "lateral",
  opts: { frontalMinRatio: number; lateralMinNoseOffsetRatio: number }
): FramingResult {
  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x) || 1;

  if (expected === "lateral") {
    const noseOffsetRatio = Math.abs(nose.x - shoulderMid.x) / shoulderWidth;
    if (noseOffsetRatio < opts.lateralMinNoseOffsetRatio) {
      return { ok: false, message: "Fique de lado em relação à câmera, como na ilustração." };
    }
    return { ok: true, message: "" };
  }

  const torsoHeight = distance(shoulderMid, hipMid) || 1;
  const ratio = shoulderWidth / torsoHeight;
  if (ratio < opts.frontalMinRatio) {
    return { ok: false, message: "Fique de frente para a câmera." };
  }
  return { ok: true, message: "" };
}
