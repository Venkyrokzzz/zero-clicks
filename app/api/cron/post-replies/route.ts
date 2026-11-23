import { randomUUID } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { googleReplyState, googleReviewResource } from '@/lib/googleReviews'
import { getGoogleAccess, recordGoogleAuthFailure, GOOGLE_CONNECTION_FIELDS } from '@/lib/googleAccess'
import { serviceAccess } from '@/lib/requireService'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/verifyToken'
import { reviewPublishingEnabled } from '@/lib/reviewPublishing'

type ApprovedReply = {
  clerk_user_id: string
  google_review_resource: string | null
  draft_response: string | null
  status: string
}

async function publish(review: ApprovedReply, reviewId: string, claim: string) {
  const text = review.draft_response
  const resource = review.google_review_resource
  if (review.status !== 'approved' || !resource || !text?.trim() || Buffer.byteLength(text, 'utf8') > 4096) {
    return { message: 'This reply needs a fresh approval on a verified Google review.', blocked: true } as const
  }

  const { data: connection, error } = await supabase.from('google_connections').select(GOOGLE_CONNECTION_FIELDS)
    .eq('clerk_user_id', review.clerk_user_id).maybeSingle()
  if (error) throw new Error('Could not load the Google connection.')
  if (!connection?.account_id || !connection?.location_id) {
    return { message: 'Connect the original Google venue to resume publishing.' } as const
  }
  if (googleReviewResource(connection.account_id, connection.location_id, resource) !== resource) {
    return { message: 'This review belongs to a different Google venue. Reconnect the original venue.' } as const
  }

  const access = await getGoogleAccess(connection)
  if (!access.token) return { message: 'Reconnect Google to resume publishing.' } as const
  const url = `https://mybusiness.googleapis.com/v4/${resource}`
  const headers = { Authorization: `Bearer ${access.token}` }
  const existing = await fetch(url, { headers, signal: AbortSignal.timeout(8_000) })
  await recordGoogleAuthFailure(connection, access.token, existing.status)
  if (!existing.ok) return { message: `Could not verify the Google review (HTTP ${existing.status}).` } as const
  const googleReview = await existing.json()
  if (googleReview?.name !== resource) return { message: 'Google returned an unexpected review identity.' } as const

  if (googleReview.reviewReply != null) {
    const current = googleReview.reviewReply
    if (typeof current.comment !== 'string' || !current.comment.trim()) {
      return { message: 'Could not verify the existing Google reply.' } as const
    }
    if (current.comment !== text) {
      return { message: 'Already replied on Google. The existing reply was kept.', blocked: true } as const
    }
    return { submitted: true, state: googleReplyState(current.reviewReplyState) } as const
  }

  // Confirm the venue and grant still match after the preflight Google read.
  const [{ data: stillConnected, error: connectionCheckError }, { data: stillApproved, error: approvalCheckError }] = await Promise.all([
    supabase.from('google_connections').select('clerk_user_id').eq('clerk_user_id', review.clerk_user_id)
      .eq('account_id', connection.account_id).eq('location_id', connection.location_id)
      .eq('refresh_token', connection.refresh_token).maybeSingle(),
    supabase.from('reviews').select('id').eq('id', reviewId).eq('clerk_user_id', review.clerk_user_id)
      .eq('publish_claim_id', claim).eq('status', 'approved').eq('draft_response', text)
      .eq('google_review_resource', resource).is('posted_to_google_at', null).maybeSingle(),
  ])
  if (connectionCheckError) throw new Error('Could not recheck the Google connection.')
  if (!stillConnected) return { message: 'Google connection changed. Publishing was deferred.' } as const
  if (approvalCheckError) throw new Error('Could not recheck the reply approval.')
  if (!stillApproved) return { message: 'Reply approval changed. Publishing was deferred.' } as const

  const response = await fetch(`${url}/reply`, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ comment: text }),
    signal: AbortSignal.timeout(8_000),
  })
  await recordGoogleAuthFailure(connection, access.token, response.status)
  if (!response.ok) return { message: `Google could not accept the reply (HTTP ${response.status}).` } as const
  const accepted = await response.json().catch(() => ({}))
  return { submitted: true, state: googleReplyState(accepted.reviewReplyState) } as const
}

