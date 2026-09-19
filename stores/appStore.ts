"use client";

import { create } from "zustand";

export type Region = "shoulder" | "knee" | "spine";

interface AppState {
  /** Última região visitada nesta sessão — usado apenas para pequenos atalhos de UI. */
  lastRegion: Region | null;
  setLastRegion: (region: Region) => void;
}

/**
 * Estado global mínimo da plataforma (fora dos módulos de avaliação).
 * Cada módulo (ombro, joelho, coluna) mantém sua própria store isolada
 * para nunca misturar dados entre regiões.
 */
export const useAppStore = create<AppState>((set) => ({
  lastRegion: null,
  setLastRegion: (region) => set({ lastRegion: region }),
}));
