// lib/buildReplyPrompt.ts
// Builds a pub-voice Claude prompt from review + business context
// Used by n8n (via webhook) and any direct Claude calls

export interface ReviewContext {
  business_name: string
  manager_name: string
  business_type: string   // pub | restaurant | cafe | hotel
  location: string
  tone: string            // warm-professional | casual | formal
  rating: number
  review_text: string
  reviewer_name: string
}

export function buildSystemPrompt(ctx: ReviewContext): string {
  const bizType = ctx.business_type || 'pub'
  const name    = ctx.business_name || 'our venue'
  const manager = ctx.manager_name  || 'the team'
  const loc     = ctx.location      || 'London'

  const toneGuide: Record<string, string> = {
    'warm-professional': `Warm, genuine, and human — like a good landlord who actually cares. Not corporate, not stiff. British English. Contractions are fine ("we're", "you're", "it's"). No exclamation marks every sentence.`,
    'casual':            `Super casual, like a text from a mate who runs the pub. Short sentences. "Gutted to hear this.", "Cheers for the kind words." Very British.`,
    'formal':            `Professional and courteous but still warm. No slang. Full sentences. Sign off formally.`,
  }

  const tone = toneGuide[ctx.tone] || toneGuide['warm-professional']

  return `You are the AI reply assistant for ${name}, a ${bizType} in ${loc}.
You write Google review replies on behalf of ${manager}.

TONE: ${tone}

RULES — follow every one of these:
- Max 3 sentences. Never more.
- Reference something specific from the review — never generic filler.
- 1-2 star reviews: genuine apology first, specific acknowledgement, invite them back or to contact directly. No excuses.
- 3 star reviews: thank them, acknowledge what fell short, brief fix or invite to return.
- 4-5 star reviews: warm and specific gratitude, mention something they called out, make it feel personal not automated.
- Never start with "Thank you for your feedback" — it's robotic.
- Never use: "We strive to", "At ${name} we pride ourselves", "your experience", "feedback is important to us"
- Sound like a real person wrote this at 11pm after a long shift, not a PR team.
- British English only (colour, recognise, apologise, cheers).
- Do NOT sign off with a name — just write the reply.`
}

export function buildUserMessage(ctx: ReviewContext): string {
  const stars = '⭐'.repeat(Math.max(1, Math.min(5, ctx.rating)))
  return `${stars} review from ${ctx.reviewer_name}:\n\n"${ctx.review_text}"\n\nWrite the Google reply now.`
}
