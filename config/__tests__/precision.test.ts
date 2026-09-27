import { describe, it, expect } from "vitest";
import { ALGORITHM_VERSION, PRECISION_CONFIG } from "../precision";

describe("config/precision", () => {
  it("tem uma versão de algoritmo não vazia", () => {
    expect(typeof ALGORITHM_VERSION).toBe("string");
    expect(ALGORITHM_VERSION.length).toBeGreaterThan(0);
  });

  it("expõe as seções esperadas para as próximas melhorias", () => {
    expect(PRECISION_CONFIG).toHaveProperty("validation");
    expect(PRECISION_CONFIG).toHaveProperty("smoothing");
    expect(PRECISION_CONFIG).toHaveProperty("preCheck");
    expect(PRECISION_CONFIG).toHaveProperty("stabilization");
    expect(PRECISION_CONFIG).toHaveProperty("compensation");
    expect(PRECISION_CONFIG).toHaveProperty("shoulderProtocol");
    expect(PRECISION_CONFIG).toHaveProperty("reliability");
    expect(PRECISION_CONFIG).toHaveProperty("referenceRanges");
  });
});
