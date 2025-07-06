import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'
import {
  getPopularTV,
  getTopRatedTV,
  getTVByGenre,
  getTVGenres,
  poster,
} from '../lib/tmdb'
import GenreFilter from '../components/GenreFilter'
import Pagination from '../components/Pagination'

interface Props {
  searchParams: { genre?: string; page?: string; sort?: string }
}

export default async function TVPage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page) || 1)
  const genre = searchParams.genre ? Number(searchParams.genre) : null
  const sort = searchParams.sort || 'popular'

  const [genres, data] = await Promise.all([
    getTVGenres(),
    genre
      ? getTVByGenre(genre, page)
      : sort === 'top_rated'
      ? getTopRatedTV(page)
      : getPopularTV(page),
  ])

  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">TV Shows</h1>
          <p className="text-sm text-zinc-500 mt-0.5">{data.total_results.toLocaleString()} titles</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/tv?sort=popular"
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-all duration-200 ${
              !genre && sort !== 'top_rated'
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Popular
          </Link>
          <Link
            href="/tv?sort=top_rated"
            className={`text-sm px-4 py-1.5 rounded-full font-medium transition-all duration-200 ${
              sort === 'top_rated' && !genre
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/30'
                : 'bg-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            Top Rated
          </Link>
        </div>
      </div>

      {/* Genre filter */}
      <div className="mb-8">
        <GenreFilter genres={genres} />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {data.results.map(show => {
          const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null
          const posterUrl = poster(show.poster_path)
          return (
            <Link key={show.id} href={`/tv/${show.id}`} className="group">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/80">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={show.name}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-zinc-600">📺</div>
                )}
                {show.vote_average > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-white font-medium">{show.vote_average.toFixed(1)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 rounded-xl" />
              </div>
              <p className="mt-2 text-sm font-medium text-zinc-200 line-clamp-1 group-hover:text-violet-300 transition-colors">
                {show.name}
              </p>
              {year && <p className="text-xs text-zinc-600 mt-0.5">{year}</p>}
            </Link>
          )
        })}
      </div>

      <Pagination currentPage={page} totalPages={data.total_pages} />
    </div>
  )
}
