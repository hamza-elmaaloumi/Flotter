import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { resolve } from 'path'

/**
 * 24 User Simulations — Each tests specific features from the latest fixes:
 *
 * Fixes under test:
 * A) DemoCard display: explicit dimensions (310×512), rounded-[32px], shadow-2xl
 * B) LanguageSwitcher in header for non-logged-in users
 * C) AI content safety filters (re-applied after revert)
 * D) Previous features: redirect, terms, CTA labels, dates, etc.
 */

const ROOT = resolve(__dirname, '../..')

function readSource(rel: string): string {
  return readFileSync(resolve(ROOT, rel), 'utf-8')
}

// ──────────────────────────────────────────────────
// SIMULATION 1: First-time visitor sees a properly shaped demo card
// ──────────────────────────────────────────────────
describe('Sim 1: Visitor sees a full-size demo card (not a pill)', () => {
  const src = readSource('app/components/DemoCard.tsx')

  it('card container has explicit width of 310px', () => {
    expect(src).toContain('width: 310')
  })

  it('card container has explicit height of 512px', () => {
    expect(src).toContain('height: 512')
  })

  it('card faces use rounded-[32px] like the real FlashCard', () => {
    expect(src).toContain('rounded-[32px]')
    expect(src).not.toContain('rounded-[28px]')
  })

  it('card faces have shadow-2xl for depth', () => {
    expect(src).toContain('shadow-2xl')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 2: Visitor checks demo card front face layout
// ──────────────────────────────────────────────────
describe('Sim 2: Visitor taps demo card and sees proper front face', () => {
  const src = readSource('app/components/DemoCard.tsx')

  it('front face has 45% image area', () => {
    expect(src).toContain('h-[45%]')
  })

  it('front face has 55% text area', () => {
    expect(src).toContain('h-[55%]')
  })

  it('front face shows the masked word', () => {
    expect(src).toContain('card.word.charAt(0)')
    expect(src).toContain('_______')
  })

  it('front face has a "tap to reveal" prompt', () => {
    expect(src).toContain("t('landing.demo.tapReveal')")
    expect(src).toContain('Hand')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 3: Visitor flips and sees the back face
// ──────────────────────────────────────────────────
describe('Sim 3: Visitor flips card and sees word + sentence on back', () => {
  const src = readSource('app/components/DemoCard.tsx')

  it('back face reveals the full word', () => {
    expect(src).toContain('{card.word}')
  })

  it('back face highlights the word in the sentence', () => {
    expect(src).toContain('text-emerald-400 font-bold')
  })

  it('back face is rotated 180 degrees for 3D flip', () => {
    expect(src).toContain("transform: 'rotateY(180deg)'")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 4: Visitor swipes demo cards left and right
// ──────────────────────────────────────────────────
describe('Sim 4: Visitor swipes demo cards in both directions', () => {
  const src = readSource('app/components/DemoCard.tsx')

  it('card is draggable horizontally when flipped', () => {
    expect(src).toContain("drag={isFlipped ? 'x' : false}")
  })

  it('swiping right shows "Learned" badge', () => {
    expect(src).toContain('successOpacity')
    expect(src).toContain('Learned')
  })

  it('swiping left shows "Review" badge', () => {
    expect(src).toContain('struggleOpacity')
    expect(src).toContain('Review')
  })

  it('swipe threshold is 120px like the real FlashCard', () => {
    expect(src).toContain('const threshold = 120')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 5: Visitor completes all 3 demo cards
// ──────────────────────────────────────────────────
describe('Sim 5: Visitor completes all demo cards and sees reset', () => {
  const src = readSource('app/components/DemoCard.tsx')

  it('there are exactly 3 demo cards', () => {
    expect(src).toContain('Ephemeral')
    expect(src).toContain('Resilient')
    expect(src).toContain('Serendipity')
  })

  it('progress dots track completion', () => {
    expect(src).toContain('completedCount')
    expect(src).toContain('bg-emerald-500')
  })

  it('reset button appears after all cards are done', () => {
    expect(src).toContain('completedCount >= DEMO_CARDS.length')
    expect(src).toContain('resetDemo')
    expect(src).toContain("t('landing.demo.tryAgain')")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 6: Non-logged-in user sees language switcher in header
// ──────────────────────────────────────────────────
describe('Sim 6: Non-logged-in user sees language switcher in header', () => {
  const src = readSource('app/components/header.tsx')

  it('header imports LanguageSwitcher', () => {
    expect(src).toContain("import LanguageSwitcher from './LanguageSwitcher'")
  })

  it('LanguageSwitcher is rendered in the non-logged-in section', () => {
    // The LanguageSwitcher should appear before Login/Join in the logged-out branch
    const loggedOutIdx = src.indexOf('<LanguageSwitcher />')
    const loginIdx = src.indexOf('href="/login"')
    expect(loggedOutIdx).toBeGreaterThan(-1)
    expect(loginIdx).toBeGreaterThan(-1)
    expect(loggedOutIdx).toBeLessThan(loginIdx)
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 7: Arabic user switches header language
// ──────────────────────────────────────────────────
describe('Sim 7: Arabic user uses header language switcher', () => {
  const src = readSource('app/components/LanguageSwitcher.tsx')

  it('LanguageSwitcher toggles between en and ar', () => {
    expect(src).toContain("language === 'en' ? 'ar' : 'en'")
  })

  it('shows Arabic label when in English', () => {
    expect(src).toContain('العربية')
  })

  it('shows English label when in Arabic', () => {
    expect(src).toContain('English')
  })

  it('has a Globe icon', () => {
    expect(src).toContain('Globe')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 8: Non-logged-in user sees login and join buttons
// ──────────────────────────────────────────────────
describe('Sim 8: Header shows login/join for non-logged-in users', () => {
  const src = readSource('app/components/header.tsx')

  it('header shows Login link', () => {
    expect(src).toContain('href="/login"')
    expect(src).toContain("t('header.login')")
  })

  it('header shows Join button', () => {
    expect(src).toContain('href="/register"')
    expect(src).toContain("t('header.join')")
  })

  it('header logo links to / for non-logged-in users', () => {
    expect(src).toContain("href={user ? '/cards/learning' : '/'}")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 9: Logged-in user sees correct header layout
// ──────────────────────────────────────────────────
describe('Sim 9: Logged-in user sees ranking, settings, profile in header', () => {
  const src = readSource('app/components/header.tsx')

  it('logged-in user sees ranking link', () => {
    expect(src).toContain('href="/ranking"')
  })

  it('logged-in user sees settings link', () => {
    expect(src).toContain('href="/settings"')
  })

  it('logged-in user sees profile link', () => {
    expect(src).toContain('href="/profile"')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 10: AI safety blocklist catches profanity
// ──────────────────────────────────────────────────
describe('Sim 10: AI content has a safety blocklist', () => {
  const src = readSource('app/api/ai/generate-sentences/route.ts')

  it('SAFETY_BLOCKLIST constant exists', () => {
    expect(src).toContain('SAFETY_BLOCKLIST')
  })

  it('blocklist catches profanity', () => {
    expect(src).toMatch(/fuck|shit|damn/)
  })

  it('blocklist catches violence terms', () => {
    expect(src).toMatch(/kill|murder|rape|torture/)
  })

  it('blocklist catches sexual content', () => {
    expect(src).toMatch(/porn|nude|naked/)
  })

  it('blocklist catches drug references', () => {
    expect(src).toMatch(/heroin|cocaine|meth/)
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 11: AI filter function is applied to output
// ──────────────────────────────────────────────────
describe('Sim 11: AI safety filter function is used on output', () => {
  const src = readSource('app/api/ai/generate-sentences/route.ts')

  it('filterSafeSentences function is defined', () => {
    expect(src).toContain('function filterSafeSentences')
  })

  it('filter tests each sentence against blocklist', () => {
    expect(src).toContain('SAFETY_BLOCKLIST.test')
  })

  it('filter is applied to parsed AI sentences', () => {
    expect(src).toContain('filterSafeSentences(parsed.sentences)')
  })

  it('sentences array is typed as string[]', () => {
    expect(src).toContain('let sentences: string[]')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 12: AI prompt instructs PG-rated content
// ──────────────────────────────────────────────────
describe('Sim 12: AI prompt has content safety constraint', () => {
  const src = readSource('app/api/ai/generate-sentences/route.ts')

  it('prompt mentions CONTENT SAFETY', () => {
    expect(src).toContain('CONTENT SAFETY')
  })

  it('prompt mentions language-learning app for minors', () => {
    expect(src).toContain('language-learning app used by minors')
  })

  it('prompt requires PG-rated content', () => {
    expect(src).toContain('PG-rated')
  })

  it('prompt forbids profanity and explicit content', () => {
    expect(src).toContain('NEVER include profanity')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 13: Landing page "Try It Now" scrolls to demo
// ──────────────────────────────────────────────────
describe('Sim 13: "Try It Now" button scrolls to demo section', () => {
  const src = readSource('app/page.tsx')

  it('landing page has demoRef ref', () => {
    expect(src).toContain('demoRef')
    expect(src).toContain('useRef<HTMLDivElement>')
  })

  it('"Try It Now" scrolls smoothly to demo section', () => {
    expect(src).toContain("demoRef.current?.scrollIntoView({ behavior: 'smooth' })")
  })

  it('demo section has id="demo" and ref={demoRef}', () => {
    expect(src).toContain('id="demo"')
    expect(src).toContain('ref={demoRef}')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 14: Landing page CTAs have correct labels
// ──────────────────────────────────────────────────
describe('Sim 14: Landing page CTAs are non-misleading', () => {
  const translations = readSource('lib/translations.ts')

  it('"Get Started Free" replaces "Start Free Trial"', () => {
    expect(translations).toContain("'landing.hero.startTrial': 'Get Started Free'")
    expect(translations).not.toContain("'landing.hero.startTrial': 'Start Free Trial'")
  })

  it('"Try It Now" replaces "Watch Demo"', () => {
    expect(translations).toContain("'landing.hero.watchDemo': 'Try It Now'")
    expect(translations).not.toContain("'landing.hero.watchDemo': 'Watch Demo'")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 15: Landing page has LanguageSwitcher
// ──────────────────────────────────────────────────
describe('Sim 15: Visitor uses language switcher on landing page', () => {
  const src = readSource('app/page.tsx')

  it('landing page imports LanguageSwitcher', () => {
    expect(src).toContain("import LanguageSwitcher from './components/LanguageSwitcher'")
  })

  it('landing page renders LanguageSwitcher', () => {
    expect(src).toContain('<LanguageSwitcher />')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 16: Login page has LanguageSwitcher
// ──────────────────────────────────────────────────
describe('Sim 16: User uses language switcher on login page', () => {
  const src = readSource('app/login/page.tsx')

  it('login page imports LanguageSwitcher', () => {
    expect(src).toContain("import LanguageSwitcher from '../components/LanguageSwitcher'")
  })

  it('login page renders LanguageSwitcher', () => {
    expect(src).toContain('<LanguageSwitcher />')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 17: Register page has LanguageSwitcher
// ──────────────────────────────────────────────────
describe('Sim 17: User uses language switcher on register page', () => {
  const src = readSource('app/register/page.tsx')

  it('register page imports LanguageSwitcher', () => {
    expect(src).toContain("import LanguageSwitcher from '../components/LanguageSwitcher'")
  })

  it('register page renders LanguageSwitcher', () => {
    expect(src).toContain('<LanguageSwitcher />')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 18: New user registers with terms and redirects correctly
// ──────────────────────────────────────────────────
describe('Sim 18: Registration requires terms and redirects to /cards/learning', () => {
  const src = readSource('app/register/page.tsx')

  it('register page has terms checkbox', () => {
    expect(src).toContain('acceptedTerms')
    expect(src).toContain('type="checkbox"')
  })

  it('links to privacy policy and terms of service', () => {
    expect(src).toContain('href="/legal/terms"')
    expect(src).toContain('href="/legal/privacy"')
  })

  it('blocks registration if terms not accepted', () => {
    expect(src).toContain('if (!acceptedTerms)')
    expect(src).toContain("t('register.termsRequired')")
  })

  it('redirects to /cards/learning after registration', () => {
    expect(src).toContain("router.push('/cards/learning')")
    const pushCalls = src.match(/router\.push\(['"]([^'"]+)['"]\)/g) || []
    const rootPushes = pushCalls.filter((c: string) => c === "router.push('/')")
    expect(rootPushes.length).toBe(0)
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 19: Translations for terms acceptance
// ──────────────────────────────────────────────────
describe('Sim 19: Translations cover terms acceptance flow', () => {
  const translations = readSource('lib/translations.ts')

  it('EN translations exist for terms acceptance', () => {
    expect(translations).toContain("'register.acceptTerms': 'I agree to the'")
    expect(translations).toContain("'register.termsLink': 'Terms of Service'")
    expect(translations).toContain("'register.privacyLink': 'Privacy Policy'")
    expect(translations).toContain("'register.termsRequired': 'You must accept the terms and privacy policy'")
  })

  it('AR translations exist for terms acceptance', () => {
    expect(translations).toContain("'register.acceptTerms': 'أوافق على'")
    expect(translations).toContain("'register.termsRequired': 'يجب الموافقة على الشروط وسياسة الخصوصية'")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 20: User views card dates instead of "Recently added"
// ──────────────────────────────────────────────────
describe('Sim 20: Card list shows real dates instead of "Recently added"', () => {
  it('dash API returns createdAt and lastReviewedAt', () => {
    const src = readSource('app/api/cards/dash/route.ts')
    expect(src).toContain('createdAt: true')
    expect(src).toContain('lastReviewedAt: true')
  })

  it('search page uses actual dates', () => {
    const src = readSource('app/cards/search/page.tsx')
    expect(src).toContain('card.lastReviewedAt')
    expect(src).toContain('card.createdAt')
    expect(src).toContain('toLocaleDateString')
  })

  it('search result interface includes date fields', () => {
    const src = readSource('app/cards/search/page.tsx')
    expect(src).toContain('createdAt?: string')
    expect(src).toContain('lastReviewedAt?: string | null')
  })

  it('translations exist for date labels', () => {
    const translations = readSource('lib/translations.ts')
    expect(translations).toContain("'searchCards.created': 'Created'")
    expect(translations).toContain("'searchCards.lastReviewed': 'Reviewed'")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 21: Demo section translations (EN)
// ──────────────────────────────────────────────────
describe('Sim 21: English translations exist for demo section', () => {
  const translations = readSource('lib/translations.ts')

  it('demo title exists in EN', () => {
    expect(translations).toContain("'landing.demo.title':")
  })

  it('demo subtitle exists in EN', () => {
    expect(translations).toContain("'landing.demo.subtitle':")
  })

  it('demo newWord label exists in EN', () => {
    expect(translations).toContain("'landing.demo.newWord':")
  })

  it('demo tapReveal label exists in EN', () => {
    expect(translations).toContain("'landing.demo.tapReveal':")
  })

  it('demo tryAgain label exists in EN', () => {
    expect(translations).toContain("'landing.demo.tryAgain':")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 22: Demo section translations (AR)
// ──────────────────────────────────────────────────
describe('Sim 22: Arabic translations exist for demo section', () => {
  const translations = readSource('lib/translations.ts')

  it('demo title exists in AR', () => {
    expect(translations).toContain("'landing.demo.title': 'جرب آلية السحب'")
  })

  it('demo tapReveal exists in AR', () => {
    expect(translations).toContain("'landing.demo.tapReveal': 'انقر للكشف'")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 23: DemoCard has all 3 real vocabulary words with images
// ──────────────────────────────────────────────────
describe('Sim 23: Demo cards use real vocabulary with Unsplash images', () => {
  const src = readSource('app/components/DemoCard.tsx')

  it('Ephemeral card has an Unsplash image', () => {
    expect(src).toContain('Ephemeral')
    const ephIdx = src.indexOf('Ephemeral')
    const imgIdx = src.indexOf('unsplash.com', ephIdx)
    expect(imgIdx).toBeGreaterThan(ephIdx)
  })

  it('Resilient card has an Unsplash image', () => {
    expect(src).toContain('Resilient')
    const resIdx = src.indexOf('Resilient')
    const imgIdx = src.indexOf('unsplash.com', resIdx)
    expect(imgIdx).toBeGreaterThan(resIdx)
  })

  it('Serendipity card has an Unsplash image', () => {
    expect(src).toContain('Serendipity')
    const serIdx = src.indexOf('Serendipity')
    const imgIdx = src.indexOf('unsplash.com', serIdx)
    expect(imgIdx).toBeGreaterThan(serIdx)
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 24: DemoCard integrated into landing page grid layout
// ──────────────────────────────────────────────────
describe('Sim 24: DemoCard is properly integrated in landing page layout', () => {
  const src = readSource('app/page.tsx')

  it('DemoCard is imported', () => {
    expect(src).toContain("import DemoCard from './components/DemoCard'")
  })

  it('demo section uses a 2-column grid', () => {
    expect(src).toContain('lg:grid-cols-2')
  })

  it('DemoCard receives the t function', () => {
    expect(src).toContain('<DemoCard t={t} />')
  })

  it('demo section has proper padding and border', () => {
    expect(src).toContain('py-20 px-4')
    expect(src).toContain('border-b')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 25: Arabic font in LanguageSwitcher uses Cairo
// ──────────────────────────────────────────────────
describe('Sim 25: LanguageSwitcher uses Cairo font for Arabic text', () => {
  const src = readSource('app/components/LanguageSwitcher.tsx')

  it('Arabic label uses --font-cairo CSS variable', () => {
    expect(src).toContain('font-cairo')
  })

  it('Arabic label is rendered in a styled span, not raw text', () => {
    expect(src).toContain('<span')
    expect(src).toContain('fontFamily')
  })

  it('English label remains plain text', () => {
    expect(src).toContain("'English'")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 26: Zero-cards user sees AI vs manual creation options
// ──────────────────────────────────────────────────
describe('Sim 26: New user with zero cards sees how to create cards', () => {
  const src = readSource('app/cards/learning/page.tsx')

  it('detects new user with zero cards', () => {
    expect(src).toContain('isNewUser')
    expect(src).toContain('total === 0')
  })

  it('shows "Two ways to create cards" section header', () => {
    expect(src).toContain("t('learning.howToCreate')")
  })

  it('shows AI-powered creation option with Wand2 icon', () => {
    expect(src).toContain("t('learning.aiMethodTitle')")
    expect(src).toContain("t('learning.aiMethodDesc')")
    expect(src).toContain('Wand2')
  })

  it('shows manual creation option with PenLine icon', () => {
    expect(src).toContain("t('learning.manualMethodTitle')")
    expect(src).toContain("t('learning.manualMethodDesc')")
    expect(src).toContain('PenLine')
  })

  it('AI method is tagged as recommended/fastest', () => {
    expect(src).toContain("t('learning.recommended')")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 27: Zero-cards onboarding has "How it works" steps
// ──────────────────────────────────────────────────
describe('Sim 27: Zero-cards page has step-by-step "How it works"', () => {
  const src = readSource('app/cards/learning/page.tsx')

  it('shows "How it works" section', () => {
    expect(src).toContain("t('learning.howItWorks')")
  })

  it('step 1: add a word', () => {
    expect(src).toContain("t('learning.welcomeStep1')")
    expect(src).toContain("t('learning.welcomeStep1Desc')")
  })

  it('step 2: AI generates everything', () => {
    expect(src).toContain("t('learning.welcomeStep2')")
    expect(src).toContain("t('learning.welcomeStep2Desc')")
  })

  it('step 3: swipe to learn', () => {
    expect(src).toContain("t('learning.welcomeStep3')")
    expect(src).toContain("t('learning.welcomeStep3Desc')")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 28: EN translations for onboarding are complete
// ──────────────────────────────────────────────────
describe('Sim 28: EN translations for zero-cards onboarding', () => {
  const translations = readSource('lib/translations.ts')

  it('has howToCreate translation', () => {
    expect(translations).toContain("'learning.howToCreate': 'Two ways to create cards'")
  })

  it('has AI method title and desc', () => {
    expect(translations).toContain("'learning.aiMethodTitle': 'Let AI build it'")
    expect(translations).toContain("'learning.aiMethodDesc':")
  })

  it('has manual method title and desc', () => {
    expect(translations).toContain("'learning.manualMethodTitle': 'Build it yourself'")
    expect(translations).toContain("'learning.manualMethodDesc':")
  })

  it('has recommended label', () => {
    expect(translations).toContain("'learning.recommended': 'Fastest'")
  })

  it('has CTA hint', () => {
    expect(translations).toContain("'learning.welcomeCtaHint':")
  })

  it('updated step descriptions mention swipe directions', () => {
    expect(translations).toContain("'learning.welcomeStep3': 'Swipe to learn'")
    expect(translations).toContain('swiping right (learned) or left (review again)')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 29: AR translations for onboarding are complete
// ──────────────────────────────────────────────────
describe('Sim 29: AR translations for zero-cards onboarding', () => {
  const translations = readSource('lib/translations.ts')

  it('has Arabic howToCreate', () => {
    expect(translations).toContain("'learning.howToCreate': 'طريقتان لإنشاء البطاقات'")
  })

  it('has Arabic AI method', () => {
    expect(translations).toContain("'learning.aiMethodTitle': 'دع الذكاء الاصطناعي يبنيها'")
  })

  it('has Arabic manual method', () => {
    expect(translations).toContain("'learning.manualMethodTitle': 'ابنِها بنفسك'")
  })

  it('has Arabic recommended label', () => {
    expect(translations).toContain("'learning.recommended': 'الأسرع'")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 30: CTA links new user to /cards/new
// ──────────────────────────────────────────────────
describe('Sim 30: Zero-cards CTA links correctly to card creation', () => {
  const src = readSource('app/cards/learning/page.tsx')

  it('CTA links to /cards/new', () => {
    expect(src).toContain('href="/cards/new"')
  })

  it('CTA uses welcomeCta translation', () => {
    expect(src).toContain("t('learning.welcomeCta')")
  })

  it('CTA hint text exists', () => {
    expect(src).toContain("t('learning.welcomeCtaHint')")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 31: Walkthrough replaces old help modal
// ──────────────────────────────────────────────────
describe('Sim 31: New card page has step-by-step walkthrough instead of old modal', () => {
  const src = readSource('app/cards/new/page.tsx')

  it('no longer has the old AI HELP MODAL comment', () => {
    expect(src).not.toContain('AI HELP MODAL')
  })

  it('has the new STEP-BY-STEP WALKTHROUGH comment', () => {
    expect(src).toContain('STEP-BY-STEP WALKTHROUGH')
  })

  it('uses helpStep state for multi-step navigation', () => {
    expect(src).toContain('helpStep')
    expect(src).toContain('setHelpStep')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 32: Walkthrough has 5 steps with distinct icons
// ──────────────────────────────────────────────────
describe('Sim 32: Walkthrough renders 5 steps with distinct icons', () => {
  const src = readSource('app/cards/new/page.tsx')

  it('step 0 uses Type icon (word field)', () => {
    expect(src).toContain('helpStep === 0')
    expect(src).toContain('<Type size={22}')
  })

  it('step 1 uses Sparkles icon (AI generation)', () => {
    expect(src).toContain('helpStep === 1')
    expect(src).toContain('<Sparkles size={22}')
  })

  it('step 2 uses PenLine icon (edit sentences)', () => {
    expect(src).toContain('helpStep === 2')
    expect(src).toContain('<PenLine size={22}')
  })

  it('step 3 uses ImageIcon (choose image)', () => {
    expect(src).toContain('helpStep === 3')
    expect(src).toContain('<ImageIcon size={22}')
  })

  it('step 4 uses Check icon (create card)', () => {
    expect(src).toContain('helpStep === 4')
    expect(src).toContain('<Check size={22}')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 33: Walkthrough has navigation controls
// ──────────────────────────────────────────────────
describe('Sim 33: Walkthrough has Next, Back, Skip, and Done buttons', () => {
  const src = readSource('app/cards/new/page.tsx')

  it('has a Next button with translation key', () => {
    expect(src).toContain("t('newCard.walkthrough.next')")
  })

  it('has a Back button with translation key', () => {
    expect(src).toContain("t('newCard.walkthrough.back')")
  })

  it('has a Skip button with translation key', () => {
    expect(src).toContain("t('newCard.walkthrough.skip')")
  })

  it('has a Done button with translation key on last step', () => {
    expect(src).toContain("t('newCard.walkthrough.done')")
  })

  it('Next button advances step', () => {
    expect(src).toContain('setHelpStep(s => s + 1)')
  })

  it('Back button decrements step', () => {
    expect(src).toContain('setHelpStep(s => s - 1)')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 34: Walkthrough has progress indicators
// ──────────────────────────────────────────────────
describe('Sim 34: Walkthrough has progress bar and dot indicators', () => {
  const src = readSource('app/cards/new/page.tsx')

  it('has a progress bar that fills based on step', () => {
    expect(src).toContain('((helpStep + 1) / 5) * 100')
  })

  it('has step counter text (e.g. "Step 1 of 5")', () => {
    expect(src).toContain("t('newCard.walkthrough.stepOf')")
  })

  it('has 5 dot indicators', () => {
    expect(src).toContain('[0, 1, 2, 3, 4].map')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 35: Walkthrough auto-shows for zero-card users
// ──────────────────────────────────────────────────
describe('Sim 35: Walkthrough auto-shows when user has 0 cards', () => {
  const src = readSource('app/cards/new/page.tsx')

  it('fetches card count from /api/cards/dash', () => {
    expect(src).toContain('/api/cards/dash')
  })

  it('checks totalCardsCount for auto-show logic', () => {
    expect(src).toContain('totalCardsCount')
  })

  it('sets showHelp(true) when count is 0', () => {
    expect(src).toContain('setShowHelp(true)')
  })

  it('initializes helpStep to 0 for auto-show', () => {
    expect(src).toContain('setHelpStep(0)')
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 36: EN walkthrough translations exist
// ──────────────────────────────────────────────────
describe('Sim 36: English walkthrough translations are complete', () => {
  const translations = readSource('lib/translations.ts')

  it('has step1 title: Start with a Word', () => {
    expect(translations).toContain("'newCard.walkthrough.step1Title': 'Start with a Word'")
  })

  it('has step2 title: AI Does the Magic', () => {
    expect(translations).toContain("'newCard.walkthrough.step2Title': 'AI Does the Magic'")
  })

  it('has step3 title: Edit & Customize', () => {
    expect(translations).toContain("'newCard.walkthrough.step3Title': 'Edit & Customize'")
  })

  it('has step4 title: Choose an Image', () => {
    expect(translations).toContain("'newCard.walkthrough.step4Title': 'Choose an Image'")
  })

  it('has step5 title: Create Your Card', () => {
    expect(translations).toContain("'newCard.walkthrough.step5Title': 'Create Your Card'")
  })

  it('has navigation labels', () => {
    expect(translations).toContain("'newCard.walkthrough.next': 'Next'")
    expect(translations).toContain("'newCard.walkthrough.back': 'Back'")
    expect(translations).toContain("'newCard.walkthrough.skip': 'Skip'")
    expect(translations).toContain("'newCard.walkthrough.done': 'Got it!'")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 37: AR walkthrough translations exist
// ──────────────────────────────────────────────────
describe('Sim 37: Arabic walkthrough translations are complete', () => {
  const translations = readSource('lib/translations.ts')

  it('has Arabic step1 title', () => {
    expect(translations).toContain("'newCard.walkthrough.step1Title': 'ابدأ بكلمة'")
  })

  it('has Arabic step2 title', () => {
    expect(translations).toContain("'newCard.walkthrough.step2Title': 'الذكاء الاصطناعي يقوم بالسحر'")
  })

  it('has Arabic step3 title', () => {
    expect(translations).toContain("'newCard.walkthrough.step3Title': 'عدّل وخصّص'")
  })

  it('has Arabic step4 title', () => {
    expect(translations).toContain("'newCard.walkthrough.step4Title': 'اختر صورة'")
  })

  it('has Arabic step5 title', () => {
    expect(translations).toContain("'newCard.walkthrough.step5Title': 'أنشئ بطاقتك'")
  })

  it('has Arabic navigation labels', () => {
    expect(translations).toContain("'newCard.walkthrough.next': 'التالي'")
    expect(translations).toContain("'newCard.walkthrough.back': 'رجوع'")
    expect(translations).toContain("'newCard.walkthrough.skip': 'تخطي'")
    expect(translations).toContain("'newCard.walkthrough.done': 'فهمت!'")
  })
})

// ──────────────────────────────────────────────────
// SIMULATION 38: Walkthrough step content is educational
// ──────────────────────────────────────────────────
describe('Sim 38: Each walkthrough step has descriptive content', () => {
  const src = readSource('app/cards/new/page.tsx')
  const translations = readSource('lib/translations.ts')

  it('step 1 has example word "Ephemeral"', () => {
    expect(src).toContain('Ephemeral')
  })

  it('step 2 explains what happens on blur', () => {
    expect(translations).toContain('Click outside the word field')
  })

  it('step 3 has edit tips list (3 items)', () => {
    expect(src).toContain("t('newCard.walkthrough.editTip1')")
    expect(src).toContain("t('newCard.walkthrough.editTip2')")
    expect(src).toContain("t('newCard.walkthrough.editTip3')")
  })

  it('step 4 explains visual associations', () => {
    expect(translations).toContain('Visual associations help you remember words faster')
  })

  it('step 5 has the motivational tip', () => {
    expect(translations).toContain('One word')
    expect(translations).toContain('your perfect flashcard')
  })
})
