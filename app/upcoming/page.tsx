import Image from 'next/image'
import Link from 'next/link'
import { Star, CalendarDays } from 'lucide-react'
import { getUpcomingGrouped, poster } from '../lib/tmdb'
import Pagination from '../components/Pagination'

interface Props {
  searchParams: { page?: string }
}

export function generateMetadata() {
  return { title: 'Upcoming — Sprimio' }
}

function groupByMonth(movies: { release_date: string }[]) {
  const groups: Record<string, typeof movies> = {}
  for (const m of movies) {
    if (!m.release_date) continue
    const key = new Date(m.release_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!groups[key]) groups[key] = []
    groups[key].push(m)
  }
  return groups
}

export default async function UpcomingPage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page) || 1)
  const data = await getUpcomingGrouped(page)
  const grouped = groupByMonth(data.results)

  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
          <CalendarDays className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Upcoming Releases</h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            {data.total_results.toLocaleString()} movies coming soon
          </p>
        </div>
      </div>

      {Object.entries(grouped).map(([month, movies]) => (
        <div key={month} className="mb-12">
          <h2 className="text-base font-bold text-violet-400 uppercase tracking-widest mb-5 flex items-center gap-2">
            <span className="h-px flex-1 bg-zinc-800/80" />
            {month}
            <span className="h-px flex-1 bg-zinc-800/80" />
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {movies.map(movie => {
              const m = movie as typeof movie & {
                id: number; title: string; poster_path: string | null;
                vote_average: number; overview: string; release_date: string;
              }
              const posterUrl = poster(m.poster_path)
              const releaseDate = new Date(m.release_date).toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric',
              })
              const daysUntil = Math.ceil(
                (new Date(m.release_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
              )
              return (
                <Link key={m.id} href={`/movies/${m.id}`} className="group flex gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/60 hover:border-zinc-700/60 transition-all duration-200 hover:bg-zinc-900/80">
                  <div className="relative w-16 aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    {posterUrl ? (
                      <Image src={posterUrl} alt={m.title} fill sizes="64px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl text-zinc-600">🎬</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-white text-sm line-clamp-1 group-hover:text-violet-300 transition-colors mb-1">
                      {m.title}
                    </h3>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <span className="text-xs text-zinc-400">{releaseDate}</span>
                      {daysUntil > 0 && daysUntil <= 30 && (
                        <span className="text-xs font-medium text-violet-400 bg-violet-900/30 border border-violet-800/30 px-2 py-0.5 rounded-full">
                          In {daysUntil} day{daysUntil !== 1 ? 's' : ''}
                        </span>
                      )}
                      {m.vote_average > 0 && (
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                          <span className="text-xs text-zinc-400">{m.vote_average.toFixed(1)}</span>
                        </div>
                      )}
                    </div>
                    {m.overview && (
                      <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{m.overview}</p>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      ))}

      <Pagination currentPage={page} totalPages={data.total_pages} />
    </div>
  )
}
