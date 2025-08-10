'use client'
import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User, LogOut, CreditCard, ChevronDown } from 'lucide-react'

export default function AuthButton() {
  const { data: session, status } = useSession()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  if (status === 'loading') {
    return <div className="w-8 h-8 rounded-full bg-zinc-800 animate-pulse" />
  }

  if (!session) {
    return (
      <div className="hidden sm:flex items-center gap-2">
        <Link
          href="/auth/login"
          className="text-sm font-semibold text-zinc-300 hover:text-white transition-colors px-3 py-1.5"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 px-4 py-1.5 rounded-full transition-colors shadow-md shadow-violet-900/30"
        >
          Sign Up
        </Link>
      </div>
    )
  }

  const initials = session.user?.name?.[0]?.toUpperCase() ?? session.user?.email?.[0]?.toUpperCase() ?? 'U'

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 group"
      >
        <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-600/40 flex items-center justify-center text-sm font-bold text-violet-300 group-hover:bg-violet-600/40 transition-colors">
          {initials}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform hidden sm:block ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-zinc-900 border border-zinc-700/60 rounded-2xl shadow-2xl overflow-hidden z-50">
          <div className="px-4 py-3 border-b border-zinc-800/60">
            <p className="text-white font-semibold text-sm truncate">{session.user?.name ?? 'User'}</p>
            <p className="text-zinc-500 text-xs truncate">{session.user?.email}</p>
          </div>
          <div className="p-1.5">
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              <User className="w-4 h-4" />
              My Account
            </Link>
            <Link
              href="/subscription"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              <CreditCard className="w-4 h-4" />
              Subscription
            </Link>
            <button
              onClick={() => { setOpen(false); signOut({ callbackUrl: '/' }) }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-zinc-800/60 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
