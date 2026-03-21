// components/ProofBar.tsx
"use client";

import { PROOF_BAR_ITEMS } from "@/lib/content";

const items = [...PROOF_BAR_ITEMS, ...PROOF_BAR_ITEMS];

export default function ProofBar() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(8px)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "16px 0",
        overflow: "hidden",
      }}
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0 32px",
              fontSize: "11px",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              whiteSpace: "nowrap",
              gap: "32px",
            }}
          >
            {item}
            <span
              aria-hidden
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #a8d8ff, #c4b5fd)",
                display: "inline-block",
                opacity: 0.5,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
