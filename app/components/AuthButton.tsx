'use client'
import { useState, useRef, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AuthButton() {
  const { data: session, status } = useSession()

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

  return <div className="w-8 h-8 rounded-full bg-violet-600/30 border border-violet-600/40 flex items-center justify-center text-sm font-bold text-violet-300" />
}
