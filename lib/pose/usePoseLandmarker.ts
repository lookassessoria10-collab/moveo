"use client";

import { useEffect, useRef, useState } from "react";
import { loadPoseLandmarker } from "./loadPoseLandmarker";
import { convertLandmarks } from "./convertLandmarks";
import { FrameLandmarks } from "../types";

export interface PoseLoopStats {
  fps: number;
  detected: boolean;
}

/**
 * Executa o loop de detecção de pose sobre um <video> ativo, usando
 * requestAnimationFrame. Chama `onFrame` a cada frame processado com os
 * landmarks já convertidos (ou null quando nenhum corpo é detectado).
 * Todo o processamento acontece localmente no navegador.
 */
export function usePoseLandmarker(
  videoRef: React.RefObject<HTMLVideoElement>,
  onFrame: (landmarks: FrameLandmarks | null, timestamp: number) => void,
  active: boolean
) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<PoseLoopStats>({ fps: 0, detected: false });
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;

  useEffect(() => {
    if (!active) return;
    let cancelled = false;
    let rafId = 0;
    let lastFrameCount = 0;
    let fpsWindowStart = performance.now();

    loadPoseLandmarker()
      .then((landmarker) => {
        if (cancelled) return;
        setReady(true);

        const loop = () => {
          const video = videoRef.current;
          if (!video || video.readyState < 2) {
            rafId = requestAnimationFrame(loop);
            return;
          }

          const nowMs = performance.now();
          try {
            const result = landmarker.detectForVideo(video, nowMs);
            const landmarks = convertLandmarks(
              result.landmarks?.[0] as { x: number; y: number; z?: number; visibility?: number }[] | undefined
            );
            onFrameRef.current(landmarks, nowMs);

            lastFrameCount++;
            if (nowMs - fpsWindowStart >= 1000) {
              setStats({ fps: lastFrameCount, detected: !!landmarks });
              lastFrameCount = 0;
              fpsWindowStart = nowMs;
            }
          } catch (e) {
            // frame ocasional pode falhar (ex: vídeo pausando) — não interrompe o loop
          }

          rafId = requestAnimationFrame(loop);
        };

        rafId = requestAnimationFrame(loop);
      })
      .catch((e) => {
        if (!cancelled) setError(e?.message ?? "Falha ao carregar detecção corporal.");
      });

    return () => {
      cancelled = true;
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [active, videoRef]);

  return { ready, error, stats };
}
