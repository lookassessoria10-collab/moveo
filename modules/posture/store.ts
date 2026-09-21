"use client";

import { create } from "zustand";
import { POSTURE_CONFIG } from "@/config/modules/posture";
import { generatePostureSummary } from "./resultRules";
import { buildDemoPostureResult } from "./demoData";
import { PostureAssessmentResult, PostureReading } from "./types";

export type PostureScreen =
  | "intro"
  | "camera"
  | "reposition"
  | "positioning"
  | "capture"
  | "processing"
  | "results";

interface PostureState {
  screen: PostureScreen;
  demoMode: boolean;
  debugMode: boolean;

  result: PostureAssessmentResult | null;

  setScreen: (s: PostureScreen) => void;
  setDemoMode: (v: boolean) => void;
  toggleDebugMode: () => void;

  buildResult: (reading: PostureReading) => void;
  loadDemoResult: () => void;
  reset: () => void;
}

export const usePostureStore = create<PostureState>((set) => ({
  screen: "intro",
  demoMode: false,
  debugMode: false,

  result: null,

  setScreen: (screen) => set({ screen }),
  setDemoMode: (v) => set({ demoMode: v }),
  toggleDebugMode: () => set((s) => ({ debugMode: !s.debugMode })),

  buildResult: (reading) => {
    const result: PostureAssessmentResult = {
      completedAt: Date.now(),
      reading,
      summary: generatePostureSummary(reading),
      tips: POSTURE_CONFIG.copy.ergonomicsTips,
      isDemo: false,
    };
    set({ result, screen: "results" });
  },

  loadDemoResult: () => {
    set({ demoMode: true, result: buildDemoPostureResult(), screen: "results" });
  },

  reset: () =>
    set({
      screen: "intro",
      result: null,
      demoMode: false,
    }),
}));
