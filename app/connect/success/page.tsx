'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function SuccessContent() {
  const searchParams = useSearchParams()
  const pub = searchParams.get('pub') || 'your business'

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-white text-2xl font-bold mb-3">You&apos;re all set</h1>
        <p className="text-[#888] text-sm mb-8">
          <span className="text-white font-medium">{pub}</span> is now connected to Reputation Manager.
          We&apos;ll monitor your reviews and alert you to any complaints instantly.
        </p>

        <div className="bg-[#111] border border-white/10 rounded-2xl p-6 text-left space-y-4 mb-8">
          <h3 className="text-white font-medium text-sm">What happens next</h3>
          <div className="space-y-3">
            {[
              { icon: '🔍', text: 'We scan your Google Reviews every 15 minutes' },
              { icon: '🤖', text: 'AI drafts a reply to every new review' },
              { icon: '🚨', text: 'You get a Telegram alert for 1–2 star complaints only' },
              { icon: '📋', text: 'Copy the draft, paste it into Google — done' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="text-base">{item.icon}</span>
                <span className="text-[#888] text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#555] text-xs">
          Questions? Email <a href="mailto:zeroclicks.hq@gmail.com" className="text-[#888] hover:text-white transition-colors">zeroclicks.hq@gmail.com</a>
        </p>
      </div>
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  )
}
