"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import { Plus, Search, Check, ChevronLeft, Loader2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NewCardPage() {
  const { user } = useUser()
  const router = useRouter()
  
  // State
  const [word, setWord] = useState('')
  const [sentences, setSentences] = useState(['']) 
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  
  // UI States
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  // Sentence Handlers
  const addSentence = () => setSentences([...sentences, ''])
  const removeSentence = (index: number) => {
    if (sentences.length === 1) {
      setSentences(['']) 
      return
    }
    setSentences(sentences.filter((_, i) => i !== index))
  }
  const updateSentence = (index: number, val: string) => {
    const copy = [...sentences]
    copy[index] = val
    setSentences(copy)
  }

  async function searchImages() {
    if (!query) return
    setLoading(true)
    try {
      const res = await axios.get('/api/images/search', { params: { query } })
      setResults(res.data.results || [])
    } catch (err) {
      setMsg('Search error')
    } finally { setLoading(false) }
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    
    const cleanSentences = sentences.filter(s => s.trim() !== '')
    if (!word.trim() || cleanSentences.length === 0 || !selected) {
      setMsg('Incomplete fields')
      return 
    }

    setSaving(true)
    try {
      // Use 'regular' or 'small' for better quality than thumb
      const imageUrl = selected?.urls?.regular || selected?.urls?.small || ''
      await axios.post('/api/cards', { word, sentences: cleanSentences, imageUrl })
      setMsg('Success')
      setTimeout(() => router.push('/'), 1000)
    } catch (err) {
      setMsg('Save failed')
    } finally { setSaving(false) }
  }

  const inputBase = "w-full bg-zinc-900/40 border border-white/[0.06] rounded-md px-3 py-2 text-[13px] text-white placeholder:text-zinc-600 outline-none focus:border-green-500/50 transition-all"
  const labelBase = "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 block font-medium"

  return (
    <div className="min-h-screen bg-black text-zinc-300 antialiased pb-24">
      {/* Sticky Header */}
      <div className="sticky top-0 z-20 bg-black/80 backdrop-blur-md border-b border-white/[0.05] px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">New Card</span>
        <button 
          onClick={() => handleSubmit()} 
          disabled={saving}
          className="text-green-500 text-[13px] font-semibold active:opacity-50 disabled:opacity-30"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : 'Create'}
        </button>
      </div>

      <main className="max-w-4xl mx-auto p-4 lg:grid lg:grid-cols-12 lg:gap-8">
        
        {/* Left Side: Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <section>
            <label className={labelBase}>Word</label>
            <input 
              value={word} 
              onChange={e => setWord(e.target.value)} 
              placeholder="e.g. Ephemeral" 
              className={inputBase + " text-[15px] font-medium py-2.5"} 
            />
          </section>

          <section>
            <div className="flex justify-between items-center mb-1.5">
              <label className={labelBase + " mb-0"}>Context Sentences</label>
              <button 
                type="button" 
                onClick={addSentence}
                className="text-[10px] text-blue-500 font-bold uppercase flex items-center gap-1 hover:text-blue-400"
              >
                <Plus size={10} /> Add Another
              </button>
            </div>
            <div className="space-y-2">
              {sentences.map((s, i) => (
                <div key={i} className="group relative flex items-start gap-2">
                  <textarea 
                    value={s} 
                    onChange={e => updateSentence(i, e.target.value)} 
                    placeholder={`Sentence ${i + 1}...`}
                    rows={2} 
                    className={inputBase + " resize-none pr-8"} 
                  />
                  <button 
                    type="button" 
                    onClick={() => removeSentence(i)}
                    className="absolute right-2 top-2 text-zinc-700 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Image Library */}
        <div className="lg:col-span-5 mt-8 lg:mt-0 pt-8 lg:pt-0 border-t lg:border-t-0 border-white/[0.05]">
          <label className={labelBase}>Visual Search</label>
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && searchImages()}
                className={inputBase + " pl-8 h-8"} 
                placeholder="Find imagery..." 
              />
            </div>
            <button 
              type="button" 
              onClick={searchImages} 
              disabled={loading}
              className="px-3 h-8 bg-zinc-800 text-[11px] font-bold rounded-md hover:bg-zinc-700 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Grid Results */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 max-h-48 overflow-y-auto pr-1 mb-4 border border-white/[0.05] rounded-lg p-1.5 bg-zinc-900/20 scrollbar-hide">
            {results.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r)}
                className={`relative w-full rounded-sm overflow-hidden border transition-all ${selected?.id === r.id ? 'border-green-500 ring-1 ring-green-500' : 'border-transparent hover:border-zinc-700'}`}
              >
                {/* FIX 1: Changed pt-[100%] to aspect-square and img to object-cover.
                   This makes tiles identical sizes but fills them completely.
                   If you strictly want NO cropping in grid, change object-cover to object-contain. 
                */}
                <div className="aspect-square relative bg-zinc-900">
                  <img 
                    src={r.urls.small} // Used 'small' instead of 'thumb' for slightly better resolution
                    alt={r.alt_description || "image"} 
                    className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity ${selected?.id === r.id ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`} 
                  />
                </div>
                {selected?.id === r.id && (
                  <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
                    <Check size={14} className="text-white drop-shadow-md" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Selected Preview */}
          {selected && (
            // FIX 2: Removed aspect-[16/9] to stop cropping the selected image
            // Added min-h-[100px] to prevent collapse
            <div className="relative w-full rounded-md overflow-hidden border border-white/[0.1] animate-in fade-in bg-zinc-900">
              <img 
                src={selected.urls.regular} 
                alt="Preview" 
                // Removed absolute positioning and h-full so image dictates height naturally
                className="block w-full h-auto object-contain opacity-90" 
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-3 pt-8">
                <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Selected Reference</span>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-12 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
        <div className="max-w-xl mx-auto pointer-events-auto">
          <button 
            onClick={() => handleSubmit()}
            disabled={saving}
            className="w-full bg-white text-black h-12 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 hover:bg-zinc-200"
          >
            {saving ? <Loader2 size={16} className="animate-spin" /> : <><Plus size={16} /> Save New Card</>}
          </button>
        </div>
      </div>

      {msg && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50">
           <div className="px-4 py-1.5 bg-zinc-900 border border-white/10 rounded-full text-[11px] font-bold text-white shadow-lg">
              {msg}
           </div>
        </div>
      )}
    </div>
  )
}