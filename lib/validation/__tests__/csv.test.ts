import { describe, it, expect } from "vitest";
import { buildValidationCsv } from "../csv";
import { ValidationRecord } from "../types";

function baseRecord(overrides: Partial<ValidationRecord> = {}): ValidationRecord {
  return {
    recordId: "r1",
    algorithmVersion: "2026.09-baseline",
    volunteerCode: "V01",
    examinerCode: "EX1",
    region: "ombro",
    test: "flexion",
    side: "right",
    repetitionIndex: 1,
    status: "valida",
    cancelReason: null,
    stablePeakDeg: 120.4,
    meanDeg: 100.2,
    rawMaxDeg: 121.9,
    avgLandmarkConfidence: 0.87,
    trunkCompensationDeg: 3.1,
    view: "frente",
    instrument: "goniometro",
    referenceValueDeg: 118,
    secondsToConfirm: 4.2,
    userAgent: "test-agent",
    timestampIso: "2026-09-27T10:00:00.000Z",
    ...overrides,
  };
}

describe("buildValidationCsv", () => {
  it("gera um cabeçalho e uma linha por registro", () => {
    const csv = buildValidationCsv([baseRecord()]);
    const lines = csv.split("\n");
    expect(lines).toHaveLength(2);
    expect(lines[0]).toContain("versao_algoritmo");
    expect(lines[1]).toContain("V01");
  });

  it("deixa campos nulos em branco (ex.: repetição cancelada)", () => {
    const csv = buildValidationCsv([
      baseRecord({
        status: "cancelada",
        cancelReason: "perdeu_referencia_durante_movimento",
        stablePeakDeg: null,
        referenceValueDeg: null,
      }),
    ]);
    const [, row] = csv.split("\n");
    expect(row).toContain("cancelada");
    expect(row).toContain("perdeu_referencia_durante_movimento");
  });

  it("escapa vírgulas dentro de um valor", () => {
    const csv = buildValidationCsv([baseRecord({ examinerCode: "EX1, sala 2" })]);
    expect(csv).toContain('"EX1, sala 2"');
  });

  it("arredonda números para 2 casas decimais", () => {
    const csv = buildValidationCsv([baseRecord({ stablePeakDeg: 120.4567 })]);
    const [, row] = csv.split("\n");
    expect(row).toContain("120.46");
  });
});
