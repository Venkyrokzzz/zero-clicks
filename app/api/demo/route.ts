// app/api/demo/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { DEMO_SCENARIOS } from "@/lib/content";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

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

  if (!process.env.GEMINI_API_KEY) {
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
    // HARDCODED BYPASS FOR LOOM RECORDING (NO API KEY NEEDED)
    // We are simulating a perfect AI response so you can record your outreach videos right now for free.
    
    // Simulate 2 seconds of API processing time for realism in the video
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    let mockResponseText = "";
    if (scenario.type === "review") {
      mockResponseText = "Hi there, thank you so much for visiting The Red Lion and leaving such a wonderful review! We are thrilled to hear you enjoyed the Sunday Roast and the atmosphere. I'll be sure to pass your kind words on to the kitchen team. We look forward to welcoming you back for another pint soon!\n\nBest regards,\nThe Red Lion Team";
    } else {
      mockResponseText = "Hi there,\n\nThank you for reaching out to The Red Lion! We would be absolutely delighted to host your group. We do have availability for 12 people this coming Saturday evening. \n\nI have provisionally held a table for you in our dining area. Could you please confirm what time you would like to arrive and if there are any dietary requirements in your party?\n\nLooking forward to hearing from you,\nThe Red Lion Team";
    }

    const result = {
      response: {
        text: () => mockResponseText
      }
    };

    const text = result.response.text() || "";

    return NextResponse.json({ response: text });
  } catch (err: any) {
    console.error("Gemini API error:", err);
    return NextResponse.json(
      { error: err.message || "AI service temporarily unavailable." },
      { status: 502 }
    );
  }
}
