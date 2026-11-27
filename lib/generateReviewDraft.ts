import 'server-only'
import { ratingOnlyReply } from '@/lib/reviewDraftDefaults'
import { buildSystemPrompt, buildUserMessage, type ReviewContext } from '@/lib/buildReplyPrompt'

import { ALLERGEN_QUESTION, BILL, BOOKING, COLD_FOOD, DRINKS_DELAY, NO_APOLOGY, PROMPT_INJECTION, SERIOUS, STAFF, WAIT, WRONG_ORDER, classifyReview, hasReviewComplaint, isRoutineReview } from '@/lib/reviewDisposition'

const GENERIC_OPENING = /^(?:thank you for (?:your feedback|taking the time)|we(?:['’]re| are) sorry to hear|we strive to|your feedback is (?:important|valuable))/i
const UNSAFE_DRAFT = /hacked|pwned|system prompt|debug mode|ignore (all |your )?(previous|rules)|as an ai|i am an ai|i cannot reveal|language model|verbatim|on us\b|on the house|complimentary|free of charge|no charge|free (drink|pint|meal|round|glass)|refund|money back|compensation|voucher|discount|off your next/i

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
  if (ALLERGEN_QUESTION.test(review)) {
    return 'I’m sorry you couldn’t get a clear answer about what was in the food. Please get in touch with the duty manager privately so we can talk through what happened.'
  }
  if (SERIOUS.test(review)) {
    return 'I’m sorry about what you’ve described. Could you get in touch with the venue and ask for the duty manager so we can speak privately?'
  }
  if (STAFF.test(review) || NO_APOLOGY.test(review)) {
    const apology = /\bmade\b[^.!?]{0,35}\bworse\b/i.test(review)
      ? 'I’m sorry about how our team spoke to you and that things got worse.'
      : 'I’m sorry about the way you were treated.'
    const followup = NO_APOLOGY.test(review)
      ? 'You should have had an apology at the time. If you’d like to talk it through, please ask for the duty manager privately.'
      : 'Could you get in touch with the duty manager so we can hear what happened?'
    return [apology, followup].join(' ')
  }
  if (BILL.test(review)) {
    return 'I’m sorry there’s a problem with the bill. Please get in touch with the duty manager and let us know when you visited so we can check it with you.'
  }
  if (PROMPT_INJECTION.test(review)) {
    return 'Thanks for taking the time to leave a rating. If there’s anything genuine you’d like us to know about your visit, please get in touch.'
  }
  const positiveText = review.replace(/\b(?:not|wasn['’]t)\s+[^.!?,]+/gi, '')
  const praiseMatches = ([
    [/\b(?:loved|great|delicious|enjoyed|excellent|lovely|brilliant|fantastic)\s+(?:(?:the|your|our)\s+)?(?:sunday\s+)?roast\b/i, 'the roast'],
    [/\b(?:loved|great|delicious|enjoyed|excellent|lovely|fantastic)\s+(?:(?:the|your|our)\s+)?fish and chips\b/i, 'the fish and chips'],
    [/\b(?:loved|great|delicious|enjoyed|excellent|lovely|fantastic)\s+(?:(?:the|your|our)\s+)?food\b/i, 'the food'],
    [/\b(?:loved|great|enjoyed|excellent|lovely|brilliant|fantastic|cosy|cozy|warm|welcoming)\s+(?:(?:the|your|our)\s+)?(?:atmosphere|ambience|vibe)\b/i, 'the atmosphere'],
    [/\b(?:loved|great|enjoyed|excellent|lovely|brilliant|fantastic|friendly|helpful|attentive)\s+(?:(?:the|your|our)\s+)?(?:service|team|staff)\b/i, 'the service'],
    [/\b(?:loved|great|enjoyed|excellent|lovely|brilliant|fantastic|cold|crisp)\s+(?:(?:the|your|our)\s+)?(?:drinks|pints?|ales?|beer|cocktails?|wine)\b/i, 'the drinks'],
    [/\b(?:loved|great|enjoyed|excellent|lovely|brilliant|fantastic)\s+(?:(?:the|your|our)\s+)?(?:beer\s+)?garden\b/i, 'the beer garden'],
  ] as const).filter(([pattern]) => pattern.test(positiveText)).map(([, phrase]) => phrase)
  const uniquePraise = Array.from(new Set(praiseMatches)).slice(0, 2)
  const compliment = uniquePraise.length === 2
    ? `${uniquePraise[0]} and ${uniquePraise[1].replace(/^the\s+/, '')}`
    : uniquePraise[0]
  const acknowledge = compliment ? 'Glad you enjoyed ' + compliment + '. ' : ''
  if (COLD_FOOD.test(review)) {
    return acknowledge + 'I’m sorry your food was cold. If you’d like to talk it through, please let the duty manager know when you came in.'
  }
  if (DRINKS_DELAY.test(review)) {
    return acknowledge + 'I’m sorry you had to wait so long for your drinks.'
  }
  if (BOOKING.test(review)) {
    return 'I’m sorry we couldn’t get you seated as booked. Please get in touch privately with the duty manager if you’d like us to look into it.'
  }
  if (WRONG_ORDER.test(review)) {
    return acknowledge + 'I’m sorry you were served the wrong order. If you’d like to talk it through, please ask for the duty manager.'
  }
  if (WAIT.test(review)) {
    const reportedMinutes = review.match(/\b(?:took|waited(?:\s+for)?)\s+(\d{1,3})\s+minutes\b/i)?.[1]
    const wait = reportedMinutes ? 'you had to wait ' + Number(reportedMinutes) + ' minutes' : 'we kept you waiting'
    const apology = 'I’m sorry ' + wait + '.'
    if (compliment) return acknowledge + apology
    return apology + ' If you’d like to talk it through, please tell the duty manager when you visited.'
  }
  if (ctx.rating <= 2 || hasReviewComplaint(review)) {
    return 'I’m sorry we let you down. If you’re happy to tell us a bit more, please get in touch with the venue and ask for the duty manager.'
  }
  if (ctx.rating < 4 || /[^\x00-\x7F]/.test(review)) {
    return 'Thanks for taking the time to leave a review. If there’s anything you’d like us to know about your visit, please get in touch.'
  }
  if (compliment) return 'Really glad you enjoyed ' + compliment + '. Thanks for coming in!'
  if (ctx.tone === 'formal') return 'Thank you for the kind rating. We hope to welcome you back soon.'
  if (ctx.tone === 'casual') return 'Cheers for coming in and leaving us a rating. See you next time!'
  return 'Thanks for coming in and taking a moment to leave us a rating.'
}

const replyDetails = [
  [STAFF, /\b(?:staff|team|spoke|spoken|treated|handled)\b/i],
  [NO_APOLOGY, /\b(?:apolog\w*|said sorry)\b/i],
  [BILL, /\b(?:bill|payment|charged|charge)\b/i],
  [DRINKS_DELAY, /\bdrinks?\b/i],
  [WAIT, /\b(?:wait\w*|slow|delay\w*|took)\b/i],
  [COLD_FOOD, /\b(?:cold|lukewarm|temperature|hot|warm)\b/i],
  [BOOKING, /\b(?:book\w*|reserv\w*|table)\b/i],
  [WRONG_ORDER, /\b(?:order|wrong|dish|meal)\b/i],
] as const

function reviewDecision(ctx: ReviewContext, assessment?: unknown) {
  const decision = classifyReview(ctx.rating, ctx.review_text)
  if (decision.disposition !== 'manager' && assessment === 'manager') {
    return { disposition: 'manager' as const, reason: 'The review was flagged for the duty manager to assess.' }
  }
  if (isRoutineReview(decision.disposition) && (assessment === 'approval' || unsafeReply(ctx.review_text, ctx))) {
    return { disposition: 'approval' as const, reason: 'The wording needs a closer look.' }
  }
  return decision
}

export async function generateReviewDraft(ctx: ReviewContext, signature?: string | null) {
  const key = process.env.GEMINI_API_KEY?.trim()
  const model = process.env.GEMINI_REVIEW_MODEL?.trim() || (key ? 'gemini-2.5-flash' : '')
  const hasComment = Boolean(ctx.review_text.trim())
  const defaultText = hasComment ? templateReply(ctx) : ratingOnlyReply(ctx.rating)
  let text = defaultText
  let provider: 'template' | 'gemini' = 'template'
  let assessment: unknown

  if (hasComment && key && model) {
    try {
      const generationConfig: Record<string, unknown> = {
        temperature: 0.35,
        maxOutputTokens: 1024,
        responseMimeType: 'application/json',
        responseJsonSchema: {
          type: 'object',
          properties: {
            reply: { type: 'string' },
            assessment: { type: 'string', enum: ['routine_reply', 'routine_praise', 'approval', 'manager'] },
          },
          required: ['reply', 'assessment'],
        },
      }
      // Disable or cap hidden reasoning tokens on Gemini 2.5 models so replies finish well inside the 8.5s timeout.
      if (/^gemini-2\.5-flash/i.test(model)) {
        generationConfig.thinkingConfig = { thinkingBudget: 0 }
      } else if (/^gemini-2\.5-pro/i.test(model)) {
        generationConfig.thinkingConfig = { thinkingBudget: 128 }
      }
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
          signal: AbortSignal.timeout(8_500),
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: buildSystemPrompt(ctx) }] },
            contents: [{ role: 'user', parts: [{ text: buildUserMessage(ctx) }] }],
            generationConfig,
          }),
        }
      )
      if (!response.ok) throw new Error(`Gemini HTTP ${response.status}`)
      const body = await response.json() as {
        candidates?: Array<{ finishReason?: string; content?: { parts?: Array<{ text?: string; thought?: boolean }> } }>
      }
      const candidate = body.candidates?.[0]
      const output = candidate?.content?.parts?.filter(part => !part.thought)
        .map(part => part.text ?? '').join('').trim()
      if (candidate?.finishReason === 'STOP' && output) {
        const parsed = JSON.parse(output)
        const reply = typeof parsed?.reply === 'string' ? parsed.reply.trim() : ''
        if (['routine_reply', 'routine_praise', 'approval', 'manager'].includes(parsed?.assessment)) {
          assessment = parsed.assessment
          const missesConcern = replyDetails.some(([input, output]) => input.test(ctx.review_text) && !output.test(reply))
          if (reply && reply.length <= 480 && !GENERIC_OPENING.test(reply) && !missesConcern && !unsafeReply(reply, ctx) && !/^[A-Z\s!.]{2,15}$/.test(reply)) {
            text = reply
            provider = 'gemini'
          } else {
            console.warn('[review-draft] Gemini reply rejected by guardrails', { missesConcern, length: reply.length })
          }
        }
      } else {
        console.warn('[review-draft] Gemini incomplete response', { finishReason: candidate?.finishReason ?? 'none' })
      }
    } catch (err) {
      console.warn('[review-draft] Gemini unavailable; using a template draft', err instanceof Error ? err.message : '')
    }
  }

  const signoff = signature?.trim()
  const signedDraft = signoff ? `${text}\n\n${signoff}` : text
  if (Buffer.byteLength(signedDraft, 'utf8') > 4096 || (signoff && unsafeReply(signoff, ctx))) {
    return { text: defaultText, provider: 'template' as const, ...reviewDecision(ctx, assessment === 'manager' ? assessment : 'approval') }
  }
  const decision = reviewDecision(ctx, assessment)
  if (hasComment && provider !== 'gemini' && isRoutineReview(decision.disposition)) {
    return { text: signedDraft, provider, disposition: 'approval' as const, reason: 'The tailored reply could not be verified. Check the draft before posting.' }
  }
  return { text: signedDraft, provider, ...decision }
}
