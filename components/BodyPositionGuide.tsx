"use client";

export function BodyPositionGuide({ ok }: { ok: boolean }) {
  return (
    <svg
      viewBox="0 0 200 400"
      className="pointer-events-none absolute inset-0 h-full w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      <ellipse
        cx="100"
        cy="60"
        rx="26"
        ry="30"
        fill="none"
        stroke={ok ? "#12A594" : "rgba(255,255,255,0.6)"}
        strokeWidth="2.5"
        strokeDasharray="6 6"
      />
      <path
        d="M 60 100 Q 100 90 140 100 L 150 220 Q 100 240 50 220 Z"
        fill="none"
        stroke={ok ? "#12A594" : "rgba(255,255,255,0.6)"}
        strokeWidth="2.5"
        strokeDasharray="6 6"
      />
      <line
        x1="60"
        y1="110"
        x2="20"
        y2="220"
        stroke={ok ? "#12A594" : "rgba(255,255,255,0.6)"}
        strokeWidth="2.5"
        strokeDasharray="6 6"
      />
      <line
        x1="140"
        y1="110"
        x2="180"
        y2="220"
        stroke={ok ? "#12A594" : "rgba(255,255,255,0.6)"}
        strokeWidth="2.5"
        strokeDasharray="6 6"
      />
      <line
        x1="70"
        y1="220"
        x2="65"
        y2="340"
        stroke={ok ? "#12A594" : "rgba(255,255,255,0.6)"}
        strokeWidth="2.5"
        strokeDasharray="6 6"
      />
      <line
        x1="130"
        y1="220"
        x2="135"
        y2="340"
        stroke={ok ? "#12A594" : "rgba(255,255,255,0.6)"}
        strokeWidth="2.5"
        strokeDasharray="6 6"
      />
    </svg>
  );
}
