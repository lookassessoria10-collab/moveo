"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useValidationMode } from "@/lib/validation/useValidationMode";
import { useValidationRecordsStore } from "@/lib/validation/recordsStore";
import { downloadValidationCsv } from "@/lib/validation/csv";

/**
 * Card de exportação do modo de validação — só aparece com
 * ?modo=validacao na URL. Os registros ficam acumulados no aparelho
 * (ombro + joelho juntos, todas as sessões) até "Limpar dados".
 */
export function ValidationDataCard() {
  const validationMode = useValidationMode();
  const records = useValidationRecordsStore((s) => s.records);
  const clearRecords = useValidationRecordsStore((s) => s.clearRecords);
  const [confirmingClear, setConfirmingClear] = useState(false);

  if (!validationMode) return null;

  return (
    <Card className="mt-4 border-moveo-danger/30">
      <p className="mb-1 text-xs font-bold uppercase tracking-wide text-moveo-danger">Modo de validação</p>
      <p className="text-sm text-moveo-muted">
        {records.length} repetição(ões) acumulada(s) neste aparelho (ombro + joelho, todas as sessões).
      </p>
      <div className="mt-3 space-y-2">
        <Button variant="secondary" disabled={records.length === 0} onClick={() => downloadValidationCsv(records)}>
          BAIXAR TUDO (CSV)
        </Button>
        {confirmingClear ? (
          <div className="rounded-xl border border-moveo-danger/40 bg-moveo-danger/5 p-3">
            <p className="text-xs text-moveo-ink">
              Isso apaga os {records.length} registro(s) salvos neste aparelho. Já baixou o CSV?
            </p>
            <div className="mt-2 flex gap-2">
              <Button
                variant="danger"
                onClick={() => {
                  clearRecords();
                  setConfirmingClear(false);
                }}
              >
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
