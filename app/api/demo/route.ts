// app/api/demo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DEMO_SCENARIOS } from "@/lib/content";
import Anthropic from "@anthropic-ai/sdk";

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
      { error: "API not configured. Missing ANTHROPIC_API_KEY." },
      { status: 500 }
    );
  }

  let body: { scenarioId: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { scenarioId } = body;

  if (!scenarioId) {
    return NextResponse.json(
      { error: "scenarioId is required." },
      { status: 400 }
    );
  }

  // Look up scenario server-side — never trust client-supplied prompts
  const scenario = DEMO_SCENARIOS.find(s => s.id === scenarioId);
  if (!scenario) {
    return NextResponse.json({ error: "Invalid scenario." }, { status: 400 });
  }

  try {
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 256,
      temperature: 0.6,
      system: scenario.systemPrompt,
      messages: [
        { role: "user", content: `Reviewer/Sender Name: ${scenario.sender}\n\nMessage:\n${scenario.fullText}` }
      ]
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";

    return NextResponse.json({ response: text });
  } catch (err: any) {
    console.error("Anthropic API error:", err);
    return NextResponse.json(
      { error: `Anthropic Error: ${err.message || "Unknown error"}` },
      { status: 502 }
    );
  }
}
