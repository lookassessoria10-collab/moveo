"use client";

import { APP_CONFIG } from "@/config/app";

/**
 * Barra fixa no topo da tela de câmera, com a marca da UORT. Existe como
 * elemento próprio (fora da caixa de vídeo) para não depender do tamanho
 * real da área "vazia" (letterbox) que aparece quando a proporção do vídeo
 * da câmera do celular não bate exatamente com a caixa 9:16 — ver
 * comentário sobre video.videoWidth/videoHeight em CameraFlow.tsx.
 */
export function CameraTopBar() {
  return (
    <div className="flex flex-none items-center justify-center bg-white py-2.5">
      {APP_CONFIG.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={APP_CONFIG.logo} alt={APP_CONFIG.name} className="h-7 w-auto" />
      ) : (
        <span className="text-sm font-bold tracking-tight text-moveo-ink">{APP_CONFIG.name}</span>
      )}
    </div>
  );
}
