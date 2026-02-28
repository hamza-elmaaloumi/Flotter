import { describe, it, expect } from 'vitest'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

/**
 * Integration tests for the Word Library feature.
 * Verify that all source files are properly wired together:
 * - Library data module exists and exports correctly
 * - API route exists and imports the library
 * - UI page exists and uses proper routing
 * - Navigation components link to the library
 * - Card creation page handles URL parameters
 * - Translations are complete
 */

const ROOT = resolve(__dirname, '../..')

function readSource(relativePath: string): string {
  return readFileSync(resolve(ROOT, relativePath), 'utf-8')
}

function fileExists(relativePath: string): boolean {
  return existsSync(resolve(ROOT, relativePath))
}

// ===== File Existence =====
describe('Word Library Integration: File Structure', () => {
  it('word library data module should exist', () => {
    expect(fileExists('lib/word-library.ts')).toBe(true)
  })

  it('API route should exist', () => {
    expect(fileExists('app/api/word-library/route.ts')).toBe(true)
  })

  it('library page should exist', () => {
    expect(fileExists('app/cards/library/page.tsx')).toBe(true)
  })

  it('header component should exist', () => {
    expect(fileExists('app/components/header.tsx')).toBe(true)
  })

  it('footer component should exist', () => {
    expect(fileExists('app/components/footer.tsx')).toBe(true)
  })

  it('translations file should exist', () => {
    expect(fileExists('lib/translations.ts')).toBe(true)
  })
})

// ===== Word Library Data Module =====
describe('Word Library Integration: Data Module Exports', () => {
  it('should export wordLibrary array', () => {
    const src = readSource('lib/word-library.ts')
    expect(src).toContain('export const wordLibrary')
  })

  it('should export getCategories function', () => {
    const src = readSource('lib/word-library.ts')
    expect(src).toContain('export function getCategories')
  })

  it('should export getCategoryById function', () => {
    const src = readSource('lib/word-library.ts')
    expect(src).toContain('export function getCategoryById')
  })

  it('should export searchWords function', () => {
    const src = readSource('lib/word-library.ts')
    expect(src).toContain('export function searchWords')
  })

  it('should export getAllWords function', () => {
    const src = readSource('lib/word-library.ts')
    expect(src).toContain('export function getAllWords')
  })

  it('should export getWordsByDifficulty function', () => {
    const src = readSource('lib/word-library.ts')
    expect(src).toContain('export function getWordsByDifficulty')
  })

  it('should export WordEntry type', () => {
    const src = readSource('lib/word-library.ts')
    expect(src).toContain('export interface WordEntry')
  })

  it('should export WordCategory type', () => {
    const src = readSource('lib/word-library.ts')
    expect(src).toContain('export interface WordCategory')
  })

  it('should have at least 6 categories defined', () => {
    const src = readSource('lib/word-library.ts')
    const categoryMatches = src.match(/id:\s*'/g)
    expect(categoryMatches).toBeTruthy()
    expect(categoryMatches!.length).toBeGreaterThanOrEqual(6)
  })
})

// ===== API Route =====
describe('Word Library Integration: API Route', () => {
  it('should import from word-library module', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain("from '@/lib/word-library'")
  })

  it('should export GET handler', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain('export async function GET')
  })

  it('should handle categories action', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain("case 'categories'")
    expect(src).toContain('getCategories()')
  })

  it('should handle category action with ID', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain("case 'category'")
    expect(src).toContain('getCategoryById')
  })

  it('should handle search action', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain("case 'search'")
    expect(src).toContain('searchWords')
  })

  it('should handle difficulty action', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain("case 'difficulty'")
    expect(src).toContain('getWordsByDifficulty')
  })

  it('should validate required parameters for category action', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain("Category ID is required")
    expect(src).toContain("status: 400")
  })

  it('should validate required parameters for search action', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain("Search query is required")
    expect(src).toContain("at least 2 characters")
  })

  it('should handle 404 for unknown category', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain("Category not found")
    expect(src).toContain("status: 404")
  })

  it('should have error handling with try-catch', () => {
    const src = readSource('app/api/word-library/route.ts')
    expect(src).toContain('try {')
    expect(src).toContain('catch (error)')
    expect(src).toContain("status: 500")
  })
})

