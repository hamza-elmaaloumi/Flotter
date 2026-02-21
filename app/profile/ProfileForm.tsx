'use client'

import React, { useState, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { 
  User, 
  Camera, 
  Save, 
  Loader2, 
  X, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react'
import { useLanguage } from '../providers/LanguageProvider'

type ProfileFormProps = {
  user: {
    id: string
    name: string | null
    image: string | null
    email: string | null
  }
  isDark?: boolean
}

export default function ProfileForm({ user, isDark = true }: ProfileFormProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [name, setName] = useState(user.name || '')
  const [image, setImage] = useState(user.image || '')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await axios.patch('/api/profile', {
        name,
        image,
      })
      setSuccess(true)
      router.refresh()
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: any) {
      console.error('Update failed', err)
      setError(err.response?.data?.error || t('profileForm.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className={`w-24 h-24 rounded-[16px] border overflow-hidden flex items-center justify-center shadow-xl transition-all group-hover:border-[#3B82F6]/50 ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
            {image ? (
              <img src={image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-[#6B7280]" />
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`absolute -bottom-2 -right-2 bg-[#3B82F6] p-2 rounded-[10px] border-[3px] hover:scale-105 transition-transform shadow-lg ${isDark ? 'border-[#121212]' : 'border-[#F8F9FA]'}`}
          >
            <Camera size={14} className="text-white" />
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileUpload} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">{t('profileForm.changePhoto')}</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2 block px-1">{t('profileForm.displayName')}</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t('profileForm.namePlaceholder')}
            className={`w-full h-[52px] border rounded-[14px] px-5 text-[15px] placeholder-[#4B5563] focus:border-[#3B82F6] outline-none transition-all ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F] text-white' : 'bg-white border-[#E2E4E9] text-[#111827]'}`}
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2 block px-1">{t('profileForm.emailReadOnly')}</label>
          <div className={`w-full h-[52px] opacity-50 border rounded-[14px] px-5 flex items-center text-[15px] ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F] text-[#9CA3AF]' : 'bg-[#F0F1F3] border-[#E2E4E9] text-[#6B7280]'}`}>
            {user.email}
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-[#EF4444] text-[13px] font-medium bg-[#EF4444]/5 border border-[#EF4444]/10 p-3 rounded-[12px]">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-[#10B981] text-[13px] font-medium bg-[#10B981]/5 border border-[#10B981]/10 p-3 rounded-[12px]">
          <CheckCircle2 size={14} />
          {t('profileForm.success')}
        </div>
      )}

      <button 
        type="submit"
        disabled={loading}
        className="w-full h-[56px] bg-[#3B82F6] hover:bg-[#2563EB] disabled:bg-[#3B82F6]/50 rounded-[16px] text-white font-bold text-[15px] shadow-lg shadow-[#3B82F6]/20 transition-all flex items-center justify-center gap-2"
      >
        {loading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <>
            <Save size={18} />
            <span>{t('profileForm.save')}</span>
          </>
        )}
      </button>
    </form>
  )
}
