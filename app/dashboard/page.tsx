"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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

export default function Dashboard() {
  const { user } = useUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [metrics, setMetrics] = useState<Metrics>({ totalReviews: 0, negativeCount: 0, pendingCount: 0, sentCount: 0 });
  const [loading, setLoading] = useState(true);
  const [hasGoogle, setHasGoogle] = useState<boolean | null>(null);

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
    } catch {
      setHasGoogle(false);
    }
  }

  async function handleApprove(reviewId: string) {
    await fetch(`/api/reviews`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: reviewId, status: "sent" }),
    });
    fetchReviews();
  }

  const flagged = reviews.filter(r => r.rating <= 2 && r.status === "pending");
  const pending = reviews.filter(r => r.status === "pending" && r.rating > 2);
  const sent = reviews.filter(r => r.status === "sent");

  return (
    <div style={{ minHeight: "100vh", color: "#fff", padding: "40px 24px 80px" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "4px" }}>
            Hey {user?.firstName || "there"} 👋
          </h1>
          <p style={{ color: "#a1a1aa" }}>Here&apos;s what&apos;s happening with your reviews.</p>
        </motion.div>

        {/* Trial banner */}
        <TrialBanner />

        {/* Google connect banner */}
        {hasGoogle === false && (
          <div style={{ background: "rgba(245,158,11,0.1)", border: "1px solid #f59e0b", borderRadius: "12px", padding: "16px 20px", marginBottom: "28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ color: "#f59e0b", fontWeight: 500 }}>Connect your Google Business Profile to start receiving reviews.</span>
            <a href="/connect" style={{ background: "#f59e0b", color: "#000", fontWeight: 700, padding: "8px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "0.9rem" }}>
              Connect →
            </a>
          </div>
        )}

        {/* Metrics */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "36px" }}>
          {[
            { label: "Total Reviews", value: metrics.totalReviews, icon: "📊" },
            { label: "Flagged", value: metrics.negativeCount, icon: "🚨" },
            { label: "Pending Approval", value: metrics.pendingCount, icon: "⏳" },
            { label: "Replies Sent", value: metrics.sentCount, icon: "✅" },
          ].map(m => (
            <div key={m.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "1.5rem", marginBottom: "4px" }}>{m.icon}</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 700 }}>{m.value}</div>
              <div style={{ color: "#a1a1aa", fontSize: "0.85rem" }}>{m.label}</div>
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "48px", color: "#a1a1aa" }}>Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px", color: "#a1a1aa" }}>
            No reviews yet. Once your Google profile is connected, replies will appear here automatically.
          </div>
        ) : (
          <>
            {/* Flagged */}
            {flagged.length > 0 && (
              <Section title="🚨 Flagged — needs attention" color="#ef4444">
                {flagged.map((r, i) => <AnimatedReview key={r.id} review={r} index={i} onApprove={handleApprove} />)}
              </Section>
            )}

            {/* Pending */}
            {pending.length > 0 && (
              <Section title="⏳ Pending approval" color="#f59e0b">
                {pending.map((r, i) => <AnimatedReview key={r.id} review={r} index={i} onApprove={handleApprove} />)}
              </Section>
            )}

            {/* Sent */}
            {sent.length > 0 && (
              <Section title="✅ Sent" color="#22c55e">
                {sent.map((r, i) => <AnimatedReview key={r.id} review={r} index={i} onApprove={handleApprove} />)}
              </Section>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Section({ title, color, children }: { title: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ fontSize: "1.1rem", fontWeight: 600, color, marginBottom: "16px" }}>{title}</h2>
      <div style={{ display: "grid", gap: "16px" }}>{children}</div>
    </div>
  );
}

function AnimatedReview({ review, index, onApprove }: { review: Review; index: number; onApprove: (id: string) => void }) {
  // Map Supabase shape to ReviewCard expected shape
  const mapped = {
    id: review.id,
    reviewer: review.reviewer_name,
    sentiment: review.sentiment,
    summary: review.summary,
    draftResponse: review.draft_response,
    timestamp: review.created_at,
    status: review.status as "pending" | "approved" | "sent",
    escalationReason: review.escalation_reason,
  };
  return (
    <motion.div key={review.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: index * 0.08 }}>
      <ReviewCard review={mapped} onApprove={onApprove} />
    </motion.div>
  );
}
