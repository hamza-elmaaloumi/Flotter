"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useUser } from '../../providers/UserProvider'
import Link from 'next/link'
import { Plus, Calendar, GraduationCap, ChevronDown, ChevronLeft, Image as ImageIcon, BookOpen, Check, Shield, Loader2, Sparkles, PenLine, Wand2, Layers, HomeIcon } from 'lucide-react'
import { useLanguage } from '../../providers/LanguageProvider'
import { useTheme } from '../../providers/ThemeProvider'
import AdBanner from '../../components/AdBanner'

// --- Custom Animated SVG Components ---

// 1. MAIN HERO FLAME (New Streak Icon)
const MainAnimatedFlame = ({ size = 20, active = false, className = "" }: { size?: number, active?: boolean, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={`overflow-visible ${className}`}>
    <defs>
      {/* Vibrant inner fill gradient with a subtle animated shift */}
      <linearGradient id="flameFill" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={active ? "#FCA5A5" : "#374151"}>
          {active && <animate attributeName="stop-color" values="#FCA5A5; #FECACA; #FCA5A5" dur="3s" repeatCount="indefinite" />}
        </stop>
        <stop offset="100%" stopColor={active ? "#F87171" : "#1F2937"}>
          {active && <animate attributeName="stop-color" values="#F87171; #FCA5A5; #F87171" dur="3s" repeatCount="indefinite" />}
        </stop>
      </linearGradient>

      {/* Teal border gradient to give it depth */}
      <linearGradient id="flameStroke" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor={active ? "#EF4444" : "#4B5563"} />
        <stop offset="100%" stopColor={active ? "#DC2626" : "#374151"} />
      </linearGradient>

      {/* Soft outer glow filter */}
      <filter id="glowBlur" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="5" result="blur" />
      </filter>

      <path id="streakPath" d="M 58 25 C 50 35, 36 55, 36 80 C 36 95, 47 102, 60 102 C 73 102, 84 95, 84 80 C 84 65, 82 55, 78 52 C 74 49, 68 56, 65 62 C 62 68, 65 45, 58 25 Z" />
    </defs>

    <style>{`
      .flame-core {
        transform-origin: 60px 95px;
        ${active ? 'animation: streakDance 2.5s ease-in-out infinite alternate;' : ''}
      }
      .glow-layer {
        transform-origin: 60px 95px;
        ${active ? 'animation: streakPulse 2s ease-in-out infinite alternate;' : ''}
        opacity: ${active ? '0.55' : '0.2'};
      }
      @keyframes streakDance {
        0%   { transform: scaleX(1) scaleY(1) skewX(0deg); }
        25%  { transform: scaleX(0.95) scaleY(1.05) skewX(-1.5deg); }
        50%  { transform: scaleX(1.03) scaleY(0.97) skewX(1deg); }
        75%  { transform: scaleX(0.97) scaleY(1.03) skewX(-1deg); }
        100% { transform: scaleX(1) scaleY(1) skewX(0deg); }
      }
      @keyframes streakPulse {
        0%   { transform: scale(0.95); opacity: 0.35; }
        100% { transform: scale(1.08); opacity: 0.75; }
      }
    `}</style>

    {/* Underlying glowing aura */}
    <use href="#streakPath" className="glow-layer" fill="none" stroke={active ? "#EF4444" : "#4B5563"} strokeWidth="16" filter="url(#glowBlur)" strokeLinejoin="round" />

    {/* Crisp, primary streak icon */}
    <g className="flame-core">
      <use href="#streakPath" fill="url(#flameFill)" stroke="url(#flameStroke)" strokeWidth="12" strokeLinejoin="round" />
    </g>
  </svg>
)


// 2. WEEK DAY PROGRESS CIRCLE
export const WeekDayFlame = ({
  label,
  filled,
  isToday,
  isFrozen,
  isDark = true,
  className = "",
}: {
  label: string;
  filled: boolean;
  isToday: boolean;
  isFrozen?: boolean;
  isDark?: boolean;
  className?: string;
}) => {
  return (
    <div className={`relative flex flex-col items-center gap-1.5 ${className}`}>
      {/* Circle Holder */}
      <div
        className={`relative w-[32px] h-[32px] rounded-full flex items-center justify-center transition-all duration-300 border ${filled
          ? "bg-[#EF4444] border-[#EF4444] shadow-[0_0_12px_rgba(239,68,68,0.4)]"
          : isFrozen
            ? "bg-[#3B82F6] border-[#3B82F6] shadow-[0_0_12px_rgba(59,130,246,0.3)]"
            : isToday
              ? `${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} border-[2px] border-[#3B82F6] shadow-[0_0_15px_rgba(59,130,246,0.2)]`
              : `${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`
          } ${isToday ? "scale-110" : "scale-100"}`}
      >
        {filled ? (
          <Check size={16} className="text-[#000000]" strokeWidth={3} />
        ) : isFrozen ? (
          <Shield size={14} className="text-[#FFFFFF]" fill="currentColor" fillOpacity={0.2} />
        ) : (
          <div className={`w-1.5 h-1.5 rounded-full ${isToday ? 'bg-[#3B82F6] shadow-[0_0_8px_#3B82F6]' : isDark ? 'bg-[#2D2D2F]' : 'bg-[#D1D5DB]'}`} />
        )}

        {/* Floating Ring for Today */}
        {isToday && !filled && !isFrozen && (
          <div className="absolute inset-[-4px] rounded-full border border-[#3B82F6]/30 animate-[ping_2s_infinite]" />
        )}
      </div>

      {/* Day Label */}
      <span className={`text-[10px] font-bold uppercase tracking-wider ${isToday ? (isDark ? "text-[#FFFFFF]" : "text-[#111827]") : filled ? "text-[#EF4444]" : isFrozen ? "text-[#3B82F6]" : "text-[#6B7280]"
        }`}>
        {label}
      </span>

      {/* Active Today Pulse removed as it's now a floating ring */}
    </div>
  );
};

// --- Other Icons (Zaps, Sparkles, etc.) ---

const AnimatedZap = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`overflow-visible ${className}`}>
    <defs>
      <filter id={`zapGlow-${size}`}>
        <feGaussianBlur stdDeviation="1.5" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" fill="currentColor" filter={`url(#zapGlow-${size})`}>
      <animate attributeName="opacity" values="1; 0.6; 1" dur="1.5s" repeatCount="indefinite" />
    </path>
    <path d="M13 2L3 14H12L11 22L21 10H12L13 2Z" stroke="currentColor" strokeWidth="1" fill="none">
      <animateTransform attributeName="transform" type="scale" values="1; 1.2; 1" dur="1.5s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.8; 0; 0" dur="1.5s" repeatCount="indefinite" />
      <animateTransform attributeName="transform" type="translate" values="0,0; -2,-2; 0,0" dur="1.5s" repeatCount="indefinite" />
    </path>
  </svg>
)

const AnimatedSparkles = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={`overflow-visible ${className}`}>
    <g>
      <animateTransform attributeName="transform" type="rotate" values="0 12 12; 10 12 12; 0 12 12; -10 12 12; 0 12 12" dur="3s" repeatCount="indefinite" />
      <path d="M12 2L14.5 8.5L21 11L14.5 13.5L12 20L9.5 13.5L3 11L9.5 8.5L12 2Z" fill="currentColor">
        <animateTransform attributeName="transform" type="scale" values="1; 1.1; 1" dur="2s" repeatCount="indefinite" />
      </path>
      <circle cx="19" cy="5" r="2" fill="currentColor">
        <animate attributeName="opacity" values="0; 1; 0" dur="1.5s" repeatCount="indefinite" />
        <animate attributeName="r" values="1; 2.5; 1" dur="1.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="5" cy="19" r="2" fill="currentColor">
        <animate attributeName="opacity" values="0; 1; 0" dur="2s" repeatCount="indefinite" begin="0.5s" />
        <animate attributeName="r" values="1; 2.5; 1" dur="2s" repeatCount="indefinite" begin="0.5s" />
      </circle>
    </g>
  </svg>
)



const AnimatedCheck = ({ size = 30, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M20 6L9 17l-5-5" strokeDasharray="24" strokeDashoffset="0">
      <animate attributeName="stroke-dashoffset" values="24;0" dur="0.8s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.4 0 0.2 1" />
    </path>
    <circle cx="12" cy="12" r="14" stroke="currentColor" strokeWidth="2" strokeDasharray="90" strokeDashoffset="0" className="opacity-50">
      <animate attributeName="stroke-dashoffset" values="90;0" dur="1s" fill="freeze" />
    </circle>
  </svg>
)

const AnimatedShield = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`overflow-visible ${className}`}>
    <g>
      <animateTransform attributeName="transform" type="scale" values="1; 1.05; 1" dur="2.5s" repeatCount="indefinite" />
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="currentColor" fillOpacity="0.2" />
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z">
        <animate attributeName="stroke" values="currentColor; #ffffff; currentColor" dur="2.5s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
)

const AnimatedCrown = ({ size = 16, className = "" }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={`overflow-visible ${className}`}>
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,0; 0,-2; 0,0" dur="2s" repeatCount="indefinite" />
      <path d="M2 22H22V20H2V22ZM2 6L7 11L12 2L17 11L22 6V18H2V6Z">
        <animate attributeName="fill" values="currentColor; #fef08a; currentColor" dur="2s" repeatCount="indefinite" />
      </path>
      <path d="M-10 0L-5 24H-3L-8 0Z" fill="#ffffff" opacity="0.4">
        <animateTransform attributeName="transform" type="translate" values="0,0; 40,0" dur="3s" repeatCount="indefinite" />
      </path>
    </g>
  </svg>
)

// --- Sub-components ---
function StatCard({ label, value, loading, icon: Icon, colorClass, isDark }: any) {
  return (
    <div className={`p-3 rounded-[12px] border flex flex-col items-center justify-center text-center transition-all relative overflow-hidden ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
      <div className="flex items-center gap-1.5 mb-1 relative z-10">
        <div className="relative">
          <Icon size={12} className={colorClass} />
          {/* Subtle pulsing glow behind the icon for extra detail */}
          <div className={`absolute inset-0 blur-md rounded-full ${colorClass} opacity-30 animate-pulse`} />
        </div>
        <p className={`text-[11px] font-bold uppercase tracking-wider ${colorClass}`}>
          {label}
        </p>
      </div>
      <p className={`text-[19px] font-bold ${colorClass} relative z-10`}>
        {loading ? <span className="animate-pulse opacity-20">•••</span> : value}
      </p>
    </div>
  )
}

// ─── DUE CARDS STACK ─────────────────────────────────────────────────────────
// SVG logo used inside each stack circle (white fill version for blue bg)
const FlotterLogoWhite = () => (
  <svg width="20" height="20" viewBox="164 107 40 40" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" style={{ display: 'block', transform: 'translate3d(3px,2px,0)' }}>
    <path d="M188.866 120.889C188.866 118.834 188.149 116.128 186.501 113.968C184.897 111.866 182.386 110.239 178.611 110.239C175.978 110.239 174.103 110.847 172.813 111.876C171.542 112.89 170.65 114.462 170.254 116.797C170.168 117.299 169.859 117.73 169.42 117.961C168.145 118.631 167.12 119.185 166.341 119.628C166.596 119.847 166.853 120.114 167.063 120.437C167.531 121.157 167.72 122.097 167.337 123.1C167.137 123.626 166.848 124.232 166.597 124.773C166.331 125.347 166.082 125.9 165.89 126.431C165.695 126.971 165.592 127.402 165.573 127.729C165.555 128.041 165.617 128.145 165.637 128.174C165.672 128.224 165.755 128.318 166.054 128.42C166.383 128.532 166.804 128.598 167.421 128.682C168.497 128.828 170.263 129.004 171.662 130.152L171.738 130.215C173.342 131.563 174.454 133.512 175.164 135.905C175.418 136.76 174.953 137.666 174.125 137.928C173.298 138.191 172.421 137.71 172.168 136.855C171.582 134.881 170.75 133.559 169.76 132.728L169.713 132.688C169.121 132.203 168.309 132.069 167.013 131.893C166.443 131.816 165.729 131.719 165.074 131.496C164.389 131.263 163.639 130.853 163.089 130.061C162.525 129.247 162.397 128.332 162.444 127.532C162.491 126.747 162.71 125.973 162.953 125.299C163.199 124.617 163.504 123.948 163.771 123.373C164.003 122.871 164.195 122.465 164.338 122.12C164.259 122.053 164.156 121.978 164.024 121.893C163.885 121.803 163.737 121.717 163.57 121.621C163.421 121.536 163.223 121.423 163.054 121.313C162.923 121.229 162.612 121.025 162.374 120.707C162.242 120.53 162.046 120.207 162.007 119.755C161.964 119.253 162.133 118.821 162.366 118.514C162.611 118.19 162.981 117.931 163.201 117.78C163.49 117.583 163.861 117.353 164.301 117.096C165.053 116.654 166.064 116.098 167.324 115.43C167.896 112.869 169.058 110.779 170.897 109.312C172.907 107.709 175.537 107 178.611 107C183.396 107 186.796 109.123 188.963 111.963C191.086 114.745 192 118.174 192 120.889C192 126.067 188.126 131.373 182.568 133.134C182.872 133.665 183.395 134.38 184.195 135.292C184.777 135.955 184.729 136.979 184.088 137.58C183.446 138.181 182.455 138.131 181.874 137.468C180.865 136.318 180.083 135.261 179.625 134.319C179.216 133.48 178.792 132.153 179.566 130.989L179.588 130.956C179.822 130.622 180.171 130.392 180.565 130.315C185.51 129.341 188.866 124.821 188.866 120.889Z" fill="black" />
    <path fillRule="evenodd" clipRule="evenodd" d="M174.245 115.802C173.821 117.538 173.947 118.757 174.624 119.459C175.301 120.161 176.455 120.62 178.086 120.836C177.716 123.076 178.168 124.126 179.44 123.988C180.712 123.85 181.477 123.292 181.733 122.316C183.722 122.905 184.799 122.412 184.966 120.836C185.217 118.473 184.008 116.588 183.513 116.588C183.017 116.588 181.733 116.524 181.733 115.802C181.733 115.079 180.234 114.671 178.88 114.671C177.527 114.671 178.341 113.709 176.483 114.089C175.244 114.342 174.498 114.913 174.245 115.802Z" fill="#FCD34D" />
    <path d="M175.638 113.107C176.177 113.006 176.668 112.964 177.113 113.036C177.643 113.123 177.989 113.351 178.231 113.567C178.259 113.592 178.283 113.613 178.302 113.631C178.319 113.631 178.339 113.632 178.361 113.632C179.163 113.632 180.047 113.74 180.778 113.976C181.137 114.092 181.543 114.266 181.884 114.536C182.122 114.725 182.388 115.012 182.531 115.398C182.596 115.407 182.667 115.416 182.744 115.422C182.89 115.434 183.028 115.437 183.131 115.437C183.571 115.437 183.91 115.616 184.094 115.734C184.3 115.867 184.475 116.029 184.619 116.186C184.907 116.501 185.17 116.906 185.384 117.357C185.814 118.263 186.116 119.498 185.957 120.873C185.835 121.926 185.319 122.906 184.199 123.375C183.53 123.655 182.779 123.69 182.015 123.588C181.81 123.846 181.562 124.074 181.271 124.268C180.636 124.692 179.873 124.903 179.075 124.982C178.574 125.032 178.026 124.988 177.513 124.739C176.981 124.482 176.612 124.064 176.388 123.586C176.14 123.058 176.06 122.442 176.08 121.792C174.852 121.52 173.798 121.07 173.042 120.352C171.801 119.175 171.832 117.393 172.294 115.665C172.298 115.649 172.303 115.633 172.308 115.617C172.769 114.132 174.114 113.393 175.638 113.107ZM176.545 115.585C176.463 115.591 176.335 115.606 176.148 115.641C175.155 115.827 174.943 116.147 174.877 116.339C174.489 117.811 174.748 118.335 174.903 118.497L174.918 118.512C175.301 118.876 176.132 119.258 177.711 119.449C178.074 119.493 178.402 119.679 178.62 119.962C178.837 120.246 178.925 120.603 178.862 120.951C178.777 121.424 178.747 121.791 178.754 122.068C178.759 122.229 178.775 122.341 178.792 122.415C178.795 122.415 178.798 122.415 178.8 122.414C179.311 122.364 179.598 122.246 179.749 122.145C179.876 122.061 179.958 121.958 180.009 121.778C180.104 121.448 180.332 121.167 180.642 120.999C180.952 120.83 181.318 120.788 181.661 120.881C182.59 121.132 183.007 121.06 183.134 121.007C183.168 120.993 183.178 120.983 183.193 120.96C183.217 120.923 183.271 120.818 183.298 120.586C183.396 119.735 183.206 118.969 182.95 118.431C182.863 118.247 182.776 118.106 182.704 118.007C182.409 117.99 182.039 117.951 181.683 117.861C181.404 117.79 181.019 117.661 180.68 117.4C180.399 117.184 180.141 116.867 180.025 116.457C179.997 116.447 179.964 116.435 179.927 116.423C179.537 116.297 178.953 116.213 178.361 116.213C177.863 116.213 177.41 116.131 177.004 115.913C176.809 115.808 176.665 115.692 176.565 115.603C176.558 115.597 176.552 115.591 176.545 115.585Z" fill="black" />
    <path d="M180.845 123.19C181.507 122.823 182.377 123.005 182.788 123.596C183.199 124.187 182.995 124.964 182.333 125.331C182.02 125.505 181.642 125.74 181.303 125.984C180.944 126.243 180.713 126.452 180.619 126.57C180.348 126.908 180.09 127.212 179.864 127.479C179.632 127.752 179.441 127.978 179.277 128.187C178.936 128.62 178.827 128.843 178.795 128.985C178.643 129.668 177.9 130.111 177.136 129.976C176.372 129.84 175.875 129.176 176.027 128.494C176.18 127.81 176.583 127.227 176.967 126.738C177.166 126.485 177.391 126.221 177.614 125.957C177.842 125.688 178.078 125.409 178.325 125.102C178.646 124.703 179.115 124.323 179.53 124.023C179.967 123.708 180.44 123.414 180.845 123.19Z" fill="black" />
  </svg>
)

/**
 * DueCardsStack – replaces the standalone due-count number.
 * Renders a red-bordered count badge followed by a row of overlapping blue
 * circles (each containing the Flotter logo) that represent today's due cards.
 *
 * Rules:
 *  - due ≤ 5  → show `due` logo circles, no overflow
 *  - due > 5  → show 4 logo circles + 1 overflow circle displaying +{due-5}
 */
function DueCardsStack({ due, loading, isDark }: { due: number; loading: boolean; isDark: boolean }) {
  const { t } = useLanguage()
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        <div className="w-8 h-8 rounded-full bg-[#EF4444]/20 border-2 border-[#EF4444]/30 animate-pulse" />
        <span className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>{t('learning.due')}</span>
      </div>
    )
  }

  // Separator color matches the bottom-section background so circles look cleanly cut out
  const ringColor = isDark ? '#1C1C1E' : '#FFFFFF'

  const logoCount = due > 5 ? 4 : Math.min(due, 4)
  const overflow = due > 5 ? due - 5 : 0

  return (
    <div className="flex flex-col gap-2">
      {/* Row: count badge + overlapping circles */}
      <div className="flex items-center gap-2">
        {/* Count badge: red stroke, light red bg */}
        <div
          data-testid="due-count-badge"
          className="flex items-center justify-center min-w-[30px] h-[30px] px-1 rounded-full border-2 border-[#EF4444] bg-[#FEE2E2] shrink-0"
        >
          <span className="text-[14px] font-black text-[#EF4444] leading-none">{due}</span>
        </div>

        {/* Overlapping circles */}
        {due > 0 && (
          <div className="flex items-center" data-testid="due-cards-stack">
            {Array.from({ length: logoCount }).map((_, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full bg-[#3B82F6] flex items-center justify-center shrink-0 border-2"
                style={{
                  marginInlineStart: i === 0 ? 0 : -16,
                  zIndex: logoCount - i,
                  borderColor: ringColor,
                  position: 'relative',
                }}
              >
                <FlotterLogoWhite />
              </div>
            ))}
            {overflow > 0 && (
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 ${isDark ? 'bg-[#2D2D2F]' : 'bg-[#F0F1F3]'}`}
                style={{ marginInlineStart: -16, zIndex: 0, borderColor: ringColor, position: 'relative' }}
                data-testid="due-overflow-badge"
              >
                <span className={`text-[9px] font-black leading-none ${isDark ? 'text-[#FFFFFF]' : 'text-[#374151]'}`}>+{overflow}</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Label */}
      <span className={`text-[11px] font-bold uppercase tracking-widest ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
        {due === 0 ? t('learning.mastered') : t('learning.due')}
      </span>
    </div>
  )
}

export default function Home() {
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [isListExpanded, setIsListExpanded] = useState(false)
  const { t, language } = useLanguage()
  const { isDark } = useTheme()

  useEffect(() => {
    async function fetchDash() {
      if (!user?.id) return
      setLoading(true)
      try {
        const res = await axios.get('/api/cards/dash')
        setData(res.data)
      } catch (e: any) {
        console.error('Unable to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchDash()
  }, [user?.id])

  if (loading && !data) {
    return <div className="flex flex-col items-center justify-center py-20">
      <Loader2 size={24} className="animate-spin text-[#3B82F6] mb-4" />
      {/* Typography: label (12px, Bold, Uppercase) */}
      <span className="text-[12px] font-bold text-[#6B7280] uppercase tracking-wider">{t('searchCards.loading')}</span>
    </div>
  }

  const total = data?.totalCardsCount || 0
  const due = data?.dueCardsCount || 0
  const streak = data?.streak || 0
  const totalXp = data?.totalXp || 0
  const lastActiveDate = data?.lastActiveDate
  const isPro = data?.isPro || user?.isPro || false
  const isFinished = data && due === 0 && total > 0
  const completionPercentage = isFinished ? 100 : (total > 0 ? ((total - due) / total) * 100 : 0)

  // Streak status: check if user has been active today
  const isActiveToday = lastActiveDate
    ? new Date(lastActiveDate).toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10)
    : false

  const isNewUser = data && total === 0

  // ─── NEW USER WELCOME SCREEN ───
  if (isNewUser) {
    return (
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen font-sans antialia9sed pb-[64px] ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
        <div className="max-w-lg mx-auto px-4 pt-12 flex flex-col items-center">
          {/* Welcome Illustration */}
          <div className="relative w-[120px] h-[120px] mb-8">
            <svg viewBox="0 0 120 120" fill="none" className="w-full h-full">
              <defs>
                <linearGradient id="welcomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter id="welcomeGlow" x="-30%" y="-30%" width="160%" height="160%">
                  <feGaussianBlur stdDeviation="6" result="blur" />
                </filter>
              </defs>
              <circle cx="60" cy="60" r="50" fill="url(#welcomeGrad)" opacity="0.1">
                <animate attributeName="r" values="50;55;50" dur="3s" repeatCount="indefinite" />
              </circle>
              <circle cx="60" cy="60" r="40" stroke="url(#welcomeGrad)" strokeWidth="2" fill="none" opacity="0.3">
                <animate attributeName="r" values="40;44;40" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <g transform="translate(35, 30)">
                <rect x="0" y="0" width="50" height="60" rx="8" fill="url(#welcomeGrad)" opacity="0.15" stroke="url(#welcomeGrad)" strokeWidth="1.5" />
                <rect x="8" y="10" width="34" height="4" rx="2" fill="url(#welcomeGrad)" opacity="0.4" />
                <rect x="8" y="20" width="28" height="3" rx="1.5" fill="url(#welcomeGrad)" opacity="0.25" />
                <rect x="8" y="27" width="22" height="3" rx="1.5" fill="url(#welcomeGrad)" opacity="0.25" />
                <circle cx="25" cy="45" r="8" fill="url(#welcomeGrad)" opacity="0.2">
                  <animate attributeName="opacity" values="0.2;0.4;0.2" dur="2s" repeatCount="indefinite" />
                </circle>
                <path d="M22 45l3 3 5-6" stroke="url(#welcomeGrad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </g>
            </svg>
          </div>

          {/* Welcome Text */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 border bg-[#3B82F6]/10 border-[#3B82F6]/20">
            <AnimatedSparkles size={12} className="text-[#3B82F6]" />
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#3B82F6]">
              {t('learning.welcomeSubtitle')}
            </span>
          </div>

          <h1 className="text-[24px] font-bold text-center mb-3 tracking-tight">
            {t('learning.welcomeTitle')}
          </h1>
          <p className={`text-[14px] text-center max-w-sm mb-8 leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'}`}>
            {t('learning.welcomeDesc')}
          </p>

          {/* HOW TO CREATE CARDS */}
          <div className="w-full mb-8">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              {t('learning.howToCreate')}
            </h2>

            {/* Option A: AI-powered */}
            <div className={`p-5 rounded-[14px] border mb-3 ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 flex items-center justify-center flex-shrink-0">
                  <Wand2 size={18} className="text-[#8B5CF6]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[14px] font-bold">{t('learning.aiMethodTitle')}</p>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20">
                      {t('learning.recommended')}
                    </span>
                  </div>
                  <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                    {t('learning.aiMethodDesc')}
                  </p>
                </div>
              </div>
            </div>

            {/* Option B: Manual */}
            <div className={`p-5 rounded-[14px] border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-[12px] bg-[#3B82F6]/10 border border-[#3B82F6]/20 flex items-center justify-center flex-shrink-0">
                  <PenLine size={18} className="text-[#3B82F6]" />
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-bold mb-1">{t('learning.manualMethodTitle')}</p>
                  <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                    {t('learning.manualMethodDesc')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* HOW IT WORKS */}
          <div className="w-full mb-10">
            <h2 className={`text-[11px] font-bold uppercase tracking-widest mb-4 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              {t('learning.howItWorks')}
            </h2>
            <div className="w-full space-y-3">
              {[
                { icon: <Plus size={16} strokeWidth={3} />, title: t('learning.welcomeStep1'), desc: t('learning.welcomeStep1Desc'), color: '#3B82F6' },
                { icon: <Sparkles size={16} />, title: t('learning.welcomeStep2'), desc: t('learning.welcomeStep2Desc'), color: '#10B981' },
                { icon: <Layers size={16} />, title: t('learning.welcomeStep3'), desc: t('learning.welcomeStep3Desc'), color: '#FACC15' },
              ].map((step, i) => (
                <div key={i} className={`flex items-start gap-4 p-4 rounded-[14px] border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${step.color}15`, color: step.color, border: `1px solid ${step.color}30` }}
                  >
                    {step.icon}
                  </div>
                  <div>
                    <p className="text-[14px] font-bold mb-0.5">{step.title}</p>
                    <p className={`text-[12px] ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/cards/new"
            className="w-full inline-flex items-center justify-center gap-2 bg-[#3B82F6] text-[#FFFFFF] px-6 py-4 rounded-[14px] font-bold text-[15px] transition-all active:scale-[0.97] shadow-[0_10px_30px_rgba(59,130,246,0.2)] mb-3"
          >
            <Wand2 size={18} />
            {t('learning.welcomeCta')}
          </Link>
          <p className={`text-[11px] text-center ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
            {t('learning.welcomeCtaHint')}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen font-sans antialiased px-[3px] pb-[64px] ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
      {/* Header — matches library/ranking pages */}
      <header dir={language === 'ar' ? 'rtl' : 'ltr'} className={`sticky top-0 z-20 border-b px-4 h-[64px] flex items-center justify-between ${isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-[#E2E4E9]'}`}>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <HomeIcon size={18} className="text-[#3B82F6]" />
            <h1 className="text-[17px] font-bold tracking-[-0.5px]">{t('learning.title')}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-5 relative">

        {/* HERO SECTION REDESIGNED - Vertically split */}
        <section className={`relative overflow-hidden rounded-[14px] border mb-[20px] flex flex-col min-h-[300px] ${isFinished ? 'border-[#10B981]/40' : isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'}`}>
          {/* TOP SECTION (≈60% height) - Muted earthy landscape theme */}
          <div className="relative h-[180px] md:h-[200px] w-full bg-[#292524] overflow-hidden flex items-end justify-center perspective-[1000px]">
            {/* Soft landscape background elements */}
            <div className="absolute top-2 right-2 z-30">
              {total === 0 ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981]">
                  <span className="w-2 h-2 rounded-full bg-[#10B981]" />
                  <span className="text-[10px] font-bold">{language === 'ar' ? 'لا بطاقات' : 'No cards'}</span>
                </div>
              ) : due > 0 ? (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-black text-white">
                  <span className="w-2 h-2 rounded-full bg-white" />
                  <span className="text-[10px] font-bold">{language === 'ar' ? `${due} مستحقة` : `${due} due`}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6]">
                  <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                  <span className="text-[13px] font-bold">{language === 'ar' ? 'لا شيء مستحق' : 'All caught up'}</span>
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-[#3E332D] to-[#292524]" />

            {/* Sun / Moon reflection */}
            <div className="absolute top-[20%] left-[70%] w-[60px] h-[60px] bg-[#E8C39E] rounded-full blur-[20px] opacity-20" />
            {/* Oxford Style Background SVG */}
            <img
              src="/assets/image-gen.png"
              alt="Hero illustration"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0"
              style={{ filter: 'grayscale(100%) contrast(0.95) brightness(0.95)' }}
            />

            {/* Horizontal stack of flashcards */}
            <div className="relative z-10 flex items-center justify-center mb-[20px]">

              {/* Left Card */}
              <div
                className="absolute w-[80px] md:w-[90px] h-[115px] md:h-[130px] bg-white rounded-[12px] shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden opacity-90"
                style={{
                  transform: 'translateX(-55px) translateY(10px) rotate(-10deg) translateZ(-20px)',
                  animation: 'floatSlow 4s ease-in-out infinite alternate'
                }}
              >
                <div className="h-[45%] bg-[#F3F4F6] w-full border-b border-black/5" />
                <div className="h-[55%] p-2 flex flex-col items-center justify-center gap-1.5 w-full">
                  <div className="w-8 h-1.5 md:h-2 bg-[#D1D5DB] rounded-full" />
                  <div className="w-12 h-1 md:h-1.5 bg-[#E5E7EB] rounded-full" />
                </div>
              </div>

              {/* Right Card */}
              <div
                className="absolute w-[80px] md:w-[90px] h-[115px] md:h-[130px] bg-white rounded-[12px] shadow-[0_8px_16px_rgba(0,0,0,0.06)] flex flex-col overflow-hidden opacity-90"
                style={{
                  transform: 'translateX(55px) translateY(10px) rotate(10deg) translateZ(-20px)',
                  animation: 'floatSlowDelayed 4s ease-in-out infinite alternate'
                }}
              >
                <div className="h-[45%] bg-[#F3F4F6] w-full border-b border-black/5" />
                <div className="h-[55%] p-2 flex flex-col items-center justify-center gap-1.5 w-full">
                  <div className="w-8 h-1.5 md:h-2 bg-[#D1D5DB] rounded-full" />
                  <div className="w-12 h-1 md:h-1.5 bg-[#E5E7EB] rounded-full" />
                </div>
              </div>

              {/* Center Card (Front) */}
              <div
                className="relative w-[100px] md:w-[110px] h-[140px] md:h-[155px] bg-white rounded-[14px] shadow-[0_12px_24px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden z-20"
                style={{
                  transform: 'translateY(-5px) translateZ(20px)',
                  animation: 'floatMain 4s ease-in-out infinite alternate'
                }}
              >
                <div className="h-[45%] bg-[#F3F4F6] w-full border-b border-black/5 flex items-center justify-center overflow-hidden">
                  <ImageIcon size={20} className="text-[#D1D5DB]" />
                </div>
                <div className="h-[55%] p-3 flex flex-col items-center justify-center gap-2 w-full">
                  <div className="w-10 h-2 md:h-2.5 bg-[#4ADE80] rounded-full" />
                  <div className="w-14 h-1 md:h-1.5 bg-[#E5E7EB] rounded-full" />
                  <div className="w-10 h-1 md:h-1.5 bg-[#E5E7EB] rounded-full" />
                </div>
              </div>

            </div>
          </div>

          {/* BOTTOM SECTION (≈40% height) - Controls and actionable elements */}
          <div className={`relative flex-1 p-5 md:p-6 flex flex-row items-center justify-between z-20 ${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} border-t ${isDark ? 'border-black/10' : 'border-[#E2E4E9]'}`}>

            {/* Bottom-left: Cards to review — DueCardsStack */}
            <DueCardsStack due={due} loading={loading} isDark={isDark} />

            {/* Bottom-right: Actions */}
            <div className="flex flex-row gap-2 md:gap-3 items-center">
              <Link
                href="/cards/new"
                className="flex items-center justify-center gap-2 px-[16px] md:px-[20px] py-[12px] md:py-[14px] rounded-[12px] font-bold text-[13px] md:text-[14px] transition-all active:scale-[0.95] bg-[#2D2D2F] text-[#FFFFFF] shadow-sm hover:bg-[#343436] border border-[#3A3A3C]"
              >
                <Plus size={16} strokeWidth={3} />
                <span className="hidden sm:inline">{t('learning.new')}</span>
              </Link>
              <Link
                href="/cards/deck"
                className={`flex items-center justify-center gap-2 px-[20px] md:px-[24px] py-[12px] md:py-[14px] rounded-[12px] font-bold text-[13px] md:text-[14px] transition-all active:scale-[0.95] ${isFinished
                  ? "bg-[#374151] text-[#6B7280] cursor-not-allowed"
                  : "bg-[#EF4444] text-[#FFFFFF] shadow-[0_10px_30px_rgba(239,68,68,0.2)]"
                  }`}
              >
                <AnimatedZap size={16} className="text-current" />
                <span>{isFinished ? t('learning.finished') : t('learning.start')}</span>
              </Link>
            </div>
          </div>

          <style dangerouslySetInnerHTML={{
            __html: `
            @keyframes floatMain {
              0% { transform: translateY(-5px) translateZ(20px); }
              100% { transform: translateY(-15px) translateZ(20px); }
            }
            @keyframes floatSlow {
              0% { transform: translateX(-55px) translateY(10px) rotate(-10deg) translateZ(-20px); }
              100% { transform: translateX(-55px) translateY(2px) rotate(-10deg) translateZ(-20px); }
            }
            @keyframes floatSlowDelayed {
              0% { transform: translateX(55px) translateY(2px) rotate(10deg) translateZ(-20px); }
              100% { transform: translateX(55px) translateY(10px) rotate(10deg) translateZ(-20px); }
            }
            @media (min-width: 768px) {
              @keyframes floatSlow {
                0% { transform: translateX(-65px) translateY(10px) rotate(-10deg) translateZ(-20px); }
                100% { transform: translateX(-65px) translateY(2px) rotate(-10deg) translateZ(-20px); }
              }
              @keyframes floatSlowDelayed {
                0% { transform: translateX(65px) translateY(2px) rotate(10deg) translateZ(-20px); }
                100% { transform: translateX(65px) translateY(10px) rotate(10deg) translateZ(-20px); }
              }
            }
          `}} />
        </section>

        {/* PRO MEMBERSHIP FLAG */}
        {isPro && !loading && (
          <section className="mb-[20px]">
            <div className={`relative overflow-hidden rounded-[14px] border border-[#FACC15]/20 p-4 ${isDark ? 'bg-[#1C1C1E]' : 'bg-white'}`}>
              <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] blur-[50px] rounded-full bg-[#FACC15]/8 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-3">
                {/* Animated Pro Flag SVG */}
                <div className="w-11 h-11 rounded-[12px] bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="overflow-visible">
                    <defs>
                      <linearGradient id="proFlagGrad" x1="8" y1="3" x2="20" y2="14" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#fde047" />
                        <stop offset="50%" stopColor="#facc15" />
                        <stop offset="100%" stopColor="#eab308" />
                      </linearGradient>
                      <filter id="proFlagGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="1.5" floodColor="#facc15" floodOpacity="0.5" />
                      </filter>
                    </defs>
                    {/* Flag pole */}
                    <rect x="4" y="2" width="1.8" height="20" rx="0.9" fill="#ca8a04" />
                    {/* Flag body — pennant shape */}
                    <path d="M6 3h13c1 0 1.5 0.8 0.8 1.5L17 8l2.8 3.5c0.7 0.7 0.2 1.5-0.8 1.5H6V3z" fill="url(#proFlagGrad)" filter="url(#proFlagGlow)">
                      <animate attributeName="d" values="M6 3h13c1 0 1.5 0.8 0.8 1.5L17 8l2.8 3.5c0.7 0.7 0.2 1.5-0.8 1.5H6V3z;M6 3h13c1 0 1.5 0.8 0.8 1.5L16.5 8l3.3 3.5c0.7 0.7 0.2 1.5-0.8 1.5H6V3z;M6 3h13c1 0 1.5 0.8 0.8 1.5L17 8l2.8 3.5c0.7 0.7 0.2 1.5-0.8 1.5H6V3z" dur="2s" repeatCount="indefinite" />
                    </path>
                    {/* Star on flag */}
                    <path d="M12 6.2l0.7 1.4 1.6 0.2-1.15 1.1 0.27 1.6L12 9.8l-1.42 0.7 0.27-1.6L9.7 7.8l1.6-0.2z" fill="#fef9c3" opacity="0.85" />
                    {/* Shine streak */}
                    <path d="M8 4.5l2 3" stroke="white" strokeWidth="0.6" strokeLinecap="round" opacity="0.4" />
                    {/* Pole base dot */}
                    <circle cx="4.9" cy="22" r="1.5" fill="#a16207" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[13px] font-bold text-[#FACC15]">{t('subscribe.flotterPro')}</span>
                    <span className="px-2 py-0.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 text-[8px] font-bold text-[#FACC15] uppercase tracking-widest">{t('profile.activeSub')}</span>
                  </div>
                  <p className="text-[11px] text-[#9CA3AF] mt-0.5">{t('learning.tagUnlimited')} · {t('learning.tagNoAds')} · {t('learning.tagStreakFreeze')}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* STREAK & XP SECTION */}
        <section className="mb-[20px]">
          <div className={`relative overflow-hidden rounded-[14px] border p-4 transition-all ${streak > 0 ? (isDark ? 'bg-[#1C1C1E] border-[#EF4444]/20' : 'bg-white border-[#EF4444]/20') : (isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]')
            }`}>
            {streak > 0 && (
              <div className="absolute top-[-30px] right-[-30px] w-[120px] h-[120px] blur-[60px] rounded-full bg-[#EF4444]/10 pointer-events-none" />
            )}
            <div className="relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-[12px] flex items-center justify-center border ${streak > 0 ? 'bg-[#EF4444]/10 border-[#EF4444]/20' : isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'
                  }`}>
                  <MainAnimatedFlame size={32} active={streak > 0} className={streak > 0 ? "text-[#EF4444]" : "text-[#6B7280]"} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[19px] font-bold ${streak > 0 ? 'text-[#EF4444]' : 'text-[#6B7280]'}`}>
                      {loading ? '...' : streak}
                    </span>
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      {t('learning.dayStreak')}
                    </span>
                    {isPro && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20">
                        <AnimatedShield size={8} className="text-[#FACC15]" />
                        <span className="text-[8px] font-bold text-[#FACC15] uppercase tracking-widest">{t('learning.frozen')}</span>
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#6B7280] mt-0.5">
                    {isActiveToday
                      ? `✓ ${t('learning.activeToday')}`
                      : streak > 0
                        ? t('learning.earnXp')
                        : t('learning.startLearning')}
                  </p>
                </div>
              </div>
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] border ${isDark ? 'bg-[#222222] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
                <AnimatedZap size={12} className="text-[#FACC15]" />
                <span className="text-[12px] font-bold text-[#FACC15]">{loading ? '...' : totalXp}</span>
                <span className="text-[10px] text-[#6B7280] font-bold uppercase">XP</span>
              </div>
            </div>

            {/* Streak progress - UPDATED WITH FLAME SHAPES CONTAINING LETTERS */}
            {streak > 0 && (
              <div className={`mt-4 pt-4 border-t flex items-center justify-between px-2 ${isDark ? 'border-[#262626]' : 'border-[#E2E4E9]'}`}>
                {(() => {
                  const weekLabels = language === 'ar'
                    ? ['ن', 'ث', 'ر', 'خ', 'ج', 'س', 'أ']
                    : ['M', 'T', 'W', 'T', 'F', 'S', 'S']
                  const todayIndex = (new Date().getDay() + 6) % 7

                  return weekLabels.map((label, i) => {
                    const isToday = i === todayIndex;
                    const distance = todayIndex - i;

                    let filled = false;
                    let isFrozen = false;

                    if (isToday) {
                      filled = isActiveToday;
                    } else if (distance > 0) {
                      // Check day status relative to streak and last activity
                      const dayDate = new Date();
                      dayDate.setDate(dayDate.getDate() - distance);
                      const dayStr = dayDate.toISOString().slice(0, 10);
                      const lastActiveStr = lastActiveDate ? new Date(lastActiveDate).toISOString().slice(0, 10) : "";

                      if (dayStr === lastActiveStr) {
                        filled = true;
                      } else if (dayStr < lastActiveStr) {
                        // Part of streak before last activity
                        filled = streak > distance;
                      } else if (isPro && streak > 0) {
                        // Days between last active and today are frozen if Pro
                        isFrozen = true;
                      }
                    }

                    return (
                      <div key={i} className="flex flex-col items-center">
                        <WeekDayFlame
                          label={label}
                          filled={filled}
                          isToday={isToday}
                          isFrozen={isFrozen}
                          isDark={isDark}
                          className="transition-transform active:scale-95"
                        />
                      </div>
                    )
                  })
                })()}
              </div>
            )}
          </div>
        </section>

        {/* STREAK FREEZE UPSELL FOR FREE USERS */}
        {!isPro && !loading && streak > 0 && (
          <section className="mb-[20px]">
            <div className={`relative overflow-hidden rounded-[14px] border border-[#FACC15]/20 p-4 ${isDark ? 'bg-[#1C1C1E]' : 'bg-white'}`}>
              <div className="absolute top-[-30px] right-[-30px] w-[100px] h-[100px] blur-[50px] rounded-full bg-[#FACC15]/10 pointer-events-none" />
              <div className="relative z-10 flex items-start gap-3">
                <div className="w-10 h-10 rounded-[10px] bg-[#FACC15]/10 border border-[#FACC15]/20 flex items-center justify-center flex-shrink-0">
                  <AnimatedShield size={18} className="text-[#FACC15]" />
                </div>
                <div className="flex-1">
                  <p className={`text-[13px] font-bold mb-1 ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{t('learning.protectStreak')}{streak}{t('learning.dayStreakBang')}</p>
                  <p className={`text-[11px] leading-relaxed mb-2 ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                    {t('learning.streakUpsellDesc')}
                  </p>
                  <Link
                    href="/subscribe"
                    className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#FACC15] active:opacity-70 transition-opacity"
                  >
                    <AnimatedCrown size={10} className="text-current" />
                    {t('learning.getStreakProtection')}
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SUBSCRIBE BANNER FOR FREE USERS */}
        {!isPro && !loading && (
          <section className="mb-[20px]">
            <div className={`relative overflow-hidden rounded-[14px] border border-[#FACC15]/30 p-5 ${isDark ? 'bg-gradient-to-br from-[#1C1C1E] to-[#1a1a0f]' : 'bg-gradient-to-br from-white to-[#FFFBEB]'}`}>
              <div className="absolute top-[-40px] right-[-40px] w-[160px] h-[160px] blur-[80px] rounded-full bg-[#FACC15]/10 pointer-events-none" />
              <div className="absolute bottom-[-20px] left-[-20px] w-[80px] h-[80px] blur-[40px] rounded-full bg-[#FACC15]/5 pointer-events-none" />

              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <AnimatedCrown size={14} className="text-[#FACC15]" />
                  <span className="text-[11px] font-bold uppercase tracking-widest text-[#FACC15]">Flotter Pro</span>
                </div>

                <h3 className={`text-[17px] font-bold mb-1 ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>
                  {t('learning.unlockPotential')}
                </h3>
                <p className={`text-[12px] leading-relaxed mb-4 ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
                  {t('learning.bannerDesc1')}<span className="text-[#FACC15] font-bold">{t('subscribe.heroPrice')}</span>{t('learning.bannerDesc2')}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {[t('learning.tagUnlimited'), t('learning.tagNoAds'), t('learning.tagStreakFreeze'), t('learning.tagProBadge')].map((tag) => (
                    <span key={tag} className="px-2 py-1 rounded-full bg-[#FACC15]/10 border border-[#FACC15]/20 text-[9px] font-bold uppercase tracking-widest text-[#FACC15]">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link
                  href="/subscribe"
                  className="inline-flex items-center gap-2 bg-[#FACC15] text-[#000000] px-5 py-3 rounded-[10px] font-bold text-[12px] transition-all active:scale-95 shadow-[0_8px_24px_rgba(250,204,21,0.15)]"
                >
                  <AnimatedZap size={14} className="text-[#000000]" />
                  {t('learning.subscribeBtn')}
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* AD BANNER FOR FREE USERS */}
        {!isPro && !loading && (
          <section className="mb-[20px]">
            <AdBanner dataAdClient="ca-pub-XXXXXXXXXXXXXXXX" dataAdSlot="XXXXXXXXXX" />
          </section>
        )}

        {/* OVERVIEW SECTION - Section Gap: 20px */}
        <section className="mb-[20px]">
          <div className="grid grid-cols-3 gap-[8px]">
            <StatCard
              label={t('learning.review')}
              icon={Calendar}
              value={due}
              loading={loading}
              isDark={isDark}
              colorClass={due > 0 ? "text-[#EF4444]" : "text-[#9CA3AF]"}
            />
            <StatCard
              label={t('learning.learning')}
              icon={BookOpen}
              value={Math.max(0, (total) - (data?.learnedCardsCount || 0) - due)}
              loading={loading}
              isDark={isDark}
              colorClass="text-[#EAB308]" // Premium Gold
            />
            <StatCard
              label={t('learning.mastered2')}
              icon={GraduationCap}
              value={data?.learnedCardsCount || 0}
              loading={loading}
              isDark={isDark}
              colorClass="text-[#3B82F6]" // Primary Blue
            />
          </div>
        </section>


        {/* RECENT ACTIVITY - List Item / Settings Row Implementation */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">{t('learning.activity')}</h2>
            <button
              onClick={() => setIsListExpanded(!isListExpanded)}
              className="text-[11px] font-bold uppercase tracking-widest text-[#10B981] active:opacity-70 transition-colors flex items-center gap-1.5"
            >
              {isListExpanded ? t('learning.hideAll') : t('learning.viewAll')}
              <ChevronDown size={14} className={`transition-transform duration-300 ${isListExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className={`rounded-[14px] overflow-hidden transition-all duration-500 border ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'} ${isListExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'}`}>
            <div className="w-full">
              {!loading && data?.cards?.map((c: any) => {
                const isOpen = expandedId === c.id;
                return (
                  <div key={c.id} className={`border-b last:border-0 ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}>
                    <div
                      onClick={() => setExpandedId(isOpen ? null : c.id)}
                      className={`flex items-center justify-between px-4 h-[56px] cursor-pointer transition-all ${isOpen ? (isDark ? 'bg-[#222222]' : 'bg-[#F0F1F3]') : ''} ${isDark ? 'active:bg-[#222222]' : 'active:bg-[#F0F1F3]'}`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Icon Container Rounded 8px per spec */}
                        <div className={`w-10 h-10 rounded-[8px] overflow-hidden flex-shrink-0 flex items-center justify-center border ${isDark ? 'bg-[#121212] border-[#2D2D2F]' : 'bg-[#F0F1F3] border-[#E2E4E9]'}`}>
                          {c.imageUrl ? (
                            <img src={c.imageUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon size={16} className="text-[#6B7280]" />
                          )}
                        </div>
                        <div className="max-w-[180px] md:max-w-none">
                          <p className={`text-[15px] font-semibold truncate ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{c.sentences[0] || "Untitled"}</p>
                          <p className={`text-[12px] ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>{t('learning.next')} {new Date(c.nextReviewAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'text-[#3B82F6]' : 'text-[#6B7280]'}`}>
                        <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </div>
                    </div>
                    {isOpen && (
                      <div className={`px-4 py-6 animate-in slide-in-from-top-1 duration-200 ${isDark ? 'bg-[#222222]/50' : 'bg-[#F0F1F3]/50'}`}>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          <div className={`md:col-span-4 aspect-video rounded-[12px] overflow-hidden border ${isDark ? 'border-[#2D2D2F] bg-[#121212]' : 'border-[#E2E4E9] bg-[#F0F1F3]'}`}>
                            {c.imageUrl ? <img src={c.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#6B7280] text-[11px] font-bold uppercase">{t('learning.noVisual')}</div>}
                          </div>
                          <div className="md:col-span-8">
                            <p className="text-[11px] font-bold text-[#10B981] uppercase tracking-widest mb-3">{t('learning.contextVariations')}</p>
                            <div className="space-y-2">
                              {c.sentences.map((s: string, i: number) => (
                                <div key={i} className={`p-3 rounded-[12px] border ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`}>
                                  <p className={`text-[14px] leading-snug ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{s}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {!isListExpanded && (
            <div className="mt-2 text-center">
              {/* Caption Typography: 12px, Medium */}
              <p className="text-[12px] text-[#6B7280] font-medium uppercase tracking-widest">{t('learning.listHidden')}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}