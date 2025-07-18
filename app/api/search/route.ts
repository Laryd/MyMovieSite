import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const query = req.nextUrl.searchParams.get('q')?.trim()
  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] })
  }

  const res = await fetch(
    `https://api.themoviedb.org/3/search/multi?api_key=${process.env.TMDB_API_KEY}&query=${encodeURIComponent(query)}&page=1`,
    { next: { revalidate: 60 } }
  )

  if (!res.ok) return NextResponse.json({ results: [] })

  const data = await res.json()
  const results = (data.results ?? [])
    .filter((r: { media_type: string; poster_path: string | null; profile_path: string | null }) =>
      r.media_type !== 'person' && (r.poster_path || r.profile_path)
    )
    .slice(0, 7)

  return NextResponse.json({ results })
}
