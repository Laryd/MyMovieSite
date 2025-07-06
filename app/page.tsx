import HeroSection from './components/HeroSection'
import MediaRow from './components/MediaRow'
import {
  getTrending,
  getPopularMovies,
  getTopRatedMovies,
  getPopularTV,
  getOnAirTV,
  getNowPlaying,
} from './lib/tmdb'

export default async function HomePage() {
  const [trending, popular, topRated, popularTV, onAir, nowPlaying] = await Promise.all([
    getTrending(),
    getPopularMovies().then(d => d.results),
    getTopRatedMovies().then(d => d.results),
    getPopularTV().then(d => d.results),
    getOnAirTV(),
    getNowPlaying(),
  ])

  const hero = trending[0]
  const rest = trending.slice(1).filter(i => i.media_type !== 'person')

  return (
    <div className="pb-16">
      {hero && <HeroSection item={hero} />}

      <div className="space-y-12 mt-12">
        <MediaRow title="Trending This Week" items={rest} viewAllHref="/movies" />
        <MediaRow title="Now Playing in Theaters" items={nowPlaying} type="movie" />
        <MediaRow title="Popular Movies" items={popular} type="movie" viewAllHref="/movies" />
        <MediaRow title="Top Rated Movies" items={topRated} type="movie" />
        <MediaRow title="Popular TV Shows" items={popularTV} type="tv" viewAllHref="/tv" />
        <MediaRow title="Currently Airing" items={onAir} type="tv" viewAllHref="/tv" />
      </div>
    </div>
  )
}
