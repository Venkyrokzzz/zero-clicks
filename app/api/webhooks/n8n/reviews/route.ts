// app/api/webhooks/n8n/reviews/route.ts
// n8n POSTs here when a new Google review is detected
// Stores the review in Supabase against the correct clerk_user_id
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  // Verify shared secret so only our n8n instance can post here
  const token = req.headers.get('x-zeroclicks-token')
  if (!token || token !== process.env.N8N_WEBHOOK_TOKEN) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  let body: {
    clerk_user_id: string
    external_id?: string
    reviewer_name?: string
    rating?: number
    sentiment?: string
    review_text?: string
    summary?: string
    draft_response?: string
    platform?: string
    google_created_at?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (!body.clerk_user_id) {
    return NextResponse.json({ error: 'Missing clerk_user_id' }, { status: 400 })
  }

  // Confirm this clerk_user_id exists in profiles (safety check)
  const { data: profile } = await supabase
    .from('profiles')
    .select('clerk_user_id')
    .eq('clerk_user_id', body.clerk_user_id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Unknown user' }, { status: 404 })
  }

  // Upsert — idempotent on (clerk_user_id, external_id)
  const { error } = await supabase.from('reviews').upsert({
    clerk_user_id: body.clerk_user_id,
    external_id: body.external_id ?? null,
    reviewer_name: body.reviewer_name ?? 'Anonymous',
    rating: body.rating ?? null,
    sentiment: body.sentiment ?? null,
    review_text: body.review_text ?? null,
    summary: body.summary ?? null,
    draft_response: body.draft_response ?? null,
    platform: body.platform ?? 'google',
    status: 'pending',
    google_created_at: body.google_created_at ?? null,
  }, { onConflict: 'clerk_user_id,external_id' })

  if (error) {
    console.error('Review upsert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
