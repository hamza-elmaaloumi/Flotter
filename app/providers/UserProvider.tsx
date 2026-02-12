"use client"

import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
  id: string
  email: string
}

type UserContextValue = {
  user: User | null
  setUser: (u: User | null) => void
  update: (u: Partial<User>) => void
  clear: () => void
}

const KEY = 'floter_user'

const UserContext = createContext<UserContextValue | undefined>(undefined)

export default function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) {
        const parsed = JSON.parse(raw)
        setUserState(parsed)
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [])

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(KEY, JSON.stringify(user))
      } else {
        localStorage.removeItem(KEY)
      }
    } catch (e) {
      // ignore storage errors
    }
  }, [user])

  const setUser = (u: User | null) => setUserState(u)

  const update = (u: Partial<User>) => setUserState(prev => (prev ? { ...prev, ...u } : null))

  const clear = () => setUserState(null)

  return (
    <UserContext.Provider value={{ user, setUser, update, clear }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be used within UserProvider')
  return ctx
}
