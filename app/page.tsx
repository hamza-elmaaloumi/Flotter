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

const AIGenerationSVG = () => (
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
          Serendipity<tspan className="cursor" fill="#3B82F6">_</tspan>
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
        <text x="70" y="200" fill="#9CA3AF" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">CONTEXT</text>
      </g>

      {/* Node 2: Image (Top) */}
      <g className="anim node-i">
        <circle cx="200" cy="50" r="22" fill="#14151A" stroke="#2D3748" strokeWidth="2" />
        <circle cx="200" cy="50" r="6" className="anim fill-i" />
        <text x="200" y="16" fill="#9CA3AF" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">IMAGE</text>
      </g>

      {/* Node 3: Vibe (Right) */}
      <g className="anim node-v">
        <circle cx="330" cy="160" r="22" fill="#14151A" stroke="#2D3748" strokeWidth="2" />
        <circle cx="330" cy="160" r="6" className="anim fill-v" />
        <text x="330" y="200" fill="#9CA3AF" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">VIBE</text>
      </g>

      {/* Node 4: Sensory (Bottom) */}
      <g className="anim node-s">
        <circle cx="200" cy="270" r="22" fill="#14151A" stroke="#2D3748" strokeWidth="2" />
        <circle cx="200" cy="270" r="6" className="anim fill-s" />
        <text x="200" y="310" fill="#9CA3AF" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">SENSORY</text>
      </g>
    </g>

    {/* PHASE 3: FINAL CENTERED GENERATED CARD */}
    <g className="anim card-wrap">
      {/* Card Base */}
      <rect x="90" y="20" width="220" height="280" rx="16" fill="#1A1D24" stroke="#2D3748" strokeWidth="1.5" filter="drop-shadow(0 20px 40px rgba(0,0,0,0.8))" />

      {/* Card Image Block */}
      <g className="anim card-img">
        <rect x="106" y="36" width="188" height="110" rx="10" fill="#101216" stroke="#262626" />
        <circle cx="200" cy="91" r="30" fill="#3B82F6" opacity="0.15" filter="url(#glow-strong)" />
        <circle cx="200" cy="91" r="12" fill="#3B82F6" opacity="0.4" filter="url(#glow-strong)" />
        <path d="M106 100 Q 150 70 200 95 T 294 80 L 294 146 L 106 146 Z" fill="url(#cardImgGrad)" opacity="0.8" clipPath="url(#imgClip)" />
      </g>

      {/* Card Word & Definition */}
      <g className="anim card-word">
        <text x="200" y="180" fill="#FFFFFF" fontSize="22" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">Serendipity</text>
        <rect x="175" y="192" width="50" height="18" rx="9" fill="#3B82F6" fillOpacity="0.15" stroke="#3B82F6" strokeOpacity="0.4" strokeWidth="1" />
        <text x="200" y="205" fill="#60A5FA" fontSize="9" fontWeight="bold" textAnchor="middle" letterSpacing="1">NOUN</text>
      </g>

      {/* Card Centered Sentence */}
      <g className="anim card-sent">
        <text x="200" y="240" fill="#D1D5DB" fontSize="13" textAnchor="middle" letterSpacing="0.2">Finding something beautiful</text>
        <text x="200" y="260" fill="#D1D5DB" fontSize="13" textAnchor="middle" letterSpacing="0.2">without looking for it.</text>
        
        {/* Aesthetic Centered Dots */}
        <circle cx="200" cy="282" r="2" fill="#4B5563" />
        <circle cx="190" cy="282" r="2" fill="#4B5563" opacity="0.5" />
        <circle cx="210" cy="282" r="2" fill="#4B5563" opacity="0.5" />
      </g>
    </g>
  </svg>
)

