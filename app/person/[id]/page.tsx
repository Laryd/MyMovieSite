import Image from 'next/image'
import Link from 'next/link'
import { Calendar, MapPin, ChevronLeft, Star } from 'lucide-react'
import {
  getPersonById,
  getPersonMovieCredits,
  getPersonTVCredits,
  poster,
  profileImg,
} from '../../lib/tmdb'

interface Props {
  params: { id: string }
}

export async function generateMetadata({ params }: Props) {
  const person = await getPersonById(Number(params.id))
  return { title: `${person.name} — Sprimio` }
}

export default async function PersonPage({ params }: Props) {
  const id = Number(params.id)
  const [person, movieCredits, tvCredits] = await Promise.all([
    getPersonById(id),
    getPersonMovieCredits(id),
    getPersonTVCredits(id),
  ])

  const imgUrl = profileImg(person.profile_path)
  const age = person.birthday
    ? Math.floor(
        (new Date(person.deathday ?? new Date()).getTime() - new Date(person.birthday).getTime()) /
          (365.25 * 24 * 60 * 60 * 1000)
      )
    : null

  const knownMovies = [...movieCredits.cast]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 12)
  const knownTV = [...tvCredits.cast]
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, 12)

  return (
    <div className="min-h-screen pb-16 pt-28 px-4 sm:px-6 lg:px-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1 text-zinc-400 hover:text-white transition-colors text-sm mb-8 bg-zinc-800/60 rounded-full px-3 py-1.5"
      >
        <ChevronLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="flex flex-col sm:flex-row gap-8 mb-12">
        {/* Photo */}
        <div className="flex-shrink-0">
          <div className="relative w-44 sm:w-56 aspect-[2/3] rounded-2xl overflow-hidden bg-zinc-800 ring-1 ring-zinc-700/50 shadow-2xl shadow-black/50">
            {imgUrl ? (
              <Image src={imgUrl} alt={person.name} fill sizes="224px" className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-6xl text-zinc-600">👤</div>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 tracking-tight">{person.name}</h1>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-violet-900/30 border border-violet-700/30 text-violet-300 font-medium">
              {person.known_for_department}
            </span>
          </div>

          <div className="space-y-2 text-sm mb-6">
            {person.birthday && (
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  Born {new Date(person.birthday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {age && !person.deathday ? ` (age ${age})` : ''}
                </span>
              </div>
            )}
            {person.deathday && (
              <div className="flex items-center gap-2 text-zinc-400">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>
                  Died {new Date(person.deathday).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {age ? ` (age ${age})` : ''}
                </span>
              </div>
            )}
            {person.place_of_birth && (
              <div className="flex items-center gap-2 text-zinc-400">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span>{person.place_of_birth}</span>
              </div>
            )}
          </div>

          {person.biography && (
            <div>
              <h2 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-2">Biography</h2>
              <p className="text-zinc-300 text-sm leading-relaxed line-clamp-6 max-w-2xl">
                {person.biography}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Known For — Movies */}
      {knownMovies.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-white mb-5">Known For — Movies</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {knownMovies.map(movie => {
              const posterUrl = poster(movie.poster_path)
              const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null
              return (
                <Link key={movie.id} href={`/movies/${movie.id}`} className="group flex-shrink-0 w-36 sm:w-40">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/80">
                    {posterUrl ? (
                      <Image src={posterUrl} alt={movie.title} fill sizes="160px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-zinc-600">🎬</div>
                    )}
                    {movie.vote_average > 0 && (
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 rounded-full px-1.5 py-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-white font-medium">{movie.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-200 line-clamp-1 group-hover:text-violet-300 transition-colors">{movie.title}</p>
                  {movie.character && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">as {movie.character}</p>}
                  {year && <p className="text-xs text-zinc-600">{year}</p>}
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Known For — TV */}
      {knownTV.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-white mb-5">Known For — TV</h2>
          <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
            {knownTV.map(show => {
              const posterUrl = poster(show.poster_path)
              const year = show.first_air_date ? new Date(show.first_air_date).getFullYear() : null
              return (
                <Link key={show.id} href={`/tv/${show.id}`} className="group flex-shrink-0 w-36 sm:w-40">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/80">
                    {posterUrl ? (
                      <Image src={posterUrl} alt={show.name} fill sizes="160px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl text-zinc-600">📺</div>
                    )}
                    {show.vote_average > 0 && (
                      <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 rounded-full px-1.5 py-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                        <span className="text-xs text-white font-medium">{show.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-sm font-medium text-zinc-200 line-clamp-1 group-hover:text-violet-300 transition-colors">{show.name}</p>
                  {show.character && <p className="text-xs text-zinc-500 mt-0.5 line-clamp-1">as {show.character}</p>}
                  {year && <p className="text-xs text-zinc-600">{year}</p>}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
