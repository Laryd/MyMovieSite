'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Film, Tv2 } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import { cn } from '@/lib/utils'

export default function Header() {
  const path = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-none" />
      <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 gap-4">

        {/* Logo + Nav */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center group-hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/40">
              <span className="text-white font-black text-base leading-none">S</span>
            </div>
            <span className="text-white font-bold text-xl tracking-tight hidden sm:block">Sprimio</span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link
              href="/movies"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                path.startsWith('/movies')
                  ? 'bg-violet-600/25 text-violet-300 border border-violet-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/6'
              )}
            >
              <Film className="w-3.5 h-3.5" />
              Movies
            </Link>
            <Link
              href="/tv"
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                path.startsWith('/tv')
                  ? 'bg-violet-600/25 text-violet-300 border border-violet-600/30'
                  : 'text-zinc-400 hover:text-white hover:bg-white/6'
              )}
            >
              <Tv2 className="w-3.5 h-3.5" />
              TV Shows
            </Link>
          </nav>
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          <SearchBar />
          <Link
            href="#"
            className="hidden sm:block text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 px-4 py-1.5 rounded-full transition-colors shadow-md shadow-violet-900/30"
          >
            Sign In
          </Link>
        </div>

      </div>
    </header>
  )
}
