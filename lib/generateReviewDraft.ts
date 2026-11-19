import 'server-only'
import { buildSystemPrompt, buildUserMessage, type ReviewContext } from '@/lib/buildReplyPrompt'

const COMPLAINT_MARKERS = /allerg|injur|sick|poison|discrimin|racis|unsafe|harass|cold(?!\s+(?:beer|pint|drink|lager|cider))|slow|rude|wrong order|\bwait(?:ed|ing)?\b|queue|nois|filthy|overcharg|charged twice|ignored|locked|overpriced|refund|complaint|disgusting|never again|awful|terrible|horrible|worst|dirty|unacceptable/i
const UNSAFE_DRAFT = /hacked|pwned|system prompt|debug mode|ignore (all |your )?(previous|rules)|as an ai|i am an ai|i cannot reveal|language model|verbatim|on us\b|on the house|complimentary|free of charge|no charge|free (drink|pint|meal|round|glass)|refund|money back|compensation|voucher|discount|off your next/i

export function hasReviewComplaint(review: string) {
  return COMPLAINT_MARKERS.test(review)
    || /\b(?:but|however|although|except)\b/i.test(review.replace(/\bnothing but\b/gi, ''))
    || /\b(?:fr[ií]a|lento|mal|mauvais|schlecht)\b/i.test(review)
}

// Conservative checks supplement owner approval; they are not a complete PII detector.
function unsafeReply(reply: string, ctx: ReviewContext) {
  const fullName = ctx.reviewer_name.trim()
  return UNSAFE_DRAFT.test(reply)
    || /[\w.+-]+@[\w.-]+\.[a-z]{2,}/i.test(reply)
    || /(?:\+?\d[\d ().-]{7,}\d)/.test(reply)
    || /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i.test(reply)
    || /[£$€]\s*\d|\b\d+(?:\.\d+)?\s*(?:pounds?|dollars?|euros?)\b/i.test(reply)
    || /\b(?:fired|dismissed|retrained|investigated|investigation|liar|lying|scammer|fake review)\b/i.test(reply)
    || /\b(?:guarantee|guaranteed|allergen.free|completely safe)\b/i.test(reply)
    || (fullName.split(/\s+/).length > 1 && reply.toLowerCase().includes(fullName.toLowerCase()))
}

function templateReply(ctx: ReviewContext) {
  const casual = ctx.tone === 'casual'
  const formal = ctx.tone === 'formal'
  if (ctx.rating <= 2 || hasReviewComplaint(ctx.review_text)) {
    return formal
      ? 'Please accept our apologies that your visit fell short. We would welcome the chance to hear more if you contact the venue directly.'
      : 'We’re sorry your visit fell short. If you’re happy to get in touch with the venue directly, we’d like to hear more about what happened.'
  }
  if (ctx.rating < 4) {
    return 'Thanks for taking the time to leave a review. If there’s something we could do better, we’d welcome the chance to hear from you directly.'
  }
  if (ctx.review_text.trim() && /[^\x00-\x7F]/.test(ctx.review_text)) {
    return 'Thank you for taking the time to share your feedback. Please contact the venue directly if there is anything you would like us to address.'
  }
  if (casual) return 'Cheers for the kind rating! Glad you enjoyed stopping by, and hope to see you again soon.'
  if (formal) return 'Thank you for your kind rating. We are pleased you enjoyed your visit and would be delighted to welcome you back.'
  return 'Thanks for the lovely rating. We’re glad you enjoyed your visit and hope to welcome you back soon.'
}

export async function generateReviewDraft(ctx: ReviewContext, signature?: string | null) {
  const key = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_REVIEW_MODEL
  let text = templateReply(ctx)
  let provider: 'template' | 'gemini' = 'template'

  if (key && model) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          signal: AbortSignal.timeout(8_000),
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: buildSystemPrompt(ctx) }] },
            contents: [{ role: 'user', parts: [{ text: buildUserMessage(ctx) }] }],
            generationConfig: { temperature: 0.4, maxOutputTokens: 512 },
          }),
        }
      )
      if (!response.ok) throw new Error(`Gemini returned HTTP ${response.status}`)
      const body = await response.json() as {
        candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>
      }
      const candidate = body.candidates?.[0]
      const reply = candidate?.content?.parts?.filter(part => !part.thought)
        .map(part => part.text ?? '').join('').trim()
      if (candidate?.finishReason === 'STOP' && reply && !unsafeReply(reply, ctx) && !/^[A-Z\s!.]{2,15}$/.test(reply)) {
        text = reply
        provider = 'gemini'
      }
    } catch {
      console.warn('[review-draft] Gemini unavailable; using a template draft')
    }
  }

  const signoff = signature?.trim()
  const signedDraft = signoff ? `${text}\n\n${signoff}` : text
  if (Buffer.byteLength(signedDraft, 'utf8') > 4096) {
    return { text: templateReply(ctx), provider: 'template' as const }
  }
  return { text: signedDraft, provider }
}
