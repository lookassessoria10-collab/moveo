import { FrameLandmarks, Point2D } from "./types";

/** Filtro de média móvel exponencial simples para um ponto 2D. */
export class PointEmaFilter {
  private value: Point2D | null = null;
  constructor(private alpha: number = 0.35) {}

  update(next: Point2D): Point2D {
    if (!this.value) {
      this.value = { ...next };
      return this.value;
    }
    this.value = {
      x: this.value.x + this.alpha * (next.x - this.value.x),
      y: this.value.y + this.alpha * (next.y - this.value.y),
      visibility: next.visibility,
    };
    return this.value;
  }

  reset() {
    this.value = null;
  }
}

const LANDMARK_KEYS: (keyof FrameLandmarks)[] = [
  "nose",
  "leftEar",
  "rightEar",
  "leftShoulder",
  "rightShoulder",
  "leftElbow",
  "rightElbow",
  "leftWrist",
  "rightWrist",
  "leftHip",
  "rightHip",
  "leftKnee",
  "rightKnee",
  "leftAnkle",
  "rightAnkle",
  "leftHeel",
  "rightHeel",
  "leftFootIndex",
  "rightFootIndex",
];

/** Aplica EMA a todos os landmarks de um frame, mantendo estado entre chamadas. */
export class LandmarksSmoother {
  private filters: Record<string, PointEmaFilter> = {};

  constructor(private alpha: number = 0.35) {
    for (const key of LANDMARK_KEYS) {
      this.filters[key] = new PointEmaFilter(alpha);
    }
  }

  smooth(landmarks: FrameLandmarks): FrameLandmarks {
    const result = {} as FrameLandmarks;
    for (const key of LANDMARK_KEYS) {
      result[key] = this.filters[key].update(landmarks[key]);
    }
    return result;
  }

  reset() {
    for (const key of LANDMARK_KEYS) this.filters[key].reset();
  }
}

/** Simple moving average sobre uma janela de números — usado para o ângulo já calculado. */
export class MovingAverage {
  private buffer: number[] = [];
  constructor(private windowSize: number = 5) {}

  push(value: number): number {
    this.buffer.push(value);
    if (this.buffer.length > this.windowSize) this.buffer.shift();
    return this.average();
  }

  average(): number {
    if (this.buffer.length === 0) return 0;
    return this.buffer.reduce((a, b) => a + b, 0) / this.buffer.length;
  }

  reset() {
    this.buffer = [];
  }
}
