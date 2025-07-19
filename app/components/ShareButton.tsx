'use client'
import { useState } from 'react'
import { Share2, Check, Copy } from 'lucide-react'

interface Props {
  title: string
  url?: string
}

export default function ShareButton({ title }: Props) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: `${title} — Sprimio`, url })
        return
      } catch { /* user cancelled */ }
    }
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={share}
      className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2.5 rounded-full font-medium transition-all duration-200 text-sm border border-zinc-700/60"
    >
      {copied ? (
        <><Check className="w-4 h-4 text-green-400" /><span className="text-green-400">Copied!</span></>
      ) : (
        <><Share2 className="w-4 h-4" /> Share</>
      )}
    </button>
  )
}
