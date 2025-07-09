import Image from 'next/image'
import Link from 'next/link'
import { poster } from '@/app/lib/tmdb'
import type { Movie, TVShow } from '@/app/lib/tmdb'

type MediaItem = Movie | TVShow

interface Props {
  title: string
  items: MediaItem[]
  type: 'movie' | 'tv'
}

export default function Top10Row({ title, items, type }: Props) {
  const top = items.slice(0, 10)
  if (!top.length) return null

  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-4">{title}</h2>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-3">
        {top.map((item, i) => {
          const mediaTitle = 'title' in item ? item.title : (item as TVShow).name
          const posterUrl = poster(item.poster_path)
          const href = `/${type}/${item.id}`

          return (
            <Link key={item.id} href={href} className="group relative flex-shrink-0 flex items-end">
              {/* Big number */}
              <span
                className="relative z-10 text-[5rem] sm:text-[7rem] font-black leading-none select-none"
                style={{
                  WebkitTextStroke: '2px #3f3f46',
                  color: 'transparent',
                  marginRight: '-12px',
                }}
              >
                {i + 1}
              </span>
              {/* Poster */}
              <div className="relative w-28 sm:w-32 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/80 flex-shrink-0">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={mediaTitle}
                    fill
                    sizes="128px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-zinc-600">🎬</div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
