'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Connection {
  google_email: string
  connected_at: string
}

export default function IntegrationsPage() {
  const router = useRouter()
  const [connection, setConnection] = useState<Connection | null>(null)
  const [connected, setConnected] = useState(false)
  const [loading, setLoading] = useState(true)
  const [disconnecting, setDisconnecting] = useState(false)

  useEffect(() => {
    fetch('/api/integrations/google')
      .then(r => r.json())
      .then(data => {
        setConnected(data.connected)
        setConnection(data.connection)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function handleDisconnect() {
    if (!confirm('Disconnect your Google Business Profile? Reviews will stop syncing.')) return
    setDisconnecting(true)
    await fetch('/api/integrations/google', { method: 'DELETE' })
    setConnected(false)
    setConnection(null)
    setDisconnecting(false)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', padding: '32px 24px', color: '#fff' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Integrations</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '36px' }}>Connect your platforms.</p>

        {loading ? (
          <p style={{ color: '#a1a1aa' }}>Loading...</p>
        ) : (
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                <div style={{ fontSize: '2rem' }}>⭐</div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '2px' }}>Google Business Profile</div>
                  {connected && connection ? (
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>
                      {connection.google_email} · connected {new Date(connection.connected_at).toLocaleDateString('en-GB')}
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Not connected</div>
                  )}
                </div>
              </div>

              {connected ? (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <span style={{ background: 'rgba(34,197,94,0.12)', color: '#22c55e', padding: '5px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>Connected</span>
                  <button
                    onClick={handleDisconnect}
                    disabled={disconnecting}
                    style={{ padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(239,68,68,0.4)', background: 'transparent', color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}
                  >
                    {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                  </button>
                </div>
              ) : (
                <a
                  href="/connect"
                  style={{ padding: '8px 18px', borderRadius: '8px', background: '#f59e0b', color: '#000', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}
                >
                  Connect →
                </a>
              )}
            </div>
          </div>
        )}

        {/* More integrations coming soon */}
        <div style={{ marginTop: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '14px', padding: '20px 24px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center', opacity: 0.4 }}>
            <div style={{ fontSize: '2rem' }}>🏨</div>
            <div>
              <div style={{ fontWeight: 600 }}>TripAdvisor</div>
              <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>Coming soon</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
