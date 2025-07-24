import Link from 'next/link'
import { Tag } from 'lucide-react'
import type { Keyword } from '@/app/lib/tmdb'

interface Props {
  keywords: Keyword[]
  type: 'movie' | 'tv'
}

export default function Keywords({ keywords, type }: Props) {
  if (!keywords.length) return null

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-zinc-500" />
        <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">Keywords</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {keywords.slice(0, 20).map(kw => (
          <Link
            key={kw.id}
            href={`/discover?type=${type}&keyword=${kw.id}`}
            className="text-xs px-3 py-1.5 rounded-full bg-zinc-800/80 border border-zinc-700/40 text-zinc-400 hover:text-white hover:bg-zinc-700/80 hover:border-zinc-600/40 transition-all duration-200"
          >
            {kw.name}
          </Link>
        ))}
      </div>
    </div>
  )
}
