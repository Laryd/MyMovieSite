import Link from 'next/link'
import { Film } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-20 h-20 rounded-2xl bg-violet-600/20 border border-violet-600/30 flex items-center justify-center mb-6">
        <Film className="w-10 h-10 text-violet-400" />
      </div>
      <h1 className="text-7xl font-black text-white mb-3">404</h1>
      <p className="text-xl font-semibold text-zinc-300 mb-2">Page Not Found</p>
      <p className="text-zinc-500 text-sm mb-8 max-w-sm">
        The page you're looking for doesn't exist. Maybe it was moved or the URL is wrong.
      </p>
      <div className="flex gap-3">
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/movies"
          className="px-6 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors"
        >
          Browse Movies
        </Link>
      </div>
    </div>
  )
}
