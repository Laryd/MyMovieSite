import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ items: [] })

  const userId = (session.user as { id: string }).id
  const items = await prisma.watchlistItem.findMany({
    where: { userId },
    orderBy: { addedAt: 'desc' },
  })
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const body = await req.json()

  const item = await prisma.watchlistItem.upsert({
    where: { userId_mediaId_mediaType: { userId, mediaId: body.id, mediaType: body.type } },
    create: {
      userId,
      mediaId: body.id,
      mediaType: body.type,
      title: body.title,
      posterPath: body.poster_path,
      voteAverage: body.vote_average,
      year: body.year,
    },
    update: {},
  })
  return NextResponse.json({ item }, { status: 201 })
}

export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const { searchParams } = new URL(req.url)
  const mediaId = Number(searchParams.get('id'))
  const mediaType = searchParams.get('type') ?? ''

  await prisma.watchlistItem.deleteMany({
    where: { userId, mediaId, mediaType },
  })
  return NextResponse.json({ ok: true })
}
