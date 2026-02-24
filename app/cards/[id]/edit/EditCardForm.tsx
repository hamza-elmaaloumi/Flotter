'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { useUser } from '../../../providers/UserProvider'
import { useLanguage } from '../../../providers/LanguageProvider'
import { useTheme } from '../../../providers/ThemeProvider'
import {
  Plus,
  Trash2,
  Search,
  ChevronLeft,
  Save,
  Image as ImageIcon,
  Loader2,
  X,
  Check
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
  const { t, language } = useLanguage()
  const { isDark } = useTheme()

  const [word, setWord] = useState(initialCard.word || '')
  const [imageUrl, setImageUrl] = useState(initialCard.imageUrl || '')
  const [sentences, setSentences] = useState<string[]>(initialCard.sentences || [])
  const [loading, setLoading] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<UnsplashResult[]>([])
  const [imagesLoading, setImagesLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  const handleDelete = async () => {
    if (!confirm(t('editCard.confirmDelete') || 'Are you sure you want to delete this card permanently?')) return
    setDeleting(true)
    try {
      await axios.delete(`/api/cards/${initialCard.id}`)
      router.push('/cards/learning')
      router.refresh()
    } catch (err: any) {
      setDeleting(false)
      setError(err?.response?.data?.error || t('editCard.deleteFailed') || 'Failed to delete card')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (!word.trim()) return setError(t('editCard.wordRequired'))
    
    // Validation: Check if there is at least one non-empty sentence
    const validSentences = sentences.filter(s => s.trim().length > 0)
    if (validSentences.length === 0) {
      return setError(t('editCard.sentenceRequired') || 'At least one sentence is required')
    }

    setLoading(true)
    try {
      const payload: any = {}
      if (word !== initialCard.word) payload.word = word
      if (imageUrl !== initialCard.imageUrl) payload.imageUrl = imageUrl
      if (JSON.stringify(sentences) !== JSON.stringify(initialCard.sentences)) payload.sentences = sentences

      await axios.patch(`/api/cards/${initialCard.id}`, payload)
      router.push('/cards/learning')
      router.refresh()
    } catch (err: any) {
      setError(err?.response?.data?.error || t('editCard.saveFailed'))
    } finally {
      setLoading(false)
    }
  }

  // --- Design System Constant Styles ---
  const inputStyles = `w-full rounded-[12px] px-3 py-2.5 text-[14px] placeholder-[#6B7280] outline-none focus:border-[#3B82F6] transition-all ${isDark ? 'bg-[#222222] border border-[#2D2D2F] text-[#FFFFFF]' : 'bg-white border border-[#E2E4E9] text-[#111827]'}`
  const labelStyles = `text-[11px] font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`
  const cardStyles = `rounded-[16px] p-2 border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen antialiased pb-40 font-sans ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
      
      {/* Header - Clean Style */}
      <header dir="ltr" className={`sticky top-0 z-10 border-b px-4 h-[64px] flex items-center justify-between ${isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-[#E2E4E9]'}`}>
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-1 text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[17px] font-bold tracking-[-0.5px]">{t('editCard.title')}</h1>
        </div>
        <button 
          onClick={handleSubmit} 
          disabled={loading || deleting}
          className="text-[#3B82F6] text-[16px] font-bold hover:opacity-80 disabled:opacity-30 transition-opacity"
        >
          {loading ? <Loader2 size={19} className="animate-spin" /> : t('editCard.save')}
        </button>
      </header>

      <main className="max-w-xl mx-auto p-4 space-y-10">
        
        {/* Vocabulary Input Section */}
        <section className="space-y-6">
          <div>
            <label className={labelStyles}>{t('editCard.word')}</label>
            <input 
              value={word} 
              onChange={(e) => setWord(e.target.value)} 
              className={`${inputStyles} text-[14px] font-bold`} // h2 style for the main word
              placeholder={t('editCard.wordPlaceholder')} 
            />
          </div>

          {/* Card Image Section */}
          <div>
            <label className={labelStyles}>{t('editCard.cardImage')}</label>
            <div className={cardStyles}>
              {mounted && imageUrl ? (
                <div className="relative group aspect-video w-full rounded-[14px] overflow-hidden bg-[#222222]">
                  <img 
                    src={imageUrl} 
                    alt="Selected" 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 bg-[#121212]/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => setImageUrl('')}
                      className="bg-[#EF4444] text-white p-3 rounded-[12px] shadow-lg transform transition-transform hover:scale-105"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`aspect-video w-full rounded-[14px] border-2 border-dashed flex flex-col items-center justify-center ${isDark ? 'border-[#2D2D2F] bg-[#121212] text-[#6B7280]' : 'border-[#E2E4E9] bg-[#F0F1F3] text-[#6B7280]'}`}>
                  <ImageIcon size={32} className="mb-2 text-[#262626]" />
                  <p className="text-[14px]">{t('editCard.noImage')}</p>
                  <p className="text-[12px] text-[#9CA3AF]">{t('editCard.selectFromLibrary')}</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Usage Context Section */}
        <section>
          <div className="flex justify-between items-center mb-4">
            <label className={labelStyles + " mb-0"}>{t('editCard.context')}</label>
            <button 
              type="button" 
              onClick={addSentence} 
              className="text-[12px] text-[#3B82F6] font-bold uppercase flex items-center gap-1 hover:text-[#1D4ED8]"
            >
              <Plus size={14} strokeWidth={3} /> {t('editCard.addLine')}
            </button>
          </div>
          <div dir='ltr' className="space-y-3">
            {sentences.map((s, idx) => (
              <div key={idx} className="relative flex items-center">
                <input 
                  value={s} 
                  onChange={(e) => updateSentence(idx, e.target.value)} 
                  className={inputStyles + " pr-12 h-[52px]"} // Height matching settings_row feel
                  placeholder={t('editCard.sentencePlaceholder')} 
                />
                <button 
                  type="button" 
                  onClick={() => removeSentence(idx)} 
                  className="absolute right-3 p-2 text-[#6B7280] hover:text-[#EF4444] transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Unsplash Search Section */}
        <section className={`pt-8 border-t ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}>
          <div className="flex items-center justify-between mb-4">
            <label className={labelStyles + " mb-0"}>{t('editCard.unsplash')}</label>
            {imagesLoading && <Loader2 size={16} className="animate-spin text-[#3B82F6]" />}
          </div>
          
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input dir='ltr'
                value={query} 
                onChange={(e) => setQuery(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && searchImages()}
                className={inputStyles + " pl-11 py-3 bg-[#121212]"} 
                placeholder="search for an image..."
              />
            </div>
            <button 
              type="button" 
              onClick={searchImages} 
              className={`px-6 text-[14px] font-bold rounded-[12px] border transition-colors ${isDark ? 'bg-[#262626] border-[#2D2D2F] hover:bg-[#374151]' : 'bg-[#E2E4E9] border-[#E2E4E9] hover:bg-[#D1D5DB] text-[#111827]'}`}
            >
              {t('editCard.searchBtn')}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3 max-h-80 overflow-y-auto pr-1">
            {results.map((r) => (
              <button 
                key={r.id} 
                type="button" 
                onClick={() => setImageUrl(r.urls.regular || '')} 
                className={`aspect-square rounded-[12px] overflow-hidden border-2 transition-all relative ${imageUrl === r.urls.regular ? 'border-[#3B82F6]' : 'border-transparent'}`}
              >
                {mounted ? (
                  <img src={r.urls.small} className={`w-full h-full object-cover transition-opacity ${imageUrl === r.urls.regular ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} />
                ) : (
                  <div className="w-full h-full bg-[#222222]" />
                )}
                {imageUrl === r.urls.regular && (
                  <div className="absolute inset-0 bg-[#3B82F6]/30 flex items-center justify-center">
                    <div className="bg-[#3B82F6] rounded-full p-1 shadow-lg">
                      <Check size={16} className="text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
            {results.length === 0 && !imagesLoading && (
              <div className={`col-span-full py-12 flex flex-col items-center justify-center border border-dashed rounded-[16px] ${isDark ? 'border-[#2D2D2F] bg-[#1C1C1E]/50' : 'border-[#E2E4E9] bg-[#F0F1F3]/50'}`}>
                <Search size={24} className="text-[#262626] mb-2" />
                <span className="text-[12px] text-[#6B7280] font-medium">{t('editCard.discoverImages')}</span>
              </div>
            )}
          </div>
        </section>
        
        {/* Delete Card Section */}
        <section className={`pt-8 border-t flex justify-center ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}>
          <button 
            type="button"
            onClick={handleDelete}
            disabled={loading || deleting}
            className="text-[#EF4444] text-[14px] font-bold flex items-center gap-2 hover:opacity-80 transition-opacity disabled:opacity-50"
          >
            {deleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            {t('editCard.deleteCard') || 'Delete Card'}
          </button>
        </section>

        {/* Error Handling */}
        {error && (
          <div className="text-[12px] font-bold uppercase bg-[#EF4444]/10 border border-[#EF4444] text-[#EF4444] px-4 py-3 rounded-[12px] flex items-center gap-2">
            <X size={14} /> {error}
          </div>
        )}
      </main>

      {/* Primary Action Button - Floating Style */}
      <footer className={`fixed bottom-12 left-0 right-0 flex justify-center  p-6 bg-gradient-to-t ${isDark ? 'from-[#121212] via-[#121212]' : 'from-[#F8F9FA] via-[#F8F9FA]'} to-transparent z-20`}>
        <div className="max-w-xl mx-auto">
          <button 
            onClick={handleSubmit}
            disabled={loading || deleting}
            className="w-60 bg-green-600 text-[#FFFFFF] h-[39px] rounded-[12px] text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-[0_8px_30px_rgb(0,0,0,0.4)] disabled:bg-[#374151] disabled:text-[#6B7280]"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <><Save size={20} /> {t('editCard.saveChanges')}</>}
          </button>
        </div>
      </footer>
    </div>
  )
}