import { describe, it, expect } from "vitest";
import { tiltFromHorizontal } from "../angles";

describe("tiltFromHorizontal", () => {
  it("retorna 0° para uma linha perfeitamente horizontal", () => {
    expect(tiltFromHorizontal({ x: 0, y: 0.5 }, { x: 1, y: 0.5 })).toBeCloseTo(0, 5);
  });

  it("retorna valor positivo quando o ponto b está mais baixo (y maior) que a", () => {
    const tilt = tiltFromHorizontal({ x: 0, y: 0.4 }, { x: 1, y: 0.5 });
    expect(tilt).toBeGreaterThan(0);
  });

  it("retorna valor negativo quando o ponto b está mais alto (y menor) que a", () => {
    const tilt = tiltFromHorizontal({ x: 0, y: 0.5 }, { x: 1, y: 0.4 });
    expect(tilt).toBeLessThan(0);
  });
});
