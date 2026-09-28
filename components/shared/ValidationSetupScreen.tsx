"use client";

import { useState } from "react";
import { ScreenShell } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useValidationSession, Instrument } from "@/lib/validation/sessionStore";

/**
 * Tela extra exibida só no modo de validação, antes do fluxo normal da
 * região — pede os códigos (nunca nome) do voluntário/examinador e o
 * instrumento usado. Reaproveitada pelos módulos de ombro e joelho.
 */
export function ValidationSetupScreen({
  regionLabel,
  onConfirm,
}: {
  regionLabel: string;
  onConfirm: () => void;
}) {
  const { volunteerCode, examinerCode, instrument, setCodes, newVolunteer } = useValidationSession();
  const [localVolunteer, setLocalVolunteer] = useState(volunteerCode);
  const [localExaminer, setLocalExaminer] = useState(examinerCode);
  const [localInstrument, setLocalInstrument] = useState<Instrument>(instrument);

  const canConfirm = localVolunteer.trim().length > 0;

  return (
    <ScreenShell className="justify-between">
      <div>
        <div className="mb-4 rounded-xl bg-moveo-danger/10 px-4 py-2 text-center text-xs font-bold uppercase tracking-wide text-moveo-danger">
          Modo de validação
        </div>
        <h1 className="text-2xl font-bold text-moveo-ink">{regionLabel} — dados da coleta</h1>
        <p className="mt-2 text-sm text-moveo-muted">
          Nenhum nome ou dado pessoal — só códigos, para comparar resultados depois.
        </p>

        <label className="mt-6 block text-sm font-semibold text-moveo-ink">
          Código do voluntário
          <input
            className="mt-1 w-full rounded-xl border border-moveo-border p-3 text-base"
            placeholder="ex.: V01"
            value={localVolunteer}
            onChange={(e) => setLocalVolunteer(e.target.value)}
          />
        </label>

        <label className="mt-4 block text-sm font-semibold text-moveo-ink">
          Código do examinador (opcional)
          <input
            className="mt-1 w-full rounded-xl border border-moveo-border p-3 text-base"
            placeholder="ex.: EX1"
            value={localExaminer}
            onChange={(e) => setLocalExaminer(e.target.value)}
          />
        </label>

        <p className="mt-4 text-sm font-semibold text-moveo-ink">Instrumento usado</p>
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            onClick={() => setLocalInstrument("goniometro")}
            className={`flex-1 rounded-xl border p-3 text-sm font-semibold ${
              localInstrument === "goniometro"
                ? "border-moveo-primary bg-moveo-primarySoft text-moveo-primary"
                : "border-moveo-border text-moveo-muted"
            }`}
          >
            Goniômetro
          </button>
          <button
            type="button"
            onClick={() => setLocalInstrument("inclinometro")}
            className={`flex-1 rounded-xl border p-3 text-sm font-semibold ${
              localInstrument === "inclinometro"
                ? "border-moveo-primary bg-moveo-primarySoft text-moveo-primary"
                : "border-moveo-border text-moveo-muted"
            }`}
          >
            Inclinômetro
          </button>
        </div>

        <button
          type="button"
          className="mt-4 text-xs font-semibold text-moveo-danger underline"
          onClick={() => {
            newVolunteer();
            setLocalVolunteer("");
            setLocalExaminer("");
          }}
        >
          Novo voluntário (limpa os códigos)
        </button>
      </div>

      <Button
        className="mt-8"
        disabled={!canConfirm}
        onClick={() => {
          setCodes({
            volunteerCode: localVolunteer.trim(),
            examinerCode: localExaminer.trim(),
            instrument: localInstrument,
          });
          onConfirm();
        }}
      >
        CONFIRMAR
      </Button>
    </ScreenShell>
  );
}
