"use client"

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUser } from '../../../providers/UserProvider'
import { 
  Plus, 
  Trash2, 
  Search, 
  ChevronLeft,
  Save,
  Image as ImageIcon,
  Loader2
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
    if (!word.trim()) return setError('Word is required')
    
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
      setError(err?.response?.data?.error || 'Failed to save')
    } finally {
      setLoading(false)
    }
  }

  // Minimal UI Utility Styles
  const inputBase = "w-full bg-zinc-900/50 border border-white/[0.06] rounded-md px-3 py-2 text-[13px] text-white placeholder:text-zinc-600 outline-none focus:border-blue-500/50 transition-all"
  const labelBase = "text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5 block font-medium"

  return (
    <div className="min-h-screen bg-black text-zinc-300 antialiased pb-20">
      {/* Top Nav - Flush & Thin */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md border-b border-white/[0.05] px-4 py-3 flex items-center justify-between">
        <button onClick={() => router.back()} className="p-1 -ml-1 text-zinc-500 hover:text-white transition-colors">
          <ChevronLeft size={18} />
        </button>
        <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-500">Edit Entry</span>
        <button 
          onClick={handleSubmit} 
          disabled={loading}
          className="text-blue-500 text-[13px] font-semibold active:opacity-50 disabled:opacity-30"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : 'Save'}
        </button>
      </div>

      <main className="max-w-xl mx-auto p-4 space-y-8">
        
        {/* Basic Info Section */}
        <section className="space-y-4">
          <div>
            <label className={labelBase}>Vocabulary Word</label>
            <input 
              value={word} 
              onChange={(e) => setWord(e.target.value)} 
              className={`${inputBase} text-[15px] font-medium py-2.5`} 
              placeholder="e.g. Ephemeral" 
            />
          </div>

          <div>
            <label className={labelBase}>Image Asset URL</label>
            <div className="flex gap-2">
              <input 
                value={imageUrl} 
                onChange={(e) => setImageUrl(e.target.value)} 
                className={inputBase} 
                placeholder="Paste URL..." 
              />
              {imageUrl && (
                <div className="w-9 h-9 rounded-md border border-white/10 overflow-hidden flex-shrink-0">
                  <img src={imageUrl} alt="" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sentences Section - Dense List */}
        <section>
          <div className="flex justify-between items-end mb-3">
            <label className={labelBase + " mb-0"}>Usage Context</label>
            <button type="button" onClick={addSentence} className="text-[10px] text-blue-500 font-bold uppercase flex items-center gap-1">
              <Plus size={10} /> Add Line
            </button>
          </div>
          <div className="space-y-2">
            {sentences.map((s, idx) => (
              <div key={idx} className="group relative flex items-center gap-2">
                <input 
                  value={s} 
                  onChange={(e) => updateSentence(idx, e.target.value)} 
                  className={inputBase + " pr-8"} 
                  placeholder="Sentence example..." 
                />
                <button 
                  type="button" 
                  onClick={() => removeSentence(idx)} 
                  className="absolute right-2 text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Visual Search - Integrated Grid */}
        <section className="pt-6 border-t border-white/[0.05]">
          <label className={labelBase}>Unsplash Library</label>
          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-600" />
              <input 
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                className={inputBase + " pl-8 h-8"} 
                placeholder="Search images..." 
              />
            </div>
            <button 
              type="button" 
              onClick={searchImages} 
              className="px-3 h-8 bg-zinc-800 text-[11px] font-bold rounded-md hover:bg-zinc-700 transition-colors"
            >
              Search
            </button>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-6 gap-1.5 h-32 overflow-y-auto pr-1 scrollbar-hide">
            {results.map((r) => (
              <button 
                key={r.id} 
                type="button" 
                onClick={() => setImageUrl(r.urls.regular || '')} 
                className={`aspect-square rounded-sm overflow-hidden border ${imageUrl === r.urls.regular ? 'border-blue-500 ring-1 ring-blue-500' : 'border-transparent'}`}
              >
                <img src={r.urls.small} className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity" />
              </button>
            ))}
            {results.length === 0 && !imagesLoading && (
              <div className="col-span-full h-full flex flex-col items-center justify-center border border-dashed border-white/[0.05] rounded-md">
                <ImageIcon size={14} className="text-zinc-800 mb-1" />
                <span className="text-[10px] text-zinc-700">No images</span>
              </div>
            )}
          </div>
        </section>

        {error && (
          <div className="text-[11px] text-red-400 bg-red-400/5 border border-red-400/20 px-3 py-2 rounded-md">
            {error}
          </div>
        )}
      </main>

      {/* Floating Action Bar for Mobile */}
      <div className="fixed bottom-12 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-none">
        <div className="max-w-xl mx-auto pointer-events-auto">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-white text-black h-11 rounded-full text-[13px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-xl disabled:bg-zinc-800 disabled:text-zinc-500"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  )
}