'use client'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X } from 'lucide-react'

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); setQuery('') }
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); setOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
      setQuery('')
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-white/8"
        aria-label="Search"
      >
        <Search className="w-5 h-5" />
      </button>
    )
  }

  return (
    <form
      onSubmit={submit}
      className="flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md border border-zinc-700/60 rounded-full px-4 py-2"
    >
      <Search className="w-4 h-4 text-zinc-400 flex-shrink-0" />
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search movies, shows..."
        className="bg-transparent text-white text-sm placeholder:text-zinc-500 outline-none w-44 sm:w-60"
      />
      <button
        type="button"
        onClick={() => { setOpen(false); setQuery('') }}
        className="text-zinc-500 hover:text-white transition-colors flex-shrink-0"
      >
        <X className="w-4 h-4" />
      </button>
    </form>
  )
}
