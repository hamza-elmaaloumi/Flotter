"use client"
import Link from 'next/link'
import { useUser } from '../providers/UserProvider'

export default function Header() {
  const { user } = useUser()

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] border-b border-white/5 bg-[#09090b]/60 backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className="text-white font-bold tracking-tighter text-xl hover:opacity-80 transition-opacity"
          >
            PLATFORM
          </Link>

          {user && (
            <>
              <div className="flex items-center gap-6">
                <Link
                  href="/cards/deck"
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  Deck
                </Link>
              </div>
              <div className="flex items-center gap-6">
                <Link
                  href="/cards/new"
                  className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
                >
                  add
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <Link
              href="/logout"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2"
            >
              Log Out
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors px-4 py-2"
              >
                Sign In
              </Link>

              <Link
                href="/register"
                className="text-sm font-medium bg-zinc-100 text-black hover:bg-white transition-colors px-5 py-2 rounded-full"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
