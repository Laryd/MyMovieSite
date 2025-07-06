import Image from 'next/image'
import Link from 'next/link'
import { Star, Play } from 'lucide-react'
import { poster } from '@/app/lib/tmdb'
import type { Movie, TVShow, TrendingItem } from '@/app/lib/tmdb'
import { cn } from '@/lib/utils'

type MediaItem = Movie | TVShow | TrendingItem

interface Props {
  item: MediaItem
  type?: 'movie' | 'tv'
  className?: string
}

function getTitle(item: MediaItem): string {
  return 'title' in item && item.title ? item.title : ('name' in item ? item.name ?? '' : '')
}

function getDate(item: MediaItem): string {
  return 'release_date' in item && item.release_date
    ? item.release_date
    : 'first_air_date' in item
    ? (item as TVShow).first_air_date ?? ''
    : ''
}

function resolveType(item: MediaItem, fallback?: 'movie' | 'tv'): 'movie' | 'tv' {
  if ('media_type' in item && item.media_type === 'tv') return 'tv'
  return fallback ?? ('name' in item && !('title' in item) ? 'tv' : 'movie')
}

export default function MovieCard({ item, type, className }: Props) {
  const title = getTitle(item)
  const date = getDate(item)
  const year = date ? new Date(date).getFullYear() : null
  const resolvedType = resolveType(item, type)
  const href = `/${resolvedType}/${item.id}`
  const posterUrl = poster(item.poster_path)

  return (
    <Link href={href} className={cn('group relative flex-shrink-0 w-36 sm:w-40 md:w-44', className)}>
      <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/80">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            sizes="(max-width: 640px) 144px, (max-width: 768px) 160px, 176px"
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">
            🎬
          </div>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300 flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <Play className="w-5 h-5 text-white fill-white ml-0.5" />
            </div>
          </div>
        </div>

        {/* Rating */}
        {item.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-0.5">
            <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-medium text-white">{item.vote_average.toFixed(1)}</span>
          </div>
        )}

        {/* Type badge */}
        <div className="absolute bottom-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-violet-600/80 backdrop-blur-sm text-white">
            {resolvedType === 'tv' ? 'Series' : 'Film'}
          </span>
        </div>
      </div>

      <div className="mt-2 px-0.5">
        <p className="text-sm font-medium text-zinc-200 line-clamp-1 group-hover:text-violet-300 transition-colors duration-200">
          {title}
        </p>
        {year && <p className="text-xs text-zinc-500 mt-0.5">{year}</p>}
      </div>
    </Link>
  )
}
