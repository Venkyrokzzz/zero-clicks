// app/api/admin/client/profile/route.ts — admin edit of any user's profile + settings
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

async function requireAdmin() {
  const { sessionClaims } = await auth()
  const role = (sessionClaims?.metadata as Record<string, string> | undefined)?.role
  return role === 'admin'
}

export async function PATCH(req: NextRequest) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()
  const { clerk_user_id, business_name, manager_name, business_type, location, phone, tone, auto_send_positive } = body

  if (!clerk_user_id) return NextResponse.json({ error: 'Missing clerk_user_id' }, { status: 400 })

  const profileUpdate: Record<string, unknown> = {}
  if (business_name !== undefined) profileUpdate.business_name = String(business_name).slice(0, 200)
  if (manager_name  !== undefined) profileUpdate.manager_name  = String(manager_name).slice(0, 200)
  if (business_type !== undefined) profileUpdate.business_type = String(business_type).slice(0, 50)
  if (location      !== undefined) profileUpdate.location      = String(location).slice(0, 200)
  if (phone         !== undefined) profileUpdate.phone         = String(phone).slice(0, 50)

  const settingsUpdate: Record<string, unknown> = {}
  if (tone              !== undefined) settingsUpdate.tone              = String(tone).slice(0, 50)
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
  if (failed?.error) return NextResponse.json({ error: (failed.error as { message: string }).message }, { status: 500 })

  return NextResponse.json({ success: true })
}
