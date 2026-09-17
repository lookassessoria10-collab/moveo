import { FrameLandmarks } from "./types";
import { APP_CONFIG } from "@/config/app";
import { shoulderWidth } from "./angles";

export type PositioningMessageKey =
  | "no_body"
  | "missing_arms"
  | "too_far"
  | "too_close"
  | "not_centered"
  | "move_back"
  | "ok";

export const POSITIONING_MESSAGES: Record<PositioningMessageKey, string> = {
  no_body: "Não conseguimos ver você. Posicione-se de frente para a câmera.",
  missing_arms: "Precisamos enxergar seus braços.",
  too_far: "Aproxime um pouco.",
  too_close: "Afaste um pouco.",
  not_centered: "Centralize seu corpo.",
  move_back: "Um pouco mais para trás.",
  ok: "Perfeito! Posição ideal.",
};

export interface PositioningCheck {
  ok: boolean;
  key: PositioningMessageKey;
  message: string;
}

const VIS_MIN = APP_CONFIG.thresholds.landmarkVisibilityMin;

function visible(landmarks: FrameLandmarks, key: keyof FrameLandmarks): boolean {
  const v = landmarks[key].visibility;
  return v === undefined || v >= VIS_MIN;
}

/**
 * Avalia se o enquadramento atual é adequado para iniciar o teste.
 * Usa a largura relativa dos ombros no frame como proxy de distância —
 * não há tentativa de calcular distância real em metros (ver README).
 */
export function checkPositioning(
  landmarks: FrameLandmarks | null,
  frameWidth: number
): PositioningCheck {
  if (!landmarks) {
    return { ok: false, key: "no_body", message: POSITIONING_MESSAGES.no_body };
  }

  const requiredKeys: (keyof FrameLandmarks)[] = [
    "leftShoulder",
    "rightShoulder",
    "leftElbow",
    "rightElbow",
    "leftWrist",
    "rightWrist",
    "leftHip",
    "rightHip",
  ];
  const allVisible = requiredKeys.every((key) => visible(landmarks, key));
  if (!allVisible) {
    return { ok: false, key: "missing_arms", message: POSITIONING_MESSAGES.missing_arms };
  }

  const width = shoulderWidth(landmarks.leftShoulder, landmarks.rightShoulder);
  const ratio = width / frameWidth;
  const { minShoulderWidthRatio, maxShoulderWidthRatio, centerToleranceRatio } =
    APP_CONFIG.thresholds.positioning;

  if (ratio < minShoulderWidthRatio) {
    return { ok: false, key: "too_far", message: POSITIONING_MESSAGES.too_far };
  }
  if (ratio > maxShoulderWidthRatio) {
    return { ok: false, key: "too_close", message: POSITIONING_MESSAGES.move_back };
  }

  const centerX = (landmarks.leftShoulder.x + landmarks.rightShoulder.x) / 2;
  const centerOffset = Math.abs(centerX - frameWidth / 2) / frameWidth;
  if (centerOffset > centerToleranceRatio) {
    return { ok: false, key: "not_centered", message: POSITIONING_MESSAGES.not_centered };
  }

  return { ok: true, key: "ok", message: POSITIONING_MESSAGES.ok };
}
