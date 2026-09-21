import { POSTURE_CONFIG } from "@/config/modules/posture";
import { generatePostureSummary } from "./resultRules";
import { PostureAssessmentResult, PostureReading } from "./types";

export function buildDemoPostureResult(): PostureAssessmentResult {
  const reading: PostureReading = {
    trunkTiltDeg: 9.4,
    neckTiltDeg: 18.6,
    trunkTiltStdDev: 2.1,
    neckTiltStdDev: 2.8,
    capturedAt: Date.now(),
  };

  return {
    completedAt: Date.now(),
    reading,
    summary: generatePostureSummary(reading),
    tips: POSTURE_CONFIG.copy.ergonomicsTips,
    isDemo: true,
  };
}
