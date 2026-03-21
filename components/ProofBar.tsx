// components/ProofBar.tsx
"use client";

import { PROOF_BAR_ITEMS } from "@/lib/content";

const items = [...PROOF_BAR_ITEMS, ...PROOF_BAR_ITEMS];

export default function ProofBar() {
  return (
    <div
      style={{
        backgroundColor: "var(--bg-surface)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
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
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              fontWeight: 500,
              whiteSpace: "nowrap",
              gap: "32px",
            }}
          >
            {item}
            <span aria-hidden="true" style={{ color: "var(--border)", fontSize: "14px" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
