import { FrameLandmarks, Point2D } from "../types";

// Índices dos landmarks do BlazePose / MediaPipe Pose Landmarker.
const IDX = {
  nose: 0,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
};

export interface RawLandmark {
  x: number;
  y: number;
  z?: number;
  visibility?: number;
}

/**
 * Converte os landmarks brutos do MediaPipe (coordenadas normalizadas do
 * frame de câmera não espelhado) para o formato interno da aplicação,
 * já espelhando o eixo X — a exibição de vídeo é espelhada (efeito
 * espelho, comum em apps de câmera frontal) e mantemos os landmarks no
 * mesmo referencial para que overlay e cálculos fiquem consistentes.
 * Ângulos calculados a partir daqui não são afetados pelo espelhamento
 * (reflexão preserva magnitude de ângulos).
 */
export function convertLandmarks(raw: RawLandmark[] | undefined): FrameLandmarks | null {
  if (!raw || raw.length < 25) return null;

  const mirror = (p: RawLandmark): Point2D => ({
    x: 1 - p.x,
    y: p.y,
    z: p.z,
    visibility: p.visibility,
  });

  const required = [
    IDX.nose,
    IDX.leftShoulder,
    IDX.rightShoulder,
    IDX.leftElbow,
    IDX.rightElbow,
    IDX.leftWrist,
    IDX.rightWrist,
    IDX.leftHip,
    IDX.rightHip,
  ];
  if (required.some((i) => !raw[i])) return null;

  return {
    nose: mirror(raw[IDX.nose]),
    leftShoulder: mirror(raw[IDX.leftShoulder]),
    rightShoulder: mirror(raw[IDX.rightShoulder]),
    leftElbow: mirror(raw[IDX.leftElbow]),
    rightElbow: mirror(raw[IDX.rightElbow]),
    leftWrist: mirror(raw[IDX.leftWrist]),
    rightWrist: mirror(raw[IDX.rightWrist]),
    leftHip: mirror(raw[IDX.leftHip]),
    rightHip: mirror(raw[IDX.rightHip]),
  };
}
