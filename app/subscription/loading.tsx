export default function SubscriptionLoading() {
  return (
    <div className="min-h-screen pb-20 pt-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14 space-y-3">
          <div className="h-12 w-64 bg-zinc-800 rounded-2xl animate-pulse mx-auto" />
          <div className="h-5 w-80 bg-zinc-800 rounded-lg animate-pulse mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-6 space-y-4">
              <div className="h-10 w-10 bg-zinc-800 rounded-xl animate-pulse" />
              <div className="h-6 w-20 bg-zinc-800 rounded-lg animate-pulse" />
              <div className="h-12 w-28 bg-zinc-800 rounded-xl animate-pulse" />
              <div className="space-y-2">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="h-4 bg-zinc-800 rounded animate-pulse" />
                ))}
              </div>
              <div className="h-10 bg-zinc-800 rounded-xl animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
