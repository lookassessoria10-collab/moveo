"use client";

export interface Option<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

export function OptionList<T extends string>({
  options,
  selected,
  onSelect,
}: {
  options: Option<T>[];
  selected?: T | null;
  onSelect: (v: T) => void;
}) {
  return (
    <div className="space-y-3">
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => onSelect(opt.value)}
            className={`w-full rounded-2xl border px-5 py-4 text-left transition-colors ${
              isSelected
                ? "border-moveo-primary bg-moveo-primarySoft"
                : "border-moveo-border bg-white active:bg-moveo-bg"
            }`}
          >
            <div className={`text-base font-semibold ${isSelected ? "text-moveo-primary" : "text-moveo-ink"}`}>
              {opt.label}
            </div>
            {opt.hint && <div className="mt-0.5 text-sm text-moveo-muted">{opt.hint}</div>}
          </button>
        );
      })}
    </div>
  );
}
