// app/api/contact/route.ts
// Store enquiries before attempting the Resend notification.
// Shared inbound request quotas run before email delivery.

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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
  const name = body.name.trim();
  const email = body.email.trim();
  const message = body.message.trim();
  const company = body.company?.trim() || null;
  const budget = body.budget?.trim() || null;

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

  const { data: enquiry, error: saveError } = await supabase.from("contact_enquiries")
    .insert({ name, email, company, budget, message }).select("id").single();
  if (saveError || !enquiry) {
    console.error("[contact] Could not save enquiry", saveError?.code);
    return NextResponse.json({ error: "We could not save your enquiry. Please email zeroclicks.hq@gmail.com directly." }, { status: 503 });
  }

  const key = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM_EMAIL?.trim();
  let status: "unconfigured" | "accepted" | "failed" | "unknown" = "unconfigured";
  let emailId: string | null = null;

  if (key && from) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        signal: AbortSignal.timeout(8_000),
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          from,
          to: ["zeroclicks.hq@gmail.com"],
          reply_to: email,
          subject: "New venue enquiry — Zero Clicks",
          html: `<h2>New enquiry</h2><p><strong>Name:</strong> ${escape(name)}</p>
            <p><strong>Email:</strong> ${escape(email)}</p>
            ${company ? `<p><strong>Company:</strong> ${escape(company)}</p>` : ""}
            ${budget ? `<p><strong>Budget:</strong> ${escape(budget)}</p>` : ""}
            <p style="white-space:pre-wrap">${escape(message)}</p>`,
        }),
      });
      const result = await response.json().catch(() => null);
      emailId = response.ok && typeof result?.id === "string" ? result.id : null;
      status = emailId ? "accepted" : (response.ok || response.status >= 500 ? "unknown" : "failed");
      if (status !== "accepted") console.error("[contact] Notification not confirmed", response.status);
    } catch {
      status = "unknown";
      console.error("[contact] Notification timed out or could not reach Resend");
    }
  }

  const { error: statusError } = await supabase.from("contact_enquiries")
    .update({ email_status: status, email_id: emailId }).eq("id", enquiry.id);
  if (statusError) console.error("[contact] Could not record notification status", statusError.code);
  return NextResponse.json({ success: true }, { status: 201 });
}
