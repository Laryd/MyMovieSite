'use client'
import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Star, Tv2, Film } from 'lucide-react'
import Image from 'next/image'
import { IMG } from '@/app/lib/tmdb'

interface Suggestion {
  id: number
  media_type: 'movie' | 'tv'
  title?: string
  name?: string
  poster_path: string | null
  vote_average?: number
  release_date?: string
  first_air_date?: string
}

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setQuery(''); setSuggestions([]) }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Click outside to close
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setFocused(false)
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const fetchSuggestions = useCallback(async (q: string) => {
    if (q.length < 2) { setSuggestions([]); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
      const data = await res.json()
      setSuggestions(data.results ?? [])
    } catch {
      setSuggestions([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => fetchSuggestions(query), 300)
    return () => clearTimeout(timer)
  }, [query, fetchSuggestions])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false); setQuery(''); setSuggestions([])
    }
  }

  const pick = (s: Suggestion) => {
    const href = `/${s.media_type === 'tv' ? 'tv' : 'movies'}/${s.id}`
    router.push(href)
    setOpen(false); setQuery(''); setSuggestions([])
  }

  const showDropdown = focused && suggestions.length > 0

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/8"
        aria-label="Search (⌘K)"
      >
        <Search className="w-5 h-5" />
      </button>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <form
        onSubmit={submit}
        className="flex items-center gap-2 bg-zinc-900/95 backdrop-blur-md border border-zinc-700/60 rounded-full px-4 py-2"
      >
        <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          placeholder="Movies, shows, people..."
          className="bg-transparent text-white text-sm placeholder:text-zinc-500 outline-none w-44 sm:w-64"
        />
        {loading && (
          <div className="w-3.5 h-3.5 border-2 border-zinc-600 border-t-violet-500 rounded-full animate-spin flex-shrink-0" />
        )}
        <button
          type="button"
          onClick={() => { setOpen(false); setQuery(''); setSuggestions([]) }}
          className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </form>

      {/* Dropdown */}
      {showDropdown && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-zinc-900 border border-zinc-800/80 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden z-50">
          {suggestions.map(s => {
            const title = s.title || s.name || ''
            const year = (s.release_date || s.first_air_date)
              ? new Date((s.release_date || s.first_air_date)!).getFullYear()
              : null
            const posterUrl = s.poster_path ? `${IMG}/w92${s.poster_path}` : null

            return (
              <button
                key={`${s.media_type}-${s.id}`}
                onClick={() => pick(s)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-zinc-800/60 transition-colors text-left group"
              >
                <div className="w-8 h-12 rounded-lg overflow-hidden bg-zinc-800 flex-shrink-0">
                  {posterUrl ? (
                    <Image src={posterUrl} alt={title} width={32} height={48} className="object-cover w-full h-full" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">
                      {s.media_type === 'tv' ? '📺' : '🎬'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200 truncate group-hover:text-violet-300 transition-colors">
                    {title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {s.media_type === 'tv' ? (
                      <Tv2 className="w-3 h-3 text-zinc-600" />
                    ) : (
                      <Film className="w-3 h-3 text-zinc-600" />
                    )}
                    <span className="text-xs text-zinc-500 capitalize">{s.media_type === 'tv' ? 'Series' : 'Film'}</span>
                    {year && <span className="text-xs text-zinc-600">· {year}</span>}
                  </div>
                </div>
                {s.vote_average && s.vote_average > 0 && (
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                    <span className="text-xs text-zinc-400">{s.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </button>
            )
          })}
          <button
            onClick={submit as unknown as React.MouseEventHandler}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border-t border-zinc-800/60 text-sm text-violet-400 hover:text-violet-300 hover:bg-zinc-800/40 transition-colors"
          >
            <Search className="w-3.5 h-3.5" />
            See all results for "{query}"
          </button>
        </div>
      )}
    </div>
  )
}
