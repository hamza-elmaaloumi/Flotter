"use client"

import React, { useState } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'

export default function NewCardPage() {
  const { user } = useUser()
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
      setWord(''); setSentences(['', '', '']); setSelected(null); setResults([]); setQuery('')
    } catch (err) {
      setMsg('Failed to save card')
    } finally { setSaving(false) }
  }

  return (
    <main className="min-h-screen bg-[#000000] text-[#FFFFFF] py-[32px] px-[20px]">
      <div className="max-w-5xl mx-auto">
        <header className="mb-[32px] border-b border-[#1C1C1E] pb-[20px]">
          <h1 className="text-[28px] font-[700]">Create New Card</h1>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-[32px]">
          {/* Form Inputs Section */}
          <div className="lg:col-span-7 space-y-[32px]">
            <div className="space-y-3">
              <label className="text-[14px] font-[600] uppercase text-[#98989E]">The Word</label>
              <input 
                value={word} 
                onChange={e => setWord(e.target.value)} 
                placeholder="Enter word or phrase..."
                className="w-full bg-[#121212] border border-[#3A3A3C] rounded-[16px] px-4 py-[16px] focus:border-[#22C55E] outline-none" 
              />
            </div>

            <div className="space-y-4">
              <label className="text-[14px] font-[600] uppercase text-[#98989E]">Sentences</label>
              {sentences.map((s, i) => (
                <textarea 
                  key={i} 
                  value={s} 
                  onChange={e => {
                    const copy = [...sentences]; copy[i] = e.target.value; setSentences(copy);
                  }} 
                  placeholder={`Example sentence ${i + 1}...`}
                  rows={2} 
                  className="w-full bg-[#121212] border border-[#3A3A3C] rounded-[16px] px-4 py-[16px] focus:border-[#22C55E] outline-none resize-none" 
                />
              ))}
            </div>

            <button type="submit" disabled={saving} className="w-full bg-[#22C55E] hover:bg-[#16A34A] text-white font-[600] py-[16px] rounded-[18px] disabled:opacity-50 transition-colors">
              {saving ? 'Saving...' : 'Confirm and Save Card'}
            </button>
            
            {msg && (
                <div className={`mt-4 p-4 rounded-xl border text-center ${msg.includes('success') ? 'bg-green-900/20 border-green-800 text-green-400' : 'bg-zinc-900 border-zinc-700 text-zinc-300'}`}>
                    {msg}
                </div>
            )}
          </div>

          {/* Image Selection Section */}
          <div className="lg:col-span-5 bg-[#1C1C1E] p-6 rounded-[24px] flex flex-col h-fit">
             <label className="text-[14px] font-[600] uppercase text-[#98989E] mb-3">Visual Reference</label>
             <div className="flex gap-2 mb-4">
                <input 
                    value={query} 
                    onChange={e => setQuery(e.target.value)} 
                    placeholder="Search imagery (e.g. 'Nature')..." 
                    className="flex-1 bg-black border border-[#3A3A3C] rounded-[12px] px-4 py-2 outline-none focus:border-blue-500" 
                />
                <button 
                    type="button" 
                    onClick={searchImages} 
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-[12px] text-sm font-medium disabled:opacity-50"
                >
                    {loading ? '...' : 'Search'}
                </button>
             </div>

             <div className="space-y-2">
                 <p className="text-[12px] text-[#98989E] font-medium">Search Results</p>
                 <div className="grid grid-cols-3 gap-2 h-60 overflow-y-auto bg-black/30 p-2 rounded-xl border border-[#3A3A3C]">
                    {results.length > 0 ? (
                        results.map(r => (
                        <img 
                            key={r.id} 
                            src={r.urls.thumb} 
                            alt="Search result"
                            onClick={() => setSelected(r)} 
                            className={`cursor-pointer rounded-lg w-full aspect-square object-cover transition-all ${selected?.id === r.id ? 'ring-4 ring-green-500 scale-95' : 'opacity-70 hover:opacity-100'}`} 
                        />
                        ))
                    ) : (
                        <div className="col-span-3 flex items-center justify-center h-full text-[#98989E] text-sm italic">
                            {loading ? 'Fetching images...' : 'No images searched yet'}
                        </div>
                    )}
                 </div>
             </div>

             {selected && (
                 <div className="mt-6 pt-6 border-t border-[#3A3A3C]">
                    <p className="text-[12px] text-[#98989E] font-medium mb-2">Selected Preview</p>
                    <div className="relative rounded-[16px] overflow-hidden border border-[#3A3A3C]">
                        <img src={selected.urls.small} alt="Selection preview" className="w-full aspect-video object-cover" />
                    </div>
                 </div>
             )}
          </div>
        </form>
      </div>
    </main>
  )
}