'use client'
import Link from 'next/link'
import { AlertCircle, RotateCcw } from 'lucide-react'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorPage({ error, reset }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-red-900/20 border border-red-800/30 flex items-center justify-center mb-6">
        <AlertCircle className="w-8 h-8 text-red-400" />
      </div>
      <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
      <p className="text-zinc-500 text-sm mb-2 max-w-sm">
        {error.message?.includes('TMDB')
          ? 'Failed to load data. Check your TMDB API key in .env.local'
          : 'An unexpected error occurred. Please try again.'}
      </p>
      {error.digest && (
        <p className="text-zinc-700 text-xs mb-6">Error: {error.digest}</p>
      )}
      <div className="flex gap-3 mt-4">
        <button
          onClick={reset}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          Try Again
        </button>
        <Link
          href="/"
          className="px-6 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
