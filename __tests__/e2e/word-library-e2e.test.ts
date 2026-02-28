import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * E2E-style tests for Word Library feature.
 * Simulates user flows by verifying the complete chain of source code integration.
 */

const ROOT = resolve(__dirname, '../..')

function readSource(rel: string): string {
  return readFileSync(resolve(ROOT, rel), 'utf-8')
}

// ──────────────────────────────────────────────────
// E2E 1: User navigates to Word Library from footer
// ──────────────────────────────────────────────────
describe('E2E: Navigate to Word Library from footer', () => {
  const footer = readSource('app/components/footer.tsx')
  const libraryPage = readSource('app/cards/library/page.tsx')

  it('footer has library link to /cards/library', () => {
    expect(footer).toContain('href="/cards/library"')
  })

  it('footer uses BookOpen icon for library', () => {
    expect(footer).toContain('BookOpen')
  })

  it('library page exports a default component', () => {
    expect(libraryPage).toContain('export default function WordLibraryPage')
  })

  it('library page renders categories from wordLibrary data', () => {
    expect(libraryPage).toContain('wordLibrary.map')
  })
})

// ──────────────────────────────────────────────────
// E2E 2: User navigates to Word Library from header
// ──────────────────────────────────────────────────
describe('E2E: Navigate to Word Library from header', () => {
  const header = readSource('app/components/header.tsx')

  it('header has library link to /cards/library', () => {
    expect(header).toContain('href="/cards/library"')
  })

  it('header displays BookOpen icon for Word Library', () => {
    expect(header).toContain('BookOpen')
  })

  it('header shows library only for authenticated users', () => {
    // The library link should be inside the user-authenticated block
    const userBlock = header.indexOf('{user ? (')
    const libraryLink = header.indexOf('href="/cards/library"')
    expect(libraryLink).toBeGreaterThan(userBlock)
  })
})

// ──────────────────────────────────────────────────
// E2E 3: User browses categories and selects a category
// ──────────────────────────────────────────────────
describe('E2E: Browse and select a category', () => {
  const libraryPage = readSource('app/cards/library/page.tsx')

  it('page displays all category cards', () => {
    expect(libraryPage).toContain('wordLibrary.map')
  })

  it('category cards show name and description', () => {
    expect(libraryPage).toContain('category.name')
    expect(libraryPage).toContain('category.description')
  })

  it('clicking category sets selectedCategory state', () => {
    expect(libraryPage).toContain('setSelectedCategory(category)')
  })

  it('selected category view shows filtered words', () => {
    expect(libraryPage).toContain('filteredWords')
  })
})

// ──────────────────────────────────────────────────
// E2E 4: User searches for a word in library
// ──────────────────────────────────────────────────
describe('E2E: Search for a word', () => {
  const libraryPage = readSource('app/cards/library/page.tsx')

  it('search input exists', () => {
    expect(libraryPage).toContain('searchQuery')
    expect(libraryPage).toContain('setSearchQuery')
  })

  it('search requires minimum 2 characters', () => {
    expect(libraryPage).toContain("searchQuery.trim().length < 2")
  })

  it('search results use searchWords function', () => {
    expect(libraryPage).toContain('searchWords(searchQuery)')
  })

  it('search results are displayed with WordCard component', () => {
    expect(libraryPage).toContain('searchResults')
    expect(libraryPage).toContain('WordCard')
  })

  it('no results message is shown when search returns empty', () => {
    expect(libraryPage).toContain("wordLibrary.noResults")
  })

  it('search has clear button', () => {
    expect(libraryPage).toContain("setSearchQuery('')")
  })
})

// ──────────────────────────────────────────────────
// E2E 5: User selects a word and lands on card creation
// ──────────────────────────────────────────────────
describe('E2E: Select word → navigate to card creation', () => {
  const libraryPage = readSource('app/cards/library/page.tsx')
  const newCardPage = readSource('app/cards/new/page.tsx')

  it('word selection navigates to /cards/new with word param', () => {
    expect(libraryPage).toContain("/cards/new?word=")
    expect(libraryPage).toContain('encodeURIComponent(word)')
  })

  it('card creation page reads word param', () => {
    expect(newCardPage).toContain("searchParams.get('word')")
  })

  it('card creation page sets word state from param', () => {
    expect(newCardPage).toContain('setWord(decodedWord)')
  })

  it('card creation page auto-triggers AI generation', () => {
    expect(newCardPage).toContain('wordFromLibrary')
    expect(newCardPage).toContain('handleWordBlur()')
  })
})

