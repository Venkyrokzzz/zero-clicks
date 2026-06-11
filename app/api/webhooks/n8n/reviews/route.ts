// app/api/webhooks/n8n/reviews/route.ts
// n8n POSTs here when a new Google review is detected
// Stores the review in Supabase against the correct clerk_user_id
//
// Guards:
//   1. Shared-secret auth (x-zeroclicks-token header)
//   2. Payload size limit (32 KB)
//   3. Input validation (types, enums, ranges)
//   4. User existence check (no orphan reviews)
//   5. Trial/paused check (don't process paused accounts)
//   6. Idempotent upsert on (clerk_user_id, external_id)
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { buildSystemPrompt, buildUserMessage } from '@/lib/buildReplyPrompt'
import { verifyToken } from '@/lib/verifyToken'

const MAX_PAYLOAD_BYTES = 32 * 1024 // 32 KB
const VALID_SENTIMENTS = new Set(['POSITIVE', 'NEUTRAL', 'NEGATIVE'])
const VALID_PLATFORMS  = new Set(['google', 'tripadvisor', 'facebook'])
const VALID_STATUSES   = new Set(['pending', 'approved', 'sent', 'skipped'])

export async function POST(req: NextRequest) {
  // ── 1. Shared-secret auth ─────────────────────────────────────────────────
  const token = req.headers.get('x-zeroclicks-token')
  if (!verifyToken(token, process.env.N8N_WEBHOOK_TOKEN)) {
    console.warn('[n8n/reviews] Unauthorised request from', req.headers.get('x-forwarded-for'))
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // ── 2. Payload size guard ─────────────────────────────────────────────────
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  // ── 3. Parse + validate JSON ──────────────────────────────────────────────
  let body: Record<string, unknown>
  try {
    const raw = await req.text()
    if (raw.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }
    body = JSON.parse(raw)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const {
    clerk_user_id,
    external_id,
    reviewer_name,
    rating,
    sentiment,
    review_text,
    summary,
    draft_response,
    platform,
    status,
    google_created_at,
  } = body as Record<string, unknown>

  // Required
  if (typeof clerk_user_id !== 'string' || !clerk_user_id.trim()) {
    return NextResponse.json({ error: 'Missing or invalid clerk_user_id' }, { status: 400 })
  }

  // Rating: 1–5 integer if present
  if (rating !== undefined && rating !== null) {
    const r = Number(rating)
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return NextResponse.json({ error: 'rating must be integer 1–5' }, { status: 400 })
    }
  }

  // Sentiment enum if present
  if (sentiment !== undefined && sentiment !== null) {
    if (typeof sentiment !== 'string' || !VALID_SENTIMENTS.has(sentiment)) {
      return NextResponse.json(
        { error: 'sentiment must be one of: POSITIVE, NEUTRAL, NEGATIVE' },
        { status: 400 }
      )
    }
  }

  // Platform enum if present
  if (platform !== undefined && platform !== null) {
    if (typeof platform !== 'string' || !VALID_PLATFORMS.has(platform)) {
      return NextResponse.json(
        { error: 'platform must be one of: google, tripadvisor, facebook' },
        { status: 400 }
      )
    }
  }

  // Status enum if present
  if (status !== undefined && status !== null) {
    if (typeof status !== 'string' || !VALID_STATUSES.has(status)) {
      return NextResponse.json(
        { error: 'status must be one of: pending, approved, sent, skipped' },
        { status: 400 }
      )
    }
  }

  // String fields: cap length to avoid runaway inserts
  const safeStr = (val: unknown, max = 5000): string | null => {
    if (val === undefined || val === null) return null
    if (typeof val !== 'string') return null
    return val.slice(0, max)
  }

  // ── 4. User existence + trial/paused check ────────────────────────────────
  const { data: profile } = await supabase
    .from('profiles')
    .select('clerk_user_id, trial_paused, trial_ends_at, plan')
    .eq('clerk_user_id', clerk_user_id)
    .single()

  if (!profile) {
    console.warn('[n8n/reviews] Unknown clerk_user_id:', clerk_user_id)
    return NextResponse.json({ error: 'Unknown user' }, { status: 404 })
  }

  // Block paused trials
  if (profile.trial_paused) {
    return NextResponse.json({ error: 'Account paused', skipped: true }, { status: 200 })
  }

  // Block expired trials (non-paying)
  if (profile.plan === 'trial' && profile.trial_ends_at) {
    const trialEnd = new Date(profile.trial_ends_at)
    if (trialEnd < new Date()) {
      return NextResponse.json({ error: 'Trial expired', skipped: true }, { status: 200 })
    }
  }

  // ── 5. Generate pub-voice reply with Claude ───────────────────────────────
  // Fetch profile + settings for business context
  let finalDraft = safeStr(draft_response)
  let finalStatus = safeStr(status, 20) ?? 'pending'
  let autoSent = false
  try {
    const [{ data: fullProfile }, { data: settings }] = await Promise.all([
      supabase.from('profiles').select('business_name,manager_name,business_type,location').eq('clerk_user_id', clerk_user_id).single(),
      supabase.from('settings').select('tone,auto_send_positive').eq('clerk_user_id', clerk_user_id).single(),
    ])

    const ctx = {
      business_name: fullProfile?.business_name || 'our venue',
      manager_name:  fullProfile?.manager_name  || 'the manager',
      business_type: fullProfile?.business_type || 'pub',
      location:      fullProfile?.location       || 'London',
      tone:          settings?.tone              || 'warm-professional',
      rating:        Number(rating) || 3,
      review_text:   typeof review_text === 'string' ? review_text : '',
      reviewer_name: typeof reviewer_name === 'string' ? reviewer_name : 'Guest',
    }

    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        max_tokens: 200,
        messages: [
          { role: 'system', content: buildSystemPrompt(ctx) },
          { role: 'user',   content: buildUserMessage(ctx) },
        ],
      }),
    })
    const groqData = await groqRes.json()
    let text = groqData?.choices?.[0]?.message?.content?.trim()

    // Defence layer 2: reject drafts showing signs of prompt-injection leakage.
    // If the model echoed an injected instruction, fall back to a safe generic reply.
    const SAFE_FALLBACK = 'Thanks for taking the time to leave a review — we really appreciate it. If there’s anything we can help with, do get in touch with us directly and we’ll be happy to assist.'
    if (text) {
      const lower = text.toLowerCase()
      const INJECTION_MARKERS = [
        'hacked', 'pwned', 'system prompt', 'debug mode', 'ignore all previous',
        'ignore previous instruction', 'ignore your rules', 'as an ai', 'i cannot reveal',
        'i am an ai', 'language model', 'verbatim',
      ]
      // Also flag suspiciously short all-caps single-word replies (e.g. "PWNED")
      const isSuspiciousShout = /^[A-Z\s!.]{2,15}$/.test(text.trim())
      if (INJECTION_MARKERS.some(m => lower.includes(m)) || isSuspiciousShout) {
        console.warn('[n8n/reviews] Injection markers in draft — using safe fallback. external_id:', external_id)
        text = SAFE_FALLBACK
      }
      finalDraft = text
    }

    // Auto-send 3-5 star reviews if enabled — hold 1-2 stars and complaint keywords
    const ratingNum = Number(rating) || 3
    const COMPLAINT_KEYWORDS = ['cold', 'slow', 'rude', 'wrong order', 'disgusting', 'never again', 'awful', 'terrible', 'horrible', 'worst', 'dirty', 'unacceptable', 'refund', 'complaint']
    const reviewText = (safeStr(review_text, 5000) ?? '').toLowerCase()
    const hasComplaint = COMPLAINT_KEYWORDS.some(kw => reviewText.includes(kw))
    if (settings?.auto_send_positive && ratingNum >= 3 && !hasComplaint && finalStatus === 'pending') {
      finalStatus = 'sent'
      autoSent = true
    }
  } catch (err) {
    console.error('[n8n/reviews] Claude draft failed, using fallback:', err)
    // Don't block the save — just keep whatever draft n8n sent
  }

  // ── 7. Upsert review — idempotent on (clerk_user_id, external_id) ─────────
  const { error: upsertError } = await supabase.from('reviews').upsert(
    {
      clerk_user_id,
      external_id:      safeStr(external_id, 500),
      reviewer_name:    safeStr(reviewer_name, 200) ?? 'Anonymous',
      rating:           rating !== undefined && rating !== null ? Number(rating) : null,
      sentiment:        safeStr(sentiment, 20),
      review_text:      safeStr(review_text),
      summary:          safeStr(summary, 1000),
      draft_response:   finalDraft,
      platform:         safeStr(platform, 50) ?? 'google',
      status:           finalStatus,
      sent_at:          autoSent ? new Date().toISOString() : null,
      google_created_at: typeof google_created_at === 'string' ? google_created_at : null,
    },
    { onConflict: 'clerk_user_id,external_id' }
  )

  if (upsertError) {
    console.error('[n8n/reviews] Upsert error:', upsertError)
    return NextResponse.json({ error: upsertError.message }, { status: 500 })
  }

  console.log('[n8n/reviews] Review saved for', clerk_user_id, '| external_id:', external_id, '| auto_sent:', autoSent)
  return NextResponse.json({ success: true, auto_sent: autoSent })
}
