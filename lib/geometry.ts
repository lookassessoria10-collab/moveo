import { Point2D } from "./types";

/** Ângulo (graus, 0-180) formado no vértice `b` pelos pontos a-b-c. */
export function angleBetweenPoints(a: Point2D, b: Point2D, c: Point2D): number {
  const v1 = { x: a.x - b.x, y: a.y - b.y };
  const v2 = { x: c.x - b.x, y: c.y - b.y };
  const dot = v1.x * v2.x + v1.y * v2.y;
  const mag1 = Math.hypot(v1.x, v1.y);
  const mag2 = Math.hypot(v2.x, v2.y);
  if (mag1 === 0 || mag2 === 0) return 0;
  const cos = Math.min(1, Math.max(-1, dot / (mag1 * mag2)));
  return (Math.acos(cos) * 180) / Math.PI;
}

/** Ângulo do segmento a->b em relação à vertical (0 = para baixo, 180 = para cima), em graus. */
export function angleFromVertical(a: Point2D, b: Point2D): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  // vetor "para baixo" de referência é (0, 1) em coordenadas de imagem (y cresce para baixo)
  const angleRad = Math.atan2(dx, dy);
  let deg = (angleRad * 180) / Math.PI;
  if (deg < 0) deg += 360;
  return deg;
}

export function midpoint(a: Point2D, b: Point2D): Point2D {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function distance(a: Point2D, b: Point2D): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}
