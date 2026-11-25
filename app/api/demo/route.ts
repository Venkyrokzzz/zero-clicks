// app/api/demo/route.ts
import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { DEMO_SCENARIOS } from "@/lib/content";

import { consumePublicBudget } from "@/lib/sharedRateLimit";

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "API not configured." },
      { status: 500 }
    );
  }

  let body: { scenarioId?: unknown } | null;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const scenarioId = body?.scenarioId;

  if (typeof scenarioId !== "string" || !scenarioId || scenarioId.length > 80) {
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

  const budget = await consumePublicBudget(req, "public-draft", 6, 90);
  if (budget !== "allowed") {
    return NextResponse.json(
      { error: budget === "limited" ? "Too many requests. Try again later." : "The AI demo is temporarily unavailable." },
      { status: budget === "limited" ? 429 : 503 },
    );
  }

  try {
    const anthropic = new Anthropic({ timeout: 8_000, maxRetries: 0 });
    const message = await anthropic.messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 256,
      system: scenario.systemPrompt,
      messages: [
        { role: "user", content: `Reviewer/Sender Name: ${scenario.sender}\n\nMessage:\n${scenario.fullText}` },
      ],
    });

    const first = message.content[0];
    const text = first && first.type === "text" ? first.text : "";

    return NextResponse.json({ response: text });
  } catch {
    console.warn("[demo] AI draft unavailable");
    return NextResponse.json(
      { error: "The AI demo is temporarily unavailable." },
      { status: 502 }
    );
  }
}
