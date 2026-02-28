"use client"

import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useLanguage } from '../../providers/LanguageProvider'
import { useTheme } from '../../providers/ThemeProvider'
import { useUser } from '../../providers/UserProvider'
import Link from 'next/link'
import {
  ChevronLeft,
  Search,
  Sun,
  Briefcase,
  Plane,
  GraduationCap,
  Cpu,
  Heart,
  BookOpen,
  ChevronRight,
  ChevronUp,
  Sparkles,
  ArrowRight,
  X,
  Filter,
  Activity,
  Palette,
  Globe,
  Zap,
  Atom,
  Home,
  Film,
  Shirt,
  Users,
  CloudSun,
  Wallet,
  Dumbbell,
  School,
  FlaskConical,
  Leaf,
  Scale,
  UtensilsCrossed,
  Brain,
  Landmark,
  PawPrint,
  Car,
  Share2,
} from 'lucide-react'
import {
  wordLibrary,
  megaCategories,
  searchWords,
  type WordCategory,
  type WordEntry,
  type MegaCategory,
} from '@/lib/word-library'

const iconMap: Record<string, React.ReactNode> = {
  Sun: <Sun size={22} />,
  Briefcase: <Briefcase size={22} />,
  Plane: <Plane size={22} />,
  GraduationCap: <GraduationCap size={22} />,
  Cpu: <Cpu size={22} />,
  Heart: <Heart size={22} />,
  Activity: <Activity size={22} />,
  Palette: <Palette size={22} />,
  BookOpen: <BookOpen size={22} />,
  Globe: <Globe size={22} />,
  Zap: <Zap size={22} />,
  Atom: <Atom size={22} />,
  Home: <Home size={22} />,
  Film: <Film size={22} />,
  Shirt: <Shirt size={22} />,
  Users: <Users size={22} />,
  CloudSun: <CloudSun size={22} />,
  Wallet: <Wallet size={22} />,
  Dumbbell: <Dumbbell size={22} />,
  School: <School size={22} />,
  FlaskConical: <FlaskConical size={22} />,
  Leaf: <Leaf size={22} />,
  Scale: <Scale size={22} />,
  ChefHat: <UtensilsCrossed size={22} />,
  Brain: <Brain size={22} />,
  Landmark: <Landmark size={22} />,
  PawPrint: <PawPrint size={22} />,
  Car: <Car size={22} />,
  Share2: <Share2 size={22} />,
  Sparkles: <Sparkles size={22} />,
}

const iconMapLg: Record<string, React.ReactNode> = {
  BookOpen: <BookOpen size={28} />,
  Globe: <Globe size={28} />,
  Atom: <Atom size={28} />,
  Heart: <Heart size={28} />,
  Zap: <Zap size={28} />,
  Sparkles: <Sparkles size={28} />,
  Home: <Home size={28} />,
}

const difficultyConfig = {
  beginner: { label: 'Beginner', labelAr: 'مبتدئ', color: '#10B981', bg: '#10B981' },
  intermediate: { label: 'Intermediate', labelAr: 'متوسط', color: '#F59E0B', bg: '#F59E0B' },
  advanced: { label: 'Advanced', labelAr: 'متقدم', color: '#EF4444', bg: '#EF4444' },
}

