import { MovementBlockResult } from "@/lib/types";

function fmt(v: number | undefined) {
  return v !== undefined ? `${Math.round(v)}°` : "—";
}

export function BodyMap({ blocks }: { blocks: MovementBlockResult[] }) {
  const get = (side: "right" | "left", movement: "flexion" | "abduction") =>
    blocks.find((b) => b.side === side && b.movement === movement)?.averageMaxAngle;

  return (
    <div className="relative mx-auto w-full max-w-[220px]">
      <svg viewBox="0 0 200 260" className="w-full">
        <ellipse cx="100" cy="35" rx="22" ry="24" fill="#E5E8EF" />
        <path d="M 65 65 Q 100 55 135 65 L 145 165 Q 100 180 55 165 Z" fill="#E5E8EF" />
        <path d="M 65 70 L 30 150 L 40 160 L 72 90 Z" fill="#EAF0FF" />
        <path d="M 135 70 L 170 150 L 160 160 L 128 90 Z" fill="#EAF0FF" />
        <rect x="70" y="175" width="25" height="80" fill="#E5E8EF" rx="8" />
        <rect x="105" y="175" width="25" height="80" fill="#E5E8EF" rx="8" />
      </svg>

      <div className="absolute left-[-8px] top-[60px] rounded-lg bg-moveo-right/10 px-2 py-1 text-[11px] font-medium text-moveo-right">
        <div className="font-bold">Direito</div>
        <div>Flexão {fmt(get("right", "flexion"))}</div>
        <div>Abdução {fmt(get("right", "abduction"))}</div>
      </div>
      <div className="absolute right-[-8px] top-[60px] rounded-lg bg-moveo-left/10 px-2 py-1 text-right text-[11px] font-medium text-moveo-left">
        <div className="font-bold">Esquerdo</div>
        <div>Flexão {fmt(get("left", "flexion"))}</div>
        <div>Abdução {fmt(get("left", "abduction"))}</div>
      </div>
    </div>
  );
}
