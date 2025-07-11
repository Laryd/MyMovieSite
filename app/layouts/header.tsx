'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Film, Tv2, Bookmark, Menu, X } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/movies', label: 'Movies', icon: Film },
  { href: '/tv', label: 'TV Shows', icon: Tv2 },
  { href: '/watchlist', label: 'Watchlist', icon: Bookmark },
]

export default function Header() {
  const path = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [path])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'bg-zinc-950/95 backdrop-blur-md border-b border-zinc-800/60' : ''
        )}
      >
        {!scrolled && (
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-transparent pointer-events-none" />
        )}

        <div className="relative flex items-center justify-between px-4 sm:px-6 lg:px-10 py-4 gap-4">
          {/* Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center group-hover:bg-violet-500 transition-colors shadow-lg shadow-violet-900/40">
                <span className="text-white font-black text-base leading-none">S</span>
              </div>
              <span className="text-white font-bold text-xl tracking-tight hidden sm:block">Sprimio</span>
            </Link>

            {/* Desktop nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                    path.startsWith(href)
                      ? 'bg-violet-600/25 text-violet-300 border border-violet-600/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/6'
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              ))}
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
            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/8"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={cn(
          'fixed inset-0 z-40 md:hidden transition-all duration-300',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className={cn(
            'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300',
            mobileOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={() => setMobileOpen(false)}
        />
        {/* Panel */}
        <div
          className={cn(
            'absolute top-0 right-0 h-full w-72 bg-zinc-950 border-l border-zinc-800/60 p-6 pt-24 transition-transform duration-300 shadow-2xl',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <nav className="flex flex-col gap-2">
            {navLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                  path.startsWith(href)
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-600/20'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800/60'
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-zinc-800/60">
              <Link
                href="#"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold transition-colors"
              >
                Sign In
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </>
  )
}
