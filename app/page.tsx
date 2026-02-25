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
import FlotterLogo from './components/FlotterLogo'

// ==========================================
// PREMIUM ANIMATED COMPONENTS
// ==========================================

const NeuralBackground = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 select-none overflow-hidden">
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="smallGrid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#3B82F6" strokeWidth="0.3" strokeOpacity="0.22"/>
          </pattern>
          <pattern id="mainGrid" width="140" height="140" patternUnits="userSpaceOnUse">
            <rect width="140" height="140" fill="url(#smallGrid)"/>
            <path d="M 140 0 L 0 0 0 140" fill="none" stroke="#3B82F6" strokeWidth="0.7" strokeOpacity="0.14"/>
            <circle cx="0" cy="0" r="1.8" fill="#3B82F6" fillOpacity="0.20"/>
            <circle cx="140" cy="0" r="1.8" fill="#3B82F6" fillOpacity="0.20"/>
            <circle cx="0" cy="140" r="1.8" fill="#3B82F6" fillOpacity="0.20"/>
            <circle cx="140" cy="140" r="1.8" fill="#3B82F6" fillOpacity="0.20"/>
            <path d="M 42 0 L 42 70 L 70 70" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.08" fill="none" strokeLinecap="square"/>
            <path d="M 98 140 L 98 70 L 70 70" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.08" fill="none" strokeLinecap="square"/>
            <circle cx="70" cy="70" r="2.5" fill="none" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.15"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#mainGrid)" />
      </svg>
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
    <svg viewBox="0 0 400 320" className="w-full h-full max-w-lg mx-auto ">
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
        0%, 55% { fill: #2D2D2F; }
        58%, 70% { fill: #3B82F6; transform: scale(1.1); }
        71%, 100% { fill: #2D2D2F; }
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
      @keyframes fill-context { 0%, 21% { fill: #2D2D2F; } 23%, 70% { fill: #3B82F6; } 71%, 100% { fill: #2D2D2F; } }
      @keyframes fill-image  { 0%, 31% { fill: #2D2D2F; } 33%, 70% { fill: #FBBF24; } 71%, 100% { fill: #2D2D2F; } }
      @keyframes fill-vibe   { 0%, 41% { fill: #2D2D2F; } 43%, 70% { fill: #3B82F6; } 71%, 100% { fill: #2D2D2F; } }
      @keyframes fill-sense  { 0%, 51% { fill: #2D2D2F; } 53%, 70% { fill: #10B981; } 71%, 100% { fill: #2D2D2F; } }

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
      .beam-v { animation-name: b-vibe; stroke: #3B82F6; }
      .beam-s { animation-name: b-sense; stroke: #10B981; }
      .beam-flow { stroke-dasharray: 8 8; animation: beamDash 1s linear infinite; }

      .card-wrap { animation-name: cardGen; animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1); transform-origin: 200px 160px; }
      .card-img { animation-name: cardImg; transform-origin: 200px 91px; }
      .card-word { animation-name: cardWord; }
      .card-sent { animation-name: cardSent; }
    `}</style>

      <defs>
        <linearGradient id="cardImgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.05" />
        </linearGradient>
        <clipPath id="imgClip">
          <rect x="106" y="36" width="188" height="110" rx="10" />
        </clipPath>
        {/* circuit grid pattern */}
        <pattern id="circuit-bg" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#3B82F6" strokeWidth="0.3" strokeOpacity="0.12"/>
          <circle cx="0" cy="0" r="1" fill="#3B82F6" fillOpacity="0.1"/>
        </pattern>
      </defs>

      {/* SVG background circuit grid */}
      <rect width="400" height="320" fill="#111111" rx="14"/>
      <rect width="400" height="320" fill="url(#circuit-bg)" rx="14"/>

      {/* horizontal/vertical circuit traces decorating the background */}
      <g opacity="0.07" stroke="#3B82F6" strokeWidth="0.8" fill="none">
        <path d="M10 80 L60 80 L60 50 L130 50"/>
        <path d="M390 200 L330 200 L330 240 L260 240"/>
        <path d="M10 240 L50 240 L50 200 L80 200"/>
        <path d="M370 60 L310 60 L310 90 L260 90"/>
        <circle cx="60" cy="80" r="2.5" fill="#3B82F6" fillOpacity="0.5"/>
        <circle cx="60" cy="50" r="2" fill="#3B82F6" fillOpacity="0.5"/>
        <circle cx="330" cy="200" r="2.5" fill="#3B82F6" fillOpacity="0.5"/>
        <circle cx="50" cy="240" r="2" fill="#3B82F6" fillOpacity="0.5"/>
        <circle cx="310" cy="60" r="2.5" fill="#3B82F6" fillOpacity="0.5"/>
      </g>

      {/* PHASE 1: INPUT */}
      <g className="anim input-wrap">
        <rect x="120" y="140" width="160" height="40" rx="6" fill="#161616" stroke="#3B82F6" strokeWidth="1.5"  />
        {/* corner accents */}
        <path d="M120 150 L120 140 L130 140" stroke="#3B82F6" strokeWidth="1" fill="none" strokeOpacity="0.6"/>
        <path d="M270 140 L280 140 L280 150" stroke="#3B82F6" strokeWidth="1" fill="none" strokeOpacity="0.6"/>
        <path d="M120 170 L120 180 L130 180" stroke="#3B82F6" strokeWidth="1" fill="none" strokeOpacity="0.6"/>
        <path d="M270 180 L280 180 L280 170" stroke="#3B82F6" strokeWidth="1" fill="none" strokeOpacity="0.6"/>
        <g className="anim input-text">
          <text x="200" y="165" fill="#FFFFFF" fontFamily="monospace" fontSize="14" fontWeight="bold" textAnchor="middle" letterSpacing="1.2">
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
        <circle cx="200" cy="160" r="28" fill="#141414" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.25" />
        {/* hexagonal inner outline */}
        <polygon points="200,138 218,149 218,171 200,182 182,171 182,149" fill="none" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.15"/>
        <circle cx="200" cy="160" r="36" fill="none" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.18" strokeDasharray="4 6" className="core-ring" />
        <circle cx="200" cy="160" r="46" fill="none" strokeWidth="1.5" strokeDasharray="20 40 10 30" className="anim core-ring-fast" />
        <circle cx="200" cy="160" r="10" className="anim core-inner" />
        {/* crosshair center */}
        <line x1="196" y1="160" x2="204" y2="160" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.4"/>
        <line x1="200" y1="156" x2="200" y2="164" stroke="#3B82F6" strokeWidth="0.6" strokeOpacity="0.4"/>

        {/* Node 1: Context (Left) */}
        <g className="anim node-c">
          <circle cx="70" cy="160" r="24" fill="#141414" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.18" />
          <circle cx="70" cy="160" r="14" fill="none" stroke="#3B82F6" strokeWidth="0.4" strokeOpacity="0.1" strokeDasharray="3 5" />
          <circle cx="70" cy="160" r="6" className="anim fill-c" />
          <text x="70" y="202" fill="#9CA3AF" fontSize="8.5" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">{t('landing.visualizer.contexts').toUpperCase()}</text>
        </g>

        {/* Node 2: Image (Top) */}
        <g className="anim node-i">
          <circle cx="200" cy="50" r="24" fill="#141414" stroke="#FBBF24" strokeWidth="1" strokeOpacity="0.18" />
          <circle cx="200" cy="50" r="14" fill="none" stroke="#FBBF24" strokeWidth="0.4" strokeOpacity="0.1" strokeDasharray="3 5" />
          <circle cx="200" cy="50" r="6" className="anim fill-i" />
          <text x="200" y="13" fill="#9CA3AF" fontSize="8.5" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">{t('landing.visualizer.semantics').toUpperCase()}</text>
        </g>

        {/* Node 3: Vibe (Right) */}
        <g className="anim node-v">
          <circle cx="330" cy="160" r="24" fill="#141414" stroke="#3B82F6" strokeWidth="1" strokeOpacity="0.18" />
          <circle cx="330" cy="160" r="14" fill="none" stroke="#3B82F6" strokeWidth="0.4" strokeOpacity="0.1" strokeDasharray="3 5" />
          <circle cx="330" cy="160" r="6" className="anim fill-v" />
          <text x="330" y="202" fill="#9CA3AF" fontSize="8.5" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">{t('landing.visualizer.vibe').toUpperCase()}</text>
        </g>

        {/* Node 4: Sensory (Bottom) */}
        <g className="anim node-s">
          <circle cx="200" cy="270" r="24" fill="#141414" stroke="#10B981" strokeWidth="1" strokeOpacity="0.18" />
          <circle cx="200" cy="270" r="14" fill="none" stroke="#10B981" strokeWidth="0.4" strokeOpacity="0.1" strokeDasharray="3 5" />
          <circle cx="200" cy="270" r="6" className="anim fill-s" />
          <text x="200" y="312" fill="#9CA3AF" fontSize="8.5" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">{t('landing.visualizer.visuals').toUpperCase()}</text>
        </g>
      </g>

      {/* PHASE 3: FINAL CENTERED GENERATED CARD */}
      <g className="anim card-wrap">
        {/* Card Base */}
        <rect x="90" y="20" width="220" height="280" rx="12" fill="#161616" stroke="#252525" strokeWidth="1.5"  />
        {/* card corner accents */}
        <path d="M90 35 L90 20 L105 20" stroke="#3B82F6" strokeWidth="1.2" fill="none" strokeOpacity="0.5"/>
        <path d="M295 20 L310 20 L310 35" stroke="#3B82F6" strokeWidth="1.2" fill="none" strokeOpacity="0.5"/>
        <path d="M90 285 L90 300 L105 300" stroke="#3B82F6" strokeWidth="1.2" fill="none" strokeOpacity="0.5"/>
        <path d="M295 300 L310 300 L310 285" stroke="#3B82F6" strokeWidth="1.2" fill="none" strokeOpacity="0.5"/>
        {/* status bar */}
        <rect x="90" y="20" width="220" height="12" rx="12" fill="#1e1e1e"/>
        <circle cx="104" cy="26" r="3" fill="#EF4444" fillOpacity="0.7"/>
        <circle cx="114" cy="26" r="3" fill="#FBBF24" fillOpacity="0.7"/>
        <circle cx="124" cy="26" r="3" fill="#10B981" fillOpacity="0.7"/>
        <text x="200" y="30" fill="#4B5563" fontSize="6" textAnchor="middle" fontFamily="monospace" letterSpacing="1">FLOTTER · AI CARD</text>

        {/* Card Image Block - Real Image of Yellow Flowers */}
        <g className="anim card-img">
          <rect x="106" y="36" width="188" height="110" rx="8" fill="#1A1A1A" />
          <image
            x="106"
            y="36"
            width="188"
            height="110"
            preserveAspectRatio="xMidYMid slice"
            href="https://images.unsplash.com/photo-1621789098261-433128ee8d1e?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2glMjBmbG93ZXJ8ZW58MHx8MHx8fDA%3D"
            clipPath="url(#imgClip)"
          />
          <rect x="106" y="36" width="188" height="110" rx="8" fill="none" stroke="#252525" strokeWidth="1" pointerEvents="none" />
          {/* image overlay label */}
          <rect x="106" y="126" width="188" height="20" rx="0" fill="#161616" fillOpacity="0.85"/>
          <text x="118" y="139" fill="#4B5563" fontSize="7" fontFamily="monospace" letterSpacing="1">VISUAL · SEMANTIC ANCHOR</text>
        </g>

        {/* Card Word & Type */}
        <g className="anim card-word">
          <text x="200" y="178" fill="#FFFFFF" fontSize="21" fontWeight="bold" textAnchor="middle" letterSpacing="0.5">Ephemeral</text>
          <rect x="163" y="186" width="74" height="17" rx="3" fill="#3B82F6" fillOpacity="0.12" stroke="#3B82F6" strokeOpacity="0.35" strokeWidth="1" />
          <text x="200" y="198" fill="#60A5FA" fontSize="8" fontWeight="bold" textAnchor="middle" letterSpacing="1.5">ADJECTIVE</text>
        </g>

        {/* Card Centered Sentence */}
        <g className="anim card-sent">
          <line x1="130" y1="212" x2="270" y2="212" stroke="#252525" strokeWidth="0.8"/>
          <text x="200" y="228" fill="#D1D5DB" fontSize="11.5" textAnchor="middle" letterSpacing="0.2">You attempt to capture the</text>
          <text x="200" y="243" fill="#D1D5DB" fontSize="11.5" textAnchor="middle" letterSpacing="0.2">ephemeral snowflake, but it melts</text>
          <text x="200" y="258" fill="#D1D5DB" fontSize="11.5" textAnchor="middle" letterSpacing="0.2">away, leaving only a memory.</text>

          {/* progress dots */}
          <circle cx="200" cy="277" r="2.2" fill="#3B82F6" />
          <circle cx="190" cy="277" r="2.2" fill="#4B5563" opacity="0.5" />
          <circle cx="210" cy="277" r="2.2" fill="#4B5563" opacity="0.5" />
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
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { icon: Sparkles, label: t('landing.visualizer.semantics'), color: "#3B82F6", detail: "Vectorizing Lexical Meaning" },
    { icon: Brain, label: t('landing.visualizer.contexts'), color: "#FBBF24", detail: "Synthesizing Sensory Anchors" },
    { icon: Layers, label: t('landing.visualizer.visuals'), color: "#EF4444", detail: "Generating Mental Imagery" },
    { icon: Zap, label: t('landing.visualizer.locked'), color: "#10B981", detail: "Encrypting For Long-Term Memory" }
  ]

  return (
    <div className={`relative w-full h-[220px] bg-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col items-center justify-center p-6`}>
      {/* Circuit background pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <pattern id="circuit" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M0 20h20v20M20 0v20h20" fill="none" stroke="currentColor" strokeWidth="1" />
          <circle cx="20" cy="20" r="2" fill="currentColor" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#circuit)" />
      </svg>

      <div className="relative z-10 flex flex-col items-center w-full">
        {/* Central Core */}
        <div className="relative mb-8">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 "
            style={{
              borderColor: `${steps[step].color}30`,
              backgroundColor: `${steps[step].color}08`
            }}
            animate={{
              rotate: [0, 90, 180, 270, 360],
              scale: [1, 1.05, 1]
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          >
            {React.createElement(steps[step].icon, {
              size: 32,
              style: { color: steps[step].color }
            })}
          </motion.div>

          {/* Orbits */}
          <div className="absolute inset-[-20px] pointer-events-none">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 border border-dashed rounded-full opacity-20"
                style={{ borderColor: steps[step].color }}
                animate={{ rotate: 360 }}
                transition={{ duration: 8 + i * 4, repeat: Infinity, ease: "linear" }}
              />
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10,  }}
            animate={{ opacity: 1, y: 0,  }}
            exit={{ opacity: 0, y: -10,  }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            <h4 className={`text-[12px] font-black tracking-[0.2em] uppercase mb-1 text-white`}>
              {steps[step].label}
            </h4>
            <p className="text-[10px] font-mono text-blue-500 mb-4">{steps[step].detail}</p>
          </motion.div>
        </AnimatePresence>

        {/* Binary Stream visualizer */}
        <div className="w-full flex justify-center gap-1">
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="w-1 h-3 rounded-full"
              style={{ backgroundColor: steps[step].color }}
              animate={{
                height: [4, 12, 4],
                opacity: [0.2, 1, 0.2]
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </div>
      </div>

    </div>
  )
}

const ACASRSVisualizer = () => {
  const { t, language } = useLanguage()
  const [activeStep, setActiveStep] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    { label: t('landing.acasrs.phase1'), time: "15m", color: "#3B82F6", icon: Clock },
    { label: t('landing.acasrs.phase2'), time: "24h", color: "#FBBF24", icon: Brain },
    { label: t('landing.acasrs.phase3'), time: "72h", color: "#10B981", icon: Layers },
    { label: language === 'ar' ? 'التخرج' : 'Gradual Mastery', time: "∞", color: "#EF4444", icon: Sparkles }
  ]

  return (
    <div className={`relative w-full h-[320px] bg-[#1a1a1a] rounded-2xl overflow-hidden p-8 flex flex-col items-center justify-between`}>
      {/* AI Orchestration Engine Label */}
      <div className="absolute top-4 left-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500`}>AI Generation Engine</span>
      </div>

      {/* SVG Diagram Core */}
      <div className="relative w-full flex-1 flex items-center justify-center">
        <svg width="100%" height="160" viewBox="0 0 400 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="max-w-[500px]">
          {/* Main Processing Line */}
          <line x1="40" y1="80" x2="360" y2="80" stroke="#2D2D2F" strokeWidth="2" strokeDasharray="4 4" />

          {/* Animated Flow Path */}
          <motion.path
            d="M 40 80 L 360 80"
            stroke="url(#gradient-flow)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{
              pathLength: [0, 1, 1],
              opacity: [0, 1, 0],
              pathOffset: [0, 0, 1]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          <defs>
            <linearGradient id="gradient-flow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0" />
              <stop offset="50%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Nodes */}
          {steps.map((step, i) => {
            const x = 40 + (i * 106.6);
            const isActive = activeStep === i;
            const isCompleted = activeStep > i;

            return (
              <g key={i}>
                {/* Connection Arcs (AI Context Branches) */}
                {i < 3 && (
                  <motion.path
                    d={`M ${x} 80 Q ${x + 53} ${i % 2 === 0 ? 30 : 130} ${x + 106} 80`}
                    stroke={step.color}
                    strokeWidth="1.5"
                    strokeOpacity="0.2"
                    fill="none"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: isActive ? 1 : 0 }}
                  />
                )}

                {/* Main Node */}
                <motion.circle
                  cx={x} cy="80" r="6"
                  fill={isActive ? step.color : (isCompleted ? step.color : "#2D2D2F")}
                  stroke={isActive ? "#fff" : "transparent"}
                  strokeWidth="2"
                  animate={{ scale: isActive ? 1.4 : 1 }}
                />

                {/* Label */}
                <foreignObject x={x - 40} y="95" width="80" height="50">
                  <div className="flex flex-col items-center text-center">
                    <span className={`text-[9px] font-bold uppercase tracking-tighter ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {step.label.split(':')[1]?.trim() || step.label}
                    </span>
                    <span className="text-[8px] font-mono opacity-60" style={{ color: step.color }}>{step.time}</span>
                  </div>
                </foreignObject>

                {/* AI Context Points */}
                {isActive && i < 3 && (
                  <motion.circle
                    cx={x + 53}
                    cy={i % 2 === 0 ? 30 : 130}
                    r="3"
                    fill={step.color}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                )}
              </g>
            )
          })}
        </svg>

        {/* Floating Context Labels */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            className="absolute top-0 right-0 p-4 max-w-[140px]"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
          >
            <div className={`text-[10px] font-medium leading-tight text-gray-400`}>
              {activeStep === 0 && "Synthesizing immediate semantic bridge..."}
              {activeStep === 1 && "Mapping cross-domain neural connections..."}
              {activeStep === 2 && "Validating multi-contextual retention..."}
              {activeStep === 3 && "Graduating to exponential mastery cycle."}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Detail Card Overlay */}
      <div className={`w-full mt-4 p-4 rounded-xl bg-[#1A1A1A] flex items-center gap-4`}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{
          borderColor: `${steps[activeStep].color}30`,
          backgroundColor: `${steps[activeStep].color}10`
        }}>
          {React.createElement(steps[activeStep].icon, {
            size: 20,
            style: { color: steps[activeStep].color }
          })}
        </div>
        <div>
          <h5 className={`text-[12px] font-bold text-white`}>
            {steps[activeStep].label} <span className="text-blue-500 ml-1">[{steps[activeStep].time}]</span>
          </h5>
          <p className={`text-[11px] text-gray-500 line-clamp-1`}>
            {(t as any)(`landing.acasrs.phase${activeStep + 1}Desc`) || "Advanced context rotation active."}
          </p>
        </div>
        <div className="ml-auto">
          <ChevronRight size={14} className="text-gray-400" />
        </div>
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
              className={`absolute w-full max-w-[200px] h-36 bg-[#1a1a1a] rounded-xl border-2 flex flex-col items-center justify-center `}
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
              <h3 className={`text-[19px] font-bold text-white`}>{card.word}</h3>

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
    <div className={`w-full h-48 bg-[#1a1a1a] rounded-xl p-4 relative`}>
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
            <circle cx={i * (400 / 5)} cy={200 - (data[i].flotter / 100) * 180} r="4" fill="#3B82F6" stroke="#1a1a1a" strokeWidth="2" />
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
          <span className={'text-[#FFFFFF]'}>{t('landing.graph.flotter')}</span>
        </div>
      </div>
    </div>
  )
}

const AudioWaveform = () => {
  const { language } = useLanguage()
  // Deterministic heights & durations — no Math.random() in render
  const barHeights = [8, 16, 22, 14, 20, 26, 18, 10, 24, 16, 20, 12, 22, 18, 10, 24]
  const barDurations = [0.70, 0.52, 0.84, 0.62, 0.90, 0.56, 0.76, 0.66, 0.82, 0.60, 0.72, 0.80, 0.50, 0.74, 0.64, 0.88]
  return (
    <div className="flex items-center justify-center gap-1 h-10">
      {[...Array(16)].map((_, i) => (
        <motion.div
          key={i}
          className="w-1 bg-[#3B82F6] rounded-full"
          animate={{
            height: [5, barHeights[i], 5],
            opacity: [0.45, 1, 0.45],
            scaleY: [0.9, 1, 0.9]
          }}
          transition={{
            duration: barDurations[i],
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.055
          }}
        />
      ))}
      <Volume2 className={`text-[#3B82F6] ${language === 'ar' ? 'mr-2' : 'ml-2'}`} size={16} />
    </div>
  )
}



// ==========================================
// ANIMATED SVG DECORATORS
// ==========================================

/**
 * PulseLine — Spaced Repetition Schedule Visualizer.
 * Shows the algorithm's exponentially widening review intervals:
 * 15 min → 1 day → 3 days → 7 days → 21 days → ∞
 * Sits between Part 01 (AI Engine) and Part 02 (ACASRS).
 */
const PulseLine = ({ color = "#3B82F6" }: { color?: string }) => {
  const intervals = [
    { x: 44,  label: "15m", sublabel: "First\nReview",  color: "#3B82F6", pct: 100 },
    { x: 128, label: "1d",  sublabel: "Short\nTerm",    color: "#60A5FA", pct: 88  },
    { x: 212, label: "3d",  sublabel: "Mid\nTerm",      color: "#10B981", pct: 74  },
    { x: 296, label: "7d",  sublabel: "Long\nTerm",     color: "#FBBF24", pct: 62  },
    { x: 380, label: "21d", sublabel: "Deep\nMemory",   color: "#F97316", pct: 84  },
    { x: 452, label: "∞",   sublabel: "Mastered",       color: "#A78BFA", pct: 96  },
  ]

  const BAR_MAX_H = 32
  const BAR_Y_BASE = 38

  return (
    <div className="w-full overflow-hidden py-4 flex flex-col items-center gap-1">
      <motion.p
        className="text-[9px] font-bold uppercase tracking-[0.28em] text-[#4B5563] mb-1"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        ACASRS · Adaptive Review Spacing
      </motion.p>

      <svg width="100%" height="130" viewBox="0 0 496 130" fill="none" className="max-w-lg overflow-visible">
        <defs>
          <linearGradient id="srs-curve" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"  stopColor="#3B82F6" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#10B981" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#A78BFA" stopOpacity="0.45" />
          </linearGradient>
          <linearGradient id="bar-grad-0" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3B82F6"/><stop offset="100%" stopColor="#3B82F6" stopOpacity="0.25"/></linearGradient>
          <linearGradient id="bar-grad-1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#60A5FA"/><stop offset="100%" stopColor="#60A5FA" stopOpacity="0.25"/></linearGradient>
          <linearGradient id="bar-grad-2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10B981"/><stop offset="100%" stopColor="#10B981" stopOpacity="0.25"/></linearGradient>
          <linearGradient id="bar-grad-3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#FBBF24"/><stop offset="100%" stopColor="#FBBF24" stopOpacity="0.25"/></linearGradient>
          <linearGradient id="bar-grad-4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#F97316"/><stop offset="100%" stopColor="#F97316" stopOpacity="0.25"/></linearGradient>
          <linearGradient id="bar-grad-5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#A78BFA"/><stop offset="100%" stopColor="#A78BFA" stopOpacity="0.25"/></linearGradient>
        </defs>

        {/* ── background grid lines ── */}
        {[0, 1, 2, 3].map(i => (
          <line key={i} x1="20" y1={BAR_Y_BASE - (i * BAR_MAX_H / 3)} x2="476" y2={BAR_Y_BASE - (i * BAR_MAX_H / 3)}
            stroke="#2A2A2A" strokeWidth="0.5" strokeDasharray="3 9" />
        ))}

        {/* ── retention % axis label ── */}
        <text x="14" y={BAR_Y_BASE - BAR_MAX_H + 4} fill="#4B5563" fontSize="6.5" fontFamily="monospace" textAnchor="end">100%</text>
        <text x="14" y={BAR_Y_BASE + 3} fill="#4B5563" fontSize="6.5" fontFamily="monospace" textAnchor="end">0%</text>

        {/* ── retention bars ── */}
        {intervals.map(({ x, pct, color: nc }, i) => {
          const barH = (pct / 100) * BAR_MAX_H
          return (
            <React.Fragment key={`bar-${i}`}>
              {/* bar background track */}
              <rect x={x - 5} y={BAR_Y_BASE - BAR_MAX_H} width={10} height={BAR_MAX_H}
                fill="#1e1e1e" rx="2" />
              {/* animated fill bar */}
              <motion.rect
                x={x - 5} width={10} rx="2"
                fill={`url(#bar-grad-${i})`}
                initial={{ height: 0, y: BAR_Y_BASE }}
                whileInView={{ height: barH, y: BAR_Y_BASE - barH }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 + i * 0.1, duration: 0.7, ease: "easeOut" }}
              />
              {/* pct label */}
              <motion.text x={x} y={BAR_Y_BASE - BAR_MAX_H - 5} textAnchor="middle"
                fill={nc} fontSize="7.5" fontWeight="800" fontFamily="monospace"
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
              >{pct}%</motion.text>
            </React.Fragment>
          )
        })}

        {/* ── exponential gap arcs ── */}
        {intervals.slice(0, -1).map((a, i) => {
          const b = intervals[i + 1]
          const mid = (a.x + b.x) / 2
          const arcY = BAR_Y_BASE + 20 - i * 2
          return (
            <motion.path key={i}
              d={`M${a.x} ${BAR_Y_BASE + 10} Q${mid} ${arcY} ${b.x} ${BAR_Y_BASE + 10}`}
              stroke={a.color} strokeWidth={0.8 + i * 0.12} strokeOpacity={0.18 + i * 0.02}
              fill="none" strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.9, ease: "easeOut" }}
            />
          )
        })}

        {/* ── main timeline rail ── */}
        <motion.line x1="20" y1={BAR_Y_BASE + 10} x2="476" y2={BAR_Y_BASE + 10}
          stroke="url(#srs-curve)" strokeWidth="1.5" strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.0, ease: "easeOut" }}
        />

        {/* ── interval nodes ── */}
        {intervals.map(({ x, label, color: nc }, i) => (
          <React.Fragment key={i}>
            {/* outer halo */}
            <motion.circle cx={x} cy={BAR_Y_BASE + 10} r={10}
              fill="none" stroke={nc} strokeWidth="0.5" strokeOpacity="0.18"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.45 + i * 0.1, type: "spring", stiffness: 200 }}
              style={{ transformOrigin: `${x}px ${BAR_Y_BASE + 10}px` }}
            />
            {/* node ring */}
            <motion.circle cx={x} cy={BAR_Y_BASE + 10} r={5.5}
              fill="#121212" stroke={nc} strokeWidth="1.4"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.1, type: "spring", stiffness: 300 }}
              style={{ transformOrigin: `${x}px ${BAR_Y_BASE + 10}px` }}
            />
            {/* center fill */}
            <motion.circle cx={x} cy={BAR_Y_BASE + 10} r={2}
              fill={nc}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.25 }}
            />
            {/* interval label bottom */}
            <motion.text x={x} y={BAR_Y_BASE + 28} textAnchor="middle"
              fill={nc} fontSize="9" fontWeight="800" fontFamily="monospace" letterSpacing="0.5"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.1, duration: 0.5 }}
            >{label}</motion.text>
            {/* tick mark */}
            <motion.line x1={x} y1={BAR_Y_BASE + 15} x2={x} y2={BAR_Y_BASE + 21}
              stroke={nc} strokeWidth="1" strokeOpacity="0.3"
              initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.65 + i * 0.1, duration: 0.3 }}
              style={{ transformOrigin: `${x}px ${BAR_Y_BASE + 15}px` }}
            />
          </React.Fragment>
        ))}

        {/* ── widening gap annotations ── */}
        {intervals.slice(0, -1).map((a, i) => {
          const b = intervals[i + 1]
          const mid = (a.x + b.x) / 2
          if (i < 2) return null
          return (
            <motion.text key={i} x={mid} y={BAR_Y_BASE + 46} textAnchor="middle"
              fill="#3B5568" fontSize="7" fontFamily="monospace"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.9 + i * 0.08, duration: 0.5 }}
            >+{Math.round((b.x - a.x) * 0.22)}x</motion.text>
          )
        })}

        {/* ── traveling review packet ── */}
        <motion.circle cy={BAR_Y_BASE + 10} r="4.5"
          fill={color}
          animate={{ cx: intervals.map(n => n.x) }}
          transition={{
            cx: { duration: 4.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.8,
              times: [0, 0.12, 0.28, 0.48, 0.72, 1] }
          }}
        />

        {/* ── arrival flash on each node ── */}
        {intervals.map(({ x, color: nc }, i) => (
          <motion.circle key={`flash-${i}`} cx={x} cy={BAR_Y_BASE + 10}
            fill={nc}
            initial={{ r: 0, fillOpacity: 0 }}
            animate={{ r: [0, 16], fillOpacity: [0.3, 0] }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "easeOut",
              delay: (i / intervals.length) * 4.5 + 1.0, repeatDelay: 4.5 }}
          />
        ))}
      </svg>
    </div>
  )
}

