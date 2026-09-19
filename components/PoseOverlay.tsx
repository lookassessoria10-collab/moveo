import { FrameLandmarks } from "@/lib/types";

interface DrawOptions {
  highlightSide?: "right" | "left" | null;
  angle?: number | null;
}

const DOT_COLOR = "rgba(43,92,230,0.9)";
const LINE_COLOR = "rgba(255,255,255,0.85)";
const RIGHT_COLOR = "#2B5CE6";
const LEFT_COLOR = "#12A594";

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, r = 6) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255,255,255,0.9)";
  ctx.stroke();
}

function line(ctx: CanvasRenderingContext2D, a: { x: number; y: number }, b: { x: number; y: number }, color: string, width = 4) {
  ctx.beginPath();
  ctx.moveTo(a.x, a.y);
  ctx.lineTo(b.x, b.y);
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.lineCap = "round";
  ctx.stroke();
}

/** Desenha um overlay discreto e elegante sobre os landmarks — não é um "esqueleto técnico". */
export function drawPoseOverlay(
  ctx: CanvasRenderingContext2D,
  landmarks: FrameLandmarks,
  width: number,
  height: number,
  options: DrawOptions = {}
) {
  const px = (p: { x: number; y: number }) => ({ x: p.x * width, y: p.y * height });

  const rs = px(landmarks.rightShoulder);
  const re = px(landmarks.rightElbow);
  const rw = px(landmarks.rightWrist);
  const rh = px(landmarks.rightHip);
  const ls = px(landmarks.leftShoulder);
  const le = px(landmarks.leftElbow);
  const lw = px(landmarks.leftWrist);
  const lh = px(landmarks.leftHip);

  const rightActive = options.highlightSide === "right";
  const leftActive = options.highlightSide === "left";

  line(ctx, ls, rs, LINE_COLOR, 3);
  line(ctx, lh, rh, LINE_COLOR, 3);
  line(ctx, ls, lh, "rgba(255,255,255,0.4)", 2);
  line(ctx, rs, rh, "rgba(255,255,255,0.4)", 2);

  line(ctx, rs, re, rightActive ? RIGHT_COLOR : LINE_COLOR, rightActive ? 5 : 3);
  line(ctx, re, rw, rightActive ? RIGHT_COLOR : LINE_COLOR, rightActive ? 5 : 3);
  line(ctx, ls, le, leftActive ? LEFT_COLOR : LINE_COLOR, leftActive ? 5 : 3);
  line(ctx, le, lw, leftActive ? LEFT_COLOR : LINE_COLOR, leftActive ? 5 : 3);

  for (const p of [rs, re, rw, rh, ls, le, lw, lh]) {
    dot(ctx, p.x, p.y, DOT_COLOR, 5);
  }

  // arco simples indicando o ângulo no ombro ativo
  if (options.highlightSide && options.angle != null) {
    const shoulder = options.highlightSide === "right" ? rs : ls;
    const hip = options.highlightSide === "right" ? rh : lh;
    const color = options.highlightSide === "right" ? RIGHT_COLOR : LEFT_COLOR;
    const radius = 34;
    const trunkAngleRad = Math.atan2(hip.y - shoulder.y, hip.x - shoulder.x);
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.arc(shoulder.x, shoulder.y, radius, trunkAngleRad, trunkAngleRad + (options.angle * Math.PI) / 180);
    ctx.stroke();
  }
}

interface LegDrawOptions {
  /** Qual(is) perna(s) destacar: "right"/"left" para testes por lado, "both" para o agachamento. */
  highlightSide?: "right" | "left" | "both" | null;
}

/**
 * Overlay para o módulo de Joelho: desenha quadril→joelho→tornozelo (a
 * perna, não o tronco). Usado no lugar de drawPoseOverlay() porque este
 * último sempre desenha o retângulo ombro-quadril, que visualmente parece
 * um overlay de tronco mesmo durante um teste de joelho.
 */
export function drawLegOverlay(
  ctx: CanvasRenderingContext2D,
  landmarks: FrameLandmarks,
  width: number,
  height: number,
  options: LegDrawOptions = {}
) {
  const px = (p: { x: number; y: number }) => ({ x: p.x * width, y: p.y * height });

  const rs = px(landmarks.rightShoulder);
  const ls = px(landmarks.leftShoulder);
  const rh = px(landmarks.rightHip);
  const lh = px(landmarks.leftHip);
  const rk = px(landmarks.rightKnee);
  const lk = px(landmarks.leftKnee);
  const ra = px(landmarks.rightAnkle);
  const la = px(landmarks.leftAnkle);

  // linha de tronco discreta, apenas para dar contexto de orientação
  const shoulderMid = { x: (rs.x + ls.x) / 2, y: (rs.y + ls.y) / 2 };
  const hipMid = { x: (rh.x + lh.x) / 2, y: (rh.y + lh.y) / 2 };
  line(ctx, shoulderMid, hipMid, "rgba(255,255,255,0.35)", 2);
  line(ctx, lh, rh, "rgba(255,255,255,0.35)", 2);

  const rightActive = options.highlightSide === "right" || options.highlightSide === "both";
  const leftActive = options.highlightSide === "left" || options.highlightSide === "both";

  line(ctx, rh, rk, rightActive ? RIGHT_COLOR : LINE_COLOR, rightActive ? 5 : 3);
  line(ctx, rk, ra, rightActive ? RIGHT_COLOR : LINE_COLOR, rightActive ? 5 : 3);
  line(ctx, lh, lk, leftActive ? LEFT_COLOR : LINE_COLOR, leftActive ? 5 : 3);
  line(ctx, lk, la, leftActive ? LEFT_COLOR : LINE_COLOR, leftActive ? 5 : 3);

  for (const p of [rh, rk, ra, lh, lk, la]) {
    dot(ctx, p.x, p.y, DOT_COLOR, rightActive || leftActive ? 6 : 5);
  }
}
