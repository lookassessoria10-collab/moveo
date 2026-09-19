import { describe, it, expect } from "vitest";
import { checkOrientation, checkVerticalFraming } from "../framing";

describe("checkVerticalFraming", () => {
  const opts = { minSpanRatio: 0.4, maxSpanRatio: 0.9 };

  it("aprova um enquadramento dentro da faixa esperada", () => {
    const result = checkVerticalFraming({ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.8 }, opts);
    expect(result.ok).toBe(true);
  });

  it("pede para afastar quando a cabeça está perto demais da borda superior", () => {
    const result = checkVerticalFraming({ x: 0.5, y: 0.01 }, { x: 0.5, y: 0.8 }, opts);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/Afaste/);
  });

  it("pede um passo para trás quando os pés saem do quadro embaixo", () => {
    const result = checkVerticalFraming({ x: 0.5, y: 0.2 }, { x: 0.5, y: 0.99 }, opts);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/passo para trás/);
  });

  it("pede para aproximar quando a extensão vertical é pequena demais", () => {
    const result = checkVerticalFraming({ x: 0.5, y: 0.4 }, { x: 0.5, y: 0.5 }, opts);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/Aproxime/);
  });

  it("pede um passo para trás quando a extensão vertical é grande demais", () => {
    const result = checkVerticalFraming({ x: 0.5, y: 0.06 }, { x: 0.5, y: 0.97 }, opts);
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/passo para trás/);
  });
});

describe("checkOrientation", () => {
  const opts = { frontalMinRatio: 0.3, lateralMinNoseOffsetRatio: 0.15 };
  const shoulderMidFrontal = { x: 0.5, y: 0.3 };
  const hipMid = { x: 0.5, y: 0.6 };

  it("aprova vista frontal quando os ombros estão bem afastados no eixo X", () => {
    const result = checkOrientation(
      { x: 0.35, y: 0.3 },
      { x: 0.65, y: 0.3 },
      shoulderMidFrontal,
      hipMid,
      { x: 0.5, y: 0.25 },
      "frontal",
      opts
    );
    expect(result.ok).toBe(true);
  });

  it("pede para ficar de frente quando esperado frontal mas ombros quase sobrepostos (vista de perfil)", () => {
    const result = checkOrientation(
      { x: 0.49, y: 0.3 },
      { x: 0.51, y: 0.3 },
      { x: 0.5, y: 0.3 },
      hipMid,
      { x: 0.5, y: 0.25 },
      "frontal",
      opts
    );
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/de frente/);
  });

  it("aprova vista lateral quando o nariz está bem deslocado do centro dos ombros", () => {
    const result = checkOrientation(
      { x: 0.48, y: 0.3 },
      { x: 0.52, y: 0.3 },
      { x: 0.5, y: 0.3 },
      hipMid,
      { x: 0.56, y: 0.25 }, // nariz deslocado ~1.5x a largura do ombro
      "lateral",
      opts
    );
    expect(result.ok).toBe(true);
  });

  it("pede para ficar de lado quando esperado lateral mas o nariz está centralizado (ainda de frente)", () => {
    const result = checkOrientation(
      { x: 0.35, y: 0.3 },
      { x: 0.65, y: 0.3 },
      { x: 0.5, y: 0.3 },
      hipMid,
      { x: 0.5, y: 0.25 }, // nariz centralizado entre os ombros
      "lateral",
      opts
    );
    expect(result.ok).toBe(false);
    expect(result.message).toMatch(/de lado/);
  });
});
