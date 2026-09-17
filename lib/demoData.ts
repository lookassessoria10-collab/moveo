import { AssessmentResult, Movement, MovementAttempt, MovementBlockResult, Side } from "./types";
import { calculateSideDifference, calculateMovementIndex, summarizeAttempts } from "./movementMetrics";
import { generateSummary } from "./resultRules";

/**
 * Gera um resultado fictício, usado apenas no Modo Demonstração (quando não
 * há câmera disponível, ex.: em desktop sem webcam). Nunca é misturado com
 * dados reais — a tela de resultados sinaliza claramente quando está em
 * modo demonstração.
 */
function fakeAttempts(
  side: Side,
  movement: Movement,
  angles: number[],
  trunkComp: number[],
  durationsMs: number[]
): MovementAttempt[] {
  return angles.map((maxAngle, i) => {
    const start = Date.now() + i * 4000;
    const duration = durationsMs[i];
    return {
      side,
      movement,
      repetitionIndex: i + 1,
      frames: [],
      maxAngle,
      startTimestamp: start,
      peakTimestamp: start + duration,
      endTimestamp: start + duration + 1200,
      duration,
      averageAngularVelocity: maxAngle / (duration / 1000),
      maxTrunkCompensation: trunkComp[i],
      angleBeforeCompensation: trunkComp[i] > 8 ? maxAngle - 15 - i * 3 : null,
    };
  });
}

export function buildDemoResult(): AssessmentResult {
  const blocksData: { side: Side; movement: Movement; angles: number[]; trunk: number[]; dur: number[]; pain: number }[] = [
    { side: "right", movement: "flexion", angles: [126, 123, 120], trunk: [9, 11, 13], dur: [2600, 2800, 3000], pain: 6 },
    { side: "left", movement: "flexion", angles: [170, 168, 166], trunk: [3, 3, 4], dur: [1900, 2000, 1950], pain: 1 },
    { side: "right", movement: "abduction", angles: [114, 111, 108], trunk: [10, 12, 15], dur: [2400, 2500, 2700], pain: 5 },
    { side: "left", movement: "abduction", angles: [166, 164, 163], trunk: [2, 3, 3], dur: [2000, 1950, 2000], pain: 1 },
  ];

  const blocks: MovementBlockResult[] = blocksData.map((b) => {
    const attempts = fakeAttempts(b.side, b.movement, b.angles, b.trunk, b.dur);
    const summary = summarizeAttempts(attempts);
    return {
      side: b.side,
      movement: b.movement,
      pain: { hadPain: b.pain > 0, intensity: b.pain, moment: "near_limit" },
      ...summary,
    };
  });

  const bySideMovement = (side: Side, movement: Movement) =>
    blocks.find((bl) => bl.side === side && bl.movement === movement)?.averageMaxAngle ?? null;

  const angleBeforeCompByBlock = (side: Side, movement: Movement) => {
    const block = blocks.find((bl) => bl.side === side && bl.movement === movement);
    if (!block) return null;
    const values = block.attempts
      .map((a) => a.angleBeforeCompensation)
      .filter((v): v is number => v !== null);
    if (values.length === 0) return null;
    return values.reduce((a, b) => a + b, 0) / values.length;
  };

  const comparison = {
    flexionMaxAngle: calculateSideDifference(bySideMovement("right", "flexion"), bySideMovement("left", "flexion")),
    abductionMaxAngle: calculateSideDifference(bySideMovement("right", "abduction"), bySideMovement("left", "abduction")),
    angleBeforeCompensationFlexion: calculateSideDifference(
      angleBeforeCompByBlock("right", "flexion"),
      angleBeforeCompByBlock("left", "flexion")
    ),
    angleBeforeCompensationAbduction: calculateSideDifference(
      angleBeforeCompByBlock("right", "abduction"),
      angleBeforeCompByBlock("left", "abduction")
    ),
  };

  return {
    completedAt: Date.now(),
    intake: { symptomSide: "right", initialPain: 6, problemDuration: "weeks" },
    blocks,
    comparison,
    movementIndex: calculateMovementIndex(blocks),
    summary: generateSummary(blocks, comparison),
    isDemo: true,
  };
}
