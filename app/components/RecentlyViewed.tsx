'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock } from 'lucide-react'
import { IMG } from '@/app/lib/tmdb'

export interface RecentItem {
  id: number
  type: 'movie' | 'tv'
  title: string
  poster_path: string | null
  visitedAt: number
}

export function recordVisit(item: Omit<RecentItem, 'visitedAt'>) {
  if (typeof window === 'undefined') return
  try {
    const list: RecentItem[] = JSON.parse(localStorage.getItem('sprimio_recent') || '[]')
    const filtered = list.filter(i => !(i.id === item.id && i.type === item.type))
    const updated = [{ ...item, visitedAt: Date.now() }, ...filtered].slice(0, 20)
    localStorage.setItem('sprimio_recent', JSON.stringify(updated))
  } catch { /* ignore */ }
}

export default function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([])

  useEffect(() => {
    try {
      const list = JSON.parse(localStorage.getItem('sprimio_recent') || '[]')
      setItems(list.slice(0, 10))
    } catch { setItems([]) }
  }, [])

  if (!items.length) return null

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-zinc-500" />
        <h2 className="text-lg font-bold text-white">Recently Viewed</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-3">
        {items.map(item => {
          const posterUrl = item.poster_path ? `${IMG}/w300${item.poster_path}` : null
          return (
            <Link
              key={`${item.type}-${item.id}`}
              href={`/${item.type === 'tv' ? 'tv' : 'movies'}/${item.id}`}
              className="group flex-shrink-0 w-28"
            >
              <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-zinc-800/80">
                {posterUrl ? (
                  <Image src={posterUrl} alt={item.title} fill sizes="112px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-2xl text-zinc-600">
                    {item.type === 'tv' ? '📺' : '🎬'}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
              </div>
              <p className="mt-1.5 text-xs font-medium text-zinc-400 line-clamp-1 group-hover:text-zinc-200 transition-colors">
                {item.title}
              </p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
