import Image from 'next/image'
import Link from 'next/link'
import { Star, Layers } from 'lucide-react'
import { getCollection, poster } from '@/app/lib/tmdb'

interface Props {
  collectionId: number
  currentMovieId: number
}

export default async function CollectionSection({ collectionId, currentMovieId }: Props) {
  const collection = await getCollection(collectionId)
  const parts = collection.parts
    .filter(m => m.id !== currentMovieId && m.poster_path)
    .sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())

  if (!parts.length) return null

  return (
    <div className="mt-14">
      <div className="flex items-center gap-2 mb-5">
        <Layers className="w-5 h-5 text-violet-400" />
        <h2 className="text-xl font-bold text-white">{collection.name}</h2>
        <span className="text-xs text-zinc-500 bg-zinc-800 px-2 py-0.5 rounded-full">
          {collection.parts.length} films
        </span>
      </div>
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {parts.map(movie => {
          const posterUrl = poster(movie.poster_path)
          const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null
          return (
            <Link key={movie.id} href={`/movies/${movie.id}`} className="group flex-shrink-0 w-36 sm:w-40">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-zinc-800/80">
                {posterUrl && (
                  <Image
                    src={posterUrl}
                    alt={movie.title}
                    fill
                    sizes="160px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                )}
                {movie.vote_average > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-0.5 bg-black/70 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                    <Star className="w-2.5 h-2.5 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-white font-medium">{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
              </div>
              <p className="mt-2 text-sm font-medium text-zinc-200 line-clamp-1 group-hover:text-violet-300 transition-colors">
                {movie.title}
              </p>
              {year && <p className="text-xs text-zinc-600 mt-0.5">{year}</p>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
