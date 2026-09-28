"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useValidationMode } from "@/lib/validation/useValidationMode";
import { useValidationRecordsStore } from "@/lib/validation/recordsStore";
import { downloadValidationCsv } from "@/lib/validation/csv";
import { countRawFrameRecords, downloadRawFrameRecords, clearRawFrameRecords } from "@/lib/validation/rawFrameDb";

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Card de exportação do modo de validação — só aparece com
 * ?modo=validacao na URL. Dois arquivos ficam acumulados no aparelho
 * (ombro + joelho juntos, todas as sessões) até "Limpar dados": o CSV
 * (uma linha por repetição) e um JSON com os pontos brutos quadro a
 * quadro (ver lib/validation/rawFrameDb.ts), para reprocessar depois com
 * qualquer versão do algoritmo.
 */
export function ValidationDataCard() {
  const validationMode = useValidationMode();
  const records = useValidationRecordsStore((s) => s.records);
  const clearRecords = useValidationRecordsStore((s) => s.clearRecords);
  const [confirmingClear, setConfirmingClear] = useState(false);
  const [rawCount, setRawCount] = useState<number | null>(null);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!validationMode) return;
    countRawFrameRecords()
      .then(setRawCount)
      .catch(() => setRawCount(null));
  }, [validationMode, records.length]);

  if (!validationMode) return null;

  const handleDownloadAll = async () => {
    setDownloading(true);
    try {
      downloadValidationCsv(records);
      // pequena pausa entre os dois downloads — alguns navegadores
      // bloqueiam dois arquivos baixados no mesmíssimo instante.
      await wait(300);
      await downloadRawFrameRecords();
    } finally {
      setDownloading(false);
    }
  };

  const handleClear = async () => {
    clearRecords();
    await clearRawFrameRecords().catch(() => {});
    setRawCount(0);
    setConfirmingClear(false);
  };

  return (
    <Card className="mt-4 border-moveo-danger/30">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-moveo-danger">Modo de validação</p>
      <p className="text-sm text-moveo-muted">
        {records.length} repetição(ões) acumulada(s) neste aparelho (ombro + joelho, todas as sessões).
      </p>
      <p className="text-xs text-moveo-muted">
        {rawCount === null ? "…" : rawCount} sequência(s) de pontos brutos guardada(s) para reprocessamento.
      </p>
      <div className="mt-3 space-y-2">
        <Button
          variant="secondary"
          disabled={records.length === 0 || downloading}
          onClick={handleDownloadAll}
        >
          {downloading ? "BAIXANDO..." : "BAIXAR TUDO (CSV + JSON)"}
        </Button>
        {confirmingClear ? (
          <div className="rounded-xl border border-moveo-danger/40 bg-moveo-danger/5 p-3">
            <p className="text-xs text-moveo-ink">
              Isso apaga os {records.length} registro(s) do CSV e as {rawCount ?? 0} sequência(s) de pontos
              brutos salvos neste aparelho. Já baixou os dois arquivos?
            </p>
            <div className="mt-2 flex gap-2">
              <Button variant="danger" onClick={handleClear}>
                SIM, LIMPAR
              </Button>
              <Button variant="ghost" onClick={() => setConfirmingClear(false)}>
                CANCELAR
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="ghost" disabled={records.length === 0} onClick={() => setConfirmingClear(true)}>
            LIMPAR DADOS
          </Button>
        )}
      </div>
    </Card>
  );
}
