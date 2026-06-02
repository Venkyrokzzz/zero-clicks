"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Review {
  id: string;
  reviewer: string;
  rating?: number;
  sentiment: string;
  summary: string;
  draftResponse: string;
  reviewText?: string;
  timestamp: string;
  status: "pending" | "approved" | "sent" | "skipped";
  escalationReason: string;
}

interface ReviewCardProps {
  review: Review;
  onApprove: (id: string, draft?: string) => void;
  onSkip?: (id: string) => void;
  onEdit?: (id: string, newDraft: string) => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <span style={{ letterSpacing: "2px", fontSize: "12px" }}>
      {[1, 2, 3, 4, 5].map(i => (
        <span key={i} style={{ color: i <= rating ? "#d4a017" : "rgba(212,160,23,0.15)" }}>★</span>
      ))}
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}
      style={{
        background: copied ? "rgba(74,140,92,0.15)" : "rgba(212,160,23,0.08)",
        border: `1px solid ${copied ? "rgba(74,140,92,0.3)" : "rgba(212,160,23,0.2)"}`,
        borderRadius: "6px", color: copied ? "#4a8c5c" : "#a89070",
        fontSize: "10px", fontWeight: 700, padding: "3px 10px",
        cursor: "pointer", transition: "all 200ms ease",
        fontFamily: "inherit", letterSpacing: "0.05em", textTransform: "uppercase",
      }}
    >
      {copied ? "✓ Copied" : "Copy"}
    </button>
  );
}

