'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function ConnectContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  // If no error, redirect to onboarding (shouldn't land here directly)
  useEffect(() => {
    if (!error) {
      router.replace('/onboarding')
    }
  }, [error, router])

  const errorMessages: Record<string, string> = {
    access_denied: 'You declined access to your Google account. Please try again and click "Allow".',
    invalid_state: 'Something went wrong with the connection. Please start again.',
    db_error: 'We had trouble saving your connection. Please try again.',
  }

  const message = error ? (errorMessages[error] ?? `An error occurred: ${error}`) : null

  if (!message) {
    return <div className="min-h-screen bg-[#0a0a0a]" />
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 mb-6">
          <p className="text-red-400 text-sm">{message}</p>
        </div>
        <button
          onClick={() => router.push('/onboarding')}
          className="bg-white text-black font-semibold py-3 px-8 rounded-lg hover:bg-white/90 transition-all text-sm"
        >
          Start again
        </button>
      </div>
    </main>
  )
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0a0a]" />}>
      <ConnectContent />
    </Suspense>
  )
}
