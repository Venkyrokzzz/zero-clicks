'use client'

import { useEffect, useState } from 'react'

const ADMIN_EMAIL = 'zeroclicks.hq@gmail.com'

type Client = {
  clerk_user_id: string
  email: string
  business_name: string | null
  location: string | null
  postcode: string | null
  phone: string | null
  plan: string
  trial_ends_at: string | null
  trial_paused: boolean
  notes: string | null
  google_connected: boolean
  reviews_count: number
  last_synced_at: string | null
}

function daysLeft(trial_ends_at: string | null): number | null {
  if (!trial_ends_at) return null
  const diff = new Date(trial_ends_at).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function PlanBadge({ plan }: { plan: string }) {
  const colours: Record<string, string> = {
    trial:    'bg-amber-900/40 text-amber-400 border-amber-700/30',
    founding: 'bg-purple-900/40 text-purple-400 border-purple-700/30',
    standard: 'bg-blue-900/40 text-blue-400 border-blue-700/30',
    pro:      'bg-green-900/40 text-green-400 border-green-700/30',
    demo:     'bg-pink-900/40 text-pink-400 border-pink-700/30',
    cancelled:'bg-white/5 text-white/30 border-white/10',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full border ${colours[plan] ?? 'bg-white/10 text-white/50 border-white/10'}`}>
      {plan}
    </span>
  )
}

export default function AdminPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [editNotes, setEditNotes] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/admin/clients')
      .then(r => r.json())
      .then(d => {
        // Filter out the admin account itself
        const filtered = (d.clients ?? []).filter((c: Client) => c.email !== ADMIN_EMAIL)
        setClients(filtered)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  async function togglePaused(client: Client) {
    setUpdating(client.clerk_user_id)
    await fetch('/api/admin/client', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        clerk_user_id: client.clerk_user_id,
        trial_paused: !client.trial_paused,
      }),
    })
    setClients(cs =>
      cs.map(c =>
        c.clerk_user_id === client.clerk_user_id
          ? { ...c, trial_paused: !c.trial_paused }
          : c
      )
    )
    setUpdating(null)
  }

  async function changePlan(clerk_user_id: string, plan: string) {
    setUpdating(clerk_user_id)
    await fetch('/api/admin/client', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerk_user_id, plan }),
    })
    setClients(cs =>
      cs.map(c => c.clerk_user_id === clerk_user_id ? { ...c, plan } : c)
    )
    setUpdating(null)
  }

  async function saveNotes(clerk_user_id: string) {
    const notes = editNotes[clerk_user_id] ?? ''
    setUpdating(clerk_user_id)
    await fetch('/api/admin/client', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clerk_user_id, notes }),
    })
    setClients(cs =>
      cs.map(c => c.clerk_user_id === clerk_user_id ? { ...c, notes } : c)
    )
    setUpdating(null)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <span className="text-[#555] text-sm animate-pulse">Loading clients…</span>
      </main>
    )
  }

  const activeClients = clients.filter(c => !c.trial_paused && c.plan !== 'trial' || (c.plan === 'trial' && daysLeft(c.trial_ends_at) !== null && (daysLeft(c.trial_ends_at) ?? 0) > 0))
  const googleConnected = clients.filter(c => c.google_connected).length

  return (
    <main className="min-h-screen bg-[#0a0a0a] px-6 py-8">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-white text-2xl font-bold">Admin Panel</h1>
            <p className="text-[#555] text-sm mt-0.5">
              {clients.length} clients · {googleConnected} Google connected
            </p>
          </div>
          <a
            href="/sign-in"
            className="flex items-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white text-sm px-4 py-2 rounded-full transition-colors shrink-0"
          >
            <span>🔑</span>
            <span>Pub owner login</span>
          </a>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="bg-[#111] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{clients.length}</div>
            <div className="text-xs text-[#555] mt-1">Total clients</div>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-green-400">{googleConnected}</div>
            <div className="text-xs text-[#555] mt-1">Google connected</div>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-white">{clients.reduce((a, c) => a + c.reviews_count, 0)}</div>
            <div className="text-xs text-[#555] mt-1">Total reviews</div>
          </div>
        </div>

        {clients.length === 0 ? (
          <div className="text-[#555] text-sm">No clients yet.</div>
        ) : (
          <div className="space-y-3">
            {clients.map(client => {
              const days = daysLeft(client.trial_ends_at)
              const isUpdating = updating === client.clerk_user_id

              return (
                <div
                  key={client.clerk_user_id}
                  className={`bg-[#111] border rounded-xl p-5 transition-colors ${
                    client.trial_paused ? 'border-red-700/30' : 'border-white/10'
                  }`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
                    {/* Left: info */}
                    <div className="space-y-3 min-w-0">
                      {/* Row 1: name + badges */}
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="text-white font-semibold">
                          {client.business_name ?? '(no business name)'}
                        </span>
                        <PlanBadge plan={client.plan} />
                        {client.trial_paused && (
                          <span className="text-xs px-2 py-0.5 rounded-full border bg-red-900/30 text-red-400 border-red-700/30">
                            paused
                          </span>
                        )}
                        {client.google_connected ? (
                          <span className="text-xs text-green-500">✓ Google connected</span>
                        ) : (
                          <span className="text-xs text-[#555]">⊘ No Google</span>
                        )}
                      </div>

                      {/* Row 2: contact */}
                      <div className="flex flex-wrap gap-4 text-xs text-[#777]">
                        <span>{client.email}</span>
                        {client.location && (
                          <span>📍 {client.location}{client.postcode ? ` ${client.postcode}` : ''}</span>
                        )}
                        {client.phone && <span>📞 {client.phone}</span>}
                      </div>

                      {/* Row 3: stats */}
                      <div className="flex flex-wrap gap-6 text-xs">
                        <div>
                          <span className="text-[#555]">Reviews: </span>
                          <span className="text-white">{client.reviews_count}</span>
                        </div>
                        {client.last_synced_at && (
                          <div>
                            <span className="text-[#555]">Last sync: </span>
                            <span className="text-white">
                              {new Date(client.last_synced_at).toLocaleString('en-GB', {
                                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                              })}
                            </span>
                          </div>
                        )}
                        {client.plan === 'trial' && days !== null && (
                          <div>
                            <span className="text-[#555]">Trial: </span>
                            <span className={days <= 5 ? 'text-red-400' : days <= 14 ? 'text-amber-400' : 'text-white'}>
                              {days > 0 ? `${days} days left` : 'expired'}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Notes */}
                      <div className="flex gap-2 items-center">
                        <input
                          type="text"
                          placeholder="Add notes…"
                          value={editNotes[client.clerk_user_id] ?? client.notes ?? ''}
                          onChange={e =>
                            setEditNotes(n => ({ ...n, [client.clerk_user_id]: e.target.value }))
                          }
                          onKeyDown={e => {
                            if (e.key === 'Enter') saveNotes(client.clerk_user_id)
                          }}
                          className="flex-1 bg-[#1a1a1a] border border-white/10 rounded px-3 py-1.5 text-xs text-white placeholder-[#444] focus:outline-none focus:border-white/30"
                        />
                        {editNotes[client.clerk_user_id] !== undefined &&
                          editNotes[client.clerk_user_id] !== (client.notes ?? '') && (
                          <button
                            onClick={() => saveNotes(client.clerk_user_id)}
                            disabled={isUpdating}
                            className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded transition-colors disabled:opacity-40"
                          >
                            Save
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Right: actions — row on mobile, column on desktop */}
                    <div className="flex flex-row flex-wrap gap-2 lg:flex-col lg:min-w-[160px]">
                      <button
                        onClick={() => togglePaused(client)}
                        disabled={isUpdating}
                        className={`text-xs px-3 py-2 rounded-lg border transition-colors disabled:opacity-40 whitespace-nowrap ${
                          client.trial_paused
                            ? 'bg-green-900/20 border-green-700/30 text-green-400 hover:bg-green-900/40'
                            : 'bg-red-900/20 border-red-700/30 text-red-400 hover:bg-red-900/40'
                        }`}
                      >
                        {client.trial_paused ? '▶ Resume' : '⏸ Pause'}
                      </button>

                      <select
                        value={client.plan}
                        disabled={isUpdating}
                        onChange={e => changePlan(client.clerk_user_id, e.target.value)}
                        className="text-xs px-3 py-2 bg-[#1a1a1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/30 disabled:opacity-40"
                      >
                        <option value="trial">Trial</option>
                        <option value="founding">Founding</option>
                        <option value="standard">Standard</option>
                        <option value="pro">Pro</option>
                        <option value="demo">Demo</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <a
                        href={`/admin/clients/${client.clerk_user_id}`}
                        className="text-xs px-3 py-2 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-lg text-center transition-colors whitespace-nowrap"
                      >
                        View details →
                      </a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