export async function GET(req: NextRequest) {
  const bearer = req.headers.get('authorization')?.match(/^Bearer (.+)$/)?.[1] ?? null
  if (!verifyToken(bearer, process.env.CRON_SECRET)
      && !verifyToken(req.headers.get('x-zeroclicks-token'), process.env.N8N_WEBHOOK_TOKEN)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  if (!reviewPublishingEnabled()) {
    return NextResponse.json({ posted: 0, skipped: 'draft_only' })
  }

  const startedAt = Date.now()
  const results: Array<{ id: string; submitted?: boolean; deferred?: boolean; error?: string }> = []
  const seen = new Set<string>()
  let attempts = 0
  let scanned = 0
  let deferred = 0
  let stopReason = 'queue_empty'

  // Bound each invocation; claims/deferred eligibility persist between invocations.
  work: while (attempts < 20 && scanned < 200) {
    if (Date.now() - startedAt >= 20_000) { stopReason = 'time_budget'; break }
    const eligible = `publish_claim_until.is.null,publish_claim_until.lt.${new Date().toISOString()}`
    const { data: reviews, error } = await supabase.from('reviews')
      .select('id, clerk_user_id').in('status', ['approved', 'sent'])
      .is('posted_to_google_at', null).eq('publication_blocked', false).or(eligible)
      .order('publish_claim_until', { ascending: true, nullsFirst: true }).order('id').limit(20)
    if (error) {
      return NextResponse.json({ error: 'Could not load the publish queue.', results }, { status: 500 })
    }
    if (!reviews?.length) break
    let progressed = false
    for (const review of reviews) {
      if (attempts >= 20 || scanned >= 200 || Date.now() - startedAt >= 20_000) {
        stopReason = attempts >= 20 ? 'attempt_limit' : scanned >= 200 ? 'scan_limit' : 'time_budget'
        break work
      }
      if (seen.has(review.id)) continue
      seen.add(review.id)
      scanned++
      progressed = true
      const claim = randomUUID()
      const { data: claimed, error: claimError } = await supabase.from('reviews')
        .update({ publish_claim_id: claim, publish_claim_until: new Date(Date.now() + 120_000).toISOString() })
        .eq('id', review.id).eq('clerk_user_id', review.clerk_user_id)
        .in('status', ['approved', 'sent']).is('posted_to_google_at', null)
        .eq('publication_blocked', false).or(eligible)
        .select('clerk_user_id, google_review_resource, draft_response, status').maybeSingle()
      if (claimError) {
        results.push({ id: review.id, error: 'Could not claim the reply.' })
        continue
      }
      if (!claimed) continue

      let access: boolean | null = null
      try { access = await serviceAccess(review.clerk_user_id) } catch { /* Fail closed; recheck later. */ }
      if (access) attempts++
      const outcome = access ? await publish(claimed, review.id, claim).catch(() => ({
        message: 'Could not confirm the result with Google. The reply will be rechecked.',
      } as const)) : {
        message: access === false ? 'Subscription inactive. Reply remains queued until access resumes.'
          : 'Could not verify the customer plan. Publishing was deferred.',
      }
      const submitted = 'submitted' in outcome
      const timestamp = new Date().toISOString()
      const changes = submitted ? {
        status: 'sent', sent_at: timestamp, posted_to_google_at: timestamp,
        google_reply_state: outcome.state, publication_message: null,
        publish_claim_until: null,
      } : {
        publication_blocked: 'blocked' in outcome && outcome.blocked,
        publication_message: outcome.message,
        publish_claim_until: access ? timestamp : new Date(Date.now() + (access === false ? 3_600_000 : 300_000)).toISOString(),
      }
      const { data: saved, error: saveError } = await supabase.from('reviews')
        .update({ ...changes, publish_claim_id: null })
        .eq('id', review.id).eq('clerk_user_id', review.clerk_user_id).eq('publish_claim_id', claim)
        .select('id').maybeSingle()
      if (saveError || !saved) results.push({ id: review.id, error: 'Could not save the publish result. The next attempt will recheck Google.' })
      else if (submitted) results.push({ id: review.id, submitted: true })
      else if (access === false) { deferred++; results.push({ id: review.id, deferred: true }) }
      else results.push({ id: review.id, error: outcome.message })
    }
    if (!progressed) { stopReason = 'no_progress'; break }
  }
  if (attempts >= 20) stopReason = 'attempt_limit'
  else if (scanned >= 200) stopReason = 'scan_limit'

  const posted = results.filter(result => result.submitted).length
  return NextResponse.json({ posted, total: scanned, attempts, deferred, stop_reason: stopReason, results },
    { status: results.some(result => result.error) ? 502 : 200 })
}
