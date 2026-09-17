"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { MovementBlockResult } from "@/lib/types";
import { APP_CONFIG } from "@/config/app";

export function SideComparisonChart({ blocks }: { blocks: MovementBlockResult[] }) {
  const data = ["flexion", "abduction"].map((movement) => {
    const right = blocks.find((b) => b.side === "right" && b.movement === movement);
    const left = blocks.find((b) => b.side === "left" && b.movement === movement);
    return {
      name: movement === "flexion" ? "Flexão" : "Abdução",
      Direito: right ? Math.round(right.averageMaxAngle) : 0,
      Esquerdo: left ? Math.round(left.averageMaxAngle) : 0,
    };
  });

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E8EF" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} unit="°" />
          <Tooltip />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="Direito" fill={APP_CONFIG.colors.right} radius={[6, 6, 0, 0]} />
          <Bar dataKey="Esquerdo" fill={APP_CONFIG.colors.left} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function RepetitionConsistencyChart({ block }: { block: MovementBlockResult }) {
  const data = block.attempts.map((a) => ({
    name: `Rep ${a.repetitionIndex}`,
    Ângulo: Math.round(a.maxAngle),
  }));
  const color = block.side === "right" ? APP_CONFIG.colors.right : APP_CONFIG.colors.left;

  return (
    <div className="h-40 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E8EF" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} unit="°" />
          <Tooltip />
          <Bar dataKey="Ângulo" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
