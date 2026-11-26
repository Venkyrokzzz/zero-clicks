import { serviceAccess } from '@/lib/requireService';
// app/api/settings/route.ts — GET + PUT current user settings
import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { googleVenueResource } from '@/lib/googleReviews'
import { reviewPublishingEnabled } from '@/lib/reviewPublishing'

async function getVenue(userId: string) {
  const { data, error } = await supabase.from('google_connections')
    .select('account_id, location_id, refresh_token, needs_reconnect').eq('clerk_user_id', userId).maybeSingle()
  if (error) throw new Error('Could not check the connected venue.')
  return data?.account_id && data.location_id && data.refresh_token && !data.needs_reconnect
    ? googleVenueResource(data.account_id, data.location_id) : null
}

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('clerk_user_id', userId)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  const venue = await getVenue(userId).catch(() => null)
  return NextResponse.json({
    tone: data.tone, signature: data.signature, flag_negative: data.flag_negative,
    autoPublishRoutine: Boolean(data.auto_publish_venue && data.auto_publish_enabled_at && (!venue || data.auto_publish_venue === venue)),
    canEnableAutomaticPublishing: Boolean(venue) && reviewPublishingEnabled(),
  })
}

export async function PUT(req: Request) {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body || typeof body !== 'object' || Array.isArray(body)) return NextResponse.json({ error: 'Invalid settings.' }, { status: 400 })
  const { tone, auto_send_positive, flag_negative, signature, autoPublishRoutine } = body
  const hasAccess = await serviceAccess(userId)
  if (!hasAccess && autoPublishRoutine !== false) return NextResponse.json({ error: 'Subscription inactive' }, { status: 403 });
  if (autoPublishRoutine !== undefined && typeof autoPublishRoutine !== 'boolean') return NextResponse.json({ error: 'Invalid automatic publishing setting.' }, { status: 400 });

  if (auto_send_positive === true) {
    if (!reviewPublishingEnabled())
      return NextResponse.json({ error: 'Google publishing is off during the draft pilot.' }, { status: 409 })
    const { data: profile } = await supabase.from('profiles').select('plan').eq('clerk_user_id', userId).single();
    if (profile?.plan !== 'pro') return NextResponse.json({ error: 'Automatic sending requires Pro' }, { status: 403 });
  }

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (hasAccess) Object.assign(update, { tone, auto_send_positive, flag_negative, signature })
  if (autoPublishRoutine === true) {
    if (!reviewPublishingEnabled()) return NextResponse.json({ error: 'Google publishing is unavailable.' }, { status: 409 })
    const venue = await getVenue(userId).catch(() => null)
    if (!venue) return NextResponse.json({ error: 'Connect your Google venue before enabling automatic replies.' }, { status: 409 })
    update.auto_publish_venue = venue
    update.auto_publish_enabled_at = new Date().toISOString()
  } else if (autoPublishRoutine === false) {
    update.auto_publish_venue = null
    update.auto_publish_enabled_at = null
  }
  const { data: saved, error } = await supabase
    .from('settings')
    .update(update)
    .eq('clerk_user_id', userId)
    .select('clerk_user_id').maybeSingle()

  if (!error && !saved) return NextResponse.json({ error: 'Finish account setup before changing settings.' }, { status: 409 })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
