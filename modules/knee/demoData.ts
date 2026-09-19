import { calculateSideDifference } from "@/lib/movementMetrics";
import { generateKneeSummary } from "./resultRules";
import { KneeAssessmentResult, KneeAttempt, KneeTestResult } from "./types";

/**
 * Resultado fictício usado apenas no Modo Demonstração do módulo de joelho
 * (quando a câmera não está disponível). Nunca é misturado com dados reais.
 */
function fakeAttempts(
  test: KneeAttempt["test"],
  side: KneeAttempt["side"],
  angles: number[],
  trunkComp: number[],
  durationsMs: number[]
): KneeAttempt[] {
  return angles.map((maxAngle, i) => {
    const start = Date.now() + i * 4000;
    const duration = durationsMs[i];
    return {
      test,
      side,
      repetitionIndex: i + 1,
      frames: [],
      maxAngle,
      startTimestamp: start,
      peakTimestamp: start + duration,
      endTimestamp: start + duration + 1000,
      duration,
      averageAngularVelocity: maxAngle / (duration / 1000),
      maxTrunkCompensation: trunkComp[i],
      handsUsed: test === "sitToStand" ? i === 0 : undefined,
    };
  });
}

function summarize(attempts: KneeAttempt[]) {
  const angles = attempts.map((a) => a.maxAngle);
  const avg = angles.reduce((a, b) => a + b, 0) / angles.length;
  return { averageMaxAngle: avg, bestMaxAngle: Math.max(...angles) };
}

export function buildDemoKneeResult(): KneeAssessmentResult {
  const rightAttempts = fakeAttempts("flexion", "right", [118, 121, 116], [3, 4, 5], [2200, 2400, 2300]);
  const leftAttempts = fakeAttempts("flexion", "left", [132, 130, 129], [2, 3, 2], [2000, 2100, 2000]);

  const flexionResults: KneeTestResult[] = [
    {
      test: "flexion",
      side: "right",
      attempts: rightAttempts,
      ...summarize(rightAttempts),
      consistency: { stdDev: 2.1, relativeStdDevPct: 1.8, label: "alta", declined: false },
      pain: { hadPain: true, intensity: 4, moment: "near_limit" },
    },
    {
      test: "flexion",
      side: "left",
      attempts: leftAttempts,
      ...summarize(leftAttempts),
      consistency: { stdDev: 1.5, relativeStdDevPct: 1.1, label: "alta", declined: false },
      pain: { hadPain: false },
    },
  ];

  const squatAttempts = fakeAttempts("squat", "both", [72, 68, 61], [7, 9, 12], [2600, 2700, 2900]);
  const squatResult: KneeTestResult = {
    test: "squat",
    side: "both",
    attempts: squatAttempts,
    ...summarize(squatAttempts),
    consistency: { stdDev: 5.6, relativeStdDevPct: 8.2, label: "moderada", declined: true },
    pain: { hadPain: true, intensity: 3, moment: "bottom" },
    kneeAsymmetryDeg: 9,
    maxHipLateralShift: 0.04,
  };

  const sitStandAttempts = fakeAttempts("sitToStand", "both", [95, 93, 90], [4, 5, 6], [1800, 1900, 2000]);
  const sitToStandResult: KneeTestResult = {
    test: "sitToStand",
    side: "both",
    attempts: sitStandAttempts,
    ...summarize(sitStandAttempts),
    consistency: { stdDev: 2.5, relativeStdDevPct: 2.7, label: "alta", declined: false },
    pain: { hadPain: false },
  };

  const flexionComparison = calculateSideDifference(
    flexionResults[0].averageMaxAngle,
    flexionResults[1].averageMaxAngle
  );

  return {
    completedAt: Date.now(),
    intake: { symptomSide: "right", initialPain: 4, problemDuration: "weeks" },
    flexionResults,
    squatResult,
    sitToStandResult,
    flexionComparison,
    summary: generateKneeSummary(flexionResults, flexionComparison, squatResult, sitToStandResult),
    isDemo: true,
  };
}
