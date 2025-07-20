'use client'
import { useState } from 'react'
import Image from 'next/image'
import { ChevronDown, ChevronUp, Tv2 } from 'lucide-react'
import { IMG } from '@/app/lib/tmdb'
import type { Season } from '@/app/lib/tmdb'
import { cn } from '@/lib/utils'

interface Props {
  seasons: Season[]
}

export default function TVSeasons({ seasons }: Props) {
  const [expanded, setExpanded] = useState(false)
  const filtered = seasons.filter(s => s.season_number > 0)
  const visible = expanded ? filtered : filtered.slice(0, 3)

  if (!filtered.length) return null

  return (
    <div className="mt-14">
      <div className="flex items-center gap-2 mb-5">
        <Tv2 className="w-5 h-5 text-violet-400" />
        <h2 className="text-xl font-bold text-white">Seasons</h2>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
          {filtered.length} season{filtered.length !== 1 ? 's' : ''}
        </span>
      </div>

      <div className="space-y-3">
        {visible.map(season => {
          const posterUrl = season.poster_path ? `${IMG}/w185${season.poster_path}` : null
          const year = season.air_date ? new Date(season.air_date).getFullYear() : null
          return (
            <div
              key={season.id}
              className="flex gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700/60 transition-colors"
            >
              <div className="relative w-14 aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                {posterUrl ? (
                  <Image src={posterUrl} alt={season.name} fill sizes="56px" className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-600 text-lg">📺</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-white text-sm">{season.name}</h3>
                  {year && <span className="text-xs text-zinc-500 flex-shrink-0">{year}</span>}
                </div>
                <p className="text-xs text-zinc-500 mt-0.5">
                  {season.episode_count} episode{season.episode_count !== 1 ? 's' : ''}
                </p>
                {season.overview && (
                  <p className="text-xs text-zinc-400 mt-1.5 line-clamp-2 leading-relaxed">
                    {season.overview}
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {filtered.length > 3 && (
        <button
          onClick={() => setExpanded(v => !v)}
          className={cn(
            'mt-3 flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors px-4 py-2 rounded-full bg-zinc-800/60 hover:bg-zinc-800',
          )}
        >
          {expanded ? (
            <><ChevronUp className="w-4 h-4" /> Show less</>
          ) : (
            <><ChevronDown className="w-4 h-4" /> Show all {filtered.length} seasons</>
          )}
        </button>
      )}
    </div>
  )
}
