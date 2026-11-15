'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

type Location = { accountId: string; locationId: string; name: string; address: string }

function SuccessContent() {
  const searchParams = useSearchParams()
  const pub = searchParams.get('pub') || 'your business'
  const needsSelection = searchParams.get('location') === 'select'
  const [locations, setLocations] = useState<Location[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(needsSelection)
  const [saving, setSaving] = useState<string | null>(null)

  useEffect(() => {
    if (!needsSelection) return
    fetch('/api/integrations/google', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'list' }),
    })
      .then(async response => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error || 'Unable to find Google Business Profile locations.')
        setLocations(body.locations || [])
      })
      .catch(err => setError(err instanceof Error ? err.message : 'Unable to find Google Business Profile locations.'))
      .finally(() => setLoading(false))
  }, [needsSelection])

  async function choose(location: Location) {
    setSaving(location.locationId)
    setError('')
    try {
      const response = await fetch('/api/integrations/google', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accountId: location.accountId, locationId: location.locationId }),
      })
      const body = await response.json()
      if (!response.ok) throw new Error(body.error || 'Unable to save this location.')
      window.location.assign('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save this location.')
      setSaving(null)
    }
  }

  const ready = !needsSelection
  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className={`w-16 h-16 ${ready ? 'bg-green-500/10' : 'bg-amber-500/10'} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <svg className={`w-8 h-8 ${ready ? 'text-green-400' : 'text-amber-400'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={ready ? 'M5 13l4 4L19 7' : 'M12 9v4m0 4h.01M10.29 3.86l-8.3 14A2 2 0 003.72 21h16.56a2 2 0 001.73-3.14l-8.3-14a2 2 0 00-3.42 0z'} />
          </svg>
        </div>
        <h1 className="text-white text-2xl font-bold mb-3">{ready ? "You're all set" : 'Choose your location'}</h1>
        <p className="text-[#888] text-sm mb-8">
          {ready ? <><span className="text-white font-medium">{pub}</span> is connected. New reviews will appear in your dashboard for approval.</> : 'Your Google account is authorised. Select the Business Profile you want Zero Clicks to monitor.'}
        </p>

        {needsSelection ? (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-4 text-left space-y-3 mb-8">
            {loading && <p className="text-[#888] text-sm">Finding your Google Business Profiles…</p>}
            {!loading && locations.map(location => (
              <button key={`${location.accountId}:${location.locationId}`} onClick={() => choose(location)} disabled={!!saving}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left hover:border-amber-400/50 disabled:opacity-50">
                <span className="block text-sm font-medium text-white">{saving === location.locationId ? 'Saving…' : location.name}</span>
                {location.address && <span className="mt-1 block text-xs text-[#888]">{location.address}</span>}
              </button>
            ))}
            {!loading && !error && locations.length === 0 && <p className="text-[#888] text-sm">No accessible Google Business Profiles were found for this account.</p>}
            {error && <p className="text-red-400 text-sm">{error}</p>}
          </div>
        ) : (
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-left space-y-4 mb-8">
            <h3 className="text-white font-medium text-sm">What happens next</h3>
            <div className="space-y-3">
              {[
                { icon: '🔍', text: 'We check for new Google reviews on a schedule' },
                { icon: '🤖', text: 'AI creates a draft reply for each new review' },
                { icon: '✍️', text: 'You can edit, approve or skip every draft' },
                { icon: '📍', text: 'Approved replies are posted back to Google' },
              ].map(item => <div key={item.text} className="flex items-start gap-3"><span>{item.icon}</span><span className="text-[#888] text-sm">{item.text}</span></div>)}
            </div>
          </div>
        )}
        <a href="/dashboard" className="inline-block rounded-lg bg-amber-400 px-4 py-2 text-sm font-bold text-black">Open dashboard</a>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return <Suspense><SuccessContent /></Suspense>
}
