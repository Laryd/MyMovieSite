import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const page = req.nextUrl.searchParams.get('page') || '1'
  const useTV = Math.random() < 0.4
  const endpoint = useTV ? 'tv/popular' : 'movie/popular'

  const res = await fetch(
    `https://api.themoviedb.org/3/${endpoint}?api_key=${process.env.TMDB_API_KEY}&page=${page}`
  )
  if (!res.ok) return NextResponse.json({ error: 'failed' }, { status: 500 })

  const data = await res.json()
  const results = (data.results ?? []).filter(
    (r: { poster_path: string | null }) => r.poster_path
  )
  if (!results.length) return NextResponse.json({ error: 'empty' }, { status: 404 })

  const item = results[Math.floor(Math.random() * results.length)]
  return NextResponse.json({ id: item.id, type: useTV ? 'tv' : 'movies' })
}
