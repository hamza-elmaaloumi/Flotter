"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUser } from '../../../providers/UserProvider'
import { 
  Plus, 
  Trash2, 
  Search, 
  Image as ImageIcon, 
  Save, 
  X, 
  Type, 
  ChevronLeft 
} from 'lucide-react'

type CardShape = {
  id: string
  userId: string
  word: string
  imageUrl: string
  sentences: string[]
  currentSentenceIndex: number
}

type UnsplashResult = {
  id: string
  urls: { small?: string; regular?: string }
  alt_description?: string | null
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
  const [imagesError, setImagesError] = useState<string | null>(null)

  const updateSentence = (idx: number, value: string) => {
    setSentences((s) => s.map((r, i) => (i === idx ? value : r)))
  }

  const addSentence = () => setSentences((s) => [...s, ''])
  const removeSentence = (idx: number) => setSentences((s) => s.filter((_, i) => i !== idx))

  const searchImages = async () => {
    if (!query.trim()) return
    setImagesError(null)
    setImagesLoading(true)
    try {
      const res = await axios.get('/api/images/search', { params: { query } })
      const data = res.data || {}
      const items = Array.isArray(data.results) ? data.results : []
      setResults(items)
    } catch (err: any) {
      console.error('Image search error', err)
      setImagesError(err?.response?.data?.error || 'image_search_failed')
    } finally {
      setImagesLoading(false)
    }
  }

  const handleSelectImage = (item: UnsplashResult) => {
    if (item.urls?.regular) setImageUrl(item.urls.regular)
    else if (item.urls?.small) setImageUrl(item.urls.small)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!user?.id) {
      setError('You must be logged in to edit cards')
      return
    }
    if (!word.trim()) {
      setError('Word is required')
      return
    }

    setLoading(true)
    try {
      const payload: any = { userId: user.id }
      if (word !== initialCard.word) payload.word = word
      if (imageUrl !== initialCard.imageUrl) payload.imageUrl = imageUrl
      if (JSON.stringify(sentences) !== JSON.stringify(initialCard.sentences)) payload.sentences = sentences

      const res = await axios.patch(`/api/cards/${initialCard.id}`, payload)
      if (res.status >= 200 && res.status < 300) router.back()
    } catch (err: any) {
      setError(err?.response?.data?.error || 'internal_error')
    } finally {
      setLoading(false)
    }
  }

  const inputStyles = "w-full mt-1.5 p-3.5 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-all placeholder:text-zinc-600"
  const labelStyles = "block mb-5"
  const labelTextStyles = "text-zinc-500 text-[10px] uppercase font-bold tracking-[0.15em] ml-1"

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <button 
              type="button" 
              onClick={() => router.back()}
              className="flex items-center gap-1 text-zinc-500 hover:text-white transition-colors mb-2 text-xs font-bold uppercase tracking-wider"
            >
              <ChevronLeft size={14} /> Back
            </button>
            <h1 className="text-3xl font-black text-white tracking-tight">Edit Card</h1>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
             <Type className="text-emerald-500" size={24} />
          </div>
        </div>

        {/* Main Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className={labelStyles}>
            <span className={labelTextStyles}>Word</span>
            <input
              value={word}
              onChange={(e) => setWord(e.target.value)}
              className={inputStyles}
              placeholder="e.g. Ephemeral"
            />
          </label>

          <label className={labelStyles}>
            <span className={labelTextStyles}>Image URL</span>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className={inputStyles}
              placeholder="https://images.unsplash.com/..."
            />
          </label>
        </div>

        {/* Sentences Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 px-1">
            <span className={labelTextStyles}>Example Sentences</span>
            <button 
              type="button" 
              onClick={addSentence} 
              className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-black uppercase tracking-wider hover:text-emerald-300 transition-colors bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20"
            >
              <Plus size={14} /> Add Line
            </button>
          </div>
          <div className="space-y-3">
            {sentences.map((s, idx) => (
              <div key={idx} className="flex gap-2 group">
                <input
                  value={s}
                  onChange={(e) => updateSentence(idx, e.target.value)}
                  className={inputStyles}
                  placeholder={`Sentence ${idx + 1}`}
                />
                <button
                  type="button"
                  onClick={() => removeSentence(idx)}
                  className="mt-1.5 p-3.5 rounded-xl bg-rose-500/5 text-rose-500 border border-rose-500/10 hover:bg-rose-500 hover:text-white transition-all active:scale-95"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Image Search Engine */}
        <div className="mb-8 bg-white/5 p-6 rounded-2xl border border-white/5">
          <span className={labelTextStyles}>Search for Image</span>
          <div className="flex items-center gap-2 mt-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className={`${inputStyles} mt-0 pl-10`}
                placeholder="Find a visual..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), searchImages())}
              />
            </div>
            <button
              type="button"
              onClick={searchImages}
              className="px-6 h-[50px] bg-white text-black hover:bg-zinc-200 rounded-xl font-black transition-all active:scale-95 disabled:opacity-50"
              disabled={imagesLoading}
            >
              {imagesLoading ? '...' : 'Search'}
            </button>
          </div>

          {imagesError && <div className="text-rose-400 text-xs mb-4 font-bold uppercase tracking-wide">⚠️ {imagesError}</div>}

          <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
            {results.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleSelectImage(r)}
                className={`relative aspect-square overflow-hidden rounded-xl border-2 transition-all hover:scale-105 active:scale-95 ${imageUrl === (r.urls.regular || r.urls.small) ? 'border-emerald-500' : 'border-transparent'}`}
              >
                <img src={r.urls.small} alt="result" className="w-full h-full object-cover" suppressHydrationWarning />
                {imageUrl === (r.urls.regular || r.urls.small) && (
                  <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center">
                    <div className="bg-emerald-500 rounded-full p-1"><Plus className="text-white rotate-45" size={12} /></div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Live Preview */}
        {imageUrl && (
          <div className="mb-10">
            <span className={labelTextStyles}>Card Preview</span>
            <div className="mt-3 relative rounded-3xl overflow-hidden border border-white/10 aspect-video group">
              <img src={imageUrl} alt="preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" suppressHydrationWarning />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="text-white text-2xl font-black">{word || 'Word Preview'}</span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm font-bold flex items-center gap-2">
            <X size={16} /> {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
          >
            {loading ? 'Updating...' : <><Save size={20} /> Save Changes</>}
          </button>
          <button 
            type="button" 
            onClick={() => router.back()} 
            className="px-8 py-4 border border-white/10 text-white font-bold rounded-2xl hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}