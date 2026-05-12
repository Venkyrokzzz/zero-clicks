'use client'

import { useState, useEffect } from 'react'

interface Profile {
  plan: string
  trial_ends_at: string
  email: string
  business_name: string
}

export default function BillingPage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => { setProfile(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const daysLeft = profile?.trial_ends_at
    ? Math.max(0, Math.ceil((new Date(profile.trial_ends_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : null

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)', padding: '104px 24px 48px', color: '#fff' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Billing</h1>
        <p style={{ color: '#a1a1aa', marginBottom: '36px' }}>Your plan and trial status.</p>

        {loading ? (
          <p style={{ color: '#a1a1aa' }}>Loading...</p>
        ) : (
          <>
            {/* Plan card */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Current plan</div>
                  <div style={{ fontSize: '1.6rem', fontWeight: 700, textTransform: 'capitalize' }}>{profile?.plan ?? 'Trial'}</div>
                </div>
                <div style={{ background: profile?.plan === 'trial' ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)', color: profile?.plan === 'trial' ? '#f59e0b' : '#22c55e', padding: '6px 14px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>
                  {profile?.plan === 'trial' ? `${daysLeft} days left` : 'Active'}
                </div>
              </div>

              {profile?.plan === 'trial' && (
                <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '8px', padding: '12px 16px', fontSize: '0.9rem', color: '#a1a1aa' }}>
                  Trial ends {profile?.trial_ends_at ? new Date(profile.trial_ends_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}
                </div>
              )}
            </div>

            {/* Pricing */}
            <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', padding: '24px', marginBottom: '20px' }}>
              <div style={{ fontSize: '0.8rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Starter plan</div>
              <div style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '4px' }}>£49<span style={{ fontSize: '1rem', color: '#a1a1aa', fontWeight: 400 }}>/month</span></div>
              <div style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '20px' }}>+ £499 one-time setup fee</div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 20px', display: 'grid', gap: '8px' }}>
                {['Unlimited review replies', 'AI-drafted in your voice', 'Flagged review alerts', 'One-tap approval', 'Google Business Profile connected'].map(f => (
                  <li key={f} style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.9rem', color: '#d1d5db' }}>
                    <span style={{ color: '#22c55e' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:venkateshsurampudi1@gmail.com?subject=Zero Clicks — Ready to subscribe"
                style={{ display: 'block', textAlign: 'center', padding: '12px', borderRadius: '8px', background: '#f59e0b', color: '#000', fontWeight: 700, textDecoration: 'none', fontSize: '0.95rem' }}
              >
                Get in touch to subscribe →
              </a>
            </div>

            <p style={{ color: '#555', fontSize: '0.8rem', textAlign: 'center' }}>
              Stripe payments coming soon. For now, contact Venky directly.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