/**
 * _ (unused signature kept for compatibility)
 */
const _PulseLineLegacy = ({ color = "#3B82F6" }: { color?: string }) => (
  <div className="w-full overflow-hidden py-10 flex justify-center">
    <svg width="100%" height="72" viewBox="0 0 480 72" fill="none" className="max-w-lg">
      <defs>
        <linearGradient id="pl-track" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={color} stopOpacity="0" />
          <stop offset="30%"  stopColor={color} stopOpacity="0.35" />
          <stop offset="70%"  stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="pl-fork" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.05" />
        </linearGradient>
        <filter id="pl-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── background dashed guide rail ── */}
      <line x1="0" y1="28" x2="480" y2="28"
        stroke={color} strokeWidth="0.5" strokeOpacity="0.08" strokeDasharray="4 10" />

      {/* ── fork branch (bottom arc) ── */}
      <motion.path
        d="M140 28 C160 28, 170 52, 200 52 L280 52 C310 52, 320 28, 340 28"
        stroke="url(#pl-fork)" strokeWidth="1.2" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.4, ease: "easeOut" }}
      />

      {/* ── main track ── */}
      <motion.line x1="0" y1="28" x2="480" y2="28"
        stroke="url(#pl-track)" strokeWidth="1.8"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      {/* ── junction nodes ── */}
      {[80, 140, 240, 340, 400].map((x, i) => (
        <React.Fragment key={i}>
          {/* outer halo */}
          <motion.circle cx={x} cy="28" r="9" fill="none"
            stroke={color} strokeWidth="0.6" strokeOpacity="0.14"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 + i * 0.1, duration: 0.5 }}
            style={{ transformOrigin: `${x}px 28px` }}
          />
          {/* inner node */}
          <motion.circle cx={x} cy="28" r="4"
            fill="#121212" stroke={color} strokeWidth="1.5"
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.1, duration: 0.4, type: "spring", stiffness: 260 }}
            style={{ transformOrigin: `${x}px 28px` }}
          />
          {/* center fill dot */}
          <motion.circle cx={x} cy="28" r="2"
            fill={color}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 0.8 }}
            viewport={{ once: true }}
            transition={{ delay: 0.55 + i * 0.1, duration: 0.3 }}
            style={{ transformOrigin: `${x}px 28px` }}
          />
        </React.Fragment>
      ))}

      {/* ── fork branch endpoint dot ── */}
      <motion.circle cx="240" cy="52" r="3"
        fill={color} fillOpacity="0.4"
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.9, duration: 0.4 }}
        style={{ transformOrigin: "240px 52px" }}
      />

      {/* ── traveling packet: main track ── */}
      <motion.circle cy="28" r="3.5"
        fill={color} filter="url(#pl-glow)"
        animate={{ cx: [0, 80, 140, 240, 340, 400, 480] }}
        transition={{ cx: { duration: 3.2, repeat: Infinity, ease: "linear", repeatDelay: 0.6 } }}
      />

      {/* ── traveling packet: fork branch ── */}
      <motion.circle r="2.5"
        fill={color} fillOpacity="0.55"
        animate={{
          cx: [140, 200, 240, 280, 340],
          cy: [ 28,  48,  52,  48,  28],
        }}
        transition={{
          duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 1.8,
          times: [0, 0.25, 0.5, 0.75, 1]
        }}
      />

      {/* ── node blink on packet arrival ── */}
      {[0, 1].map((i) => (
        <motion.circle key={i} cx={i === 0 ? 240 : 400} cy="28" r="8"
          fill={color} fillOpacity="0"
          animate={{ r: [4, 14], fillOpacity: [0.25, 0] }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeOut", delay: i === 0 ? 1.5 : 2.8 }}
          style={{ transformOrigin: `${i === 0 ? 240 : 400}px 28px` }}
        />
      ))}
    </svg>
  </div>
)