// ===== Library Page =====
describe('Word Library Integration: UI Page', () => {
  it('should be a client component', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain('"use client"')
  })

  it('should import word library data', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain("from '@/lib/word-library'")
  })

  it('should use the language provider', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain('useLanguage')
  })

  it('should use the theme provider', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain('useTheme')
  })

  it('should navigate to /cards/new with word parameter', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain('/cards/new?word=')
    expect(src).toContain('encodeURIComponent')
  })

  it('should have search functionality', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain('searchWords')
    expect(src).toContain('searchQuery')
  })

  it('should have category selection', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain('selectedCategory')
    expect(src).toContain('setSelectedCategory')
  })

  it('should have difficulty filter', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain('difficultyFilter')
    expect(src).toContain('beginner')
    expect(src).toContain('intermediate')
    expect(src).toContain('advanced')
  })

  it('should support RTL for Arabic', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain("language === 'ar' ? 'rtl' : 'ltr'")
  })

  it('should display category Arabic names', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain('nameAr')
    expect(src).toContain('descriptionAr')
  })

  it('should display featured words for quick access', () => {
    const src = readSource('app/cards/library/page.tsx')
    expect(src).toContain('wordLibrary.featured')
    expect(src).toContain('ubiquitous')
  })
})

// ===== Header Navigation =====
describe('Word Library Integration: Header Navigation', () => {
  it('should import BookOpen icon', () => {
    const src = readSource('app/components/header.tsx')
    expect(src).toContain('BookOpen')
  })

  it('should link to /cards/library', () => {
    const src = readSource('app/components/header.tsx')
    expect(src).toContain('href="/cards/library"')
  })

  it('should have Word Library title attribute', () => {
    const src = readSource('app/components/header.tsx')
    expect(src).toContain('Word Library')
  })
})

// ===== Footer Navigation =====
describe('Word Library Integration: Footer Navigation', () => {
  it('should import BookOpen icon', () => {
    const src = readSource('app/components/footer.tsx')
    expect(src).toContain('BookOpen')
  })

  it('should link to /cards/library', () => {
    const src = readSource('app/components/footer.tsx')
    expect(src).toContain('href="/cards/library"')
  })

  it('should use footer.library translation key', () => {
    const src = readSource('app/components/footer.tsx')
    expect(src).toContain("t('footer.library')")
  })

  it('should highlight active state for library route', () => {
    const src = readSource('app/components/footer.tsx')
    expect(src).toContain("pathname === '/cards/library'")
  })
})

// ===== Card Creation: URL Parameter Handling =====
describe('Word Library Integration: Card Creation Auto-populate', () => {
  it('should import useSearchParams', () => {
    const src = readSource('app/cards/new/page.tsx')
    expect(src).toContain('useSearchParams')
  })

  it('should read word parameter from URL', () => {
    const src = readSource('app/cards/new/page.tsx')
    expect(src).toContain("searchParams.get('word')")
  })

  it('should auto-populate word from URL parameter', () => {
    const src = readSource('app/cards/new/page.tsx')
    expect(src).toContain('setWord(decodedWord)')
  })

  it('should auto-trigger AI generation for library words', () => {
    const src = readSource('app/cards/new/page.tsx')
    expect(src).toContain('wordFromLibrary')
    expect(src).toContain('handleWordBlur()')
  })

  it('should decode URL-encoded word parameter', () => {
    const src = readSource('app/cards/new/page.tsx')
    expect(src).toContain('decodeURIComponent')
  })
})

// ===== Translation Keys =====
describe('Word Library Integration: Translation Coverage', () => {
  const translationSrc = readSource('lib/translations.ts')

  it('should have English footer.library key', () => {
    expect(translationSrc).toContain("'footer.library': 'Library'")
  })

  it('should have Arabic footer.library key', () => {
    expect(translationSrc).toContain("'footer.library': 'المكتبة'")
  })

  it('should have English wordLibrary.title key', () => {
    expect(translationSrc).toContain("'wordLibrary.title': 'Word Library'")
  })

  it('should have Arabic wordLibrary.title key', () => {
    expect(translationSrc).toContain("'wordLibrary.title': 'مكتبة الكلمات'")
  })

  it('should have English wordLibrary.heroTitle key', () => {
    expect(translationSrc).toContain("'wordLibrary.heroTitle': 'Discover New Words'")
  })

  it('should have Arabic wordLibrary.heroTitle key', () => {
    expect(translationSrc).toContain("'wordLibrary.heroTitle': 'اكتشف كلمات جديدة'")
  })

  it('should have word library search placeholder in both languages', () => {
    expect(translationSrc).toContain("'wordLibrary.searchPlaceholder'")
    // Check it appears at least twice (en + ar)
    const matches = translationSrc.match(/'wordLibrary\.searchPlaceholder'/g)
    expect(matches).toBeTruthy()
    expect(matches!.length).toBe(2)
  })

  it('should have all wordLibrary keys in both en and ar', () => {
    const enKeysMatches = translationSrc.match(/'wordLibrary\.\w+'/g) || []
    // Each key should appear twice (en + ar)
    const keySet = new Set(enKeysMatches)
    for (const key of keySet) {
      const count = enKeysMatches.filter((m) => m === key).length
      expect(count).toBe(2)
    }
  })
})
