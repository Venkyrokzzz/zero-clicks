"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { TrialBanner } from "@/components/TrialBanner";

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  sentiment: string;
  summary: string;
  draft_response: string;
  created_at: string;
  status: "pending" | "approved" | "sent" | "skipped";
  escalation_reason: string;
  review_text: string;
}

interface Metrics {
  totalReviews: number;
  negativeCount: number;
  pendingCount: number;
  sentCount: number;
}

// ── Helpers ────────────────────────────────────────────────────────────────

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function Stars({ rating, size = 11 }: { rating: number; size?: number }) {
  return (
    <span style={{ fontSize: size, letterSpacing: "1.5px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#f59e0b" : "rgba(245,158,11,0.18)" }}>★</span>
      ))}
    </span>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{
        padding: "5px 12px", borderRadius: "6px",
        border: `1px solid ${done ? "rgba(16,185,129,0.3)" : "rgba(245,158,11,0.2)"}`,
        background: done ? "rgba(16,185,129,0.08)" : "rgba(245,158,11,0.06)",
        color: done ? "#10b981" : "#94a3b8",
        fontSize: "11px", fontWeight: 700, cursor: "pointer",
        fontFamily: "inherit", letterSpacing: "0.05em", transition: "all 150ms ease",
      }}
    >{done ? "✓ Copied" : "Copy"}</button>
  );
}

// ── Sentiment / status maps ────────────────────────────────────────────────

const SENTIMENT_COLOR: Record<string, string> = {
  POSITIVE: "#10b981", positive: "#10b981",
  NEGATIVE: "#ef4444", negative: "#ef4444",
  NEUTRAL: "#f59e0b", neutral: "#f59e0b",
};

const STATUS: Record<string, { color: string; label: string; dot: string }> = {
  pending:  { color: "#f59e0b", label: "Pending",  dot: "#f59e0b" },
  approved: { color: "#3b82f6", label: "Approved", dot: "#3b82f6" },
  sent:     { color: "#10b981", label: "Sent",     dot: "#10b981" },
  skipped:  { color: "#475569", label: "Skipped",  dot: "#475569" },
};

// ── Review Row ─────────────────────────────────────────────────────────────

