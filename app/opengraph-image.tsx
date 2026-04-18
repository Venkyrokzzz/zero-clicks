import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Zero Clicks — AI Automation for UK Hospitality";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: "72px 80px",
          background: "linear-gradient(135deg, #050810 0%, #080c18 50%, #090e1e 100%)",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-200px",
            right: "-200px",
            width: "700px",
            height: "700px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "-100px",
            left: "-100px",
            width: "500px",
            height: "500px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "3px",
            background: "linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6)",
          }}
        />

        {/* Logo + name */}
        <div
          style={{
            position: "absolute",
            top: "56px",
            left: "80px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, #06b6d4, #3b82f6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px",
              fontWeight: "700",
              color: "#fff",
            }}
          >
            Z
          </div>
          <span
            style={{
              fontSize: "22px",
              fontWeight: "700",
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Zero Clicks
          </span>
        </div>

        {/* Tag */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 16px",
            borderRadius: "999px",
            border: "1px solid rgba(6,182,212,0.3)",
            background: "rgba(6,182,212,0.08)",
            marginBottom: "24px",
          }}
        >
          <div
            style={{
              width: "7px",
              height: "7px",
              borderRadius: "50%",
              background: "#06b6d4",
            }}
          />
          <span
            style={{
              fontSize: "14px",
              color: "#06b6d4",
              fontWeight: "600",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            AI Automation · UK Hospitality
          </span>
        </div>

        {/* Headline */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "800",
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-0.04em",
            marginBottom: "24px",
          }}
        >
          You run the pub.
          <br />
          <span style={{ color: "rgba(255,255,255,0.4)" }}>
            AI runs everything else.
          </span>
        </div>

        {/* Subtext */}
        <div
          style={{
            fontSize: "22px",
            color: "rgba(255,255,255,0.55)",
            lineHeight: 1.5,
            maxWidth: "700px",
          }}
        >
          Reviews replied to. Inbox handled. Local search optimised.
          All automated — 48 hrs to go live.
        </div>
      </div>
    ),
    { ...size }
  );
}
