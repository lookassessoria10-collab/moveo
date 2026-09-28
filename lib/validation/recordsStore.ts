"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { ValidationRecord } from "./types";

interface ValidationRecordsState {
  records: ValidationRecord[];
  addRecord: (r: ValidationRecord) => void;
  clearRecords: () => void;
}

/**
 * Registros acumulados do modo de validação — guardados no aparelho
 * (localStorage: sobrevive a fechar a aba ou o navegador) até alguém
 * apertar "Limpar dados". Compartilhado entre os módulos de ombro e
 * joelho, para que "Baixar tudo (CSV)" traga as duas regiões numa lista
 * só, mesmo testadas em sessões diferentes.
 */
export const useValidationRecordsStore = create<ValidationRecordsState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (r) => set((s) => ({ records: [...s.records, r] })),
      clearRecords: () => set({ records: [] }),
    }),
    {
      name: "uort:validationRecords",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