// ─── Swipeable Carousel Hook ───
function useCarousel(itemCount: number, autoSlideInterval = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [dragOffset, setDragOffset] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null)
  const pauseTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const goTo = useCallback((index: number) => {
    setCurrentIndex(Math.max(0, Math.min(index, itemCount - 1)))
  }, [itemCount])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % itemCount)
  }, [itemCount])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + itemCount) % itemCount)
  }, [itemCount])

  // Auto-slide
  useEffect(() => {
    if (!isAutoPlaying || itemCount <= 1) return
    autoPlayRef.current = setInterval(goNext, autoSlideInterval)
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [isAutoPlaying, goNext, autoSlideInterval, itemCount])

  // Pause auto-slide on user interaction, resume after 6s
  const pauseAutoPlay = useCallback(() => {
    setIsAutoPlaying(false)
    if (pauseTimeoutRef.current) clearTimeout(pauseTimeoutRef.current)
    pauseTimeoutRef.current = setTimeout(() => setIsAutoPlaying(true), 6000)
  }, [])

  // Touch/mouse handlers
  const handleDragStart = useCallback((clientX: number) => {
    setIsDragging(true)
    setStartX(clientX)
    setDragOffset(0)
    pauseAutoPlay()
  }, [pauseAutoPlay])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDragging) return
    setDragOffset(clientX - startX)
  }, [isDragging, startX])

  const handleDragEnd = useCallback((isRtl = false) => {
    if (!isDragging) return
    setIsDragging(false)
    const threshold = 50
    if (isRtl) {
      if (dragOffset > threshold) goNext()
      else if (dragOffset < -threshold) goPrev()
    } else {
      if (dragOffset > threshold) goPrev()
      else if (dragOffset < -threshold) goNext()
    }
    setDragOffset(0)
  }, [isDragging, dragOffset, goNext, goPrev])

  // Calculate slide offset: each slide is at (index - currentIndex) * 100%
  // During drag, add pixel offset
  const getSlideStyle = useCallback((index: number): React.CSSProperties => {
    const position = index - currentIndex
    const dragPx = isDragging ? dragOffset : 0
    return {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      transform: `translateX(calc(${position * 100}% + ${dragPx}px))`,
      transition: isDragging ? 'none' : 'transform 0.3s ease-out',
    }
  }, [currentIndex, isDragging, dragOffset])

  return {
    currentIndex,
    isDragging,
    containerRef,
    goTo,
    goNext,
    goPrev,
    pauseAutoPlay,
    getSlideStyle,
    handlers: (isRtl = false) => ({
      onTouchStart: (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX),
      onTouchMove: (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX),
      onTouchEnd: () => handleDragEnd(isRtl),
      onMouseDown: (e: React.MouseEvent) => { e.preventDefault(); handleDragStart(e.clientX) },
      onMouseMove: (e: React.MouseEvent) => handleDragMove(e.clientX),
      onMouseUp: () => handleDragEnd(isRtl),
      onMouseLeave: () => { if (isDragging) { handleDragEnd(isRtl) } },
    }),
  }
}

