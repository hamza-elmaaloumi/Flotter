"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'

export default function NewCardPage() {
  const { user } = useUser()
  const userId = user?.id ?? ''
  const [word, setWord] = useState('')
  const [sentences, setSentences] = useState(['', '', ''])
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function searchImages() {
    if (!query) return
    setLoading(true)
    setMsg('')
    try {
      const res = await axios.get('/api/images/search', { params: { query } })
      const data = res.data
      setResults(data.results || data.results || data || [])
    } catch (err) {
      console.error('Unsplash error', err)
      setMsg('Search error')
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  function updateSentence(idx: number, value: string) {
    const copy = [...sentences]
    copy[idx] = value
    setSentences(copy)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')

    // --- STRICT LOGIC UPDATE ---
    const isWordEmpty = !word.trim()
    const areSentencesIncomplete = sentences.some(s => !s.trim())
    const isImageMissing = !selected

    if (isWordEmpty || areSentencesIncomplete || isImageMissing) {
      if (isWordEmpty) setMsg('Word field is required.')
      else if (areSentencesIncomplete) setMsg('All three sentences are required.')
      else if (isImageMissing) setMsg('Please search and select an image.')
      return // Stop execution
    }
    // ---------------------------

    setSaving(true)
    try {
      const imageUrl = selected?.urls?.regular || selected?.urls?.small || ''
      const payload = { userId, word, sentences, imageUrl }

      const res = await axios.post('/api/cards', payload)
      const data = res.data
      
      if (!res || res.status >= 400) {
        setMsg(data?.error || 'Save failed')
      } else {
        setMsg('Card saved successfully')
        // Reset form
        setWord('')
        setSentences(['', '', ''])
        setSelected(null)
        setResults([])
        setQuery('')
      }
    } catch (err) {
      console.error('Save error', err)
      setMsg('Internal server error during save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#050505] text-zinc-200 py-12 px-6 selection:bg-emerald-500/30">
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative">
        <header className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-white mb-2">Create New Card</h1>
          <p className="text-zinc-500 text-sm uppercase tracking-widest font-medium">Knowledge Management System</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500 ml-1">The Word</label>
                <input 
                  value={word} 
                  onChange={e => setWord(e.target.value)} 
                  placeholder="e.g. Ephemeral"
                  className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500 ml-1">Contextual Sentences</label>
                {sentences.map((s, i) => (
                  <textarea
                    key={i}
                    value={s}
                    onChange={e => updateSentence(i, e.target.value)}
                    rows={2}
                    placeholder={`Context sentence ${i + 1}`}
                    className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 transition-all resize-none"
                  />
                ))}
              </div>
            </section>

            <div className="space-y-4">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-50 active:scale-[0.98]"
              >
                {saving ? 'PROCESSING...' : 'SAVE TO COLLECTION'}
              </button>
              
              {msg && (
                <div className={`p-4 rounded-xl border text-center text-sm font-medium animate-in fade-in slide-in-from-top-2 duration-300 ${
                  msg.includes('successfully') 
                  ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                  : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {msg}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/40 border border-zinc-800 p-6 rounded-2xl backdrop-blur-sm">
              <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-emerald-500 block mb-4">Visual Identity</label>
              
              <div className="flex gap-2 mb-6">
                <input 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Search imagery..."
                  className="flex-1 bg-zinc-950/50 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
                <button 
                  type="button" 
                  onClick={searchImages} 
                  disabled={loading}
                  className="bg-zinc-100 text-black px-4 py-2 rounded-lg text-xs font-bold hover:bg-white transition-colors"
                >
                  {loading ? '...' : 'FIND'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
                {results.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`relative aspect-square cursor-pointer rounded-lg overflow-hidden transition-all duration-300 ${
                      selected?.id === r.id ? 'ring-2 ring-emerald-500 scale-[0.95]' : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={r.urls.thumb} className="w-full h-full object-cover" alt="Search result" />
                  </div>
                ))}
              </div>

              {selected && (
                <div className="mt-6 animate-in fade-in zoom-in duration-300">
                  <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mb-2 text-center">Selection Confirmed</p>
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-emerald-500/30 shadow-2xl">
                    <img src={selected.urls.small} className="w-full h-full object-cover" alt="Selected" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
      `}</style>
    </main>
  )
}