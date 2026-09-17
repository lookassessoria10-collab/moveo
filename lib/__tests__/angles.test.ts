import { describe, it, expect } from "vitest";
import { calculateShoulderFlexionAngle, calculateTrunkAngle } from "../angles";

describe("calculateShoulderFlexionAngle", () => {
  it("retorna ~0° quando o braço está ao lado do corpo (paralelo ao tronco)", () => {
    const shoulder = { x: 0, y: 0 };
    const hip = { x: 0, y: 1 }; // tronco aponta para baixo
    const elbow = { x: 0.02, y: 0.5 }; // braço quase alinhado ao tronco
    const angle = calculateShoulderFlexionAngle(shoulder, elbow, hip);
    expect(angle).toBeLessThan(10);
  });

  it("retorna ~90° quando o braço está na horizontal", () => {
    const shoulder = { x: 0, y: 0 };
    const hip = { x: 0, y: 1 };
    const elbow = { x: 1, y: 0 }; // braço horizontal
    const angle = calculateShoulderFlexionAngle(shoulder, elbow, hip);
    expect(angle).toBeCloseTo(90, 0);
  });

  it("retorna ~180° quando o braço está acima da cabeça", () => {
    const shoulder = { x: 0, y: 0 };
    const hip = { x: 0, y: 1 };
    const elbow = { x: 0, y: -1 }; // braço apontando para cima, oposto ao quadril
    const angle = calculateShoulderFlexionAngle(shoulder, elbow, hip);
    expect(angle).toBeCloseTo(180, 0);
  });
});

describe("calculateTrunkAngle", () => {
  it("retorna ~0° quando o tronco está ereto", () => {
    const leftShoulder = { x: -0.1, y: 0 };
    const rightShoulder = { x: 0.1, y: 0 };
    const leftHip = { x: -0.1, y: 1 };
    const rightHip = { x: 0.1, y: 1 };
    const angle = calculateTrunkAngle(leftShoulder, rightShoulder, leftHip, rightHip);
    expect(Math.abs(angle)).toBeLessThan(1);
  });

  it("detecta inclinação lateral do tronco", () => {
    const leftShoulder = { x: 0.15, y: 0 };
    const rightShoulder = { x: 0.35, y: 0 }; // ombros bem deslocados para a direita em relação ao quadril
    const leftHip = { x: -0.1, y: 1 };
    const rightHip = { x: 0.1, y: 1 };
    const angle = calculateTrunkAngle(leftShoulder, rightShoulder, leftHip, rightHip);
    expect(Math.abs(angle)).toBeGreaterThan(5);
  });
});
