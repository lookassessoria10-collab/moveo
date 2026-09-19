import { FilesetResolver, PoseLandmarker } from "@mediapipe/tasks-vision";

const WASM_BASE =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.17/wasm";
// "full" em vez de "lite": mais preciso para rastrear pernas e vistas de
// perfil (joelho e coluna), que a variante "lite" tratava com bastante
// ruído/erro de estimativa ("alucinação" de landmarks fora do quadro).
// Continua rodando em tempo real no dispositivo, só um pouco mais pesado
// que "lite".
const MODEL_URL =
  "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/1/pose_landmarker_full.task";

let cached: Promise<PoseLandmarker> | null = null;

/**
 * Carrega (uma única vez) o PoseLandmarker do MediaPipe Tasks Vision.
 * O modelo e o runtime wasm são baixados de CDNs públicas na primeira
 * execução e ficam em cache do navegador — nenhum vídeo ou imagem do
 * usuário é enviado para fora do dispositivo (ver README, seção Privacidade).
 */
export function loadPoseLandmarker(): Promise<PoseLandmarker> {
  if (!cached) {
    cached = FilesetResolver.forVisionTasks(WASM_BASE).then((fileset) =>
      PoseLandmarker.createFromOptions(fileset, {
        baseOptions: {
          modelAssetPath: MODEL_URL,
          delegate: "GPU",
        },
        runningMode: "VIDEO",
        numPoses: 1,
        minPoseDetectionConfidence: 0.5,
        minPosePresenceConfidence: 0.5,
        minTrackingConfidence: 0.5,
      })
    );
  }
  return cached;
}
