import { MovementPhase } from "./types";
import { APP_CONFIG } from "@/config/app";

export interface MovementDetectionConfig {
  startDeltaDeg: number;
  startFrames: number;
  peakStableFrames: number;
  peakStableToleranceDeg: number;
  returnToNeutralDeg: number;
}

export const DEFAULT_DETECTION_CONFIG: MovementDetectionConfig =
  APP_CONFIG.thresholds.movementDetection;

export interface DetectionUpdateResult {
  phase: MovementPhase;
  justReachedPeak: boolean;
  justCompleted: boolean;
  justStarted: boolean;
}

/**
 * Máquina de estados simples para detectar automaticamente o início,
 * pico e retorno de um movimento de elevação de braço, a partir de uma
 * série temporal de ângulos já suavizados. Não depende de botões nem de
 * qualquer API de câmera — pode ser testada isoladamente.
 */
export class MovementStateMachine {
  private phase: MovementPhase = "IDLE";
  private neutralAngle = 0;
  private startAngleBuffer: number[] = [];
  private lastAngle: number | null = null;
  private peakAngle = -Infinity;
  private peakStableCount = 0;
  private ascendingSinceIdxAngle = 0;

  constructor(private config: MovementDetectionConfig = DEFAULT_DETECTION_CONFIG) {}

  /** Coloca a máquina em modo "pronto para detectar" a partir de um ângulo neutro conhecido. */
  arm(neutralAngle: number) {
    this.phase = "READY";
    this.neutralAngle = neutralAngle;
    this.startAngleBuffer = [];
    this.lastAngle = neutralAngle;
    this.peakAngle = neutralAngle;
    this.peakStableCount = 0;
  }

  reset() {
    this.phase = "IDLE";
    this.startAngleBuffer = [];
    this.lastAngle = null;
    this.peakAngle = -Infinity;
    this.peakStableCount = 0;
  }

  getPhase(): MovementPhase {
    return this.phase;
  }

  update(angle: number): DetectionUpdateResult {
    const result: DetectionUpdateResult = {
      phase: this.phase,
      justReachedPeak: false,
      justCompleted: false,
      justStarted: false,
    };

    if (this.phase === "IDLE") {
      return result;
    }

    if (this.phase === "READY") {
      const delta = angle - this.neutralAngle;
      if (delta > this.config.startDeltaDeg) {
        this.startAngleBuffer.push(delta);
      } else {
        this.startAngleBuffer = [];
      }
      if (this.startAngleBuffer.length >= this.config.startFrames) {
        this.phase = "ASCENDING";
        this.peakAngle = angle;
        this.peakStableCount = 0;
        result.justStarted = true;
      }
    } else if (this.phase === "ASCENDING") {
      if (angle > this.peakAngle) {
        this.peakAngle = angle;
        this.peakStableCount = 0;
      } else if (this.peakAngle - angle < this.config.peakStableToleranceDeg) {
        this.peakStableCount++;
      } else {
        // caiu de forma consistente: já passou do pico
        this.peakStableCount = this.config.peakStableFrames;
      }

      if (this.peakStableCount >= this.config.peakStableFrames) {
        this.phase = "PEAK";
        result.justReachedPeak = true;
      }
    } else if (this.phase === "PEAK") {
      // uma única transição de PEAK para DESCENDING assim que o ângulo cair
      if (angle < this.peakAngle - this.config.peakStableToleranceDeg) {
        this.phase = "DESCENDING";
      }
    } else if (this.phase === "DESCENDING") {
      const delta = angle - this.neutralAngle;
      if (delta <= this.config.returnToNeutralDeg) {
        this.phase = "COMPLETED";
        result.justCompleted = true;
      }
    }

    this.lastAngle = angle;
    result.phase = this.phase;
    return result;
  }

  getPeakAngle(): number {
    return this.peakAngle;
  }
}
