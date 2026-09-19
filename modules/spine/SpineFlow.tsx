"use client";

import { useSpineStore } from "./store";
import { IntakeAreaScreen } from "./components/screens/IntakeAreaScreen";
import { InitialPainScreen } from "./components/screens/InitialPainScreen";
import { ProblemDurationScreen } from "./components/screens/ProblemDurationScreen";
import { SafetyCheckScreen } from "./components/screens/SafetyCheckScreen";
import { PreparationScreen } from "./components/screens/PreparationScreen";
import { ResultsScreen } from "./components/screens/ResultsScreen";
import { TechnicalReportScreen } from "./components/screens/TechnicalReportScreen";
import { SpineCameraFlow } from "./components/SpineCameraFlow";
import { SafetyBlockedScreen } from "@/components/shared/SafetyBlockedScreen";
import { ProcessingScreen } from "@/components/shared/ProcessingScreen";

const CAMERA_SCREENS = new Set([
  "camera",
  "reposition",
  "positioning",
  "calibration",
  "test",
  "painQuestion",
]);

/**
 * Controlador do módulo de Coluna — mesmo padrão do ombro e do joelho,
 * com sua própria store isolada (useSpineStore).
 */
export function SpineFlow() {
  const screen = useSpineStore((s) => s.screen);
  const reset = useSpineStore((s) => s.reset);

  if (CAMERA_SCREENS.has(screen)) return <SpineCameraFlow />;

  switch (screen) {
    case "intakeArea":
      return <IntakeAreaScreen />;
    case "initialPain":
      return <InitialPainScreen />;
    case "problemDuration":
      return <ProblemDurationScreen />;
    case "safetyCheck":
      return <SafetyCheckScreen />;
    case "safetyBlocked":
      return <SafetyBlockedScreen onReset={reset} />;
    case "preparation":
      return <PreparationScreen />;
    case "processing":
      return <ProcessingScreen />;
    case "results":
      return <ResultsScreen />;
    case "technicalReport":
      return <TechnicalReportScreen />;
    default:
      return <IntakeAreaScreen />;
  }
}
