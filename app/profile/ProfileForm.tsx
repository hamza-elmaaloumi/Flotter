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

type ProfileFormProps = {
  user: {
    id: string
    name: string | null
    image: string | null
    email: string | null
  }
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const router = useRouter()
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
      setError(err.response?.data?.error || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center gap-4">
        <div className="relative group">
          <div className="w-24 h-24 rounded-[16px] bg-[#222222] border border-[#2D2D2F] overflow-hidden flex items-center justify-center shadow-xl transition-all group-hover:border-[#3B82F6]/50">
            {image ? (
              <img src={image} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-[#6B7280]" />
            )}
          </div>
          <button 
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-2 -right-2 bg-[#3B82F6] p-2 rounded-[10px] border-[3px] border-[#121212] hover:scale-105 transition-transform shadow-lg"
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
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">Change Profile Photo</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2 block px-1">Display Name</label>
          <input 
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full h-[52px] bg-[#1C1C1E] border border-[#2D2D2F] rounded-[14px] px-5 text-[15px] text-white placeholder-[#4B5563] focus:border-[#3B82F6] outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280] mb-2 block px-1">Email Address (Read Only)</label>
          <div className="w-full h-[52px] bg-[#1C1C1E] opacity-50 border border-[#2D2D2F] rounded-[14px] px-5 flex items-center text-[15px] text-[#9CA3AF]">
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
          Profile updated successfully!
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
            <span>Save Changes</span>
          </>
        )}
      </button>
    </form>
  )
}
