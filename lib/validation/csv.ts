import { ValidationRecord } from "./types";

const COLUMNS: { key: keyof ValidationRecord; header: string }[] = [
  { key: "algorithmVersion", header: "versao_algoritmo" },
  { key: "volunteerCode", header: "codigo_voluntario" },
  { key: "examinerCode", header: "codigo_examinador" },
  { key: "region", header: "regiao" },
  { key: "test", header: "teste" },
  { key: "side", header: "lado" },
  { key: "repetitionIndex", header: "repeticao" },
  { key: "status", header: "status" },
  { key: "cancelReason", header: "motivo_cancelamento" },
  { key: "stablePeakDeg", header: "pico_estavel_graus" },
  { key: "meanDeg", header: "media_graus" },
  { key: "rawMaxDeg", header: "maximo_bruto_graus" },
  { key: "avgLandmarkConfidence", header: "confianca_media_landmarks" },
  { key: "trunkCompensationDeg", header: "compensacao_tronco_graus" },
  { key: "view", header: "vista" },
  { key: "instrument", header: "instrumento" },
  { key: "referenceValueDeg", header: "valor_referencia_graus" },
  { key: "secondsToConfirm", header: "segundos_ate_confirmar" },
  { key: "userAgent", header: "navegador_sistema" },
  { key: "timestampIso", header: "data_hora" },
];

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const str = typeof value === "number" ? String(Math.round(value * 100) / 100) : String(value);
  if (/[",\n]/.test(str)) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Monta o texto do CSV (cabeçalho + uma linha por registro). Função pura, fácil de testar isoladamente. */
export function buildValidationCsv(records: ValidationRecord[]): string {
  const header = COLUMNS.map((c) => c.header).join(",");
  const rows = records.map((r) => COLUMNS.map((c) => csvEscape(r[c.key])).join(","));
  return [header, ...rows].join("\n");
}

/**
 * Baixa o CSV como um arquivo comum no aparelho — nada é enviado para
 * fora, é o mesmo mecanismo de "salvar arquivo" que qualquer site usa.
 */
export function downloadValidationCsv(records: ValidationRecord[]): void {
  const csv = buildValidationCsv(records);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const date = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `uort-validacao-${date}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
