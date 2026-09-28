"use client";

import { useEffect, useRef } from "react";
import { useAssessmentStore } from "@/stores/assessmentStore";
import { WelcomeScreen } from "@/components/screens/WelcomeScreen";
import { SymptomSideScreen } from "@/components/screens/SymptomSideScreen";
import { InitialPainScreen } from "@/components/screens/InitialPainScreen";
import { ProblemDurationScreen } from "@/components/screens/ProblemDurationScreen";
import { SafetyCheckScreen } from "@/components/screens/SafetyCheckScreen";
import { SafetyBlockedScreen } from "@/components/screens/SafetyBlockedScreen";
import { PreparationScreen } from "@/components/screens/PreparationScreen";
import { ProcessingScreen } from "@/components/screens/ProcessingScreen";
import { ResultsScreen } from "@/components/screens/ResultsScreen";
import { TechnicalReportScreen } from "@/components/screens/TechnicalReportScreen";
import { DoctorReportScreen } from "@/components/screens/DoctorReportScreen";
import { CameraFlow } from "@/components/CameraFlow";
import { ValidationBanner } from "@/components/shared/ValidationBanner";
import { ValidationSetupScreen } from "@/components/shared/ValidationSetupScreen";
import { useValidationMode } from "@/lib/validation/useValidationMode";

const CAMERA_SCREENS = new Set(["camera", "positioning", "calibration", "test", "painQuestion"]);

/**
 * Controlador central do fluxo de avaliação. Mantido como um único
 * componente client-side (em vez de várias rotas do Next.js) para que a
 * câmera e a detecção de pose permaneçam ativas entre as etapas de
 * posicionamento, calibração e teste, sem reinicializar o stream de vídeo.
 */
export function AssessmentFlow() {
  const screen = useAssessmentStore((s) => s.screen);
  const setScreen = useAssessmentStore((s) => s.setScreen);
  const validationMode = useValidationMode();
  const redirectedToSetupRef = useRef(false);

  useEffect(() => {
    if (validationMode && screen === "welcome" && !redirectedToSetupRef.current) {
      redirectedToSetupRef.current = true;
      setScreen("validationSetup");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationMode]);

  const content = (() => {
    if (screen === "validationSetup") {
      return <ValidationSetupScreen regionLabel="Ombro" onConfirm={() => setScreen("welcome")} />;
    }
    if (CAMERA_SCREENS.has(screen)) return <CameraFlow />;

    switch (screen) {
      case "welcome":
        return <WelcomeScreen />;
      case "symptomSide":
        return <SymptomSideScreen />;
      case "initialPain":
        return <InitialPainScreen />;
      case "problemDuration":
        return <ProblemDurationScreen />;
      case "safetyCheck":
        return <SafetyCheckScreen />;
      case "safetyBlocked":
        return <SafetyBlockedScreen />;
      case "preparation":
        return <PreparationScreen />;
      case "processing":
        return <ProcessingScreen />;
      case "results":
        return <ResultsScreen />;
      case "technicalReport":
        return <TechnicalReportScreen />;
      case "doctorReport":
        return <DoctorReportScreen />;
      default:
        return <WelcomeScreen />;
    }
  })();

  return (
    <>
      {validationMode && <ValidationBanner />}
      {content}
    </>
  );
}
