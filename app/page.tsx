"use client"

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useSpring, useInView, AnimatePresence } from 'framer-motion'
import {
  Zap,
  Sparkles,
  ArrowRight,
  Brain,
  Layers,
  Clock,
  Trophy,
  Volume2,
  ChevronRight,
  Play,
  X,
  Eye,
  BookOpen,
  Heart
} from 'lucide-react'

import { useLanguage } from './providers/LanguageProvider'
import { useTheme } from './providers/ThemeProvider'
import FlotterLogo from './components/FlotterLogo'

// ==========================================
// PREMIUM ANIMATED COMPONENTS
// ==========================================

const NeuralBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    let animationFrameId: number
    let particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      radius: number
    }> = []
    
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    const createParticles = () => {
      particles = []
      const count = Math.min(15, Math.floor(window.innerWidth / 80))
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          radius: Math.random() * 1.5 + 0.5,
        })
      }
    }
    
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach((p, i) => {
        p.x += p.vx
        p.y += p.vy
        
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = '#3B82F6'
        ctx.fill()
        
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          
          if (dist < 120) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - dist / 120)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        })
      })
      
      animationFrameId = requestAnimationFrame(draw)
    }
    
    resize()
    createParticles()
    draw()
    
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
    />
  )
}

const HolographicCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 })
  const cardRef = useRef<HTMLDivElement>(null)
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    })
  }
  
  return (
    <div 
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(59, 130, 246, 0.08), transparent 60%)`,
      }}
    >
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          background: `linear-gradient(${mousePosition.x * 360}deg, transparent 0%, rgba(59, 130, 246, 0.05) 50%, transparent 100%)`
        }}
      />
      {children}
    </div>
  )
}

const AnimatedCounter = ({ value, suffix = "" }: { value: number, suffix?: string }) => {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  
  useEffect(() => {
    if (isInView) {
      const duration = 1500
      const steps = 30
      const increment = value / steps
      let current = 0
      const timer = setInterval(() => {
        current += increment
        if (current >= value) {
          setCount(value)
          clearInterval(timer)
        } else {
          setCount(Math.floor(current))
        }
      }, duration / steps)
      return () => clearInterval(timer)
    }
  }, [isInView, value])
  
  return <span ref={ref}>{count}{suffix}</span>
}

const AIGenerationSVG = () => {
  const { t } = useLanguage()
  return (
  <svg viewBox="0 0 400 320" className="w-full h-full max-w-lg mx-auto drop-shadow-[0_0_20px_rgba(59,130,246,0.1)]">
    <style>{`
      /* Core Variables & Utilities */
      .anim { animation-duration: 14s; animation-iteration-count: infinite; }
      
      /* Phase 1: Input Box */
      @keyframes inputWrap {
        0%, 2% { opacity: 0; transform: scale(0.9) translateY(10px); }
        5%, 12% { opacity: 1; transform: scale(1) translateY(0); }
        15%, 100% { opacity: 0; transform: scale(0.8) translateY(-10px); }
      }
      @keyframes typeText {
        0%, 4% { clip-path: inset(0 100% 0 0); }
        8%, 100% { clip-path: inset(0 0 0 0); }
      }
      @keyframes cursorBlink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

      /* Phase 2: Integration Core Base */
      @keyframes corePhase {
        0%, 13% { opacity: 0; transform: scale(0.5); }
        15%, 70% { opacity: 1; transform: scale(1); }
        73%, 100% { opacity: 0; transform: scale(1.5); }
      }
      @keyframes corePulse {
        0%, 55% { fill: #1E293B; }
        58%, 70% { fill: #3B82F6; filter: url(#glow-strong); transform: scale(1.1); }
        71%, 100% { fill: #1E293B; }
      }
      @keyframes ringSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      @keyframes ringFastSpin {
        0%, 55% { transform: rotate(0deg); animation-timing-function: ease-in; opacity: 0.2; }
        58%, 70% { transform: rotate(180deg); opacity: 1; stroke: #3B82F6; }
        71%, 100% { transform: rotate(360deg); opacity: 0.2; }
      }

      /* Phase 3: Sequential Step Nodes */
      @keyframes n-context { 0%, 18% { opacity: 0; transform: scale(0.5); } 20%, 70% { opacity: 1; transform: scale(1); } 72%, 100% { opacity: 0; transform: scale(0.8); } }
      @keyframes n-image { 0%, 28% { opacity: 0; transform: scale(0.5); } 30%, 70% { opacity: 1; transform: scale(1); } 72%, 100% { opacity: 0; transform: scale(0.8); } }
      @keyframes n-vibe { 0%, 38% { opacity: 0; transform: scale(0.5); } 40%, 70% { opacity: 1; transform: scale(1); } 72%, 100% { opacity: 0; transform: scale(0.8); } }
      @keyframes n-sense { 0%, 48% { opacity: 0; transform: scale(0.5); } 50%, 70% { opacity: 1; transform: scale(1); } 72%, 100% { opacity: 0; transform: scale(0.8); } }

      /* Node Activation Colors */
      @keyframes fill-context { 0%, 21% { fill: #1E293B; filter: none; } 23%, 70% { fill: #3B82F6; filter: url(#glow-strong); } 71%, 100% { fill: #1E293B; } }
      @keyframes fill-image { 0%, 31% { fill: #1E293B; filter: none; } 33%, 70% { fill: #FBBF24; filter: url(#glow-strong); } 71%, 100% { fill: #1E293B; } }
      @keyframes fill-vibe { 0%, 41% { fill: #1E293B; filter: none; } 43%, 70% { fill: #8B5CF6; filter: url(#glow-strong); } 71%, 100% { fill: #1E293B; } }
      @keyframes fill-sense { 0%, 51% { fill: #1E293B; filter: none; } 53%, 70% { fill: #10B981; filter: url(#glow-strong); } 71%, 100% { fill: #1E293B; } }

      /* Connecting Data Beams */
      @keyframes beamDash { to { stroke-dashoffset: -40; } }
      @keyframes b-context { 0%, 21% { opacity: 0; } 22%, 70% { opacity: 0.8; } 71%, 100% { opacity: 0; } }
      @keyframes b-image { 0%, 31% { opacity: 0; } 32%, 70% { opacity: 0.8; } 71%, 100% { opacity: 0; } }
      @keyframes b-vibe { 0%, 41% { opacity: 0; } 42%, 70% { opacity: 0.8; } 71%, 100% { opacity: 0; } }
      @keyframes b-sense { 0%, 51% { opacity: 0; } 52%, 70% { opacity: 0.8; } 71%, 100% { opacity: 0; } }

      /* Phase 4: Final Centered Card */
      @keyframes cardGen {
        0%, 68% { opacity: 0; transform: scale(0.6) translateY(40px); }
        73%, 94% { opacity: 1; transform: scale(1) translateY(0); }
        97%, 100% { opacity: 0; transform: scale(0.9) translateY(-20px); }
      }
      @keyframes cardImg { 0%, 73% { opacity: 0; transform: scale(0.95); } 76%, 100% { opacity: 1; transform: scale(1); } }
      @keyframes cardWord { 0%, 75% { opacity: 0; transform: translateY(10px); } 78%, 100% { opacity: 1; transform: translateY(0); } }
      @keyframes cardSent { 0%, 77% { opacity: 0; transform: translateY(10px); } 80%, 100% { opacity: 1; transform: translateY(0); } }

      /* Timeline Class Assignments */
      .input-wrap { animation-name: inputWrap; animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transform-origin: 200px 160px; }
      .input-text { animation-name: typeText; animation-timing-function: steps(12, end); }
      .cursor { animation: cursorBlink 0.8s infinite; }
      
      .core-wrap { animation-name: corePhase; animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transform-origin: 200px 160px; }
      .core-inner { animation-name: corePulse; transform-origin: 200px 160px; }
      .core-ring { animation: ringSpin 10s linear infinite; transform-origin: 200px 160px; }
      .core-ring-fast { animation: ringFastSpin 14s ease-in-out infinite; transform-origin: 200px 160px; }

      .node-c { animation-name: n-context; transform-origin: 70px 160px; }
      .node-i { animation-name: n-image; transform-origin: 200px 50px; }
      .node-v { animation-name: n-vibe; transform-origin: 330px 160px; }
      .node-s { animation-name: n-sense; transform-origin: 200px 270px; }

      .fill-c { animation-name: fill-context; }
      .fill-i { animation-name: fill-image; }
      .fill-v { animation-name: fill-vibe; }
      .fill-s { animation-name: fill-sense; }

      .beam-c { animation-name: b-context; stroke: #3B82F6; }
      .beam-i { animation-name: b-image; stroke: #FBBF24; }
      .beam-v { animation-name: b-vibe; stroke: #8B5CF6; }
      .beam-s { animation-name: b-sense; stroke: #10B981; }
      .beam-flow { stroke-dasharray: 8 8; animation: beamDash 1s linear infinite; }

      .card-wrap { animation-name: cardGen; animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: 200px 160px; }
      .card-img { animation-name: cardImg; transform-origin: 200px 91px; }
      .card-word { animation-name: cardWord; }
      .card-sent { animation-name: cardSent; }
    `}</style>

    <defs>
      <filter id="glow-strong" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="4" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="cardImgGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
      </linearGradient>
      <clipPath id="imgClip">
        <rect x="106" y="36" width="188" height="110" rx="10" />
      </clipPath>
    </defs>

    {/* PHASE 1: INPUT */}
    <g className="anim input-wrap">
      <rect x="120" y="140" width="160" height="40" rx="8" fill="#14151A" stroke="#3B82F6" strokeWidth="1.5" filter="drop-shadow(0 4px 12px rgba(59,130,246,0.3))" />
      <g className="anim input-text">
        <text x="200" y="165" fill="#FFFFFF" fontFamily="monospace" fontSize="15" fontWeight="bold" textAnchor="middle" letterSpacing="1">
          Ephemeral<tspan className="cursor" fill="#3B82F6">_</tspan>
        </text>
      </g>
    </g>

    {/* PHASE 2: ENGINE DISCS & DATA FLOW */}
    <g className="anim core-wrap">
      {/* Beams */}
      <line x1="92" y1="160" x2="168" y2="160" strokeWidth="2" className="anim beam-c beam-flow" />
      <line x1="200" y1="72" x2="200" y2="128" strokeWidth="2" className="anim beam-i beam-flow" />
      <line x1="308" y1="160" x2="232" y2="160" strokeWidth="2" className="anim beam-v beam-flow" />
      <line x1="200" y1="248" x2="200" y2="192" strokeWidth="2" className="anim beam-s beam-flow" />

      {/* Integration Center (Core) */}
      <circle cx="200" cy="160" r="24" fill="#14151A" stroke="#2D3748" strokeWidth="2" />
      <circle cx="200" cy="160" r="32" fill="none" stroke="#475569" strokeWidth="1" strokeDasharray="4 6" className="core-ring" />
      <circle cx="200" cy="160" r="42" fill="none" strokeWidth="1.5" strokeDasharray="20 40 10 30" className="anim core-ring-fast" />
      <circle cx="200" cy="160" r="10" className="anim core-inner" />

      {/* Node 1: Context (Left) */}
      <g className="anim node-c">
        <circle cx="70" cy="160" r="22" fill="#14151A" stroke="#2D3748" strokeWidth="2" />
        <circle cx="70" cy="160" r="6" className="anim fill-c" />
        <text x="70" y="200" fill="#9CA3AF" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">{t('landing.visualizer.contexts').toUpperCase()}</text>
      </g>

      {/* Node 2: Image (Top) */}
      <g className="anim node-i">
        <circle cx="200" cy="50" r="22" fill="#14151A" stroke="#2D3748" strokeWidth="2" />
        <circle cx="200" cy="50" r="6" className="anim fill-i" />
        <text x="200" y="16" fill="#9CA3AF" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">{t('landing.visualizer.semantics').toUpperCase()}</text>
      </g>

      {/* Node 3: Vibe (Right) */}
      <g className="anim node-v">
        <circle cx="330" cy="160" r="22" fill="#14151A" stroke="#2D3748" strokeWidth="2" />
        <circle cx="330" cy="160" r="6" className="anim fill-v" />
        <text x="330" y="200" fill="#9CA3AF" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">{t('landing.visualizer.vibe').toUpperCase()}</text>
      </g>

      {/* Node 4: Sensory (Bottom) */}
      <g className="anim node-s">
        <circle cx="200" cy="270" r="22" fill="#14151A" stroke="#2D3748" strokeWidth="2" />
        <circle cx="200" cy="270" r="6" className="anim fill-s" />
        <text x="200" y="310" fill="#9CA3AF" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">{t('landing.visualizer.visuals').toUpperCase()}</text>
      </g>
    </g>

    {/* PHASE 3: FINAL CENTERED GENERATED CARD */}
    <g className="anim card-wrap">
      {/* Card Base */}
      <rect x="90" y="20" width="220" height="280" rx="16" fill="#1A1D24" stroke="#2D3748" strokeWidth="1.5" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.8))" />

      {/* Card Image Block - Real Image of Yellow Flowers */}
      <g className="anim card-img">
        <rect x="106" y="36" width="188" height="110" rx="10" fill="#101216" />
        <image 
          x="106" 
          y="36" 
          width="188" 
          height="110" 
          preserveAspectRatio="xMidYMid slice" 
          href="https://images.unsplash.com/photo-1621789098261-433128ee8d1e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2glMjBmbG93ZXJ8ZW58MHx8MHx8fDA%3D" 
          clipPath="url(#imgClip)" 
        />
        <rect x="106" y="36" width="188" height="110" rx="10" fill="none" stroke="#262626" strokeWidth="2" pointerEvents="none" />
      </g>

      {/* Card Word & Type */}
      <g className="anim card-word">
        <text x="200" y="176" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">Ephemeral</text>
        <rect x="165" y="188" width="70" height="18" rx="9" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1" />
        <text x="200" y="201" fill="#60A5FA" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1">ADJECTIVE</text>
      </g>

      {/* Card Centered Sentence */}
      <g className="anim card-sent">
        <text x="200" y="232" fill="#D1D5DB" fontSize="12" textAnchor="middle" letterSpacing="0.2">You attempt to capture the</text>
        <text x="200" y="248" fill="#D1D5DB" fontSize="12" textAnchor="middle" letterSpacing="0.2">ephemeral snowflake, but it melts</text>
        <text x="200" y="264" fill="#D1D5DB" fontSize="12" textAnchor="middle" letterSpacing="0.2">away, leaving only a memory.</text>
        
        {/* Aesthetic Centered Dots */}
        <circle cx="200" cy="282" r="2" fill="#4B5563" />
        <circle cx="190" cy="282" r="2" fill="#4B5563" opacity="0.5" />
        <circle cx="210" cy="282" r="2" fill="#4B5563" opacity="0.5" />
      </g>
    </g>
  </svg>
  )
}

const AIGenerationVisualizer = () => {
  const [step, setStep] = useState(0)
  const { t } = useLanguage()
  const { isDark } = useTheme()
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  
  const steps = [
    { icon: Sparkles, label: t('landing.visualizer.semantics'), color: "#3B82F6" },
    { icon: Brain, label: t('landing.visualizer.contexts'), color: "#FBBF24" },
    { icon: Layers, label: t('landing.visualizer.visuals'), color: "#EF4444" },
    { icon: Zap, label: t('landing.visualizer.locked'), color: "#10B981" }
  ]
  
  return (
    <div className={`relative w-full h-40 ${isDark ? 'bg-[#121212]' : 'bg-[#F0F1F3]'} rounded-[12px] border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} overflow-hidden flex flex-col items-center justify-center`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col items-center"
        >
          {React.createElement(steps[step].icon, {
            size: 28,
            className: "mb-2",
            style: { color: steps[step].color }
          })}
          <p className={`text-[11px] font-bold ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} tracking-widest uppercase`}>{steps[step].label}</p>
        </motion.div>
      </AnimatePresence>
      
      <div className={`absolute bottom-5 w-3/4 h-0.5 ${isDark ? 'bg-[#1C1C1E]' : 'bg-[#E2E4E9]'} rounded-full overflow-hidden`}>
        <motion.div 
          className="h-full"
          style={{ backgroundColor: steps[step].color }}
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.8, ease: "linear" }}
          key={`progress-${step}`}
        />
      </div>
    </div>
  )
}

const AutoSwipeDemo = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const initialCards = [
    { id: 1, word: "Ephemeral", color: "#3B82F6" },
    { id: 2, word: "Resilient", color: "#10B981" },
    { id: 3, word: "Luminous", color: "#FBBF24" },
  ]
  
  const [currentIndex, setCurrentIndex] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        if (prev >= initialCards.length) {
          return 0
        }
        return prev + 1
      })
    }, 2000)
    
    return () => clearInterval(interval)
  }, [initialCards.length])
  
  return (
    <div className="relative w-full h-48 flex items-center justify-center pointer-events-none">
      <AnimatePresence mode="popLayout">
        {initialCards.map((card, index) => {
          if (index < currentIndex) return null
          
          const offset = index - currentIndex
          const isCurrent = offset === 0

          return (
            <motion.div
              key={card.id}
              layout
              className={`absolute w-full max-w-[200px] h-36 ${isDark ? 'bg-[#121212]' : 'bg-white'} rounded-[12px] border-2 flex flex-col items-center justify-center shadow-lg`}
              style={{ 
                borderColor: card.color,
                zIndex: initialCards.length - index,
              }}
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ 
                scale: 1 - offset * 0.05, 
                y: offset * 12,
                opacity: 1,
                x: 0,
                rotate: 0
              }}
              exit={{ 
                x: index % 2 === 0 ? 250 : -250, 
                rotate: index % 2 === 0 ? 15 : -15,
                opacity: 0 
              }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h3 className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{card.word}</h3>
              
              <AnimatePresence>
                {isCurrent && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex gap-2 mt-3"
                  >
                    <div className="px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-bold uppercase tracking-wider border border-[#EF4444]/20">
                      {t('landing.demo.review')}
                    </div>
                    <div className="px-2 py-0.5 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-bold uppercase tracking-wider border border-[#10B981]/20">
                      {t('landing.demo.master')}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </AnimatePresence>
      
      <AnimatePresence>
        {currentIndex >= initialCards.length && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col items-center justify-center text-[#10B981]"
          >
            <Trophy size={28} className="mb-2" />
            <p className="text-[11px] font-bold uppercase tracking-widest">{t('landing.demo.sessionComplete')}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const RetentionGraph = () => {
  const { t } = useLanguage()
  const { isDark } = useTheme()
  const data = [
    { day: 0, standard: 100, flotter: 100 },
    { day: 1, standard: 50, flotter: 95 },
    { day: 2, standard: 30, flotter: 88 },
    { day: 3, standard: 15, flotter: 84 },
    { day: 4, standard: 8, flotter: 80 },
    { day: 5, standard: 4, flotter: 78 }
  ]

  const createSmoothPath = (key: 'standard' | 'flotter') => {
    const widthStep = 400 / (data.length - 1)
    let d = `M 0 ${200 - (data[0][key] / 100) * 180}`
    
    for (let i = 1; i < data.length; i++) {
      const prevX = (i - 1) * widthStep
      const prevY = 200 - (data[i - 1][key] / 100) * 180
      const currX = i * widthStep
      const currY = 200 - (data[i][key] / 100) * 180
      
      const cp1X = prevX + widthStep * 0.4
      const cp2X = currX - widthStep * 0.4
      
      d += ` C ${cp1X} ${prevY}, ${cp2X} ${currY}, ${currX} ${currY}`
    }
    return d
  }

  const standardPath = createSmoothPath('standard')
  const flotterPath = createSmoothPath('flotter')

  return (
    <div className={`w-full h-48 ${isDark ? 'bg-[#121212]' : 'bg-[#F0F1F3]'} rounded-[12px] p-4 border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} relative`}>
      <svg viewBox="0 0 400 200" className="w-full h-full overflow-visible">
        <defs>
          <linearGradient id="flotterGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="standardGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#EF4444" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 100, 200].map(y => (
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke={isDark ? "#2D2D2F" : "#E2E4E9"} strokeWidth="1" strokeDasharray="4 4" />
        ))}
        
        <motion.path
          d={`${standardPath} L 400 200 L 0 200 Z`}
          fill="url(#standardGradient)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
        />
        <motion.path
          d={`${flotterPath} L 400 200 L 0 200 Z`}
          fill="url(#flotterGradient)"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.2 }}
          viewport={{ once: true }}
        />

        <motion.path
          d={standardPath}
          fill="none"
          stroke="#EF4444"
          strokeWidth="3"
          strokeDasharray="6,6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
          viewport={{ once: true }}
        />
        <motion.path
          d={flotterPath}
          fill="none"
          stroke="#3B82F6"
          strokeWidth="3"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
          viewport={{ once: true }}
        />

        {data.map((_, i) => (
          <motion.g 
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 + (i * 0.1) }}
            viewport={{ once: true }}
          >
            <circle cx={i * (400 / 5)} cy={200 - (data[i].standard / 100) * 180} r="4" fill="#EF4444" />
            <circle cx={i * (400 / 5)} cy={200 - (data[i].flotter / 100) * 180} r="4" fill="#3B82F6" stroke={isDark ? "#121212" : "#F0F1F3"} strokeWidth="2" />
          </motion.g>
        ))}
      </svg>
      
      <div className="absolute top-3 right-3 flex flex-col gap-1 text-[10px] font-bold uppercase tracking-wider">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-0.5 bg-[#EF4444] border-dashed" />
          <span className="text-[#6B7280]">{t('landing.graph.standard')}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-0.5 bg-[#3B82F6]" />
          <span className={isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}>{t('landing.graph.flotter')}</span>
        </div>
      </div>
    </div>
  )
}

const AudioWaveform = () => {
  const { language } = useLanguage()
  return (
    <div className="flex items-center justify-center gap-1 h-10">
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[#3B82F6] rounded-full"
          animate={{
            height: [6, 12 + Math.random() * 16, 6],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 0.6 + Math.random() * 0.4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.05
          }}
        />
      ))}
      <Volume2 className={`text-[#3B82F6] ${language === 'ar' ? 'mr-2' : 'ml-2'}`} size={16} />
    </div>
  )
}

// ==========================================
// MAIN LANDING PAGE
// ==========================================

export default function LandingPage() {
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true })
  
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen ${isDark ? 'bg-[#121212] text-white' : 'bg-[#F8F9FA] text-[#111827]'} antialiased overflow-x-hidden selection:bg-[#3B82F6]/30`}>
      {isDark && <NeuralBackground />}
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#FBBF24] to-[#EF4444] origin-left z-50"
        style={{ scaleX }}
      />
      
      <nav className={`fixed top-0 w-full z-40 border-b ${isDark ? 'border-[#262626] bg-[#121212]/95' : 'border-[#EBEDF0] bg-white/95'} backdrop-blur-xl`}>
        <div className="max-w-5xl mx-auto px-4 h-[64px] flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-9 h-9 bg-[#3B82F6] rounded-[12px] flex items-center justify-center shadow-lg shadow-[#3B82F6]/20">
              <Zap size={20} className="text-white" fill="white" />
            </div>
            <span className="text-[18px] font-bold tracking-tight">
              Flotter<span className="text-[#3B82F6]">.</span>
            </span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/login" className={`hidden sm:block ${isDark ? 'text-[#6B7280] hover:text-white' : 'text-[#4B5563] hover:text-[#111827]'} text-[11px] font-bold uppercase tracking-widest transition-colors`}>
              {t('landing.nav.signIn')}
            </Link>
            <Link href="/register" className="bg-[#3B82F6] text-white px-5 py-2.5 rounded-[12px] text-[13px] font-bold uppercase tracking-widest hover:bg-[#1D4ED8] transition-all">
              {t('landing.nav.getStarted')}
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className={`relative pt-[140px] pb-[80px] px-4 overflow-hidden flex items-center justify-center min-h-[90vh] ${isDark ? 'bg-[#121212]' : 'bg-[#F8F9FA]'}`}>
        <div className="max-w-5xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <div className="mb-6 flex items-center justify-center lg:justify-start">
                <FlotterLogo isDark={isDark} height={78} />
              </div>

              <motion.div 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3B82F6]/10 border border-[#3B82F6]/30 mb-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3B82F6]" />
                </span>
                <span className="text-[11px] font-bold text-[#3B82F6] uppercase tracking-wider">
                  {t('landing.hero.neuralSync')}
                </span>
              </motion.div>
              
              <h1 className="text-[36px] md:text-[52px] font-bold leading-[1.1] mb-6">
                {t('landing.hero.title1')}
                <span className="text-[#3B82F6]">
                  {t('landing.hero.title2')}
                </span>
              </h1>
              
              <p className={`text-[16px] md:text-[18px] ${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} mb-10 max-w-sm mx-auto lg:mx-0 leading-relaxed`}>
                {t('landing.hero.desc1')}
                <span className={`${isDark ? 'text-white' : 'text-[#111827]'} font-bold uppercase text-[15px]`}> {t('landing.hero.desc2')}</span>
                {t('landing.hero.desc3')}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link 
                  href="/register"
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center px-10 py-4 bg-[#3B82F6] rounded-[12px] font-bold text-white text-[15px] uppercase tracking-widest transition-all hover:bg-[#1D4ED8] shadow-xl shadow-[#3B82F6]/20 active:scale-95"
                >
                  <span className="relative z-10 flex items-center gap-3">
                    {t('landing.hero.startTrial')} <ArrowRight size={19} className={`transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
                  </span>
                </Link>
                
                <button className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-[12px] border ${isDark ? 'border-[#262626] text-[#6B7280] hover:text-white hover:bg-[#1A1A1A]' : 'border-[#EBEDF0] text-[#4B5563] hover:text-[#111827] hover:bg-[#F0F1F3]'} transition-all text-[13px] font-bold uppercase tracking-widest`}>
                  <Play size={14} fill="#FACC15" className="text-[#FACC15]" />
                  {t('landing.hero.watchDemo')}
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto w-full max-w-sm"
            >
              <div className="absolute inset-0 bg-[#3B82F6]/05 blur-[120px] rounded-full" />
              <div className="relative z-10 p-2">
                <AIGenerationSVG />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className={`border-y ${isDark ? 'border-[#262626] bg-[#121212]' : 'border-[#EBEDF0] bg-[#F8F9FA]'}`}>
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: 94, suffix: "%", label: t('landing.stats.retentionRate'), color: "#3B82F6", source: t('landing.stats.neuralSync') },
              { value: 3, suffix: "x", label: t('landing.stats.fasterLearning'), color: "#FACC15", source: t('landing.stats.cognitiveLoad') },
              { value: 50, suffix: "ms", label: t('landing.stats.generation'), color: "#10B981", source: t('landing.stats.edgeEngine') },
              { value: 2, suffix: "min", label: t('landing.stats.dailyAverage'), color: "#EF4444", source: t('landing.stats.sessionFlow') }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                className={`${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} p-4 rounded-[12px] border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'}`}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-[24px] font-bold mb-1" style={{ color: stat.color }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className={`${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'} text-[13px] font-bold mb-1`}>{stat.label}</div>
                <div className="text-[#6B7280] text-[10px] uppercase tracking-wider font-bold">{stat.source}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className={`py-24 px-4 ${isDark ? 'bg-[#121212]' : 'bg-[#F8F9FA]'}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold uppercase text-[#EF4444] tracking-widest mb-3">{t('landing.problem.challenge')}</h2>
            <h3 className={`text-[28px] font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{t('landing.problem.title')}</h3>
            <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mt-2`}>{t('landing.problem.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <RetentionGraph />
            </motion.div>
            
            <motion.div 
              className="space-y-[12px]"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {[
                { title: t('landing.problem.passiveTitle'), desc: t('landing.problem.passiveDesc') },
                { title: t('landing.problem.contextTitle'), desc: t('landing.problem.contextDesc') },
                { title: t('landing.problem.frictionTitle'), desc: t('landing.problem.frictionDesc') }
              ].map((item, i) => (
                <div key={i} className={`${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} rounded-[12px] p-5 border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} flex gap-4`}>
                  <div className="w-10 h-10 rounded-[12px] bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0 border border-[#EF4444]/20">
                    <X className="text-[#EF4444]" size={18} />
                  </div>
                  <div>
                    <h3 className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'} mb-1`}>{item.title}</h3>
                    <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[13px] leading-relaxed`}>{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className={`py-24 px-4 ${isDark ? 'bg-[#121212]' : 'bg-[#F8F9FA]'} relative border-t ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold uppercase text-[#3B82F6] tracking-widest mb-3">{t('landing.methodology.title')}</h2>
            <h3 className={`text-[28px] font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>{t('landing.methodology.heading1')}<span className="text-[#3B82F6]">Flotter</span>{t('landing.methodology.heading2')}</h3>
            <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mt-2`}>{t('landing.methodology.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-[12px]">
            <HolographicCard className={`${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} rounded-[16px] border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} p-8 group`}>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-[12px] bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20">
                  <Sparkles className="text-[#3B82F6]" size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1 rounded-full">{t('landing.methodology.step1')}</span>
              </div>
              <h3 className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'} mb-2`}>{t('landing.methodology.step1Title')}</h3>
              <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mb-8 leading-relaxed`}>{t('landing.methodology.step1Desc')}</p>
              <AIGenerationVisualizer />
            </HolographicCard>
            
            <HolographicCard className={`${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} rounded-[16px] border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} p-8 group`}>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-[12px] bg-[#FACC15]/10 flex items-center justify-center border border-[#FACC15]/20">
                  <Layers className="text-[#FACC15]" size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FACC15] bg-[#FACC15]/10 px-3 py-1 rounded-full">{t('landing.methodology.step2')}</span>
              </div>
              <h3 className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'} mb-2`}>{t('landing.methodology.step2Title')}</h3>
              <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mb-8 leading-relaxed`}>{t('landing.methodology.step2Desc')}</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('landing.methodology.visual'), color: "#3B82F6", icon: Eye },
                  { label: t('landing.methodology.context'), color: "#FACC15", icon: BookOpen },
                  { label: t('landing.methodology.emotion'), color: "#EF4444", icon: Heart }
                ].map((item, i) => (
                  <div key={i} className={`flex flex-col items-center justify-center text-center p-3 rounded-[12px] border ${isDark ? 'border-[#2D2D2F] bg-[#121212]' : 'border-[#E2E4E9] bg-[#F0F1F3]'}`}>
                    <item.icon size={20} className="mb-2" style={{ color: item.color }} />
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: item.color }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </HolographicCard>
            
            <HolographicCard className={`${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} rounded-[16px] border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} p-8 group`}>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-[12px] bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
                  <Zap className="text-[#10B981]" size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full">{t('landing.methodology.step3')}</span>
              </div>
              <h3 className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'} mb-2`}>{t('landing.methodology.step3Title')}</h3>
              <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mb-8 leading-relaxed`}>{t('landing.methodology.step3Desc')}</p>
              <AutoSwipeDemo />
            </HolographicCard>
            
            <HolographicCard className={`${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} rounded-[16px] border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} p-8 group`}>
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-[12px] bg-[#EF4444]/10 flex items-center justify-center border border-[#EF4444]/20">
                  <Volume2 className="text-[#EF4444]" size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#EF4444] bg-[#EF4444]/10 px-3 py-1 rounded-full">{t('landing.methodology.step4')}</span>
              </div>
              <h3 className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'} mb-2`}>{t('landing.methodology.step4Title')}</h3>
              <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mb-8 leading-relaxed`}>{t('landing.methodology.step4Desc')}</p>
              <div className={`${isDark ? 'bg-[#121212]' : 'bg-[#F0F1F3]'} p-4 rounded-[12px] border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'}`}>
                <AudioWaveform />
                <div className="mt-2 flex justify-between text-[10px] text-[#6B7280] font-bold uppercase tracking-widest">
                  <span>0:00</span>
                  <span className="text-[#3B82F6]">{t('landing.audio.processing')}</span>
                  <span>0:05</span>
                </div>
              </div>
            </HolographicCard>
          </div>
        </div>
      </section>

      <section className={`py-24 px-4 ${isDark ? 'bg-[#121212]' : 'bg-[#F8F9FA]'} border-t ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}>
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute inset-0 bg-[#3B82F6]/10 blur-[80px] rounded-full" />
            <div className={`relative ${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} rounded-[16px] border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} p-8`}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className={`text-[15px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'}`}>{t('landing.srs.predictionEngine')}</h4>
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">{t('landing.srs.optimizingIntervals')}</p>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/10 border border-[#10B981]/30">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[10px] text-[#10B981] font-bold uppercase tracking-widest">{t('landing.srs.active')}</span>
                </div>
              </div>
              
              <div className="space-y-4">
                {[
                  { word: "Ephemeral", interval: "2.4d", strength: 85, color: "#3B82F6" },
                  { word: "Resilient", interval: "5.1d", strength: 92, color: "#10B981" },
                  { word: "Luminous", interval: "12.3d", strength: 78, color: "#FACC15" },
                  { word: "Cacophony", interval: "1.2d", strength: 45, color: "#EF4444" }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-4 p-3 rounded-[12px] ${isDark ? 'bg-[#121212]' : 'bg-[#F0F1F3]'} border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'}`}>
                    <div className={`w-20 font-bold text-[13px] ${isDark ? 'text-white' : 'text-[#111827]'}`}>{item.word}</div>
                    <div className={`flex-1 h-1.5 ${isDark ? 'bg-[#1C1C1E]' : 'bg-[#E2E4E9]'} rounded-full overflow-hidden`}>
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.strength}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <div className="text-[10px] text-[#6B7280] font-bold w-10 text-right uppercase">{item.interval}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="order-1 lg:order-2"
          >
            <h2 className="text-[11px] font-bold uppercase text-[#3B82F6] tracking-widest mb-3">{t('landing.srs.recallOptimization')}</h2>
            <h3 className={`text-[28px] font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'} mb-4`}>
              {t('landing.srs.optimized')}<span className="text-[#3B82F6]">{t('landing.srs.srs')}</span>
            </h3>
            <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mb-8 leading-relaxed`}>
              {t('landing.srs.desc1')}<span className={`${isDark ? 'text-white' : 'text-[#111827]'} font-bold`}>{t('landing.srs.desc2')}</span>
              <span className={`${isDark ? 'text-white' : 'text-[#111827]'} font-bold`}>{t('landing.srs.desc3')}</span>
              <span className={`${isDark ? 'text-white' : 'text-[#111827]'} font-bold`}>{t('landing.srs.desc4')}</span>
              {t('landing.srs.desc5')}
            </p>
            
            <ul className="space-y-4">
              {[
                t('landing.srs.feature1'),
                t('landing.srs.feature2'),
                t('landing.srs.feature3')
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0 border border-[#3B82F6]/20">
                    <ChevronRight size={14} className={`text-[#3B82F6] ${language === 'ar' ? 'rotate-180' : ''}`} />
                  </div>
                  <span className={`text-[15px] font-medium ${isDark ? 'text-[#D1D5DB]' : 'text-[#374151]'}`}>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* GAMIFICATION */}
      <section className={`py-24 px-4 ${isDark ? 'bg-[#121212]' : 'bg-[#F8F9FA]'} border-t ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[11px] font-bold uppercase text-[#FACC15] tracking-widest mb-3">{t('landing.gamification.habits')}</h2>
            <h3 className={`text-[28px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'} mb-4`}>{t('landing.gamification.momentum')}</h3>
            <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mb-12 max-w-sm mx-auto`}>
              {t('landing.gamification.consistency')}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div className={`${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} rounded-[16px] p-8 border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} relative overflow-hidden text-left`}>
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FACC15]/05 rounded-full blur-[80px]" />
              <div className="w-16 h-16 rounded-[12px] bg-[#FACC15]/10 flex items-center justify-center mb-6 border border-[#FACC15]/20">
                <Clock className="text-[#FACC15]" size={28} />
              </div>
              <h3 className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'} mb-2`}>{t('landing.gamification.streakTitle')}</h3>
              <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mb-8`}>
                {t('landing.gamification.streakDesc')}
              </p>
              <div className="flex justify-start gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`w-8 h-10 rounded-[8px] ${i < 5 ? 'bg-[#FACC15]' : `${isDark ? 'bg-[#121212] border border-[#2D2D2F]' : 'bg-[#F0F1F3] border border-[#E2E4E9]'}`} flex items-center justify-center`}>
                    {i < 5 && <Zap size={16} className={isDark ? 'text-[#121212]' : 'text-[#111827]'} fill="currentColor" />}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[11px] font-bold uppercase tracking-widest text-[#FACC15]">{t('landing.gamification.streakCount')}</div>
            </motion.div>
            
            <motion.div className={`${isDark ? 'bg-[#1C1C1E]' : 'bg-white'} rounded-[16px] p-8 border ${isDark ? 'border-[#2D2D2F]' : 'border-[#E2E4E9]'} relative overflow-hidden text-left`}>
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#3B82F6]/05 rounded-full blur-[80px]" />
              <div className="w-16 h-16 rounded-[12px] bg-[#3B82F6]/10 flex items-center justify-center mb-6 border border-[#3B82F6]/20">
                <Trophy className="text-[#3B82F6]" size={28} />
              </div>
              <h3 className={`text-[19px] font-bold ${isDark ? 'text-white' : 'text-[#111827]'} mb-2`}>{t('landing.gamification.rankingTitle')}</h3>
              <p className={`${isDark ? 'text-[#9CA3AF]' : 'text-[#4B5563]'} text-[15px] mb-8`}>
                {t('landing.gamification.rankingDesc')}
              </p>
              <div className="space-y-2">
                {[
                  { rank: 1, name: "Alex M.", xp: "12k", color: "#FACC15" },
                  { rank: 2, name: t('landing.gamification.you'), xp: "11k", color: "#3B82F6", highlight: true }
                ].map((user, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-[12px] ${user.highlight ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/30' : `${isDark ? 'bg-[#121212] border border-[#2D2D2F]' : 'bg-[#F0F1F3] border border-[#E2E4E9]'}`}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-bold w-6" style={{ color: user.color }}>#{user.rank}</span>
                      <span className={`text-[13px] font-bold ${user.highlight ? (isDark ? 'text-white' : 'text-[#111827]') : 'text-[#6B7280]'}`}>{user.name}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280]">{user.xp} XP</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={`py-24 px-4 ${isDark ? 'bg-[#121212]' : 'bg-[#F8F9FA]'} relative overflow-hidden border-t ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'}`}>
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[36px] md:text-[52px] font-bold mb-4 leading-tight">
              {t('landing.cta.upgrade')}
              <span className="text-[#3B82F6]">
                {t('landing.cta.pathways')}
              </span>
            </h2>
            <p className="text-[16px] md:text-[18px] text-[#9CA3AF] mb-10 max-w-sm mx-auto leading-relaxed">
              {t('landing.cta.join')}
            </p>
            
            <div className="flex flex-col items-center gap-4">
              <Link 
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-10 py-4 bg-white text-[#121212] rounded-[12px] font-bold text-[15px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10 group"
              >
                {t('landing.cta.startProtocol')}
                <ArrowRight size={19} className={`transition-transform ${language === 'ar' ? 'rotate-180 group-hover:-translate-x-1' : 'group-hover:translate-x-1'}`} />
              </Link>
              <p className="text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
                {t('landing.cta.noCreditCard')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`border-t ${isDark ? 'border-[#262626]' : 'border-[#EBEDF0]'} py-12 px-4 ${isDark ? 'bg-[#121212]' : 'bg-[#F8F9FA]'}`}>
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 flex-shrink-0">
                <svg width="32" height="32" viewBox="0 0 104 104" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8">
                  <defs>
                    <linearGradient id="paint0_footer_15_32" x1="52" y1="0" x2="52" y2="104" gradientUnits="userSpaceOnUse">
                      <stop offset="0" stopColor="#3FA9F5" />
                      <stop offset="1" stopColor="#007ACC" />
                    </linearGradient>
                  </defs>
                  <rect x="0" y="0" width="104" height="104" rx="18" fill="url(#paint0_footer_15_32)" />
                  <path d="M81.5505 49.1111C81.5505 43.7678 79.688 36.7327 75.4033 31.117C71.2328 25.651 64.7039 21.4211 54.888 21.4211C48.0417 21.4211 43.1683 23.001 39.8134 25.6772C36.5093 28.3128 34.1893 32.4018 33.1591 38.4723C32.9377 39.7775 32.1345 40.8988 30.9912 41.499C27.6761 43.2393 25.0129 44.6821 22.986 45.8334C23.6483 46.4013 24.318 47.0968 24.8636 47.936C26.0816 49.8095 26.5721 52.252 25.5771 54.8598C25.0554 56.2271 24.3046 57.8039 23.6523 59.2103C22.9608 60.7013 22.312 62.1389 21.8132 63.5209C21.3067 64.9246 21.0401 66.0458 20.9898 66.8959C20.9418 67.7066 21.1031 67.976 21.1552 68.0512C21.2459 68.182 21.463 68.4269 22.24 68.691C23.0966 68.9821 24.1906 69.1561 25.794 69.3737C28.5917 69.7534 33.1829 70.2107 36.8206 73.1942L37.0201 73.3599C41.1897 76.8629 44.0812 81.9324 45.9274 88.154C46.5872 90.3772 45.3778 92.7322 43.2263 93.4139C41.0747 94.0956 38.7957 92.846 38.136 90.6227C36.6134 85.4919 34.4494 82.0531 31.8768 79.892L31.754 79.79C30.2138 78.5268 28.1027 78.1804 24.7327 77.723C23.2523 77.5221 21.3961 77.2691 19.6937 76.6905C17.9117 76.0848 15.9607 75.0171 14.532 72.9577C13.0646 70.8425 12.7325 68.4621 12.8555 66.3822C12.9762 64.3414 13.5451 62.3304 14.1773 60.5785C14.8174 58.805 15.6108 57.0637 16.3033 55.5706C16.909 54.2649 17.4071 53.2092 17.7793 52.3119C17.5746 52.1376 17.3061 51.9418 16.9632 51.7209C16.6005 51.4873 16.2163 51.264 15.7831 51.0153C15.3953 50.7925 14.8806 50.5006 14.4405 50.2149C14.1009 49.9945 13.2922 49.4647 12.6722 48.6375C12.3286 48.179 11.8187 47.3374 11.7176 46.1633C11.6052 44.8584 12.0453 43.7344 12.6511 42.9356C13.2889 42.0946 14.2502 41.4209 14.8238 41.0286C15.5744 40.5153 16.5386 39.9185 17.6816 39.2486C19.6388 38.1014 22.2655 36.6558 25.5434 34.9179C27.0297 28.26 30.0504 22.8267 34.8335 19.0112C40.0594 14.8426 46.8958 13 54.888 13C67.3297 13 76.1694 18.5195 81.8031 25.9033C87.3226 33.1374 89.7 42.0527 89.7 49.1111C89.7 62.5753 79.6282 76.3707 65.1768 80.9473C65.9663 82.3292 67.3257 84.1874 69.408 86.5595C70.9199 88.2818 70.7944 90.9447 69.1275 92.507C67.4607 94.0694 64.8837 93.9396 63.3718 92.2172C60.7478 89.2281 58.7149 86.4784 57.524 84.0302C56.4619 81.8468 55.3601 78.3984 57.3717 75.3712L57.4297 75.2862C58.0381 74.4172 58.9458 73.8198 59.9679 73.6185C72.8267 71.0859 81.5505 59.334 81.5505 49.1111Z" fill="#082032" />
                  <path d="M58.0964 55.0929C59.8181 54.1388 62.0798 54.6118 63.1481 56.1495C64.2164 57.6872 63.6867 59.7072 61.9651 60.6613C61.1513 61.1123 60.17 61.7229 59.2888 62.3585C58.3539 63.0327 57.755 63.576 57.5096 63.8817C56.8042 64.7607 56.1351 65.5502 55.5458 66.2453C54.9438 66.9553 54.4459 67.543 54.0198 68.085C53.1342 69.2112 52.8501 69.7921 52.7677 70.1619C52.3724 71.9368 50.441 73.0895 48.4537 72.7364C46.4665 72.3834 45.1759 70.6584 45.5712 68.8835C45.9671 67.1058 47.0148 65.5908 48.0152 64.3185C48.532 63.6613 49.1157 62.9739 49.6963 62.2892C50.2895 61.5895 50.904 60.8641 51.5459 60.0642C52.3784 59.027 53.5986 58.0391 54.6791 57.2598C55.8136 56.4416 57.0448 55.6757 58.0964 55.0929Z" fill="#082032" />
                  <path fillRule="evenodd" clipRule="evenodd" d="M45.5353 37.7834C44.6092 41.4293 44.8848 43.9896 46.362 45.4638C47.8394 46.9382 50.3573 47.9022 53.9157 48.3561C53.1083 53.0588 54.0927 55.265 56.8686 54.9747C59.6446 54.6843 61.3124 53.5137 61.8724 51.4628C66.2108 52.7002 68.5621 51.6647 68.9263 48.3561C69.4728 43.3932 66.8357 39.4342 65.7546 39.4342C64.6734 39.4342 61.8724 39.3007 61.8724 37.7834C61.8724 36.2658 58.6005 35.4085 55.6476 35.4085C52.6947 35.4085 54.4718 33.3885 50.4169 34.1866C47.7137 34.7187 46.0864 35.9175 45.5353 37.7834Z" fill="#FFCC00" />
                  <path d="M47.3989 29.2772C48.7907 29.0168 50.0583 28.9062 51.2084 29.0937C52.5778 29.317 53.4728 29.9077 54.0959 30.4637C54.1693 30.5292 54.23 30.5839 54.28 30.6291C54.3236 30.6308 54.3745 30.6319 54.4334 30.6319C56.5042 30.6319 58.7893 30.9109 60.6764 31.5213C61.6045 31.8216 62.6522 32.2702 63.5342 32.9681C64.1496 33.4551 64.8364 34.1968 65.2063 35.1939C65.3732 35.2193 65.5576 35.2407 65.755 35.2571C66.1333 35.2885 66.4899 35.2965 66.7541 35.2965C67.8924 35.2965 68.7663 35.7585 69.2418 36.0639C69.7753 36.4067 70.2279 36.8255 70.5978 37.2293C71.3441 38.0439 72.0213 39.0904 72.5741 40.2554C73.6851 42.5972 74.4668 45.7871 74.0554 49.3383C73.7404 52.058 72.4081 54.5899 69.5137 55.8016C67.7866 56.5246 65.8466 56.615 63.8733 56.3525C63.3428 57.0189 62.701 57.6088 61.9507 58.1094C60.3093 59.2043 58.3396 59.7481 56.2761 59.9533C54.9839 60.0817 53.5676 59.968 52.2426 59.3263C50.8681 58.6606 49.9155 57.583 49.3354 56.3471C48.6953 54.9834 48.4886 53.3922 48.5406 51.7138C45.3686 51.0112 42.6441 49.8467 40.6909 47.9939C37.485 44.9531 37.5667 40.348 38.7594 35.8853C38.7706 35.8433 38.7827 35.8016 38.7955 35.7601C39.9878 31.9239 43.46 30.014 47.3989 29.2772ZM49.7422 35.6779C49.5298 35.6938 49.1993 35.7325 48.7152 35.8231C46.1511 36.3027 45.6035 37.1304 45.4331 37.6254C44.4299 41.4294 45.0988 42.7813 45.4992 43.2015L45.5374 43.2395C46.5271 44.1783 48.6742 45.1656 52.7531 45.6601C53.6909 45.7738 54.5394 46.253 55.1013 46.986C55.6632 47.7191 55.8893 48.6422 55.7271 49.5403C55.5066 50.7608 55.4294 51.7113 55.4486 52.4258C55.4598 52.842 55.5027 53.1316 55.5462 53.3222C55.5532 53.3216 55.5603 53.3212 55.5675 53.3205C56.8879 53.1892 57.6269 52.8866 58.0187 52.6252C58.3454 52.4073 58.5576 52.1412 58.6908 51.6775C58.9362 50.8233 59.5241 50.0986 60.3245 49.6634C61.125 49.2282 62.0722 49.1184 62.9568 49.3582C65.3565 50.0087 66.4347 49.8217 66.7618 49.6848C66.8513 49.6473 66.876 49.6224 66.9148 49.5635C66.9769 49.469 67.1163 49.1955 67.1855 48.598C67.4403 46.3988 66.9477 44.4198 66.2885 43.0303C66.0628 42.5546 65.8372 42.1899 65.6512 41.9343C64.8894 41.8918 63.9352 41.7913 63.0142 41.5576C62.294 41.3748 61.3003 41.0406 60.4224 40.3661C59.6966 39.8085 59.0302 38.9896 58.7312 37.9315C58.658 37.9038 58.5741 37.8742 58.4785 37.8433C57.4713 37.5175 55.9623 37.2998 54.4334 37.2998C53.1457 37.2998 51.9751 37.0896 50.9278 36.5251C50.4238 36.2535 50.0522 35.9547 49.7926 35.7234C49.7754 35.7082 49.7587 35.6929 49.7422 35.6779Z" fill="#082032" />
                </svg>
              </div>
              <span className="font-bold text-[18px] tracking-tight">Flotter</span>
            </Link>
          </div>
          
          <div className={`flex gap-6 ${language === 'ar' ? 'text-[11px] font-bold uppercase tracking-widest' : 'text-[13px] font-medium'} ${isDark ? 'text-[#6B7280]' : 'text-[#4B5563]'}`}>
            <Link href="/legal/mentions" className={`${isDark ? 'hover:text-white' : 'hover:text-[#111827]'} transition-colors whitespace-nowrap`}>{t('globalFooter.legalNotice')}</Link>
            <Link href="/legal/privacy" className={`${isDark ? 'hover:text-white' : 'hover:text-[#111827]'} transition-colors whitespace-nowrap`}>{t('globalFooter.privacyPolicy')}</Link>
            <Link href="/legal/terms" className={`${isDark ? 'hover:text-white' : 'hover:text-[#111827]'} transition-colors whitespace-nowrap`}>{t('globalFooter.termsOfService')}</Link>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[#6B7280]">
              <svg width="14" height="14" viewBox="164 107 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M188.866 120.889C188.866 118.834 188.149 116.128 186.501 113.968C184.897 111.866 182.386 110.239 178.611 110.239C175.978 110.239 174.103 110.847 172.813 111.876C171.542 112.89 170.65 114.462 170.254 116.797C170.168 117.299 169.859 117.73 169.42 117.961C168.145 118.631 167.12 119.185 166.341 119.628C166.596 119.847 166.853 120.114 167.063 120.437C167.531 121.157 167.72 122.097 167.337 123.1C167.137 123.626 166.848 124.232 166.597 124.773C166.331 125.347 166.082 125.9 165.89 126.431C165.695 126.971 165.592 127.402 165.573 127.729C165.555 128.041 165.617 128.145 165.637 128.174C165.672 128.224 165.755 128.318 166.054 128.42C166.383 128.532 166.804 128.598 167.421 128.682C168.497 128.828 170.263 129.004 171.662 130.152L171.738 130.215C173.342 131.563 174.454 133.512 175.164 135.905C175.418 136.76 174.953 137.666 174.125 137.928C173.298 138.191 172.421 137.71 172.168 136.855C171.582 134.881 170.75 133.559 169.76 132.728L169.713 132.688C169.121 132.203 168.309 132.069 167.013 131.893C166.443 131.816 165.729 131.719 165.074 131.496C164.389 131.263 163.639 130.853 163.089 130.061L163.089 130.061C162.525 129.247 162.397 128.332 162.444 127.532C162.491 126.747 162.71 125.973 162.953 125.299C163.199 124.617 163.504 123.948 163.771 123.373C164.003 122.871 164.195 122.465 164.338 122.12C164.259 122.053 164.156 121.978 164.024 121.893C163.885 121.803 163.737 121.717 163.57 121.621C163.421 121.536 163.223 121.423 163.054 121.313C162.923 121.229 162.612 121.025 162.374 120.707C162.242 120.53 162.046 120.207 162.007 119.755C161.964 119.253 162.133 118.821 162.366 118.514L162.366 118.514C162.611 118.19 162.981 117.931 163.201 117.78C163.49 117.583 163.861 117.353 164.301 117.096C165.053 116.654 166.064 116.098 167.324 115.43C167.896 112.869 169.058 110.779 170.897 109.312C172.907 107.709 175.537 107 178.611 107C183.396 107 186.796 109.123 188.963 111.963C191.086 114.745 192 118.174 192 120.889C192 126.067 188.126 131.373 182.568 133.134C182.872 133.665 183.395 134.38 184.195 135.292C184.777 135.955 184.729 136.979 184.088 137.58C183.446 138.181 182.455 138.131 181.874 137.468C180.865 136.318 180.083 135.261 179.625 134.319C179.216 133.48 178.792 132.153 179.566 130.989L179.588 130.956C179.822 130.622 180.171 130.392 180.565 130.315C185.51 129.341 188.866 124.821 188.866 120.889Z" fill={isDark ? '#D1D5DB' : '#1A1C20'} />
                <path fillRule="evenodd" clipRule="evenodd" d="M174.245 115.802C173.821 117.538 173.947 118.757 174.624 119.459C175.301 120.161 176.455 120.62 178.086 120.836C177.716 123.076 178.168 124.126 179.44 123.988C180.712 123.85 181.477 123.292 181.733 122.316C183.722 122.905 184.799 122.412 184.966 120.836C185.217 118.473 184.008 116.588 183.513 116.588C183.017 116.588 181.733 116.524 181.733 115.802C181.733 115.079 180.234 114.671 178.88 114.671C177.527 114.671 178.341 113.709 176.483 114.089C175.244 114.342 174.498 114.913 174.245 115.802Z" fill={isDark ? '#FCD34D' : '#FFCC00'} />
                <path d="M175.638 113.107C176.177 113.006 176.668 112.964 177.113 113.036C177.643 113.123 177.989 113.351 178.231 113.567C178.259 113.592 178.283 113.613 178.302 113.631C178.319 113.631 178.339 113.632 178.361 113.632C179.163 113.632 180.047 113.74 180.778 113.976C181.137 114.092 181.543 114.266 181.884 114.536C182.122 114.725 182.388 115.012 182.531 115.398C182.596 115.407 182.667 115.416 182.744 115.422C182.89 115.434 183.028 115.437 183.131 115.437C183.571 115.437 183.91 115.616 184.094 115.734C184.3 115.867 184.475 116.029 184.619 116.186C184.907 116.501 185.17 116.906 185.384 117.357C185.814 118.263 186.116 119.498 185.957 120.873C185.835 121.926 185.319 122.906 184.199 123.375C183.53 123.655 182.779 123.69 182.015 123.588C181.81 123.846 181.562 124.074 181.271 124.268C180.636 124.692 179.873 124.903 179.075 124.982C178.574 125.032 178.026 124.988 177.513 124.739C176.981 124.482 176.612 124.064 176.388 123.586C176.14 123.058 176.06 122.442 176.08 121.792C174.852 121.52 173.798 121.07 173.042 120.352L173.042 120.353C171.801 119.175 171.832 117.393 172.294 115.665C172.298 115.649 172.303 115.633 172.308 115.617C172.769 114.132 174.114 113.393 175.638 113.107ZM176.545 115.585C176.463 115.591 176.335 115.606 176.148 115.641H176.148C175.155 115.827 174.943 116.147 174.877 116.339C174.489 117.811 174.748 118.335 174.903 118.497L174.918 118.512L174.918 118.512C175.301 118.876 176.132 119.258 177.711 119.449C178.074 119.493 178.402 119.679 178.62 119.962C178.837 120.246 178.925 120.603 178.862 120.951C178.777 121.424 178.747 121.791 178.754 122.068C178.759 122.229 178.775 122.341 178.792 122.415C178.795 122.415 178.798 122.415 178.8 122.414C179.311 122.364 179.598 122.246 179.749 122.145C179.876 122.061 179.958 121.958 180.009 121.778C180.104 121.448 180.332 121.167 180.642 120.999C180.952 120.83 181.318 120.788 181.661 120.881C182.59 121.132 183.007 121.06 183.134 121.007C183.168 120.993 183.178 120.983 183.193 120.96C183.217 120.923 183.271 120.818 183.298 120.586V120.586C183.396 119.735 183.206 118.969 182.95 118.431C182.863 118.247 182.776 118.106 182.704 118.007C182.409 117.99 182.039 117.951 181.683 117.861C181.404 117.79 181.019 117.661 180.68 117.4C180.399 117.184 180.141 116.867 180.025 116.457C179.997 116.447 179.964 116.435 179.927 116.423C179.537 116.297 178.953 116.213 178.361 116.213C177.863 116.213 177.41 116.131 177.004 115.913C176.809 115.808 176.665 115.692 176.565 115.603C176.558 115.597 176.552 115.591 176.545 115.585Z" fill={isDark ? '#D1D5DB' : '#1A1C20'} />
                <path d="M180.845 123.19C181.507 122.823 182.377 123.005 182.788 123.596C183.199 124.187 182.995 124.964 182.333 125.331C182.02 125.505 181.642 125.74 181.303 125.984C180.944 126.243 180.713 126.452 180.619 126.57L180.619 126.57C180.348 126.908 180.09 127.212 179.864 127.479C179.632 127.752 179.441 127.978 179.277 128.187C178.936 128.62 178.827 128.843 178.795 128.985C178.643 129.668 177.9 130.111 177.136 129.976C176.372 129.84 175.875 129.176 176.027 128.494C176.18 127.81 176.583 127.227 176.967 126.738C177.166 126.485 177.391 126.221 177.614 125.957C177.842 125.688 178.078 125.409 178.325 125.102L178.325 125.102C178.646 124.703 179.115 124.323 179.53 124.023C179.967 123.708 180.44 123.414 180.845 123.19Z" fill={isDark ? '#D1D5DB' : '#1A1C20'} />
              </svg>
              <span className="text-[11px] font-bold uppercase tracking-[0.2em]">{t('landing.footer.copyright')}</span>
            </div>
            <p className="text-[#4B5563] text-[11px] font-medium">
              {t('landing.footer.framework')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}