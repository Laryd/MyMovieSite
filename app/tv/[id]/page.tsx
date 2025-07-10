import Image from 'next/image'
import Link from 'next/link'
import { Star, Calendar, Play, ChevronLeft, Tv2 } from 'lucide-react'
import {
  getTVById,
  getTVCredits,
  getSimilarTV,
  backdrop,
  poster,
  profileImg,
} from '../../lib/tmdb'
import MovieCard from '../../components/MovieCard'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const show = await getTVById(Number(params.id))
  return { title: `${show.name} — Sprimio` }
}

export default async function TVDetailPage({ params }: Props) {
  const id = Number(params.id)
  const [show, credits, similar] = await Promise.all([
    getTVById(id),
    getTVCredits(id),
    getSimilarTV(id),
  ])

  const creator = credits.crew.find(c => c.job === 'Creator' || c.department === 'Creator')
  const cast = credits.cast.slice(0, 12)
  const backdropUrl = backdrop(show.backdrop_path)
  const posterUrl = poster(show.poster_path)
  const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null

  return (
    <div className="min-h-screen pb-16">
      {/* Backdrop */}
      <div className="relative h-[55vh] min-h-[380px]">
        {backdropUrl && (
          <Image src={backdropUrl} alt={show.name} fill sizes="100vw" className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/50 to-zinc-950/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/70 to-transparent" />
        <Link
          href="/tv"
          className="absolute top-24 left-4 sm:left-10 flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-sm bg-black/30 backdrop-blur-sm rounded-full px-3 py-1.5"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Link>
      </div>

      {/* Content */}
      <div className="px-4 sm:px-6 lg:px-10 -mt-40 relative">
        <div className="flex flex-col sm:flex-row gap-8">
          {/* Poster */}
          {posterUrl && (
            <div className="flex-shrink-0 w-36 sm:w-52 lg:w-60">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden ring-1 ring-zinc-700/50 shadow-2xl shadow-black/60">
                <Image
                  src={posterUrl}
                  alt={show.name}
                  fill
                  sizes="(max-width: 640px) 144px, (max-width: 1024px) 208px, 240px"
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Info */}
          <div className="flex-1 pt-2">
            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-3">
              {show.genres?.map(g => (
                <span
                  key={g.id}
                  className="text-xs px-3 py-1 rounded-full bg-violet-900/30 border border-violet-700/30 text-violet-300 font-medium"
                >
                  {g.name}
                </span>
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-1 leading-tight tracking-tight">
              {show.name}
            </h1>
            {show.tagline && (
              <p className="text-zinc-500 italic text-sm sm:text-base mb-4">"{show.tagline}"</p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-5 text-sm">
              {show.vote_average > 0 && (
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-white font-bold">{show.vote_average.toFixed(1)}</span>
                  <span className="text-zinc-500 text-xs">/ 10 · {show.vote_count.toLocaleString()} votes</span>
                </div>
              )}
              {year && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{year}</span>
                </div>
              )}
              {show.number_of_seasons > 0 && (
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Tv2 className="w-3.5 h-3.5" />
                  <span>
                    {show.number_of_seasons} Season{show.number_of_seasons !== 1 ? 's' : ''}
                    {show.number_of_episodes ? ` · ${show.number_of_episodes} Episodes` : ''}
                  </span>
                </div>
              )}
            </div>

            <p className="text-zinc-300 leading-relaxed mb-6 max-w-2xl text-sm sm:text-base">
              {show.overview}
            </p>

            {/* Action */}
            <div className="flex items-center gap-3 flex-wrap mb-6">
              <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-6 py-2.5 rounded-full font-semibold transition-colors text-sm shadow-lg shadow-violet-900/30">
                <Play className="w-4 h-4 fill-white" />
                Watch Trailer
              </button>
            </div>

            {/* Credits */}
            <div className="space-y-2 text-sm">
              {creator && (
                <p className="text-zinc-500">
                  Creator: <span className="text-zinc-200 font-medium">{creator.name}</span>
                </p>
              )}
              {show.status && (
                <p className="text-zinc-500">
                  Status: <span className="text-zinc-200 font-medium">{show.status}</span>
                </p>
              )}
            </div>
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
                  <div key={member.id} className="flex-shrink-0 w-20 text-center group">
                    <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden bg-zinc-800 mb-2 ring-2 ring-zinc-700/50 group-hover:ring-violet-600/50 transition-all">
                      {imgUrl ? (
                        <Image src={imgUrl} alt={member.name} fill sizes="64px" className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl text-zinc-500">👤</div>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-zinc-300 line-clamp-1">{member.name}</p>
                    <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5">{member.character}</p>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <div className="mt-14">
            <h2 className="text-xl font-bold text-white mb-5">More Like This</h2>
            <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
              {similar.map(s => (
                <MovieCard key={s.id} item={s} type="tv" />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
