// app/api/contact/route.ts
// Handles chat widget submissions via Resend (server-side email).
// Shared inbound request quotas run before email delivery.

import { NextRequest, NextResponse } from "next/server";
import { consumePublicBudget } from "@/lib/sharedRateLimit";

export async function POST(req: NextRequest) {
  // ── Parse body ────────────────────────────────────────────────────
  const maxBytes = 32_000;
  if (Number(req.headers.get("content-length")) > maxBytes)
    return NextResponse.json({ error: "Message is too long." }, { status: 413 });

  let body: Record<string, string>;
  try {
    const raw = await req.text();
    if (Buffer.byteLength(raw, "utf8") > maxBytes)
      return NextResponse.json({ error: "Message is too long." }, { status: 413 });
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!body || typeof body !== 'object' || ['name', 'email', 'message'].some(k => typeof body[k] !== 'string') || ['company', 'budget'].some(k => body[k] !== undefined && typeof body[k] !== 'string')) {
    return NextResponse.json({ error: 'Invalid fields' }, { status: 400 });
  }
  const escape = (value: string) => value.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
  const { name, email, company, message, budget } = body as Record<string, string>;

  if (!name || !email || !message) {
    return NextResponse.json(
      { error: "Name, email, and message are required." },
      { status: 400 }
    );
  }

  // ── Length limits ─────────────────────────────────────────────────
  if (name.length > 100 || email.length > 254 || message.length > 5000 || (company && company.length > 200) || (budget && budget.length > 100)) {
    return NextResponse.json({ error: "Input exceeds maximum length." }, { status: 400 });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const budgetState = await consumePublicBudget(req, "contact", 5, 100);
  if (budgetState !== "allowed") {
    const limited = budgetState === "limited";
    return NextResponse.json(
      { error: limited
          ? "Too many requests. Please try again later."
          : "The form is temporarily unavailable. Please email zeroclicks.hq@gmail.com directly." },
      { status: limited ? 429 : 503 },
    );
  }

  // ── Send via Resend ──────────────────────────────────────────────
  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    console.error("[contact] RESEND_API_KEY not set");
    return NextResponse.json({ error: "Email delivery is temporarily unavailable. Please email zeroclicks.hq@gmail.com directly." }, { status: 503 });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: AbortSignal.timeout(8_000),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${resendKey}`,
      },
      body: JSON.stringify({
        from: process.env.RESEND_FROM_EMAIL || "Zero Clicks Contact <onboarding@resend.dev>",
        to: ["zeroclicks.hq@gmail.com"],
        reply_to: email,
        subject: `New enquiry from ${name} — Zero Clicks`,
        html: `
          <h2>New enquiry</h2>
          <p><strong>Name:</strong> ${escape(name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escape(email)}">${escape(email)}</a></p>
          ${company ? `<p><strong>Company:</strong> ${escape(company)}</p>` : ""}
          ${budget ? `<p><strong>Budget:</strong> ${escape(budget)}</p>` : ""}
          <p><strong>Message:</strong></p>
          <p style="white-space:pre-wrap">${escape(message)}</p>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error("[contact] Resend error:", err);
      return NextResponse.json({ error: "Failed to send. Please try again." }, { status: 502 });
    }

    const accepted = await res.json().catch(() => null);
    if (typeof accepted?.id !== "string" || !accepted.id) {
      return NextResponse.json({ error: "Email acceptance could not be confirmed. Please email zeroclicks.hq@gmail.com directly." }, { status: 502 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[contact] Network error:", err);
    return NextResponse.json({ error: "Delivery could not be confirmed. Please email zeroclicks.hq@gmail.com directly." }, { status: 503 });
  }
}
