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
        padding: "16px 0",
        overflow: "hidden",
        background: "var(--bg-surface)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
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
              fontSize: "12px",
              color: "var(--text-muted)",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
              fontWeight: 400,
              whiteSpace: "nowrap",
              gap: "48px",
            }}
          >
            {item}
            <span
              aria-hidden
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "var(--border-mid)",
                display: "inline-block",
                opacity: 0.6,
              }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
