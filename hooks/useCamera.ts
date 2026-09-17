"use client";

import { useEffect, useRef, useState } from "react";

export type CameraStatus = "idle" | "requesting" | "ready" | "denied" | "unavailable" | "error";

/**
 * Solicita a câmera frontal do dispositivo via getUserMedia e conecta o
 * stream a um elemento <video>. Nenhum frame é gravado ou enviado — o
 * stream é consumido apenas localmente para a detecção de pose.
 */
export function useCamera(videoRef: React.RefObject<HTMLVideoElement>) {
  const [status, setStatus] = useState<CameraStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const start = async () => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setStatus("unavailable");
      return;
    }
    setStatus("requesting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 720 },
          height: { ideal: 1280 },
        },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }
      setStatus("ready");
    } catch (e: any) {
      if (e?.name === "NotAllowedError" || e?.name === "PermissionDeniedError") {
        setStatus("denied");
      } else if (e?.name === "NotFoundError") {
        setStatus("unavailable");
      } else {
        setStatus("error");
        setErrorMessage(e?.message ?? "Não foi possível acessar a câmera.");
      }
    }
  };

  const stop = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setStatus("idle");
  };

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, []);

  return { status, errorMessage, start, stop };
}
