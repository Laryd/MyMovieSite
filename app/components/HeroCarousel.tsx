'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Play, Info, Star, Calendar, ChevronLeft, ChevronRight } from 'lucide-react'
import { backdrop } from '@/app/lib/tmdb'
import type { TrendingItem, Movie, TVShow } from '@/app/lib/tmdb'
import { cn } from '@/lib/utils'

interface Props {
  items: TrendingItem[]
}

export default function HeroCarousel({ items }: Props) {
  const [current, setCurrent] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const featured = items.slice(0, 6)

  const goTo = useCallback((index: number) => {
    if (transitioning) return
    setTransitioning(true)
    setTimeout(() => {
      setCurrent(index)
      setTransitioning(false)
    }, 300)
  }, [transitioning])

  const prev = () => goTo((current - 1 + featured.length) % featured.length)
  const next = useCallback(() => goTo((current + 1) % featured.length), [current, featured.length, goTo])

  useEffect(() => {
    const timer = setInterval(next, 7000)
    return () => clearInterval(timer)
  }, [next])

  const item = featured[current]
  if (!item) return null

  const isTV = item.media_type === 'tv'
  const title = 'title' in item && item.title ? item.title : ('name' in item ? (item as TVShow).name : '')
  const date = 'release_date' in item ? (item as Movie).release_date : (item as TVShow).first_air_date
  const year = date ? new Date(date).getFullYear() : null
  const backdropUrl = backdrop(item.backdrop_path)
  const href = `/${isTV ? 'tv' : 'movie'}/${item.id}`

  return (
    <section className="relative w-full h-[80vh] min-h-[560px] max-h-[860px] overflow-hidden">
      {/* Background */}
      <div
        className={cn(
          'absolute inset-0 transition-opacity duration-500',
          transitioning ? 'opacity-0' : 'opacity-100'
        )}
      >
        {backdropUrl ? (
          <Image
            src={backdropUrl}
            alt={title}
            fill
            priority
            sizes="100vw"
            className="object-cover object-top"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-zinc-900 to-zinc-950" />
        )}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/10 to-transparent" />

      {/* Content */}
      <div
        className={cn(
          'absolute inset-0 flex items-end pb-24 px-4 sm:px-6 lg:px-10 transition-all duration-500',
          transitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
        )}
      >
        <div className="max-w-2xl">
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

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-4 leading-[1.02] tracking-tight">
            {title}
          </h1>

          {item.overview && (
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed line-clamp-2 mb-8 max-w-lg">
              {item.overview}
            </p>
          )}

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              href={href}
              className="flex items-center gap-2 bg-white text-black px-7 py-3 rounded-full font-bold hover:bg-zinc-100 transition-colors text-sm shadow-lg"
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

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={cn(
              'rounded-full transition-all duration-300',
              i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/30 hover:bg-white/60'
            )}
          />
        ))}
      </div>
    </section>
  )
}
