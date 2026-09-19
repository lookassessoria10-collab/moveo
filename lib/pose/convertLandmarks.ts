import { FrameLandmarks, Point2D } from "../types";

// Índices dos landmarks do BlazePose / MediaPipe Pose Landmarker (33 pontos).
// O conjunto "leg"/"foot" foi adicionado para os módulos de joelho e coluna;
// o módulo de ombro continua usando apenas o subconjunto original.
const IDX = {
  nose: 0,
  leftEar: 7,
  rightEar: 8,
  leftShoulder: 11,
  rightShoulder: 12,
  leftElbow: 13,
  rightElbow: 14,
  leftWrist: 15,
  rightWrist: 16,
  leftHip: 23,
  rightHip: 24,
  leftKnee: 25,
  rightKnee: 26,
  leftAnkle: 27,
  rightAnkle: 28,
  leftHeel: 29,
  rightHeel: 30,
  leftFootIndex: 31,
  rightFootIndex: 32,
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
  if (!raw || raw.length < 33) return null;

  const mirror = (p: RawLandmark): Point2D => ({
    x: 1 - p.x,
    y: p.y,
    z: p.z,
    visibility: p.visibility,
  });

  const allIndices = Object.values(IDX);
  if (allIndices.some((i) => !raw[i])) return null;

  return {
    nose: mirror(raw[IDX.nose]),
    leftEar: mirror(raw[IDX.leftEar]),
    rightEar: mirror(raw[IDX.rightEar]),
    leftShoulder: mirror(raw[IDX.leftShoulder]),
    rightShoulder: mirror(raw[IDX.rightShoulder]),
    leftElbow: mirror(raw[IDX.leftElbow]),
    rightElbow: mirror(raw[IDX.rightElbow]),
    leftWrist: mirror(raw[IDX.leftWrist]),
    rightWrist: mirror(raw[IDX.rightWrist]),
    leftHip: mirror(raw[IDX.leftHip]),
    rightHip: mirror(raw[IDX.rightHip]),
    leftKnee: mirror(raw[IDX.leftKnee]),
    rightKnee: mirror(raw[IDX.rightKnee]),
    leftAnkle: mirror(raw[IDX.leftAnkle]),
    rightAnkle: mirror(raw[IDX.rightAnkle]),
    leftHeel: mirror(raw[IDX.leftHeel]),
    rightHeel: mirror(raw[IDX.rightHeel]),
    leftFootIndex: mirror(raw[IDX.leftFootIndex]),
    rightFootIndex: mirror(raw[IDX.rightFootIndex]),
  };
}
