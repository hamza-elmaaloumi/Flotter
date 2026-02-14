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

    const isWordEmpty = !word.trim()
    const areSentencesIncomplete = sentences.some(s => !s.trim())
    const isImageMissing = !selected

    if (isWordEmpty || areSentencesIncomplete || isImageMissing) {
      if (isWordEmpty) setMsg('Word field is required.')
      else if (areSentencesIncomplete) setMsg('All three sentences are required.')
      else if (isImageMissing) setMsg('Please search and select an image.')
      return 
    }

    setSaving(true)
    try {
      const imageUrl = selected?.urls?.regular || selected?.urls?.small || ''
      const payload = { userId, word, sentences, imageUrl }

      const res = await axios.post('/api/cards', payload)
      
      if (!res || res.status >= 400) {
        setMsg(res.data?.error || 'Save failed')
      } else {
        setMsg('Card saved successfully')
        setWord('')
        setSentences(['', '', ''])
        setSelected(null)
        setResults([])
        setQuery('')
      }
    } catch (err) {
      setMsg('Internal server error during save')
    } finally {
      setSaving(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#000000] text-[#FFFFFF] py-[32px] px-[20px] font-['San_Francisco',_Roboto,_Arial,_sans-serif]">
      <div className="max-w-5xl mx-auto">
        <header className="mb-[32px] border-b border-[#1C1C1E] pb-[20px]">
          <h1 className="text-[28px] font-[700] text-[#FFFFFF] mb-2">Create New Card</h1>
          <p className="text-[14px] uppercase font-[600] text-[#98989E] tracking-wider">Form Submission Terminal</p>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">
          
          <div className="lg:col-span-7 space-y-[32px]">
            <section className="space-y-[12px]">
              <div className="space-y-3">
                <label className="text-[14px] font-[600] uppercase text-[#98989E]">The Word</label>
                <input 
                  value={word} 
                  onChange={e => setWord(e.target.value)} 
                  placeholder="Enter vocabulary..."
                  className="w-full bg-[#121212] border border-[#3A3A3C] rounded-[16px] px-4 py-[16px] text-[#FFFFFF] text-[17px] placeholder-[#636366] focus:outline-none focus:border-[#22C55E] transition-colors"
                />
              </div>

              <div className="space-y-4">
                <label className="text-[14px] font-[600] uppercase text-[#98989E]">Contextual Sentences</label>
                {sentences.map((s, i) => (
                  <textarea
                    key={i}
                    value={s}
                    onChange={e => updateSentence(i, e.target.value)}
                    rows={2}
                    placeholder={`Context unit 0${i + 1}`}
                    className="w-full bg-[#121212] border border-[#3A3A3C] rounded-[16px] px-4 py-[16px] text-[#FFFFFF] text-[15px] placeholder-[#636366] focus:outline-none focus:border-[#22C55E] transition-colors resize-none"
                  />
                ))}
              </div>
            </section>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-[#FFFFFF] font-[600] text-[17px] py-[16px] px-[24px] rounded-[18px] transition-all disabled:opacity-50 active:scale-[0.98] text-center"
              >
                {saving ? 'Saving...' : 'Confirm and Save'}
              </button>
              
              {msg && (
                <div className={`mt-[12px] p-[20px] rounded-[24px] border text-center text-[15px] font-[400] ${
                  msg.includes('successfully') 
                  ? 'bg-[#1C1C1E] border-[#4CD964] text-[#4CD964]' 
                  : 'bg-[#1C1C1E] border-[#FF453A] text-[#FF453A]'
                }`}>
                  {msg}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#1C1C1E] p-[20px] rounded-[24px]">
              <label className="text-[14px] font-[600] uppercase text-[#98989E] block mb-[12px]">Visual Identification</label>
              
              <div className="flex gap-[12px] mb-[32px]">
                <input 
                  value={query} 
                  onChange={(e) => setQuery(e.target.value)} 
                  placeholder="Search imagery..."
                  className="flex-1 bg-[#121212] border border-[#3A3A3C] rounded-[16px] px-4 py-2 text-[15px] text-[#FFFFFF] focus:outline-none focus:border-[#3B82F6]"
                />
                <button 
                  type="button" 
                  onClick={searchImages} 
                  disabled={loading}
                  className="bg-[#3B82F6] text-[#FFFFFF] px-6 py-2 rounded-[16px] text-[14px] font-[600] uppercase hover:opacity-90 transition-all"
                >
                  {loading ? '...' : 'Search'}
                </button>
              </div>

              <div className="grid grid-cols-3 gap-[12px] max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                {results.map((r) => (
                  <div
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className={`relative aspect-square cursor-pointer rounded-[16px] overflow-hidden border-[2px] transition-all ${
                      selected?.id === r.id ? 'border-[#22C55E] scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={r.urls.thumb} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
              </div>

              {selected && (
                <div className="mt-[32px] pt-[20px] border-t border-[#3A3A3C]">
                  <p className="text-[14px] text-[#98989E] font-[600] uppercase mb-[12px] text-center">Selected Asset</p>
                  <div className="relative aspect-video rounded-[16px] overflow-hidden border border-[#3A3A3C]">
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
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3A3A3C; border-radius: 10px; }
      `}</style>
    </main>
  )
}