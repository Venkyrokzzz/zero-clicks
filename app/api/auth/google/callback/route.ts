import { NextRequest, NextResponse } from 'next/server'
import { createHmac } from 'crypto'
import { supabase } from '@/lib/supabase'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.0-clicks.uk'

function verifyState(signedState: string): { nonce: string; userId: string; googleReviewsUrl: string } | null {
  const secret = process.env.OAUTH_STATE_SECRET!
  const lastDot = signedState.lastIndexOf('.')
  if (lastDot === -1) return null

  const payload = signedState.slice(0, lastDot)
  const receivedHmac = signedState.slice(lastDot + 1)
  const expectedHmac = createHmac('sha256', secret).update(payload).digest('hex')

  if (receivedHmac !== expectedHmac) return null

  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString())
  } catch {
    return null
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const stateRaw = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code || !stateRaw) {
    return NextResponse.redirect(`${SITE_URL}/connect?error=access_denied`)
  }

  // Verify HMAC-signed state (CSRF check)
  const state = verifyState(stateRaw)
  if (!state) {
    return NextResponse.redirect(`${SITE_URL}/connect?error=invalid_state`)
  }

  const { userId, googleReviewsUrl } = state

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
      grant_type: 'authorization_code',
    }),
  })

  const tokens = await tokenRes.json()

  if (!tokens.refresh_token) {
    return NextResponse.redirect(`${SITE_URL}/connect?error=no_refresh_token`)
  }

  // Get Google user info (email)
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const googleUser = await userRes.json()

  const expiresAt = tokens.expires_in
    ? new Date(Date.now() + tokens.expires_in * 1000).toISOString()
    : null

  // Write tokens to Supabase (primary store)
  const { error: dbError } = await supabase.from('google_connections').upsert({
    clerk_user_id: userId,
    google_email: googleUser.email,
    google_reviews_url: googleReviewsUrl,
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token,
    access_token_expires_at: expiresAt,
    scopes: tokens.scope,
    connected_at: new Date().toISOString(),
  }, { onConflict: 'clerk_user_id' })

  if (dbError) {
    console.error('google_connections upsert error:', dbError)
    return NextResponse.redirect(`${SITE_URL}/connect?error=db_error`)
  }

  // Dual-write to n8n webhook (migration safety — keep until n8n cutover)
  await fetch(process.env.N8N_TOKEN_WEBHOOK!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-zeroclicks-token': process.env.N8N_WEBHOOK_TOKEN!,
    },
    body: JSON.stringify({
      clerk_user_id: userId,
      googleReviewsUrl,
      email: googleUser.email,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      connectedAt: new Date().toISOString(),
    }),
  }).catch(() => {
    // Don't block redirect if n8n is down
  })

  return NextResponse.redirect(`${SITE_URL}/connect/success`)
}
