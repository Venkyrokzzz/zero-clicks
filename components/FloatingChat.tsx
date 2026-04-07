"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type State = "idle" | "sending" | "sent" | "error";

export default function FloatingChat() {
  const [open, setOpen] = useState(false);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<State>("idle");
  const msgRef = useRef<HTMLTextAreaElement>(null);

  // Show bubble nudge after 8s if not opened
  useEffect(() => {
    const t = setTimeout(() => setBubbleVisible(true), 8000);
    return () => clearTimeout(t);
  }, []);

  const handleOpen = () => {
    setOpen(true);
    setBubbleVisible(false);
    setTimeout(() => msgRef.current?.focus(), 200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || "Anonymous",
          email: email || "noreply@zeroclicks.hq",
          message,
          company: "Chat widget",
        }),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setState("sent");
      } else {
        setState("error");
      }
    } catch {
      setState("error");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "6px",
    color: "#e4e4e7",
    fontSize: "13px",
    fontFamily: "var(--font-body)",
    padding: "9px 12px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 150ms ease",
  };

  return (
    <>
      {/* Bubble nudge */}
      <AnimatePresence>
        {bubbleVisible && !open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: "86px",
              right: "24px",
              zIndex: 41,
              background: "rgba(18,18,22,0.96)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "12px",
              padding: "12px 14px",
              maxWidth: "210px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
              backdropFilter: "blur(16px)",
            }}
          >
            <button
              onClick={() => setBubbleVisible(false)}
              aria-label="Dismiss"
              style={{
                position: "absolute", top: "8px", right: "8px",
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px",
                cursor: "pointer", color: "#71717a",
                fontSize: "10px", fontWeight: 700,
                lineHeight: 1, padding: "3px 5px",
              }}
            >✕</button>
            <p style={{ fontSize: "13px", color: "#f4f4f5", fontFamily: "var(--font-body)", fontWeight: 500, margin: "0 0 4px", paddingRight: "12px" }}>
              Have a question?
            </p>
            <p style={{ fontSize: "12px", color: "#71717a", fontFamily: "var(--font-body)", margin: "0 0 10px" }}>
              Ask us anything — what to automate, how it works, what it costs.
            </p>
            <button
              onClick={handleOpen}
              style={{ fontSize: "12px", fontWeight: 600, color: "#60a5fa", fontFamily: "var(--font-body)", background: "none", border: "none", cursor: "pointer", padding: 0 }}
            >
              Ask us →
            </button>
            {/* pointer */}
            <div style={{ position: "absolute", bottom: "-6px", right: "22px", width: "10px", height: "10px", background: "rgba(18,18,22,0.96)", border: "1px solid rgba(255,255,255,0.1)", borderTop: "none", borderLeft: "none", transform: "rotate(45deg)" }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: "86px",
              right: "24px",
              zIndex: 41,
              width: "320px",
              background: "rgba(12,12,16,0.97)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: "14px",
              overflow: "hidden",
              boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", borderBottom: "1px solid rgba(255,255,255,0.07)", background: "rgba(255,255,255,0.03)" }}>
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#f4f4f5", fontFamily: "var(--font-body)", margin: 0 }}>Got a question?</p>
                <p style={{ fontSize: "11px", color: "#52525b", fontFamily: "var(--font-body)", margin: "2px 0 0" }}>We reply within a few hours</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: "#a1a1aa",
                  fontSize: "11px",
                  fontWeight: 600,
                  fontFamily: "var(--font-body)",
                  padding: "4px 9px",
                  lineHeight: 1.4,
                  letterSpacing: "0.02em",
                }}
              >Close</button>
            </div>

            {state === "sent" ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{ padding: "32px 20px", textAlign: "center" }}
              >
                <div style={{ fontSize: "28px", marginBottom: "12px" }}>✓</div>
                <p style={{ fontSize: "14px", color: "#f4f4f5", fontFamily: "var(--font-body)", fontWeight: 500, margin: "0 0 6px" }}>Message sent.</p>
                <p style={{ fontSize: "12px", color: "#71717a", fontFamily: "var(--font-body)", margin: "0 0 20px" }}>We reply within a few hours.</p>
                <button
                  onClick={() => { setOpen(false); setState("idle"); setName(""); setEmail(""); setMessage(""); }}
                  style={{ fontSize: "12px", color: "#60a5fa", background: "none", border: "none", cursor: "pointer", fontFamily: "var(--font-body)" }}
                >
                  Close
                </button>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} style={{ padding: "16px" }}>
                {/* Prompt line */}
                <div style={{ marginBottom: "14px" }}>
                  <p style={{ fontSize: "13px", color: "#a1a1aa", fontFamily: "var(--font-body)", margin: 0, lineHeight: 1.5 }}>
                    Tell us what&apos;s slowing you down — we&apos;ll suggest what to automate first.
                  </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                    <input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                      style={inputStyle}
                    />
                    <input
                      type="email"
                      placeholder="Your email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      onFocus={e => (e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)")}
                      onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                      style={inputStyle}
                    />
                  </div>

                  <textarea
                    ref={msgRef}
                    required
                    rows={4}
                    placeholder="e.g. I want to automate my inbox and reply to reviews automatically..."
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    onFocus={e => (e.currentTarget.style.borderColor = "rgba(96,165,250,0.5)")}
                    onBlur={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                    style={{ ...inputStyle, resize: "none" }}
                  />

                  {state === "error" && (
                    <p style={{ fontSize: "11px", color: "#f87171", fontFamily: "var(--font-body)", margin: 0 }}>
                      Failed to send. Email us at zeroclicks.hq@gmail.com
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={state === "sending" || !message.trim()}
                    style={{
                      background: state === "sending" ? "rgba(255,255,255,0.1)" : "#ffffff",
                      color: "#000",
                      border: "none",
                      borderRadius: "6px",
                      padding: "10px",
                      fontSize: "13px",
                      fontWeight: 600,
                      fontFamily: "var(--font-body)",
                      cursor: state === "sending" || !message.trim() ? "not-allowed" : "pointer",
                      opacity: !message.trim() ? 0.4 : 1,
                      transition: "opacity 150ms ease",
                      width: "100%",
                    }}
                  >
                    {state === "sending" ? "Sending..." : "Send message →"}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat button */}
      <motion.button
        onClick={handleOpen}
        aria-label="Open chat"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 40,
          width: "50px",
          height: "50px",
          borderRadius: "14px",
          background: "#ffffff",
          color: "#000",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.svg key="close" width="18" height="18" viewBox="0 0 24 24" fill="none"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </motion.svg>
          ) : (
            <motion.svg key="chat" width="20" height="20" viewBox="0 0 24 24" fill="none"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
              stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </motion.svg>
          )}
        </AnimatePresence>

        {/* Pulse ring */}
        {!open && (
          <motion.span
            animate={{ scale: [1, 1.7], opacity: [0.35, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
            style={{ position: "absolute", inset: 0, borderRadius: "14px", border: "2px solid #ffffff", pointerEvents: "none" }}
          />
        )}
      </motion.button>
    </>
  );
}
