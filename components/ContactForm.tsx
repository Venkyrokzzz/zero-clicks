// components/ContactForm.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_PAGE, SITE } from "@/lib/content";
import Link from "next/link";

type FormState = "idle" | "submitting" | "success" | "error";
interface FormData { name: string; email: string; company: string; message: string; }

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  padding: "13px 16px",
  borderRadius: "8px",
  outline: "none",
  transition: "border-color 200ms ease, background 200ms ease, box-shadow 200ms ease",
  boxSizing: "border-box",
  backdropFilter: "blur(8px)",
};

const labelStyle: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "var(--text-muted)",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  display: "block",
  marginBottom: "8px",
};

export default function ContactForm() {
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<FormData>({ name: "", email: "", company: "", message: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(196,181,253,0.5)";
    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)";
    e.currentTarget.style.boxShadow = "0 0 20px rgba(196,181,253,0.08)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
    e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.04)";
    e.currentTarget.style.boxShadow = "none";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) { setErrorMsg(json.error ?? "Something went wrong."); setFormState("error"); return; }
      setFormState("success");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setFormState("error");
    }
  };

  if (formState === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease }}
        style={{ padding: "64px 0", textAlign: "center" }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, rgba(168,216,255,0.2), rgba(196,181,253,0.2))",
            border: "1px solid rgba(196,181,253,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="url(#g)" strokeWidth="1.5"
            style={{ width: "20px", height: "20px" }}>
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#a8d8ff" />
                <stop offset="100%" stopColor="#c4b5fd" />
              </linearGradient>
            </defs>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "2rem", color: "var(--text-primary)", marginBottom: "16px" }}>
          {CONTACT_PAGE.successHeading}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "1rem", lineHeight: 1.7, marginBottom: "32px", fontFamily: "var(--font-body)" }}>
          {CONTACT_PAGE.successBody}
        </p>
        <Link href={SITE.linkedin} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "13px", color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "4px", fontFamily: "var(--font-body)" }}>
          Connect on LinkedIn →
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" style={labelStyle}>Name <span style={{ color: "rgba(196,181,253,0.7)" }}>*</span></label>
          <input id="name" name="name" type="text" required placeholder="Your name"
            value={data.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>Email <span style={{ color: "rgba(196,181,253,0.7)" }}>*</span></label>
          <input id="email" name="email" type="email" required placeholder="you@company.com"
            value={data.email} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={inputStyle} />
        </div>
      </div>

      <div>
        <label htmlFor="company" style={labelStyle}>
          Company <span style={{ color: "var(--text-muted)", textTransform: "none", letterSpacing: 0, fontSize: "11px" }}>(optional)</span>
        </label>
        <input id="company" name="company" type="text" placeholder="Your company"
          value={data.company} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={inputStyle} />
      </div>

      <div>
        <label htmlFor="message" style={labelStyle}>Message <span style={{ color: "rgba(196,181,253,0.7)" }}>*</span></label>
        <textarea id="message" name="message" required rows={6} placeholder="Tell us what's slowing you down..."
          value={data.message} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
          style={{ ...inputStyle, resize: "none" }} />
      </div>

      <AnimatePresence>
        {formState === "error" && (
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ fontSize: "0.85rem", color: "#f87171", fontFamily: "var(--font-body)" }}>
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <div>
        <button
          type="submit"
          disabled={formState === "submitting"}
          style={{
            fontSize: "13px",
            letterSpacing: "0.05em",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            cursor: formState === "submitting" ? "not-allowed" : "pointer",
            opacity: formState === "submitting" ? 0.5 : 1,
            padding: "13px 32px",
            borderRadius: "8px",
            border: "none",
            color: "#06060e",
            background: "linear-gradient(135deg, #a8d8ff 0%, #c4b5fd 50%, #f9a8d4 100%)",
            boxShadow: "0 0 30px rgba(196,181,253,0.25), 0 4px 16px rgba(0,0,0,0.4)",
            transition: "transform 200ms ease, box-shadow 200ms ease, opacity 200ms ease",
          }}
          onMouseEnter={e => {
            if (formState !== "submitting") {
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 50px rgba(196,181,253,0.4), 0 8px 24px rgba(0,0,0,0.5)";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLElement).style.boxShadow = "0 0 30px rgba(196,181,253,0.25), 0 4px 16px rgba(0,0,0,0.4)";
          }}
        >
          {formState === "submitting" ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
