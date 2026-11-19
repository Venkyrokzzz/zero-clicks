import { googleRating, googleReviewsUrl, googleReviewResource, googleReplyState } from '@/lib/googleReviews'
import { processReview } from '@/lib/processReview'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/verifyToken'
import { getGoogleAccess, recordGoogleAuthFailure, GOOGLE_CONNECTION_FIELDS } from '@/lib/googleAccess'
import { serviceAccess } from '@/lib/requireService'

function toSentiment(rating: number) {
  if (rating >= 4) return 'POSITIVE'
  if (rating === 3) return 'NEUTRAL'
  return 'NEGATIVE'
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
  const customer = new URL(req.url).searchParams.get('customer')
  const query = supabase
    .from('google_connections')
    .select(GOOGLE_CONNECTION_FIELDS)
    .not('account_id', 'is', null)
    .not('location_id', 'is', null)
    .not('refresh_token', 'is', null)

  const { data: connections, error: connErr } = await (customer ? query.eq('clerk_user_id', customer) : query)
  if (connErr) return NextResponse.json({ error: connErr.message }, { status: 500 })
  if (!connections?.length) return NextResponse.json({ processed: 0, message: 'No connected clients' })

  const results = []

  for (const conn of connections) {
    try {
      if (!(await serviceAccess(conn.clerk_user_id))) continue
      const access = await getGoogleAccess(conn)
      if (!access.token) throw new Error('Reconnect Google to resume review sync')

      let newCount = 0
      let fetched = 0
      let pageToken = ''
      const seenTokens = new Set<string>()
      do {
        const params = new URLSearchParams({ pageSize: '50', orderBy: 'updateTime desc' })
        if (pageToken) params.set('pageToken', pageToken)
        const reviewsRes = await fetch(
          `${googleReviewsUrl(conn.account_id, conn.location_id)}?${params}`,
          { headers: { Authorization: `Bearer ${access.token}` }, signal: AbortSignal.timeout(8_000) }
        )
        if (!reviewsRes.ok) {
          await recordGoogleAuthFailure(conn, access.token, reviewsRes.status)
          throw new Error(`Google ${reviewsRes.status}: Review sync failed`)
        }
        const { reviews = [], nextPageToken } = await reviewsRes.json()
        fetched += reviews.length

        for (const review of reviews) {
          const external_id = review.reviewId ?? review.name
          if (!external_id) continue
          const resource = googleReviewResource(conn.account_id, conn.location_id, review.name ?? external_id)
          if (!resource || resource.split('/').pop() !== external_id.split('/').pop()) continue

          // Only reconcile our own submitted text on the original venue.
          if (review.reviewReply?.comment) {
            const state = googleReplyState(review.reviewReply.reviewReplyState)
            if (state !== 'unknown') {
              const { error } = await supabase.from('reviews').update({ google_reply_state: state })
                .eq('clerk_user_id', conn.clerk_user_id).eq('google_review_resource', resource)
                .eq('status', 'sent').eq('draft_response', review.reviewReply.comment)
                .not('posted_to_google_at', 'is', null)
              if (error) throw new Error('Could not record Google reply moderation')
            }
            continue
          }

          const rating = googleRating(review.starRating)
          if (!rating) continue

          const outcome = await processReview({
            clerk_user_id: conn.clerk_user_id,
            external_id,
            reviewer_name: review.reviewer?.displayName ?? 'Guest',
            rating,
            sentiment: toSentiment(rating),
            review_text: review.comment ?? '',
            platform: 'google',
            google_created_at: review.createTime ?? null,
          }, { googleResource: resource })
          if (outcome.status >= 400) throw new Error(`Review ingestion failed: ${outcome.status}`)
          if ('skipped' in outcome.data) throw new Error('Review sync paused by service limits')
          if (!('duplicate' in outcome.data) || !outcome.data.duplicate) newCount++
        }

        pageToken = nextPageToken ?? ''
        if (pageToken && seenTokens.has(pageToken)) throw new Error('Google repeated a review page token')
        if (pageToken) seenTokens.add(pageToken)
      } while (pageToken)

      const { error: syncError } = await supabase.from('google_connections')
        .update({ last_synced_at: new Date().toISOString() })
        .eq('clerk_user_id', conn.clerk_user_id).eq('account_id', conn.account_id).eq('location_id', conn.location_id)
      if (syncError) throw new Error('Could not record the last successful sync')
      results.push({ clerk_user_id: conn.clerk_user_id, new_reviews: newCount, fetched })
    } catch (err: unknown) {
      results.push({ clerk_user_id: conn.clerk_user_id, error: err instanceof Error ? err.message : String(err) })
    }
  }

  console.log('[cron/poll-reviews]', JSON.stringify(results))
  return NextResponse.json({ processed: connections.length, results }, { status: results.some(r => 'error' in r) ? 502 : 200 })
}
