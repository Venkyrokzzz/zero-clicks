'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'

// ── Types ──────────────────────────────────────────────────────────────────

interface Profile {
  clerk_user_id: string
  email: string
  business_name: string | null
  manager_name: string | null
  business_type: string | null
  location: string | null
  postcode: string | null
  phone: string | null
  plan: string
  trial_paused: boolean
  trial_ends_at: string | null
  notes: string | null
}

interface Settings {
  tone: string | null
  auto_send_positive: boolean | null
}

interface Review {
  id: string
  reviewer_name: string
  rating: number
  sentiment: string
  review_text: string | null
  summary: string | null
  draft_response: string | null
  status: 'pending' | 'approved' | 'sent' | 'skipped'
  created_at: string
  platform: string | null
}

// ── Helpers ────────────────────────────────────────────────────────────────

function Stars({ n }: { n: number }) {
  return (
    <span className="text-sm tracking-wide">
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? '#f59e0b' : 'rgba(245,158,11,0.18)' }}>★</span>
      ))}
    </span>
  )
}

const STATUS_STYLES: Record<string, string> = {
  pending:  'bg-amber-900/30 text-amber-400 border-amber-700/30',
  approved: 'bg-blue-900/30 text-blue-400 border-blue-700/30',
  sent:     'bg-green-900/30 text-green-400 border-green-700/30',
  skipped:  'bg-white/5 text-white/30 border-white/10',
}

const PLAN_STYLES: Record<string, string> = {
  trial:    'bg-amber-900/30 text-amber-400 border-amber-700/30',
  founding: 'bg-purple-900/30 text-purple-400 border-purple-700/30',
  standard: 'bg-blue-900/30 text-blue-400 border-blue-700/30',
  pro:      'bg-green-900/30 text-green-400 border-green-700/30',
  demo:     'bg-pink-900/30 text-pink-400 border-pink-700/30',
  cancelled:'bg-white/5 text-white/30 border-white/10',
}

