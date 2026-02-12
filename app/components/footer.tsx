import React from 'react'

export default function Footer() {
  return (
    <footer className="py-8 border-t border-white/5 text-center">
      <p className="text-xs text-zinc-600 tracking-widest uppercase">
        &copy; {new Date().getFullYear()} Flotter — All Rights Reserved
      </p>
    </footer>
  )
}





