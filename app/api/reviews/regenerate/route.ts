// app/api/reviews/regenerate/route.ts
// Regenerates the AI draft for an existing review using current settings
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { supabase } from '@/lib/supabase'
import { buildSystemPrompt, buildUserMessage } from '@/lib/buildReplyPrompt'

const SAFE_FALLBACK = "Thanks for taking the time to leave a review — we really appreciate it. If there's anything we can help with, do get in touch with us directly and we'll be happy to assist."

const INJECTION_MARKERS = [
  'hacked', 'pwned', 'system prompt', 'debug mode', 'ignore all previous',
  'ignore previous instruction', 'ignore your rules', 'as an ai', 'i cannot reveal',
  'i am an ai', 'language model', 'verbatim',
]
const COMPENSATION_MARKERS = [
  "on us", "on the house", "complimentary", "free of charge", "no charge",
  "free drink", "free pint", "free meal", "free round", "free glass",
  "we'll refund", "we will refund", "give you a refund", "full refund",
  "a refund", "discuss a refund", "offer a refund", "issue a refund",
  "money back", "compensation", "voucher", "discount", "off your next",
  "next visit on us", "next one on us",
]

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing review id' }, { status: 400 })

  // Fetch the review — must belong to this user
  const { data: review } = await supabase
    .from('reviews')
    .select('id, reviewer_name, rating, review_text, clerk_user_id')
    .eq('id', id)
    .eq('clerk_user_id', userId)
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

  const anthropic = new Anthropic()
  const message = await anthropic.messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 200,
    system: buildSystemPrompt(ctx),
    messages: [{ role: 'user', content: buildUserMessage(ctx) }],
  })

  const firstBlock = message.content[0]
  let text = firstBlock && firstBlock.type === 'text' ? firstBlock.text.trim() : SAFE_FALLBACK

  // Safety checks
  const lower = text.toLowerCase()
  const isSuspiciousShout = /^[A-Z\s!.]{2,15}$/.test(text.trim())
  if (INJECTION_MARKERS.some(m => lower.includes(m)) || isSuspiciousShout) {
    text = SAFE_FALLBACK
  } else if (COMPENSATION_MARKERS.some(m => lower.includes(m))) {
    text = SAFE_FALLBACK
  }

  // Append signature
  if (settings?.signature && typeof settings.signature === 'string' && settings.signature.trim()) {
    text = `${text}\n\n${settings.signature.trim()}`
  }

  // Persist updated draft
  await supabase
    .from('reviews')
    .update({ draft_response: text })
    .eq('id', id)
    .eq('clerk_user_id', userId)

  return NextResponse.json({ draft: text })
}
