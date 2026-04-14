'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ConnectPage() {
  const [form, setForm] = useState({
    pubName: '',
    managerName: '',
    googleReviewsUrl: '',
    telegramChatId: '',
  })
  const [loading, setLoading] = useState(false)

  const handleConnect = () => {
    if (!form.pubName || !form.managerName) return
    setLoading(true)
    const params = new URLSearchParams(form)
    window.location.href = `/api/auth/google?${params.toString()}`
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-bold text-white tracking-tight">Zero Clicks</h1>
          <p className="text-[#888] text-sm mt-1">Reputation Manager Setup</p>
        </div>

        {/* Offer banner */}
        <div className="bg-[#0f1a0f] border border-green-900/40 rounded-xl px-5 py-4 mb-6 flex items-start gap-3">
          <span className="text-green-400 text-lg mt-0.5">✓</span>
          <div>
            <p className="text-green-400 text-sm font-semibold">Setup complete — connect your Google account below</p>
            <p className="text-[#888] text-xs mt-0.5 leading-relaxed">
              This takes 60 seconds. We&apos;ll start monitoring your reviews immediately. Replies go live this week.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#111] border border-white/10 rounded-2xl p-8">
          <h2 className="text-white text-xl font-semibold mb-2">Connect your Google Business</h2>
          <p className="text-[#888] text-sm mb-8">
            We&apos;ll monitor your reviews and draft replies in your voice. Setup takes 60 seconds.
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-[#aaa] text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Pub / Restaurant name
              </label>
              <input
                type="text"
                placeholder="e.g. The Red Lion"
                value={form.pubName}
                onChange={e => setForm(f => ({ ...f, pubName: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-white/30 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-[#aaa] text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Manager name
              </label>
              <input
                type="text"
                placeholder="e.g. James"
                value={form.managerName}
                onChange={e => setForm(f => ({ ...f, managerName: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-white/30 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-[#aaa] text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Google Reviews URL <span className="text-[#555] normal-case">(optional)</span>
              </label>
              <input
                type="url"
                placeholder="https://g.page/r/your-business/review"
                value={form.googleReviewsUrl}
                onChange={e => setForm(f => ({ ...f, googleReviewsUrl: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-white/30 transition-colors text-sm"
              />
            </div>

            <div>
              <label className="text-[#aaa] text-xs font-medium uppercase tracking-wider mb-1.5 block">
                Telegram Chat ID <span className="text-[#555] normal-case">(for alerts)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. 1127066101"
                value={form.telegramChatId}
                onChange={e => setForm(f => ({ ...f, telegramChatId: e.target.value }))}
                className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#555] focus:outline-none focus:border-white/30 transition-colors text-sm"
              />
              <p className="text-[#555] text-xs mt-1.5">Message @ZeroClicksBot on Telegram to get your ID</p>
            </div>
          </div>

          <button
            onClick={handleConnect}
            disabled={!form.pubName || !form.managerName || loading}
            className="w-full mt-8 bg-white text-black font-semibold py-3.5 rounded-lg hover:bg-white/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="animate-pulse">Connecting...</span>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Connect Google Business
              </>
            )}
          </button>

          <p className="text-[#555] text-xs text-center mt-4">
            We only request access to your reviews. We never post without your approval.
          </p>
        </div>

        {/* Trust signals */}
        <div className="flex items-center justify-center gap-6 mt-6 text-[#555] text-xs">
          <span>🔒 Encrypted</span>
          <span>🇬🇧 UK hosted</span>
          <span>✓ Cancel anytime</span>
        </div>
      </div>
    </main>
  )
}
