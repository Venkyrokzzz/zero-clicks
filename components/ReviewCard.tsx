"use client";

import { motion } from "framer-motion";
import MagneticButton from "./MagneticButton";

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

interface ReviewCardProps {
  review: Review;
  onApprove: (id: string) => void;
}

export default function ReviewCard({ review, onApprove }: ReviewCardProps) {
  const getSentimentColor = (sentiment: string) => {
    if (sentiment.includes("NEGATIVE") || sentiment.includes("negative"))
      return "#ff6d5a";
    if (sentiment.includes("POSITIVE") || sentiment.includes("positive"))
      return "#10b981";
    return "#f59e0b";
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "sent":
        return "#10b981";
      case "approved":
        return "#3b82f6";
      case "pending":
      default:
        return "#f59e0b";
    }
  };

  return (
    <div
      style={{
        background: "rgba(20, 20, 25, 0.8)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "16px",
        padding: "24px",
        transition: "all 0.3s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 109, 90, 0.2)";
        e.currentTarget.style.background = "rgba(20, 20, 25, 1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
        e.currentTarget.style.background = "rgba(20, 20, 25, 0.8)";
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "16px",
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: "1.1rem",
              fontWeight: 600,
              color: "#ffffff",
              margin: "0 0 4px 0",
            }}
          >
            {review.reviewer}
          </h3>
          <p style={{ fontSize: "0.85rem", color: "#a1a1aa", margin: 0 }}>
            {new Date(review.timestamp).toLocaleDateString()}
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          {/* Sentiment Badge */}
          <div
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              background: `${getSentimentColor(review.sentiment)}20`,
              border: `1px solid ${getSentimentColor(review.sentiment)}`,
              color: getSentimentColor(review.sentiment),
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {review.sentiment}
          </div>

          {/* Status Badge */}
          <div
            style={{
              padding: "6px 12px",
              borderRadius: "8px",
              background: `${getStatusBadgeColor(review.status)}20`,
              border: `1px solid ${getStatusBadgeColor(review.status)}`,
              color: getStatusBadgeColor(review.status),
              fontSize: "0.75rem",
              fontWeight: 600,
              textTransform: "uppercase",
            }}
          >
            {review.status}
          </div>
        </div>
      </div>

      {/* Issue Summary */}
      <div style={{ marginBottom: "16px" }}>
        <p
          style={{
            fontSize: "0.95rem",
            color: "#d4d4d8",
            lineHeight: 1.6,
            margin: 0,
            fontWeight: 500,
          }}
        >
          {review.summary}
        </p>
      </div>

      {/* Escalation Reason (if exists) */}
      {review.escalationReason && (
        <div
          style={{
            background: "rgba(255, 109, 90, 0.08)",
            border: "1px solid rgba(255, 109, 90, 0.2)",
            borderRadius: "8px",
            padding: "12px",
            marginBottom: "16px",
          }}
        >
          <p
            style={{
              fontSize: "0.85rem",
              color: "#ff6d5a",
              margin: 0,
              fontWeight: 500,
            }}
          >
            🚨 Escalation: {review.escalationReason}
          </p>
        </div>
      )}

      {/* Draft Response */}
      <div style={{ marginBottom: "16px" }}>
        <p
          style={{
            fontSize: "0.85rem",
            color: "#a1a1aa",
            margin: "0 0 8px 0",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          Draft Response
        </p>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "8px",
            padding: "12px",
            fontSize: "0.9rem",
            color: "#d4d4d8",
            lineHeight: 1.6,
            maxHeight: "200px",
            overflowY: "auto",
          }}
        >
          {review.draftResponse}
        </div>
      </div>

      {/* Actions */}
      {review.status === "pending" && (
        <div style={{ display: "flex", gap: "12px" }}>
          <div style={{ flex: 1 }}>
            <MagneticButton onClick={() => onApprove(review.id)}>
              ✓ Approve & Send
            </MagneticButton>
          </div>
          <button
            style={{
              flex: 1,
              padding: "12px 20px",
              background: "rgba(255, 255, 255, 0.05)",
              color: "#a1a1aa",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "8px",
              fontWeight: 600,
              cursor: "pointer",
              fontSize: "0.95rem",
              transition: "all 0.2s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
            }}
          >
            ✎ Edit
          </button>
        </div>
      )}

      {review.status === "sent" && (
        <div
          style={{
            padding: "12px",
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            borderRadius: "8px",
            textAlign: "center",
            color: "#10b981",
            fontSize: "0.9rem",
            fontWeight: 500,
          }}
        >
          ✓ Response sent successfully
        </div>
      )}
    </div>
  );
}