function ReviewRow({ review, selected, onClick }: {
  review: Review; selected: boolean; onClick: () => void;
}) {
  const isFlagged = review.rating <= 2 && review.status === "pending";
  const st = STATUS[review.status] ?? STATUS.pending;
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", padding: "11px 14px",
      background: selected ? "rgba(245,158,11,0.07)" : "transparent",
      borderLeft: selected ? "2px solid #f59e0b" : isFlagged ? "2px solid rgba(239,68,68,0.4)" : "2px solid transparent",
      borderTop: "none", borderRight: "none",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      cursor: "pointer", display: "flex", gap: "10px", alignItems: "flex-start",
      transition: "all 120ms ease", fontFamily: "inherit",
    }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.03)"; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = "transparent"; }}
    >
      {/* Avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
        background: isFlagged
          ? "linear-gradient(135deg,#7f1d1d,#ef4444)"
          : "linear-gradient(135deg,#1e3a5f,#3b82f6)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", fontWeight: 800, color: "#fff",
      }}>
        {(review.reviewer_name || "?")[0].toUpperCase()}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: "4px", marginBottom: "2px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {review.reviewer_name || "Anonymous"}
          </span>
          <span style={{ fontSize: "10px", color: "#475569", flexShrink: 0 }}>{timeAgo(review.created_at)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <Stars rating={review.rating} size={10} />
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: st.dot, flexShrink: 0, boxShadow: review.status === "pending" ? `0 0 5px ${st.dot}` : "none" }} />
        </div>
        <p style={{
          margin: 0, fontSize: "11px", color: "#475569", lineHeight: 1.45,
          overflow: "hidden", display: "-webkit-box",
          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>{review.summary || review.review_text}</p>
      </div>
    </button>
  );
}

// ── Review Detail ──────────────────────────────────────────────────────────

function ReviewDetail({ review, onApprove, onSkip, onEdit, onRegenerate, onBack }: {
  review: Review;
  onApprove: (id: string, draft: string) => Promise<void>;
  onSkip: (id: string) => Promise<void>;
  onEdit: (id: string, draft: string) => Promise<void>;
  onRegenerate: (id: string) => Promise<string>;
  onBack?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(review.draft_response || "");
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    setEditing(false);
    setDraft(review.draft_response || "");
    setSaving(false);
    setApproving(false);
  }, [review.id, review.draft_response]);

  const isFlagged = review.rating <= 2 && review.status === "pending";
  const isPending = review.status === "pending";
  const sentimentColor = SENTIMENT_COLOR[review.sentiment] ?? "#94a3b8";

  async function doApprove() {
    setApproving(true);
    await onApprove(review.id, draft);
    setApproving(false);
  }

  async function doSave() {
    setSaving(true);
    await onEdit(review.id, draft);
    setSaving(false);
    setEditing(false);
  }

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* Header */}
      <div style={{
        padding: "18px 24px 14px",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: isFlagged ? "rgba(239,68,68,0.03)" : "transparent",
        flexShrink: 0,
      }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: "none", border: "none", padding: "0 0 10px", cursor: "pointer",
            color: "#475569", fontSize: "12px", fontWeight: 600, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "4px",
          }}>← Back</button>
        )}
        {isFlagged && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "6px", padding: "4px 10px", marginBottom: "10px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", boxShadow: "0 0 6px #ef4444" }} />
            <span style={{ fontSize: "10px", fontWeight: 800, color: "#ef4444", letterSpacing: "0.08em" }}>NEEDS ATTENTION</span>
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 42, height: 42, borderRadius: "50%", flexShrink: 0,
            background: isFlagged ? "linear-gradient(135deg,#7f1d1d,#ef4444)" : "linear-gradient(135deg,#1e3a5f,#3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "17px", fontWeight: 800, color: "#fff",
          }}>
            {(review.reviewer_name || "?")[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#f1f5f9" }}>
              {review.reviewer_name || "Anonymous"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
              <Stars rating={review.rating} size={13} />
              <span style={{
                fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px",
                background: `${sentimentColor}12`, color: sentimentColor,
                border: `1px solid ${sentimentColor}28`,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>{review.sentiment}</span>
              <span style={{ fontSize: "11px", color: "#475569" }}>{timeAgo(review.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable body */}
      <div style={{ flex: 1, overflowY: "auto", padding: "18px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {review.escalation_reason && (
          <div style={{
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)",
            borderRadius: "8px", padding: "10px 14px",
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#f87171", fontWeight: 600 }}>⚠ {review.escalation_reason}</p>
          </div>
        )}

        {review.review_text && (
          <div>
            <p style={{ margin: "0 0 7px", fontSize: "10px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              What the guest wrote
            </p>
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px", padding: "14px 16px",
              fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, fontStyle: "italic",
            }}>
              &ldquo;{review.review_text}&rdquo;
            </div>
          </div>
        )}

        {review.summary && review.summary !== review.review_text && (
          <div>
            <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Summary
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "#64748b", lineHeight: 1.6 }}>{review.summary}</p>
          </div>
        )}

        {/* Draft */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <p style={{ margin: 0, fontSize: "10px", color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              AI Draft Reply
            </p>
            <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
              <button
                onClick={async () => {
                  setRegenerating(true);
                  try {
                    const newDraft = await onRegenerate(review.id);
                    setDraft(newDraft);
                  } finally {
                    setRegenerating(false);
                  }
                }}
                disabled={regenerating || editing}
                title="Regenerate with current settings"
                style={{
                  padding: "5px 10px", borderRadius: "6px",
                  border: "1px solid rgba(99,102,241,0.25)",
                  background: regenerating ? "rgba(99,102,241,0.04)" : "rgba(99,102,241,0.06)",
                  color: regenerating ? "#6366f1" : "#818cf8",
                  fontSize: "11px", fontWeight: 700, cursor: regenerating || editing ? "not-allowed" : "pointer",
                  fontFamily: "inherit", letterSpacing: "0.04em", transition: "all 150ms ease",
                  opacity: editing ? 0.4 : 1,
                }}
              >{regenerating ? "↻ Generating…" : "↻ Regenerate"}</button>
              {!editing && draft && <CopyBtn text={draft} />}
            </div>
          </div>

          {editing ? (
            <>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={6}
                autoFocus
                placeholder="Write your reply…"
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.3)",
                  borderRadius: "10px", padding: "14px 16px",
                  color: "#f1f5f9", fontSize: "14px", lineHeight: 1.7,
                  resize: "vertical", fontFamily: "inherit", outline: "none",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.6)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(245,158,11,0.3)"}
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button onClick={doSave} disabled={saving} style={{
                  flex: 1, padding: "11px", borderRadius: "9px", border: "none",
                  background: saving ? "#1e3a5f" : "#f59e0b", color: saving ? "#94a3b8" : "#0a0d14",
                  fontWeight: 800, fontSize: "13px", cursor: saving ? "not-allowed" : "pointer",
                  fontFamily: "inherit", transition: "all 150ms ease",
                }}>{saving ? "Saving…" : "Save changes"}</button>
                <button onClick={() => { setDraft(review.draft_response || ""); setEditing(false); }} style={{
                  flex: 1, padding: "11px", borderRadius: "9px",
                  border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)",
                  color: "#64748b", fontWeight: 600, fontSize: "13px",
                  cursor: "pointer", fontFamily: "inherit",
                }}>Cancel</button>
              </div>
            </>
          ) : (
            <div style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "10px", padding: "14px 16px",
              fontSize: "14px", color: "#94a3b8", lineHeight: 1.7, minHeight: "80px",
            }}>
              {draft || <span style={{ color: "#334155", fontStyle: "italic" }}>No draft yet.</span>}
            </div>
          )}
        </div>
      </div>

      {/* Pinned action bar */}
      <div style={{
        padding: "14px 24px", borderTop: "1px solid rgba(255,255,255,0.05)",
        background: "#080c14", flexShrink: 0,
      }}>
        {isPending && !editing && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={doApprove} disabled={approving} style={{
              flex: 2, padding: "12px", borderRadius: "10px", border: "none",
              background: approving ? "#064e3b" : "linear-gradient(135deg,#059669,#047857)",
              color: "#fff", fontWeight: 800, fontSize: "14px",
              cursor: approving ? "not-allowed" : "pointer", fontFamily: "inherit",
              boxShadow: approving ? "none" : "0 0 20px rgba(5,150,105,0.35)",
              transition: "all 150ms ease",
            }}>
              {approving ? "Sending…" : "✓ Approve & Send"}
            </button>
            <button onClick={() => setEditing(true)} style={{
              flex: 1, padding: "12px", borderRadius: "10px",
              border: "1px solid rgba(245,158,11,0.25)", background: "rgba(245,158,11,0.06)",
              color: "#94a3b8", fontWeight: 600, fontSize: "14px",
              cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f59e0b"; (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#94a3b8"; (e.currentTarget as HTMLElement).style.background = "rgba(245,158,11,0.06)"; }}
            >✎ Edit</button>
            <button onClick={() => onSkip(review.id)} title="Skip" style={{
              padding: "12px 16px", borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)",
              color: "#475569", fontWeight: 600, fontSize: "14px",
              cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#ef4444"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(239,68,68,0.25)"; (e.currentTarget as HTMLElement).style.background = "rgba(239,68,68,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
            >✕</button>
          </div>
        )}
        {review.status === "sent" && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "12px", borderRadius: "10px",
            background: "rgba(5,150,105,0.07)", border: "1px solid rgba(16,185,129,0.2)",
            color: "#10b981", fontSize: "13px", fontWeight: 700,
          }}>✓ Reply sent — guest notified</div>
        )}
        {review.status === "skipped" && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 16px", borderRadius: "10px",
            background: "rgba(71,85,105,0.06)", border: "1px solid rgba(71,85,105,0.2)",
          }}>
            <span style={{ color: "#475569", fontSize: "13px", fontWeight: 600 }}>— Skipped</span>
            <button onClick={() => onApprove(review.id, draft)} style={{
              background: "none", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "7px",
              padding: "6px 12px", color: "#94a3b8", fontSize: "12px", fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
            }}>Send anyway</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────────

