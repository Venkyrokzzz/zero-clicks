import { serviceAccess } from '@/lib/requireService';
// app/api/reviews/regenerate/route.ts
// Regenerates the AI draft for an existing review using current settings
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateReviewDraft } from '@/lib/generateReviewDraft'
import { consumeRequestBudget } from '@/lib/sharedRateLimit'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!(await serviceAccess(userId))) return NextResponse.json({ error: 'Subscription inactive' }, { status: 403 });
  const body = await req.json().catch(() => null)
  const id = body?.id
  if (typeof id !== 'string' || !id.trim() || id.length > 128) {
    return NextResponse.json({ error: 'Invalid review id' }, { status: 400 })
  }
  const budget = await consumeRequestBudget(`review-regenerate:${userId}`, 12, 60)
  if (budget === 'unavailable') {
    return NextResponse.json({ error: 'Draft regeneration is temporarily unavailable.' }, { status: 503 })
  }
  if (budget === 'limited') {
    return NextResponse.json({ error: 'Too many draft requests. Try again in a minute.' }, { status: 429 })
  }

  // Fetch the review — must belong to this user
  const { data: review } = await supabase
    .from('reviews')
    .select('id, reviewer_name, rating, review_text, clerk_user_id')
    .eq('id', id)
    .eq('clerk_user_id', userId)
    .eq('status', 'pending')
    .single()

  if (!review) return NextResponse.json({ error: 'Review not found' }, { status: 404 })

  // Fetch profile + settings in parallel
  const [{ data: profile }, { data: settings }] = await Promise.all([
    supabase.from('profiles').select('business_name,manager_name,business_type,location').eq('clerk_user_id', userId).single(),
    supabase.from('settings').select('tone,signature').eq('clerk_user_id', userId).single(),
  ])

  const ctx = {
    business_name: profile?.business_name || 'our venue',
    manager_name:  profile?.manager_name  || 'the manager',
    business_type: profile?.business_type || 'pub',
    location:      profile?.location       || 'London',
    tone:          settings?.tone          || 'warm-professional',
    rating:        Number(review.rating)   || 3,
    review_text:   review.review_text      || '',
    reviewer_name: review.reviewer_name    || 'Guest',
  }

  const { text } = await generateReviewDraft(ctx, settings?.signature)

  // Persist updated draft
  const { data: updated, error: saveError } = await supabase
    .from('reviews')
    .update({ draft_response: text })
    .eq('id', id)
    .eq('clerk_user_id', userId)
    .eq('status', 'pending')
    .is('posted_to_google_at', null)
    .select('id')
    .maybeSingle()

  if (saveError) return NextResponse.json({ error: 'Unable to save the draft.' }, { status: 500 })
  if (!updated) return NextResponse.json({ error: 'This review is no longer editable.' }, { status: 409 })

  return NextResponse.json({ draft: text })
}