/**
 * FloatingDots — degrading signal wave. Used between Stats and Problem sections.
 * Represents memory beginning to erode — matching the problem section theme.
 */
const FloatingDots = ({ count = 5, color = "#3B82F6" }: { count?: number; color?: string }) => (
  <div className="relative w-full overflow-hidden py-8 flex justify-center">
    <svg width="100%" height="72" viewBox="0 0 480 72" fill="none" className="max-w-lg">
      <defs>
        <linearGradient id="fd-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor={color} stopOpacity="0" />
          <stop offset="25%"  stopColor={color} stopOpacity="0.55" />
          <stop offset="75%"  stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="fd-grad2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%"   stopColor="#EF4444" stopOpacity="0" />
          <stop offset="30%"  stopColor="#EF4444" stopOpacity="0.22" />
          <stop offset="70%"  stopColor="#EF4444" stopOpacity="0.12" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* background rail */}
      <line x1="0" y1="36" x2="480" y2="36" stroke={color} strokeWidth="0.4" strokeOpacity="0.06" strokeDasharray="3 11" />

      {/* secondary ghost track (high-amplitude, forgetting curve) */}
      <motion.path
        d="M0 36 C24 14,48 58, 72 36 C96 14,120 50,144 36 C168 22,192 44,216 36 C240 28,264 44,288 36 C312 28,336 42,360 36 C384 30,408 40,432 36 L480 36"
        stroke="url(#fd-grad2)" strokeWidth="1.2" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2.0, ease: "easeOut", delay: 0.1 }}
      />

      {/* primary degrading wave — amplitude decays L→R (memory erosion) */}
      <motion.path
        d="M0 36 C30 10,60 62, 90 36 C120 10,150 54,180 36 C210 18,240 50,270 36 C300 22,330 46,360 36 C390 27,420 41,450 36 L480 36"
        stroke="url(#fd-grad)" strokeWidth="2.2" fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />

      {/* peak amplitude dots (shrinking right) */}
      {[
        { cx: 90,  cy: 36, r: 3.8, op: 0.85 },
        { cx: 180, cy: 36, r: 3.2, op: 0.65 },
        { cx: 270, cy: 36, r: 2.5, op: 0.45 },
        { cx: 360, cy: 36, r: 1.8, op: 0.28 },
      ].map(({ cx, cy, r, op }, i) => (
        <React.Fragment key={i}>
          <motion.circle cx={cx} cy={cy} r={r}
            fill={color} fillOpacity={op}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 + i * 0.12, duration: 0.4, type: "spring", stiffness: 280 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
          <motion.circle cx={cx} cy={cy} r={r + 5}
            fill="none" stroke={color} strokeWidth="0.6"
            strokeOpacity={op * 0.3}
            initial={{ scale: 0 }} whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.85 + i * 0.12 }}
            style={{ transformOrigin: `${cx}px ${cy}px` }}
          />
        </React.Fragment>
      ))}

      {/* phase labels */}
      {[
        { cx: 90,  label: "ENCODE",  dy: -18 },
        { cx: 270, label: "RECALL",  dy: -14 },
        { cx: 450, label: "FADE",    dy: -10 },
      ].map(({ cx, label, dy }, i) => (
        <motion.text key={i} x={cx} y={36 + dy} textAnchor="middle"
          fill={color} fontSize="6.5" fontWeight="700" fontFamily="monospace" letterSpacing="1.5"
          fillOpacity="0.55"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.0 + i * 0.2, duration: 0.5 }}
        >{label}</motion.text>
      ))}

      {/* traveling signal (fades right) */}
      <motion.circle cy="36" r="3"
        fill={color}
        animate={{
          cx:          [0,   90,  180, 270, 360, 480],
          fillOpacity: [0.9, 0.8, 0.6, 0.4, 0.2, 0],
        }}
        transition={{ duration: 3.4, repeat: Infinity, ease: "easeIn", repeatDelay: 0.8,
          times: [0, 0.19, 0.37, 0.56, 0.75, 1] }}
      />

      {/* terminal ticks */}
      {[20, 460].map((x, i) => (
        <motion.line key={i} x1={x} y1="28" x2={x} y2="44"
          stroke={color} strokeWidth="1.5" strokeOpacity="0.25"
          initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.9, duration: 0.35 }}
          style={{ transformOrigin: `${x}px 36px` }}
        />
      ))}
    </svg>
  </div>
)

