import { NextRequest, NextResponse } from 'next/server'
import { processReview } from '@/lib/processReview'
import { verifyToken } from '@/lib/verifyToken'

const MAX_PAYLOAD_BYTES = 32 * 1024

// Compatibility endpoint for existing webhook clients.
export async function POST(req: NextRequest) {
  // ── 1. Shared-secret auth ─────────────────────────────────────────────────
  const token = req.headers.get('x-zeroclicks-token')
  if (!verifyToken(token, process.env.N8N_WEBHOOK_TOKEN)) {
    console.warn('[n8n/reviews] Unauthorised request from', req.headers.get('x-forwarded-for'))
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  // ── 2. Payload size guard ─────────────────────────────────────────────────
  const contentLength = req.headers.get('content-length')
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
  }

  // ── 3. Parse + validate JSON ──────────────────────────────────────────────
  let body: Record<string, unknown>
  try {
    const raw = await req.text()
    if (raw.length > MAX_PAYLOAD_BYTES) {
      return NextResponse.json({ error: 'Payload too large' }, { status: 413 })
    }
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return NextResponse.json({ error: 'Expected a JSON object' }, { status: 400 })
    }
    body = parsed
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const outcome = await processReview(body, { legacy: true })
  return NextResponse.json(outcome.data, { status: outcome.status })
}
