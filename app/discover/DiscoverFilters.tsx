'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Film, Tv2 } from 'lucide-react'
import type { Genre } from '@/app/lib/tmdb'
import { cn } from '@/lib/utils'

interface Props {
  genres: Genre[]
  activeType: string
}

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'primary_release_date.desc', label: 'Newest' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
]

const RATINGS = ['6', '7', '7.5', '8', '8.5', '9']
const currentYear = new Date().getFullYear()
const YEARS = Array.from({ length: 40 }, (_, i) => currentYear - i)

export default function DiscoverFilters({ genres, activeType }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const update = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  const switchType = (type: string) => {
    const params = new URLSearchParams()
    params.set('type', type)
    router.push(`${pathname}?${params.toString()}`)
  }

  const genre = searchParams.get('genre') || ''
  const yearFrom = searchParams.get('year_from') || ''
  const yearTo = searchParams.get('year_to') || ''
  const rating = searchParams.get('rating') || ''
  const sort = searchParams.get('sort') || 'popularity.desc'

  return (
    <div className="space-y-4">
      {/* Type toggle */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 bg-zinc-900/80 border border-zinc-800/60 rounded-full p-1">
          <button
            onClick={() => switchType('movie')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              activeType === 'movie' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
            )}
          >
            <Film className="w-3.5 h-3.5" /> Movies
          </button>
          <button
            onClick={() => switchType('tv')}
            className={cn(
              'flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all',
              activeType === 'tv' ? 'bg-violet-600 text-white' : 'text-zinc-400 hover:text-white'
            )}
          >
            <Tv2 className="w-3.5 h-3.5" /> TV Shows
          </button>
        </div>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3">
        {/* Genre */}
        <select
          value={genre}
          onChange={e => update('genre', e.target.value)}
          className="bg-zinc-900 border border-zinc-700/60 rounded-full px-4 py-1.5 text-sm text-zinc-300 outline-none focus:border-violet-600/60 cursor-pointer"
        >
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g.id} value={g.id}>{g.name}</option>
          ))}
        </select>

        {/* Year from */}
        <select
          value={yearFrom}
          onChange={e => update('year_from', e.target.value)}
          className="bg-zinc-900 border border-zinc-700/60 rounded-full px-4 py-1.5 text-sm text-zinc-300 outline-none focus:border-violet-600/60 cursor-pointer"
        >
          <option value="">From Year</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Year to */}
        <select
          value={yearTo}
          onChange={e => update('year_to', e.target.value)}
          className="bg-zinc-900 border border-zinc-700/60 rounded-full px-4 py-1.5 text-sm text-zinc-300 outline-none focus:border-violet-600/60 cursor-pointer"
        >
          <option value="">To Year</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>

        {/* Min rating */}
        <select
          value={rating}
          onChange={e => update('rating', e.target.value)}
          className="bg-zinc-900 border border-zinc-700/60 rounded-full px-4 py-1.5 text-sm text-zinc-300 outline-none focus:border-violet-600/60 cursor-pointer"
        >
          <option value="">Any Rating</option>
          {RATINGS.map(r => (
            <option key={r} value={r}>★ {r}+</option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={e => update('sort', e.target.value)}
          className="bg-zinc-900 border border-zinc-700/60 rounded-full px-4 py-1.5 text-sm text-zinc-300 outline-none focus:border-violet-600/60 cursor-pointer"
        >
          {SORT_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Clear */}
        {(genre || yearFrom || yearTo || rating || sort !== 'popularity.desc') && (
          <button
            onClick={() => router.push(`${pathname}?type=${activeType}`)}
            className="px-4 py-1.5 rounded-full text-sm text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 transition-colors border border-zinc-700/40"
          >
            Clear filters
          </button>
        )}
      </div>
    </div>
  )
}
