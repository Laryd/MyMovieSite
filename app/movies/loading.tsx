import { SkeletonGrid } from '../components/SkeletonCard'

export default function MoviesLoading() {
  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="flex justify-between items-center mb-8">
        <div className="h-8 w-24 bg-zinc-800 rounded-full animate-pulse" />
        <div className="flex gap-2">
          <div className="h-8 w-20 bg-zinc-800 rounded-full animate-pulse" />
          <div className="h-8 w-24 bg-zinc-800 rounded-full animate-pulse" />
        </div>
      </div>
      <div className="flex gap-2 mb-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 w-16 bg-zinc-800 rounded-full animate-pulse flex-shrink-0" />
        ))}
      </div>
      <SkeletonGrid count={18} />
    </div>
  )
}