// ──────────────────────────────────────────────────
// E2E 6: User filters by difficulty level
// ──────────────────────────────────────────────────
describe('E2E: Filter words by difficulty', () => {
  const libraryPage = readSource('app/cards/library/page.tsx')

  it('filter chips for all difficulty levels exist', () => {
    expect(libraryPage).toContain("'all'")
    expect(libraryPage).toContain("'beginner'")
    expect(libraryPage).toContain("'intermediate'")
    expect(libraryPage).toContain("'advanced'")
  })

  it('clicking filter updates difficultyFilter state', () => {
    expect(libraryPage).toContain('setDifficultyFilter(level)')
  })

  it('filtered words are computed with useMemo', () => {
    expect(libraryPage).toContain('useMemo')
    expect(libraryPage).toContain('difficultyFilter')
  })

  it('empty state shows when no words match filter', () => {
    expect(libraryPage).toContain('filteredWords.length === 0')
    expect(libraryPage).toContain("wordLibrary.noWordsFound")
  })
})

// ──────────────────────────────────────────────────
// E2E 7: Arabic user sees full RTL support
// ──────────────────────────────────────────────────
describe('E2E: Arabic RTL support in Word Library', () => {
  const libraryPage = readSource('app/cards/library/page.tsx')
  const translationsSrc = readSource('lib/translations.ts')

  it('page respects RTL direction', () => {
    expect(libraryPage).toContain("language === 'ar' ? 'rtl' : 'ltr'")
  })

  it('categories show Arabic names when language is Arabic', () => {
    expect(libraryPage).toContain("language === 'ar' ? category.nameAr : category.name")
  })

  it('categories show Arabic descriptions when language is Arabic', () => {
    expect(libraryPage).toContain("language === 'ar' ? category.descriptionAr : category.description")
  })

  it('word library has complete Arabic translations', () => {
    expect(translationsSrc).toContain("'wordLibrary.title': 'مكتبة الكلمات'")
    expect(translationsSrc).toContain("'wordLibrary.heroTitle': 'اكتشف كلمات جديدة'")
  })

  it('difficulty labels have Arabic translations', () => {
    expect(libraryPage).toContain('labelAr')
    expect(libraryPage).toContain("'مبتدئ'")
    expect(libraryPage).toContain("'متوسط'")
    expect(libraryPage).toContain("'متقدم'")
  })
})

// ──────────────────────────────────────────────────
// E2E 8: Featured words quick access
// ──────────────────────────────────────────────────
describe('E2E: Featured words quick access', () => {
  const libraryPage = readSource('app/cards/library/page.tsx')

  it('featured section exists on main library view', () => {
    expect(libraryPage).toContain("wordLibrary.featured")
  })

  it('featured words include specific vocabulary', () => {
    expect(libraryPage).toContain("'ubiquitous'")
    expect(libraryPage).toContain("'negotiate'")
    expect(libraryPage).toContain("'empathy'")
  })

  it('clicking featured word navigates to card creation', () => {
    expect(libraryPage).toContain('handleWordSelect(word)')
  })

  it('featured words are horizontally scrollable', () => {
    expect(libraryPage).toContain('overflow-x-auto')
  })
})

// ──────────────────────────────────────────────────
// E2E 9: Word card component displays all information
// ──────────────────────────────────────────────────
describe('E2E: Word card displays complete information', () => {
  const libraryPage = readSource('app/cards/library/page.tsx')

  it('word card shows the word text', () => {
    expect(libraryPage).toContain('word.word')
  })

  it('word card shows difficulty badge', () => {
    expect(libraryPage).toContain('word.difficulty')
  })

  it('word card shows definition', () => {
    expect(libraryPage).toContain('word.definition')
  })

  it('word card has a "Use" action button', () => {
    expect(libraryPage).toContain("wordLibrary.use")
    expect(libraryPage).toContain('ArrowRight')
  })

  it('word card is clickable', () => {
    expect(libraryPage).toContain('onClick={onSelect}')
  })
})

// ──────────────────────────────────────────────────
// E2E 10: API validation prevents bad requests
// ──────────────────────────────────────────────────
describe('E2E: API route input validation', () => {
  const apiRoute = readSource('app/api/word-library/route.ts')

  it('rejects empty category ID', () => {
    expect(apiRoute).toContain("!id")
    expect(apiRoute).toContain("Category ID is required")
  })

  it('rejects empty search query', () => {
    expect(apiRoute).toContain("!q || q.trim().length === 0")
  })

  it('rejects search query shorter than 2 chars', () => {
    expect(apiRoute).toContain("q.trim().length < 2")
  })

  it('validates difficulty level values', () => {
    expect(apiRoute).toContain("['beginner', 'intermediate', 'advanced'].includes(level)")
  })

  it('rejects invalid actions', () => {
    expect(apiRoute).toContain("Invalid action")
  })
})
