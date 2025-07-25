import Image from 'next/image'
import Link from 'next/link'
import { Star, Tv2 } from 'lucide-react'
import { getTVByNetwork, STREAMING_NETWORKS, poster } from '../lib/tmdb'
import Pagination from '../components/Pagination'

interface Props {
  searchParams: { network?: string; page?: string }
}

export function generateMetadata() {
  return { title: 'Streaming — Sprimio' }
}

export default async function StreamingPage({ searchParams }: Props) {
  const networkId = Number(searchParams.network) || STREAMING_NETWORKS[0].id
  const page = Math.max(1, Number(searchParams.page) || 1)
  const activeNetwork = STREAMING_NETWORKS.find(n => n.id === networkId) ?? STREAMING_NETWORKS[0]

  const data = await getTVByNetwork(activeNetwork.id, page)

  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
          <Tv2 className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Streaming Platforms</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Browse TV shows by platform</p>
        </div>
      </div>

      {/* Network tabs */}
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2 mb-8">
        {STREAMING_NETWORKS.map(network => (
          <Link
            key={network.id}
            href={`/streaming?network=${network.id}`}
            className={`flex-shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 border ${
              network.id === activeNetwork.id
                ? 'bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-900/30'
                : 'bg-zinc-900/60 border-zinc-700/50 text-zinc-400 hover:text-white hover:border-zinc-600/50'
            }`}
          >
            <span>{network.logo}</span>
            {network.name}
          </Link>
        ))}
      </div>

      {/* Active network hero */}
      <div className={`bg-gradient-to-r ${activeNetwork.color} border border-zinc-800/40 rounded-2xl p-5 mb-8 flex items-center justify-between`}>
        <div>
          <p className="text-2xl mb-1">{activeNetwork.logo}</p>
          <h2 className="text-xl font-bold text-white">{activeNetwork.name}</h2>
          <p className="text-sm text-zinc-400 mt-0.5">
            {data.total_results.toLocaleString()} shows
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
        {data.results.map(show => {
          const posterUrl = poster(show.poster_path)
          const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null
          return (
            <Link key={show.id} href={`/tv/${show.id}`} className="group">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/80">
                {posterUrl ? (
                  <Image
                    src={posterUrl}
                    alt={show.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 16vw"
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
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors duration-300" />
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
