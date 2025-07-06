'use client'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Props {
  currentPage: number
  totalPages: number
}

export default function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const capped = Math.min(totalPages, 500)

  const goTo = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    router.push(`${pathname}?${params.toString()}`)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const pages: (number | '...')[] = []
  if (capped <= 7) {
    for (let i = 1; i <= capped; i++) pages.push(i)
  } else {
    pages.push(1)
    if (currentPage > 3) pages.push('...')
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(capped - 1, currentPage + 1); i++) {
      pages.push(i)
    }
    if (currentPage < capped - 2) pages.push('...')
    pages.push(capped)
  }

  if (capped <= 1) return null

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => goTo(currentPage - 1)}
        disabled={currentPage <= 1}
        className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`e${i}`} className="text-zinc-600 px-1">…</span>
        ) : (
          <button
            key={p}
            onClick={() => goTo(p as number)}
            className={cn(
              'w-9 h-9 rounded-full text-sm font-medium transition-all duration-200',
              p === currentPage
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/40'
                : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
            )}
          >
            {p}
          </button>
        )
      )}

      <button
        onClick={() => goTo(currentPage + 1)}
        disabled={currentPage >= capped}
        className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  )
}
