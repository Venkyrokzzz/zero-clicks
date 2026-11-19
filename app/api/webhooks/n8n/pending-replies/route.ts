import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/verifyToken'

// Keep the old poll compatible while routing all Google writes through the V1 publisher.
export async function GET(req: Request) {
  if (!verifyToken(req.headers.get('x-zeroclicks-token'), process.env.N8N_WEBHOOK_TOKEN)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  return NextResponse.json({ replies: [] })
}

export async function POST(req: Request) {
  if (!verifyToken(req.headers.get('x-zeroclicks-token'), process.env.N8N_WEBHOOK_TOKEN)) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  return NextResponse.json({ error: 'The legacy publisher has been retired.' }, { status: 410 })
}
