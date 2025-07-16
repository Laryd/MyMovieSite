import { SkeletonGrid } from '../components/SkeletonCard'

export default function SearchLoading() {
  return (
    <div className="pt-28 px-4 sm:px-6 lg:px-10 pb-16">
      <div className="h-8 w-64 bg-zinc-800 rounded-full animate-pulse mb-2" />
      <div className="h-4 w-32 bg-zinc-800/60 rounded-full animate-pulse mb-8" />
      <SkeletonGrid count={12} />
    </div>
  )
}
