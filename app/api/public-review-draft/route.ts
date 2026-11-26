import { NextRequest, NextResponse } from "next/server";
import { generateReviewDraft } from "@/lib/generateReviewDraft";
import { consumePublicBudget } from "@/lib/sharedRateLimit";

const MAX_REVIEW_LENGTH = 800;

export async function POST(request: NextRequest) {
  if (!request.headers.get("content-type")?.startsWith("application/json")) {
    return NextResponse.json(
      { error: "Send a review as JSON." },
      { status: 415 },
    );
  }
  if (Number(request.headers.get("content-length")) > 5_000) {
    return NextResponse.json({ error: "Review is too long." }, { status: 413 });
  }

  let input: { review?: unknown; rating?: unknown } | null;
  try {
    const raw = await request.text();
    if (Buffer.byteLength(raw, "utf8") > 5_000) {
      return NextResponse.json(
        { error: "Review is too long." },
        { status: 413 },
      );
    }
    input = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "Could not read that review." },
      { status: 400 },
    );
  }

  const review = typeof input?.review === "string" ? input.review.trim() : "";
  const rating = input?.rating;
  if (
    review.length > MAX_REVIEW_LENGTH ||
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return NextResponse.json(
      {
        error: "Enter a rating from 1 to 5 and up to 800 characters of review text.",
      },
      { status: 400 },
    );
  }

  const budget = await consumePublicBudget(request, "public-draft", 6, 90);
  if (budget !== "allowed") {
    return NextResponse.json(
      { error: budget === "limited"
          ? "The demo has reached its draft limit. Try a sample review or come back later."
          : "Custom drafts are temporarily unavailable. Try a sample review." },
      { status: budget === "limited" ? 429 : 503 },
    );
  }

  const result = await generateReviewDraft({
    review_text: review,
    rating,
    business_name: "the venue",
    business_type: "hospitality venue",
    manager_name: "the venue team",
    location: "the UK",
    tone: "warm-professional",
    reviewer_name: "",
  });

  return NextResponse.json({
    reply: result.text,
    disposition: result.disposition,
    reason: result.reason,
    source: result.provider === "gemini" ? "ai" : "template",
  });
}