function Badge({ label, styleKey }: { label: string; styleKey: string }) {
  const cls = PLAN_STYLES[styleKey] ?? 'bg-white/5 text-white/40 border-white/10'
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${cls}`}>{label}</span>
  )
}

// ── Edit field ─────────────────────────────────────────────────────────────

function Field({
  label, value, onChange, type = 'text', options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  options?: { value: string; label: string }[]
}) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-white/40 uppercase tracking-wider">{label}</label>
      {options ? (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/30"
        >
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/20 focus:outline-none focus:border-white/30"
        />
      )}
    </div>
  )
}

// ── Review card ────────────────────────────────────────────────────────────

function ReviewCard({
  review,
  onUpdate,
  onDelete,
}: {
  review: Review
  onUpdate: (id: string, changes: Partial<Review>) => Promise<void>
  onDelete: (id: string) => Promise<void>
}) {
  const [draft, setDraft] = useState(review.draft_response ?? '')
  const [saving, setSaving] = useState(false)
  const [editing, setEditing] = useState(false)
  const [localStatus, setLocalStatus] = useState(review.status)

  async function updateStatus(status: string) {
    setSaving(true)
    await onUpdate(review.id, { status: status as Review['status'] })
    setLocalStatus(status as Review['status'])
    setSaving(false)
  }

  async function saveDraft() {
    setSaving(true)
    await onUpdate(review.id, { draft_response: draft })
    setEditing(false)
    setSaving(false)
  }

  return (
    <div className={`bg-[#111] border rounded-xl p-5 space-y-3 transition-colors ${
      localStatus === 'skipped' ? 'border-white/5 opacity-60' : 'border-white/10'
    }`}>
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-white font-medium text-sm">{review.reviewer_name}</span>
          <Stars n={review.rating} />
          <Badge label={localStatus} styleKey={localStatus} />
          {review.platform && (
            <span className="text-xs text-white/30">{review.platform}</span>
          )}
        </div>
        <span className="text-xs text-white/30">
          {new Date(review.created_at).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'short', year: 'numeric',
          })}
        </span>
      </div>

      {/* Review text */}
      {review.review_text && (
        <p className="text-sm text-white/50 italic leading-relaxed">
          &ldquo;{review.review_text}&rdquo;
        </p>
      )}

      {/* Draft response */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-white/40 uppercase tracking-wider">Draft reply</span>
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs text-white/40 hover:text-white transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        {editing ? (
          <div className="space-y-2">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              rows={4}
              className="w-full bg-[#1a1a1a] border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-white/40 resize-none"
            />
            <button
              onClick={saveDraft}
              disabled={saving}
              className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save draft'}
            </button>
          </div>
        ) : (
          <p className="text-sm text-white/70 leading-relaxed bg-[#1a1a1a] rounded-lg px-3 py-2 border border-white/5">
            {review.draft_response ?? <span className="text-white/20 italic">No draft</span>}
          </p>
        )}
      </div>

      {/* Status actions + delete */}
      <div className="flex items-center gap-2 flex-wrap">
        {(['pending', 'approved', 'sent', 'skipped'] as const).map(s => (
          <button
            key={s}
            onClick={() => updateStatus(s)}
            disabled={saving || localStatus === s}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors disabled:opacity-30 ${
              localStatus === s
                ? STATUS_STYLES[s]
                : 'border-white/10 text-white/40 hover:text-white hover:border-white/20'
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
        <button
          onClick={() => onDelete(review.id)}
          disabled={saving}
          className="ml-auto text-xs px-3 py-1.5 rounded-lg border border-red-700/30 text-red-500/60 hover:text-red-400 hover:border-red-600/50 transition-colors disabled:opacity-30"
        >
          Delete
        </button>
      </div>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function ClientDetailPage() {
  const { id } = useParams<{ id: string }>()

  const [profile, setProfile]   = useState<Profile | null>(null)
  const [settings, setSettings] = useState<Settings>({ tone: 'warm-professional', auto_send_positive: false })
  const [reviews, setReviews]   = useState<Review[]>([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)
  const [clearing, setClearing] = useState(false)

  // Editable profile fields
  const [fields, setFields] = useState({
    business_name: '',
    manager_name: '',
    business_type: '',
    location: '',
    phone: '',
    tone: 'warm-professional',
    auto_send_positive: 'false',
  })

  useEffect(() => {
    if (!id) return
    Promise.all([
      fetch(`/api/admin/client?id=${id}`).then(r => r.json()),
      fetch(`/api/admin/client/reviews?id=${id}`).then(r => r.json()),
    ]).then(([clientData, reviewData]) => {
      const p: Profile = clientData.profile
      const s: Settings = clientData.settings ?? { tone: 'warm-professional', auto_send_positive: false }
      setProfile(p)
      setSettings(s)
      setFields({
        business_name:      p.business_name   ?? '',
        manager_name:       p.manager_name    ?? '',
        business_type:      p.business_type   ?? 'pub',
        location:           p.location        ?? '',
        phone:              p.phone           ?? '',
        tone:               s.tone            ?? 'warm-professional',
        auto_send_positive: s.auto_send_positive ? 'true' : 'false',
      })
      setReviews(reviewData.reviews ?? [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id])

  async function saveProfile() {
    setSaving(true)
    await fetch('/api/admin/client/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerk_user_id: id,
        business_name:      fields.business_name,
        manager_name:       fields.manager_name,
        business_type:      fields.business_type,
        location:           fields.location,
        phone:              fields.phone,
        tone:               fields.tone,
        auto_send_positive: fields.auto_send_positive === 'true',
      }),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const updateReview = useCallback(async (review_id: string, changes: Partial<Review>) => {
    await fetch('/api/admin/client/reviews', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ review_id, ...changes }),
    })
  }, [])

  const deleteReview = useCallback(async (review_id: string) => {
    await fetch(`/api/admin/client/reviews?id=${review_id}`, { method: 'DELETE' })
    setReviews(rs => rs.filter(r => r.id !== review_id))
  }, [])

  async function clearAllReviews() {
    if (!window.confirm(`Delete ALL ${reviews.length} reviews for this account? This cannot be undone.`)) return
    setClearing(true)
    await fetch(`/api/admin/client/reviews?user_id=${id}`, { method: 'DELETE' })
    setReviews([])
    setClearing(false)
  }

  function field(key: keyof typeof fields) {
    return {
      value: fields[key],
      onChange: (v: string) => setFields(f => ({ ...f, [key]: v })),
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="text-white/20 text-sm animate-pulse">Loading…</span>
      </main>
    )
  }

  if (!profile) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="text-red-400 text-sm">Client not found</span>
      </main>
    )
  }

  const sentCount    = reviews.filter(r => r.status === 'sent').length
  const pendingCount = reviews.filter(r => r.status === 'pending').length

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-8">
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Back + header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <a
              href="/admin"
              className="text-xs text-white/30 hover:text-white transition-colors mb-3 inline-flex items-center gap-1"
            >
              ← All clients
            </a>
            <h1 className="text-white text-2xl font-bold mt-1">
              {profile.business_name ?? '(no name)'}
            </h1>
            <div className="flex items-center gap-3 mt-2 flex-wrap">
              <Badge label={profile.plan} styleKey={profile.plan} />
              {profile.trial_paused && <Badge label="paused" styleKey="cancelled" />}
              <span className="text-xs text-white/30">{profile.email}</span>
              {profile.location && (
                <span className="text-xs text-white/30">📍 {profile.location}</span>
              )}
            </div>
          </div>

          {/* Quick stats */}
          <div className="flex gap-3 text-center">
            <div className="bg-[#111] border border-white/10 rounded-xl px-4 py-3 min-w-[72px]">
              <div className="text-xl font-bold text-white">{reviews.length}</div>
              <div className="text-xs text-white/30 mt-0.5">Reviews</div>
            </div>
            <div className="bg-[#111] border border-green-700/20 rounded-xl px-4 py-3 min-w-[72px]">
              <div className="text-xl font-bold text-green-400">{sentCount}</div>
              <div className="text-xs text-white/30 mt-0.5">Sent</div>
            </div>
            <div className="bg-[#111] border border-amber-700/20 rounded-xl px-4 py-3 min-w-[72px]">
              <div className="text-xl font-bold text-amber-400">{pendingCount}</div>
              <div className="text-xs text-white/30 mt-0.5">Pending</div>
            </div>
          </div>
        </div>

        {/* Profile editor */}
        <section className="bg-[#111] border border-white/10 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-semibold">Venue profile &amp; settings</h2>
            <button
              onClick={saveProfile}
              disabled={saving}
              className={`text-sm px-4 py-1.5 rounded-lg border transition-all disabled:opacity-40 ${
                saved
                  ? 'bg-green-900/30 border-green-700/30 text-green-400'
                  : 'bg-white/5 border-white/10 hover:bg-white/10 text-white'
              }`}
            >
              {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save changes'}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Business name"  {...field('business_name')} />
            <Field label="Manager name"   {...field('manager_name')} />
            <Field
              label="Venue type"
              {...field('business_type')}
              options={[
                { value: 'pub',        label: 'Pub' },
                { value: 'restaurant', label: 'Restaurant' },
                { value: 'cafe',       label: 'Café' },
                { value: 'hotel',      label: 'Hotel' },
                { value: 'bar',        label: 'Bar' },
              ]}
            />
            <Field label="Location / town" {...field('location')} />
            <Field label="Phone"           {...field('phone')} type="tel" />
            <Field
              label="Reply tone"
              {...field('tone')}
              options={[
                { value: 'warm-professional', label: 'Warm & professional' },
                { value: 'casual',            label: 'Casual & relaxed' },
                { value: 'formal',            label: 'Formal & polished' },
              ]}
            />
          </div>

          {/* Auto-send toggle */}
          <div className="flex items-center justify-between bg-[#1a1a1a] rounded-lg px-4 py-3 border border-white/5">
            <div>
              <p className="text-sm text-white font-medium">Auto-send 3–5★ replies</p>
              <p className="text-xs text-white/30 mt-0.5">Posts automatically without approval for positive reviews</p>
            </div>
            <button
              onClick={() =>
                setFields(f => ({ ...f, auto_send_positive: f.auto_send_positive === 'true' ? 'false' : 'true' }))
              }
              className={`relative w-11 h-6 rounded-full border transition-colors ${
                fields.auto_send_positive === 'true'
                  ? 'bg-green-600 border-green-500'
                  : 'bg-white/10 border-white/20'
              }`}
            >
              <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${
                fields.auto_send_positive === 'true' ? 'left-[22px]' : 'left-0.5'
              }`} />
            </button>
          </div>
        </section>

        {/* Reviews */}
        <section className="space-y-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <h2 className="text-white font-semibold">Reviews ({reviews.length})</h2>
            <div className="flex items-center gap-3">
              <span className="text-xs text-green-400">{sentCount} sent</span>
              <span className="text-xs text-white/20">·</span>
              <span className="text-xs text-amber-400">{pendingCount} pending</span>
              {reviews.length > 0 && (
                <button
                  onClick={clearAllReviews}
                  disabled={clearing}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-700/30 text-red-500/60 hover:text-red-400 hover:border-red-600/50 transition-colors disabled:opacity-40"
                >
                  {clearing ? 'Clearing…' : `Clear all ${reviews.length}`}
                </button>
              )}
            </div>
          </div>

          {reviews.length === 0 ? (
            <div className="bg-[#111] border border-white/5 rounded-xl p-8 text-center text-white/20 text-sm">
              No reviews yet for this account
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map(r => (
                <ReviewCard key={r.id} review={r} onUpdate={updateReview} onDelete={deleteReview} />
              ))}
            </div>
          )}
        </section>

      </div>
    </main>
  )
}
