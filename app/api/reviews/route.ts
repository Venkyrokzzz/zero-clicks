import { NextRequest, NextResponse } from "next/server";

function requireAuth(req: NextRequest): NextResponse | null {
  const secret = req.headers.get("x-dashboard-secret");
  if (!process.env.DASHBOARD_SECRET || secret !== process.env.DASHBOARD_SECRET) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }
  return null;
}

// Mock data - replace with actual Google Sheets/database call
const mockReviews = [
  {
    id: "1",
    reviewer: "Jane Doe",
    sentiment: "NEGATIVE",
    summary: "Cold food and 45-minute wait with no staff communication. Legitimate service complaint.",
    draftResponse:
      "Hi Jane, I'm genuinely sorry to hear about your experience. Cold food and a 45-minute wait without any explanation from our team is not acceptable. You deserved better service. Would you be willing to come back and give us another chance? I'd like to make it right. Please get in touch with me directly.",
    timestamp: new Date().toISOString(),
    status: "pending",
    escalationReason: "Service failure with multiple touchpoints (food quality, wait time, communication)",
  },
  {
    id: "2",
    reviewer: "John Smith",
    sentiment: "POSITIVE",
    summary: "Great atmosphere and friendly staff",
    draftResponse:
      "Thank you so much for the lovely feedback! We're thrilled you enjoyed the atmosphere and our team's service. We look forward to welcoming you back soon!",
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    status: "sent",
    escalationReason: "",
  },
];

export async function GET(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;
  try {
    // TODO: Fetch from Google Sheets API
    // const response = await fetch('https://sheets.googleapis.com/...');
    // const data = await response.json();

    const reviews = mockReviews;

    const metrics = {
      totalReviews: reviews.length,
      negativeCount: reviews.filter((r) => r.sentiment.includes("NEGATIVE")).length,
      avgResponseTime: "2.5 hrs",
      sentimentTrend: "+12%",
    };

    return NextResponse.json({ reviews, metrics });
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const authError = requireAuth(request);
  if (authError) return authError;
  try {
    const body = await request.json();
    const { id, status } = body;

    // TODO: Send email via n8n webhook
    if (status === "sent") {
      // Trigger n8n workflow to send email
      // await fetch('http://localhost:5678/webhook/send-review-response', {
      //   method: 'POST',
      //   body: JSON.stringify({ reviewId: id, ...review })
      // });

      console.log(`Review ${id} approved and email queued for sending`);
    }

    // TODO: Update Google Sheets
    // await updateGoogleSheets(id, { status });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update review:", error);
    return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
  }
}
