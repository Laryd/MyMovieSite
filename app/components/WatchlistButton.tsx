'use client'
import { useState, useEffect } from 'react'
import { Bookmark, BookmarkCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface WatchlistItem {
  id: number
  type: 'movie' | 'tv'
  title: string
  poster_path: string | null
  vote_average: number
  year: string
}

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem('sprimio_watchlist') || '[]')
  } catch {
    return []
  }
}

function saveWatchlist(items: WatchlistItem[]) {
  localStorage.setItem('sprimio_watchlist', JSON.stringify(items))
}

interface Props {
  item: WatchlistItem
  className?: string
}

export default function WatchlistButton({ item, className }: Props) {
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const list = getWatchlist()
    setSaved(list.some(w => w.id === item.id && w.type === item.type))
  }, [item.id, item.type])

  const toggle = () => {
    const list = getWatchlist()
    if (saved) {
      saveWatchlist(list.filter(w => !(w.id === item.id && w.type === item.type)))
      setSaved(false)
    } else {
      saveWatchlist([...list, item])
      setSaved(true)
    }
  }

  return (
    <button
      onClick={toggle}
      className={cn(
        'flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold transition-all duration-200 text-sm border',
        saved
          ? 'bg-violet-600/20 border-violet-500/50 text-violet-300 hover:bg-violet-600/30'
          : 'bg-zinc-800 border-zinc-700/60 text-white hover:bg-zinc-700',
        className
      )}
    >
      {saved ? (
        <><BookmarkCheck className="w-4 h-4" /> Saved</>
      ) : (
        <><Bookmark className="w-4 h-4" /> Watchlist</>
      )}
    </button>
  )
}
