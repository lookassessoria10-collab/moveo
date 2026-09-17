"use client";

export function PainScale({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between">
        <span className="text-sm text-moveo-muted">0 · Sem dor</span>
        <span className="text-3xl font-bold text-moveo-primary">{value}</span>
        <span className="text-sm text-moveo-muted">10 · Dor muito intensa</span>
      </div>
      <input
        type="range"
        min={0}
        max={10}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-moveo-primary"
        style={{ height: 40 }}
        aria-label="Nível de dor"
      />
      <div className="mt-1 flex justify-between text-xs text-moveo-muted">
        {Array.from({ length: 11 }).map((_, i) => (
          <span key={i}>{i}</span>
        ))}
      </div>
    </div>
  );
}
