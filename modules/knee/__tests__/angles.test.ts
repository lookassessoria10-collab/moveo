import { describe, it, expect } from "vitest";
import { calculateKneeAngle, kneeFlexionFromRawAngle } from "../angles";

describe("calculateKneeAngle", () => {
  it("retorna ~180° para a perna estendida (quadril, joelho e tornozelo alinhados)", () => {
    const hip = { x: 0, y: 0 };
    const knee = { x: 0, y: 1 };
    const ankle = { x: 0, y: 2 };
    expect(calculateKneeAngle(hip, knee, ankle)).toBeCloseTo(180, 0);
  });

  it("retorna ~90° quando o joelho está dobrado em ângulo reto", () => {
    const hip = { x: 0, y: 0 };
    const knee = { x: 0, y: 1 };
    const ankle = { x: 1, y: 1 };
    expect(calculateKneeAngle(hip, knee, ankle)).toBeCloseTo(90, 0);
  });
});

describe("kneeFlexionFromRawAngle", () => {
  it("converte perna estendida (180°) em 0° de flexão", () => {
    expect(kneeFlexionFromRawAngle(180)).toBe(0);
  });

  it("converte joelho dobrado a 90° em 90° de flexão", () => {
    expect(kneeFlexionFromRawAngle(90)).toBe(90);
  });

  it("nunca retorna valor negativo mesmo com ângulo bruto acima de 180", () => {
    expect(kneeFlexionFromRawAngle(185)).toBe(0);
  });
});
