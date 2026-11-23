import { serviceAccess } from '@/lib/requireService';
// app/api/settings/route.ts — GET + PUT current user settings
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { reviewPublishingEnabled } from '@/lib/reviewPublishing'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  if (!(await serviceAccess(userId))) return NextResponse.json({ error: 'Subscription inactive' }, { status: 403 });
  const body = await req.json()
  const { tone, auto_send_positive, flag_negative, signature } = body

  if (auto_send_positive === true) {
    if (!reviewPublishingEnabled())
      return NextResponse.json({ error: 'Google publishing is off during the draft pilot.' }, { status: 409 })
    const { data: profile } = await supabase.from('profiles').select('plan').eq('clerk_user_id', userId).single();
    if (profile?.plan !== 'pro') return NextResponse.json({ error: 'Automatic sending requires Pro' }, { status: 403 });
  }

  const { error } = await supabase
    .from('settings')
    .update({
      tone,
      auto_send_positive,
      flag_negative,
      signature,
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_user_id', userId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
