import { describe, it, expect } from 'vitest'
import {
  wordLibrary,
  getCategories,
  getCategoryById,
  getAllWords,
  searchWords,
  getWordsByDifficulty,
} from '../../lib/word-library'
import { translations } from '../../lib/translations'
import type { WordCategory, WordEntry } from '../../lib/word-library'

/**
 * Unit tests for the Word Library feature.
 * Tests the pure data functions from lib/word-library.ts
 */

// ===== Word Library Data Structure =====
describe('Word Library: Data Structure Validation', () => {
  it('should have at least 5 categories', () => {
    expect(wordLibrary.length).toBeGreaterThanOrEqual(5)
  })

  it('every category should have a unique id', () => {
    const ids = wordLibrary.map((c) => c.id)
    const uniqueIds = new Set(ids)
    expect(uniqueIds.size).toBe(ids.length)
  })

  it('every category should have required fields', () => {
    for (const category of wordLibrary) {
      expect(category.id).toBeTruthy()
      expect(category.name).toBeTruthy()
      expect(category.nameAr).toBeTruthy()
      expect(category.description).toBeTruthy()
      expect(category.descriptionAr).toBeTruthy()
      expect(category.icon).toBeTruthy()
      expect(category.color).toMatch(/^#[0-9A-Fa-f]{6}$/)
      expect(Array.isArray(category.words)).toBe(true)
      expect(category.words.length).toBeGreaterThan(0)
    }
  })

  it('every word should have required fields', () => {
    for (const category of wordLibrary) {
      for (const word of category.words) {
        expect(word.word).toBeTruthy()
        expect(typeof word.word).toBe('string')
        expect(word.definition).toBeTruthy()
        expect(typeof word.definition).toBe('string')
        expect(['beginner', 'intermediate', 'advanced']).toContain(word.difficulty)
      }
    }
  })

  it('every word should be non-empty and trimmed', () => {
    for (const category of wordLibrary) {
      for (const word of category.words) {
        expect(word.word.trim()).toBe(word.word)
        expect(word.word.length).toBeGreaterThan(0)
      }
    }
  })

  it('every category should have at least 20 words', () => {
    for (const category of wordLibrary) {
      expect(category.words.length).toBeGreaterThanOrEqual(20)
    }
  })

  it('should contain the expected category IDs', () => {
    const ids = wordLibrary.map((c) => c.id)
    expect(ids).toContain('daily-vocabulary')
    expect(ids).toContain('business-english')
    expect(ids).toContain('travel-words')
  })
})

// ===== getCategories =====
describe('Word Library: getCategories()', () => {
  it('should return all categories without words', () => {
    const categories = getCategories()
    expect(categories.length).toBe(wordLibrary.length)
    for (const cat of categories) {
      expect(cat).not.toHaveProperty('words')
    }
  })

  it('should include category metadata', () => {
    const categories = getCategories()
    for (const cat of categories) {
      expect(cat.id).toBeTruthy()
      expect(cat.name).toBeTruthy()
      expect(cat.nameAr).toBeTruthy()
      expect(cat.description).toBeTruthy()
    }
  })
})

// ===== getCategoryById =====
describe('Word Library: getCategoryById()', () => {
  it('should return a valid category for known ID', () => {
    const cat = getCategoryById('daily-vocabulary')
    expect(cat).toBeDefined()
    expect(cat!.name).toBe('Daily Vocabulary')
    expect(cat!.words.length).toBeGreaterThan(0)
  })

  it('should return undefined for unknown ID', () => {
    const cat = getCategoryById('nonexistent-category')
    expect(cat).toBeUndefined()
  })

  it('should return undefined for empty string', () => {
    const cat = getCategoryById('')
    expect(cat).toBeUndefined()
  })

  it('should return full word data for the category', () => {
    const cat = getCategoryById('business-english')
    expect(cat).toBeDefined()
    expect(cat!.words[0]).toHaveProperty('word')
    expect(cat!.words[0]).toHaveProperty('definition')
    expect(cat!.words[0]).toHaveProperty('difficulty')
  })
})

// ===== getAllWords =====
describe('Word Library: getAllWords()', () => {
  it('should return all words from all categories', () => {
    const allWords = getAllWords()
    const expectedTotal = wordLibrary.reduce((sum, c) => sum + c.words.length, 0)
    expect(allWords.length).toBe(expectedTotal)
  })

  it('every word should include categoryId', () => {
    const allWords = getAllWords()
    for (const w of allWords) {
      expect(w.categoryId).toBeTruthy()
      expect(wordLibrary.some((c) => c.id === w.categoryId)).toBe(true)
    }
  })

  it('should return at least 150 total words', () => {
    const allWords = getAllWords()
    expect(allWords.length).toBeGreaterThanOrEqual(150)
  })
})

// ===== searchWords =====
describe('Word Library: searchWords()', () => {
  it('should find words by exact word match', () => {
    const results = searchWords('algorithm')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((r) => r.word === 'algorithm')).toBe(true)
  })

  it('should find words by partial word match', () => {
    const results = searchWords('algo')
    expect(results.length).toBeGreaterThan(0)
    expect(results.some((r) => r.word.includes('algo'))).toBe(true)
  })

  it('should find words by definition content', () => {
    const results = searchWords('business')
    expect(results.length).toBeGreaterThan(0)
  })

  it('should be case-insensitive', () => {
    const lower = searchWords('algorithm')
    const upper = searchWords('ALGORITHM')
    const mixed = searchWords('Algorithm')
    expect(lower.length).toBe(upper.length)
    expect(lower.length).toBe(mixed.length)
  })

  it('should return empty array for empty query', () => {
    expect(searchWords('')).toEqual([])
    expect(searchWords('   ')).toEqual([])
  })

  it('should return empty array for no matches', () => {
    const results = searchWords('xyznonexistent12345')
    expect(results).toEqual([])
  })

  it('should include categoryId and categoryName in results', () => {
    const results = searchWords('negotiate')
    expect(results.length).toBeGreaterThan(0)
    expect(results[0]).toHaveProperty('categoryId')
    expect(results[0]).toHaveProperty('categoryName')
  })
})

