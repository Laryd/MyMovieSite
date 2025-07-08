const BASE_URL = 'https://api.themoviedb.org/3'
export const IMG = 'https://image.tmdb.org/t/p'

function apiKey() {
  return process.env.TMDB_API_KEY ?? ''
}

async function get<T>(path: string, params: Record<string, string | number> = {}): Promise<T> {
  const entries = Object.entries(params).map(([k, v]) => [k, String(v)])
  const qs = new URLSearchParams({ api_key: apiKey(), ...Object.fromEntries(entries) })
  const res = await fetch(`${BASE_URL}${path}?${qs}`, { next: { revalidate: 3600 } })
  if (!res.ok) throw new Error(`TMDB ${res.status}: ${path}`)
  return res.json()
}

export function poster(path: string | null, w: 'w300' | 'w500' = 'w500'): string | null {
  return path ? `${IMG}/${w}${path}` : null
}

export function backdrop(path: string | null): string | null {
  return path ? `${IMG}/original${path}` : null
}

export function profileImg(path: string | null): string | null {
  return path ? `${IMG}/w185${path}` : null
}

// ─── Types ───────────────────────────────────────────────────────────────────

export interface ListResult<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface Genre {
  id: number
  name: string
}

export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  media_type?: string
}

export interface MovieDetail extends Movie {
  genres: Genre[]
  runtime: number
  tagline: string
  status: string
  budget: number
  revenue: number
  homepage: string
}

export interface TVShow {
  id: number
  name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids?: number[]
  media_type?: string
}

export interface TVShowDetail extends TVShow {
  genres: Genre[]
  number_of_seasons: number
  number_of_episodes: number
  tagline: string
  status: string
  homepage: string
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface Credits {
  cast: CastMember[]
  crew: CrewMember[]
}

export interface SearchResult {
  id: number
  media_type: 'movie' | 'tv' | 'person'
  title?: string
  name?: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  release_date?: string
  first_air_date?: string
  vote_average?: number
}

export type TrendingItem = (Movie | TVShow) & { media_type: string }

// ─── API calls ───────────────────────────────────────────────────────────────

export const getTrending = () =>
  get<{ results: TrendingItem[] }>('/trending/all/week').then(d => d.results)

// Movies
export const getPopularMovies = (page = 1) =>
  get<ListResult<Movie>>('/movie/popular', { page })

export const getTopRatedMovies = (page = 1) =>
  get<ListResult<Movie>>('/movie/top_rated', { page })

export const getNowPlaying = () =>
  get<ListResult<Movie>>('/movie/now_playing').then(d => d.results)

export const getUpcoming = () =>
  get<ListResult<Movie>>('/movie/upcoming').then(d => d.results)

export const getMovieById = (id: number) =>
  get<MovieDetail>(`/movie/${id}`)

export const getMovieCredits = (id: number) =>
  get<Credits>(`/movie/${id}/credits`)

export const getSimilarMovies = (id: number) =>
  get<ListResult<Movie>>(`/movie/${id}/similar`).then(d => d.results.slice(0, 12))

export const getMoviesByGenre = (genreId: number, page = 1) =>
  get<ListResult<Movie>>('/discover/movie', { with_genres: genreId, page, sort_by: 'popularity.desc' })

export const getMovieGenres = () =>
  get<{ genres: Genre[] }>('/genre/movie/list').then(d => d.genres)

// TV
export const getPopularTV = (page = 1) =>
  get<ListResult<TVShow>>('/tv/popular', { page })

export const getTopRatedTV = (page = 1) =>
  get<ListResult<TVShow>>('/tv/top_rated', { page })

export const getOnAirTV = () =>
  get<ListResult<TVShow>>('/tv/on_the_air').then(d => d.results)

export const getTVById = (id: number) =>
  get<TVShowDetail>(`/tv/${id}`)

export const getTVCredits = (id: number) =>
  get<Credits>(`/tv/${id}/credits`)

export const getSimilarTV = (id: number) =>
  get<ListResult<TVShow>>(`/tv/${id}/similar`).then(d => d.results.slice(0, 12))

export const getTVByGenre = (genreId: number, page = 1) =>
  get<ListResult<TVShow>>('/discover/tv', { with_genres: genreId, page, sort_by: 'popularity.desc' })

export const getTVGenres = () =>
  get<{ genres: Genre[] }>('/genre/tv/list').then(d => d.genres)

// Search
export const searchMulti = (query: string, page = 1) =>
  get<ListResult<SearchResult>>('/search/multi', { query, page })

// Videos (trailers)
export interface Video {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}
export const getMovieVideos = (id: number) =>
  get<{ results: Video[] }>(`/movie/${id}/videos`).then(d =>
    d.results.filter(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
  )
export const getTVVideos = (id: number) =>
  get<{ results: Video[] }>(`/tv/${id}/videos`).then(d =>
    d.results.filter(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'))
  )

// Watch providers
export interface Provider {
  logo_path: string
  provider_id: number
  provider_name: string
  display_priority: number
}
export interface WatchProviderResult {
  link: string
  flatrate?: Provider[]
  rent?: Provider[]
  buy?: Provider[]
}
export const getMovieWatchProviders = (id: number) =>
  get<{ results: Record<string, WatchProviderResult> }>(`/movie/${id}/watch/providers`).then(
    d => d.results?.US ?? null
  )
export const getTVWatchProviders = (id: number) =>
  get<{ results: Record<string, WatchProviderResult> }>(`/tv/${id}/watch/providers`).then(
    d => d.results?.US ?? null
  )

// People
export interface Person {
  id: number
  name: string
  biography: string
  birthday: string | null
  deathday: string | null
  place_of_birth: string | null
  profile_path: string | null
  known_for_department: string
  popularity: number
  homepage: string | null
}
export interface PersonMovieCredit extends Movie {
  character: string
  job?: string
}
export interface PersonCredits {
  cast: PersonMovieCredit[]
  crew: PersonMovieCredit[]
}
export const getPersonById = (id: number) => get<Person>(`/person/${id}`)
export const getPersonMovieCredits = (id: number) =>
  get<PersonCredits>(`/person/${id}/movie_credits`)
export const getPersonTVCredits = (id: number) =>
  get<{ cast: (TVShow & { character: string })[] }>(`/person/${id}/tv_credits`)

// Popular people
export const getPopularPeople = (page = 1) =>
  get<ListResult<Person & { known_for: (Movie | TVShow)[] }>>('/person/popular', { page })
