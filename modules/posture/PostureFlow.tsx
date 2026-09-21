"use client";

import { usePostureStore } from "./store";
import { IntroScreen } from "./components/screens/IntroScreen";
import { ResultsScreen } from "./components/screens/ResultsScreen";
import { PostureCameraFlow } from "./components/PostureCameraFlow";
import { ProcessingScreen } from "@/components/shared/ProcessingScreen";

const CAMERA_SCREENS = new Set(["camera", "reposition", "positioning", "capture"]);

const PROCESSING_STEPS = [
  "Organizando as medições...",
  "Calculando ângulos...",
  "Preparando seu resultado...",
];

/**
 * Controlador do módulo de Postura sentada — mesmo padrão do ombro, joelho
 * e coluna, com sua própria store isolada (usePostureStore). Mais simples
 * que os demais: uma única captura, sem repetições nem perguntas de dor.
 */
export function PostureFlow() {
  const screen = usePostureStore((s) => s.screen);

  if (CAMERA_SCREENS.has(screen)) return <PostureCameraFlow />;

  switch (screen) {
    case "intro":
      return <IntroScreen />;
    case "processing":
      return <ProcessingScreen steps={PROCESSING_STEPS} />;
    case "results":
      return <ResultsScreen />;
    default:
      return <IntroScreen />;
  }
}
