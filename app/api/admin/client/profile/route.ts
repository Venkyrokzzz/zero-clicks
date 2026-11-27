// app/api/admin/client/profile/route.ts — admin edit of any user's profile + settings
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

import { isWorkspaceOwner } from "@/lib/workspaceAccess";
import { reviewPublishingEnabled } from "@/lib/reviewPublishing";

async function requireAdmin() {
  const { userId } = await auth();
  return isWorkspaceOwner(userId);
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
  }
  const { clerk_user_id, business_name, manager_name, business_type, location, phone, tone, auto_send_positive } = body as Record<string, unknown>

  if (typeof clerk_user_id !== 'string' || !clerk_user_id.trim()) {
    return NextResponse.json({ error: 'Missing clerk_user_id' }, { status: 400 })
  }

  const VALID_TYPES = ['pub', 'restaurant', 'cafe', 'hotel', 'bar']
  const VALID_TONES = ['warm-professional', 'casual', 'formal']

  const profileUpdate: Record<string, unknown> = {}
  if (business_name !== undefined) profileUpdate.business_name = String(business_name).slice(0, 200)
  if (manager_name  !== undefined) profileUpdate.manager_name  = String(manager_name).slice(0, 200)
  if (business_type !== undefined) {
    if (typeof business_type !== 'string' || !VALID_TYPES.includes(business_type)) {
      return NextResponse.json({ error: 'Invalid business_type' }, { status: 400 })
    }
    profileUpdate.business_type = business_type
  }
  if (location      !== undefined) profileUpdate.location      = String(location).slice(0, 200)
  if (phone         !== undefined) profileUpdate.phone         = String(phone).slice(0, 50)

  const settingsUpdate: Record<string, unknown> = {}
  if (tone !== undefined) {
    if (typeof tone !== 'string' || !VALID_TONES.includes(tone)) {
      return NextResponse.json({ error: 'Invalid tone' }, { status: 400 })
    }
    settingsUpdate.tone = tone
  }
  if (Boolean(auto_send_positive) && !reviewPublishingEnabled())
    return NextResponse.json({ error: 'Publishing is off during the draft pilot.' }, { status: 409 })
  if (auto_send_positive !== undefined) settingsUpdate.auto_send_positive = Boolean(auto_send_positive)

  if (Object.keys(profileUpdate).length === 0 && Object.keys(settingsUpdate).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const results = await Promise.all([
    Object.keys(profileUpdate).length > 0
      ? supabase.from('profiles').update(profileUpdate).eq('clerk_user_id', clerk_user_id)
      : Promise.resolve({ error: null }),
    Object.keys(settingsUpdate).length > 0
      ? supabase.from('settings').update(settingsUpdate).eq('clerk_user_id', clerk_user_id)
      : Promise.resolve({ error: null }),
  ])

  const failed = results.find(r => r.error)
  if (failed?.error) return NextResponse.json({ error: 'Could not update client profile.' }, { status: 500 })

  return NextResponse.json({ success: true })
}
