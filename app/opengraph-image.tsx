import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Reputation Manager by Zero Clicks";
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
          background: "#f5f3eb",
          color: "#252b25",
          padding: "64px 76px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 35,
            fontWeight: 700,
            paddingBottom: 25,
            borderBottom: "1px solid #252b25",
          }}
        >
          zero clicks
        </div>
        <div
          style={{ display: "flex", flexDirection: "column", paddingTop: 67 }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 82,
              letterSpacing: -5,
              lineHeight: 1.1,
              fontWeight: 700,
            }}
          >
            Reputation Manager
          </div>
          <div
            style={{
              display: "flex",
              width: 690,
              fontSize: 36,
              marginTop: 24,
              lineHeight: 1.35,
            }}
          >
            Google review replies, drafted for your venue. You approve every
            word.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 24,
            color: "#a93220",
          }}
        >
          Less screen. More floor.
        </div>
      </div>
    ),
    size,
  );
}