export default function WordLibraryPage() {
  const router = useRouter()
  const { t, language } = useLanguage()
  const { isDark } = useTheme()
  const { user } = useUser()

  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<WordCategory | null>(null)
  const [difficultyFilter, setDifficultyFilter] = useState<string>('all')
  const [showFilters, setShowFilters] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)

  const carousel = useCarousel(megaCategories.length, 3000)

  // Scroll-to-top visibility
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Restore category/filter from URL search params
  useEffect(() => {
    const catId = searchParams.get('category')
    const diff = searchParams.get('difficulty')
    if (catId) {
      const found = wordLibrary.find(c => c.id === catId)
      if (found) setSelectedCategory(found)
    }
    if (diff && ['beginner', 'intermediate', 'advanced'].includes(diff)) {
      setDifficultyFilter(diff)
      setShowFilters(true)
    }
  }, [searchParams])

  // Search results
  const searchResults = useMemo(() => {
    if (searchQuery.trim().length < 2) return []
    return searchWords(searchQuery)
  }, [searchQuery])

  // Filtered words for selected category
  const filteredWords = useMemo(() => {
    if (!selectedCategory) return []
    if (difficultyFilter === 'all') return selectedCategory.words
    return selectedCategory.words.filter((w) => w.difficulty === difficultyFilter)
  }, [selectedCategory, difficultyFilter])

  const handleCategorySelect = (category: WordCategory) => {
    setIsTransitioning(true)
    setTimeout(() => {
      setSelectedCategory(category)
      setIsTransitioning(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 150)
    const params = new URLSearchParams()
    params.set('category', category.id)
    router.replace(`/cards/library?${params.toString()}`, { scroll: false })
  }

  const handleDifficultyChange = (level: string) => {
    setDifficultyFilter(level)
    if (selectedCategory) {
      const params = new URLSearchParams()
      params.set('category', selectedCategory.id)
      if (level !== 'all') params.set('difficulty', level)
      router.replace(`/cards/library?${params.toString()}`, { scroll: false })
    }
  }

  const handleBackToLibrary = () => {
    setSelectedCategory(null)
    setDifficultyFilter('all')
    router.replace('/cards/library', { scroll: false })
  }

  const handleWordSelect = (word: string) => {
    router.push(`/cards/new?word=${encodeURIComponent(word)}`)
  }

  // ─── Design tokens ───
  const cardBase = `rounded-[16px] border transition-all ${isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'}`
  const inputBase = `w-full rounded-[12px] px-3 py-2.5 text-[14px] placeholder-[#6B7280] outline-none focus:border-[#3B82F6] transition-all ${isDark ? 'bg-[#222222] border border-[#2D2D2F] text-[#FFFFFF]' : 'bg-white border border-[#E2E4E9] text-[#111827]'}`

  // Keyboard navigation for carousel
  const handleCarouselKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      carousel.pauseAutoPlay()
      language === 'ar' ? carousel.goNext() : carousel.goPrev()
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      carousel.pauseAutoPlay()
      language === 'ar' ? carousel.goPrev() : carousel.goNext()
    }
  }, [carousel, language])

  // Loading overlay during category transition
  if (isTransitioning) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-[#121212]' : 'bg-[#F8F9FA]'}`}>
        <div className="w-6 h-6 border-2 border-[#3B82F6] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // ─── Category Detail View ───
  if (selectedCategory) {
    return (
      <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen antialiased pb-32 font-sans ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
        {/* Header */}
        <header dir="ltr" className={`sticky top-0 z-20 border-b px-4 h-[64px] flex items-center justify-between ${isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-[#E2E4E9]'}`}>
          <div className="flex items-center gap-2">
            <button onClick={handleBackToLibrary} className={`p-1 transition-colors ${isDark ? 'text-[#9CA3AF] hover:text-[#FFFFFF]' : 'text-[#6B7280] hover:text-[#111827]'}`}>
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-[17px] font-bold tracking-[-0.5px]">
              {language === 'ar' ? selectedCategory.nameAr : selectedCategory.name}
            </h1>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            aria-label="Filter by difficulty"
            title="Filter by difficulty"
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-[10px] transition-colors ${showFilters ? 'text-[#3B82F6] bg-[#3B82F6]/10' : isDark ? 'text-[#9CA3AF] hover:text-white' : 'text-[#6B7280] hover:text-[#111827]'}`}
          >
            <Filter size={18} />
            <span className="text-[11px] font-bold uppercase tracking-wider">{t('wordLibrary.allLevels')}</span>
          </button>
        </header>

        <main className="max-w-2xl mx-auto p-4 mt-2">
          {/* Category Info Card */}
          <div className={`${cardBase} p-4 mb-4`}>
            <div className="flex items-center gap-3 mb-2">
              <div
                className="w-10 h-10 rounded-[12px] flex items-center justify-center"
                style={{ backgroundColor: `${selectedCategory.color}15`, color: selectedCategory.color }}
              >
                {iconMap[selectedCategory.icon] || <BookOpen size={22} />}
              </div>
              <div>
                <p className={`text-[13px] font-bold ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>
                  {language === 'ar' ? selectedCategory.nameAr : selectedCategory.name}
                </p>
                <p className={`text-[11px] ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                  {filteredWords.length} {t('wordLibrary.wordsAvailable')}
                </p>
              </div>
            </div>
            <p className={`text-[12px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              {language === 'ar' ? selectedCategory.descriptionAr : selectedCategory.description}
            </p>
          </div>

          {/* Difficulty Filter Chips */}
          {showFilters && (
            <div className="flex gap-2 mb-4 flex-wrap animate-in fade-in slide-in-from-top-2 duration-200">
              {['all', 'beginner', 'intermediate', 'advanced'].map((level) => {
                const isActive = difficultyFilter === level
                const config = level !== 'all' ? difficultyConfig[level as keyof typeof difficultyConfig] : null
                return (
                  <button
                    key={level}
                    onClick={() => handleDifficultyChange(level)}
                    className={`px-3 py-1.5 rounded-[10px] text-[11px] font-bold uppercase tracking-wider border transition-all ${
                      isActive
                        ? config
                          ? `text-white border-transparent`
                          : `text-[#3B82F6] border-[#3B82F6] ${isDark ? 'bg-[#3B82F6]/10' : 'bg-[#3B82F6]/5'}`
                        : isDark
                          ? 'text-[#9CA3AF] border-[#2D2D2F] hover:border-[#6B7280]'
                          : 'text-[#6B7280] border-[#E2E4E9] hover:border-[#9CA3AF]'
                    }`}
                    style={isActive && config ? { backgroundColor: config.bg } : undefined}
                  >
                    {level === 'all'
                      ? t('wordLibrary.allLevels')
                      : language === 'ar'
                        ? difficultyConfig[level as keyof typeof difficultyConfig].labelAr
                        : difficultyConfig[level as keyof typeof difficultyConfig].label}
                  </button>
                )
              })}
            </div>
          )}

          {/* Word List */}
          <div className="space-y-2">
            {filteredWords.map((word, i) => (
              <WordCard
                key={`${selectedCategory.id}-${word.word}-${i}`}
                word={word}
                isDark={isDark}
                language={language}
                onSelect={() => handleWordSelect(word.word)}
                t={t}
              />
            ))}
          </div>

          {filteredWords.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <BookOpen size={32} className={`mb-3 ${isDark ? 'text-[#2D2D2F]' : 'text-[#E2E4E9]'}`} />
              <p className={`text-[14px] font-bold mb-1 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                {t('wordLibrary.noWordsFound')}
              </p>
              <p className={`text-[12px] ${isDark ? 'text-[#4B5563]' : 'text-[#9CA3AF]'}`}>
                {t('wordLibrary.tryAnotherFilter')}
              </p>
            </div>
          )}
        </main>

        {/* Scroll to Top Button */}
        {showScrollTop && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            aria-label="Scroll to top"
            className={`fixed bottom-24 right-5 z-30 w-10 h-10 rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95 animate-in fade-in slide-in-from-bottom-4 duration-300 ${
              isDark ? 'bg-[#3B82F6] text-white' : 'bg-[#3B82F6] text-white'
            }`}
          >
            <ChevronUp size={20} />
          </button>
        )}
      </div>
    )
  }

  // ─── Main Library View ───
  return (
    <div dir={language === 'ar' ? 'rtl' : 'ltr'} className={`min-h-screen antialiased pb-32 font-sans ${isDark ? 'bg-[#121212] text-[#FFFFFF]' : 'bg-[#F8F9FA] text-[#111827]'}`}>
      {/* Header */}
      <header dir="ltr" className={`sticky top-0 z-20 border-b px-4 h-[64px] flex items-center justify-between ${isDark ? 'bg-[#121212] border-[#262626]' : 'bg-white border-[#E2E4E9]'}`}>
        <div className="flex items-center gap-2">
          <button onClick={() => router.back()} className={`p-1 transition-colors ${isDark ? 'text-[#9CA3AF] hover:text-[#FFFFFF]' : 'text-[#6B7280] hover:text-[#111827]'}`}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-[17px] font-bold tracking-[-0.5px]">{t('wordLibrary.title')}</h1>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 mt-2">
        {/* Hero Banner */}
        <div className={`${cardBase} p-5 mb-6 relative overflow-hidden`}>
          <div className="absolute top-[-20px] right-[-20px] w-[100px] h-[100px] blur-[50px] rounded-full bg-[#3B82F6]/10" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen size={18} className="text-[#3B82F6]" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#3B82F6]">
                {t('wordLibrary.badge')}
              </span>
            </div>
            <h2 className="text-[18px] font-bold mb-1">{t('wordLibrary.heroTitle')}</h2>
            <p className={`text-[13px] leading-relaxed ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
              {t('wordLibrary.heroDesc')}
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <Search size={16} className={`absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`} />
          <input
            dir="ltr"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('wordLibrary.searchPlaceholder')}
            className={`${inputBase} pl-10 h-11`}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={`absolute right-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-[#6B7280] hover:text-white' : 'text-[#9CA3AF] hover:text-[#111827]'}`}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchQuery.trim().length >= 2 && (
          <div className="mb-6">
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              {t('wordLibrary.searchResults')} ({searchResults.length})
            </p>
            {searchResults.length > 0 ? (
              <div className="space-y-2">
                {searchResults.slice(0, 20).map((result, i) => (
                  <WordCard
                    key={`search-${result.word}-${i}`}
                    word={result}
                    isDark={isDark}
                    language={language}
                    categoryName={language === 'ar'
                      ? wordLibrary.find(c => c.id === result.categoryId)?.nameAr
                      : result.categoryName}
                    onSelect={() => handleWordSelect(result.word)}
                    t={t}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-10 text-center">
                <Search size={24} className={`mb-2 ${isDark ? 'text-[#2D2D2F]' : 'text-[#E2E4E9]'}`} />
                <p className={`text-[13px] ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                  {t('wordLibrary.noResults')}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Mega Categories Carousel */}
        {searchQuery.trim().length < 2 && (
          <>
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              {t('wordLibrary.megaCategories')}
            </p>

            {/* Carousel Container */}
            <div className="relative mb-6">
              <div
                ref={carousel.containerRef}
                className="relative overflow-hidden rounded-[20px] select-none"
                style={{ touchAction: 'pan-y', minHeight: 280 }}
                tabIndex={0}
                role="region"
                aria-roledescription="carousel"
                aria-label="Mega category collections"
                onKeyDown={handleCarouselKeyDown}
                {...carousel.handlers(language === 'ar')}
              >
                {megaCategories.map((mega, slideIndex) => {
                  const subCategories = mega.categoryIds
                    .map((id) => wordLibrary.find((c) => c.id === id))
                    .filter(Boolean) as WordCategory[]
                  const totalWords = subCategories.reduce((sum, c) => sum + c.words.length, 0)

                  return (
                    <div key={mega.id} style={carousel.getSlideStyle(slideIndex)}>
                      <div
                        className="rounded-[20px] p-5 min-h-[280px] h-full flex flex-col"
                        style={{ background: mega.gradient }}
                      >
                          {/* Mega Category Header */}
                          <div className="flex items-center gap-3 mb-1">
                            <div className="w-11 h-11 rounded-[14px] bg-white/20 backdrop-blur-sm flex items-center justify-center text-white">
                              {iconMapLg[mega.icon] || <BookOpen size={28} />}
                            </div>
                            <div className="flex-1">
                              <h3 className="text-[18px] font-bold text-white leading-tight">
                                {language === 'ar' ? mega.nameAr : mega.name}
                              </h3>
                              <p className="text-[11px] text-white/70 font-medium">
                                {subCategories.length} {t('wordLibrary.categories').toLowerCase()} · {totalWords} {t('wordLibrary.words')}
                              </p>
                            </div>
                          </div>
                          <p className="text-[12px] text-white/60 mb-4 leading-relaxed">
                            {language === 'ar' ? mega.descriptionAr : mega.description}
                          </p>

                          {/* Sub-categories Grid */}
                          <div className="grid grid-cols-2 gap-2 mt-auto">
                            {subCategories.map((cat) => (
                              <button
                                key={cat.id}
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCategorySelect(cat)
                                }}
                                className="bg-white/15 backdrop-blur-sm hover:bg-white/25 active:scale-[0.97] transition-all rounded-[12px] p-3 text-left"
                              >
                                <div className="flex items-center gap-2 mb-1">
                                  <div className="text-white/90" style={{ lineHeight: 0 }}>
                                    {iconMap[cat.icon] || <BookOpen size={16} />}
                                  </div>
                                  <span className="text-[12px] font-bold text-white truncate">
                                    {language === 'ar' ? cat.nameAr : cat.name}
                                  </span>
                                </div>
                                <p className="text-[10px] text-white/60 font-medium">
                                  {cat.words.length} {t('wordLibrary.words')}
                                </p>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Carousel Navigation Arrows */}
              <button
                onClick={() => { carousel.goPrev(); carousel.pauseAutoPlay() }}
                className={`absolute left-[-12px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${isDark ? 'bg-[#1C1C1E] text-white border border-[#2D2D2F]' : 'bg-white text-[#111827] border border-[#E2E4E9]'}`}
                aria-label="Previous mega category"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => { carousel.goNext(); carousel.pauseAutoPlay() }}
                className={`absolute right-[-12px] top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 ${isDark ? 'bg-[#1C1C1E] text-white border border-[#2D2D2F]' : 'bg-white text-[#111827] border border-[#E2E4E9]'}`}
                aria-label="Next mega category"
              >
                <ChevronRight size={16} />
              </button>

              {/* Carousel Dots */}
              <div className="flex justify-center gap-1.5 mt-3" role="tablist" aria-label="Carousel navigation">
                {megaCategories.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { carousel.goTo(i); carousel.pauseAutoPlay() }}
                    role="tab"
                    aria-selected={carousel.currentIndex === i}
                    aria-label={`Go to ${megaCategories[i].name}`}
                    className={`rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6] focus-visible:ring-offset-1 ${isDark ? 'focus-visible:ring-offset-[#121212]' : 'focus-visible:ring-offset-white'} ${
                      carousel.currentIndex === i
                        ? 'w-6 h-2 bg-[#3B82F6]'
                        : `w-2 h-2 ${isDark ? 'bg-[#2D2D2F] hover:bg-[#4B5563]' : 'bg-[#D1D5DB] hover:bg-[#9CA3AF]'}`
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* All Categories Grid */}
            <p className={`text-[11px] font-bold uppercase tracking-wider mb-3 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
              {t('wordLibrary.allCategories')}
            </p>
            <div className="grid grid-cols-2 gap-2 mb-8">
              {wordLibrary.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category)}
                  className={`${cardBase} p-3.5 text-left hover:border-[#3B82F6]/30 active:scale-[0.97] transition-all`}
                >
                  <div
                    className="w-9 h-9 rounded-[10px] flex items-center justify-center mb-2"
                    style={{ backgroundColor: `${category.color}15`, color: category.color }}
                  >
                    {iconMap[category.icon] || <BookOpen size={18} />}
                  </div>
                  <p className={`text-[13px] font-bold leading-tight mb-0.5 ${isDark ? 'text-[#FFFFFF]' : 'text-[#111827]'}`}>
                    {language === 'ar' ? category.nameAr : category.name}
                  </p>
                  <p className={`text-[11px] leading-snug line-clamp-1 mb-1 ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                    {language === 'ar' ? category.descriptionAr : category.description}
                  </p>
                  <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-[#4B5563]' : 'text-[#9CA3AF]'}`}>
                    {category.words.length} {t('wordLibrary.words')}
                  </p>
                </button>
              ))}
            </div>

            {/* Quick Access: Featured Words */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <p className={`text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-[#6B7280]' : 'text-[#9CA3AF]'}`}>
                  {t('wordLibrary.featured')}
                </p>
                <Sparkles size={14} className="text-[#F59E0B]" />
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                {['ubiquitous', 'negotiate', 'wanderlust', 'empathy', 'algorithm', 'paradigm', 'resilience', 'serenity'].map((word) => (
                  <button
                    key={word}
                    onClick={() => handleWordSelect(word)}
                    className={`flex-shrink-0 px-4 py-2.5 rounded-[12px] border text-[13px] font-semibold transition-all active:scale-95 ${
                      isDark
                        ? 'bg-[#1C1C1E] border-[#2D2D2F] text-[#FFFFFF] hover:border-[#3B82F6]/40'
                        : 'bg-white border-[#E2E4E9] text-[#111827] hover:border-[#3B82F6]/40'
                    }`}
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

// ─── Word Card Component ───
function WordCard({
  word,
  isDark,
  language,
  categoryName,
  onSelect,
  t,
}: {
  word: WordEntry
  isDark: boolean
  language: string
  categoryName?: string
  onSelect: () => void
  t: (key: string) => string
}) {
  const config = difficultyConfig[word.difficulty]

  return (
    <button
      onClick={onSelect}
      className={`w-full text-left rounded-[14px] p-3.5 border transition-all active:scale-[0.99] hover:border-[#3B82F6]/30 ${
        isDark ? 'bg-[#1C1C1E] border-[#2D2D2F]' : 'bg-white border-[#E2E4E9]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[15px] font-bold">{word.word}</span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-[6px]"
              style={{ color: config.color, backgroundColor: `${config.bg}15` }}
            >
              {language === 'ar' ? config.labelAr : config.label}
            </span>
          </div>
          <p className={`text-[12px] leading-relaxed line-clamp-2 ${isDark ? 'text-[#9CA3AF]' : 'text-[#6B7280]'}`}>
            {word.definition}
          </p>
          {categoryName && (
            <p className={`text-[10px] mt-1 font-semibold ${isDark ? 'text-[#4B5563]' : 'text-[#9CA3AF]'}`}>
              {categoryName}
            </p>
          )}
        </div>
        <div className={`flex items-center gap-1 flex-shrink-0 mt-1 ${isDark ? 'text-[#3B82F6]' : 'text-[#2563EB]'}`}>
          <span className="text-[10px] font-bold uppercase tracking-wider">{t('wordLibrary.use')}</span>
          <ArrowRight size={12} />
        </div>
      </div>
    </button>
  )
}
