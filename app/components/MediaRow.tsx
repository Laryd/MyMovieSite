import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import MovieCard from './MovieCard'
import type { Movie, TVShow, TrendingItem } from '@/app/lib/tmdb'

type MediaItem = Movie | TVShow | TrendingItem

interface Props {
  title: string
  items: MediaItem[]
  type?: 'movie' | 'tv'
  viewAllHref?: string
}

export default function MediaRow({ title, items, type, viewAllHref }: Props) {
  if (!items.length) return null

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="flex items-center gap-0.5 text-sm text-violet-400 hover:text-violet-300 transition-colors"
          >
            See all <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
        {items.map(item => (
          <MovieCard key={`${item.id}-${'title' in item ? 'movie' : 'tv'}`} item={item} type={type} />
        ))}
      </div>
    </section>
  )
}
