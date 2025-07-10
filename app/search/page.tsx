import Image from 'next/image'
import Link from 'next/link'
import { Star, Search } from 'lucide-react'
import { searchMulti, poster } from '../lib/tmdb'
import Pagination from '../components/Pagination'

interface Props {
  searchParams: { q?: string; page?: string }
}

export function generateMetadata({ searchParams }: Props) {
  return { title: searchParams.q ? `"${searchParams.q}" — Sprimio` : 'Search — Sprimio' }
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() || ''
  const page = Math.max(1, Number(searchParams.page) || 1)

  if (!query) {
    return (
      <div className="pt-36 pb-16 flex flex-col items-center gap-4 text-center px-4">
        <div className="w-16 h-16 rounded-full bg-zinc-800/80 flex items-center justify-center mb-2">
          <Search className="w-8 h-8 text-zinc-600" />
        </div>
        <p className="text-zinc-400 text-lg font-medium">What are you looking for?</p>
        <p className="text-zinc-600 text-sm">Search for movies and TV shows using the search bar above.</p>
      </div>
    )
  }

  const data = await searchMulti(query, page)
  const results = data.results.filter(r => r.media_type !== 'person')

  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Results for{' '}
          <span className="text-violet-400">"{query}"</span>
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          {data.total_results.toLocaleString()} result{data.total_results !== 1 ? 's' : ''} found
        </p>
      </div>

      {results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20 text-center">
          <Search className="w-10 h-10 text-zinc-700" />
          <p className="text-zinc-400 font-medium">No results found</p>
          <p className="text-zinc-600 text-sm">Try a different search term</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {results.map(item => {
              const title = item.title || item.name || ''
              const date = item.release_date || item.first_air_date
              const year = date ? new Date(date).getFullYear() : null
              const posterUrl = poster(item.poster_path)
              const href = item.media_type === 'tv' ? `/tv/${item.id}` : `/movies/${item.id}`

              return (
                <Link key={`${item.media_type}-${item.id}`} href={href} className="group">
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
                      <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">
                        {item.media_type === 'tv' ? '📺' : '🎬'}
                      </div>
                    )}
                    {item.vote_average && item.vote_average > 0 && (
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-white font-medium">{item.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-zinc-300">
                        {item.media_type === 'tv' ? 'Series' : 'Film'}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300 rounded-xl" />
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-200 line-clamp-1 group-hover:text-violet-300 transition-colors">
                    {title}
                  </p>
                  {year && <p className="text-xs text-zinc-600 mt-0.5">{year}</p>}
                </Link>
              )
            })}
          </div>

          <Pagination currentPage={page} totalPages={data.total_pages} />
        </>
      )}
    </div>
  )
}
