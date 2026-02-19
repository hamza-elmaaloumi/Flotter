'use client'
import { Loader2 } from 'lucide-react'
import { useLanguage } from './providers/LanguageProvider'

export default function Loading() {
    const { t, language } = useLanguage()


    return (
        <div className="fixed inset-0 bg-[#121212] flex flex-col items-center justify-center z-[9999]">
            <div className="flex flex-col items-center gap-4">
                {/* Animated Spinner */}
                <div className="relative">
                    <Loader2
                        className="w-10 h-10 text-[#3B82F6] animate-spin"
                        strokeWidth={2.5}
                    />
                    {/* Subtle Glow Effect */}
                    <div className="absolute inset-0 bg-[#3B82F6]/20 blur-xl rounded-full animate-pulse" />
                </div>

                {/* Loading Text - Using the project's label style */}
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF] animate-pulse">
                    {t('global.loading')}
                </p>
            </div>
        </div>
    )
}