import Image from 'next/image'
import Link from 'next/link'
import { Star, TrendingUp } from 'lucide-react'
import { getTrendingByType, poster } from '../lib/tmdb'
import TrendingTabs from './TrendingTabs'

interface Props {
  searchParams: { type?: string; window?: string }
}

export function generateMetadata() {
  return { title: 'Trending — Sprimio' }
}

export default async function TrendingPage({ searchParams }: Props) {
  const type = (searchParams.type === 'tv' ? 'tv' : 'movie') as 'movie' | 'tv'
  const window = (searchParams.window === 'day' ? 'day' : 'week') as 'day' | 'week'

  const data = await getTrendingByType(type, window)
  const results = data.results.filter(
    r => (r.media_type === 'movie' || r.media_type === 'tv') && r.poster_path
  )

  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
          <TrendingUp className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Trending</h1>
          <p className="text-xs text-zinc-500 mt-0.5">{data.total_results.toLocaleString()} results</p>
        </div>
      </div>

      <TrendingTabs activeType={type} activeWindow={window} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mt-6">
        {results.map((item, i) => {
          const title = item.title || item.name || ''
          const date = item.release_date || item.first_air_date
          const year = date ? new Date(date).getFullYear() : null
          const posterUrl = poster(item.poster_path)
          const href = item.media_type === 'tv' ? `/tv/${item.id}` : `/movies/${item.id}`

          return (
            <Link key={`${item.media_type}-${item.id}`} href={href} className="group relative">
              {/* Rank badge */}
              <div className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-zinc-950 border-2 border-violet-600 flex items-center justify-center">
                <span className="text-xs font-black text-violet-300">{i + 1}</span>
              </div>
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/80">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">🎬</div>
                )}
                {item.vote_average && item.vote_average > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-white font-medium">{item.vote_average.toFixed(1)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
              </div>
              <p className="mt-2 text-sm font-medium text-zinc-200 line-clamp-1 group-hover:text-violet-300 transition-colors">
                {title}
              </p>
              {year && <p className="text-xs text-zinc-600 mt-0.5">{year}</p>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
