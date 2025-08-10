'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'
import { Loader2, LogOut, ExternalLink } from 'lucide-react'
export default function AccountActions({ plan, hasSub }: { plan: string; hasSub: boolean }) {
  const router = useRouter()
  const [portalLoading, setPortalLoading] = useState(false)

  async function openPortal() {
    setPortalLoading(true)
    const res = await fetch('/api/subscriptions/portal', { method: 'POST' })
    const data = await res.json()
    setPortalLoading(false)
    if (data.url) window.location.href = data.url
  }

  return (
    <div className="flex flex-wrap gap-3 pt-1">
      {plan === 'FREE' ? (
        <Link
          href="/subscription"
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          Upgrade Plan
        </Link>
      ) : hasSub ? (
        <button
          onClick={openPortal}
          disabled={portalLoading}
          className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-zinc-700/40 disabled:opacity-60"
        >
          {portalLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ExternalLink className="w-4 h-4" />}
          Manage Billing
        </button>
      ) : null}

      <button
        onClick={() => { signOut({ callbackUrl: '/' }); router.refresh() }}
        className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors border border-zinc-700/40"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  )
}
