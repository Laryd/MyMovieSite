import Image from 'next/image'
import Link from 'next/link'
import { Play, Info, Star, Calendar } from 'lucide-react'
import { backdrop } from '@/app/lib/tmdb'
import type { Movie, TVShow, TrendingItem } from '@/app/lib/tmdb'

type MediaItem = Movie | TVShow | TrendingItem

interface Props {
  item: MediaItem
  type?: 'movie' | 'tv'
}

export default function HeroSection({ item, type }: Props) {
  const isTV = type === 'tv' || ('media_type' in item && item.media_type === 'tv')
  const title = 'title' in item && item.title ? item.title : ('name' in item ? (item as TVShow).name : '')
  const date = 'release_date' in item ? (item as Movie).release_date : ('first_air_date' in item ? (item as TVShow).first_air_date : '')
  const year = date ? new Date(date).getFullYear() : null
  const backdropUrl = backdrop(item.backdrop_path)
  const resolvedType = isTV ? 'tv' : 'movie'
  const href = `/${resolvedType}/${item.id}`

  return (
    <section className="relative w-full h-[75vh] min-h-[520px] max-h-[820px] overflow-hidden">
      {backdropUrl ? (
        <Image
          src={backdropUrl}
          alt={title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-zinc-900 to-zinc-950" />
      )}

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/50 to-black/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-20 px-4 sm:px-6 lg:px-10">
        <div className="max-w-xl animate-fade-in">
          {/* Badges row */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-violet-600/30 border border-violet-500/40 text-violet-300">
              {isTV ? 'TV Series' : 'Movie'}
            </span>
            {item.vote_average > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-500/20 border border-amber-500/30 rounded-full px-3 py-1">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span className="text-amber-300 font-bold text-sm">{item.vote_average.toFixed(1)}</span>
              </div>
            )}
            {year && (
              <div className="flex items-center gap-1 text-zinc-400 text-sm">
                <Calendar className="w-3.5 h-3.5" />
                <span>{year}</span>
              </div>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white mb-4 leading-[1.05] tracking-tight">
            {title}
          </h1>

          {item.overview && (
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-3 mb-8 max-w-lg">
              {item.overview}
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={href}
              className="flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-bold hover:bg-zinc-100 transition-colors text-sm shadow-lg shadow-black/30"
            >
              <Play className="w-4 h-4 fill-black" />
              Watch Now
            </Link>
            <Link
              href={href}
              className="flex items-center gap-2 bg-white/10 backdrop-blur-md text-white px-7 py-3 rounded-full font-semibold hover:bg-white/20 transition-colors text-sm border border-white/15"
            >
              <Info className="w-4 h-4" />
              More Info
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