// ===== getWordsByDifficulty =====
describe('Word Library: getWordsByDifficulty()', () => {
  it('should filter beginner words', () => {
    const words = getWordsByDifficulty('beginner')
    expect(words.length).toBeGreaterThan(0)
    for (const w of words) {
      expect(w.difficulty).toBe('beginner')
    }
  })

  it('should filter intermediate words', () => {
    const words = getWordsByDifficulty('intermediate')
    expect(words.length).toBeGreaterThan(0)
    for (const w of words) {
      expect(w.difficulty).toBe('intermediate')
    }
  })

  it('should filter advanced words', () => {
    const words = getWordsByDifficulty('advanced')
    expect(words.length).toBeGreaterThan(0)
    for (const w of words) {
      expect(w.difficulty).toBe('advanced')
    }
  })

  it('beginner + intermediate + advanced should equal total', () => {
    const beginner = getWordsByDifficulty('beginner')
    const intermediate = getWordsByDifficulty('intermediate')
    const advanced = getWordsByDifficulty('advanced')
    const all = getAllWords()
    expect(beginner.length + intermediate.length + advanced.length).toBe(all.length)
  })

  it('each word should include categoryId', () => {
    const words = getWordsByDifficulty('beginner')
    for (const w of words) {
      expect(w.categoryId).toBeTruthy()
    }
  })
})

// ===== Word Uniqueness =====
describe('Word Library: Word Uniqueness', () => {
  it('should not have duplicate words within a single category', () => {
    for (const category of wordLibrary) {
      const words = category.words.map((w) => w.word.toLowerCase())
      const uniqueWords = new Set(words)
      expect(uniqueWords.size).toBe(words.length)
    }
  })
})

// ===== URL Parameter Encoding =====
describe('Word Library: URL Encoding for card creation', () => {
  it('single words should encode properly', () => {
    const word = 'algorithm'
    const encoded = encodeURIComponent(word)
    expect(encoded).toBe('algorithm')
    expect(decodeURIComponent(encoded)).toBe(word)
  })

  it('words with spaces should encode properly', () => {
    const word = 'artificial intelligence'
    const encoded = encodeURIComponent(word)
    expect(encoded).toContain('%20')
    expect(decodeURIComponent(encoded)).toBe(word)
  })

  it('words with special characters should encode properly', () => {
    const word = "don't"
    const encoded = encodeURIComponent(word)
    expect(decodeURIComponent(encoded)).toBe(word)
  })
})

// ===== Translation Keys =====
describe('Word Library: Translation Keys', () => {
  it('should have all necessary English translation keys', () => {
    const en = translations.en
    expect(en['wordLibrary.title']).toBeTruthy()
    expect(en['wordLibrary.badge']).toBeTruthy()
    expect(en['wordLibrary.heroTitle']).toBeTruthy()
    expect(en['wordLibrary.heroDesc']).toBeTruthy()
    expect(en['wordLibrary.searchPlaceholder']).toBeTruthy()
    expect(en['wordLibrary.searchResults']).toBeTruthy()
    expect(en['wordLibrary.noResults']).toBeTruthy()
    expect(en['wordLibrary.categories']).toBeTruthy()
    expect(en['wordLibrary.words']).toBeTruthy()
    expect(en['wordLibrary.featured']).toBeTruthy()
    expect(en['wordLibrary.use']).toBeTruthy()
    expect(en['wordLibrary.allLevels']).toBeTruthy()
    expect(en['footer.library']).toBeTruthy()
  })

  it('should have all necessary Arabic translation keys', () => {
    const ar = translations.ar
    expect(ar['wordLibrary.title']).toBeTruthy()
    expect(ar['wordLibrary.badge']).toBeTruthy()
    expect(ar['wordLibrary.heroTitle']).toBeTruthy()
    expect(ar['wordLibrary.heroDesc']).toBeTruthy()
    expect(ar['wordLibrary.searchPlaceholder']).toBeTruthy()
    expect(ar['wordLibrary.categories']).toBeTruthy()
    expect(ar['wordLibrary.use']).toBeTruthy()
    expect(ar['footer.library']).toBeTruthy()
  })
})
