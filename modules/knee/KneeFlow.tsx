"use client";

import { useEffect, useRef } from "react";
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
import { ValidationBanner } from "@/components/shared/ValidationBanner";
import { ValidationSetupScreen } from "@/components/shared/ValidationSetupScreen";
import { useValidationMode } from "@/lib/validation/useValidationMode";

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
  const setScreen = useKneeStore((s) => s.setScreen);
  const reset = useKneeStore((s) => s.reset);
  const validationMode = useValidationMode();
  const redirectedToSetupRef = useRef(false);

  useEffect(() => {
    if (validationMode && screen === "symptomSide" && !redirectedToSetupRef.current) {
      redirectedToSetupRef.current = true;
      setScreen("validationSetup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationMode]);

  const content = (() => {
    if (screen === "validationSetup") {
      return <ValidationSetupScreen regionLabel="Joelho" onConfirm={() => setScreen("symptomSide")} />;
    }
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
  })();

  return (
    <>
      {validationMode && <ValidationBanner />}
      {content}
    </>
  );
}
