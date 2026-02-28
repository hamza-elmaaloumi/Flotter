"use client"

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import { Plus, Search, Check, ChevronLeft, Loader2, X, Sparkles, Crown, HelpCircle, ChevronRight, Type, PenLine, ImageIcon, MousePointerClick } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useLanguage } from '../../providers/LanguageProvider'
import { useTheme } from '../../providers/ThemeProvider'
import Link from 'next/link'

export default function NewCardPage() {
  const { user } = useUser()
  const router = useRouter()
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  
  // State
  const [word, setWord] = useState('')
  const [sentences, setSentences] = useState(['']) 
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [selected, setSelected] = useState<any | null>(null)
  
  // UI States
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState<'success' | 'error'>('error')
  const [limitReached, setLimitReached] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [helpStep, setHelpStep] = useState(0)

  // Auto-show walkthrough for users with zero cards
  useEffect(() => {
    async function checkCardCount() {
      try {
        const res = await axios.get('/api/cards/dash')
        if (res.data?.totalCardsCount === 0) {
          setShowHelp(true)
          setHelpStep(0)
        }
      } catch {
        // Ignore — not critical
      }
    }
    if (user?.id) checkCardCount()
  }, [user?.id])

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

  // Internal search function that can be triggered by AI or manual search
  async function performImageSearch(searchTerm: string) {
    if (!searchTerm) return
    setLoading(true)
    try {
      const res = await axios.get('/api/images/search', { params: { query: searchTerm } })
      setResults(res.data.results || [])
    } catch (err) {
      setMsg(t('newCard.searchError')); setMsgType('error')
    } finally { setLoading(false) }
  }

  // Triggered when clicking search button or pressing enter
  const handleManualSearch = () => {
    performImageSearch(query)
  }

  // AI Sentence & Image Query Generation logic
  const handleWordBlur = async () => {
    if (!word.trim()) return
    setAiLoading(true)
    setLimitReached(false)
    try {
      const res = await axios.post('/api/ai/generate-sentences', { word })
      
      // Update Sentences
      if (res.data.sentences && Array.isArray(res.data.sentences)) {
        setSentences(res.data.sentences)
      }

      // Update Query and Trigger Search Automatically
      if (res.data.imageQuery) {
        setQuery(res.data.imageQuery)
        performImageSearch(res.data.imageQuery)
      }
    } catch (err: any) {
      if (err?.response?.status === 429 && err?.response?.data?.error === 'daily_limit_reached') {
        setLimitReached(true)
        setMsg(err.response.data.message || 'Daily AI generation limit reached. Subscribe to Pro for unlimited generations!')
      } else {
        console.error("AI Generation failed", err)
      }
    } finally {
      setAiLoading(false)
    }
  }

  async function handleSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault()
    
    const cleanSentences = sentences.filter(s => s.trim() !== '')
    if (!word.trim() || cleanSentences.length === 0 || !selected) {
      setMsg(t('newCard.incomplete')); setMsgType('error')
      return 
    }

    setSaving(true)
    try {
      const imageUrl = selected?.urls?.regular || selected?.urls?.small || ''
      await axios.post('/api/cards', { word, sentences: cleanSentences, imageUrl })
      setMsg(t('newCard.success')); setMsgType('success')
      setTimeout(() => router.push('/cards/learning'), 1000)
    } catch (err) {
      setMsg(t('newCard.saveFailed')); setMsgType('error')
    } finally { setSaving(false) }
  }

  // --- Flotter Design System Constants ---
  const inputBase = `w-full rounded-[12px] px-3 py-2.5 text-[14px] placeholder-[#6B7280] outline-none focus:border-[#3B82F6] transition-all ${isDark ? 'bg-[#222222] border border-[#2D2D2F] text-[#FFFFFF]' : 'bg-white border border-[#E2E4E9] text-[#111827]'}`
  const labelBase = `text-[11px] font-bold uppercase tracking-wider mb-2 block ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`
  const cardBase = `rounded-[16px] p-2 border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen antialiased pb-32 font-sans ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
      
      {/* Header Component (Clean Style) */}
      <header dir="ltr" className={`sticky top-0 z-20 border-b px-4 h-[64px] flex items-center justify-between ${isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-[#E2E4E9]'}`}>
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className="p-1 text-[#9CA3AF] hover:text-[#FFFFFF] transition-colors">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[17px] font-bold tracking-[-0.5px]">{t('newCard.title')}</h1>
        </div>
        <button 
          onClick={() => handleSubmit()} 
          disabled={saving}
          className="text-[#3B82F6] text-[16px] font-bold hover:opacity-80 disabled:opacity-30 transition-opacity"
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : t('newCard.create')}
        </button>
      </header>

      <main className="max-w-4xl mx-auto p-4 lg:grid lg:grid-cols-12 lg:gap-8 mt-4">

        {/* AI LIMIT REACHED BANNER */}
        {limitReached && (
          <div className="lg:col-span-12 mb-6">
            <div className="relative overflow-hidden rounded-[14px] bg-[#1C1C1E] border border-[#EF4444]/30 p-5">
              <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] blur-[60px] rounded-full bg-[#EF4444]/10" />
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#EF4444]/10 border border-[#EF4444]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles size={18} className="text-[#EF4444]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold text-[#FFFFFF] mb-1">{t('newCard.limitTitle')}</p>
                  <p className="text-[12px] text-[#9CA3AF] leading-relaxed mb-3">
                    {t('newCard.limitDesc')}
                  </p>
                  <Link
                    href="/subscribe"
                    className="inline-flex items-center gap-2 bg-[#FACC15] text-[#000000] px-4 py-2.5 rounded-[10px] font-bold text-[11px] transition-all active:scale-95"
                  >
                    <Crown size={12} fill="currentColor" />
                    {t('newCard.limitCta')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Left Side: Inputs */}
        <div className="lg:col-span-7 space-y-8">
          <section>
            <div className="flex items-center gap-2 mb-2">
              <label className={labelBase + " mb-0"}>{t('newCard.word')}</label>
              <button
                type="button"
                onClick={() => setShowHelp(true)}
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all active:scale-90 ${isDark ? 'bg-[#2D2D2F] text-[#6B7280] hover:text-[#3B82F6] hover:bg-[#3B82F6]/10' : 'bg-[#E2E4E9] text-[#6B7280] hover:text-[#2563EB] hover:bg-[#2563EB]/10'}`}
              >
                <HelpCircle size={12} />
              </button>
            </div>
            <div className="relative">
              <input dir='ltr'
                value={word} 
                onChange={e => setWord(e.target.value)} 
                onBlur={handleWordBlur}
                placeholder={t('newCard.wordPlaceholder')} 
                className={`${inputBase} text-[14px] font-bold py-3 pr-10`} // h2-like style
              />
              {aiLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#3B82F6]">
                  <Loader2 size={18} className="animate-spin" />
                </div>
              )}
            </div>
            <p className="mt-1.5 text-[10px] text-[#6B7280] italic flex items-center gap-1 opacity-80">
              <Sparkles size={10} className="text-[#3B82F6]" />
              {language === 'ar' ? 'تلميح: انقر خارج المربع بعد الكتابة لإنشاء الجمل والبحث عن الصور تلقائياً' : 'Hint: Click outside the box after typing to generate sentences and search images automatically'}
            </p>
          </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <label className={labelBase + " mb-0"}>{t('newCard.context')}</label>
                {aiLoading && (
                  <span className="text-[10px] text-[#3B82F6] animate-pulse font-bold uppercase flex items-center gap-1">
                    <Sparkles size={10} /> {t('newCard.generating') || 'AI Generating...'}
                  </span>
                )}
              </div>
              <button 
                type="button" 
                onClick={addSentence}
                className="text-[11px] text-[#3B82F6] font-bold uppercase flex items-center gap-1 hover:text-[#1D4ED8]"
              >
                <Plus size={12} strokeWidth={3} /> {t('newCard.addLine')}
              </button>
            </div>
            <div className="space-y-3">
              {sentences.map((s, i) => (
                <div key={i} className="group relative flex items-start gap-2">
                  <textarea dir='ltr' 
                    value={s} 
                    onChange={e => updateSentence(i, e.target.value)} 
                    placeholder={`Sentence ${i + 1}...`}
                    rows={2} 
                    className={inputBase + " resize-none pr-10"} 
                  />
                  <button 
                    type="button" 
                    onClick={() => removeSentence(i)}
                    className="absolute right-3 top-3 text-[#6B7280] hover:text-[#EF4444] transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Side: Image Library */}
        <div className="lg:col-span-5 mt-10 lg:mt-0 pt-10 lg:pt-0 border-t lg:border-t-0 border-[#262626]">
          <label className={labelBase}>{t('newCard.visualSearch')}</label>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B7280]" />
              <input dir='ltr' 
                value={query} 
                onChange={e => setQuery(e.target.value)} 
                onKeyDown={(e) => e.key === 'Enter' && handleManualSearch()}
                className={inputBase + " pl-10 h-11"} 
                placeholder="search for an image..." 
              />
            </div>
            <button 
              type="button" 
              onClick={handleManualSearch} 
              disabled={loading}
              className={`px-5 h-11 text-[12px] font-bold rounded-[12px] border transition-colors disabled:opacity-50 ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F] hover:bg-[#262626]' : 'bg-[#E2E4E9] border-[#E2E4E9] hover:bg-[#D1D5DB] text-[#111827]'}`}
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : t('newCard.search')}
            </button>
          </div>

          {/* Grid Results */}
          <div className={`grid grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1 mb-6 border rounded-[14px] p-2 ${isDark ? 'border-[#2D2D2F] bg-[#121212]' : 'border-[#E2E4E9] bg-[#F0F1F3]'}`}>
            {results.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelected(r)}
                className={`relative aspect-square rounded-[12px] overflow-hidden border-2 transition-all ${selected?.id === r.id ? 'border-[#3B82F6]' : 'border-transparent hover:border-[#1C1C1E]'}`}
              >
                <img 
                  src={r.urls.small} 
                  alt={r.alt_description || "image"} 
                  className={`w-full h-full object-cover transition-opacity ${selected?.id === r.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`} 
                />
                {selected?.id === r.id && (
                  <div className="absolute inset-0 bg-[#3B82F6]/20 flex items-center justify-center">
                    <div className="bg-[#3B82F6] rounded-full p-1 shadow-lg">
                       <Check size={14} className="text-white" />
                    </div>
                  </div>
                )}
              </button>
            ))}
            {results.length === 0 && !loading && (
              <div className="col-span-full py-10 flex flex-col items-center justify-center text-[#6B7280]">
                <Search size={20} className="mb-2 opacity-20" />
                <span className="text-[12px]">{t('newCard.browseLibrary')}</span>
              </div>
            )}
          </div>

          {/* Selected Preview - Standard Card Style */}
          {selected && (
            <div className={`${cardBase} animate-in fade-in slide-in-from-bottom-2`}>
              <div className="relative w-full rounded-[14px] overflow-hidden bg-[#121212]">
                <img 
                  src={selected.urls.regular} 
                  alt="Preview" 
                  className="block w-full h-auto max-h-[300px] object-contain" 
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#121212] to-transparent p-4 pt-10">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">{t('newCard.selectedImage')}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Primary Action Button - Floating State */}
      <footer className={`fixed bottom-12 left-0 right-0 flex justify-center p-6 z-10 bg-gradient-to-t ${isDark ? 'from-[#121212] via-[#121212]' : 'from-[#F8F9FA] via-[#F8F9FA]'} to-transparent`}>
        <div className="max-w-xl mx-auto">
          <button 
            onClick={() => handleSubmit()}
            disabled={saving}
            className="w-60 bg-green-600 text-[#FFFFFF] h-[39px] rounded-[12px] text-[15px] font-bold flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-lg disabled:bg-[#262626] disabled:text-[#6B7280]"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <><Plus size={20} strokeWidth={3} /> {t('newCard.createBtn')}</>}
          </button>
        </div>
      </footer>

      {/* Status Notifications */}
      {msg && (
        <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className={`flex items-center gap-2.5 px-5 py-3 rounded-[14px] text-[13px] font-semibold shadow-lg backdrop-blur-xl ${
            msgType === 'success'
              ? isDark
                ? 'bg-[#10B981]/15 text-[#34D399]'
                : 'bg-[#059669]/10 text-[#059669]'
              : isDark
                ? 'bg-[#FFFFFF]/10 text-[#F9FAFB]'
                : 'bg-[#111827]/90 text-[#F9FAFB]'
          }`}>
            {msgType === 'success' ? (
              <div className="w-5 h-5 rounded-full bg-[#10B981] flex items-center justify-center flex-shrink-0">
                <Check size={12} className="text-white" strokeWidth={3} />
              </div>
            ) : (
              <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${isDark ? 'bg-[#FFFFFF]/15' : 'bg-[#FFFFFF]/20'}`}>
                <span className="text-[11px] font-bold">!</span>
              </div>
            )}
            <span>{msg}</span>
            <button onClick={() => setMsg('')} className="ml-1 opacity-50 hover:opacity-100 transition-opacity">
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* STEP-BY-STEP WALKTHROUGH */}
      {showHelp && (
        <div className="fixed inset-0 z-[300] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className={`relative max-w-md w-full rounded-[20px] border overflow-hidden ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>

            {/* Progress bar */}
            <div className={`h-1 ${isDark ? 'bg-[#222222]' : 'bg-[#F0F1F3]'}`}>
              <div
                className="h-full bg-[#3B82F6] transition-all duration-300 ease-out"
                style={{ width: `${((helpStep + 1) / 5) * 100}%` }}
              />
            </div>

            <div className="p-6">
              {/* Step counter */}
              <div className="flex items-center justify-between mb-5">
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                  {t('newCard.walkthrough.stepOf').replace('{current}', String(helpStep + 1)).replace('{total}', '5')}
                </span>
                <button
                  onClick={() => { setShowHelp(false); setHelpStep(0) }}
                  className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors ${isDark ? 'text-[#6B7280] hover:text-white hover:bg-[#2D2D2F]' : 'text-[#9CA3AF] hover:text-[#111827] hover:bg-[#F0F1F3]'}`}
                >
                  {t('newCard.walkthrough.skip')}
                </button>
              </div>

              {/* STEP 0: Type a word */}
              {helpStep === 0 && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center">
                    <Type size={22} className="text-[#3B82F6]" />
                  </div>
                  <h3 className="text-[18px] font-bold">{t('newCard.walkthrough.step1Title')}</h3>
                  <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                    {t('newCard.walkthrough.step1Desc')}
                  </p>
                  <div className={`rounded-[12px] border p-3 ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F8F9FA] border-[#E2E4E9]'}`}>
                    <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1.5 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>{t('newCard.walkthrough.example')}</span>
                    <span className="text-[15px] font-bold text-[#3B82F6]">Ephemeral</span>
                  </div>
                </div>
              )}

              {/* STEP 1: AI generates everything */}
              {helpStep === 1 && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center">
                    <Sparkles size={22} className="text-[#8B5CF6]" />
                  </div>
                  <h3 className="text-[18px] font-bold">{t('newCard.walkthrough.step2Title')}</h3>
                  <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                    {t('newCard.walkthrough.step2Desc')}
                  </p>
                  <div className={`rounded-[12px] border p-3 space-y-2 ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F8F9FA] border-[#E2E4E9]'}`}>
                    <div className="flex items-center gap-2">
                      <MousePointerClick size={12} className="text-[#8B5CF6]" />
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>{t('newCard.walkthrough.whatHappens')}</span>
                    </div>
                    <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      {t('newCard.walkthrough.step2Detail')}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 2: Edit sentences manually */}
              {helpStep === 2 && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                    <PenLine size={22} className="text-[#10B981]" />
                  </div>
                  <h3 className="text-[18px] font-bold">{t('newCard.walkthrough.step3Title')}</h3>
                  <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                    {t('newCard.walkthrough.step3Desc')}
                  </p>
                  <div className={`rounded-[12px] border p-3 space-y-2 ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F8F9FA] border-[#E2E4E9]'}`}>
                    <span className={`text-[11px] font-bold uppercase tracking-wider block mb-1 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>{t('newCard.walkthrough.youCan')}</span>
                    <ul className={`text-[12px] leading-relaxed space-y-1 ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      <li>• {t('newCard.walkthrough.editTip1')}</li>
                      <li>• {t('newCard.walkthrough.editTip2')}</li>
                      <li>• {t('newCard.walkthrough.editTip3')}</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* STEP 3: Choose an image */}
              {helpStep === 3 && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[#F59E0B]/10 border border-[#F59E0B]/20 flex items-center justify-center">
                    <ImageIcon size={22} className="text-[#F59E0B]" />
                  </div>
                  <h3 className="text-[18px] font-bold">{t('newCard.walkthrough.step4Title')}</h3>
                  <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                    {t('newCard.walkthrough.step4Desc')}
                  </p>
                  <div className={`rounded-[12px] border p-3 ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F8F9FA] border-[#E2E4E9]'}`}>
                    <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                      {t('newCard.walkthrough.step4Detail')}
                    </p>
                  </div>
                </div>
              )}

              {/* STEP 4: Save your card */}
              {helpStep === 4 && (
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-[14px] bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center">
                    <Check size={22} className="text-[#10B981]" />
                  </div>
                  <h3 className="text-[18px] font-bold">{t('newCard.walkthrough.step5Title')}</h3>
                  <p className={`text-[14px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
                    {t('newCard.walkthrough.step5Desc')}
                  </p>
                  <div className={`rounded-[12px] p-3 ${isDark ? 'bg-[#10B981]/10 border border-[#10B981]/20' : 'bg-[#059669]/5 border border-[#059669]/20'}`}>
                    <p className="text-[12px] font-bold text-[#10B981]">
                      {t('newCard.walkthrough.step5Tip')}
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 mt-6">
                {helpStep > 0 && (
                  <button
                    onClick={() => setHelpStep(s => s - 1)}
                    className={`flex-1 py-3 rounded-[12px] font-bold text-[13px] transition-all active:scale-95 border ${isDark ? 'bg-[#222222] border-[#2D2D2F] text-[#9CA3AF] hover:text-white' : 'bg-[#F0F1F3] border-[#E2E4E9] text-[#6B7280] hover:text-[#111827]'}`}
                  >
                    {t('newCard.walkthrough.back')}
                  </button>
                )}
                <button
                  onClick={() => {
                    if (helpStep < 4) {
                      setHelpStep(s => s + 1)
                    } else {
                      setShowHelp(false)
                      setHelpStep(0)
                    }
                  }}
                  className="flex-1 bg-[#3B82F6] text-white py-3 rounded-[12px] font-bold text-[13px] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {helpStep < 4 ? (
                    <>{t('newCard.walkthrough.next')} <ChevronRight size={14} /></>
                  ) : (
                    t('newCard.walkthrough.done')
                  )}
                </button>
              </div>

              {/* Step dot indicators */}
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {[0, 1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === helpStep ? 'w-5 bg-[#3B82F6]' : i < helpStep ? 'w-1.5 bg-[#3B82F6]/40' : `w-1.5 ${isDark ? 'bg-white/15' : 'bg-black/10'}`
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}