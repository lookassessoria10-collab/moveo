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

function buildFrameLandmarks(raw: RawLandmark[], transform: (p: RawLandmark) => Point2D): FrameLandmarks {
  return {
    nose: transform(raw[IDX.nose]),
    leftEar: transform(raw[IDX.leftEar]),
    rightEar: transform(raw[IDX.rightEar]),
    leftShoulder: transform(raw[IDX.leftShoulder]),
    rightShoulder: transform(raw[IDX.rightShoulder]),
    leftElbow: transform(raw[IDX.leftElbow]),
    rightElbow: transform(raw[IDX.rightElbow]),
    leftWrist: transform(raw[IDX.leftWrist]),
    rightWrist: transform(raw[IDX.rightWrist]),
    leftHip: transform(raw[IDX.leftHip]),
    rightHip: transform(raw[IDX.rightHip]),
    leftKnee: transform(raw[IDX.leftKnee]),
    rightKnee: transform(raw[IDX.rightKnee]),
    leftAnkle: transform(raw[IDX.leftAnkle]),
    rightAnkle: transform(raw[IDX.rightAnkle]),
    leftHeel: transform(raw[IDX.leftHeel]),
    rightHeel: transform(raw[IDX.rightHeel]),
    leftFootIndex: transform(raw[IDX.leftFootIndex]),
    rightFootIndex: transform(raw[IDX.rightFootIndex]),
  };
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
  const allIndices = Object.values(IDX);
  if (allIndices.some((i) => !raw[i])) return null;

  return buildFrameLandmarks(raw, (p) => ({ x: 1 - p.x, y: p.y, z: p.z, visibility: p.visibility }));
}

/**
 * Converte os "worldLandmarks" do MediaPipe — uma saída separada dos
 * landmarks normais, em coordenadas 3D de escala métrica (metros),
 * centradas aproximadamente no quadril. Usados só no modo de validação
 * (gravação bruta para reprocessamento futuro — ver
 * lib/validation/rawFrameDb.ts), nunca em nenhum cálculo do app hoje.
 *
 * Sem espelhamento: ao contrário de convertLandmarks (usado para exibir
 * overlay sobre um vídeo espelhado), os worldLandmarks não são
 * desenhados na tela — mantidos exatamente como o MediaPipe entrega,
 * para não inventar uma convenção de eixo que o próprio MediaPipe não
 * documenta como espelhável.
 */
export function convertWorldLandmarks(raw: RawLandmark[] | undefined): FrameLandmarks | null {
  if (!raw || raw.length < 33) return null;
  const allIndices = Object.values(IDX);
  if (allIndices.some((i) => !raw[i])) return null;

  return buildFrameLandmarks(raw, (p) => ({ x: p.x, y: p.y, z: p.z, visibility: p.visibility }));
}
