"use client";

import { useEffect, useState } from "react";

function readFromUrl(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return new URLSearchParams(window.location.search).get("modo") === "validacao";
  } catch {
    return false;
  }
}

/**
 * Modo de validação: ativado por `?modo=validacao` na URL. Não é uma
 * senha de verdade — só evita que o modo apareça sem querer para um
 * paciente comum. Lido uma vez por carregamento de página, no navegador
 * (no servidor sempre retorna `false`, corrigido logo após montar).
 */
export function useValidationMode(): boolean {
  const [active, setActive] = useState(false);
  useEffect(() => {
    setActive(readFromUrl());
  }, []);
  return active;
}
