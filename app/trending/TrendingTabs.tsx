'use client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Film, Tv2, Flame, Calendar } from 'lucide-react'

interface Props {
  activeType: 'movie' | 'tv'
  activeWindow: 'day' | 'week'
}

export default function TrendingTabs({ activeType, activeWindow }: Props) {
  const router = useRouter()

  const set = (type: string, window: string) => {
    router.push(`/trending?type=${type}&window=${window}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800/60 rounded-full p-1">
        <button
          onClick={() => set('movie', activeWindow)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
            activeType === 'movie' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
          )}
        >
          <Film className="w-3.5 h-3.5" /> Movies
        </button>
        <button
          onClick={() => set('tv', activeWindow)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
            activeType === 'tv' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
          )}
        >
          <Tv2 className="w-3.5 h-3.5" /> TV Shows
        </button>
      </div>

      <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800/60 rounded-full p-1">
        <button
          onClick={() => set(activeType, 'day')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
            activeWindow === 'day' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
          )}
        >
          <Flame className="w-3.5 h-3.5" /> Today
        </button>
        <button
          onClick={() => set(activeType, 'week')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
            activeWindow === 'week' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-white'
          )}
        >
          <Calendar className="w-3.5 h-3.5" /> This Week
        </button>
      </div>
    </div>
  )
}
