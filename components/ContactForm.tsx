// components/ContactForm.tsx
"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_PAGE, SITE } from "@/lib/content";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type FormState = "idle" | "submitting" | "success" | "error";
interface FormData { name: string; email: string; company: string; budget: string; message: string; }

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "var(--bg-card)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  padding: "12px 14px",
  borderRadius: "6px",
  outline: "none",
  transition: "border-color 200ms ease, background 200ms ease",
  boxSizing: "border-box",
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
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get("service");

  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<FormData>({ name: "", email: "", company: "", budget: "", message: "" });

  useEffect(() => {
    if (serviceParam) {
      setData(prev => ({ ...prev, message: `I'm interested in your ${serviceParam} service.` }));
    }
  }, [serviceParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--accent)";
    e.currentTarget.style.backgroundColor = "var(--bg-hover)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
    e.currentTarget.style.backgroundColor = "var(--bg-card)";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: "53cf9ade-73a5-4e1c-a684-d7bab8607d35",
          subject: `New enquiry from ${data.name} — Zero Clicks`,
          from_name: "Zero Clicks Website",
          ...data,
        }),
      });
      const json = await res.json();
      if (!json.success) { setErrorMsg("Something went wrong. Email me directly at zeroclicks.hq@gmail.com"); setFormState("error"); return; }
      setFormState("success");
    } catch {
      setErrorMsg("Something went wrong. Email me directly at zeroclicks.hq@gmail.com");
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
            width: "44px",
            height: "44px",
            borderRadius: "10px",
            background: "var(--accent-dim)",
            border: "1px solid rgba(59,130,246,0.25)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 28px",
          }}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="1.5"
            style={{ width: "18px", height: "18px" }}>
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "14px" }}>
          Message sent.
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.7, marginBottom: "28px", fontFamily: "var(--font-body)" }}>
          I'll reply within one business day.
        </p>
        <Link href={SITE.linkedin} target="_blank" rel="noopener noreferrer"
          style={{ fontSize: "13px", color: "var(--accent)", textDecoration: "underline", textUnderlineOffset: "4px", fontFamily: "var(--font-body)" }}>
          Connect on LinkedIn →
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" style={labelStyle}>Name <span style={{ color: "var(--accent)" }}>*</span></label>
          <input id="name" name="name" type="text" required placeholder="Your name"
            value={data.name} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={inputStyle} />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>Email <span style={{ color: "var(--accent)" }}>*</span></label>
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
        <label htmlFor="budget" style={labelStyle}>
          Budget range <span style={{ color: "var(--text-muted)", textTransform: "none", letterSpacing: 0, fontSize: "11px" }}>(optional)</span>
        </label>
        <select id="budget" name="budget" value={data.budget} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur} style={{ ...inputStyle, appearance: "none" }}>
          <option value="" disabled>Select a budget</option>
          <option value="Under £500">Under £500</option>
          <option value="£500–£1,000">£500–£1,000</option>
          <option value="£1,000–£2,500">£1,000–£2,500</option>
          <option value="Let's discuss">Let's discuss</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" style={labelStyle}>What do you need? <span style={{ color: "var(--accent)" }}>*</span></label>
        <textarea id="message" name="message" required rows={6} placeholder="Tell us what's slowing you down..."
          value={data.message} onChange={handleChange} onFocus={handleFocus} onBlur={handleBlur}
          style={{ ...inputStyle, resize: "none" }} />
      </div>

      <AnimatePresence>
        {formState === "error" && (
          <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ fontSize: "0.85rem", color: "#f87171", fontFamily: "var(--font-body)", margin: 0 }}>
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
            letterSpacing: "0.02em",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            cursor: formState === "submitting" ? "not-allowed" : "pointer",
            opacity: formState === "submitting" ? 0.5 : 1,
            padding: "12px 28px",
            borderRadius: "6px",
            border: "none",
            color: "#fff",
            background: "var(--accent)",
            transition: "opacity 200ms ease, transform 200ms ease",
          }}
          onMouseEnter={e => {
            if (formState !== "submitting") {
              (e.currentTarget as HTMLElement).style.opacity = "0.88";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.opacity = formState === "submitting" ? "0.5" : "1";
            (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
          }}
        >
          {formState === "submitting" ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
