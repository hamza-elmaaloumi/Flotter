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
      // NOTE: We no longer send userId. The API route identifies the user via the session.
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

  const inputStyles = "w-full mt-1.5 p-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500/50 transition-all placeholder:text-zinc-600"
  const labelTextStyles = "text-zinc-500 text-[10px] uppercase font-bold tracking-[0.15em] ml-1"

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-[#121212] border border-[#3A3A3C] rounded-[32px] p-8 shadow-2xl relative">
        <div className="flex items-center justify-between mb-8">
          <div>
            <button type="button" onClick={() => router.back()} className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors mb-2 text-xs font-bold uppercase">
              <ChevronLeft size={14} /> Back
            </button>
            <h1 className="text-3xl font-black text-white">Edit Card</h1>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
             <Type className="text-emerald-500" size={24} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <label>
            <span className={labelTextStyles}>Word</span>
            <input value={word} onChange={(e) => setWord(e.target.value)} className={inputStyles} />
          </label>
          <label>
            <span className={labelTextStyles}>Image URL</span>
            <input value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} className={inputStyles} />
          </label>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className={labelTextStyles}>Example Sentences</span>
            <button type="button" onClick={addSentence} className="text-emerald-400 text-[11px] font-black uppercase tracking-wider bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20">
              <Plus size={14} className="inline mr-1" /> Add Line
            </button>
          </div>
          <div className="space-y-3">
            {sentences.map((s, idx) => (
              <div key={idx} className="flex gap-2">
                <input value={s} onChange={(e) => updateSentence(idx, e.target.value)} className={inputStyles} />
                <button type="button" onClick={() => removeSentence(idx)} className="mt-1.5 p-3.5 rounded-xl bg-rose-500/5 text-rose-500 border border-rose-500/10">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-8 bg-white/5 p-6 rounded-2xl">
          <span className={labelTextStyles}>Search for Image</span>
          <div className="flex gap-2 mt-2 mb-4">
            <input value={query} onChange={(e) => setQuery(e.target.value)} className={inputStyles + " mt-0"} placeholder="Find a visual..." />
            <button type="button" onClick={searchImages} disabled={imagesLoading} className="px-6 bg-white text-black rounded-xl font-black">
              {imagesLoading ? '...' : 'Search'}
            </button>
          </div>
          <div className="grid grid-cols-5 gap-3">
            {results.map((r) => (
              <button key={r.id} type="button" onClick={() => setImageUrl(r.urls.regular || r.urls.small || '')} className="aspect-square rounded-xl overflow-hidden border-2 border-transparent hover:border-emerald-500 transition-all">
                <img src={r.urls.small} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {error && <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-bold flex items-center gap-2"><X size={16} /> {error}</div>}

        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl flex items-center justify-center gap-2">
            {loading ? 'Updating...' : <><Save size={20} /> Save Changes</>}
          </button>
          <button type="button" onClick={() => router.back()} className="px-8 py-4 border border-white/10 text-white font-bold rounded-2xl">Cancel</button>
        </div>
      </form>
    </div>
  )
}