export default function ReviewCard({ review, onApprove, onSkip, onEdit }: ReviewCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(review.draftResponse || "");
  const [showReview, setShowReview] = useState(false);

  const isFlagged = (review.rating ?? 5) <= 2 && review.status === "pending";
  const isPending = review.status === "pending";

  const sentimentConfig: Record<string, { color: string; label: string }> = {
    positive: { color: "#4a8c5c", label: "Positive" },
    POSITIVE: { color: "#4a8c5c", label: "Positive" },
    negative: { color: "#c0392b", label: "Negative" },
    NEGATIVE: { color: "#c0392b", label: "Negative" },
    neutral: { color: "#e8923a", label: "Neutral" },
    NEUTRAL: { color: "#e8923a", label: "Neutral" },
  };
  const sentiment = sentimentConfig[review.sentiment] ?? { color: "#a89070", label: review.sentiment };

  const statusConfig: Record<string, { color: string; label: string; icon: string }> = {
    pending: { color: "#e8923a", label: "Pending", icon: "⏳" },
    approved: { color: "#d4a017", label: "Approved", icon: "✓" },
    sent: { color: "#4a8c5c", label: "Sent", icon: "✓" },
    skipped: { color: "#6b5a3e", label: "Skipped", icon: "—" },
  };
  const statusStyle = statusConfig[review.status] ?? statusConfig.pending;

  function handleSave() {
    onEdit?.(review.id, draft);
    setEditing(false);
  }
  function handleCancel() {
    setDraft(review.draftResponse || "");
    setEditing(false);
  }

  return (
    <motion.div
      layout
      style={{
        background: isFlagged
          ? "linear-gradient(135deg, #1c0c0a 0%, #140a08 100%)"
          : "linear-gradient(135deg, #1c1408 0%, #140e05 100%)",
        border: isFlagged
          ? "1px solid rgba(192,57,43,0.3)"
          : "1px solid rgba(212,160,23,0.12)",
        borderRadius: "14px", overflow: "hidden",
        position: "relative",
      }}
      whileHover={{
        borderColor: isFlagged ? "rgba(192,57,43,0.5)" : "rgba(212,160,23,0.28)",
        boxShadow: isFlagged
          ? "0 4px 32px rgba(192,57,43,0.12)"
          : "0 4px 32px rgba(212,160,23,0.08)",
        transition: { duration: 0.15 },
      }}
    >
      {/* Flagged accent bar */}
      {isFlagged && (
        <div style={{ height: "3px", background: "linear-gradient(to right, #c0392b, #e74c3c, transparent)" }} />
      )}

      {/* Header */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 18px 12px",
        borderBottom: "1px solid rgba(212,160,23,0.07)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "34px", height: "34px", borderRadius: "50%", flexShrink: 0,
            background: isFlagged
              ? "linear-gradient(135deg, #7a1c10, #c0392b)"
              : "linear-gradient(135deg, #5c3d0a, #d4a017)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "13px", fontWeight: 800, color: "#f5e6c8",
          }}>
            {(review.reviewer || "?")[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: "14px", fontWeight: 700, color: "#f5e6c8", lineHeight: 1.2 }}>
              {review.reviewer || "Anonymous"}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "3px" }}>
              {review.rating !== undefined && <Stars rating={review.rating} />}
              <span style={{ fontSize: "11px", color: "#6b5a3e" }}>
                {new Date(review.timestamp).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "2-digit" })}
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px",
            background: `${sentiment.color}18`, color: sentiment.color,
            border: `1px solid ${sentiment.color}35`,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>{sentiment.label}</span>
          <span style={{
            fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "20px",
            background: `${statusStyle.color}18`, color: statusStyle.color,
            border: `1px solid ${statusStyle.color}35`,
            textTransform: "uppercase", letterSpacing: "0.06em",
          }}>{statusStyle.icon} {statusStyle.label}</span>
        </div>
      </div>

      <div style={{ padding: "14px 18px 16px", display: "flex", flexDirection: "column", gap: "12px" }}>

        {/* Escalation */}
        {review.escalationReason && (
          <div style={{
            background: "rgba(192,57,43,0.08)", border: "1px solid rgba(192,57,43,0.25)",
            borderRadius: "8px", padding: "10px 13px",
            display: "flex", alignItems: "flex-start", gap: "8px",
          }}>
            <span style={{ fontSize: "13px", flexShrink: 0 }}>⚠</span>
            <p style={{ margin: 0, fontSize: "12px", color: "#e74c3c", fontWeight: 600, lineHeight: 1.4 }}>
              {review.escalationReason}
            </p>
          </div>
        )}

        {/* Summary */}
        <p style={{ margin: 0, fontSize: "13px", color: "#a89070", lineHeight: 1.65 }}>
          {review.summary}
        </p>

        {/* Original review toggle */}
        {review.reviewText && (
          <div>
            <button
              onClick={() => setShowReview(v => !v)}
              style={{
                background: "none", border: "none", padding: 0, cursor: "pointer",
                fontSize: "11px", color: "#6b5a3e", fontWeight: 600,
                letterSpacing: "0.04em", display: "flex", alignItems: "center", gap: "5px",
                fontFamily: "inherit",
              }}
            >
              <span style={{ fontSize: "8px" }}>{showReview ? "▲" : "▼"}</span>
              {showReview ? "Hide original review" : "Show original review"}
            </button>
            <AnimatePresence>
              {showReview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: "hidden" }}
                >
                  <div style={{
                    marginTop: "8px", padding: "12px 14px", borderRadius: "8px",
                    background: "rgba(212,160,23,0.04)", border: "1px solid rgba(212,160,23,0.1)",
                    fontSize: "13px", color: "#6b5a3e", lineHeight: 1.65, fontStyle: "italic",
                  }}>
                    &ldquo;{review.reviewText}&rdquo;
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Draft */}
        {(draft || editing) && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <span style={{ fontSize: "10px", color: "#6b5a3e", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                AI Draft Reply
              </span>
              {!editing && review.status !== "sent" && <CopyButton text={draft} />}
            </div>

            {editing ? (
              <>
                <textarea
                  value={draft}
                  onChange={e => setDraft(e.target.value)}
                  rows={5}
                  autoFocus
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(212,160,23,0.05)", border: "1px solid rgba(212,160,23,0.35)",
                    borderRadius: "8px", padding: "12px 14px",
                    color: "#f5e6c8", fontSize: "13px", lineHeight: 1.65,
                    resize: "vertical", fontFamily: "inherit", outline: "none",
                  }}
                />
                <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                  <button onClick={handleSave} style={{
                    flex: 1, padding: "10px", borderRadius: "8px", border: "none",
                    background: "#d4a017", color: "#0d0a06",
                    fontWeight: 800, fontSize: "13px", cursor: "pointer", fontFamily: "inherit",
                    transition: "opacity 150ms ease",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                    onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                  >Save changes</button>
                  <button onClick={handleCancel} style={{
                    flex: 1, padding: "10px", borderRadius: "8px",
                    border: "1px solid rgba(212,160,23,0.15)", background: "rgba(212,160,23,0.04)",
                    color: "#6b5a3e", fontWeight: 600, fontSize: "13px",
                    cursor: "pointer", fontFamily: "inherit",
                  }}>Cancel</button>
                </div>
              </>
            ) : (
              <div style={{
                background: "rgba(212,160,23,0.04)", border: "1px solid rgba(212,160,23,0.1)",
                borderRadius: "8px", padding: "12px 14px",
                fontSize: "13px", color: "#c8a96e", lineHeight: 1.65,
              }}>
                {draft}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        {isPending && !editing && (
          <div style={{ display: "flex", gap: "8px", paddingTop: "4px" }}>
            <motion.button
              onClick={() => onApprove(review.id, draft)}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 2, padding: "11px 16px", borderRadius: "9px", border: "none",
                background: "linear-gradient(135deg, #4a8c5c, #3d7a4e)",
                color: "#fff", fontWeight: 700, fontSize: "13px",
                cursor: "pointer", fontFamily: "inherit",
                boxShadow: "0 2px 12px rgba(74,140,92,0.3)",
              }}
              whileHover={{ boxShadow: "0 4px 20px rgba(74,140,92,0.45)" }}
            >
              ✓ Approve & Send
            </motion.button>
            <motion.button
              onClick={() => setEditing(true)}
              whileTap={{ scale: 0.97 }}
              style={{
                flex: 1, padding: "11px 16px", borderRadius: "9px",
                border: "1px solid rgba(212,160,23,0.25)",
                background: "rgba(212,160,23,0.06)",
                color: "#a89070", fontWeight: 600, fontSize: "13px",
                cursor: "pointer", fontFamily: "inherit",
              }}
              whileHover={{ background: "rgba(212,160,23,0.12)", color: "#d4a017" }}
            >
              ✎ Edit
            </motion.button>
            {onSkip && (
              <motion.button
                onClick={() => onSkip(review.id)}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: "11px 14px", borderRadius: "9px",
                  border: "1px solid rgba(212,160,23,0.12)", background: "none",
                  color: "#6b5a3e", fontWeight: 600, fontSize: "13px",
                  cursor: "pointer", fontFamily: "inherit",
                }}
                whileHover={{ color: "#c0392b", borderColor: "rgba(192,57,43,0.3)", background: "rgba(192,57,43,0.06)" }}
                title="Skip"
              >✕</motion.button>
            )}
          </div>
        )}

        {review.status === "sent" && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            padding: "10px", borderRadius: "8px",
            background: "rgba(74,140,92,0.08)", border: "1px solid rgba(74,140,92,0.2)",
            color: "#4a8c5c", fontSize: "12px", fontWeight: 700,
          }}>
            <span>✓</span> Reply sent — guest notified
          </div>
        )}

        {review.status === "skipped" && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "10px", borderRadius: "8px",
            background: "rgba(107,90,62,0.06)", border: "1px solid rgba(107,90,62,0.15)",
            color: "#6b5a3e", fontSize: "12px", fontWeight: 600,
          }}>
            Skipped
          </div>
        )}
      </div>
    </motion.div>
  );
}
