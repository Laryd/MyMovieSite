'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import type { PlanKey } from '@/lib/stripe'

interface Props {
  planKey: PlanKey
  planName: string
  price: number
  isCurrentPlan: boolean
  isLoggedIn: boolean
  highlighted: boolean
  hasSub: boolean
}

export default function PlanButton({ planKey, planName, price, isCurrentPlan, isLoggedIn, highlighted, hasSub }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleClick() {
    if (!isLoggedIn) {
      router.push('/auth/login?callbackUrl=/subscription')
      return
    }

    if (isCurrentPlan) return

    if (hasSub) {
      // Manage existing subscription via portal
      setLoading(true)
      const res = await fetch('/api/subscriptions/portal', { method: 'POST' })
      const data = await res.json()
      setLoading(false)
      if (data.url) window.location.href = data.url
      return
    }

    if (price === 0) return

    setLoading(true)
    const res = await fetch('/api/subscriptions/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: planKey }),
    })
    const data = await res.json()
    setLoading(false)
    if (data.url) window.location.href = data.url
  }

  const label = isCurrentPlan
    ? 'Current Plan'
    : price === 0
    ? 'Get Started Free'
    : `Get ${planName}`

  return (
    <button
      onClick={handleClick}
      disabled={loading || isCurrentPlan}
      className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
        isCurrentPlan
          ? 'bg-zinc-800 text-zinc-500 cursor-default border border-zinc-700/40'
          : highlighted
          ? 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/30'
          : 'bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700/40'
      }`}
    >
      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : label}
    </button>
  )
}
