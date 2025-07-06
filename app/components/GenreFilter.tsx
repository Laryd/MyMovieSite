'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import type { Genre } from '@/app/lib/tmdb'
import { cn } from '@/lib/utils'

interface Props {
  genres: Genre[]
}

export default function GenreFilter({ genres }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const activeGenre = searchParams.get('genre')

  const setGenre = (id: number | null) => {
    const params = new URLSearchParams(searchParams.toString())
    if (id === null) {
      params.delete('genre')
    } else {
      params.set('genre', String(id))
    }
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
      <button
        onClick={() => setGenre(null)}
        className={cn(
          'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
          !activeGenre
            ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
        )}
      >
        All
      </button>
      {genres.map(g => (
        <button
          key={g.id}
          onClick={() => setGenre(g.id)}
          className={cn(
            'flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
            activeGenre === String(g.id)
              ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
              : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
          )}
        >
          {g.name}
        </button>
      ))}
    </div>
  )
}