const AIGenerationVisualizer = () => {
  const [step, setStep] = useState(0)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setStep((prev) => (prev + 1) % 4)
    }, 2000)
    return () => clearInterval(interval)
  }, [])
  
  const steps = [
    { icon: Sparkles, label: "Semantics", color: "#3B82F6" },
    { icon: Brain, label: "Contexts", color: "#FBBF24" },
    { icon: Layers, label: "Visuals", color: "#EF4444" },
    { icon: Zap, label: "Locked", color: "#10B981" }
  ]
  
  return (
    <div className="relative w-full h-40 bg-[#121212] rounded-xl border border-[#262626] overflow-hidden flex flex-col items-center justify-center">
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
            size: 32,
            className: "mb-2",
            style: { color: steps[step].color }
          })}
          <p className="text-xs font-medium text-[#9CA3AF] tracking-wide uppercase">{steps[step].label}</p>
        </motion.div>
      </AnimatePresence>
      
      <div className="absolute bottom-5 w-3/4 h-1 bg-[#1A1A1A] rounded-full overflow-hidden">
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
              className="absolute w-full max-w-[200px] h-36 bg-[#121212] rounded-2xl border-2 flex flex-col items-center justify-center shadow-lg"
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
              <h3 className="text-lg font-bold text-white">{card.word}</h3>
              
              <AnimatePresence>
                {isCurrent && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="flex gap-2 mt-3"
                  >
                    <div className="px-2.5 py-1 rounded-full bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-medium border border-[#EF4444]/20">
                      Review
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-[#10B981]/10 text-[#10B981] text-[10px] font-medium border border-[#10B981]/20">
                      Master
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
            <p className="text-xs font-bold">Session Complete</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const RetentionGraph = () => {
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
    <div className="w-full h-48 bg-[#121212] rounded-xl p-3 border border-[#262626] relative">
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
          <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="#262626" strokeWidth="1" strokeDasharray="4 4" />
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
      
      <div className="absolute top-3 right-3 flex flex-col gap-1 text-[10px]">
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-0.5 bg-[#EF4444] border-dashed" />
          <span className="text-[#9CA3AF]">Standard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-0.5 bg-[#3B82F6]" />
          <span className="text-[#FFFFFF]">Flotter</span>
        </div>
      </div>
    </div>
  )
}

const AudioWaveform = () => {
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
      <Volume2 className="ml-2 text-[#3B82F6]" size={16} />
    </div>
  )
}

// ==========================================
// MAIN LANDING PAGE
// ==========================================

export default function LandingPage() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  
  const heroRef = useRef<HTMLDivElement>(null)
  const isHeroInView = useInView(heroRef, { once: true })
  
  return (
    <div className="min-h-screen bg-[#121212] text-white antialiased overflow-x-hidden selection:bg-[#3B82F6]/30">
      <NeuralBackground />
      
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#FBBF24] to-[#EF4444] origin-left z-50"
        style={{ scaleX }}
      />
      
      <nav className="fixed top-0 w-full z-40 border-b border-[#262626] bg-[#121212]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-7 h-7 bg-[#3B82F6] rounded-md flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.3)]">
              <Zap size={14} className="text-white" fill="currentColor" />
            </div>
            <span className="text-base font-bold tracking-tight">
              Flotter<span className="text-[#3B82F6]">.</span>
            </span>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/login" className="hidden sm:block text-[#9CA3AF] hover:text-white text-xs font-medium transition-colors">
              Sign In
            </Link>
            <Link href="/register" className="bg-[#3B82F6] text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#2563EB] transition-all">
              Get Started
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 overflow-hidden flex items-center justify-center min-h-[90vh] bg-[#121212]">
        <div className="max-w-6xl mx-auto relative z-10 w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-center lg:text-left"
            >
              <motion.div 
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#121212] border border-[#3B82F6]/30 mb-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3B82F6]" />
                </span>
                <span className="text-[10px] font-semibold text-[#3B82F6] uppercase tracking-wider">
                  Neural Sync Technology
                </span>
              </motion.div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.1] mb-4">
                Master Words at{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]">
                  Neural Speed
                </span>
              </h1>
              
              <p className="text-sm md:text-base text-[#9CA3AF] mb-8 max-w-sm mx-auto lg:mx-0 leading-relaxed">
                The flashcard app that doesn't just show you words—it 
                <span className="text-white font-medium"> implants them</span>. 
                AI-generated contexts and zero-friction swiping.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link 
                  href="/register"
                  className="w-full sm:w-auto group relative inline-flex items-center justify-center px-6 py-3 bg-[#3B82F6] rounded-xl font-semibold text-white overflow-hidden transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] text-sm"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Free Trial <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                
                <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[#262626] text-[#9CA3AF] hover:text-white hover:bg-[#1A1A1A] transition-all text-sm font-medium">
                  <Play size={14} className="text-[#FBBF24]" />
                  Watch Demo
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isHeroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto w-full max-w-sm"
            >
              <div className="absolute inset-0 bg-[#3B82F6]/10 blur-[60px] rounded-full" />
              <div className="relative z-10 p-2">
                <AIGenerationSVG />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#262626] bg-[#121212]">
        <div className="max-w-6xl mx-auto px-4 py-6 md:py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { value: 94, suffix: "%", label: "Retention Rate", color: "#3B82F6" },
              { value: 3, suffix: "x", label: "Faster Learning", color: "#FBBF24" },
              { value: 50, suffix: "ms", label: "Generation", color: "#10B981" },
              { value: 2, suffix: "min", label: "Daily Average", color: "#EF4444" }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-xl md:text-2xl font-bold mb-0.5" style={{ color: stat.color }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] md:text-xs text-[#6B7280]">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="py-12 md:py-20 px-4 bg-[#121212]">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">The Memory Epidemic</h2>
            <p className="text-[#9CA3AF] text-xs md:text-sm max-w-sm mx-auto">Why traditional flashcards fail within 72 hours</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <RetentionGraph />
            </motion.div>
            
            <motion.div 
              className="space-y-5"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              {[
                { title: "Passive Recognition", desc: "Reading pairs creates shallow memory traces that decay rapidly." },
                { title: "No Contextual Binding", desc: "Without anchors, words float in isolation, unconnected to you." },
                { title: "Cognitive Friction", desc: "Typing answers and complex menus create impossible resistance." }
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#EF4444]/10 flex items-center justify-center flex-shrink-0 border border-[#EF4444]/20">
                    <X className="text-[#EF4444]" size={16} />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold mb-0.5">{item.title}</h3>
                    <p className="text-[#9CA3AF] text-xs leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="py-12 md:py-20 px-4 bg-[#121212] relative border-t border-[#262626]">
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">The <span className="text-[#3B82F6]">Flotter</span> Method</h2>
            <p className="text-[#9CA3AF] text-xs md:text-sm max-w-sm mx-auto">Four pillars of neural-optimal language acquisition</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <HolographicCard className="bg-[#121212] rounded-2xl border border-[#262626] p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#3B82F6]/10 flex items-center justify-center border border-[#3B82F6]/20">
                  <Sparkles className="text-[#3B82F6]" size={18} />
                </div>
                <span className="text-[10px] font-mono text-[#3B82F6] bg-[#3B82F6]/10 px-2 py-1 rounded">01</span>
              </div>
              <h3 className="text-base font-bold mb-1.5">Instant Generation</h3>
              <p className="text-[#9CA3AF] text-xs mb-5">Enter any word and watch our neural engine craft rich contexts instantly.</p>
              <AIGenerationVisualizer />
            </HolographicCard>
            
            <HolographicCard className="bg-[#121212] rounded-2xl border border-[#262626] p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#FBBF24]/10 flex items-center justify-center border border-[#FBBF24]/20">
                  <Layers className="text-[#FBBF24]" size={18} />
                </div>
                <span className="text-[10px] font-mono text-[#FBBF24] bg-[#FBBF24]/10 px-2 py-1 rounded">02</span>
              </div>
              <h3 className="text-base font-bold mb-1.5">Neural Lock™</h3>
              <p className="text-[#9CA3AF] text-xs mb-5">Visual, Verbal, Emotional, and Tactile cues create redundant memory pathways.</p>
              <div className="grid grid-cols-3 gap-2 mt-auto">
                {[
                  { label: "Visual", color: "#3B82F6", icon: Eye },
                  { label: "Context", color: "#FBBF24", icon: BookOpen },
                  { label: "Emotion", color: "#EF4444", icon: Heart }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center justify-center text-center p-2 rounded-xl border border-[#262626] bg-[#121212]">
                    <item.icon size={16} className="mb-1.5" style={{ color: item.color }} />
                    <div className="text-[9px] font-medium uppercase tracking-wide" style={{ color: item.color }}>{item.label}</div>
                  </div>
                ))}
              </div>
            </HolographicCard>
            
            <HolographicCard className="bg-[#121212] rounded-2xl border border-[#262626] p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#10B981]/10 flex items-center justify-center border border-[#10B981]/20">
                  <Zap className="text-[#10B981]" size={18} />
                </div>
                <span className="text-[10px] font-mono text-[#10B981] bg-[#10B981]/10 px-2 py-1 rounded">03</span>
              </div>
              <h3 className="text-base font-bold mb-1.5">Pure Speed</h3>
              <p className="text-[#9CA3AF] text-xs mb-5">Swipe-to-sync. No typing. Just pure reflex-based learning for 2-minute sessions.</p>
              <AutoSwipeDemo />
            </HolographicCard>
            
            <HolographicCard className="bg-[#121212] rounded-2xl border border-[#262626] p-5 group">
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EF4444]/10 flex items-center justify-center border border-[#EF4444]/20">
                  <Volume2 className="text-[#EF4444]" size={18} />
                </div>
                <span className="text-[10px] font-mono text-[#EF4444] bg-[#EF4444]/10 px-2 py-1 rounded">04</span>
              </div>
              <h3 className="text-base font-bold mb-1.5">Audio Immersion</h3>
              <p className="text-[#9CA3AF] text-xs mb-5">Native-speaker audio trains your ear for rhythm, intonation, and patterns.</p>
              <div className="mt-auto bg-[#121212] p-3 rounded-xl border border-[#262626]">
                <AudioWaveform />
                <div className="mt-2 flex justify-between text-[9px] text-[#6B7280] font-mono">
                  <span>0:00</span>
                  <span>"The ephemeral beauty..."</span>
                  <span>0:05</span>
                </div>
              </div>
            </HolographicCard>
          </div>
        </div>
      </section>

      {/* SRS ENGINE */}
      <section className="py-12 md:py-20 px-4 bg-[#121212] border-t border-[#262626]">
        <div className="max-w-4xl mx-auto grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="order-2 lg:order-1 relative"
          >
            <div className="absolute inset-0 bg-[#3B82F6]/10 blur-[40px] rounded-full" />
            <div className="relative bg-[#121212] rounded-2xl border border-[#262626] p-5">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h4 className="text-sm font-bold">Prediction Engine</h4>
                  <p className="text-[10px] text-[#6B7280]">Optimizing intervals</p>
                </div>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20">
                  <div className="w-1 h-1 rounded-full bg-[#10B981] animate-pulse" />
                  <span className="text-[9px] text-[#10B981] font-medium uppercase">Active</span>
                </div>
              </div>
              
              <div className="space-y-2.5">
                {[
                  { word: "Ephemeral", interval: "2.4d", strength: 85, color: "#3B82F6" },
                  { word: "Resilient", interval: "5.1d", strength: 92, color: "#10B981" },
                  { word: "Luminous", interval: "12.3d", strength: 78, color: "#FBBF24" },
                  { word: "Cacophony", interval: "1.2d", strength: 45, color: "#EF4444" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 p-2 rounded-lg bg-[#121212] border border-[#262626]">
                    <div className="w-16 font-medium text-[11px]">{item.word}</div>
                    <div className="flex-1 h-1 bg-[#262626] rounded-full overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        whileInView={{ width: `${item.strength}%` }}
                        transition={{ duration: 1, delay: i * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <div className="text-[9px] text-[#6B7280] font-mono w-8 text-right">{item.interval}</div>
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
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Optimized <span className="text-[#3B82F6]">SRS</span>
            </h2>
            <p className="text-[#9CA3AF] text-xs md:text-sm mb-5 leading-relaxed">
              Our algorithm tracks <span className="text-white font-medium">hesitation</span>, 
              <span className="text-white font-medium"> swipe velocity</span>, and 
              <span className="text-white font-medium"> time-to-recall</span> to predict fading memories.
            </p>
            
            <ul className="space-y-2.5">
              {[
                "Predictive forgetting curves",
                "Dynamic difficulty adjustment",
                "Immediate reinforcement on struggle"
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-[#3B82F6]/10 flex items-center justify-center flex-shrink-0">
                    <ChevronRight size={10} className="text-[#3B82F6]" />
                  </div>
                  <span className="text-xs text-[#D1D5DB]">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* GAMIFICATION */}
      <section className="py-12 md:py-20 px-4 bg-[#121212] border-t border-[#262626]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-2">Psychological Momentum</h2>
            <p className="text-[#9CA3AF] text-xs md:text-sm mb-8 max-w-sm mx-auto">
              Consistency solved through calibrated behavioral psychology.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <motion.div className="bg-[#121212] rounded-2xl p-5 border border-[#262626] relative overflow-hidden text-left">
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#FBBF24]/10 rounded-full blur-2xl" />
              <div className="w-8 h-8 rounded-lg bg-[#FBBF24]/10 flex items-center justify-center mb-3 border border-[#FBBF24]/20">
                <Clock className="text-[#FBBF24]" size={16} />
              </div>
              <h3 className="text-sm font-bold mb-1.5">The Streak Spot</h3>
              <p className="text-[#9CA3AF] text-[11px] mb-4">
                Transform learning into a "don't break the chain" mission.
              </p>
              <div className="flex justify-start gap-1">
                {[...Array(7)].map((_, i) => (
                  <div key={i} className={`w-6 h-8 rounded-md ${i < 5 ? 'bg-[#FBBF24]' : 'bg-[#262626]'} flex items-center justify-center`}>
                    {i < 5 && <Zap size={12} className="text-[#121212]" fill="currentColor" />}
                  </div>
                ))}
              </div>
              <div className="mt-2 text-[10px] font-bold text-[#FBBF24]">5 Day Streak 🔥</div>
            </motion.div>
            
            <motion.div className="bg-[#121212] rounded-2xl p-5 border border-[#262626] relative overflow-hidden text-left">
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-[#3B82F6]/10 rounded-full blur-2xl" />
              <div className="w-8 h-8 rounded-lg bg-[#3B82F6]/10 flex items-center justify-center mb-3 border border-[#3B82F6]/20">
                <Trophy className="text-[#3B82F6]" size={16} />
              </div>
              <h3 className="text-sm font-bold mb-1.5">Global Ranking</h3>
              <p className="text-[#9CA3AF] text-[11px] mb-4">
                Compete with learners worldwide. Maintain rank to drive consistency.
              </p>
              <div className="space-y-1.5">
                {[
                  { rank: 1, name: "Alex M.", xp: "12k", color: "#FBBF24" },
                  { rank: 2, name: "You", xp: "11k", color: "#3B82F6", highlight: true }
                ].map((user, i) => (
                  <div key={i} className={`flex items-center justify-between p-2 rounded-lg ${user.highlight ? 'bg-[#3B82F6]/10 border border-[#3B82F6]/30' : 'bg-[#121212]'}`}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold w-4" style={{ color: user.color }}>#{user.rank}</span>
                      <span className={`text-[11px] ${user.highlight ? "text-white font-medium" : "text-[#9CA3AF]"}`}>{user.name}</span>
                    </div>
                    <span className="text-[9px] font-mono text-[#6B7280]">{user.xp} XP</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-16 md:py-24 px-4 bg-[#121212] relative overflow-hidden border-t border-[#262626]">
        <div className="max-w-2xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-3 leading-tight">
              Upgrade Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#60A5FA]">
                Neural Pathways
              </span>
            </h2>
            <p className="text-xs md:text-sm text-[#9CA3AF] mb-6 max-w-sm mx-auto">
              Join thousands who have replaced grinding with flowing. Your first 50 cards are free.
            </p>
            
            <div className="flex flex-col items-center gap-2">
              <Link 
                href="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-6 py-3 bg-white text-[#121212] rounded-xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
              >
                Start Free Protocol
                <ArrowRight size={14} />
              </Link>
              <p className="text-[9px] text-[#6B7280]">
                No credit card required • Cancel anytime
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#262626] py-6 px-4 bg-[#121212]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 bg-[#3B82F6] rounded flex items-center justify-center">
              <Zap size={10} className="text-white" fill="currentColor" />
            </div>
            <span className="font-bold text-xs">Flotter</span>
          </div>
          
          <div className="flex gap-4 text-[10px] text-[#6B7280]">
            <Link href="#" className="hover:text-white transition-colors">Science</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
          
          <div className="text-[9px] text-[#6B7280]">
            © 2026 Flotter OS. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}