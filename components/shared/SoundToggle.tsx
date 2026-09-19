"use client";

export function SoundToggle({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={enabled ? "Desligar som" : "Ligar som"}
      className="absolute right-14 top-2 flex h-7 w-7 items-center justify-center rounded bg-black/40 text-sm text-white/80"
    >
      {enabled ? "🔊" : "🔇"}
    </button>
  );
}
