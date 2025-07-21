import Image from 'next/image'
import Link from 'next/link'
import { Users } from 'lucide-react'
import { getPopularPeople, IMG } from '../lib/tmdb'
import Pagination from '../components/Pagination'

interface Props {
  searchParams: { page?: string }
}

export function generateMetadata() {
  return { title: 'People — Sprimio' }
}

export default async function PeoplePage({ searchParams }: Props) {
  const page = Math.max(1, Number(searchParams.page) || 1)
  const data = await getPopularPeople(page)

  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center">
          <Users className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Popular People</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Actors, directors & more</p>
        </div>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4 sm:gap-5">
        {data.results.map(person => {
          const imgUrl = person.profile_path ? `${IMG}/w185${person.profile_path}` : null
          return (
            <Link key={person.id} href={`/person/${person.id}`} className="group text-center">
              <div className="relative w-full aspect-square rounded-full overflow-hidden bg-zinc-800 ring-2 ring-zinc-700/50 group-hover:ring-violet-600/50 transition-all duration-300">
                {imgUrl ? (
                  <Image
                    src={imgUrl}
                    alt={person.name}
                    fill
                    sizes="(max-width: 640px) 33vw, (max-width: 1024px) 20vw, 12vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl text-zinc-600">👤</div>
                )}
              </div>
              <p className="mt-2 text-xs font-semibold text-zinc-300 line-clamp-1 group-hover:text-violet-300 transition-colors">
                {person.name}
              </p>
              <p className="text-xs text-zinc-600 mt-0.5 line-clamp-1">{person.known_for_department}</p>
            </Link>
          )
        })}
      </div>

      <Pagination currentPage={page} totalPages={data.total_pages} />
    </div>
  )
}
