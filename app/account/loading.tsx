export default function AccountLoading() {
  return (
    <div className="min-h-screen pb-20 pt-28 px-4 sm:px-6 lg:px-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="h-9 w-40 bg-zinc-800 rounded-xl animate-pulse" />
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl p-6 space-y-4">
            <div className="h-5 w-32 bg-zinc-800 rounded-lg animate-pulse" />
            <div className="h-16 bg-zinc-800/60 rounded-xl animate-pulse" />
            <div className="h-10 w-40 bg-zinc-800 rounded-xl animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
