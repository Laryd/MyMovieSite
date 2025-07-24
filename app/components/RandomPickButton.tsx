'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shuffle, Loader2 } from 'lucide-react'

export default function RandomPickButton() {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const pick = async () => {
    setLoading(true)
    try {
      const randomPage = Math.floor(Math.random() * 20) + 1
      const res = await fetch(`/api/random?page=${randomPage}`)
      const data = await res.json()
      if (data.id && data.type) {
        router.push(`/${data.type}/${data.id}`)
      }
    } catch {
      // ignore
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={pick}
      disabled={loading}
      className="group flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-700/60 hover:border-violet-600/40 text-zinc-300 hover:text-white px-5 py-2.5 rounded-full font-semibold transition-all duration-200 text-sm disabled:opacity-60"
    >
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin text-violet-400" />
        : <Shuffle className="w-4 h-4 group-hover:text-violet-400 transition-colors" />}
      {loading ? 'Finding…' : 'Feeling Lucky'}
    </button>
  )
}
