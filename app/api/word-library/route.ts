import { NextResponse } from 'next/server'
import { getCategories, getCategoryById, searchWords, getWordsByDifficulty } from '@/lib/word-library'
import { megaCategories, wordLibrary } from '@/lib/word-library'

/**
 * GET /api/word-library
 *
 * Query parameters:
 *   - action: 'categories' | 'category' | 'search' | 'difficulty' | 'mega-categories'
 *   - id: category ID (required when action=category)
 *   - q: search query (required when action=search)
 *   - level: 'beginner' | 'intermediate' | 'advanced' (required when action=difficulty)
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const action = searchParams.get('action') || 'categories'

    switch (action) {
      case 'categories': {
        const categories = getCategories()
        return NextResponse.json({ categories })
      }

      case 'mega-categories': {
        const result = megaCategories.map((mega) => {
          const subCategories = mega.categoryIds
            .map((id) => wordLibrary.find((c) => c.id === id))
            .filter(Boolean)
            .map((c) => ({ id: c!.id, name: c!.name, nameAr: c!.nameAr, wordCount: c!.words.length }))
          return {
            id: mega.id,
            name: mega.name,
            nameAr: mega.nameAr,
            description: mega.description,
            descriptionAr: mega.descriptionAr,
            icon: mega.icon,
            subCategories,
          }
        })
        return NextResponse.json({ megaCategories: result })
      }

      case 'category': {
        const id = searchParams.get('id')
        if (!id) {
          return NextResponse.json({ error: 'Category ID is required' }, { status: 400 })
        }
        const category = getCategoryById(id)
        if (!category) {
          return NextResponse.json({ error: 'Category not found' }, { status: 404 })
        }
        return NextResponse.json({ category })
      }

      case 'search': {
        const q = searchParams.get('q')
        if (!q || q.trim().length === 0) {
          return NextResponse.json({ error: 'Search query is required' }, { status: 400 })
        }
        if (q.trim().length < 2) {
          return NextResponse.json({ error: 'Search query must be at least 2 characters' }, { status: 400 })
        }
        const results = searchWords(q)
        return NextResponse.json({ results })
      }

      case 'difficulty': {
        const level = searchParams.get('level') as 'beginner' | 'intermediate' | 'advanced'
        if (!level || !['beginner', 'intermediate', 'advanced'].includes(level)) {
          return NextResponse.json({ error: 'Valid difficulty level is required (beginner, intermediate, advanced)' }, { status: 400 })
        }
        const words = getWordsByDifficulty(level)
        return NextResponse.json({ words })
      }

      default:
        return NextResponse.json({ error: 'Invalid action. Use: categories, mega-categories, category, search, or difficulty' }, { status: 400 })
    }
  } catch (error) {
    console.error('Word library API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
