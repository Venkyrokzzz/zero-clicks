// app/api/cron/poll-reviews/route.ts
// Replaces the n8n Review Poller workflow.
// Called every 30 min by n8n (or Vercel cron on Pro).
// For each connected client: refresh OAuth token, fetch Google reviews, forward new ones to the reviews webhook.
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/verifyToken'

const STAR_TO_NUMBER: Record<string, number> = {
  ONE_STAR: 1, TWO_STARS: 2, THREE_STARS: 3, FOUR_STARS: 4, FIVE_STARS: 5,
}

function toSentiment(rating: number) {
  if (rating >= 4) return 'POSITIVE'
  if (rating === 3) return 'NEUTRAL'
  return 'NEGATIVE'
}

async function refreshToken(refreshToken: string) {
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
  if (!res.ok) return null
  return res.json() as Promise<{ access_token: string; expires_in: number }>
}

export async function GET(req: NextRequest) {
  // Accept either Vercel CRON_SECRET (Bearer token) or the shared webhook token
  const bearer = req.headers.get('authorization')?.replace('Bearer ', '')
  const webhookToken = req.headers.get('x-zeroclicks-token')
  const cronOk = bearer && process.env.CRON_SECRET && bearer === process.env.CRON_SECRET
  const webhookOk = verifyToken(webhookToken, process.env.N8N_WEBHOOK_TOKEN)

  if (!cronOk && !webhookOk) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // Fetch all clients with a connected Google account
  const { data: connections, error: connErr } = await supabase
    .from('google_connections')
    .select('clerk_user_id, account_id, location_id, access_token, refresh_token, access_token_expires_at')
    .not('account_id', 'is', null)
    .not('refresh_token', 'is', null)

  if (connErr) return NextResponse.json({ error: connErr.message }, { status: 500 })
  if (!connections?.length) return NextResponse.json({ processed: 0, message: 'No connected clients' })

  const siteBase = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.0-clicks.uk'
  const results = []

  for (const conn of connections) {
    try {
      // Refresh access token if it expires within 5 minutes
      let accessToken = conn.access_token
      const expiresAt = conn.access_token_expires_at ? new Date(conn.access_token_expires_at) : new Date(0)
      if (expiresAt.getTime() - Date.now() < 5 * 60 * 1000) {
        const refreshed = await refreshToken(conn.refresh_token)
        if (!refreshed) {
          results.push({ clerk_user_id: conn.clerk_user_id, error: 'Token refresh failed' })
          continue
        }
        accessToken = refreshed.access_token
        const newExpiry = new Date(Date.now() + refreshed.expires_in * 1000).toISOString()
        await supabase.from('google_connections')
          .update({ access_token: accessToken, access_token_expires_at: newExpiry })
          .eq('clerk_user_id', conn.clerk_user_id)
      }

      // Fetch latest 50 reviews from Google Business Profile
      const accountId  = conn.account_id.replace('accounts/', '')
      const locationId = conn.location_id.replace('locations/', '')
      const parent     = `accounts/${accountId}/locations/${locationId}`

      const reviewsRes = await fetch(
        `https://mybusinessreviews.googleapis.com/v1/${parent}/reviews?pageSize=50&orderBy=updateTime+desc`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )

      if (!reviewsRes.ok) {
        const body = await reviewsRes.text()
        results.push({ clerk_user_id: conn.clerk_user_id, error: `Google ${reviewsRes.status}: ${body.slice(0, 120)}` })
        continue
      }

      const { reviews = [] } = await reviewsRes.json()
      let newCount = 0

      for (const review of reviews) {
        const external_id = review.reviewId ?? review.name
        if (!external_id) continue

        // Skip reviews that already have a reply posted — nothing to do
        if (review.reviewReply?.comment) continue

        // Dedup: skip if already in DB
        const { data: existing } = await supabase
          .from('reviews')
          .select('id')
          .eq('clerk_user_id', conn.clerk_user_id)
          .eq('external_id', external_id)
          .maybeSingle()

        if (existing) continue

        const rating = STAR_TO_NUMBER[review.starRating] ?? 3

        // Forward to reviews webhook — reuses all existing AI draft, injection filter, auto-send logic
        await fetch(`${siteBase}/api/webhooks/n8n/reviews`, {
          method: 'POST',
          headers: {
            'Content-Type':       'application/json',
            'x-zeroclicks-token': process.env.N8N_WEBHOOK_TOKEN!,
          },
          body: JSON.stringify({
            clerk_user_id: conn.clerk_user_id,
            external_id,
            reviewer_name:     review.reviewer?.displayName ?? 'Guest',
            rating,
            sentiment:         toSentiment(rating),
            review_text:       review.comment ?? '',
            platform:          'google',
            google_created_at: review.createTime ?? null,
          }),
        })
        newCount++
      }

      results.push({ clerk_user_id: conn.clerk_user_id, new_reviews: newCount, fetched: reviews.length })
    } catch (err: unknown) {
      results.push({ clerk_user_id: conn.clerk_user_id, error: err instanceof Error ? err.message : String(err) })
    }
  }

  console.log('[cron/poll-reviews]', JSON.stringify(results))
  return NextResponse.json({ processed: connections.length, results })
}
