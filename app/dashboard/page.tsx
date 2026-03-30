"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ReviewCard from "@/components/ReviewCard";
import MetricsCard from "@/components/MetricsCard";

interface Review {
  id: string;
  reviewer: string;
  sentiment: string;
  summary: string;
  draftResponse: string;
  timestamp: string;
  status: "pending" | "approved" | "sent";
  escalationReason: string;
}

export default function Dashboard() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalReviews: 0,
    negativeCount: 0,
    avgResponseTime: "2.5 hrs",
    sentimentTrend: "+12%",
  });

  useEffect(() => {
    // Fetch reviews from API
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch("/api/reviews");
      const data = await response.json();
      setReviews(data.reviews || []);
      setMetrics(data.metrics || metrics);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      await fetch(`/api/reviews/${reviewId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "sent" }),
      });
      fetchReviews();
    } catch (error) {
      console.error("Failed to approve review:", error);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
        padding: "32px 24px",
        color: "#ffffff",
      }}
    >
      {/* Header */}
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: "48px" }}
        >
          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              marginBottom: "8px",
              background: "linear-gradient(to right, #ffffff, #a1a1aa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Review Manager
          </h1>
          <p style={{ color: "#a1a1aa", fontSize: "1rem" }}>
            AI-powered reputation management for your business
          </p>
        </motion.div>

        {/* Metrics Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "24px",
            marginBottom: "48px",
          }}
        >
          <MetricsCard label="Total Reviews" value={metrics.totalReviews} icon="📊" />
          <MetricsCard label="Negative Reviews" value={metrics.negativeCount} icon="⚠️" />
          <MetricsCard label="Avg Response Time" value={metrics.avgResponseTime} icon="⏱️" />
          <MetricsCard label="Sentiment Trend" value={metrics.sentimentTrend} icon="📈" />
        </div>

        {/* Reviews List */}
        <div>
          <h2
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginBottom: "24px",
              color: "#ffffff",
            }}
          >
            Recent Reviews
          </h2>

          {loading ? (
            <div style={{ textAlign: "center", padding: "48px", color: "#a1a1aa" }}>
              Loading reviews...
            </div>
          ) : reviews.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px", color: "#a1a1aa" }}>
              No reviews yet. Your AI responses will appear here.
            </div>
          ) : (
            <div style={{ display: "grid", gap: "20px" }}>
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ReviewCard review={review} onApprove={handleApprove} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
