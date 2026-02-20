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
    <div className="relative w-full h-40 bg-[#121212] rounded-[12px] border border-[#2D2D2F] overflow-hidden flex flex-col items-center justify-center">
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
          <p className="text-[11px] font-bold text-[#9CA3AF] tracking-widest uppercase">{steps[step].label}</p>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-5 w-3/4 h-0.5 bg-[#1C1C1E] rounded-full overflow-hidden">
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
              className="absolute w-full max-w-[200px] h-36 bg-[#121212] rounded-[12px] border-2 flex flex-col items-center justify-center shadow-lg"
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
              <h3 className="text-[19px] font-bold text-white">{card.word}</h3>
              
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
    <div className="w-full h-48 bg-[#121212] rounded-[12px] p-4 border border-[#2D2D2F] relative">
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
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#2D2D2F" strokeWidth="1" strokeDasharray="4 4" />
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
            <circle cx={i * (400 / 5)} cy={200 - (data[i].flotter / 100) * 180} r="4" fill="#3B82F6" stroke="#121212" strokeWidth="2" />
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
          <span className="text-[#FFFFFF]">{t('landing.graph.flotter')}</span>
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
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true })
  
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen bg-[#121212] text-white antialiased overflow-x-hidden selection:bg-[#3B82F6]/30">
      <NeuralBackground />
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#FBBF24] to-[#EF4444] origin-left z-50"
        style={{ scaleX }}
      />
      
      <nav className="fixed top-0 w-full z-40 border-b border-[#262626] bg-[#121212]/95 backdrop-blur-xl">
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
            <Link href="/login" className="hidden sm:block text-[#6B7280] hover:text-white text-[11px] font-bold uppercase tracking-widest transition-colors">
              {t('landing.nav.signIn')}
            </Link>
            <Link href="/register" className="bg-[#3B82F6] text-white px-5 py-2.5 rounded-[12px] text-[13px] font-bold uppercase tracking-widest hover:bg-[#1D4ED8] transition-all">
              {t('landing.nav.getStarted')}
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative pt-[140px] pb-[80px] px-4 overflow-hidden flex items-center justify-center min-h-[90vh] bg-[#121212]">
        <div className="max-w-5xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
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
              
              <p className="text-[16px] md:text-[18px] text-[#9CA3AF] mb-10 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                {t('landing.hero.desc1')}
                <span className="text-white font-bold uppercase text-[15px]"> {t('landing.hero.desc2')}</span>
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
                
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 rounded-[12px] border border-[#262626] text-[#6B7280] hover:text-white hover:bg-[#1A1A1A] transition-all text-[13px] font-bold uppercase tracking-widest">
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
      <section className="border-y border-[#262626] bg-[#121212]">
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
                className="bg-[#1C1C1E] p-4 rounded-[12px] border border-[#2D2D2F]"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-[24px] font-bold mb-1" style={{ color: stat.color }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[#FFFFFF] text-[13px] font-bold mb-1">{stat.label}</div>
                <div className="text-[#6B7280] text-[10px] uppercase tracking-wider font-bold">{stat.source}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-24 px-4 bg-[#121212]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold uppercase text-[#EF4444] tracking-widest mb-3">{t('landing.problem.challenge')}</h2>
            <h3 className="text-[28px] font-bold text-[#FFFFFF]">{t('landing.problem.title')}</h3>
            <p className="text-[#9CA3AF] text-[15px] mt-2">{t('landing.problem.subtitle')}</p>
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
                <div key={i} className="bg-[#1C1C1E] rounded-[12px] p-5 border border-[#2D2D2F] flex gap-4">
                  <div className="w-10 h-10 rounded-[12px] bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0 border border-[#EF4444]/20">
                    <X className="text-[#EF4444]" size={18} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-[#9CA3AF] text-[13px] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-24 px-4 bg-[#121212] relative border-t border-[#262626]">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-[11px] font-bold uppercase text-[#3B82F6] tracking-widest mb-3">{t('landing.methodology.title')}</h2>
            <h3 className="text-[28px] font-bold text-[#FFFFFF]">{t('landing.methodology.heading1')}<span className="text-[#3B82F6]">Flotter</span>{t('landing.methodology.heading2')}</h3>
            <p className="text-[#9CA3AF] text-[15px] mt-2">{t('landing.methodology.subtitle')}</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-[12px]">
            <HolographicCard className="bg-[#1C1C1E] rounded-[16px] border border-[#2D2D2F] p-8 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-[12px] bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20">
                  <Sparkles className="text-[#3B82F6]" size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#3B82F6] bg-[#3B82F6]/10 px-3 py-1 rounded-full">{t('landing.methodology.step1')}</span>
              </div>
              <h3 className="text-[19px] font-bold text-white mb-2">{t('landing.methodology.step1Title')}</h3>
              <p className="text-[#9CA3AF] text-[15px] mb-8 leading-relaxed">{t('landing.methodology.step1Desc')}</p>
              <AIGenerationVisualizer />
            </HolographicCard>
            
            <HolographicCard className="bg-[#1C1C1E] rounded-[16px] border border-[#2D2D2F] p-8 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-[12px] bg-[#FACC15]/10 flex items-center justify-center border border-[#FACC15]/20">
                  <Layers className="text-[#FACC15]" size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#FACC15] bg-[#FACC15]/10 px-3 py-1 rounded-full">{t('landing.methodology.step2')}</span>
              </div>
              <h3 className="text-[19px] font-bold text-white mb-2">{t('landing.methodology.step2Title')}</h3>
              <p className="text-[#9CA3AF] text-[15px] mb-8 leading-relaxed">{t('landing.methodology.step2Desc')}</p>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: t('landing.methodology.visual'), color: "#3B82F6", icon: Eye },
                  { label: t('landing.methodology.context'), color: "#FACC15", icon: BookOpen },
                  { label: t('landing.methodology.emotion'), color: "#EF4444", icon: Heart }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center justify-center text-center p-3 rounded-[12px] border border-[#2D2D2F] bg-[#121212]">
                    <item.icon size={20} className="mb-2" style={{ color: item.color }} />
                    <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: item.color }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </HolographicCard>
            
            <HolographicCard className="bg-[#1C1C1E] rounded-[16px] border border-[#2D2D2F] p-8 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-[12px] bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
                  <Zap className="text-[#10B981]" size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#10B981] bg-[#10B981]/10 px-3 py-1 rounded-full">{t('landing.methodology.step3')}</span>
              </div>
              <h3 className="text-[19px] font-bold text-white mb-2">{t('landing.methodology.step3Title')}</h3>
              <p className="text-[#9CA3AF] text-[15px] mb-8 leading-relaxed">{t('landing.methodology.step3Desc')}</p>
              <AutoSwipeDemo />
            </HolographicCard>
            
            <HolographicCard className="bg-[#1C1C1E] rounded-[16px] border border-[#2D2D2F] p-8 group">
              <div className="flex items-start justify-between mb-6">
                <div className="w-16 h-16 rounded-[12px] bg-[#EF4444]/10 flex items-center justify-center border border-[#EF4444]/20">
                  <Volume2 className="text-[#EF4444]" size={28} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#EF4444] bg-[#EF4444]/10 px-3 py-1 rounded-full">{t('landing.methodology.step4')}</span>
              </div>
              <h3 className="text-[19px] font-bold text-white mb-2">{t('landing.methodology.step4Title')}</h3>
              <p className="text-[#9CA3AF] text-[15px] mb-8 leading-relaxed">{t('landing.methodology.step4Desc')}</p>
              <div className="bg-[#121212] p-4 rounded-[12px] border border-[#2D2D2F]">
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

      {/* SRS ENGINE */}
      <section className="py-24 px-4 bg-[#121212] border-t border-[#262626]">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute inset-0 bg-[#3B82F6]/10 blur-[80px] rounded-full" />
            <div className="relative bg-[#1C1C1E] rounded-[16px] border border-[#2D2D2F] p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-[15px] font-bold text-white">{t('landing.srs.predictionEngine')}</h4>
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
                  <div key={i} className="flex items-center gap-4 p-3 rounded-[12px] bg-[#121212] border border-[#2D2D2F]">
                    <div className="w-20 font-bold text-[13px] text-white">{item.word}</div>
                    <div className="flex-1 h-1.5 bg-[#1C1C1E] rounded-full overflow-hidden">
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
            <h3 className="text-[28px] font-bold text-[#FFFFFF] mb-4">
              {t('landing.srs.optimized')}<span className="text-[#3B82F6]">{t('landing.srs.srs')}</span>
            </h3>
            <p className="text-[#9CA3AF] text-[15px] mb-8 leading-relaxed">
              {t('landing.srs.desc1')}<span className="text-white font-bold">{t('landing.srs.desc2')}</span>
              <span className="text-white font-bold">{t('landing.srs.desc3')}</span>
              <span className="text-white font-bold">{t('landing.srs.desc4')}</span>
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
                  <span className="text-[15px] font-medium text-[#D1D5DB]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* GAMIFICATION */}
      <section className="py-24 px-4 bg-[#121212] border-t border-[#262626]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-[11px] font-bold uppercase text-[#FACC15] tracking-widest mb-3">{t('landing.gamification.habits')}</h2>
            <h3 className="text-[28px] font-bold text-white mb-4">{t('landing.gamification.momentum')}</h3>
            <p className="text-[#9CA3AF] text-[15px] mb-12 max-w-sm mx-auto">
              {t('landing.gamification.consistency')}
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div className="bg-[#1C1C1E] rounded-[16px] p-8 border border-[#2D2D2F] relative overflow-hidden text-left">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FACC15]/05 rounded-full blur-[80px]" />
              <div className="w-16 h-16 rounded-[12px] bg-[#FACC15]/10 flex items-center justify-center mb-6 border border-[#FACC15]/20">
                <Clock className="text-[#FACC15]" size={28} />
              </div>
              <h3 className="text-[19px] font-bold text-white mb-2">{t('landing.gamification.streakTitle')}</h3>
              <p className="text-[#9CA3AF] text-[15px] mb-8">
                {t('landing.gamification.streakDesc')}
              </p>
              <div className="flex justify-start gap-2">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`w-8 h-10 rounded-[8px] ${i < 5 ? 'bg-[#FACC15]' : 'bg-[#121212] border border-[#2D2D2F]'} flex items-center justify-center`}>
                    {i < 5 && <Zap size={16} className="text-[#121212]" fill="currentColor" />}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-[11px] font-bold uppercase tracking-widest text-[#FACC15]">{t('landing.gamification.streakCount')}</div>
            </motion.div>
            
            <motion.div className="bg-[#1C1C1E] rounded-[16px] p-8 border border-[#2D2D2F] relative overflow-hidden text-left">
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#3B82F6]/05 rounded-full blur-[80px]" />
              <div className="w-16 h-16 rounded-[12px] bg-[#3B82F6]/10 flex items-center justify-center mb-6 border border-[#3B82F6]/20">
                <Trophy className="text-[#3B82F6]" size={28} />
              </div>
              <h3 className="text-[19px] font-bold text-white mb-2">{t('landing.gamification.rankingTitle')}</h3>
              <p className="text-[#9CA3AF] text-[15px] mb-8">
                {t('landing.gamification.rankingDesc')}
              </p>
              <div className="space-y-2">
                {[
                  { rank: 1, name: "Alex M.", xp: "12k", color: "#FACC15" },
                  { rank: 2, name: t('landing.gamification.you'), xp: "11k", color: "#3B82F6", highlight: true }
                ].map((user, i) => (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-[12px] ${user.highlight ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/30' : 'bg-[#121212] border border-[#2D2D2F]'}`}>
                    <div className="flex items-center gap-3">
                      <span className="text-[13px] font-bold w-6" style={{ color: user.color }}>#{user.rank}</span>
                      <span className={`text-[13px] font-bold ${user.highlight ? "text-white" : "text-[#6B7280]"}`}>{user.name}</span>
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
      <section className="py-24 px-4 bg-[#121212] relative overflow-hidden border-t border-[#262626]">
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
      <footer className="border-t border-[#262626] py-12 px-4 bg-[#121212]">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#3B82F6] rounded-[8px] flex items-center justify-center">
              <Zap size={16} className="text-white" fill="white" />
            </div>
            <span className="font-bold text-[18px] tracking-tight">Flotter</span>
          </div>
          
          <div className="flex gap-8 text-[11px] font-bold uppercase tracking-widest text-[#6B7280]">
            <Link href="#" className="hover:text-white transition-colors">{t('landing.footer.science')}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t('landing.footer.privacy')}</Link>
            <Link href="#" className="hover:text-white transition-colors">{t('landing.footer.terms')}</Link>
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[#6B7280]">
              <Zap size={14} fill="#6B7280" />
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