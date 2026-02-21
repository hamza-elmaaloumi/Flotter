"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Theme = 'dark' | 'light'

type ThemeContextValue = {
  theme: Theme
  setTheme: (theme: Theme) => void
  isDark: boolean
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

// CSS variable mapping for dark and light themes
const themeTokens: Record<Theme, Record<string, string>> = {
  dark: {
    '--bg-primary': '#121212',
    '--bg-secondary': '#1C1C1E',
    '--bg-tertiary': '#222222',
    '--bg-elevated': '#1e1e1e',
    '--border-primary': '#2D2D2F',
    '--border-secondary': '#262626',
    '--text-primary': '#FFFFFF',
    '--text-secondary': '#9CA3AF',
    '--text-tertiary': '#6B7280',
    '--text-quaternary': '#48484A',
    '--accent-blue': '#3B82F6',
    '--accent-red': '#EF4444',
    '--accent-green': '#10B981',
    '--accent-yellow': '#FACC15',
    '--accent-teal': '#34D399',
    '--overlay': 'rgba(0, 0, 0, 0.7)',
    '--card-shadow': '0 4px 20px rgba(0,0,0,0.3)',
  },
  light: {
    '--bg-primary': '#F8F9FA',
    '--bg-secondary': '#FFFFFF',
    '--bg-tertiary': '#F0F1F3',
    '--bg-elevated': '#FFFFFF',
    '--border-primary': '#E2E4E9',
    '--border-secondary': '#EBEDF0',
    '--text-primary': '#111827',
    '--text-secondary': '#4B5563',
    '--text-tertiary': '#6B7280',
    '--text-quaternary': '#9CA3AF',
    '--accent-blue': '#2563EB',
    '--accent-red': '#DC2626',
    '--accent-green': '#059669',
    '--accent-yellow': '#D97706',
    '--accent-teal': '#0D9488',
    '--overlay': 'rgba(0, 0, 0, 0.4)',
    '--card-shadow': '0 4px 20px rgba(0,0,0,0.06)',
  },
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('dark')

  useEffect(() => {
    const saved = localStorage.getItem('flotter-theme') as Theme | null
    if (saved === 'light') setThemeState('light')
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const tokens = themeTokens[theme]
    Object.entries(tokens).forEach(([key, value]) => {
      root.style.setProperty(key, value)
    })
    // Also set data attribute for CSS selectors
    root.setAttribute('data-theme', theme)

    if (theme === 'light') {
      document.body.classList.add('theme-light')
      document.body.classList.remove('theme-dark')
    } else {
      document.body.classList.add('theme-dark')
      document.body.classList.remove('theme-light')
    }
  }, [theme])

  const setTheme = (t: Theme) => {
    setThemeState(t)
    localStorage.setItem('flotter-theme', t)
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark: theme === 'dark' }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
