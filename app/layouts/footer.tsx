import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 mt-20 py-10 px-4 sm:px-6 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-md bg-violet-600 flex items-center justify-center group-hover:bg-violet-500 transition-colors">
              <span className="text-white font-black text-sm leading-none">S</span>
            </div>
            <span className="text-white font-bold text-lg">Sprimio</span>
          </Link>

          {/* Nav */}
          <nav className="flex items-center gap-6 text-sm text-zinc-500">
            <Link href="/movies" className="hover:text-white transition-colors">Movies</Link>
            <Link href="/tv" className="hover:text-white transition-colors">TV Shows</Link>
            <Link href="/search" className="hover:text-white transition-colors">Search</Link>
          </nav>

          {/* Credit */}
          <p className="text-xs text-zinc-700">
            Data by{' '}
            <a
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-violet-400 transition-colors"
            >
              TMDB
            </a>
          </p>
        </div>

        <p className="text-center text-xs text-zinc-800 mt-8">
          © {new Date().getFullYear()} Sprimio. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
