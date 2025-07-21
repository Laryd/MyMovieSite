import Image from 'next/image'
import Link from 'next/link'
import { Star, Sliders } from 'lucide-react'
import { discoverMovies, discoverTV, getMovieGenres, getTVGenres, poster } from '../lib/tmdb'
import DiscoverFilters from './DiscoverFilters'
import Pagination from '../components/Pagination'

interface Props {
  searchParams: {
    type?: string
    genre?: string
    year_from?: string
    year_to?: string
    rating?: string
    sort?: string
    page?: string
  }
}

export function generateMetadata() {
  return { title: 'Discover — Sprimio' }
}

export default async function DiscoverPage({ searchParams }: Props) {
  const type = searchParams.type === 'tv' ? 'tv' : 'movie'
  const page = Math.max(1, Number(searchParams.page) || 1)
  const genre = searchParams.genre || ''
  const yearFrom = searchParams.year_from || ''
  const yearTo = searchParams.year_to || ''
  const rating = searchParams.rating || ''
  const sort = searchParams.sort || 'popularity.desc'

  const [genres, data] = await Promise.all([
    type === 'tv' ? getTVGenres() : getMovieGenres(),
    type === 'tv'
      ? discoverTV({
          page,
          sort_by: sort,
          ...(genre && { with_genres: genre }),
          ...(yearFrom && { 'first_air_date.gte': `${yearFrom}-01-01` }),
          ...(yearTo && { 'first_air_date.lte': `${yearTo}-12-31` }),
          ...(rating && { 'vote_average.gte': rating, 'vote_count.gte': '50' }),
        })
      : discoverMovies({
          page,
          sort_by: sort,
          ...(genre && { with_genres: genre }),
          ...(yearFrom && { 'primary_release_date.gte': `${yearFrom}-01-01` }),
          ...(yearTo && { 'primary_release_date.lte': `${yearTo}-12-31` }),
          ...(rating && { 'vote_average.gte': rating, 'vote_count.gte': '50' }),
        }),
  ])

  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
          <Sliders className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Discover</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {data.total_results.toLocaleString()} results
          </p>
        </div>
      </div>

      <DiscoverFilters genres={genres} activeType={type} />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 mt-8">
        {data.results.map(item => {
          const title = 'title' in item ? item.title : (item as { name: string }).name
          const date = 'release_date' in item ? item.release_date : (item as { first_air_date: string }).first_air_date
          const year = date ? new Date(date).getFullYear() : null
          const posterUrl = poster(item.poster_path)
          const href = type === 'tv' ? `/tv/${item.id}` : `/movies/${item.id}`

          return (
            <Link key={item.id} href={href} className="group">
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
                {item.vote_average > 0 && (
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

      <Pagination currentPage={page} totalPages={data.total_pages} />
    </div>
  )
}
