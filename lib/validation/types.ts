// Tipos do modo de validação (comparação com goniômetro/inclinômetro).
// Usado apenas por quem entra com ?modo=validacao na URL — nunca aparece
// para o paciente comum.

export type Instrument = "goniometro" | "inclinometro";

export type ValidationRegion = "ombro" | "joelho";

export type ValidationRecordStatus = "valida" | "cancelada";

/**
 * Uma linha do CSV exportado: uma repetição medida (ou cancelada) durante
 * o modo de validação. Nenhum campo identifica a pessoa — só códigos
 * digitados manualmente (ex.: "V01", "EX1").
 */
export interface ValidationRecord {
  algorithmVersion: string;
  volunteerCode: string;
  examinerCode: string;
  region: ValidationRegion;
  test: string; // ex.: "flexion", "abduction", "squat", "sitToStand"
  side: string; // "right" | "left" | "both"
  repetitionIndex: number; // 1-based
  status: ValidationRecordStatus;
  cancelReason: string | null;
  /** Valor oficial que o app mostra hoje (platô suavizado no topo do movimento). */
  stablePeakDeg: number | null;
  /** Média do sinal já suavizado, do início do movimento até o pico. */
  meanDeg: number | null;
  /** Maior valor bruto (antes da suavização) visto durante a repetição. */
  rawMaxDeg: number | null;
  /** Confiança média (0 a 1) dos pontos do corpo usados, durante a repetição. */
  avgLandmarkConfidence: number | null;
  trunkCompensationDeg: number | null;
  view: "frente" | "perfil";
  instrument: Instrument;
  referenceValueDeg: number | null;
  /** Segundos entre o app travar o valor ("segure a posição") e o examinador confirmar. */
  secondsToConfirm: number | null;
  userAgent: string;
  timestampIso: string;
}
