"use client";

import { useKneeStore } from "./store";
import { SymptomSideScreen } from "./components/screens/SymptomSideScreen";
import { InitialPainScreen } from "./components/screens/InitialPainScreen";
import { ProblemDurationScreen } from "./components/screens/ProblemDurationScreen";
import { SafetyCheckScreen } from "./components/screens/SafetyCheckScreen";
import { PreparationScreen } from "./components/screens/PreparationScreen";
import { ResultsScreen } from "./components/screens/ResultsScreen";
import { TechnicalReportScreen } from "./components/screens/TechnicalReportScreen";
import { KneeCameraFlow } from "./components/KneeCameraFlow";
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
 * Controlador do módulo de Joelho — segue exatamente o mesmo padrão do
 * AssessmentFlow (ombro), com sua própria store isolada (useKneeStore).
 */
export function KneeFlow() {
  const screen = useKneeStore((s) => s.screen);
  const reset = useKneeStore((s) => s.reset);

  if (CAMERA_SCREENS.has(screen)) return <KneeCameraFlow />;

  switch (screen) {
    case "symptomSide":
      return <SymptomSideScreen />;
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
      return <SymptomSideScreen />;
  }
}
