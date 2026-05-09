import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { checkRateLimit } from '@/lib/rateLimit'
import { createHmac } from 'crypto'

function signState(payload: string): string {
  const secret = process.env.OAUTH_STATE_SECRET!
  const hmac = createHmac('sha256', secret).update(payload).digest('hex')
  return `${payload}.${hmac}`
}

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const { allowed } = checkRateLimit(ip, 10)
  if (!allowed) return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })

  // Must be logged in
  const { userId } = await auth()
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url))
  }

  const { searchParams } = new URL(req.url)
  const googleReviewsUrl = searchParams.get('googleReviewsUrl') || ''

  // HMAC-signed state: nonce + clerk userId for CSRF protection
  const nonce = crypto.randomUUID()
  const payload = Buffer.from(JSON.stringify({ nonce, userId, googleReviewsUrl })).toString('base64url')
  const signedState = signState(payload)

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: 'code',
    scope: [
      'https://www.googleapis.com/auth/business.manage',
      'https://www.googleapis.com/auth/userinfo.email',
      'https://www.googleapis.com/auth/userinfo.profile',
    ].join(' '),
    access_type: 'offline',
    prompt: 'consent',
    state: signedState,
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}
