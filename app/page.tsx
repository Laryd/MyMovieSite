import HeroCarousel from './components/HeroCarousel'
import MediaRow from './components/MediaRow'
import Top10Row from './components/Top10Row'
import RecentlyViewed from './components/RecentlyViewed'
import RandomPickButton from './components/RandomPickButton'
import Link from 'next/link'
import { CalendarDays, Tv2 } from 'lucide-react'
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getPopularTV,
  getOnAirTV,
  getNowPlaying,
  getUpcoming,
} from './lib/tmdb'

export default async function HomePage() {
  const [trending, popular, topRated, popularTV, onAir, nowPlaying, upcoming] = await Promise.all([
    getTrending(),
    getPopularMovies().then(d => d.results),
    getTopRatedMovies().then(d => d.results),
    getPopularTV().then(d => d.results),
    getOnAirTV(),
    getNowPlaying(),
    getUpcoming(),
  ])

  const rest = trending.slice(6).filter(i => i.media_type !== 'person')

  return (
    <div className="pb-16">
      <HeroCarousel items={trending.filter(i => i.media_type !== 'person')} />

      {/* Quick actions */}
      <div className="flex flex-wrap items-center gap-3 px-4 sm:px-6 lg:px-10 mt-10">
        <RandomPickButton />
        <Link href="/upcoming" className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 hover:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200">
          <CalendarDays className="w-4 h-4" /> Upcoming Releases
        </Link>
        <Link href="/streaming" className="flex items-center gap-2 bg-zinc-900/80 hover:bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 hover:text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200">
          <Tv2 className="w-4 h-4" /> Browse Platforms
        </Link>
      </div>

      <div className="space-y-12 mt-10">
        <RecentlyViewed />
        <Top10Row title="Top 10 Movies Today" items={popular} type="movie" />
        <MediaRow title="Trending This Week" items={rest} viewAllHref="/movies" />
        <MediaRow title="Now Playing in Theaters" items={nowPlaying} type="movie" />
        <Top10Row title="Top 10 TV Shows" items={popularTV} type="tv" />
        <MediaRow title="Popular Movies" items={popular} type="movie" viewAllHref="/movies" />
        <MediaRow title="Top Rated Movies" items={topRated} type="movie" />
        <MediaRow title="Popular TV Shows" items={popularTV} type="tv" viewAllHref="/tv" />
        <MediaRow title="Currently Airing" items={onAir} type="tv" viewAllHref="/tv" />
        <MediaRow title="Coming Soon" items={upcoming} type="movie" />
      </div>
    </div>
  )
}
