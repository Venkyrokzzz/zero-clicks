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

function Stars({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span style={{ fontSize: size, letterSpacing: "1px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#d4a017" : "rgba(212,160,23,0.2)" }}>★</span>
      ))}
    </span>
  );
}

function StatusDot({ status }: { status: Review["status"] }) {
  const colors: Record<string, string> = {
    pending: "#e8923a", sent: "#4a8c5c", skipped: "#6b5a3e", approved: "#d4a017",
  };
  return (
    <span style={{
      width: 7, height: 7, borderRadius: "50%", flexShrink: 0,
      background: colors[status] ?? "#6b5a3e", display: "inline-block",
      boxShadow: status === "pending" ? `0 0 6px ${colors.pending}80` : "none",
    }} />
  );
}

function CopyBtn({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setDone(true); setTimeout(() => setDone(false), 2000); }}
      style={{
        padding: "6px 12px", borderRadius: "6px", border: "1px solid rgba(212,160,23,0.2)",
        background: done ? "rgba(74,140,92,0.12)" : "rgba(212,160,23,0.06)",
        color: done ? "#4a8c5c" : "#a89070", fontSize: "11px", fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit", letterSpacing: "0.05em",
        transition: "all 150ms ease",
      }}
    >{done ? "✓ Copied" : "Copy"}</button>
  );
}

// ── Review Row (left sidebar) ──────────────────────────────────────────────