function EmptyDetail() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", gap: "12px", padding: "40px" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "14px",
        background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)",
        display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
      }}>★</div>
      <p style={{ color: "#334155", fontSize: "14px", fontWeight: 600, margin: 0 }}>Select a review</p>
      <p style={{ color: "#1e293b", fontSize: "12px", margin: 0, textAlign: "center", maxWidth: "200px" }}>
        Click any review on the left to read it and send a reply.
      </p>
    </div>
  );
}

// ── Main ────────────────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ totalReviews: 0, negativeCount: 0, pendingCount: 0, sentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [hasGoogle, setHasGoogle] = useState<boolean | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [filter, setFilter] = useState<"all" | "flagged" | "pending" | "approved" | "sent" | "skipped">("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      const fetched: Review[] = data.reviews || [];
      setReviews(fetched);
      setMetrics(data.metrics ?? { totalReviews: 0, negativeCount: 0, pendingCount: 0, sentCount: 0 });
      if (!selectedId) {
        const first = fetched.find(r => r.rating <= 2 && r.status === "pending")
          ?? fetched.find(r => r.status === "pending")
          ?? fetched[0];
        if (first) setSelectedId(first.id);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [selectedId]);

  useEffect(() => { fetchReviews(); }, []);

  useEffect(() => {
    fetch("/api/integrations/google")
      .then(r => r.json())
      .then(d => setHasGoogle(!!d.connected))
      .catch(() => setHasGoogle(false));
  }, []);

  async function handleApprove(id: string, draft: string) {
    await fetch("/api/reviews", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "sent", draft_response: draft }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "sent", draft_response: draft } : r));
    showToast("✓ Reply sent");
    const next = reviews.find(r => r.id !== id && r.status === "pending");
    if (next) setSelectedId(next.id);
  }

  async function handleSkip(id: string) {
    await fetch("/api/reviews", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "skipped" }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "skipped" } : r));
    showToast("Skipped");
    const next = reviews.find(r => r.id !== id && r.status === "pending");
    if (next) setSelectedId(next.id);
  }

  async function handleEdit(id: string, newDraft: string) {
    await fetch("/api/reviews", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, draft_response: newDraft }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, draft_response: newDraft } : r));
    showToast("Draft saved");
  }

  async function handleRegenerate(id: string): Promise<string> {
    const res = await fetch("/api/reviews/regenerate", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Regenerate failed");
    setReviews(prev => prev.map(r => r.id === id ? { ...r, draft_response: data.draft } : r));
    showToast("↻ Draft regenerated");
    return data.draft;
  }

  const filtered = filter === "flagged"
    ? reviews.filter(r => r.rating <= 2 && r.status === "pending")
    : reviews.filter(r => filter === "all" || r.status === filter);
  const ordered = [
    ...filtered.filter(r => r.rating <= 2 && r.status === "pending"),
    ...filtered.filter(r => r.status === "pending" && r.rating > 2),
    ...filtered.filter(r => r.status !== "pending"),
  ];
  const selected = reviews.find(r => r.id === selectedId) ?? null;
  const pubName = (user?.publicMetadata?.business_name as string) || `${user?.firstName || "Your"}'s Venue`;

  const METRIC_CARDS = [
    { label: "Total", val: metrics.totalReviews, color: "#f59e0b", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.15)" },
    { label: "Flagged", val: metrics.negativeCount, color: "#ef4444", bg: "rgba(239,68,68,0.06)", border: "rgba(239,68,68,0.15)" },
    { label: "Pending", val: metrics.pendingCount, color: "#f59e0b", bg: "rgba(245,158,11,0.06)", border: "rgba(245,158,11,0.12)" },
    { label: "Sent", val: metrics.sentCount, color: "#10b981", bg: "rgba(16,185,129,0.06)", border: "rgba(16,185,129,0.15)" },
  ];

  return (
    <div style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column", background: "#080c14", color: "#f1f5f9" }}>
      <style>{`
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
        @media (max-width: 768px) {
          .dash-left { display: ${mobileView === "list" ? "flex" : "none"} !important; width: 100% !important; }
          .dash-right { display: ${mobileView === "detail" ? "flex" : "none"} !important; }
        }
        .dash-topbar { flex-wrap: wrap; }
        .dash-pills { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; }
        @media (max-width: 600px) {
          .dash-topbar { padding: 8px 12px !important; gap: 8px !important; }
          .dash-pills { width: 100%; order: 3; overflow-x: auto; flex-wrap: nowrap; padding-bottom: 2px; }
          .dash-pills::-webkit-scrollbar { height: 2px; }
          .dash-venue-name { order: 1; }
          .dash-refresh { order: 2; margin-left: auto; }
          .dash-pill-label { display: none; }
        }
      `}</style>

      {/* ── Top bar ── */}
      <div className="dash-topbar" style={{
        padding: "10px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px",
        background: "#0a0e18", flexShrink: 0,
      }}>
        {/* Left: venue name */}
        <div className="dash-venue-name" style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: "8px", flexShrink: 0,
            background: "linear-gradient(135deg,#1e3a5f,#3b82f6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", fontWeight: 800, color: "#fff",
          }}>
            {pubName[0]?.toUpperCase() ?? "P"}
          </div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#f1f5f9", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{pubName}</div>
            <div style={{ fontSize: "10px", color: "#334155", letterSpacing: "0.04em" }}>Review Manager</div>
          </div>
        </div>

        {/* Centre: metric pills */}
        <div className="dash-pills">
          {METRIC_CARDS.map(m => (
            <div key={m.label} style={{
              display: "flex", alignItems: "center", gap: "5px", flexShrink: 0,
              background: m.bg, border: `1px solid ${m.border}`,
              borderRadius: "7px", padding: "4px 10px",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.val}</span>
              <span className="dash-pill-label" style={{ fontSize: "10px", color: "#475569", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{m.label}</span>
            </div>
          ))}
        </div>

        {/* Right: refresh */}
        <button className="dash-refresh" onClick={() => fetchReviews()} style={{
          padding: "6px 12px", borderRadius: "7px", flexShrink: 0,
          border: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)",
          color: "#475569", fontSize: "11px", fontWeight: 600, cursor: "pointer",
          fontFamily: "inherit", transition: "all 150ms ease",
        }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#f59e0b"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(245,158,11,0.3)"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#475569"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
        >↻ Refresh</button>
      </div>

      {/* Banners */}
      <div style={{ padding: "0 16px", flexShrink: 0 }}>
        <TrialBanner />
        {hasGoogle === false && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px",
            background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: "10px", padding: "11px 16px", margin: "8px 0",
          }}>
            <span style={{ color: "#f59e0b", fontWeight: 600, fontSize: "13px" }}>
              Connect your Google Business Profile to start receiving reviews.
            </span>
            <a href="/connect" style={{
              background: "#f59e0b", color: "#0a0d14", fontWeight: 800,
              padding: "7px 14px", borderRadius: "7px", textDecoration: "none", fontSize: "12px", whiteSpace: "nowrap",
            }}>Connect →</a>
          </div>
        )}
      </div>

      {/* ── Two-panel layout ── */}
      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* LEFT */}
        <div className="dash-left" style={{
          width: "280px", flexShrink: 0,
          borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex", flexDirection: "column", minHeight: 0,
          background: "#080c14",
        }}>
          {/* Filter tabs */}
          <div style={{
            display: "flex", gap: "3px", padding: "10px 10px 8px",
            borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0,
          }}>
            {(["all", "flagged", "pending", "approved", "sent", "skipped"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                flex: 1, padding: "5px 2px", borderRadius: "6px", border: "none",
                background: filter === f ? "rgba(245,158,11,0.1)" : "transparent",
                color: filter === f ? "#f59e0b" : "#475569",
                fontWeight: filter === f ? 700 : 400, fontSize: "10px",
                cursor: "pointer", fontFamily: "inherit", textTransform: "capitalize",
                transition: "all 120ms ease",
              }}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* List */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#334155", fontSize: "13px" }}>Loading…</div>
            ) : ordered.length === 0 ? (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px", opacity: 0.4 }}>★</div>
                <p style={{ color: "#334155", fontSize: "12px", margin: 0 }}>No reviews yet.</p>
              </div>
            ) : ordered.map(r => (
              <ReviewRow key={r.id} review={r} selected={r.id === selectedId}
                onClick={() => { setSelectedId(r.id); setMobileView("detail"); }} />
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="dash-right" style={{
          flex: 1, display: "flex", flexDirection: "column",
          minWidth: 0, minHeight: 0, background: "#0a0e18",
        }}>
          {selected ? (
            <ReviewDetail
              key={selected.id}
              review={selected}
              onApprove={handleApprove}
              onSkip={handleSkip}
              onEdit={handleEdit}
              onRegenerate={handleRegenerate}
              onBack={mobileView === "detail" ? () => setMobileView("list") : undefined}
            />
          ) : (
            <EmptyDetail />
          )}
        </div>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
            style={{
              position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
              background: "#0f1623", border: "1px solid rgba(245,158,11,0.25)",
              borderRadius: "10px", padding: "11px 20px",
              color: "#f59e0b", fontSize: "13px", fontWeight: 600,
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)", zIndex: 100,
              whiteSpace: "nowrap",
            }}
          >{toast}</motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
