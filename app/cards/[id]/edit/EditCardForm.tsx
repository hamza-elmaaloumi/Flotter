"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUser } from '../../../providers/UserProvider'
import { 
  Plus, 
  Trash2, 
  Search, 
  Type, 
  ChevronLeft,
  Save,
  X 
} from 'lucide-react'

type CardShape = {
  id: string
  word: string
  imageUrl: string
  sentences: string[]
}

type UnsplashResult = {
  id: string
  urls: { small?: string; regular?: string }
}

export default function EditCardForm({ initialCard }: { initialCard: CardShape }) {
  const router = useRouter()
  const { user } = useUser()

  const [word, setWord] = useState(initialCard.word || '')
  const [imageUrl, setImageUrl] = useState(initialCard.imageUrl || '')
  const [sentences, setSentences] = useState<string[]>(initialCard.sentences || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UnsplashResult[]>([])
  const [imagesLoading, setImagesLoading] = useState(false)

  const updateSentence = (idx: number, value: string) => {
    setSentences((s) => s.map((r, i) => (i === idx ? value : r)))
  }

  const addSentence = () => setSentences((s) => [...s, ''])
  const removeSentence = (idx: number) => setSentences((s) => s.filter((_, i) => i !== idx))

  const searchImages = async () => {
    if (!query.trim()) return
    setImagesLoading(true)
    try {
      const res = await axios.get('/api/images/search', { params: { query } })
      setResults(res.data.results || [])
    } catch (err) {
      console.error('Image search failed')
    } finally {
      setImagesLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!word.trim()) {
      setError('Word is required')
      return
    }
    setLoading(true)
    try {
      const payload: any = {}
      if (word !== initialCard.word) payload.word = word
      if (imageUrl !== initialCard.imageUrl) payload.imageUrl = imageUrl
      if (JSON.stringify(sentences) !== JSON.stringify(initialCard.sentences)) payload.sentences = sentences

      await axios.patch(`/api/cards/${initialCard.id}`, payload)
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Failed to save changes')
    } finally {
      setLoading(false)
    }
  }

  const inputStyles = "w-full mt-1 p-3 md:p-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-[14px] md:text-[16px] outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
  const labelTextStyles = "text-zinc-500 text-[9px] md:text-[10px] uppercase font-bold tracking-[0.15em] ml-1"

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="bg-[#121212] border border-[#1C1C1E] rounded-[24px] md:rounded-[32px] p-5 md:p-8 shadow-2xl relative">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div>
            <button type="button" onClick={() => router.back()} className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors mb-1 md:mb-2 text-[10px] font-bold uppercase tracking-wider">
              <ChevronLeft size={12} /> Back
            </button>
            <h1 className="text-xl md:text-3xl font-black text-white">Edit Card</h1>
          </div>
          <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-500/10 rounded-[14px] md:rounded-2xl flex items-center justify-center border border-emerald-500/20">
             <Type className="text-emerald-500" size={20} />
          </div>
        </div>

        {/* INPUTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-5 md:mb-6">
          <label>
            <span className={labelTextStyles}>Word</span>
            <input value={word} onChange={(e) => setWord(e.target.value)} className={inputStyles} placeholder="Enter word..." />
          </label>
          <label>
            <span className={labelTextStyles}>Image URL</span>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputStyles} placeholder="https://..." />
          </label>
        </div>

        {/* SENTENCES */}
        <div className="mb-6 md:mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className={labelTextStyles}>Example Sentences</span>
            <button type="button" onClick={addSentence} className="text-emerald-400 text-[10px] md:text-[11px] font-black uppercase tracking-wider bg-emerald-400/10 px-2.5 py-1 md:px-3 md:py-1.5 rounded-full border border-emerald-400/20">
              <Plus size={12} className="inline mr-1" /> Add
            </button>
          </div>
          <div className="space-y-2 md:space-y-3">
            {sentences.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={s} onChange={(e) => updateSentence(idx, e.target.value)} className={inputStyles} placeholder="Context sentence..." />
                <button type="button" onClick={() => removeSentence(idx)} className="mt-1 p-3 rounded-xl bg-rose-500/5 text-rose-500 border border-rose-500/10 flex-shrink-0">
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* IMAGE SEARCH - Made more compact */}
        <div className="mb-6 md:mb-8 bg-white/[0.02] p-4 md:p-6 rounded-2xl border border-white/[0.05]">
          <span className={labelTextStyles}>Visual Search</span>
          <div className="flex gap-2 mt-2 mb-3">
            <input value={query} onChange={(e) => setQuery(e.target.value)} className={inputStyles + " mt-0"} placeholder="Search Unsplash..." />
            <button type="button" onClick={searchImages} disabled={imagesLoading} className="px-4 md:px-6 bg-blue-500 text-white- rounded-xl text-xs md:text-sm font-black">
              {imagesLoading ? '...' : 'Find'}
            </button>
          </div>
          <div className="grid grid-cols-4 md:grid-cols-5 gap-2 md:gap-3 max-h-[160px] overflow-y-auto pr-1">
            {results.map((r) => (
              <button key={r.id} type="button" onClick={() => setImageUrl(r.urls.regular || r.urls.small || '')} className="aspect-square rounded-lg md:rounded-xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all active:scale-95">
                <img src={r.urls.small} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-5 p-3 md:p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-[12px] md:text-sm font-bold flex items-center gap-2"><X size={14} /> {error}</div>}

        {/* ACTIONS */}
        <div className="flex flex-row gap-2 md:gap-3">
          <button type="submit" disabled={loading} className="flex-[2] py-3.5 md:py-4 bg-emerald-500 hover:bg-emerald-400 text-black text-sm md:text-base font-black rounded-xl md:rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
            {loading ? '...' : <><Save size={18} /> Save</>}
          </button>
          <button type="button" onClick={() => router.back()} className="flex-1 py-3.5 md:py-4 border border-white/10 text-white text-sm md:text-base font-bold rounded-xl md:rounded-2xl hover:bg-white/5 transition-all">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}