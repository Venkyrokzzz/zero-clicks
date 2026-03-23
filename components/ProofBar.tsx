// components/ProofBar.tsx
"use client";

import { PROOF_BAR_ITEMS } from "@/lib/content";

const items = [...PROOF_BAR_ITEMS, ...PROOF_BAR_ITEMS];

export default function ProofBar() {
  return (
    <div
      style={{
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        padding: "14px 0",
        overflow: "hidden",
        background: "var(--bg-surface)",
      }}
    >
      <div className="marquee-track">
        {items.map((item, i) => (
          <span
            key={i}
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "0 28px",
              fontSize: "11px",
              color: "var(--text-muted)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              whiteSpace: "nowrap",
              gap: "28px",
            }}
          >
            {item}
            <span
              aria-hidden
              style={{
                width: "3px",
                height: "3px",
                borderRadius: "50%",
                background: "var(--accent)",
                display: "inline-block",
                opacity: 0.4,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
