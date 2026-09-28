"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Instrument = "goniometro" | "inclinometro";

interface ValidationSessionState {
  volunteerCode: string;
  examinerCode: string;
  instrument: Instrument;
  setCodes: (
    patch: Partial<{ volunteerCode: string; examinerCode: string; instrument: Instrument }>
  ) => void;
  /** Limpa os códigos para começar a medir uma pessoa nova — não apaga os registros já salvos. */
  newVolunteer: () => void;
}

/**
 * Códigos do voluntário/examinador do modo de validação — lembrados
 * durante a sessão do navegador (sessionStorage: sobrevive a atualizar a
 * página, mas some ao fechar a aba). Nunca guarda nome nem qualquer dado
 * que identifique a pessoa, só os códigos digitados manualmente (ex.:
 * "V01", "EX1"). Compartilhado entre os módulos de ombro e joelho, para
 * não precisar redigitar ao trocar de região na mesma sessão.
 */
export const useValidationSession = create<ValidationSessionState>()(
  persist(
    (set) => ({
      volunteerCode: "",
      examinerCode: "",
      instrument: "goniometro",
      setCodes: (patch) => set(patch),
      newVolunteer: () => set({ volunteerCode: "", examinerCode: "" }),
    }),
    {
      name: "uort:validationSession",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
