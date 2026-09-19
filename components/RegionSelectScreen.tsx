"use client";

import Link from "next/link";
import { ScreenShell } from "./ui/Card";
import { APP_CONFIG } from "@/config/app";

interface RegionCard {
  href: string;
  title: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
}

function ShoulderIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
      <circle cx="24" cy="10" r="6" stroke={color} strokeWidth="2.5" />
      <path
        d="M8 30c2-8 8-12 16-12s14 4 16 12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <path d="M8 30l-2 12M40 30l2 12" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function KneeIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
      <path
        d="M20 6v14l-8 10v12M28 6v14l8 10v12"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="20" cy="30" r="3" fill={color} />
    </svg>
  );
}

function SpineIcon({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 48 48" className="h-10 w-10" fill="none">
      <circle cx="24" cy="8" r="5" stroke={color} strokeWidth="2.5" />
      <path
        d="M24 13c0 4-4 4-4 8s4 4 4 8-4 4-4 8 4 4 4 7"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function RegionSelectScreen() {
  const cards: RegionCard[] = [
    {
      href: "/assessment/shoulder",
      title: "OMBRO",
      description: "Avalie amplitude, assimetria e compensações dos movimentos do ombro.",
      accent: APP_CONFIG.colors.right,
      icon: <ShoulderIcon color={APP_CONFIG.colors.right} />,
    },
    {
      href: "/assessment/knee",
      title: "JOELHO",
      description: "Avalie mobilidade, controle e simetria durante movimentos funcionais.",
      accent: APP_CONFIG.colors.left,
      icon: <KneeIcon color={APP_CONFIG.colors.left} />,
    },
    {
      href: "/assessment/spine",
      title: "COLUNA",
      description: "Observe mobilidade, inclinações e assimetrias durante movimentos do tronco.",
      accent: APP_CONFIG.colors.warn,
      icon: <SpineIcon color={APP_CONFIG.colors.warn} />,
    },
  ];

  return (
    <ScreenShell>
      <div className="mb-2 flex items-center gap-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-moveo-primary text-lg font-bold text-white">
          {APP_CONFIG.name.slice(0, 1)}
        </div>
        <span className="text-lg font-bold tracking-tight">{APP_CONFIG.name}</span>
      </div>

      <h1 className="mt-4 text-3xl font-bold leading-tight text-moveo-ink">Avalie seu movimento</h1>
      <p className="mt-2 text-base text-moveo-muted">
        Use a câmera do seu celular para realizar uma avaliação funcional simples dos seus
        movimentos.
      </p>

      <p className="mt-8 text-sm font-semibold uppercase tracking-wide text-moveo-muted">
        Qual região você deseja avaliar?
      </p>

      <div className="mt-4 space-y-4">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="block rounded-xl2 border border-moveo-border bg-moveo-card p-5 shadow-sm transition-transform active:scale-[0.99]"
          >
            <div className="flex items-start gap-4">
              <div
                className="flex h-16 w-16 flex-none items-center justify-center rounded-2xl"
                style={{ backgroundColor: `${card.accent}1A` }}
              >
                {card.icon}
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-moveo-ink">{card.title}</h2>
                <p className="mt-1 text-sm leading-relaxed text-moveo-muted">{card.description}</p>
                <span className="mt-3 inline-block text-sm font-semibold" style={{ color: card.accent }}>
                  INICIAR AVALIAÇÃO →
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-moveo-muted">
        {APP_CONFIG.copy.disclaimerHome}
      </p>
    </ScreenShell>
  );
}
