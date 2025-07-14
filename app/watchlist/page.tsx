'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bookmark, Star, Trash2 } from 'lucide-react'
import { getWatchlist, type WatchlistItem } from '../components/WatchlistButton'
import { poster } from '@/app/lib/tmdb'

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    setItems(getWatchlist())
    setLoaded(true)
  }, [])

  const remove = (id: number, type: string) => {
    const updated = items.filter(i => !(i.id === id && i.type === type))
    localStorage.setItem('sprimio_watchlist', JSON.stringify(updated))
    setItems(updated)
  }

  return (
    <div className="min-h-screen pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
          <Bookmark className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{loaded ? items.length : '—'} saved titles</p>
        </div>
      </div>

      {!loaded ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[2/3] rounded-xl bg-zinc-800/80 animate-pulse" />
              <div className="mt-2 h-3.5 bg-zinc-800 rounded-full animate-pulse w-4/5" />
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 py-24 text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-800/80 flex items-center justify-center">
            <Bookmark className="w-8 h-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-lg font-medium">Nothing saved yet</p>
          <p className="text-zinc-600 text-sm max-w-xs">
            Browse movies and TV shows and click the Watchlist button to save them here.
          </p>
          <div className="flex gap-3 mt-2">
            <Link href="/movies" className="px-5 py-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors">
              Browse Movies
            </Link>
            <Link href="/tv" className="px-5 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white text-sm font-semibold transition-colors">
              Browse TV
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {items.map(item => {
            const posterUrl = poster(item.poster_path)
            const href = `/${item.type}/${item.id}`
            return (
              <div key={`${item.type}-${item.id}`} className="group relative">
                <Link href={href}>
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/80">
                    {posterUrl ? (
                      <Image
                        src={posterUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 16vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">
                        {item.type === 'tv' ? '📺' : '🎬'}
                      </div>
                    )}
                    {item.vote_average > 0 && (
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-white font-medium">{item.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-200 line-clamp-1 group-hover:text-violet-300 transition-colors">
                    {item.title}
                  </p>
                  {item.year && <p className="text-xs text-zinc-600 mt-0.5">{item.year}</p>}
                </Link>
                <button
                  onClick={() => remove(item.id, item.type)}
                  className="absolute top-2 left-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm flex items-center justify-center text-zinc-400 hover:text-red-400 hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-all duration-200"
                  title="Remove from watchlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
