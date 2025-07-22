import Image from 'next/image'
import Link from 'next/link'
import { Star, Clock, Calendar, ChevronLeft, DollarSign, ExternalLink } from 'lucide-react'
import {
  getMovieById,
  getMovieCredits,
  getSimilarMovies,
  getMovieVideos,
  getMovieWatchProviders,
  backdrop,
  poster,
  profileImg,
} from '../../lib/tmdb'
import MovieCard from '../../components/MovieCard'
import TrailerModal from '../../components/TrailerModal'
import WatchlistButton from '../../components/WatchlistButton'
import WatchProviders from '../../components/WatchProviders'
import CollectionSection from '../../components/CollectionSection'
import ShareButton from '../../components/ShareButton'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const movie = await getMovieById(Number(params.id))
  return {
    title: `${movie.title} — Sprimio`,
    description: movie.overview,
  }
}

export default async function MovieDetailPage({ params }: Props) {
  const id = Number(params.id)
  const [movie, credits, similar, videos, providers] = await Promise.all([
    getMovieById(id),
    getMovieCredits(id),
    getSimilarMovies(id),
    getMovieVideos(id),
    getMovieWatchProviders(id),
  ])

  const director = credits.crew.find(c => c.job === 'Director')
  const writers = credits.crew.filter(c => c.job === 'Screenplay' || c.job === 'Writer').slice(0, 2)
  const cast = credits.cast.slice(0, 12)
  const backdropUrl = backdrop(movie.backdrop_path)
  const posterUrl = poster(movie.poster_path)
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null
  const hours = movie.runtime ? Math.floor(movie.runtime / 60) : 0
  const minutes = movie.runtime ? movie.runtime % 60 : 0
  const trailer = videos.find(v => v.type === 'Trailer') ?? videos[0] ?? null

  const watchlistItem = {
    id: movie.id,
    type: 'movie' as const,
    title: movie.title,
    poster_path: movie.poster_path,
    vote_average: movie.vote_average,
    year: year ? String(year) : '',
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Backdrop */}
      <div className="relative h-[58vh] min-h-[400px]">
        {backdropUrl && (
          <Image src={backdropUrl} alt={movie.title} fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 to-transparent" />
        <Link
          href="/movies"
          className="absolute top-24 left-4 sm:left-10 flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-sm bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-10 -mt-44 relative">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Poster */}
          {posterUrl && (
            <div className="flex-shrink-0 w-36 sm:w-52 lg:w-60">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden ring-1 ring-zinc-700/50 shadow-2xl shadow-black/60">
                <Image
                  src={posterUrl}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 208px, 240px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 pt-2">
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.genres?.map(g => (
                <span
                  key={g.id}
                  className="text-xs px-3 py-1 rounded-full bg-violet-900/30 border border-violet-700/30 text-violet-300 font-medium"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-1 leading-tight tracking-tight">
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-zinc-500 italic text-sm sm:text-base mb-4">"{movie.tagline}"</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
              {movie.vote_average > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold">{movie.vote_average.toFixed(1)}</span>
                  <span className="text-zinc-500 text-xs">/ 10 · {movie.vote_count.toLocaleString()} votes</span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{year}</span>
                </div>
              )}
              {movie.runtime > 0 && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{hours}h {minutes}m</span>
                </div>
              )}
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6 max-w-2xl text-sm sm:text-base">
              {movie.overview}
            </p>

            <div className="flex items-center gap-3 flex-wrap mb-6">
              <TrailerModal videoKey={trailer?.key ?? null} title={movie.title} />
              <WatchlistButton item={watchlistItem} />
              <ShareButton title={movie.title} />
              {movie.homepage && (
                <a
                  href={movie.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-2.5 rounded-full font-medium transition-colors text-sm border border-zinc-700/60"
                >
                  <ExternalLink className="w-4 h-4" />
                  Official Site
                </a>
              )}
            </div>

            <div className="space-y-2 text-sm">
              {director && (
                <p className="text-zinc-500">
                  Director: <span className="text-zinc-200 font-medium">{director.name}</span>
                </p>
              )}
              {writers.length > 0 && (
                <p className="text-zinc-500">
                  Writers: <span className="text-zinc-200 font-medium">{writers.map(w => w.name).join(', ')}</span>
                </p>
              )}
              {movie.status && (
                <p className="text-zinc-500">
                  Status: <span className="text-zinc-200 font-medium">{movie.status}</span>
                </p>
              )}
              {movie.budget > 0 && (
                <p className="text-zinc-500 flex items-center gap-1">
                  Budget:{' '}
                  <span className="text-zinc-200 font-medium flex items-center gap-0.5">
                    <DollarSign className="w-3 h-3" />{movie.budget.toLocaleString()}
                  </span>
                </p>
              )}
              {movie.revenue > 0 && (
                <p className="text-zinc-500 flex items-center gap-1">
                  Revenue:{' '}
                  <span className="text-zinc-200 font-medium flex items-center gap-0.5">
                    <DollarSign className="w-3 h-3" />{movie.revenue.toLocaleString()}
                  </span>
                </p>
              )}
            </div>

            <WatchProviders providers={providers} />
          </div>
        </div>

        {/* Cast */}
        {cast.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-white mb-5">Cast</h2>
            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
              {cast.map(member => {
                const imgUrl = profileImg(member.profile_path)
                return (
                  <Link key={member.id} href={`/person/${member.id}`} className="flex-shrink-0 w-20 text-center group">
                    <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-zinc-800 mb-2 ring-2 ring-zinc-700/50 group-hover:ring-violet-600/50 transition-all">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={member.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl text-zinc-500">👤</div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-zinc-300 line-clamp-1 group-hover:text-violet-300 transition-colors">{member.name}</p>
                    <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5">{member.character}</p>
                  </Link>
                )
              })}
            </div>
          </div>
        )}

        {/* Collection / franchise */}
        {(movie as { belongs_to_collection?: { id: number } }).belongs_to_collection && (
          <CollectionSection
            collectionId={(movie as { belongs_to_collection: { id: number } }).belongs_to_collection.id}
            currentMovieId={movie.id}
          />
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-white mb-5">More Like This</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {similar.map(m => <MovieCard key={m.id} item={m} type="movie" />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
