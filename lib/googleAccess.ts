import 'server-only'
import { supabase } from '@/lib/supabase'

export type GoogleConnection = {
  clerk_user_id: string
  account_id: string
  location_id: string
  access_token: string | null
  refresh_token: string | null
  access_token_expires_at: string | null
  needs_reconnect: boolean | null
}

export const GOOGLE_CONNECTION_FIELDS = 'clerk_user_id, account_id, location_id, access_token, refresh_token, access_token_expires_at, needs_reconnect'

export async function getGoogleAccess(connection: GoogleConnection) {
  if (connection.needs_reconnect || !connection.refresh_token) return { reconnect: true } as const
  if (connection.access_token && Date.parse(connection.access_token_expires_at ?? '') > Date.now() + 300_000) {
    return { token: connection.access_token } as const
  }
  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: connection.refresh_token,
      grant_type: 'refresh_token',
    }),
    signal: AbortSignal.timeout(8_000),
  })
  const body = await response.json().catch(() => ({}))
  if (!response.ok && body.error !== 'invalid_grant') throw new Error('Google token refresh failed')
  const revoked = !response.ok
  if (!revoked && (typeof body.access_token !== 'string' || !Number.isFinite(body.expires_in))) {
    throw new Error('Google returned an invalid token response')
  }
  const update = revoked ? { needs_reconnect: true } : {
    access_token: body.access_token,
    access_token_expires_at: new Date(Date.now() + body.expires_in * 1000).toISOString(),
  }
  const { data, error } = await supabase.from('google_connections').update(update)
    .eq('clerk_user_id', connection.clerk_user_id).eq('refresh_token', connection.refresh_token)
    .eq('account_id', connection.account_id).eq('location_id', connection.location_id)
    .select('clerk_user_id').maybeSingle()
  if (error || !data) throw new Error('Google connection changed or could not be updated')
  return revoked ? { reconnect: true } as const : { token: body.access_token as string } as const
}

// Scope the failure to the exact grant and token used by this request.
export async function recordGoogleAuthFailure(connection: GoogleConnection, token: string, status: number) {
  if (status !== 401) return
  const { error } = await supabase.from('google_connections')
    .update({ needs_reconnect: true })
    .eq('clerk_user_id', connection.clerk_user_id)
    .eq('account_id', connection.account_id).eq('location_id', connection.location_id)
    .eq('refresh_token', connection.refresh_token).eq('access_token', token)
  if (error) throw new Error('Could not record Google reconnect requirement')
}
