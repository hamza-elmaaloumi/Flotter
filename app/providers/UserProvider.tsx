"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signOut } from "next-auth/react"
import axios from "axios"

type User = {
  id: string
  email: string
  name?: string | null
  image?: string | null
  totalXp?: number
  monthlyXp?: number
  streakCount?: number
  rank?: number
}

type UserContextValue = {
  user: User | null
  isLoading: boolean
  logout: () => void
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async () => {
    try {
      const resp = await axios.get('/api/profile')
      if (resp.data.user) {
        setUser({
          ...resp.data.user,
          rank: resp.data.rank
        })
      }
    } catch (err) {
      console.error('Failed to fetch profile', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      // Initially seed from session
      setUser(prev => prev || {
        id: (session.user as any).id,
        email: session.user.email!,
        name: session.user.name,
        image: session.user.image,
      })
      // Then fetch full profile for extra details (XP, Rank, better Image handling)
      fetchProfile()
    } else if (status === "unauthenticated") {
      setUser(null)
      setLoading(false)
    } else if (status === "loading") {
      setLoading(true)
    }
  }, [session, status])

  const logout = async () => {
    await signOut({ callbackUrl: '/' })
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ 
      user, 
      isLoading: status === "loading" || (status === "authenticated" && loading && !user), 
      logout,
      refreshUser: fetchProfile
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}