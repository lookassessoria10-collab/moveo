import { describe, it, expect } from "vitest";
import { tiltFromVerticalDeg } from "../angles";

describe("tiltFromVerticalDeg", () => {
  it("retorna 0° quando o ponto superior está exatamente acima do inferior", () => {
    const tilt = tiltFromVerticalDeg({ x: 0.5, y: 0.6 }, { x: 0.5, y: 0.3 });
    expect(tilt).toBeCloseTo(0, 5);
  });

  it("cresce conforme o ponto superior se desloca para o lado", () => {
    const straight = tiltFromVerticalDeg({ x: 0.5, y: 0.6 }, { x: 0.5, y: 0.3 });
    const tilted = tiltFromVerticalDeg({ x: 0.5, y: 0.6 }, { x: 0.6, y: 0.3 });
    expect(tilted).toBeGreaterThan(straight);
  });

  it("é sempre positivo, independente do lado do deslocamento", () => {
    const right = tiltFromVerticalDeg({ x: 0.5, y: 0.6 }, { x: 0.6, y: 0.3 });
    const left = tiltFromVerticalDeg({ x: 0.5, y: 0.6 }, { x: 0.4, y: 0.3 });
    expect(right).toBeCloseTo(left, 5);
    expect(right).toBeGreaterThan(0);
  });

  it("aproxima-se de 90° quando o deslocamento horizontal é muito maior que o vertical", () => {
    const tilt = tiltFromVerticalDeg({ x: 0.3, y: 0.5 }, { x: 0.9, y: 0.49 });
    expect(tilt).toBeGreaterThan(80);
  });
});
