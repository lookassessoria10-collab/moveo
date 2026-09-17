import { describe, it, expect } from "vitest";
import {
  calculateAngularVelocity,
  calculateConsistency,
  calculateMovementDuration,
  calculateSideDifference,
  standardDeviation,
} from "../movementMetrics";

describe("calculateMovementDuration", () => {
  it("calcula a diferença entre início e pico", () => {
    expect(calculateMovementDuration(1000, 3500)).toBe(2500);
  });

  it("nunca retorna valor negativo", () => {
    expect(calculateMovementDuration(3500, 1000)).toBe(0);
  });
});

describe("calculateAngularVelocity", () => {
  it("calcula graus por segundo", () => {
    expect(calculateAngularVelocity(90, 1000)).toBeCloseTo(90, 5);
    expect(calculateAngularVelocity(90, 2000)).toBeCloseTo(45, 5);
  });

  it("retorna 0 para duração inválida", () => {
    expect(calculateAngularVelocity(90, 0)).toBe(0);
  });
});

describe("calculateSideDifference", () => {
  it("calcula diferença absoluta e percentual", () => {
    const result = calculateSideDifference(120, 160);
    expect(result.absoluteDifference).toBe(40);
    expect(result.percentageDifference).toBeCloseTo(25, 5);
  });

  it("retorna nulos quando falta um dos lados", () => {
    const result = calculateSideDifference(null, 160);
    expect(result.absoluteDifference).toBeNull();
    expect(result.percentageDifference).toBeNull();
  });
});

describe("calculateConsistency", () => {
  it("classifica alta consistência quando os ângulos são semelhantes", () => {
    const result = calculateConsistency([120, 121, 119]);
    expect(result.label).toBe("alta");
    expect(result.declined).toBe(false);
  });

  it("detecta redução progressiva entre repetições", () => {
    const result = calculateConsistency([122, 110, 95]);
    expect(result.declined).toBe(true);
  });

  it("classifica baixa consistência com grande variação", () => {
    const result = calculateConsistency([150, 100, 60]);
    expect(result.label).toBe("baixa");
  });
});

describe("standardDeviation", () => {
  it("retorna 0 para valores idênticos", () => {
    expect(standardDeviation([100, 100, 100])).toBe(0);
  });

  it("calcula o desvio padrão populacional", () => {
    expect(standardDeviation([2, 4, 4, 4, 5, 5, 7, 9])).toBeCloseTo(2, 1);
  });
});
