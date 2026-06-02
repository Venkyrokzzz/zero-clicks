"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import ReviewCard from "@/components/ReviewCard";
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

function useAnimatedCounter(target: number, duration = 800) {
  const [value, setValue] = useState(0);
  const prev = useRef(0);
  useEffect(() => {
    if (target === prev.current) return;
    const start = prev.current;
    const diff = target - start;
    const startTime = Date.now();
    const tick = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(start + diff * ease));
      if (progress < 1) requestAnimationFrame(tick);
      else prev.current = target;
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return value;
}

function MetricCard({ label, value, accent, icon, sublabel }: {
  label: string; value: number; accent: string; icon: string; sublabel?: string;
}) {
  const animated = useAnimatedCounter(value);
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      style={{
        background: "linear-gradient(135deg, #1c1408 0%, #140e05 100%)",
        border: `1px solid ${accent}25`,
        borderRadius: "14px", padding: "20px 22px",
        position: "relative", overflow: "hidden",
        cursor: "default",
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
    >
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "80px", height: "80px",
        background: `radial-gradient(circle at 80% 20%, ${accent}18, transparent 70%)`,
        pointerEvents: "none",
      }} />
      <div style={{ fontSize: "20px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "2rem", fontWeight: 800, color: accent, letterSpacing: "-0.04em", lineHeight: 1 }}>
        {animated}
      </div>
      <div style={{ fontSize: "12px", color: "#a89070", fontWeight: 600, marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </div>
      {sublabel && <div style={{ fontSize: "11px", color: "#6b5a3e", marginTop: "2px" }}>{sublabel}</div>}
    </motion.div>
  );
}

function LiveBadge({ lastUpdated }: { lastUpdated: Date | null }) {
  const [, setTick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 30000);
    return () => clearInterval(id);
  }, []);
  const mins = lastUpdated ? Math.floor((Date.now() - lastUpdated.getTime()) / 60000) : null;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
      <motion.div
        animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        style={{ width: "7px", height: "7px", borderRadius: "50%", background: "#4a8c5c", boxShadow: "0 0 8px #4a8c5c" }}
      />
      <span style={{ fontSize: "11px", color: "#6b5a3e", fontWeight: 600, letterSpacing: "0.04em" }}>
        {mins === null ? "LIVE" : mins < 1 ? "JUST UPDATED" : `UPDATED ${mins}m AGO`}
      </span>
    </div>
  );
}

function SectionDivider({ title, color, count }: { title: string; color: string; count: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to right, ${color}40, transparent)` }} />
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <span style={{ fontSize: "11px", fontWeight: 800, color, letterSpacing: "0.1em", textTransform: "uppercase" }}>{title}</span>
        <span style={{
          fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "20px",
          background: `${color}20`, color, border: `1px solid ${color}40`,
        }}>{count}</span>
      </div>
      <div style={{ flex: 1, height: "1px", background: `linear-gradient(to left, ${color}40, transparent)` }} />
    </div>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => { const t = setTimeout(onClose, 3000); return () => clearTimeout(t); }, [onClose]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 32, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
      style={{
        position: "fixed", bottom: "80px", left: "50%", transform: "translateX(-50%)",
        background: "#1c1408", border: "1px solid #d4a01740",
        borderRadius: "10px", padding: "12px 20px",
        color: "#d4a017", fontSize: "13px", fontWeight: 600,
        boxShadow: "0 8px 32px rgba(0,0,0,0.6)", zIndex: 100,
        display: "flex", alignItems: "center", gap: "8px",
      }}
    >
      <span>🍺</span> {message}
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ totalReviews: 0, negativeCount: 0, pendingCount: 0, sentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [hasGoogle, setHasGoogle] = useState<boolean | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "sent" | "skipped">("all");

  useEffect(() => {
    fetchReviews();
    checkGoogleConnection();
  }, []);

  async function fetchReviews() {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      setReviews(data.reviews || []);
      setMetrics(data.metrics || metrics);
      setLastUpdated(new Date());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function checkGoogleConnection() {
    try {
      const res = await fetch("/api/integrations/google");
      const data = await res.json();
      setHasGoogle(!!data.connected);
    } catch { setHasGoogle(false); }
  }

  async function handleApprove(reviewId: string, draft?: string) {
    await fetch(`/api/reviews`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reviewId, status: "sent", ...(draft ? { draft_response: draft } : {}) }),
    });
    setToast("Reply sent — guest will feel heard 🎯");
    fetchReviews();
  }

  async function handleEdit(reviewId: string, newDraft: string) {
    await fetch(`/api/reviews`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reviewId, draft_response: newDraft }),
    });
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, draft_response: newDraft } : r));
    setToast("Draft saved");
  }

  async function handleSkip(reviewId: string) {
    await fetch(`/api/reviews`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reviewId, status: "skipped" }),
    });
    fetchReviews();
  }

  const allReviews = reviews.filter(r => {
    if (filter === "all") return true;
    return r.status === filter;
  });

  const flagged = allReviews.filter(r => r.rating <= 2 && r.status === "pending");
  const pending = allReviews.filter(r => r.status === "pending" && r.rating > 2);
  const sent = allReviews.filter(r => r.status === "sent");
  const skipped = allReviews.filter(r => r.status === "skipped");

  const pubName = user?.publicMetadata?.business_name as string || user?.firstName ? `${user?.firstName}'s venue` : "Your Pub";

  return (
    <div style={{ minHeight: "100vh", background: "#0d0a06", color: "#f5e6c8", padding: "32px 24px 100px" }}>
      <style>{`
        * { box-sizing: border-box; }
        .filter-tab { transition: all 150ms ease; }
        .filter-tab:hover { background: rgba(212,160,23,0.1) !important; color: #d4a017 !important; }
        @media (max-width: 640px) {
          .metrics-grid { grid-template-columns: 1fr 1fr !important; }
          .dash-header { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important; }
        }
      `}</style>

      <div style={{ maxWidth: "960px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          className="dash-header"
          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}
        >
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
              <span style={{ fontSize: "22px" }}>🍺</span>
              <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#f5e6c8", margin: 0, letterSpacing: "-0.02em" }}>
                {pubName}
              </h1>
            </div>
            <p style={{ margin: 0, fontSize: "13px", color: "#6b5a3e" }}>
              Review management dashboard
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <LiveBadge lastUpdated={lastUpdated} />
            <button
              onClick={fetchReviews}
              style={{
                background: "rgba(212,160,23,0.08)", border: "1px solid rgba(212,160,23,0.2)",
                borderRadius: "8px", padding: "7px 14px", color: "#d4a017",
                fontSize: "12px", fontWeight: 600, cursor: "pointer",
                fontFamily: "inherit", transition: "all 150ms ease",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.16)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "rgba(212,160,23,0.08)"; }}
            >
              ↻ Refresh
            </button>
          </div>
        </motion.div>

        {/* Trial banner */}
        <TrialBanner />

        {/* Google connect banner */}
        {hasGoogle === false && (
          <motion.div
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
            style={{
              background: "rgba(212,160,23,0.07)", border: "1px solid rgba(212,160,23,0.3)",
              borderRadius: "12px", padding: "16px 20px", marginBottom: "24px",
              display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "18px" }}>🔌</span>
              <span style={{ color: "#d4a017", fontWeight: 600, fontSize: "14px" }}>
                Connect your Google Business Profile to start receiving reviews automatically.
              </span>
            </div>
            <a href="/connect" style={{
              background: "#d4a017", color: "#0d0a06", fontWeight: 800,
              padding: "9px 18px", borderRadius: "8px", textDecoration: "none",
              fontSize: "13px", whiteSpace: "nowrap",
            }}>
              Connect →
            </a>
          </motion.div>
        )}

        {/* Metrics */}
        <div className="metrics-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "32px" }}>
          <MetricCard label="Total Reviews" value={metrics.totalReviews} accent="#d4a017" icon="📋" />
          <MetricCard label="Flagged" value={metrics.negativeCount} accent="#c0392b" icon="🚨" sublabel="1–2 star" />
          <MetricCard label="Awaiting Reply" value={metrics.pendingCount} accent="#e8923a" icon="⏳" />
          <MetricCard label="Replies Sent" value={metrics.sentCount} accent="#4a8c5c" icon="✓" sublabel="this month" />
        </div>

        {/* Filter tabs */}
        <div style={{ display: "flex", gap: "6px", marginBottom: "28px", background: "#140e05", borderRadius: "10px", padding: "5px" }}>
          {(["all", "pending", "sent", "skipped"] as const).map(f => (
            <button
              key={f}
              className="filter-tab"
              onClick={() => setFilter(f)}
              style={{
                flex: 1, padding: "8px 12px", borderRadius: "7px", border: "none",
                background: filter === f ? "rgba(212,160,23,0.15)" : "transparent",
                color: filter === f ? "#d4a017" : "#6b5a3e",
                fontWeight: filter === f ? 700 : 500, fontSize: "12px",
                cursor: "pointer", fontFamily: "inherit",
                textTransform: "capitalize", letterSpacing: "0.02em",
                borderBottom: filter === f ? "2px solid #d4a017" : "2px solid transparent",
              }}
            >
              {f === "all" ? "All Reviews" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              style={{ fontSize: "32px", display: "inline-block", marginBottom: "16px" }}>🍺</motion.div>
            <p style={{ color: "#6b5a3e", fontSize: "14px" }}>Pulling in your reviews…</p>
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 24px" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>🍻</div>
            <p style={{ color: "#a89070", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>Nothing here yet.</p>
            <p style={{ color: "#6b5a3e", fontSize: "13px" }}>Once your Google profile is connected, reviews will appear here automatically.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

            {/* Flagged */}
            {flagged.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SectionDivider title="Flagged — needs attention" color="#c0392b" count={flagged.length} />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {flagged.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                      <ReviewCard review={mapReview(r)} onApprove={handleApprove} onSkip={handleSkip} onEdit={handleEdit} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pending */}
            {pending.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SectionDivider title="Awaiting your approval" color="#e8923a" count={pending.length} />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {pending.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
                      <ReviewCard review={mapReview(r)} onApprove={handleApprove} onSkip={handleSkip} onEdit={handleEdit} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Sent */}
            {sent.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SectionDivider title="Replies sent" color="#4a8c5c" count={sent.length} />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {sent.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                      <ReviewCard review={mapReview(r)} onApprove={handleApprove} onSkip={handleSkip} onEdit={handleEdit} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Skipped */}
            {skipped.length > 0 && filter !== "all" && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <SectionDivider title="Skipped" color="#6b5a3e" count={skipped.length} />
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {skipped.map((r, i) => (
                    <motion.div key={r.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                      <ReviewCard review={mapReview(r)} onApprove={handleApprove} onSkip={handleSkip} onEdit={handleEdit} />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

          </div>
        )}
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      </AnimatePresence>
    </div>
  );
}

function mapReview(r: Review) {
  return {
    id: r.id,
    reviewer: r.reviewer_name,
    rating: r.rating,
    sentiment: r.sentiment,
    summary: r.summary,
    draftResponse: r.draft_response,
    reviewText: r.review_text,
    timestamp: r.created_at,
    status: r.status,
    escalationReason: r.escalation_reason,
  };
}
