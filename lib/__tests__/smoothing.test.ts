import { describe, it, expect } from "vitest";
import { PointEmaFilter, LandmarksSmoother } from "../smoothing";
import { FrameLandmarks, Point2D } from "../types";

const ALL_KEYS: (keyof FrameLandmarks)[] = [
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

function allLandmarksAt(p: Point2D): FrameLandmarks {
  const result = {} as FrameLandmarks;
  for (const key of ALL_KEYS) result[key] = { ...p };
  return result;
}

describe("PointEmaFilter", () => {
  it("no primeiro quadro, retorna o valor bruto sem suavizar", () => {
    const filter = new PointEmaFilter(0.35);
    const result = filter.update({ x: 0.5, y: 0.5 });
    expect(result).toEqual({ x: 0.5, y: 0.5 });
  });

  it("no segundo quadro, se move só uma fração em direção ao novo valor (reduz tremor)", () => {
    const filter = new PointEmaFilter(0.35);
    filter.update({ x: 0, y: 0 });
    const result = filter.update({ x: 1, y: 0 });
    expect(result.x).toBeCloseTo(0.35, 5);
    expect(result.x).toBeGreaterThan(0);
    expect(result.x).toBeLessThan(1);
  });

  it("converge para um valor constante depois de vários quadros", () => {
    const filter = new PointEmaFilter(0.35);
    let result = filter.update({ x: 0, y: 0 });
    for (let i = 0; i < 30; i++) {
      result = filter.update({ x: 1, y: 1 });
    }
    expect(result.x).toBeCloseTo(1, 3);
    expect(result.y).toBeCloseTo(1, 3);
  });

  it("depois de reset(), volta a retornar o valor bruto sem suavizar", () => {
    const filter = new PointEmaFilter(0.35);
    filter.update({ x: 0, y: 0 });
    filter.reset();
    const result = filter.update({ x: 1, y: 1 });
    expect(result).toEqual({ x: 1, y: 1 });
  });
});

describe("LandmarksSmoother", () => {
  it("suaviza todos os pontos do corpo, mantendo as mesmas chaves", () => {
    const smoother = new LandmarksSmoother(0.35);
    const raw = allLandmarksAt({ x: 0.5, y: 0.5 });
    const smoothed = smoother.smooth(raw);
    expect(Object.keys(smoothed).sort()).toEqual(Object.keys(raw).sort());
  });

  it("reduz o tremor quadro a quadro: o deslocamento suavizado é menor que o bruto", () => {
    const smoother = new LandmarksSmoother(0.35);
    smoother.smooth(allLandmarksAt({ x: 0.4, y: 0.4 }));
    const smoothed = smoother.smooth(allLandmarksAt({ x: 0.6, y: 0.4 }));
    const rawJump = 0.6 - 0.4;
    const smoothedJump = smoothed.nose.x - 0.4;
    expect(Math.abs(smoothedJump)).toBeLessThan(Math.abs(rawJump));
  });

  it("reset() reinicia todos os pontos (o quadro seguinte não é suavizado)", () => {
    const smoother = new LandmarksSmoother(0.35);
    smoother.smooth(allLandmarksAt({ x: 0.1, y: 0.1 }));
    smoother.reset();
    const smoothed = smoother.smooth(allLandmarksAt({ x: 0.9, y: 0.9 }));
    expect(smoothed.nose).toEqual({ x: 0.9, y: 0.9 });
  });
});
