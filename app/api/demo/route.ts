// app/api/demo/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// Simple in-memory rate limit: 20 demo requests per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    req.headers.get("x-real-ip") ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API not configured." },
      { status: 500 }
    );
  }

  let body: { systemPrompt: string; fullText: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { systemPrompt, fullText } = body;

  if (!systemPrompt || !fullText) {
    return NextResponse.json(
      { error: "systemPrompt and fullText are required." },
      { status: 400 }
    );
  }

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system: systemPrompt,
      messages: [{ role: "user", content: fullText }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Anthropic API error:", message);
    return NextResponse.json(
      { error: message },
      { status: 502 }
    );
  }
}
