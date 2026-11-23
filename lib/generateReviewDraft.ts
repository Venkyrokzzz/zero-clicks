import 'server-only'
import { FIVE_STAR_REPLY } from '@/lib/reviewDraftDefaults'
import { buildSystemPrompt, buildUserMessage, type ReviewContext } from '@/lib/buildReplyPrompt'

const SERIOUS = /allerg|anaphyla|poison|food\s*safety|made me sick|got sick|fell ill|injur|discrimin|racis|harass|unsafe|assault|threat|spik(?:e[ds]?|ing)|hospital|glass in|\b(?:raw|undercooked)\s+(?:chicken|poultry|pork|burger)\b|\b(?:chicken|poultry|pork|burger)\s+(?:was|were|came out)\s+(?:raw|undercooked)\b|cross.contaminat/i
const STAFF = /\brude\b|\bdismissive\b|\bdisrespectful\b|\bpatronis\w*\b|staff\s+(?:ignored|shouted|laughed)|\bmade\b[^.!?]{0,35}\bworse\b/i
const NO_APOLOGY = /\b(?:no|never|without)\s+(?:an?\s+)?app?olog\w*\b|\bdidn['’]?t\s+(?:app?olog\w*|say sorry)\b/i
const WAIT = /\b(?:waited|waiting|long wait|slow service|took (?:ages|\d+ minutes))\b/i
const BILL = /\b(?:charged|billed)\s+(?:me\s+|us\s+)?twice\b|\b(?:double.charg|duplicate\s+charge|overcharg)\w*/i
const COLD_FOOD = /\b(?:food|mains?|starters?|dinner|meal|roast)\b[^.!?]{0,25}\b(?:went|was|were|arrived|came out)\s+cold\b|\bcold\s+(?:food|mains?|starters?|dinner|meal|roast)\b/i
const AMBIGUOUS_PRAISE = /\b(?:sarcasm|not good|not great|not helpful|could have|should have|never coming|yeah right|thanks for nothing)\b/i
const COMPLAINT_MARKERS = /allerg|injur|sick|poison|discrimin|racis|unsafe|harass|cold(?!\s+(?:beer|pint|drink|lager|cider))|slow|rude|wrong order|\bwait(?:ed|ing)?\b|queue|nois|filthy|overcharg|charged twice|ignored|locked|overpriced|refund|complaint|disgusting|never again|awful|terrible|horrible|worst|dirty|unacceptable/i
const GENERIC_OPENING = /^(?:thank you for (?:your feedback|taking the time)|we(?:['’]re| are) sorry to hear|we strive to|your feedback is (?:important|valuable))/i
const UNSAFE_DRAFT = /hacked|pwned|system prompt|debug mode|ignore (all |your )?(previous|rules)|as an ai|i am an ai|i cannot reveal|language model|verbatim|on us\b|on the house|complimentary|free of charge|no charge|free (drink|pint|meal|round|glass)|refund|money back|compensation|voucher|discount|off your next/i

export function hasReviewComplaint(review: string) {
  return AMBIGUOUS_PRAISE.test(review) || SERIOUS.test(review) || STAFF.test(review) || NO_APOLOGY.test(review) || WAIT.test(review) || BILL.test(review) || COLD_FOOD.test(review) || COMPLAINT_MARKERS.test(review)
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

// Use fixed wording for recognised details. Never interpolate raw review text.
function templateReply(ctx: ReviewContext) {
  const review = ctx.review_text
  if (SERIOUS.test(review)) {
    return 'I’m sorry about what you’ve described. Could you get in touch with the venue and ask for the duty manager so we can speak privately?'
  }
  if (STAFF.test(review)) {
    const apology = /\bmade\b[^.!?]{0,35}\bworse\b/i.test(review)
      ? 'I’m sorry about how our team spoke to you and that we made things worse.'
      : 'I’m sorry about the way you were treated.'
    const followup = NO_APOLOGY.test(review)
      ? 'You should have had an apology at the time. If you’d like to talk it through, please ask for the duty manager.'
      : 'Could you get in touch with the duty manager so we can hear what happened?'
    return [apology, followup].join(' ')
  }
  if (BILL.test(review)) {
    return 'I’m sorry there’s a problem with the bill. Please get in touch with the duty manager and let us know when you visited so we can check it with you.'
  }
  if (COLD_FOOD.test(review)) {
    return 'I’m sorry your food was cold. If you’d like to talk it through, please let the duty manager know when you came in.'
  }
  const roast = /\b(?:sunday\s+roast|roast\s+dinner|roast)\b/i.test(review)
  const enjoyedRoast = roast && /\b(?:loved|great|delicious|enjoyed|excellent|lovely|brilliant)\b.{0,25}\broast\b/i.test(review)
  if (WAIT.test(review)) {
    const reportedMinutes = review.match(/\b(?:took|waited(?:\s+for)?)\s+(\d{1,3})\s+minutes\b/i)?.[1]
    const wait = reportedMinutes ? 'you had to wait ' + Number(reportedMinutes) + ' minutes' : 'we kept you waiting'
    const apology = 'I’m sorry ' + wait + '.'
    if (enjoyedRoast) return 'Glad you enjoyed the roast. ' + apology
    return apology + ' If you’d like to talk it through, please tell the duty manager when you visited.'
  }
  if (ctx.rating <= 2 || hasReviewComplaint(review)) {
    return 'I’m sorry we let you down. If you’re happy to tell us a bit more, please get in touch with the venue and ask for the duty manager.'
  }
  if (ctx.rating < 4 || /[^\x00-\x7F]/.test(review)) {
    return 'Thanks for taking the time to leave a review. If there’s anything you’d like us to know about your visit, please get in touch.'
  }
  if (enjoyedRoast) return 'So glad you enjoyed the roast. Hope we see you again soon!'
  if (/\b(?:great|lovely|excellent|delicious|fantastic)\s+food\b/i.test(review)) {
    return 'Really glad you enjoyed the food. Thanks for coming in!'
  }
  if (ctx.tone === 'formal') return 'Thank you for the kind rating. We hope to welcome you back soon.'
  if (ctx.tone === 'casual') return 'Cheers for coming in and leaving us a rating. See you next time!'
  return 'Thanks for coming in and taking a moment to leave us a rating.'
}

export type ReviewDisposition = 'routine_praise' | 'approval' | 'manager'

function reviewDecision(ctx: ReviewContext, assessment?: unknown): { disposition: ReviewDisposition; reason: string } {
  const text = ctx.review_text.trim()
  if (SERIOUS.test(text)) return { disposition: 'manager', reason: 'The review raises a potentially serious concern.' }
  if (STAFF.test(text)) return { disposition: 'manager', reason: 'The review describes how a member of the team handled the visit.' }
  if (assessment === 'manager') return { disposition: 'manager', reason: 'The review was flagged for the duty manager to assess.' }
  if (BILL.test(text)) return { disposition: 'approval', reason: 'The guest raised a billing issue.' }
  if (WAIT.test(text)) return { disposition: 'approval', reason: 'The guest reported a wait.' }
  if (COLD_FOOD.test(text)) return { disposition: 'approval', reason: 'The guest reported cold food.' }
  if (ctx.rating !== 5) return { disposition: 'approval', reason: 'Check that the reply addresses the guest’s feedback.' }
  if (hasReviewComplaint(text) || unsafeReply(text, ctx)) return { disposition: 'approval', reason: 'The text may include a complaint or details that need checking.' }
  return { disposition: 'routine_praise', reason: 'Five-star review with the default thank-you draft.' }
}

export async function generateReviewDraft(ctx: ReviewContext, signature?: string | null) {
  const key = process.env.GEMINI_API_KEY
  const model = process.env.GEMINI_REVIEW_MODEL
  const defaultText = ctx.rating === 5 ? FIVE_STAR_REPLY : templateReply(ctx)
  let text = defaultText
  let provider: 'template' | 'gemini' = 'template'
  let assessment: unknown

  if (ctx.rating !== 5 && key && model && ctx.review_text.trim()) {
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
            generationConfig: {
              temperature: 0.35,
              maxOutputTokens: 1024,
              responseMimeType: 'application/json',
              responseJsonSchema: {
                type: 'object',
                properties: {
                  reply: { type: 'string' },
                  assessment: { type: 'string', enum: ['routine_praise', 'approval', 'manager'] },
                },
                required: ['reply', 'assessment'],
              },
            },
          }),
        }
      )
      if (!response.ok) throw new Error(`Gemini returned HTTP ${response.status}`)
      const body = await response.json() as {
        candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>
      }
      const candidate = body.candidates?.[0]
      const output = candidate?.content?.parts?.filter(part => !part.thought)
        .map(part => part.text ?? '').join('').trim()
      if (candidate?.finishReason === 'STOP' && output) {
        const parsed = JSON.parse(output)
        const reply = typeof parsed?.reply === 'string' ? parsed.reply.trim() : ''
        if (['routine_praise', 'approval', 'manager'].includes(parsed?.assessment)) {
          assessment = parsed.assessment
          const missesStaffConcern = STAFF.test(ctx.review_text)
            && (!/\b(?:staff|team|spoke|spoken|treated|handled)\b/i.test(reply)
              || (NO_APOLOGY.test(ctx.review_text) && !/\b(?:apolog\w*|said sorry)\b/i.test(reply)))
          if (reply && reply.length <= 480 && !GENERIC_OPENING.test(reply) && !missesStaffConcern && !unsafeReply(reply, ctx) && !/^[A-Z\s!.]{2,15}$/.test(reply)) {
            text = reply
            provider = 'gemini'
          }
        }
      }
    } catch {
      console.warn('[review-draft] Gemini unavailable; using a template draft')
    }
  }

  const signoff = signature?.trim()
  const signedDraft = signoff ? `${text}\n\n${signoff}` : text
  if (Buffer.byteLength(signedDraft, 'utf8') > 4096 || (signoff && unsafeReply(signoff, ctx))) {
    return { text: defaultText, provider: 'template' as const, ...reviewDecision(ctx, assessment === 'manager' ? assessment : undefined) }
  }
  return { text: signedDraft, provider, ...reviewDecision(ctx, provider === 'gemini' || assessment === 'manager' ? assessment : undefined) }
}
