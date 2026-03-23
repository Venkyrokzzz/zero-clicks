"use client";

export default function CalendlyButton() {
  return (
    <a
      href="https://calendly.com/zeroclicks"
      target="_blank"
      rel="noopener noreferrer"
      style={{
        marginTop: "8px",
        display: "block",
        width: "100%",
        padding: "14px",
        background: "var(--accent)",
        color: "#fff",
        borderRadius: "8px",
        textDecoration: "none",
        fontFamily: "var(--font-body)",
        fontWeight: 600,
        fontSize: "14px",
        textAlign: "center",
        boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
        transition: "opacity 200ms ease, transform 200ms ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "0.88";
        (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.opacity = "1";
        (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
      }}
    >
      Book a free 30-min call →
    </a>
  );
}