function ReviewRow({ review, selected, onClick }: {
  review: Review; selected: boolean; onClick: () => void;
}) {
  const isFlagged = review.rating <= 2 && review.status === "pending";
  return (
    <button onClick={onClick} style={{
      width: "100%", textAlign: "left", padding: "12px 14px",
      background: selected
        ? "rgba(212,160,23,0.08)"
        : isFlagged ? "rgba(192,57,43,0.04)" : "transparent",
      borderLeft: selected ? "2px solid #d4a017" : isFlagged ? "2px solid #c0392b40" : "2px solid transparent",
      borderTop: "none", borderRight: "none", borderBottom: "1px solid rgba(255,255,255,0.04)",
      cursor: "pointer", display: "flex", gap: "10px", alignItems: "flex-start",
      transition: "all 120ms ease",
    }}
      onMouseEnter={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.04)"; }}
      onMouseLeave={e => { if (!selected) (e.currentTarget as HTMLElement).style.background = isFlagged ? "rgba(192,57,43,0.04)" : "transparent"; }}
    >
      {/* Avatar */}
      <div style={{
        width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
        background: isFlagged ? "linear-gradient(135deg,#7a1c10,#c0392b)" : "linear-gradient(135deg,#5c3d0a,#d4a017)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "12px", fontWeight: 800, color: "#f5e6c8",
      }}>
        {(review.reviewer_name || "?")[0].toUpperCase()}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px", marginBottom: "3px" }}>
          <span style={{ fontSize: "13px", fontWeight: 600, color: "#f5e6c8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {review.reviewer_name || "Anonymous"}
          </span>
          <span style={{ fontSize: "10px", color: "#6b5a3e", flexShrink: 0 }}>{timeAgo(review.created_at)}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <Stars rating={review.rating} size={10} />
          <StatusDot status={review.status} />
        </div>
        <p style={{
          margin: 0, fontSize: "11px", color: "#6b5a3e", lineHeight: 1.4,
          overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
        }}>
          {review.summary || review.review_text}
        </p>
      </div>
    </button>
  );
}

// ── Review Detail (right panel) ────────────────────────────────────────────

function ReviewDetail({ review, onApprove, onSkip, onEdit, onBack }: {
  review: Review;
  onApprove: (id: string, draft: string) => Promise<void>;
  onSkip: (id: string) => Promise<void>;
  onEdit: (id: string, draft: string) => Promise<void>;
  onBack?: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(review.draft_response || "");
  const [saving, setSaving] = useState(false);
  const [approving, setApproving] = useState(false);

  // Reset when review changes
  useEffect(() => {
    setEditing(false);
    setDraft(review.draft_response || "");
    setSaving(false);
    setApproving(false);
  }, [review.id, review.draft_response]);

  const isFlagged = review.rating <= 2 && review.status === "pending";
  const isPending = review.status === "pending";

  async function handleApprove() {
    setApproving(true);
    await onApprove(review.id, draft);
    setApproving(false);
  }

  async function handleSave() {
    setSaving(true);
    await onEdit(review.id, draft);
    setSaving(false);
    setEditing(false);
  }

  const sentimentColors: Record<string, string> = {
    POSITIVE: "#4a8c5c", positive: "#4a8c5c",
    NEGATIVE: "#c0392b", negative: "#c0392b",
    NEUTRAL: "#e8923a", neutral: "#e8923a",
  };
  const sentimentColor = sentimentColors[review.sentiment] ?? "#a89070";

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>

      {/* Detail header */}
      <div style={{
        padding: "20px 24px 16px",
        borderBottom: "1px solid rgba(212,160,23,0.08)",
        background: isFlagged ? "rgba(192,57,43,0.04)" : "transparent",
      }}>
        {onBack && (
          <button onClick={onBack} style={{
            background: "none", border: "none", padding: "0 0 12px", cursor: "pointer",
            color: "#6b5a3e", fontSize: "12px", fontWeight: 600, fontFamily: "inherit",
            display: "flex", alignItems: "center", gap: "5px",
          }}>
            ← Back to list
          </button>
        )}

        {isFlagged && (
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "rgba(192,57,43,0.1)", border: "1px solid rgba(192,57,43,0.25)",
            borderRadius: "6px", padding: "4px 10px", marginBottom: "12px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#c0392b", boxShadow: "0 0 6px #c0392b" }} />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#e74c3c", letterSpacing: "0.06em" }}>NEEDS ATTENTION</span>
          </div>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%", flexShrink: 0,
            background: isFlagged ? "linear-gradient(135deg,#7a1c10,#c0392b)" : "linear-gradient(135deg,#5c3d0a,#d4a017)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "18px", fontWeight: 800, color: "#f5e6c8",
          }}>
            {(review.reviewer_name || "?")[0].toUpperCase()}
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: "#f5e6c8" }}>
              {review.reviewer_name || "Anonymous"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }}>
              <Stars rating={review.rating} size={13} />
              <span style={{
                fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "20px",
                background: `${sentimentColor}18`, color: sentimentColor, border: `1px solid ${sentimentColor}30`,
                textTransform: "uppercase", letterSpacing: "0.06em",
              }}>{review.sentiment}</span>
              <span style={{ fontSize: "11px", color: "#6b5a3e" }}>{timeAgo(review.created_at)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: "16px" }}>

        {/* Escalation */}
        {review.escalation_reason && (
          <div style={{
            background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)",
            borderRadius: "8px", padding: "12px 14px",
          }}>
            <p style={{ margin: 0, fontSize: "12px", color: "#e74c3c", fontWeight: 600 }}>
              ⚠ {review.escalation_reason}
            </p>
          </div>
        )}

        {/* Original review */}
        {review.review_text && (
          <div>
            <p style={{ margin: "0 0 8px", fontSize: "10px", color: "#6b5a3e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Guest wrote
            </p>
            <div style={{
              background: "rgba(212,160,23,0.04)", border: "1px solid rgba(212,160,23,0.1)",
              borderRadius: "10px", padding: "14px 16px",
              fontSize: "14px", color: "#c8a96e", lineHeight: 1.7, fontStyle: "italic",
            }}>
              &ldquo;{review.review_text}&rdquo;
            </div>
          </div>
        )}

        {/* Summary */}
        {review.summary && review.summary !== review.review_text && (
          <div>
            <p style={{ margin: "0 0 6px", fontSize: "10px", color: "#6b5a3e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              AI Summary
            </p>
            <p style={{ margin: 0, fontSize: "13px", color: "#a89070", lineHeight: 1.6 }}>
              {review.summary}
            </p>
          </div>
        )}

        {/* Draft reply */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
            <p style={{ margin: 0, fontSize: "10px", color: "#6b5a3e", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Draft reply
            </p>
            {!editing && draft && <CopyBtn text={draft} />}
          </div>

          {editing ? (
            <div>
              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                rows={6}
                autoFocus
                placeholder="Write your reply..."
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(212,160,23,0.04)", border: "1px solid rgba(212,160,23,0.3)",
                  borderRadius: "10px", padding: "14px 16px",
                  color: "#f5e6c8", fontSize: "14px", lineHeight: 1.7,
                  resize: "vertical", fontFamily: "inherit", outline: "none",
                  transition: "border-color 150ms ease",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(212,160,23,0.6)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(212,160,23,0.3)"}
              />
              <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
                <button onClick={handleSave} disabled={saving} style={{
                  flex: 1, padding: "11px", borderRadius: "9px", border: "none",
                  background: "#d4a017", color: "#0d0a06", fontWeight: 800,
                  fontSize: "13px", cursor: saving ? "not-allowed" : "pointer",
                  opacity: saving ? 0.7 : 1, fontFamily: "inherit", transition: "opacity 150ms ease",
                }}>
                  {saving ? "Saving…" : "Save changes"}
                </button>
                <button onClick={() => { setDraft(review.draft_response || ""); setEditing(false); }} style={{
                  flex: 1, padding: "11px", borderRadius: "9px",
                  border: "1px solid rgba(212,160,23,0.15)", background: "rgba(212,160,23,0.04)",
                  color: "#6b5a3e", fontWeight: 600, fontSize: "13px",
                  cursor: "pointer", fontFamily: "inherit",
                }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              background: "rgba(212,160,23,0.04)", border: "1px solid rgba(212,160,23,0.1)",
              borderRadius: "10px", padding: "14px 16px",
              fontSize: "14px", color: "#c8a96e", lineHeight: 1.7,
              minHeight: "80px",
            }}>
              {draft || <span style={{ color: "#6b5a3e", fontStyle: "italic" }}>No draft yet.</span>}
            </div>
          )}
        </div>
      </div>

      {/* Action bar — pinned to bottom */}
      <div style={{
        padding: "16px 24px",
        borderTop: "1px solid rgba(212,160,23,0.08)",
        background: "rgba(13,10,6,0.8)",
        backdropFilter: "blur(12px)",
      }}>
        {isPending && !editing && (
          <div style={{ display: "flex", gap: "8px" }}>
            <button onClick={handleApprove} disabled={approving} style={{
              flex: 2, padding: "12px", borderRadius: "10px", border: "none",
              background: approving ? "#2d5e38" : "linear-gradient(135deg,#4a8c5c,#3d7a4e)",
              color: "#fff", fontWeight: 800, fontSize: "14px",
              cursor: approving ? "not-allowed" : "pointer", fontFamily: "inherit",
              boxShadow: "0 2px 16px rgba(74,140,92,0.3)",
              transition: "all 150ms ease",
            }}>
              {approving ? "Sending…" : "✓ Approve & Send"}
            </button>
            <button onClick={() => setEditing(true)} style={{
              flex: 1, padding: "12px", borderRadius: "10px",
              border: "1px solid rgba(212,160,23,0.25)", background: "rgba(212,160,23,0.06)",
              color: "#a89070", fontWeight: 600, fontSize: "14px",
              cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.12)"; (e.currentTarget as HTMLElement).style.color = "#d4a017"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.06)"; (e.currentTarget as HTMLElement).style.color = "#a89070"; }}
            >
              ✎ Edit
            </button>
            <button onClick={() => onSkip(review.id)} title="Skip this review" style={{
              padding: "12px 16px", borderRadius: "10px",
              border: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)",
              color: "#6b5a3e", fontWeight: 600, fontSize: "14px",
              cursor: "pointer", fontFamily: "inherit", transition: "all 150ms ease",
            }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#c0392b"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(192,57,43,0.3)"; (e.currentTarget as HTMLElement).style.background = "rgba(192,57,43,0.06)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#6b5a3e"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)"; (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.02)"; }}
            >
              ✕
            </button>
          </div>
        )}

        {review.status === "sent" && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "12px", borderRadius: "10px",
            background: "rgba(74,140,92,0.08)", border: "1px solid rgba(74,140,92,0.2)",
            color: "#4a8c5c", fontSize: "13px", fontWeight: 700,
          }}>
            ✓ Reply sent — guest notified
          </div>
        )}

        {review.status === "skipped" && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px",
            padding: "12px", borderRadius: "10px",
            border: "1px solid rgba(107,90,62,0.15)", background: "rgba(107,90,62,0.06)",
          }}>
            <span style={{ color: "#6b5a3e", fontSize: "13px", fontWeight: 600 }}>— Skipped</span>
            <button onClick={() => onApprove(review.id, draft)} style={{
              background: "none", border: "1px solid rgba(212,160,23,0.2)",
              borderRadius: "7px", padding: "6px 12px", color: "#a89070",
              fontSize: "12px", fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              Send anyway
            </button>
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
      <span style={{ fontSize: "40px" }}>🍺</span>
      <p style={{ color: "#6b5a3e", fontSize: "14px", fontWeight: 600, margin: 0 }}>Select a review to get started</p>
      <p style={{ color: "#4a3626", fontSize: "12px", margin: 0, textAlign: "center" }}>
        Click any review on the left to see the full detail and reply.
      </p>
    </div>
  );
}

// ── Main Dashboard ──────────────────────────────────────────────────────────

export default function Dashboard() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ totalReviews: 0, negativeCount: 0, pendingCount: 0, sentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [hasGoogle, setHasGoogle] = useState<boolean | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "detail">("list");
  const [filter, setFilter] = useState<"all" | "pending" | "sent" | "skipped">("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const fetchReviews = useCallback(async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      const fetched: Review[] = data.reviews || [];
      setReviews(fetched);
      setMetrics(data.metrics || { totalReviews: 0, negativeCount: 0, pendingCount: 0, sentCount: 0 });
      // Auto-select first flagged, then first pending
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
    async function checkGoogle() {
      try { const res = await fetch("/api/integrations/google"); const d = await res.json(); setHasGoogle(!!d.connected); }
      catch { setHasGoogle(false); }
    }
    checkGoogle();
  }, []);

  async function handleApprove(id: string, draft: string) {
    await fetch("/api/reviews", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "sent", draft_response: draft }),
    });
    showToast("✓ Reply sent — guest will feel heard");
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "sent", draft_response: draft } : r));
    // Auto-advance to next pending
    const nextPending = reviews.find(r => r.id !== id && r.status === "pending");
    if (nextPending) setSelectedId(nextPending.id);
  }

  async function handleSkip(id: string) {
    await fetch("/api/reviews", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status: "skipped" }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, status: "skipped" } : r));
    showToast("Review skipped");
    const nextPending = reviews.find(r => r.id !== id && r.status === "pending");
    if (nextPending) setSelectedId(nextPending.id);
  }

  async function handleEdit(id: string, newDraft: string) {
    await fetch("/api/reviews", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, draft_response: newDraft }),
    });
    setReviews(prev => prev.map(r => r.id === id ? { ...r, draft_response: newDraft } : r));
    showToast("Draft saved");
  }

  const filtered = reviews.filter(r => filter === "all" || r.status === filter);
  const flagged = filtered.filter(r => r.rating <= 2 && r.status === "pending");
  const pending = filtered.filter(r => r.status === "pending" && r.rating > 2);
  const rest = filtered.filter(r => r.status !== "pending");
  const ordered = [...flagged, ...pending, ...rest];

  const selected = reviews.find(r => r.id === selectedId) ?? null;

  return (
    <div style={{ height: "calc(100vh - 60px)", display: "flex", flexDirection: "column", background: "#0d0a06", color: "#f5e6c8" }}>
      <style>{`
        .review-row:hover { background: rgba(212,160,23,0.04); }
        .action-btn:hover { opacity: 0.85; }
        @media (max-width: 768px) {
          .dash-panel-left { display: ${mobileView === "list" ? "flex" : "none"} !important; }
          .dash-panel-right { display: ${mobileView === "detail" ? "flex" : "none"} !important; }
          .dash-two-col { flex-direction: column !important; }
        }
      `}</style>

      {/* Top utility bar */}
      <div style={{
        padding: "10px 20px", borderBottom: "1px solid rgba(212,160,23,0.08)",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px",
        background: "#0d0a06", flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ fontSize: "16px" }}>🍺</span>
          <span style={{ fontSize: "14px", fontWeight: 700, color: "#f5e6c8" }}>
            {(user?.publicMetadata?.business_name as string) || "Your Pub"}
          </span>
          <span style={{ fontSize: "11px", color: "#6b5a3e", marginLeft: "4px" }}>— Review Manager</span>
        </div>

        {/* Metrics strip */}
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          {[
            { label: "Total", val: metrics.totalReviews, color: "#a89070" },
            { label: "Flagged", val: metrics.negativeCount, color: "#c0392b" },
            { label: "Pending", val: metrics.pendingCount, color: "#e8923a" },
            { label: "Sent", val: metrics.sentCount, color: "#4a8c5c" },
          ].map(m => (
            <div key={m.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: "16px", fontWeight: 800, color: m.color, lineHeight: 1 }}>{m.val}</div>
              <div style={{ fontSize: "9px", color: "#6b5a3e", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>{m.label}</div>
            </div>
          ))}
          <button onClick={() => fetchReviews()} style={{
            padding: "6px 12px", borderRadius: "7px",
            border: "1px solid rgba(212,160,23,0.15)", background: "rgba(212,160,23,0.05)",
            color: "#a89070", fontSize: "11px", fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", transition: "all 150ms ease",
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "#d4a017"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "#a89070"; }}
          >↻ Refresh</button>
        </div>
      </div>

      {/* Trial + Google banners */}
      <div style={{ padding: "0 20px", flexShrink: 0 }}>
        <TrialBanner />
        {hasGoogle === false && (
          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            background: "rgba(212,160,23,0.07)", border: "1px solid rgba(212,160,23,0.25)",
            borderRadius: "10px", padding: "12px 16px", margin: "8px 0",
          }}>
            <span style={{ color: "#d4a017", fontWeight: 600, fontSize: "13px" }}>
              🔌 Connect your Google Business Profile to receive reviews automatically.
            </span>
            <a href="/connect" style={{
              background: "#d4a017", color: "#0d0a06", fontWeight: 800,
              padding: "7px 14px", borderRadius: "7px", textDecoration: "none", fontSize: "12px",
            }}>Connect →</a>
          </div>
        )}
      </div>

      {/* Two-panel layout */}
      <div className="dash-two-col" style={{ flex: 1, display: "flex", minHeight: 0 }}>

        {/* LEFT — review list */}
        <div className="dash-panel-left" style={{
          width: "280px", flexShrink: 0, borderRight: "1px solid rgba(212,160,23,0.08)",
          display: "flex", flexDirection: "column", minHeight: 0,
        }}>
          {/* Filter tabs */}
          <div style={{
            display: "flex", gap: "4px", padding: "10px 10px 8px",
            borderBottom: "1px solid rgba(212,160,23,0.06)", flexShrink: 0,
          }}>
            {(["all", "pending", "sent", "skipped"] as const).map(f => (
              <button key={f} onClick={() => setFilter(f)} style={{
                flex: 1, padding: "5px 4px", borderRadius: "6px", border: "none",
                background: filter === f ? "rgba(212,160,23,0.12)" : "transparent",
                color: filter === f ? "#d4a017" : "#6b5a3e",
                fontWeight: filter === f ? 700 : 500, fontSize: "10px",
                cursor: "pointer", fontFamily: "inherit",
                textTransform: "capitalize", letterSpacing: "0.02em",
                transition: "all 120ms ease",
              }}>
                {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {/* Review rows */}
          <div style={{ flex: 1, overflowY: "auto" }}>
            {loading ? (
              <div style={{ padding: "32px", textAlign: "center", color: "#6b5a3e", fontSize: "13px" }}>
                Loading…
              </div>
            ) : ordered.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center" }}>
                <div style={{ fontSize: "28px", marginBottom: "8px" }}>🍻</div>
                <p style={{ color: "#6b5a3e", fontSize: "12px", margin: 0 }}>
                  {filter === "all" ? "No reviews yet." : `No ${filter} reviews.`}
                </p>
              </div>
            ) : (
              ordered.map(r => (
                <ReviewRow
                  key={r.id}
                  review={r}
                  selected={r.id === selectedId}
                  onClick={() => {
                    setSelectedId(r.id);
                    setMobileView("detail");
                  }}
                />
              ))
            )}
          </div>
        </div>

        {/* RIGHT — detail panel */}
        <div className="dash-panel-right" style={{
          flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0,
          background: "rgba(20,14,5,0.5)",
        }}>
          {selected ? (
            <ReviewDetail
              key={selected.id}
              review={selected}
              onApprove={handleApprove}
              onSkip={handleSkip}
              onEdit={handleEdit}
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
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            style={{
              position: "fixed", bottom: "24px", left: "50%", transform: "translateX(-50%)",
              background: "#1c1408", border: "1px solid rgba(212,160,23,0.3)",
              borderRadius: "10px", padding: "12px 20px",
              color: "#d4a017", fontSize: "13px", fontWeight: 600,
              boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 100,
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
