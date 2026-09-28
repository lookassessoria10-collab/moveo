"use client";

/** Aviso fixo exibido em toda tela enquanto o modo de validação estiver ativo. */
export function ValidationBanner() {
  return (
    <div className="bg-moveo-danger px-4 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-white">
      Modo de validação — dados não identificam o voluntário
    </div>
  );
}
