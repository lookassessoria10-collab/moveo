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
 * Verifica se o corpo está de frente para a câmera, para os testes que
 * exigem essa orientação (agachamento, inclinação lateral da coluna).
 * Usa a razão entre a largura dos ombros (eixo X) e a altura do tronco
 * (ombro até quadril) como proxy: de frente, essa razão é
 * consideravelmente maior do que de lado.
 *
 * IMPORTANTE: não existe uma verificação equivalente para "está de
 * lado?" — na prática, o MediaPipe frequentemente estima uma largura de
 * ombro maior do que a real mesmo com a pessoa de perfil (o modelo foi
 * treinado majoritariamente com poses de frente/três-quartos), então essa
 * mesma razão não cai o suficiente para distinguir perfil de frente de
 * forma confiável — tentar isso apenas bloqueava usuários genuinamente
 * de lado. Para testes de perfil (flexão do joelho, sentar-e-levantar,
 * flexão/extensão da coluna), a orientação correta depende da instrução
 * na tela de reposicionamento e da checagem de visibilidade dos
 * landmarks do lado rastreado — não desta função.
 */
export function checkOrientation(
  leftShoulder: Point2D,
  rightShoulder: Point2D,
  shoulderMid: Point2D,
  hipMid: Point2D,
  expected: "frontal" | "lateral",
  opts: { frontalMinRatio: number }
): FramingResult {
  if (expected === "lateral") return { ok: true, message: "" };

  const shoulderWidth = Math.abs(leftShoulder.x - rightShoulder.x);
  const torsoHeight = distance(shoulderMid, hipMid) || 1;
  const ratio = shoulderWidth / torsoHeight;

  if (ratio < opts.frontalMinRatio) {
    return { ok: false, message: "Fique de frente para a câmera." };
  }
  return { ok: true, message: "" };
}
