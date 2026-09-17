import { describe, it, expect } from "vitest";
import {
  calculateAngleBeforeCompensation,
  calculateMaxTrunkCompensation,
  classifyTrunkCompensation,
} from "../trunkCompensation";
import { MovementFrame } from "../types";

function frame(armAngle: number, trunkAngle: number): MovementFrame {
  return {
    timestamp: 0,
    shoulder: { x: 0, y: 0 },
    elbow: { x: 0, y: 0 },
    wrist: { x: 0, y: 0 },
    hip: { x: 0, y: 0 },
    trunkAngle,
    armAngle,
  };
}

describe("classifyTrunkCompensation", () => {
  it("classifica mínima, moderada e elevada de acordo com os limites configurados", () => {
    expect(classifyTrunkCompensation(3)).toBe("mínima");
    expect(classifyTrunkCompensation(10)).toBe("moderada");
    expect(classifyTrunkCompensation(20)).toBe("elevada");
  });
});

describe("calculateMaxTrunkCompensation", () => {
  it("retorna o maior desvio absoluto em relação ao ângulo neutro", () => {
    const frames = [frame(10, 2), frame(40, 9), frame(70, 15), frame(90, 6)];
    expect(calculateMaxTrunkCompensation(frames, 2)).toBeCloseTo(13, 5);
  });
});

describe("calculateAngleBeforeCompensation", () => {
  it("retorna o ângulo do braço no momento em que a compensação ultrapassa o limite mínimo", () => {
    const frames = [frame(10, 2), frame(40, 4), frame(70, 15), frame(90, 20)];
    // limite mínimo padrão = 6°; o desvio (15-2=13) ultrapassa no frame de 70°
    expect(calculateAngleBeforeCompensation(frames, 2)).toBe(70);
  });

  it("retorna null quando a compensação nunca ultrapassa o limite", () => {
    const frames = [frame(10, 2), frame(40, 3), frame(70, 4)];
    expect(calculateAngleBeforeCompensation(frames, 2)).toBeNull();
  });
});
