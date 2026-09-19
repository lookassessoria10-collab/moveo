"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "moveo:voiceEnabled";

function readStoredPreference(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === null ? true : stored === "1";
  } catch {
    return true;
  }
}

/**
 * Dispara uma fala silenciosa para "destravar" a Web Speech API a partir
 * de um gesto real do usuário (clique). Alguns navegadores — principalmente
 * Safari/iOS — só permitem chamadas a `speechSynthesis.speak()` depois de
 * uma interação explícita; chamar isso dentro de um onClick já existente
 * (ex.: "ABRIR CÂMERA") evita que a primeira instrução falada durante o
 * teste seja silenciosamente ignorada.
 */
export function warmUpSpeech() {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    const utterance = new SpeechSynthesisUtterance(" ");
    utterance.volume = 0;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Web Speech API indisponível ou bloqueada — a aplicação continua
    // funcionando normalmente apenas com o feedback visual em texto.
  }
}

/**
 * Feedback por voz usando a Web Speech API (SpeechSynthesis) do navegador —
 * roda inteiramente no dispositivo, sem serviço externo, sem chave de API
 * e sem custo. Compartilhado entre os módulos de ombro, joelho e coluna.
 *
 * A preferência de som ligado/desligado fica salva no localStorage
 * (chave "moveo:voiceEnabled") e vale para qualquer módulo.
 */
export function useSpeech() {
  const [enabled, setEnabled] = useState(true);
  const [supported, setSupported] = useState(false);
  const lastTextRef = useRef<string | null>(null);
  const lastAtRef = useRef(0);

  useEffect(() => {
    setEnabled(readStoredPreference());
    setSupported(typeof window !== "undefined" && "speechSynthesis" in window);
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // localStorage indisponível (ex.: navegação privada) — a
        // preferência simplesmente não persiste entre sessões.
      }
      if (!next) {
        try {
          window.speechSynthesis.cancel();
        } catch {}
      }
      return next;
    });
  }, []);

  /**
   * Fala um texto. Por padrão, não repete a MESMA frase em menos de
   * `minIntervalMs` (evita spam quando o mesmo aviso de posicionamento se
   * repete a cada frame); `force: true` ignora essa checagem.
   */
  const speak = useCallback(
    (text: string, opts: { force?: boolean; minIntervalMs?: number } = {}) => {
      if (!supported || !enabled || !text) return;
      const now = Date.now();
      const minInterval = opts.minIntervalMs ?? 4000;
      if (!opts.force && text === lastTextRef.current && now - lastAtRef.current < minInterval) {
        return;
      }
      lastTextRef.current = text;
      lastAtRef.current = now;
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = "pt-BR";
        utterance.rate = 1;
        window.speechSynthesis.speak(utterance);
      } catch {
        // silenciosamente ignora — o texto na tela continua disponível
      }
    },
    [supported, enabled]
  );

  return { enabled, supported, toggle, speak };
}
