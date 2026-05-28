// app/api/demo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { DEMO_SCENARIOS } from "@/lib/content";

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

  if (!process.env.GROQ_API_KEY) {
    return NextResponse.json(
      { error: "API not configured." },
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
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-oss-120b",
        messages: [
          { role: "system", content: scenario.systemPrompt },
          { role: "user", content: `Reviewer/Sender Name: ${scenario.sender}\n\nMessage:\n${scenario.fullText}` },
        ],
        max_tokens: 256,
        temperature: 0.6,
      }),
    });

    if (!groqResponse.ok) {
      const errBody = await groqResponse.json().catch(() => ({ error: { message: "Unknown error" } }));
      const errorMessage = errBody?.error?.message || await groqResponse.text() || "AI service temporarily unavailable.";
      console.error("Groq API error:", errorMessage);
      return NextResponse.json(
        { error: `Groq Error: ${errorMessage}` },
        { status: 502 }
      );
    }

    const data = await groqResponse.json();
    let text = data.choices?.[0]?.message?.content || "";
    
    // DeepSeek R1 outputs its internal reasoning inside <think> tags. Strip them before returning to the UI.
    text = text.replace(/<think>[\s\S]*?<\/think>\n?/g, '').trim();

    return NextResponse.json({ response: text });
  } catch (err: any) {
    console.error("Groq API error:", err);
    return NextResponse.json(
      { error: `Groq Exception: ${err.message || "Unknown error"}` },
      { status: 502 }
    );
  }
}
