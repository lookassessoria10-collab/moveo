import { APP_CONFIG } from "@/config/app";
import { AssessmentComparison, Movement, MovementBlockResult, Side } from "./types";

const movementLabel: Record<Movement, string> = {
  flexion: "flexão",
  abduction: "elevação lateral",
};

function findBlock(
  blocks: MovementBlockResult[],
  side: Side,
  movement: Movement
): MovementBlockResult | undefined {
  return blocks.find((b) => b.side === side && b.movement === movement);
}

/**
 * Gera um resumo textual determinístico (baseado em regras, sem IA
 * generativa) descrevendo apenas o que foi observado no teste — nunca um
 * diagnóstico. Cada frase é construída a partir de comparações objetivas.
 */
export function generateSummary(
  blocks: MovementBlockResult[],
  comparison: AssessmentComparison
): string[] {
  const sentences: string[] = [];
  const { notablePct } = APP_CONFIG.thresholds.sideDifference;

  const notableDiffs: { movement: Movement; weakerSide: Side; diffPct: number }[] = [];

  for (const movement of ["flexion", "abduction"] as Movement[]) {
    const metric =
      movement === "flexion" ? comparison.flexionMaxAngle : comparison.abductionMaxAngle;
    if (
      metric.right !== null &&
      metric.left !== null &&
      metric.percentageDifference !== null &&
      metric.percentageDifference >= notablePct
    ) {
      const weakerSide: Side = metric.right < metric.left ? "right" : "left";
      notableDiffs.push({ movement, weakerSide, diffPct: metric.percentageDifference });
    }
  }

  if (notableDiffs.length === 0) {
    sentences.push(
      "Durante o teste, a amplitude observada entre os lados direito e esquerdo foi semelhante nos movimentos avaliados."
    );
  } else {
    const sideWord: Record<Side, string> = { right: "direito", left: "esquerdo" };
    const movementsAffected = notableDiffs.map((d) => movementLabel[d.movement]);
    const weakerSide = notableDiffs[0].weakerSide;
    sentences.push(
      `Durante o teste, observamos menor amplitude do ombro ${sideWord[weakerSide]} ${
        movementsAffected.length > 1 ? `nos movimentos de ${movementsAffected.join(" e ")}` : `no movimento de ${movementsAffected[0]}`
      }.`
    );

    if (notableDiffs.length > 1) {
      const mostEvident = [...notableDiffs].sort((a, b) => b.diffPct - a.diffPct)[0];
      sentences.push(
        `A diferença foi mais evidente durante a ${movementLabel[mostEvident.movement]}.`
      );
    }
  }

  // compensação do tronco
  const compensationBySide: Record<Side, number> = { right: 0, left: 0 };
  for (const block of blocks) {
    const maxComp = Math.max(0, ...block.attempts.map((a) => a.maxTrunkCompensation));
    compensationBySide[block.side] = Math.max(compensationBySide[block.side], maxComp);
  }
  if (Math.abs(compensationBySide.right - compensationBySide.left) > 4) {
    const side = compensationBySide.right > compensationBySide.left ? "direito" : "esquerdo";
    sentences.push(`Também foi observada maior inclinação do tronco no lado ${side}.`);
  }

  // dor relatada mais alta
  const painEntries = blocks
    .filter((b) => b.pain.hadPain && typeof b.pain.intensity === "number")
    .map((b) => ({ side: b.side, movement: b.movement, intensity: b.pain.intensity as number }));
  if (painEntries.length > 0) {
    const worst = [...painEntries].sort((a, b) => b.intensity - a.intensity)[0];
    const sideWord: Record<Side, string> = { right: "direito", left: "esquerdo" };
    sentences.push(
      `Você relatou dor ${worst.intensity}/10 durante o movimento de ${movementLabel[worst.movement]} do lado ${sideWord[worst.side]}.`
    );
  }

  // consistência entre repetições
  const declinedBlocks = blocks.filter((b) => b.consistency.declined);
  for (const block of declinedBlocks) {
    const sideWord: Record<Side, string> = { right: "direito", left: "esquerdo" };
    sentences.push(
      `Houve redução do movimento entre a primeira e a última repetição de ${movementLabel[block.movement]} do lado ${sideWord[block.side]}.`
    );
  }

  sentences.push(
    "Esses resultados descrevem somente o movimento observado durante o teste."
  );

  return sentences;
}
