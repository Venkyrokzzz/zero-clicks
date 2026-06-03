'use client'

import { useState, useEffect } from 'react'

interface Profile {
  plan: string
  trial_ends_at: string
  email: string
  business_name: string
}

interface ReviewMetrics {
  totalReviews: number
  sentCount: number
  pendingCount: number
}

const PLAN_LABEL: Record<string, string> = {
  trial: 'Free Trial',
  starter: 'Starter',
  pro: 'Pro',
}

export default function BillingPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [metrics, setMetrics] = useState<ReviewMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [upgrading, setUpgrading] = useState(false)

  async function handleUpgrade(plan: 'standard' | 'pro') {
    setUpgrading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
      else alert('Error: ' + (data.error ?? 'Unknown error'))
    } catch {
      alert('Something went wrong. Please try again.')
    } finally {
      setUpgrading(false)
    }
  }

  useEffect(() => {
    Promise.all([
      fetch('/api/profile').then(r => r.ok ? r.json() : null),
      fetch('/api/reviews').then(r => r.ok ? r.json() : null),
    ]).then(([p, r]) => {
      if (p) setProfile(p)
      if (r?.metrics) setMetrics(r.metrics)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  const daysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  const isTrial   = profile?.plan === 'trial'
  const isPaid    = ['starter', 'standard', 'pro'].includes(profile?.plan ?? '')
  const isExpired = isTrial && daysLeft === 0

  // trial progress bar (30-day trial)
  const trialProgress = daysLeft !== null ? Math.round(((30 - daysLeft) / 30) * 100) : 0

  const card: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.07)',
    borderRadius: '12px',
    padding: '20px 24px',
    marginBottom: '12px',
  }

  const label: React.CSSProperties = {
    fontSize: '0.72rem',
    color: '#6b7280',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: '6px',
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', padding: '40px 24px', color: '#6b7280' }}>
      Loading…
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', color: '#fff', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '4px' }}>Billing</h1>
          <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>
            {isPaid ? `${profile?.business_name ?? 'Your workspace'} · Starter plan` : 'Free trial — no card required'}
          </p>
        </div>

        {/* ── Current plan ─────────────────────────────────── */}
        <div style={{ ...card, borderColor: isTrial && !isExpired ? 'rgba(245,158,11,0.2)' : isPaid ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={label}>Current plan</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '2px' }}>
                {PLAN_LABEL[profile?.plan ?? 'trial'] ?? 'Trial'}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                {isPaid && `${profile?.plan === 'pro' ? '£75' : '£55'} / month · billed monthly`}
                {isTrial && !isExpired && `Renews ${profile?.trial_ends_at ? new Date(profile.trial_ends_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}`}
                {isExpired && 'Your trial has ended'}
              </p>
            </div>
            <span style={{
              fontSize: '0.75rem', fontWeight: 600, padding: '4px 12px', borderRadius: '20px',
              background: isExpired ? 'rgba(239,68,68,0.12)' : isTrial ? 'rgba(245,158,11,0.12)' : 'rgba(34,197,94,0.12)',
              color:      isExpired ? '#ef4444' : isTrial ? '#f59e0b' : '#22c55e',
            }}>
              {isExpired ? 'Expired' : isTrial ? `${daysLeft}d left` : 'Active'}
            </span>
          </div>

          {/* Trial progress bar */}
          {isTrial && !isExpired && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#6b7280', marginBottom: '6px' }}>
                <span>Trial usage</span>
                <span>{30 - (daysLeft ?? 0)} of 30 days</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${trialProgress}%`, background: '#f59e0b', borderRadius: '4px', transition: 'width 0.6s ease' }} />
              </div>
            </div>
          )}
        </div>

        {/* ── Usage this month ──────────────────────────────── */}
        {metrics && (
          <div style={card}>
            <p style={label}>Usage</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginTop: '4px' }}>
              {[
                { n: metrics.totalReviews, l: 'Reviews received' },
                { n: metrics.sentCount,    l: 'Replies sent' },
                { n: metrics.pendingCount, l: 'Awaiting approval' },
              ].map(({ n, l }) => (
                <div key={l}>
                  <p style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '2px' }}>{n}</p>
                  <p style={{ fontSize: '0.78rem', color: '#6b7280', lineHeight: 1.3 }}>{l}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Upgrade / manage ─────────────────────────────── */}
        {!isPaid && (
          <div style={{ ...card, background: 'rgba(245,158,11,0.04)', borderColor: 'rgba(245,158,11,0.15)', marginTop: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <p style={{ fontWeight: 600, marginBottom: '2px' }}>Upgrade your plan</p>
                <p style={{ fontSize: '0.85rem', color: '#6b7280' }}>£499 one-time setup · cancel anytime</p>
              </div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => handleUpgrade('standard')}
                  disabled={upgrading}
                  style={{
                    padding: '9px 20px', borderRadius: '8px',
                    background: 'rgba(255,255,255,0.06)', color: '#fff',
                    fontWeight: 600, border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: '0.875rem', whiteSpace: 'nowrap', cursor: upgrading ? 'wait' : 'pointer',
                  }}
                >
                  Standard £55/mo
                </button>
                <button
                  onClick={() => handleUpgrade('pro')}
                  disabled={upgrading}
                  style={{
                    padding: '9px 20px', borderRadius: '8px',
                    background: '#f59e0b', color: '#000',
                    fontWeight: 700, border: 'none',
                    fontSize: '0.875rem', whiteSpace: 'nowrap', cursor: upgrading ? 'wait' : 'pointer',
                  }}
                >
                  {upgrading ? 'Redirecting…' : 'Pro £75/mo →'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Invoices (placeholder) ────────────────────────── */}
        <div style={{ ...card, marginTop: '4px' }}>
          <p style={label}>Invoices</p>
          <p style={{ fontSize: '0.875rem', color: '#4b5563', marginTop: '8px' }}>
            {isPaid ? 'Invoices will appear here.' : 'No invoices yet — you\'re on a free trial.'}
          </p>
        </div>

        {/* ── Footer note ───────────────────────────────────── */}
        <p style={{ fontSize: '0.78rem', color: '#374151', textAlign: 'center', marginTop: '20px', lineHeight: 1.6 }}>
          Questions about billing?{' '}
          <a href="mailto:venkateshsurampudi1@gmail.com" style={{ color: '#f59e0b', textDecoration: 'none' }}>
            Email Venky directly
          </a>
          {' '}· No contracts · Cancel anytime
        </p>

      </div>
    </div>
  )
}
