import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'

export async function GET(req: NextRequest) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'

  const { allowed } = checkRateLimit(ip, 10)
  if (!allowed) {
    fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_ALERT_CHAT_ID,
        text: `⚠️ Rate limit hit on /connect\nIP: ${ip}\nTime: ${new Date().toLocaleString('en-GB', { timeZone: 'Europe/London' })}`,
      }),
    }).catch(() => {})
    return NextResponse.json({ error: 'Too many requests.' }, { status: 429 })
  }

  const { searchParams } = new URL(req.url)
  const pubName = searchParams.get('pubName') || ''
  const managerName = searchParams.get('managerName') || ''
  const googleReviewsUrl = searchParams.get('googleReviewsUrl') || ''
  const telegramChatId = searchParams.get('telegramChatId') || ''

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
    state: Buffer.from(JSON.stringify({ pubName, managerName, googleReviewsUrl, telegramChatId })).toString('base64'),
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  )
}
