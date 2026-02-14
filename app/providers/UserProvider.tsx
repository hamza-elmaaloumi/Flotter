"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useSession, signOut } from "next-auth/react"

type User = {
  id: string
  email: string
  name?: string | null
  image?: string | null
}

type UserContextValue = {
  user: User | null
  isLoading: boolean
  logout: () => void
}

const UserContext = createContext<UserContextValue | undefined>(undefined)

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      setUser({
        id: (session.user as any).id, // Ensure ID is passed in auth options callback
        email: session.user.email!,
        name: session.user.name,
        image: session.user.image,
      })
    } else if (status === "unauthenticated") {
      setUser(null)
    }
  }, [session, status])

  const logout = async () => {
    await signOut({ callbackUrl: '/' })
    setUser(null)
  }

  return (
    <UserContext.Provider value={{ user, isLoading: status === "loading", logout }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}