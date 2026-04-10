import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const stateRaw = searchParams.get('state')
  const error = searchParams.get('error')

  // User denied access
  if (error || !code) {
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.0-clicks.uk'}/connect?error=access_denied`
    )
  }

  // Decode state
  let state = { pubName: '', managerName: '', googleReviewsUrl: '' }
  try {
    state = JSON.parse(Buffer.from(stateRaw || '', 'base64').toString())
  } catch {}

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
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.0-clicks.uk'}/connect?error=no_refresh_token`
    )
  }

  // Get user info (email)
  const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  })
  const user = await userRes.json()

  // Send tokens to n8n for storage
  await fetch(process.env.N8N_TOKEN_WEBHOOK!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-zeroclicks-token': process.env.N8N_WEBHOOK_TOKEN!,
    },
    body: JSON.stringify({
      pubName: state.pubName,
      managerName: state.managerName,
      googleReviewsUrl: state.googleReviewsUrl,
      email: user.email,
      refreshToken: tokens.refresh_token,
      accessToken: tokens.access_token,
      connectedAt: new Date().toISOString(),
    }),
  }).catch(() => {
    // Don't block the redirect if n8n is down
  })

  // Redirect to success page
  return NextResponse.redirect(
    `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.0-clicks.uk'}/connect/success?pub=${encodeURIComponent(state.pubName)}`
  )
}
