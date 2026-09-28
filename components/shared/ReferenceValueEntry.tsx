"use client";

import { useState } from "react";
import { Instrument } from "@/lib/validation/sessionStore";

/**
 * Painel exibido no lugar da barra de instrução normal enquanto o app
 * aguarda o examinador digitar o valor de referência (goniômetro ou
 * inclinômetro). Não mostra o ângulo calculado pelo app, de propósito —
 * evita que o examinador seja influenciado pelo número antes de medir.
 * Espera o tempo que for preciso: não há limite de tempo nem cancelamento
 * automático aqui.
 */
export function ReferenceValueEntry({
  instrument,
  onConfirm,
}: {
  instrument: Instrument;
  onConfirm: (value: number) => void;
}) {
  const [value, setValue] = useState("");
  const parsed = Number(value.replace(",", "."));
  const canConfirm = value.trim().length > 0 && Number.isFinite(parsed);
  const instrumentLabel = instrument === "goniometro" ? "goniômetro" : "inclinômetro";

  return (
    <div className="absolute inset-x-0 bottom-0 bg-white px-6 pb-8 pt-5 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-moveo-danger">
        Segure a posição — digite o valor do {instrumentLabel}
      </p>
      <input
        autoFocus
        inputMode="decimal"
        placeholder="graus"
        className="mt-3 w-full rounded-xl border border-moveo-border p-4 text-center text-3xl font-bold text-moveo-ink"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        type="button"
        disabled={!canConfirm}
        onClick={() => canConfirm && onConfirm(parsed)}
        className="mt-3 w-full rounded-2xl bg-moveo-primary px-6 py-4 text-base font-semibold text-white disabled:bg-moveo-border disabled:text-moveo-muted"
      >
        CONFIRMAR
      </button>
    </div>
  );
}
