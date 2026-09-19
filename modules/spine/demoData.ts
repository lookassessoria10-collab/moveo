import { generateSpineSummary } from "./resultRules";
import { SpineAssessmentResult, SpineAttempt, SpineTestResult } from "./types";

function fakeAttempts(
  test: SpineAttempt["test"],
  angles: number[],
  hipComp: number[],
  durationsMs: number[]
): SpineAttempt[] {
  return angles.map((maxAngle, i) => {
    const start = Date.now() + i * 4000;
    const duration = durationsMs[i];
    return {
      test,
      repetitionIndex: i + 1,
      frames: [],
      maxAngle,
      startTimestamp: start,
      peakTimestamp: start + duration,
      endTimestamp: start + duration + 1000,
      duration,
      averageAngularVelocity: maxAngle / (duration / 1000),
      hipCompensation: hipComp[i],
    };
  });
}

function summarize(attempts: SpineAttempt[]) {
  const angles = attempts.map((a) => a.maxAngle);
  return {
    averageMaxAngle: angles.reduce((a, b) => a + b, 0) / angles.length,
    bestMaxAngle: Math.max(...angles),
  };
}

export function buildDemoSpineResult(): SpineAssessmentResult {
  const flexionAttempts = fakeAttempts("flexion", [64, 62, 60], [2, 2, 3], [2400, 2500, 2600]);
  const rightAttempts = fakeAttempts("lateralRight", [33, 31, 30], [1, 2, 2], [1800, 1900, 1900]);
  const leftAttempts = fakeAttempts("lateralLeft", [24, 23, 22], [1, 1, 2], [1800, 1800, 1900]);
  const extensionAttempts = fakeAttempts("extension", [19, 18, 18], [1, 1, 1], [1600, 1600, 1700]);

  const results: SpineTestResult[] = [
    {
      test: "flexion",
      attempts: flexionAttempts,
      ...summarize(flexionAttempts),
      consistency: { stdDev: 2.0, relativeStdDevPct: 3.2, label: "alta", declined: false },
      pain: { hadPain: false },
    },
    {
      test: "lateralRight",
      attempts: rightAttempts,
      ...summarize(rightAttempts),
      consistency: { stdDev: 1.5, relativeStdDevPct: 4.8, label: "alta", declined: false },
      pain: { hadPain: false },
    },
    {
      test: "lateralLeft",
      attempts: leftAttempts,
      ...summarize(leftAttempts),
      consistency: { stdDev: 1.0, relativeStdDevPct: 4.3, label: "alta", declined: false },
      pain: { hadPain: true, intensity: 2, moment: "near_limit" },
    },
    {
      test: "extension",
      attempts: extensionAttempts,
      ...summarize(extensionAttempts),
      consistency: { stdDev: 0.6, relativeStdDevPct: 3.3, label: "alta", declined: false },
      pain: { hadPain: false },
    },
  ];

  const right = results.find((r) => r.test === "lateralRight")!;
  const left = results.find((r) => r.test === "lateralLeft")!;
  const lateralDifference = Math.abs(right.averageMaxAngle - left.averageMaxAngle);
  const staticPosture = { shoulderTiltDeg: 2.8, hipTiltDeg: 1.1, headTiltDeg: 1.4 };

  return {
    completedAt: Date.now(),
    intake: { painArea: "lowerBack", initialPain: 3, problemDuration: "months" },
    results,
    lateralDifference,
    staticPosture,
    summary: generateSpineSummary(results, lateralDifference, staticPosture),
    isDemo: true,
  };
}
