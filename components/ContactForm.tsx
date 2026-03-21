// components/ContactForm.tsx
"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CONTACT_PAGE, SITE } from "@/lib/content";
import Link from "next/link";

type FormState = "idle" | "submitting" | "success" | "error";

interface FormData {
  name: string;
  email: string;
  company: string;
  message: string;
}

const ease = [0.25, 0.1, 0.25, 1.0] as const;

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "var(--bg-surface)",
  border: "1px solid var(--border)",
  color: "var(--text-primary)",
  fontSize: "0.9rem",
  fontFamily: "var(--font-body)",
  fontWeight: 400,
  padding: "12px 16px",
  borderRadius: 0,
  outline: "none",
  transition: "border-color 200ms ease",
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
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [data, setData] = useState<FormData>({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--accent)";
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--border)";
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
      if (!res.ok) {
        setErrorMsg(json.error ?? "Something went wrong. Please try again.");
        setFormState("error");
        return;
      }
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
            width: "40px",
            height: "40px",
            border: "1px solid var(--accent)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 32px",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            style={{ width: "16px", height: "16px", color: "var(--accent)" }}
          >
            <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "2rem",
            color: "var(--text-primary)",
            marginBottom: "16px",
          }}
        >
          {CONTACT_PAGE.successHeading}
        </h2>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "1rem",
            lineHeight: 1.7,
            marginBottom: "32px",
            fontFamily: "var(--font-body)",
          }}
        >
          {CONTACT_PAGE.successBody}
        </p>
        <Link
          href={SITE.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontSize: "13px",
            color: "var(--accent)",
            textDecoration: "underline",
            textUnderlineOffset: "4px",
            fontFamily: "var(--font-body)",
          }}
        >
          Connect on LinkedIn →
        </Link>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" style={labelStyle}>
            Name <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your name"
            value={data.name}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={inputStyle}
          />
        </div>
        <div>
          <label htmlFor="email" style={labelStyle}>
            Email <span style={{ color: "var(--accent)" }}>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@company.com"
            value={data.email}
            onChange={handleChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={inputStyle}
          />
        </div>
      </div>

      <div>
        <label htmlFor="company" style={labelStyle}>
          Company{" "}
          <span
            style={{
              color: "var(--text-muted)",
              textTransform: "none",
              letterSpacing: 0,
              fontSize: "11px",
            }}
          >
            (optional)
          </span>
        </label>
        <input
          id="company"
          name="company"
          type="text"
          placeholder="Your company"
          value={data.company}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={inputStyle}
        />
      </div>

      <div>
        <label htmlFor="message" style={labelStyle}>
          Message <span style={{ color: "var(--accent)" }}>*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="Tell us what's slowing you down..."
          value={data.message}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ ...inputStyle, resize: "none" }}
        />
      </div>

      <AnimatePresence>
        {formState === "error" && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            style={{ fontSize: "0.85rem", color: "#e05555", fontFamily: "var(--font-body)" }}
          >
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
            color: "var(--accent)",
            border: "1px solid var(--accent)",
            padding: "12px 32px",
            letterSpacing: "0.05em",
            borderRadius: 0,
            backgroundColor: "transparent",
            fontFamily: "var(--font-body)",
            fontWeight: 500,
            cursor: formState === "submitting" ? "not-allowed" : "pointer",
            opacity: formState === "submitting" ? 0.5 : 1,
            transition: "background-color 200ms ease, opacity 200ms ease",
          }}
          onMouseEnter={e => {
            if (formState !== "submitting") {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--accent-dim)";
            }
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent";
          }}
        >
          {formState === "submitting" ? "Sending..." : "Send message"}
        </button>
      </div>
    </form>
  );
}
