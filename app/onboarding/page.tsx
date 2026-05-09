// app/onboarding/page.tsx
// One-time setup page: business name, type, manager name
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const BUSINESS_TYPES = [
  { value: "pub", label: "🍺 Pub" },
  { value: "restaurant", label: "🍽️ Restaurant" },
  { value: "cafe", label: "☕ Café" },
  { value: "hotel", label: "🏨 Hotel" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    business_name: "",
    business_type: "",
    manager_name: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.business_name || !form.business_type || !form.manager_name) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");

    const res = await fetch("/api/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      setError("Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "100vh",
      padding: "2rem",
    }}>
      <div style={{ width: "100%", maxWidth: "480px" }}>
        <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Welcome to Zero Clicks
        </h1>
        <p style={{ color: "var(--text-muted, #888)", marginBottom: "2rem" }}>
          Tell us about your business to get started.
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
              Business name
            </label>
            <input
              type="text"
              placeholder="e.g. The Old Fountain"
              value={form.business_name}
              onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
              Business type
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              {BUSINESS_TYPES.map(type => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, business_type: type.value }))}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: form.business_type === type.value
                      ? "2px solid var(--accent, #f59e0b)"
                      : "2px solid var(--border, #333)",
                    background: form.business_type === type.value
                      ? "var(--accent-subtle, rgba(245,158,11,0.1))"
                      : "transparent",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  }}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "0.4rem", fontWeight: 500 }}>
              Your name
            </label>
            <input
              type="text"
              placeholder="e.g. Sarah"
              value={form.manager_name}
              onChange={e => setForm(f => ({ ...f, manager_name: e.target.value }))}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: "#ef4444", fontSize: "0.9rem" }}>{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "0.85rem",
              borderRadius: "8px",
              background: "var(--accent, #f59e0b)",
              color: "#000",
              fontWeight: 700,
              fontSize: "1rem",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Let's go →"}
          </button>
        </form>
      </div>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: "8px",
  border: "1px solid var(--border, #333)",
  background: "var(--input-bg, #1a1a1a)",
  fontSize: "1rem",
  boxSizing: "border-box",
};
