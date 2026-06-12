// app/api/cron/post-replies/route.ts
// Replaces the n8n ZC — Post Replies workflow.
// Called every 30 min by GitHub Actions (same cadence as poll-reviews).
// For each sent review not yet posted: refresh token if needed, PUT reply to Google,
// mark posted_to_google_at. Retries 401/403 up to 3 times with 30s backoff.
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/verifyToken'

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function refreshAccessToken(refreshToken: string): Promise<{ access_token: string; expires_in: number } | null> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id:     process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type:    'refresh_token',
    }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    if (body?.error === 'invalid_grant') return null
    return null
  }
  return res.json()
}

async function postReplyToGoogle(
  accessToken: string,
  locationId: string,
  externalId: string,
  replyText: string,
): Promise<{ ok: boolean; status: number; body: string }> {
  // external_id may be a full resource name — extract just the review ID
  const reviewId = externalId.includes('/') ? externalId.split('/').pop()! : externalId
  const cleanLocationId = locationId.replace('locations/', '')
  const url = `https://mybusinessreviews.googleapis.com/v1/locations/${cleanLocationId}/reviews/${reviewId}/reply`

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      Authorization:  `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ comment: replyText }),
  })
  const body = await res.text()
  return { ok: res.ok, status: res.status, body: body.slice(0, 200) }
}

export async function GET(req: NextRequest) {
  const bearer       = req.headers.get('authorization')?.replace('Bearer ', '')
  const webhookToken = req.headers.get('x-zeroclicks-token')
  const cronOk    = bearer && process.env.CRON_SECRET && bearer === process.env.CRON_SECRET
  const webhookOk = verifyToken(webhookToken, process.env.N8N_WEBHOOK_TOKEN)

  if (!cronOk && !webhookOk) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Fetch reviews waiting to be posted (status=sent, not yet stamped)
  const { data: reviews, error: revErr } = await supabase
    .from('reviews')
    .select('id, clerk_user_id, external_id, draft_response')
    .eq('status', 'sent')
    .is('posted_to_google_at', null)
    .limit(50)

  if (revErr) return NextResponse.json({ error: revErr.message }, { status: 500 })
  if (!reviews?.length) return NextResponse.json({ posted: 0, message: 'Nothing to post' })

  // Fetch google_connections for those users
  const userIds = Array.from(new Set(reviews.map(r => r.clerk_user_id)))
  const { data: connections, error: connErr } = await supabase
    .from('google_connections')
    .select('clerk_user_id, access_token, refresh_token, access_token_expires_at, location_id')
    .in('clerk_user_id', userIds)
    .not('location_id', 'is', null)

  if (connErr) return NextResponse.json({ error: connErr.message }, { status: 500 })

  const connMap = Object.fromEntries((connections ?? []).map(c => [c.clerk_user_id, c]))
  const results = []

  for (const review of reviews) {
    const conn = connMap[review.clerk_user_id]
    if (!conn) {
      results.push({ id: review.id, error: 'No Google connection' })
      continue
    }

    // Refresh token if it expires within 5 minutes
    let accessToken = conn.access_token
    const expiresAt = conn.access_token_expires_at ? new Date(conn.access_token_expires_at) : new Date(0)
    if (expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
      const refreshed = await refreshAccessToken(conn.refresh_token)
      if (!refreshed) {
        // invalid_grant — refresh token is permanently revoked; flag for reconnect
        await supabase
          .from('google_connections')
          .update({ needs_reconnect: true })
          .eq('clerk_user_id', review.clerk_user_id)
        results.push({ id: review.id, error: 'invalid_grant — needs_reconnect flagged' })
        continue
      }
      accessToken = refreshed.access_token
      const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
      await supabase
        .from('google_connections')
        .update({ access_token: accessToken, access_token_expires_at: newExpiry })
        .eq('clerk_user_id', review.clerk_user_id)
    }

    // Attempt to post reply — retry up to 3 times on 401/403 (transient Google issues)
    let result = { ok: false, status: 0, body: '' }
    for (let attempt = 1; attempt <= 3; attempt++) {
      result = await postReplyToGoogle(accessToken, conn.location_id, review.external_id, review.draft_response)
      if (result.ok) break
      if (result.status === 401 || result.status === 403) {
        if (attempt < 3) await sleep(30_000)
      } else {
        break // not a transient auth error — don't retry
      }
    }

    if (result.ok) {
      await supabase
        .from('reviews')
        .update({ posted_to_google_at: new Date().toISOString() })
        .eq('id', review.id)
      results.push({ id: review.id, posted: true })
    } else {
      results.push({ id: review.id, error: `Google ${result.status}: ${result.body}` })
    }
  }

  const posted = results.filter(r => 'posted' in r && r.posted).length
  console.log('[cron/post-replies]', JSON.stringify(results))
  return NextResponse.json({ posted, total: reviews.length, results })
}