/**
 * NeuralConnector — fully detailed 3-layer network with staggered draw-in,
 * sequential node activation, and a traveling forward-pass pulse.
 * Used between the Problem and Methodology sections.
 */
const NeuralConnector = () => {
  // 4-layer network: input(2) → hidden-A(4) → hidden-B(3) → output(2)
  const inputNodes    = [{ cx: 20,  cy: 28 }, { cx: 20,  cy: 70 }]
  const hiddenANodes  = [{ cx: 110, cy: 14 }, { cx: 110, cy: 38 }, { cx: 110, cy: 62 }, { cx: 110, cy: 86 }]
  const hiddenBNodes  = [{ cx: 210, cy: 24 }, { cx: 210, cy: 54 }, { cx: 210, cy: 84 }]
  const outputNodes   = [{ cx: 300, cy: 34 }, { cx: 300, cy: 70 }]

  const ia: [number,number][] = []
  inputNodes.forEach((_,a)  => hiddenANodes.forEach((__,b) => ia.push([a,b])))
  const ab: [number,number][] = []
  hiddenANodes.forEach((_,a) => hiddenBNodes.forEach((__,b) => ab.push([a,b])))
  const bo: [number,number][] = []
  hiddenBNodes.forEach((_,a) => outputNodes.forEach((__,b)  => bo.push([a,b])))

  const pulseWaypoints = [
    { cx: 20,  cy: 28 },
    { cx: 110, cy: 38 },
    { cx: 210, cy: 24 },
    { cx: 300, cy: 34 },
  ]
  const pulseWaypoints2 = [
    { cx: 20,  cy: 70 },
    { cx: 110, cy: 62 },
    { cx: 210, cy: 84 },
    { cx: 300, cy: 70 },
  ]

  return (
    <div className="w-full py-8 flex justify-center overflow-hidden">
      <svg width="100%" height="112" viewBox="0 0 320 112" fill="none" className="max-w-md">
        <defs>
          <linearGradient id="nc-ia" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="nc-ab" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#10B981" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.08" />
          </linearGradient>
          <linearGradient id="nc-bo" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#FBBF24" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* layer labels */}
        {[
          { x: 20,  label: "INPUT",    color: "#3B82F6", delay: 0.1 },
          { x: 110, label: "ENCODE",   color: "#10B981", delay: 0.25 },
          { x: 210, label: "PROCESS",  color: "#10B981", delay: 0.4  },
          { x: 300, label: "OUTPUT",   color: "#FBBF24", delay: 0.55 },
        ].map(({ x, label, color, delay }) => (
          <motion.text key={label} x={x} y="108" textAnchor="middle"
            fill={color} fillOpacity="0.45" fontSize="6" fontWeight="700" letterSpacing="1.2"
            fontFamily="monospace"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
            viewport={{ once: true }} transition={{ delay, duration: 0.5 }}
          >{label}</motion.text>
        ))}

        {/* input→hiddenA connections */}
        {ia.map(([a,b],i) => (
          <motion.line key={`ia-${i}`}
            x1={inputNodes[a].cx}   y1={inputNodes[a].cy}
            x2={hiddenANodes[b].cx} y2={hiddenANodes[b].cy}
            stroke="url(#nc-ia)" strokeWidth="0.75"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 + i * 0.035, duration: 0.65 }}
          />
        ))}

        {/* hiddenA→hiddenB connections */}
        {ab.map(([a,b],i) => (
          <motion.line key={`ab-${i}`}
            x1={hiddenANodes[a].cx} y1={hiddenANodes[a].cy}
            x2={hiddenBNodes[b].cx} y2={hiddenBNodes[b].cy}
            stroke="url(#nc-ab)" strokeWidth="0.75"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 + i * 0.03, duration: 0.65 }}
          />
        ))}

        {/* hiddenB→output connections */}
        {bo.map(([a,b],i) => (
          <motion.line key={`bo-${i}`}
            x1={hiddenBNodes[a].cx} y1={hiddenBNodes[a].cy}
            x2={outputNodes[b].cx}  y2={outputNodes[b].cy}
            stroke="url(#nc-bo)" strokeWidth="0.75"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.65 + i * 0.04, duration: 0.65 }}
          />
        ))}

        {/* input nodes */}
        {inputNodes.map(({ cx, cy }, i) => (
          <React.Fragment key={`in-${i}`}>
            <motion.circle cx={cx} cy={cy} r={11}
              fill="none" stroke="#3B82F6" strokeWidth="0.5" strokeOpacity="0.13"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 220 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle cx={cx} cy={cy} r={6}
              fill="#1A1A1A" stroke="#3B82F6" strokeWidth="1.3"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.15 + i * 0.1, type: "spring", stiffness: 260 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle cx={cx} cy={cy} r={2}
              fill="#3B82F6"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.4 }}
            />
          </React.Fragment>
        ))}

        {/* hiddenA nodes */}
        {hiddenANodes.map(({ cx, cy }, i) => (
          <React.Fragment key={`ha-${i}`}>
            <motion.circle cx={cx} cy={cy} r={12}
              fill="none" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.12"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.07, type: "spring", stiffness: 200 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle cx={cx} cy={cy} r={6.5}
              fill="#1A1A1A" stroke="#10B981" strokeWidth="1.2"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.35 + i * 0.07, type: "spring", stiffness: 260 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle cx={cx} cy={cy} r={2.5}
              fill="#10B981"
              animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 + i * 0.3 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          </React.Fragment>
        ))}

        {/* hiddenB nodes */}
        {hiddenBNodes.map(({ cx, cy }, i) => (
          <React.Fragment key={`hb-${i}`}>
            <motion.circle cx={cx} cy={cy} r={11}
              fill="none" stroke="#10B981" strokeWidth="0.5" strokeOpacity="0.1"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.52 + i * 0.07, type: "spring", stiffness: 200 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle cx={cx} cy={cy} r={6}
              fill="#1A1A1A" stroke="#3B82F6" strokeWidth="1.1"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.57 + i * 0.07, type: "spring", stiffness: 260 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle cx={cx} cy={cy} r={2.2}
              fill="#3B82F6"
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 + i * 0.35 }}
            />
          </React.Fragment>
        ))}

        {/* output nodes */}
        {outputNodes.map(({ cx, cy }, i) => (
          <React.Fragment key={`out-${i}`}>
            <motion.circle cx={cx} cy={cy} r={11}
              fill="none" stroke="#FBBF24" strokeWidth="0.5" strokeOpacity="0.14"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.72 + i * 0.08, type: "spring", stiffness: 200 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle cx={cx} cy={cy} r={6}
              fill="#1A1A1A" stroke="#FBBF24" strokeWidth="1.3"
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ delay: 0.77 + i * 0.08, type: "spring", stiffness: 260 }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
            <motion.circle cx={cx} cy={cy} r={2.5}
              fill="#FBBF24"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.9 + i * 0.3 }}
            />
          </React.Fragment>
        ))}

        {/* forward-pass pulse 1 */}
        <motion.circle r={4} fill="#3B82F6"
          animate={{
            cx: pulseWaypoints.map(p => p.cx),
            cy: pulseWaypoints.map(p => p.cy),
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4, times: [0, 0.32, 0.65, 1] }}
        />
        {/* forward-pass pulse 2 — offset path */}
        <motion.circle r={3} fill="#10B981" fillOpacity="0.8"
          animate={{
            cx: pulseWaypoints2.map(p => p.cx),
            cy: pulseWaypoints2.map(p => p.cy),
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.4, delay: 0.8, times: [0, 0.32, 0.65, 1] }}
        />
      </svg>
    </div>
  )
}

