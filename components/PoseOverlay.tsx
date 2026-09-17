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
