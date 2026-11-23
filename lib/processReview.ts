import 'server-only'
import { randomUUID } from 'node:crypto'
import { supabase } from '@/lib/supabase'
import { hasServiceAccess } from '@/lib/entitlements'
import { generateReviewDraft } from '@/lib/generateReviewDraft'
import { hasReviewComplaint } from '@/lib/reviewDisposition'
import { reviewPublishingEnabled } from '@/lib/reviewPublishing'

const VALID_SENTIMENTS = new Set(['POSITIVE', 'NEUTRAL', 'NEGATIVE'])
const VALID_PLATFORMS = new Set(['google', 'tripadvisor', 'facebook'])
const VALID_STATUSES = new Set(['pending', 'approved', 'sent', 'skipped'])

function result<T>(data: T, { status = 200 } = {}) {
  return { data, status }
}

export async function processReview(body: Record<string, unknown>, { legacy = false, googleResource = '' } = {}) {
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
  } = body

  // Required
  if (typeof clerk_user_id !== 'string' || !clerk_user_id.trim()) {
    return result({ error: 'Missing or invalid clerk_user_id' }, { status: 400 })
  }

  // Rating: 1–5 integer if present
  if (rating !== undefined && rating !== null) {
    const r = Number(rating)
    if (!Number.isInteger(r) || r < 1 || r > 5) {
      return result({ error: 'rating must be integer 1–5' }, { status: 400 })
    }
  }

  // Sentiment enum if present
  if (sentiment !== undefined && sentiment !== null) {
    if (typeof sentiment !== 'string' || !VALID_SENTIMENTS.has(sentiment)) {
      return result(
        { error: 'sentiment must be one of: POSITIVE, NEUTRAL, NEGATIVE' },
        { status: 400 }
      )
    }
  }

  // Platform enum if present
  if (platform !== undefined && platform !== null) {
    if (typeof platform !== 'string' || !VALID_PLATFORMS.has(platform)) {
      return result(
        { error: 'platform must be one of: google, tripadvisor, facebook' },
        { status: 400 }
      )
    }
  }

  // Status enum if present
  if (status !== undefined && status !== null) {
    if (typeof status !== 'string' || !VALID_STATUSES.has(status)) {
      return result(
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
    .select('clerk_user_id, trial_paused, trial_ends_at, plan, subscription_status')
    .eq('clerk_user_id', clerk_user_id)
    .single()

  if (!profile) {
    console.warn('[process-review] Unknown clerk_user_id:', clerk_user_id)
    return result({ error: 'Unknown user' }, { status: 404 })
  }

  if (!hasServiceAccess(profile)) return result({ error: 'Subscription inactive', skipped: true }, { status: 200 });

  if (typeof external_id !== 'string' || !external_id.trim()) {
    return result({ error: 'external_id is required' }, { status: 400 })
  }
  const reviewFields = {
    clerk_user_id,
    external_id,
    reviewer_name: safeStr(reviewer_name, 200) ?? 'Anonymous',
    rating: rating !== undefined && rating !== null ? Number(rating) : null,
    sentiment: safeStr(sentiment, 20),
    review_text: safeStr(review_text),
    summary: safeStr(summary, 1000),
    platform: safeStr(platform, 50) ?? 'google',
    google_created_at: typeof google_created_at === 'string' ? google_created_at : null,
  }
  let draftClaim: { id: string; token: string; imported: boolean } | null = null
  if (legacy) {
    const { data: existing, error } = await supabase.from('reviews')
      .select('id').eq('clerk_user_id', clerk_user_id).eq('external_id', external_id).maybeSingle()
    if (error) return result({ error: 'Review lookup failed' }, { status: 503 })
    if (existing) return result({ success: true, duplicate: true })
  } else {
    if (!googleResource) return result({ error: 'Missing Google review identity' }, { status: 400 })
    const { data: inserted, error: insertError } = await supabase.from('reviews')
      .upsert({ ...reviewFields, google_review_resource: googleResource, status: 'pending', draft_response: null },
        { onConflict: 'clerk_user_id,external_id', ignoreDuplicates: true })
      .select('id').maybeSingle()
    if (insertError) return result({ error: 'Review insert failed' }, { status: 503 })

    // Bind an old pending row only after seeing the exact review on Google.
    // Existing approvals are never rebound to a new venue.
    if (!inserted) {
      const { error } = await supabase.from('reviews').update({ google_review_resource: googleResource })
        .eq('clerk_user_id', clerk_user_id).eq('external_id', external_id).eq('platform', 'google')
        .eq('status', 'pending').is('google_review_resource', null).is('posted_to_google_at', null)
      if (error) return result({ error: 'Review identity update failed' }, { status: 503 })
    }

    const now = new Date()
    const token = randomUUID()
    const { data: claimed, error: claimError } = await supabase.from('reviews')
      .update({ draft_claim_id: token, draft_claim_until: new Date(now.getTime() + 120_000).toISOString() })
      .eq('clerk_user_id', clerk_user_id).eq('external_id', external_id)
      .eq('google_review_resource', googleResource).eq('status', 'pending').is('draft_response', null)
      .or(`draft_claim_until.is.null,draft_claim_until.lt.${now.toISOString()}`)
      .select('id').maybeSingle()
    if (claimError) return result({ error: 'Draft claim failed' }, { status: 503 })
    if (!claimed) return result({ success: true, duplicate: !inserted })
    draftClaim = { id: claimed.id, token, imported: !!inserted }
  }

  // Generate a draft using the customer's reply settings.
  // Fetch profile + settings for business context
  const legacyPublishing = legacy && reviewPublishingEnabled()
  let finalDraft = legacyPublishing ? safeStr(draft_response) : null
  let finalStatus = legacyPublishing ? (safeStr(status, 20) ?? 'pending') : 'pending'
  let autoSent = false
  try {
    const [{ data: fullProfile }, { data: settings }] = await Promise.all([
      supabase.from('profiles').select('business_name,manager_name,business_type,location').eq('clerk_user_id', clerk_user_id).single(),
      supabase.from('settings').select('tone,auto_send_positive,signature').eq('clerk_user_id', clerk_user_id).single(),
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

    const generated = await generateReviewDraft(ctx, settings?.signature)
    if (!legacy || generated.provider === 'gemini' || !finalDraft?.trim()) finalDraft = generated.text

    // Preserve the legacy Pro setting for existing webhook callers. V1 waits for owner approval.
    const ratingNum = Number(rating) || 3
    const hasComplaint = hasReviewComplaint(safeStr(review_text, 5000) ?? '')
    if (legacyPublishing && generated.provider === 'gemini' && profile.plan === 'pro' && settings?.auto_send_positive && ratingNum >= 4 && !hasComplaint && finalStatus === 'pending' && finalDraft?.trim()) {
      finalStatus = 'approved'
      autoSent = true
    }
  } catch (err) {
    console.error('[process-review] Draft preparation failed:', err)
    // Preserve the imported review so the owner can retry or write a reply.
  }

  if (draftClaim) {
    const { error } = await supabase.from('reviews')
      .update({ draft_response: finalDraft, draft_claim_id: null, draft_claim_until: null })
      .eq('id', draftClaim.id).eq('clerk_user_id', clerk_user_id).eq('draft_claim_id', draftClaim.token)
      .eq('status', 'pending').is('draft_response', null)
    if (error || !finalDraft) return result({ error: 'Draft could not be saved; a later poll can retry' }, { status: 503 })
    return result({ success: true, duplicate: !draftClaim.imported })
  }

  // Legacy webhook callers may still submit drafts through the adapter.
  const { error: upsertError } = await supabase.from('reviews').upsert(
    {
      ...reviewFields,
      draft_response:   finalDraft,
      status:           finalStatus,
      sent_at:          null,
    },
    { onConflict: 'clerk_user_id,external_id', ignoreDuplicates: true }
  )

  if (upsertError) {
    console.error('[process-review] Upsert error:', upsertError)
    return result({ error: upsertError.message }, { status: 500 })
  }

  console.log('[process-review] Review saved for', clerk_user_id, '| external_id:', external_id, '| auto_sent:', autoSent)
  return result({ success: true, auto_sent: autoSent })
}
