'use client'

import { useState, useEffect } from 'react'

const TONES = [
  { value: 'warm-professional', label: '☀️ Warm & Professional', desc: 'Friendly but polished. Works for most pubs.' },
  { value: 'formal', label: '🎩 Formal', desc: 'Structured and business-like.' },
  { value: 'casual', label: '🍺 Casual', desc: 'Relaxed and conversational.' },
]

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    tone: 'warm-professional',
    auto_send_positive: false,
    flag_negative: true,
    signature: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/settings')
      .then(r => r.ok ? r.json() : null)
      .then(data => { if (data) setSettings(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    await fetch('/api/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <PageShell><p style={{ color: '#a1a1aa' }}>Loading...</p></PageShell>

  return (
    <PageShell>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '8px' }}>Settings</h1>
      <p style={{ color: '#a1a1aa', marginBottom: '36px' }}>Control how Zero Clicks replies on your behalf.</p>

      {/* Tone */}
      <Section title="Reply tone">
        <div style={{ display: 'grid', gap: '12px' }}>
          {TONES.map(t => (
            <button
              key={t.value}
              onClick={() => setSettings(s => ({ ...s, tone: t.value }))}
              style={{
                padding: '14px 18px',
                borderRadius: '10px',
                border: settings.tone === t.value ? '2px solid #f59e0b' : '2px solid rgba(255,255,255,0.08)',
                background: settings.tone === t.value ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.03)',
                textAlign: 'left',
                cursor: 'pointer',
                color: '#fff',
              }}
            >
              <div style={{ fontWeight: 600, marginBottom: '2px' }}>{t.label}</div>
              <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{t.desc}</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Toggles */}
      <Section title="Behaviour">
        <Toggle
          label="Auto-send 3-5 star replies"
          desc="3, 4 and 5-star reviews are sent automatically. 1-2 stars and complaints always held for your approval."
          checked={settings.auto_send_positive}
          onChange={v => setSettings(s => ({ ...s, auto_send_positive: v }))}
        />
        <Toggle
          label="Flag negative reviews"
          desc="1 and 2-star reviews appear at the top with a red badge."
          checked={settings.flag_negative}
          onChange={v => setSettings(s => ({ ...s, flag_negative: v }))}
        />
      </Section>

      {/* Signature */}
      <Section title="Signature">
        <p style={{ color: '#a1a1aa', fontSize: '0.9rem', marginBottom: '10px' }}>
          Added to the end of every reply. e.g. <em>— Sarah, The Old Fountain</em>
        </p>
        <input
          type="text"
          value={settings.signature || ''}
          onChange={e => setSettings(s => ({ ...s, signature: e.target.value }))}
          placeholder="— Your name, Business name"
          style={{
            width: '100%',
            padding: '10px 14px',
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.04)',
            color: '#fff',
            fontSize: '1rem',
            boxSizing: 'border-box',
          }}
        />
      </Section>

      <button
        onClick={handleSave}
        disabled={saving}
        style={{
          padding: '12px 28px',
          borderRadius: '8px',
          background: saved ? '#22c55e' : '#f59e0b',
          color: '#000',
          fontWeight: 700,
          fontSize: '1rem',
          border: 'none',
          cursor: saving ? 'not-allowed' : 'pointer',
          opacity: saving ? 0.7 : 1,
          transition: 'background 0.3s',
        }}
      >
        {saved ? '✓ Saved' : saving ? 'Saving...' : 'Save settings'}
      </button>
    </PageShell>
  )
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div>
        <div style={{ fontWeight: 500, marginBottom: '2px' }}>{label}</div>
        <div style={{ fontSize: '0.85rem', color: '#a1a1aa' }}>{desc}</div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: '48px', height: '26px', borderRadius: '13px', border: 'none', cursor: 'pointer',
          background: checked ? '#f59e0b' : 'rgba(255,255,255,0.12)',
          position: 'relative', flexShrink: 0, marginLeft: '16px', transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute', top: '3px', left: checked ? '25px' : '3px',
          width: '20px', height: '20px', borderRadius: '50%', background: '#fff', transition: 'left 0.2s',
        }} />
      </button>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '32px' }}>
      <h2 style={{ fontSize: '1rem', fontWeight: 600, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>{title}</h2>
      {children}
    </div>
  )
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', color: '#fff', padding: '40px 24px 80px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>{children}</div>
    </div>
  )
}
