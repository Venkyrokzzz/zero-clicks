// app/api/admin/client/reviews/route.ts
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

import { isWorkspaceOwner } from "@/lib/workspaceAccess";

const ADMIN_REVIEW_FIELDS =
  'id, reviewer_name, rating, review_text, status, draft_response, created_at, posted_to_google_at, automatically_approved, publication_message, publication_blocked, google_reply_state'

const privateHeaders = { 'Cache-Control': 'private, no-store' }

async function requireAdmin() {
  const { userId } = await auth();
  return isWorkspaceOwner(userId);
}

// GET /api/admin/client/reviews?id=clerk_user_id
export async function GET(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403, headers: privateHeaders })
  }
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400, headers: privateHeaders })

  const { data: reviews, error } = await supabase
    .from('reviews')
    .select(ADMIN_REVIEW_FIELDS)
    .eq('clerk_user_id', id)
    .order('created_at', { ascending: false })
    .limit(100)

  if (error) return NextResponse.json({ error: 'Could not load reviews.' }, { status: 500, headers: privateHeaders })
  return NextResponse.json({ reviews: reviews ?? [] }, { headers: privateHeaders })
}

// DELETE /api/admin/client/reviews?id=review_id  OR ?user_id=clerk_user_id (bulk clear)
export async function DELETE(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const review_id = req.nextUrl.searchParams.get('id')
  const user_id   = req.nextUrl.searchParams.get('user_id')

  if (review_id) {
    const { error } = await supabase.from('reviews').delete().eq('id', review_id)
    if (error) return NextResponse.json({ error: 'Could not delete review.' }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  if (user_id) {
    // Bulk delete all reviews for a user (for clearing test/demo data)
    const { error } = await supabase.from('reviews').delete().eq('clerk_user_id', user_id)
    if (error) return NextResponse.json({ error: 'Could not delete reviews.' }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ error: 'Missing id or user_id' }, { status: 400 })
}

// PATCH /api/admin/client/reviews — update status or draft for one review
export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const { review_id, status, draft_response } = body as Record<string, unknown>

  if (typeof review_id !== 'string' || !review_id.trim()) return NextResponse.json({ error: 'Missing review_id' }, { status: 400 })

  const VALID_STATUSES = ['pending', 'skipped']
  const update: Record<string, unknown> = {}
  if (status !== undefined) {
    if (typeof status !== 'string' || !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: 'Only the owner can approve a reply. Publication is recorded by the publisher.' }, { status: 400 })
    }
    update.status = status
  }
  if (draft_response !== undefined) {
    if (typeof draft_response !== 'string' || Buffer.byteLength(draft_response, 'utf8') > 4096) {
      return NextResponse.json({ error: 'Invalid draft text.' }, { status: 400 })
    }
    update.draft_response = draft_response
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const { data, error } = await supabase.from('reviews').update(update).eq('id', review_id)
    .in('status', ['pending', 'skipped']).is('posted_to_google_at', null).select('id').maybeSingle()
  if (error) return NextResponse.json({ error: 'Could not update review.' }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'This review can no longer be edited.' }, { status: 409 })
  return NextResponse.json({ success: true })
}
