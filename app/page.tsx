import HeroCarousel from './components/HeroCarousel'
import MediaRow from './components/MediaRow'
import Top10Row from './components/Top10Row'
import RecentlyViewed from './components/RecentlyViewed'
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

      <div className="space-y-12 mt-12">
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
