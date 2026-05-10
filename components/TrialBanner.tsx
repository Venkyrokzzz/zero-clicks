// components/TrialBanner.tsx — shows trial countdown or expired overlay
"use client";

import { useSubscription } from "@/hooks/useSubscription";

export function TrialBanner() {
  const { sub, loading } = useSubscription();

  if (loading || !sub) return null;
  if (sub.isPaid) return null;

  // Trial expired — full-screen overlay
  if (sub.isTrialExpired) {
    return (
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "24px",
      }}>
        <div style={{
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "16px",
          padding: "48px 40px",
          maxWidth: "480px",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "3rem", marginBottom: "16px" }}>⏰</div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 700, color: "#fff", marginBottom: "12px" }}>
            Your trial has ended
          </h2>
          <p style={{ color: "#a1a1aa", marginBottom: "28px", lineHeight: 1.6 }}>
            Your 30-day free trial is over. Upgrade to keep your automated review replies running.
          </p>
          <a
            href="mailto:venkateshsurampudi1@gmail.com?subject=Zero Clicks — Ready to upgrade&body=Hi Venky, I'd like to continue with Zero Clicks. Let's chat about the starter plan."
            style={{
              display: "inline-block",
              background: "#f59e0b",
              color: "#000",
              fontWeight: 700,
              padding: "14px 32px",
              borderRadius: "10px",
              textDecoration: "none",
              fontSize: "1rem",
            }}
          >
            Get in touch to upgrade →
          </a>
          <p style={{ color: "#666", fontSize: "0.8rem", marginTop: "16px" }}>
            £49/month · Cancel anytime · Live in 48 hours
          </p>
        </div>
      </div>
    );
  }

  // Trial active — countdown banner
  const urgentStyle = sub.daysLeft <= 5;

  return (
    <div style={{
      background: urgentStyle
        ? "rgba(239,68,68,0.1)"
        : "rgba(245,158,11,0.08)",
      border: `1px solid ${urgentStyle ? "#ef4444" : "rgba(245,158,11,0.3)"}`,
      borderRadius: "10px",
      padding: "12px 20px",
      marginBottom: "24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
    }}>
      <span style={{
        color: urgentStyle ? "#ef4444" : "#f59e0b",
        fontWeight: 500,
        fontSize: "0.9rem",
      }}>
        {urgentStyle ? "⚠️" : "⏳"} {sub.daysLeft} day{sub.daysLeft !== 1 ? "s" : ""} left on your free trial
      </span>
      <a
        href="mailto:venkateshsurampudi1@gmail.com?subject=Zero Clicks — Ready to upgrade"
        style={{
          color: urgentStyle ? "#ef4444" : "#f59e0b",
          fontWeight: 600,
          fontSize: "0.85rem",
          textDecoration: "none",
        }}
      >
        Upgrade →
      </a>
    </div>
  );
}
