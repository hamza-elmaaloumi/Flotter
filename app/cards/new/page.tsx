"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import { Plus, Search, Image as ImageIcon, Check, ArrowLeft, Type } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NewCardPage() {
  const { user } = useUser()
  const router = useRouter()
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
    try {
      const res = await axios.get('/api/images/search', { params: { query } })
      setResults(res.data.results || [])
    } catch (err) {
      setMsg('Search error')
    } finally { setLoading(false) }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!word.trim() || sentences.some(s => !s.trim()) || !selected) {
      setMsg('Please fill all fields and select an image.')
      return 
    }

    setSaving(true)
    try {
      const imageUrl = selected?.urls?.regular || selected?.urls?.small || ''
      await axios.post('/api/cards', { word, sentences, imageUrl })
      
      setMsg('Card saved successfully')
      setTimeout(() => router.push('/'), 1500)
    } catch (err) {
      setMsg('Failed to save card')
    } finally { setSaving(false) }
  }

  const inputStyles = "w-full bg-[#121212] border border-[#1C1C1E] rounded-[14px] md:rounded-[16px] px-4 py-3 md:py-[16px] focus:border-[#22C55E] outline-none text-[14px] md:text-[16px] transition-all placeholder:text-zinc-600"
  const labelStyles = "text-[10px] md:text-[12px] font-[700] uppercase tracking-widest text-[#636366] ml-1"

  return (
    <main className="min-h-screen bg-[#000000] text-[#FFFFFF] py-4 md:py-[32px] px-4 md:px-[20px] antialiased">
      <div className="max-w-4xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-6 md:mb-[32px] flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="p-2 -ml-2 text-zinc-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-[18px] md:text-[24px] font-[800] tracking-tight">New Card</h1>
          <div className="w-10 h-10 bg-zinc-900 rounded-full border border-white/5 flex items-center justify-center">
            <Plus size={18} className="text-[#22C55E]" />
          </div>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-[32px]">
          
          {/* LEFT: INPUTS */}
          <div className="lg:col-span-7 space-y-5 md:space-y-[24px]">
            <div className="space-y-1.5 md:space-y-2">
              <label className={labelStyles}>The Word</label>
              <input 
                value={word} 
                onChange={e => setWord(e.target.value)} 
                placeholder="Vocabulary term..."
                className={inputStyles} 
              />
            </div>

            <div className="space-y-2 md:space-y-3">
              <label className={labelStyles}>Context Sentences</label>
              {sentences.map((s, i) => (
                <textarea 
                  key={i} 
                  value={s} 
                  onChange={e => {
                    const copy = [...sentences]; copy[i] = e.target.value; setSentences(copy);
                  }} 
                  placeholder={`Example ${i + 1}`}
                  rows={2} 
                  className={`${inputStyles} resize-none py-3`} 
                />
              ))}
            </div>

            <button 
              type="submit" 
              disabled={saving} 
              className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-black font-[800] py-4 md:py-[18px] rounded-[16px] md:rounded-[20px] disabled:opacity-50 transition-all active:scale-[0.98] text-[15px] shadow-lg shadow-green-500/10"
            >
              {saving ? 'Encrypting Card...' : 'Save to Deck'}
            </button>
            
            {msg && (
                <div className={`p-4 rounded-xl border text-center text-[13px] font-bold ${msg.includes('success') ? 'bg-green-500/10 border-green-500/20 text-green-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                    {msg}
                </div>
            )}
          </div>

          {/* RIGHT: IMAGE PICKER */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-[#121212] border border-[#1C1C1E] p-4 md:p-6 rounded-[24px] flex flex-col h-full">
               <label className={labelStyles + " mb-3"}>Visual Reference</label>
               
               <div className="flex gap-2 mb-4">
                  <input 
                      value={query} 
                      onChange={e => setQuery(e.target.value)} 
                      placeholder="Search image..." 
                      className="flex-1 bg-black border border-[#1C1C1E] rounded-[12px] px-4 py-2 text-[14px] outline-none focus:border-blue-500 transition-all" 
                  />
                  <button 
                      type="button" 
                      onClick={searchImages} 
                      disabled={loading}
                      className="bg-blue-500 text-white px-4 rounded-[12px] text-[12px] font-[800] uppercase tracking-tighter disabled:opacity-50"
                  >
                      {loading ? '...' : 'Find'}
                  </button>
               </div>

               <div className="flex-1 flex flex-col min-h-[280px]">
                   <div className="grid grid-cols-3 gap-2 h-full overflow-y-auto bg-black/40 p-2 rounded-xl border border-white/5 custom-scrollbar">
                      {results.length > 0 ? (
                          results.map(r => (
                          <div key={r.id} className="relative group">
                            <img 
                                src={r.urls.thumb} 
                                alt="result"
                                onClick={() => setSelected(r)} 
                                className={`cursor-pointer rounded-lg w-full aspect-square object-cover transition-all ${selected?.id === r.id ? 'opacity-100 ring-2 ring-[#22C55E]' : 'opacity-40 hover:opacity-100'}`} 
                            />
                            {selected?.id === r.id && (
                              <div className="absolute top-1 right-1 bg-[#22C55E] rounded-full p-0.5 pointer-events-none">
                                <Check size={10} className="text-black" />
                              </div>
                            )}
                          </div>
                          ))
                      ) : (
                          <div className="col-span-3 flex flex-col items-center justify-center h-full text-zinc-700 space-y-2">
                              <ImageIcon size={24} strokeWidth={1.5} />
                              <p className="text-[11px] font-medium italic">No results yet</p>
                          </div>
                      )}
                   </div>
               </div>

               {selected && (
                   <div className="mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <div className="relative rounded-[16px] overflow-hidden border border-[#1C1C1E] aspect-video">
                          <img src={selected.urls.small} alt="Selection" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-3">
                            <p className="text-[10px] font-bold text-white uppercase tracking-widest flex items-center gap-2">
                              <Check size={12} className="text-[#22C55E]" /> Selection Active
                            </p>
                          </div>
                      </div>
                   </div>
               )}
            </div>
          </div>

        </form>
      </div>
      
      {/* Custom Scrollbar Logic */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1c1c1e; border-radius: 10px; }
      `}</style>
    </main>
  )
}