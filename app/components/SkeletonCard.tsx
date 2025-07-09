import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export function SkeletonCard({ className }: Props) {
  return (
    <div className={cn('flex-shrink-0 w-36 sm:w-40 md:w-44', className)}>
      <div className="aspect-[2/3] rounded-xl bg-zinc-800/80 animate-pulse" />
      <div className="mt-2 h-3.5 bg-zinc-800 rounded-full animate-pulse w-4/5" />
      <div className="mt-1.5 h-3 bg-zinc-800/60 rounded-full animate-pulse w-1/3" />
    </div>
  )
}

export function SkeletonRow() {
  return (
    <section className="px-4 sm:px-6 lg:px-10">
      <div className="h-6 w-48 bg-zinc-800 rounded-full animate-pulse mb-4" />
      <div className="flex gap-3 overflow-hidden pb-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </section>
  )
}

export function SkeletonHero() {
  return (
    <div className="w-full h-[80vh] min-h-[560px] bg-zinc-900 animate-pulse">
      <div className="absolute inset-0 flex items-end pb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-2xl w-full space-y-4">
          <div className="h-5 w-24 bg-zinc-800 rounded-full" />
          <div className="h-14 w-3/4 bg-zinc-800 rounded-xl" />
          <div className="h-4 w-full bg-zinc-800 rounded-full" />
          <div className="h-4 w-2/3 bg-zinc-800 rounded-full" />
          <div className="flex gap-3 pt-2">
            <div className="h-11 w-32 bg-zinc-800 rounded-full" />
            <div className="h-11 w-32 bg-zinc-800 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  )
}

export function SkeletonGrid({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="aspect-[2/3] rounded-xl bg-zinc-800/80 animate-pulse" />
          <div className="mt-2 h-3.5 bg-zinc-800 rounded-full animate-pulse w-4/5" />
          <div className="mt-1.5 h-3 bg-zinc-800/60 rounded-full animate-pulse w-1/3" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonDetail() {
  return (
    <div className="min-h-screen pb-16">
      <div className="h-[55vh] min-h-[380px] bg-zinc-900 animate-pulse" />
      <div className="px-4 sm:px-6 lg:px-10 -mt-40 relative">
        <div className="flex flex-col sm:flex-row gap-8">
          <div className="w-36 sm:w-52 aspect-[2/3] rounded-2xl bg-zinc-800 animate-pulse flex-shrink-0" />
          <div className="flex-1 pt-2 space-y-4">
            <div className="flex gap-2">
              {[1, 2, 3].map(i => <div key={i} className="h-6 w-16 bg-zinc-800 rounded-full animate-pulse" />)}
            </div>
            <div className="h-10 w-3/4 bg-zinc-800 rounded-xl animate-pulse" />
            <div className="h-4 w-full bg-zinc-800 rounded-full animate-pulse" />
            <div className="h-4 w-5/6 bg-zinc-800 rounded-full animate-pulse" />
            <div className="h-4 w-4/6 bg-zinc-800 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