/**
 * OrbitDecoration — convergence starburst with concentric orbits.
 * Used between Methodology and CTA sections. Represents mastery achieved.
 */
const OrbitDecoration = () => {
  const CX = 80, CY = 80

  // 12 ray endpoints at r=68
  const rays12 = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 12
    return { x2: CX + Math.round(68 * Math.cos(angle)), y2: CY + Math.round(68 * Math.sin(angle)) }
  })

  // hexagon at r=28
  const hexPts = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI * 2) / 6 - Math.PI / 6
    return [CX + 28 * Math.cos(a), CY + 28 * Math.sin(a)]
  })
  const hexPath = hexPts.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z'

  // inner hex r=14
  const hexPts2 = Array.from({ length: 6 }, (_, i) => {
    const a = (i * Math.PI * 2) / 6
    return [CX + 14 * Math.cos(a), CY + 14 * Math.sin(a)]
  })
  const hexPath2 = hexPts2.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z'

  return (
    <div className="w-full py-6 flex justify-center overflow-hidden">
      <svg width="160" height="160" viewBox="0 0 160 160" fill="none">
        <defs>
          <radialGradient id="od-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#3B82F6" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* radial background glow */}
        <circle cx={CX} cy={CY} r="68" fill="url(#od-core)" />

        {/* 12 converging rays — alternating weight */}
        {rays12.map(({ x2, y2 }, i) => (
          <motion.line key={i}
            x1={CX} y1={CY} x2={x2} y2={y2}
            stroke="#3B82F6"
            strokeWidth={i % 3 === 0 ? 0.9 : 0.45}
            strokeOpacity={i % 3 === 0 ? 0.2 : 0.1}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.05 + i * 0.055, duration: 0.6, ease: "easeOut" }}
          />
        ))}

        {/* outer hex boundary (r≈68) */}
        {[
          { r: 68, color: "#3B82F6", op: 0.08, sw: 0.6 },
          { r: 52, color: "#3B82F6", op: 0.1,  sw: 0.5 },
          { r: 36, color: "#10B981", op: 0.1,  sw: 0.5 },
        ].map(({ r, color, op, sw }, i) => {
          const pts = Array.from({ length: 6 }, (_, j) => {
            const a = (j * Math.PI * 2) / 6 - Math.PI / 6
            return [CX + r * Math.cos(a), CY + r * Math.sin(a)]
          })
          const p = pts.map(([x,y],j) => `${j===0?'M':'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ') + ' Z'
          return (
            <motion.path key={i} d={p}
              fill="none" stroke={color} strokeWidth={sw} strokeOpacity={op}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 30 + i * 12, repeat: Infinity, ease: "linear" }}
              style={{ transformOrigin: `${CX}px ${CY}px` }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            />
          )
        })}

        {/* 3 circular orbit rings */}
        {[
          { r: 44, dur: 22, dash: "4 8",  color: "#3B82F6", op: 0.16 },
          { r: 56, dur: 35, dash: "2 6",  color: "#10B981", op: 0.12 },
          { r: 64, dur: 50, dash: "5 11", color: "#FBBF24", op: 0.09 },
        ].map(({ r, dur, dash, color, op }, i) => (
          <motion.circle key={`orbit-${i}`} cx={CX} cy={CY} r={r}
            fill="none" stroke={color} strokeWidth="0.7"
            strokeOpacity={op} strokeDasharray={dash}
            animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
            transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          />
        ))}

        {/* inner hexagons */}
        <motion.path d={hexPath}
          fill="none" stroke="#3B82F6" strokeWidth="0.7" strokeOpacity="0.22"
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        />
        <motion.path d={hexPath2}
          fill="none" stroke="#10B981" strokeWidth="0.8" strokeOpacity="0.28"
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        />

        {/* 3 orbiting dots */}
        {[
          { r: 44, dur: 5.5, color: "#3B82F6", size: 3,   startAngle: 0   },
          { r: 56, dur: 9,   color: "#10B981", size: 2.5, startAngle: 120 },
          { r: 64, dur: 14,  color: "#FBBF24", size: 2,   startAngle: 240 },
        ].map(({ r, dur, color, size, startAngle }, i) => (
          <motion.circle key={`dot-${i}`}
            cx={CX + r * Math.cos((startAngle * Math.PI) / 180)}
            cy={CY + r * Math.sin((startAngle * Math.PI) / 180)}
            r={size} fill={color}
            animate={{ rotate: 360 }}
            transition={{ duration: dur, repeat: Infinity, ease: "linear" }}
            style={{ transformOrigin: `${CX}px ${CY}px` }}
          />
        ))}

        {/* diamond outline at center */}
        <motion.path d={`M${CX} ${CY-14} L${CX+14} ${CY} L${CX} ${CY+14} L${CX-14} ${CY} Z`}
          fill="none" stroke="#3B82F6" strokeWidth="0.8" strokeOpacity="0.3"
          animate={{ rotate: [0, 45, 90, 135, 180] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
          initial={{ scale: 0, opacity: 0 }} whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
        />

        {/* emanation rings */}
        {[0, 1, 2].map(i => (
          <motion.circle key={`em-${i}`} cx={CX} cy={CY} fill="none"
            stroke="#3B82F6" strokeWidth="0.6"
            initial={{ r: 5, opacity: 0.5 }}
            animate={{ r: [5, 42], opacity: [0.5, 0] }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: i * 0.88 }}
          />
        ))}

        {/* center dot */}
        <motion.circle cx={CX} cy={CY} r="5"
          fill="#3B82F6"
          animate={{ opacity: [0.7, 1, 0.7], scale: [0.9, 1.1, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          style={{ transformOrigin: `${CX}px ${CY}px` }}
        />
        <circle cx={CX} cy={CY} r="2.5" fill="#FFFFFF" opacity="0.9" />
      </svg>
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
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen bg-[#121212] text-white antialiased overflow-x-hidden selection:bg-[#3B82F6]/30`}>
      <NeuralBackground />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#3B82F6] via-[#FBBF24] to-[#EF4444] origin-left z-50"
        style={{ scaleX }}
      />

      <nav className={`fixed top-0 w-full z-40 border-b border-[#2A2A2A] bg-[#121212]/95 backdrop-blur-sm`}>
        <div className="max-w-5xl mx-auto px-4 h-[56px] flex items-center justify-between">
          <motion.div
            className="flex items-center gap-2.5"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="w-8 h-8 bg-[#3B82F6] rounded-[10px] flex items-center justify-center  ">
              <Zap size={17} className="text-white" fill="white" />
            </div>
            <span className="text-[17px] font-bold tracking-tight">
              Flotter<span className="text-[#3B82F6]">.</span>
            </span>
          </motion.div>

          <motion.div
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Link href="/login" className={`hidden sm:block text-[#6B7280] text-[11px] font-bold uppercase tracking-widest px-3 py-2`}>
              {t('landing.nav.signIn')}
            </Link>
            <Link href="/register" className="bg-[#3B82F6] text-white px-4 py-2 rounded-[10px] text-[12px] font-bold uppercase tracking-widest">
              {t('landing.nav.getStarted')}
            </Link>
          </motion.div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section ref={heroRef} className="relative pt-[72px] overflow-hidden min-h-screen bg-[#121212] flex items-center">
        {/* Decorative diagonal accent lines */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-[60vw] h-px bg-gradient-to-l from-transparent via-[#3B82F6]/20 to-transparent" style={{ top: '38%' }} />
          <div className="absolute top-0 right-0 w-[40vw] h-px bg-gradient-to-l from-transparent via-[#3B82F6]/12 to-transparent" style={{ top: '55%' }} />
        </div>

        <div className="max-w-5xl mx-auto px-6 relative z-10 w-full py-16 md:py-0">
          <div className={`flex flex-col ${language === 'ar' ? 'md:flex-row-reverse' : 'md:flex-row'} md:items-center md:gap-16`}>

            {/* Left: Text */}
            <motion.div
              className={`flex-1 text-center ${language === 'ar' ? 'md:text-right' : 'md:text-left'}`}
              initial={{ opacity: 0, x: language === 'ar' ? 24 : -24 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.65 }}
            >
              <div className={`mb-5 flex items-center ${language === 'ar' ? 'justify-center md:justify-end' : 'justify-center md:justify-start'}`}>
                <FlotterLogo isDark={true} height={56} />
              </div>

              {/* Eyebrow badge */}
              <motion.div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#3B82F6]/10 border border-[#3B82F6]/25 mb-5"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15 }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3B82F6] opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#3B82F6]" />
                </span>
                <span className="text-[10px] font-black text-[#3B82F6] uppercase tracking-[0.22em]">
                  {t('landing.hero.neuralSync')}
                </span>
              </motion.div>

              <h1 className="text-[40px] md:text-[54px] font-black leading-[1.04] mb-5 text-white tracking-tight">
                {t('landing.hero.title1')}
                <span className="text-[#3B82F6] block">{t('landing.hero.title2')}</span>
              </h1>

              {/* Accent rule */}
              <motion.div
                className={`flex items-center gap-2 mb-6 ${language === 'ar' ? 'justify-center md:justify-end flex-row-reverse' : 'justify-center md:justify-start'}`}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={isHeroInView ? { opacity: 1, scaleX: 1 } : {}}
                transition={{ delay: 0.35, duration: 0.5 }}
                style={{ transformOrigin: language === 'ar' ? 'right' : 'left' }}
              >
                <div className="h-[2px] w-12 bg-[#3B82F6]" />
                <div className="h-[2px] w-5 bg-[#3B82F6]/40" />
                <div className="h-[2px] w-2 bg-[#3B82F6]/18" />
              </motion.div>

              <p className={`text-[14px] md:text-[15px] text-[#9CA3AF] mb-8 leading-relaxed max-w-sm mx-auto ${language === 'ar' ? 'md:mr-0' : 'md:ml-0'}`}>
                {t('landing.hero.desc1')}
                <span className="text-white font-semibold"> {t('landing.hero.desc2')}</span>
                {t('landing.hero.desc3')}
              </p>

              <div className={`flex flex-col items-center ${language === 'ar' ? 'md:items-end' : 'md:items-start'} gap-3 max-w-xs mx-auto md:mx-0`}>
                <Link
                  href="/register"
                  className="w-full group relative inline-flex items-center justify-center px-8 py-4 bg-[#3B82F6] rounded-[10px] font-bold text-white text-[13px] tracking-widest uppercase active:scale-95 overflow-hidden"
                >
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[10px]"
                    style={{ background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.13) 50%, transparent 65%)' }}
                    animate={{ x: ['-110%', '110%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
                  />
                  <span className="relative z-10 flex items-center gap-2.5">
                    {t('landing.hero.startTrial')} <ArrowRight size={16} className={`${language === 'ar' ? 'rotate-180' : ''}`} />
                  </span>
                </Link>

                <button className="w-full inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-[10px] border border-[#2d2d2d] text-[#9CA3AF] text-[13px] font-semibold">
                  <Play size={13} fill="#FACC15" className="text-[#FACC15]" />
                  {t('landing.hero.watchDemo')}
                </button>
              </div>
            </motion.div>

            {/* Right: Demo Visual */}
            <motion.div
              className="flex-shrink-0 w-full md:w-[400px] mt-12 md:mt-0"
              initial={{ opacity: 0, x: language === 'ar' ? -24 : 24 }}
              animate={isHeroInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Engineering corner-bracket frame */}
              <div className="relative p-3">
                <span className="absolute top-0 left-0 w-7 h-7 border-t-[2px] border-l-[2px] border-[#3B82F6]/50" />
                <span className="absolute top-0 right-0 w-7 h-7 border-t-[2px] border-r-[2px] border-[#3B82F6]/50" />
                <span className="absolute bottom-0 left-0 w-7 h-7 border-b-[2px] border-l-[2px] border-[#3B82F6]/50" />
                <span className="absolute bottom-0 right-0 w-7 h-7 border-b-[2px] border-r-[2px] border-[#3B82F6]/50" />
                {/* Label strip */}
                <div className="absolute -top-3 left-10 bg-[#121212] px-2 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
                  <span className="text-[8px] font-black tracking-[0.25em] uppercase text-[#3B82F6]">AI · LIVE DEMO</span>
                </div>
                <AIGenerationSVG />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-[#1e1e1e] bg-[#222222]">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-[#2A2A2A]">
            {[
              { value: 94, suffix: "%", label: t('landing.stats.retentionRate'), color: "#3B82F6" },
              { value: 3, suffix: "x", label: t('landing.stats.fasterLearning'), color: "#FACC15" },
              { value: 50, suffix: "ms", label: t('landing.stats.generation'), color: "#10B981" },
              { value: 2, suffix: "min", label: t('landing.stats.dailyAverage'), color: "#EF4444" }
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="py-9 px-6 flex flex-col items-center gap-2 text-center"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                viewport={{ once: true }}
              >
                <div className="text-[36px] font-black leading-none tabular-nums" style={{ color: stat.color }}>
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#6B7280]">{stat.label}</div>
                <motion.div
                  className="h-px w-8"
                  style={{ backgroundColor: stat.color }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.4 }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Decorator: Stats → Problem */}
      <div className="bg-[#121212]">
        <div className="max-w-3xl mx-auto">
          <FloatingDots count={6} color="#EF4444" />
        </div>
      </div>

      {/* PROBLEM SECTION */}
      <section className="py-20 px-4 bg-[#121212]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EF4444]/8 border border-[#EF4444]/20 rounded-sm mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
              <p className="text-[10px] font-bold uppercase text-[#EF4444] tracking-[0.28em]">{t('landing.problem.challenge')}</p>
            </div>
            <h2 className="text-[26px] md:text-[30px] font-bold text-white mb-3 leading-tight">{t('landing.problem.title')}</h2>
            <p className="text-[#9CA3AF] text-[14px] max-w-md mx-auto">{t('landing.problem.subtitle')}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-10"
          >
            <RetentionGraph />
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {[
              { title: t('landing.problem.passiveTitle'), desc: t('landing.problem.passiveDesc') },
              { title: t('landing.problem.contextTitle'), desc: t('landing.problem.contextDesc') },
              { title: t('landing.problem.frictionTitle'), desc: t('landing.problem.frictionDesc') }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="rounded-xl p-5 bg-[#1a1a1a] border border-[#2A2A2A] flex flex-col gap-3"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.06 * i }}
              >
                <div className="w-8 h-8 rounded-[8px] bg-[#EF4444]/8 flex items-center justify-center flex-shrink-0 border border-[#EF4444]/18">
                  <X className="text-[#EF4444]" size={14} />
                </div>
                <div>
                  <h3 className="text-[13px] font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-[#9CA3AF] text-[12px] leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Decorator: Problem → Methodology */}
      <div className="bg-[#121212]">
        <div className="max-w-3xl mx-auto">
          <NeuralConnector />
        </div>
      </div>

      {/* METHODOLOGY SECTION */}
      <section className="py-20 px-4 relative bg-[#121212]">
        <div className="max-w-3xl mx-auto relative z-10">

          {/* Section header */}
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm bg-[#3B82F6]/8 border border-[#3B82F6]/18 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]" />
              <p className="text-[10px] font-bold uppercase text-[#3B82F6] tracking-[0.3em]">
                {t('landing.methodology.title')}
              </p>
            </div>
            <h2 className="text-[28px] md:text-[34px] font-black leading-[1.1] mb-3 text-white tracking-tight">
              {t('landing.methodology.heading1')}<span className="text-[#3B82F6]">Flotter</span>{t('landing.methodology.heading2')}
            </h2>
          </motion.div>

          {/* ══════════════════════════════════════════════════════
              PART 01: AI FLASHCARD CREATION ENGINE
              ══════════════════════════════════════════════════════ */}
          <div className="mb-20">
            {/* Section Header */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: language === 'ar' ? 10 : -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#3B82F6] text-white text-[12px] font-bold flex-shrink-0">
                01
              </div>
              <h3 className="text-[19px] font-bold text-white">{t('landing.engine.title')}</h3>
              <div className="flex-1 h-px bg-[#2A2A2A]" />
            </motion.div>

            <div className="flex flex-col gap-4">
              {/* ─── Main Card: Overview + KPIs + Visualizer ─── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="rounded-2xl bg-[#1a1a1a] border border-dashed border-[#383838] overflow-hidden">
                  <div className="p-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#3B82F6] mb-4 inline-block">
                      {t('landing.engine.badge')}
                    </span>
                    <h4 className="text-[20px] font-bold mb-2 text-white">{t('landing.engine.subtitle')}</h4>
                    <p className="text-[14px] leading-relaxed text-[#9CA3AF]">{t('landing.engine.desc')}</p>
                  </div>

                  {/* KPI Stats */}
                  <div className="grid grid-cols-3 border-t border-[#2A2A2A]">
                    {[
                      { val: t('landing.engine.kpi1'), label: t('landing.engine.kpi1Label'), sub: t('landing.engine.kpi1Sub'), color: '#3B82F6' },
                      { val: t('landing.engine.kpi2'), label: t('landing.engine.kpi2Label'), sub: t('landing.engine.kpi2Sub'), color: '#FBBF24' },
                      { val: t('landing.engine.kpi3'), label: t('landing.engine.kpi3Label'), sub: t('landing.engine.kpi3Sub'), color: '#10B981' },
                    ].map((kpi, i) => (
                      <div key={i} className={`p-4 text-center ${i < 2 ? 'border-r border-[#2A2A2A]' : ''}`}>
                        <div className="text-[22px] font-bold" style={{ color: kpi.color }}>{kpi.val}</div>
                        <div className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF] mt-1">{kpi.label}</div>
                        <div className="text-[9px] text-[#6B7280] mt-0.5">{kpi.sub}</div>
                      </div>
                    ))}
                  </div>

                  {/* Generation Pipeline */}
                  <div className="p-6 border-t border-[#2A2A2A]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-[#4B5563]">{t('landing.engine.processTitle')}</p>
                    <AIGenerationVisualizer />
                  </div>
                </div>
              </motion.div>

              {/* ─── Memory Tetrad Card ─── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
              >
                <div className="rounded-2xl bg-[#1a1a1a] border border-dashed border-[#383838] p-6">
                  <h4 className="text-[17px] font-bold mb-1 text-white">{t('landing.engine.tetradTitle')}</h4>
                  <p className="text-[13px] text-[#6B7280] mb-5 leading-relaxed">{t('landing.engine.tetradDesc')}</p>

                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: Eye, title: t('landing.engine.trace1'), desc: t('landing.engine.trace1Desc'), color: '#3B82F6' },
                      { icon: Layers, title: t('landing.engine.trace2'), desc: t('landing.engine.trace2Desc'), color: '#10B981' },
                      { icon: Heart, title: t('landing.engine.trace3'), desc: t('landing.engine.trace3Desc'), color: '#EF4444' },
                      { icon: Brain, title: t('landing.engine.trace4'), desc: t('landing.engine.trace4Desc'), color: '#FBBF24' },
                    ].map((trace, i) => (
                      <motion.div
                        key={i}
                        className="rounded-xl p-4 border border-dashed"
                        style={{
                          borderColor: `${trace.color}35`,
                          background: `linear-gradient(135deg, ${trace.color}08 0%, transparent 60%)`
                        }}
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <trace.icon size={14} style={{ color: trace.color }} />
                          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: trace.color }}>
                            {trace.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#9CA3AF] leading-relaxed">{trace.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ─── 6 Scientific Principles Card ─── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="rounded-2xl bg-[#1a1a1a] border border-dashed border-[#383838] p-6">
                  <h4 className="text-[17px] font-bold mb-5 text-white">{t('landing.engine.scienceTitle')}</h4>

                  <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                    {[
                      { icon: Layers, title: t('landing.engine.p1'), desc: t('landing.engine.p1d'), color: '#3B82F6' },
                      { icon: Eye, title: t('landing.engine.p2'), desc: t('landing.engine.p2d'), color: '#FBBF24' },
                      { icon: Zap, title: t('landing.engine.p3'), desc: t('landing.engine.p3d'), color: '#10B981' },
                      { icon: BookOpen, title: t('landing.engine.p4'), desc: t('landing.engine.p4d'), color: '#3B82F6' },
                      { icon: Brain, title: t('landing.engine.p5'), desc: t('landing.engine.p5d'), color: '#EF4444' },
                      { icon: Volume2, title: t('landing.engine.p6'), desc: t('landing.engine.p6d'), color: '#F97316' },
                    ].map((p, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-2.5"
                        initial={{ opacity: 0, y: 8 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * i }}
                      >
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                          style={{ backgroundColor: `${p.color}12` }}
                        >
                          <p.icon size={13} style={{ color: p.color }} />
                        </div>
                        <div>
                          <span className="text-[11px] font-bold text-white block mb-0.5">{p.title}</span>
                          <p className="text-[10px] text-[#6B7280] leading-relaxed">{p.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Bottom Line Quote */}
                  <div className="mt-6 pt-5 border-t border-[#2A2A2A] text-center">
                    <p className="text-[13px] font-medium text-[#9CA3AF] italic leading-relaxed">
                      &ldquo;{t('landing.engine.bottomLine')}&rdquo;
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Decorator: Engine → ACASRS */}
          <PulseLine color="#10B981" />

          {/* ══════════════════════════════════════════════════════
              PART 02: ACASRS PROTOCOL
              ══════════════════════════════════════════════════════ */}
          <div>
            {/* Section Header */}
            <motion.div
              className="flex items-center gap-3 mb-6"
              initial={{ opacity: 0, x: language === 'ar' ? 10 : -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-[#10B981] text-white text-[12px] font-bold flex-shrink-0">
                02
              </div>
              <h3 className="text-[19px] font-bold text-white">{t('landing.acasrs2.title')}</h3>
              <div className="flex-1 h-px bg-[#2A2A2A]" />
            </motion.div>

            <div className="flex flex-col gap-4">
              {/* ─── Main Card: Overview + Forgetting Curve ─── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
              >
                <div className="rounded-2xl bg-[#1a1a1a] border border-dashed border-[#383838] overflow-hidden">
                  <div className="p-6">
                    <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#10B981] mb-4 inline-block">
                      {t('landing.acasrs2.badge')}
                    </span>
                    <h4 className="text-[20px] font-bold mb-2 text-white">{t('landing.acasrs2.subtitle')}</h4>
                    <p className="text-[14px] mb-5 leading-relaxed text-[#9CA3AF]">{t('landing.acasrs2.desc')}</p>

                    {/* Forgetting Curve Highlight */}
                    <div className="rounded-xl p-4 border border-dashed border-[#EF4444]/25 bg-[#EF4444]/[0.03]">
                      <h5 className="text-[13px] font-bold text-[#EF4444] mb-1.5">{t('landing.acasrs2.curveTitle')}</h5>
                      <p className="text-[12px] text-[#9CA3AF] leading-relaxed">{t('landing.acasrs2.curveDesc')}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* ─── Three-Phase Validation Card ─── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.15 }}
              >
                <div className="rounded-2xl bg-[#1a1a1a] border border-dashed border-[#383838] p-6">
                  <h4 className="text-[17px] font-bold mb-5 text-white">{t('landing.acasrs2.phasesTitle')}</h4>

                  <div className="space-y-4">
                    {[
                      { phase: t('landing.acasrs2.phase1'), time: t('landing.acasrs2.phase1Time'), desc: t('landing.acasrs2.phase1Desc'), color: '#3B82F6', icon: Clock },
                      { phase: t('landing.acasrs2.phase2'), time: t('landing.acasrs2.phase2Time'), desc: t('landing.acasrs2.phase2Desc'), color: '#FBBF24', icon: Brain },
                      { phase: t('landing.acasrs2.phase3'), time: t('landing.acasrs2.phase3Time'), desc: t('landing.acasrs2.phase3Desc'), color: '#10B981', icon: Layers },
                    ].map((p, i) => (
                      <motion.div
                        key={i}
                        className="flex gap-4 items-start"
                        initial={{ opacity: 0, x: language === 'ar' ? 12 : -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 + i * 0.08 }}
                      >
                        {/* Timeline connector */}
                        <div className="flex flex-col items-center flex-shrink-0">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center border"
                            style={{ borderColor: `${p.color}30` }}
                          >
                            <p.icon size={18} style={{ color: p.color }} />
                          </div>
                          {i < 2 && <div className="w-px h-6 bg-[#2A2A2A] mt-1" />}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[14px] font-bold text-white">{p.phase}</span>
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md" style={{ color: p.color, backgroundColor: `${p.color}10` }}>{p.time}</span>
                          </div>
                          <p className="text-[12px] text-[#6B7280] leading-relaxed">{p.desc}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="mt-6 pt-6 border-t border-[#2A2A2A]">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] mb-4 text-[#4B5563]">
                      {language === 'ar' ? 'معاينة مراحل الخوارزمية' : 'Algorithm Phase Preview'}
                    </p>
                    <ACASRSVisualizer />
                  </div>
                </div>
              </motion.div>

              {/* ─── Comparison Card: Legacy vs ACASRS ─── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="rounded-2xl bg-[#1a1a1a] border border-dashed border-[#383838] p-6">
                  <h4 className="text-[17px] font-bold mb-5 text-white">{t('landing.acasrs2.vsTitle')}</h4>

                  {/* Table Header */}
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    <div />
                    <div className="flex items-center justify-center gap-1.5 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#EF4444]">{t('landing.acasrs2.legacy')}</span>
                    </div>
                    <div className="flex items-center justify-center gap-1.5 py-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                      <span className="text-[9px] font-bold uppercase tracking-wider text-[#10B981]">{t('landing.acasrs2.acasrsLabel')}</span>
                    </div>
                  </div>

                  {/* Table Rows */}
                  <div className="space-y-2">
                    {[
                      { dim: t('landing.acasrs2.row1'), legacy: t('landing.acasrs2.row1L'), acasrs: t('landing.acasrs2.row1A') },
                      { dim: t('landing.acasrs2.row2'), legacy: t('landing.acasrs2.row2L'), acasrs: t('landing.acasrs2.row2A') },
                      { dim: t('landing.acasrs2.row3'), legacy: t('landing.acasrs2.row3L'), acasrs: t('landing.acasrs2.row3A') },
                      { dim: t('landing.acasrs2.row4'), legacy: t('landing.acasrs2.row4L'), acasrs: t('landing.acasrs2.row4A') },
                    ].map((row, i) => (
                      <motion.div
                        key={i}
                        className="grid grid-cols-3 gap-2"
                        initial={{ opacity: 0, x: language === 'ar' ? 8 : -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.06 * i }}
                      >
                        <div className="rounded-lg p-3 flex items-center border border-dashed border-[#383838] bg-[#1A1A1A]">
                          <span className="text-[10px] font-bold text-white">{row.dim}</span>
                        </div>
                        <div className="rounded-lg p-3 flex items-center border border-dashed border-[#383838] bg-[#1A1A1A]">
                          <div className="flex items-start gap-1.5">
                            <X size={10} className="text-[#EF4444] mt-0.5 flex-shrink-0" />
                            <span className="text-[10px] text-[#9CA3AF] leading-snug">{row.legacy}</span>
                          </div>
                        </div>
                        <div className="rounded-lg p-3 flex items-center border border-[#10B981]/20">
                          <div className="flex items-start gap-1.5">
                            <ChevronRight size={10} className="text-[#10B981] mt-0.5 flex-shrink-0" />
                            <span className="text-[10px] text-[#10B981] font-medium leading-snug">{row.acasrs}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* ─── Behavioral Intelligence Card ─── */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.25 }}
              >
                <div className="rounded-2xl bg-[#1a1a1a] border border-dashed border-[#383838] p-6">
                  <h4 className="text-[17px] font-bold mb-1 text-white">{t('landing.acasrs2.signals')}</h4>
                  <p className="text-[13px] text-[#6B7280] mb-5 leading-relaxed">{t('landing.acasrs2.signalsDesc')}</p>

                  <div className="space-y-3">
                    {[
                      { icon: Clock, title: t('landing.acasrs2.signal1'), desc: t('landing.acasrs2.signal1Desc'), color: '#3B82F6' },
                      { icon: Zap, title: t('landing.acasrs2.signal2'), desc: t('landing.acasrs2.signal2Desc'), color: '#FBBF24' },
                      { icon: Brain, title: t('landing.acasrs2.signal3'), desc: t('landing.acasrs2.signal3Desc'), color: '#10B981' },
                    ].map((signal, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-3 rounded-xl p-4 bg-[#1A1A1A] border border-dashed border-[#383838]"
                        initial={{ opacity: 0, y: 6 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.08 * i }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 border"
                          style={{ borderColor: `${signal.color}25` }}
                        >
                          <signal.icon size={16} style={{ color: signal.color }} />
                        </div>
                        <div>
                          <span className="text-[13px] font-bold text-white block mb-0.5">{signal.title}</span>
                          <span className="text-[12px] text-[#6B7280] leading-relaxed">{signal.desc}</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Decorator: Methodology → CTA */}
      <div className="bg-[#121212]">
        <div className="max-w-3xl mx-auto">
          <OrbitDecoration />
        </div>
      </div>

      {/* FINAL CTA */}
      <section className={`py-20 px-4 bg-[#121212] relative overflow-hidden`}>
        <div className="max-w-lg mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className={`text-[28px] font-bold mb-3 leading-tight text-white`}>
              {t('landing.cta.upgrade')}
              <span className="text-[#3B82F6]"> {t('landing.cta.pathways')}</span>
            </h2>
            <p className="text-[14px] text-[#6B7280] mb-8 max-w-sm mx-auto leading-relaxed">
              {t('landing.cta.join')}
            </p>

            <div className="flex flex-col items-center gap-3">
              <div className="relative w-full">
                {/* Pulsing glow ring — draws eye to CTA */}
                {[0, 1].map((i) => (
                  <motion.span
                    key={i}
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[14px] border border-[#3B82F6]"
                    initial={{ opacity: 0.5, scale: 1 }}
                    animate={{ opacity: 0, scale: 1.08 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeOut', delay: i * 1 }}
                  />
                ))}
                <Link
                  href="/register"
                  className="relative w-full inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-[#3B82F6] text-white rounded-[14px] font-bold text-[15px] tracking-wide active:scale-95 overflow-hidden"
                >
                  {/* Shimmer sweep */}
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 rounded-[14px]"
                    style={{
                      background: 'linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.13) 50%, transparent 65%)'
                    }}
                    animate={{ x: ['-110%', '110%'] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'linear', repeatDelay: 0.8 }}
                  />
                  <span className="relative z-10 flex items-center gap-2.5">
                    {t('landing.cta.startProtocol')}
                    <ArrowRight size={18} className={`${language === 'ar' ? 'rotate-180' : ''}`} />
                  </span>
                </Link>
              </div>
              <p className="text-[11px] font-medium tracking-wider text-[#4B5563]">
                {t('landing.cta.noCreditCard')}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`border-t border-[#2A2A2A] py-10 px-4 bg-[#121212]`}>
        <div className="max-w-lg mx-auto flex flex-col items-center gap-5">
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

          <div className={`flex gap-6 ${language === 'ar' ? 'text-[11px] font-bold uppercase tracking-widest' : 'text-[13px] font-medium'} text-[#6B7280]`}>
            <Link href="/legal/mentions" className={`text-[#9CA3AF] whitespace-nowrap`}>{t('globalFooter.legalNotice')}</Link>
            <Link href="/legal/privacy" className={`text-[#9CA3AF] whitespace-nowrap`}>{t('globalFooter.privacyPolicy')}</Link>
            <Link href="/legal/terms" className={`text-[#9CA3AF] whitespace-nowrap`}>{t('globalFooter.termsOfService')}</Link>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[#6B7280]">
              <svg width="14" height="14" viewBox="164 107 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
                <path d="M188.866 120.889C188.866 118.834 188.149 116.128 186.501 113.968C184.897 111.866 182.386 110.239 178.611 110.239C175.978 110.239 174.103 110.847 172.813 111.876C171.542 112.89 170.65 114.462 170.254 116.797C170.168 117.299 169.859 117.73 169.42 117.961C168.145 118.631 167.12 119.185 166.341 119.628C166.596 119.847 166.853 120.114 167.063 120.437C167.531 121.157 167.72 122.097 167.337 123.1C167.137 123.626 166.848 124.232 166.597 124.773C166.331 125.347 166.082 125.9 165.89 126.431C165.695 126.971 165.592 127.402 165.573 127.729C165.555 128.041 165.617 128.145 165.637 128.174C165.672 128.224 165.755 128.318 166.054 128.42C166.383 128.532 166.804 128.598 167.421 128.682C168.497 128.828 170.263 129.004 171.662 130.152L171.738 130.215C173.342 131.563 174.454 133.512 175.164 135.905C175.418 136.76 174.953 137.666 174.125 137.928C173.298 138.191 172.421 137.71 172.168 136.855C171.582 134.881 170.75 133.559 169.76 132.728L169.713 132.688C169.121 132.203 168.309 132.069 167.013 131.893C166.443 131.816 165.729 131.719 165.074 131.496C164.389 131.263 163.639 130.853 163.089 130.061L163.089 130.061C162.525 129.247 162.397 128.332 162.444 127.532C162.491 126.747 162.71 125.973 162.953 125.299C163.199 124.617 163.504 123.948 163.771 123.373C164.003 122.871 164.195 122.465 164.338 122.12C164.259 122.053 164.156 121.978 164.024 121.893C163.885 121.803 163.737 121.717 163.57 121.621C163.421 121.536 163.223 121.423 163.054 121.313C162.923 121.229 162.612 121.025 162.374 120.707C162.242 120.53 162.046 120.207 162.007 119.755C161.964 119.253 162.133 118.821 162.366 118.514L162.366 118.514C162.611 118.19 162.981 117.931 163.201 117.78C163.49 117.583 163.861 117.353 164.301 117.096C165.053 116.654 166.064 116.098 167.324 115.43C167.896 112.869 169.058 110.779 170.897 109.312C172.907 107.709 175.537 107 178.611 107C183.396 107 186.796 109.123 188.963 111.963C191.086 114.745 192 118.174 192 120.889C192 126.067 188.126 131.373 182.568 133.134C182.872 133.665 183.395 134.38 184.195 135.292C184.777 135.955 184.729 136.979 184.088 137.58C183.446 138.181 182.455 138.131 181.874 137.468C180.865 136.318 180.083 135.261 179.625 134.319C179.216 133.48 178.792 132.153 179.566 130.989L179.588 130.956C179.822 130.622 180.171 130.392 180.565 130.315C185.51 129.341 188.866 124.821 188.866 120.889Z" fill="#D1D5DB" />
                <path fillRule="evenodd" clipRule="evenodd" d="M174.245 115.802C173.821 117.538 173.947 118.757 174.624 119.459C175.301 120.161 176.455 120.62 178.086 120.836C177.716 123.076 178.168 124.126 179.44 123.988C180.712 123.85 181.477 123.292 181.733 122.316C183.722 122.905 184.799 122.412 184.966 120.836C185.217 118.473 184.008 116.588 183.513 116.588C183.017 116.588 181.733 116.524 181.733 115.802C181.733 115.079 180.234 114.671 178.88 114.671C177.527 114.671 178.341 113.709 176.483 114.089C175.244 114.342 174.498 114.913 174.245 115.802Z" fill="#FCD34D" />
                <path d="M175.638 113.107C176.177 113.006 176.668 112.964 177.113 113.036C177.643 113.123 177.989 113.351 178.231 113.567C178.259 113.592 178.283 113.613 178.302 113.631C178.319 113.631 178.339 113.632 178.361 113.632C179.163 113.632 180.047 113.74 180.778 113.976C181.137 114.092 181.543 114.266 181.884 114.536C182.122 114.725 182.388 115.012 182.531 115.398C182.596 115.407 182.667 115.416 182.744 115.422C182.89 115.434 183.028 115.437 183.131 115.437C183.571 115.437 183.91 115.616 184.094 115.734C184.3 115.867 184.475 116.029 184.619 116.186C184.907 116.501 185.17 116.906 185.384 117.357C185.814 118.263 186.116 119.498 185.957 120.873C185.835 121.926 185.319 122.906 184.199 123.375C183.53 123.655 182.779 123.69 182.015 123.588C181.81 123.846 181.562 124.074 181.271 124.268C180.636 124.692 179.873 124.903 179.075 124.982C178.574 125.032 178.026 124.988 177.513 124.739C176.981 124.482 176.612 124.064 176.388 123.586C176.14 123.058 176.06 122.442 176.08 121.792C174.852 121.52 173.798 121.07 173.042 120.352L173.042 120.353C171.801 119.175 171.832 117.393 172.294 115.665C172.298 115.649 172.303 115.633 172.308 115.617C172.769 114.132 174.114 113.393 175.638 113.107ZM176.545 115.585C176.463 115.591 176.335 115.606 176.148 115.641H176.148C175.155 115.827 174.943 116.147 174.877 116.339C174.489 117.811 174.748 118.335 174.903 118.497L174.918 118.512L174.918 118.512C175.301 118.876 176.132 119.258 177.711 119.449C178.074 119.493 178.402 119.679 178.62 119.962C178.837 120.246 178.925 120.603 178.862 120.951C178.777 121.424 178.747 121.791 178.754 122.068C178.759 122.229 178.775 122.341 178.792 122.415C178.795 122.415 178.798 122.415 178.8 122.414C179.311 122.364 179.598 122.246 179.749 122.145C179.876 122.061 179.958 121.958 180.009 121.778C180.104 121.448 180.332 121.167 180.642 120.999C180.952 120.83 181.318 120.788 181.661 120.881C182.59 121.132 183.007 121.06 183.134 121.007C183.168 120.993 183.178 120.983 183.193 120.96C183.217 120.923 183.271 120.818 183.298 120.586V120.586C183.396 119.735 183.206 118.969 182.95 118.431C182.863 118.247 182.776 118.106 182.704 118.007C182.409 117.99 182.039 117.951 181.683 117.861C181.404 117.79 181.019 117.661 180.68 117.4C180.399 117.184 180.141 116.867 180.025 116.457C179.997 116.447 179.964 116.435 179.927 116.423C179.537 116.297 178.953 116.213 178.361 116.213C177.863 116.213 177.41 116.131 177.004 115.913C176.809 115.808 176.665 115.692 176.565 115.603C176.558 115.597 176.552 115.591 176.545 115.585Z" fill="#D1D5DB" />
                <path d="M180.845 123.19C181.507 122.823 182.377 123.005 182.788 123.596C183.199 124.187 182.995 124.964 182.333 125.331C182.02 125.505 181.642 125.74 181.303 125.984C180.944 126.243 180.713 126.452 180.619 126.57L180.619 126.57C180.348 126.908 180.09 127.212 179.864 127.479C179.632 127.752 179.441 127.978 179.277 128.187C178.936 128.62 178.827 128.843 178.795 128.985C178.643 129.668 177.9 130.111 177.136 129.976C176.372 129.84 175.875 129.176 176.027 128.494C176.18 127.81 176.583 127.227 176.967 126.738C177.166 126.485 177.391 126.221 177.614 125.957C177.842 125.688 178.078 125.409 178.325 125.102L178.325 125.102C178.646 124.703 179.115 124.323 179.53 124.023C179.967 123.708 180.44 123.414 180.845 123.19Z" fill="#D1D5DB" />
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