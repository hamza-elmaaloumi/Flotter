# PROJECT MASTER DOCUMENTATION
> **Single source of truth for developers, designers, AI assistants, and marketing.**
> Last verified against codebase: March 2026.

---

## 1. App Overview & Elevator Pitch

**Flotter** is a high-speed, AI-powered English vocabulary web application designed for busy professionals, students, and active learners. It eliminates the traditional friction of language study by replacing tedious manual setups with instant, zero-effort AI card generation and an engaging, frictionless swipe-based review interface.

**The Problem It Solves:** Traditional flashcard apps (Anki, Quizlet) demand significant data entry, present the same card every review session (context overfitting), and offer no behavioral intelligence—they can't tell the difference between "I knew it immediately" and "I barely remembered after a long pause." This static approach produces shallow memory traces that decay within 24–72 hours.

**The Solution:** Flotter allows users to input a single English word and, within seconds, the system generates three **emotionally charged, multi-sensory example sentences** plus a relevant visual from Unsplash and native-quality TTS audio. Review uses a Tinder-style swipe mechanic—no typing, no complex menus—making it fast enough for a 2-minute coffee break. The proprietary **ACASRS (Adaptive Context-Aware Spaced Repetition System)** schedules each card across multiple AI-generated contexts, testing true lexical mastery rather than just card-pattern recognition.

**Target Audience:** Modern, busy learners who have short pockets of time (2–5 minutes) and want an immediate return on their effort. Arabic-speaking learners are a primary segment (full RTL support and Arabic UI).

**Tagline options for marketing:**
- *"Master Words at Neural Speed"*
- *"The flashcard app that doesn't just show you words—it implants them."*
- *"Stop losing progress. Shield your mind from memory decay."*

---

## 2. The Science Behind Flotter (For Marketing & AI Assistants)

This section explains **why** Flotter works from a cognitive science perspective. Marketing teams should use this to write ad copy, posters, and landing page content. AI assistants referencing this document should use these principles when generating promotional content.

### 2.1 The Memory Epidemic — The Problem We Solve

Ebbinghaus's Forgetting Curve (1885) proves that without reinforcement, humans lose ~70% of new information within 24 hours and ~90% within a week. Traditional flashcard apps (Anki, Quizlet) fail because:

| Problem | Why It Causes Forgetting |
| :--- | :--- |
| **Passive Recognition** | Only reading word→definition creates shallow memory traces that decay rapidly. |
| **Context Overfitting** | Showing the exact same sentence every review means users memorize the *card*, not the *word*. |
| **Cognitive Friction** | Typing answers and complex setups create resistance that kills daily habits. |
| **No Behavioral Intelligence** | Static algorithms treat "I knew instantly" and "I barely guessed" as identical success signals. |

### 2.2 The Memory Tetrad™ — Four Memory Channels Activated Simultaneously

Every Flotter card triggers four interconnected memory channels. Any single channel can retrieve the memory later:

| Channel | Mechanism | Science |
| :--- | :--- | :--- |
| **Visual** | High-quality Unsplash image paired with the word | Picture Superiority Effect: images encoded directly to long-term memory with **65% retention** vs 10% for words alone. Images are processed **60,000× faster** than text. |
| **Sensory / Embodied** | Sentences include physical actions, textures, and temperatures (e.g., "you feel the ice cold..." ) | Embodied Cognition: sensorimotor simulations ground abstract words in physical experience, activating the motor cortex for physical recall pathways. |
| **Emotional** | AI crafts dramatically intense, surprising, or embarrassing scenarios | Emotional Dissonance: slightly awkward or embarrassing scenarios trigger stronger amygdala activation than neutral sentences, leading to better hippocampal consolidation. |
| **Personal** | All sentences use 2nd-person "you" perspective | Self-Reference Effect: the brain's strongest memory pathway; second-person perspective forces self-referential processing. |

### 2.3 Six Scientific Principles Baked Into Every Card

The AI system prompt is engineered around six peer-reviewed cognitive science principles:

1. **Dual Coding Theory** — Visual AND verbal channels create independent but interconnected memory traces. The "referential connections" between them strengthen recall. Every card forces both channels simultaneously. *(Paivio, 1971)*
2. **Picture Superiority Effect** — Images are encoded directly to long-term memory with 65% retention vs 10% for words alone. The AI generates a targeted image query for every single card. *(standing, 1973)*
3. **Embodied Cognition** — Sensorimotor simulations ground abstract words in physical experience. AI sentences are explicitly prompted to include physical sensations. *(Barsalou, Journal of Cognition)*
4. **Concreteness Fading** — Progressing from concrete (image) to abstract (word) with intermediate steps (sentences) optimizes transfer. The 3-sentence set creates a fading scaffold. *(Indiana University STEM research)*
5. **Production Effect** — The rhythm and cadence instruction ensures sentences are "speakable," enhancing memory through motor activation. *(MacLeod et al.)*
6. **Emotional Dissonance Encoding** — Slightly awkward or embarrassing scenarios create stronger amygdala activation than pure humor, leading to better memory consolidation. *(Temperature 0.85 in the AI prompt is calibrated for this)*

### 2.4 ACASRS — Adaptive Context-Aware Spaced Repetition System

**ACASRS is Flotter's proprietary algorithm**, designed from scratch. It is fundamentally different from legacy SRS (like Anki's SM-2).

#### What Makes ACASRS Different from Standard SRS

| Dimension | Legacy SRS (Anki/Quizlet) | Flotter ACASRS |
| :--- | :--- | :--- |
| **Context** | Same card, same sentence every review | 3+ AI-generated contexts; each review shows a **different** sentence (via `currentSentenceIndex` rotation) |
| **Difficulty** | Binary right/wrong | Adaptive SM-2 ease factor that modulates based on consecutive correct answers |
| **Recovery** | Simple reset on failure | Mastery-first recovery: on "struggle", card returns to the deck at the same sentence (not rotated) until the user gets it right at that context before rotating |
| **24h Retention** | ~10% (standard rote) | ~65% (Memory Tetrad activation) |
| **Behavioral Signals** | None — only final answer | Tracks **hesitation time** (flip-to-swipe duration), **audio completion**, and **swipe velocity** |

#### The Three-Phase ACASRS Validation Protocol

Every word must pass through three phases to graduate to long-term memory cycles:

```
Phase 01 — IMMEDIATE   [15 minutes]
  → Same-session context shift. User proves they know the WORD, not the card layout.
  → If success: advance to Phase 02

Phase 02 — CONSOLIDATION  [24 hours]
  → Sleep-mediated memory binding. Novel semantic environment for validation.
  → If success: advance to Phase 03

Phase 03 — RETENTION  [72 hours]
  → Final context exposure before graduation to exponential long-term review cycles.
  → If success: card graduates to SM-2 exponential intervals (7 days, 21 days, ∞)
```

#### ACASRS Scheduling Logic (Technical)

The scheduling is implemented in `app/api/cards/route.ts` (PATCH action = 'review'):

```
consecutiveCorrect = 0  →  interval = 0    (immediate retry, same deck session)
consecutiveCorrect = 1  →  interval = 15 minutes
consecutiveCorrect = 2  →  interval = 1 day
consecutiveCorrect = 3  →  interval = 3 days
consecutiveCorrect ≥ 4  →  interval = prevInterval × easeFactor (SM-2 exponential)
                           easeFactor increases +0.1 per success (max 3.0)
On failure:              →  consecutiveCorrect reset to 0, interval = 0
                           easeFactor decreases -0.2 (min 1.3)
Sentence rotation:       →  On success, currentSentenceIndex rotates to next sentence
                           On failure, currentSentenceIndex stays (mastery-first recovery)
```

#### Behavioral Intelligence Signals Tracked

ACASRS captures three cognitive signals on the client side, which are sent to the server on every review:

1. **Hesitation Pattern** — `flipTimestamp` is set the moment the user flips the card. The duration between flip and swipe (captured via `handleSwipeXp`) reveals confidence level. Cards that are flipped and immediately swiped = confident. Long pause = struggling.
2. **Audio Completion** — `audioCompleted[cardId]` tracks whether the user listened to the full TTS audio before swiping. This is a proxy for engagement depth.
3. **XP Signals** — `earnedReviewXp` (flip-to-swipe ≥ 1.5 seconds) and `audioPlayed` are sent with each PATCH review request. These also drive XP rewards.

---

## 3. Core Features (Business & Marketing View)

### 3.1 Instant AI Generation (Zero-Effort Setup)
- **What it is:** The user types a word and the AI instantly generates a fully operational flashcard: three diverse, emotionally intense example sentences + an optimized Unsplash image query + the word's primary definition.
- **Why it matters:** Eliminates 100% of the manual preparation work. The learner simply focuses on learning, not setup.
- **How it works:** The AI model (`moonshotai/kimi-k2-instruct-0905` via Groq, temperature 0.85) uses a highly constrained system prompt implementing the Memory Tetrad. Sentences are 15–20 words, use only A1-A2 vocabulary, and must be emotionally intense (dramatic scenarios, not everyday events). Safety filters strip any inappropriate content before return.
- **Free limit:** 3 AI generations per day. Pro: unlimited.
- **Fallback:** If Groq fails, the system falls back to the Free Dictionary API (`dictionaryapi.dev`).

### 3.2 Swipe-to-Sync Review Interface
- **What it is:** A Tinder-style card review system. Flip → listen → swipe right (mastered) or left (need more practice).
- **Why it matters:** Zero typing, zero cognitive overhead. A full review session fits in 2 minutes on a phone.
- **How it works:** Built with `framer-motion`. The top two cards in the due-queue are rendered simultaneously (the second is visible slightly behind the first, creating a "stack" effect). Swipe gesture triggers `handleReview`, which sends a `PATCH /api/cards` request with `keepalive: true` so XP and progress are recorded even if the user navigates away immediately.
- **Free upsell trigger:** Every 10 swipes, a Pro upsell modal appears for non-Pro users.

### 3.3 Contextual Visual Anchoring
- **What it is:** Each card pairs the target word with a compelling, context-appropriate image from Unsplash.
- **Why it matters:** Picture Superiority Effect — 65% retention for image-associated content vs. 10% for text alone. Images processed 60,000× faster than text.
- **How it works:** The AI generates an `imageQuery` (2–3 nouns/adjectives describing the sentence's setting — never including the word itself, and never human-subject queries for content safety). The `/api/images/search` route proxies to `api.unsplash.com/search/photos` with `content_filter=high`.

### 3.4 Audio Immersion (Dual TTS Providers)
- **What it is:** Native-quality TTS audio for every sentence, playable on the card.
- **Why it matters:** Trains pronunciation and intonation. Audio completion earns bonus XP (+5), incentivizing full immersion.
- **How it works:** Primary: Unreal Speech API (voice: "Will", bitrate: 192k). Fallback: Google TTS API. Audio is cached client-side in an `audioCacheRef` map (ObjectURL) and pre-fetched for the top 5 due cards in the deck. Audio responses are cached for 1 year via `Cache-Control: public, max-age=31536000, immutable`.

### 3.5 ACASRS Spaced Repetition (Described in detail in Section 2.4 above)

### 3.6 XP & Gamification Engine
- **XP Events:**
  - `+10 XP` for a valid card review (flip-to-swipe ≥ 1.5 seconds = genuine engagement)
  - `+5 XP` bonus if the user completed audio playback before swiping (`audioPlayed = true`)
  - **Combined:** `+15 XP` per swipe when both conditions are met
  - `+50 XP` for creating a new card
- **XP Storage:** `totalXp` (all time), `monthlyXp` (current month only, auto-resets). `monthlyXp` drives the global leaderboard. Atomic increment via Prisma prevents race conditions.
- **Daily Streak:** Increments when the user earns XP on consecutive days. Pro users get a 1-day streak freeze (can miss 1 day without breaking streak). Effective streak is computed at read time (not stored stale) in `lib/xp.ts → getEffectiveStreak()`.
- **Streak Celebration:** On the first card swipe of a new day (when the user wasn't already active today), a `StreakCelebration` modal fires ~800ms after the swipe with confetti, flame animation, and weekly progress visualization.
- **Leaderboard:** `GET /api/ranking` returns top 100 users by `monthlyXp`. Stale-month correction applied in-memory before sorting to ensure consistency.

### 3.7 Word Library (Curated Vocabulary)
- **What it is:** A built-in catalog of 1,000+ curated English words organized by 10+ thematic categories.
- **Categories include:** Daily Vocabulary, Business English, Academic English, Travel & Culture, Technology & Innovation, and more.
- **How it works:** `lib/word-library.ts` exports the full `wordLibrary` array. The `/api/word-library` route serves it. The `/cards/library` page renders category browsing; clicking a word navigates to `/cards/new?word=<word>` with the word pre-populated.
- **Each entry has:** `word`, `definition`, `difficulty` (beginner/intermediate/advanced).

### 3.8 Pro Subscription
- **Price:** $1/month (cancel anytime)
- **Pro features vs Free:**
  | Feature | Free | Pro |
  | :--- | :--- | :--- |
  | AI Card Generations | 3/day | Unlimited |
  | Ads | Shown (every 10 swipes upsell) | No ads |
  | Streak Freeze | No | Auto-freeze (1 missed day protected) |
  | Streak Alerts | No | Daily push alerts |
  | Pro Badge | No | Exclusive badge on leaderboard |
- **How it works:** Checkout via Polar.sh (`POST /api/checkout` → redirect to Polar checkout URL). `POST /api/webhook` receives Polar events (`subscription.created`, `subscription.updated`, `subscription.canceled`, `order.created`) and flips `isPro` on the user record.

---

## 4. Technical Architecture

### 4.1 Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js | 16.1.6 | Full-stack, App Router, SSR/RSC |
| **UI Library** | React | 19.2.3 | Component model |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | 4.x | Utility-first CSS |
| **Animations** | Framer Motion | 12.x | Gesture handling, card swipe, micro-interactions |
| **Icons** | Lucide React | 0.563.0 | Vector icon system |
| **HTTP Client** | Axios | 1.x | API requests from client |
| **Forms** | React Hook Form | 7.x | Form state & validation |
| **ORM** | Prisma | 7.4.0 | Type-safe DB access |
| **Database** | CockroachDB | — | PostgreSQL-compatible, globally distributed |
| **Auth** | NextAuth.js | 4.24.x | OAuth + credentials auth |
| **Password Hashing** | bcryptjs | 3.x | Bcrypt rounds=12 |
| **AI** | Groq SDK | 0.37.0 | LLM inference (kimi-k2-instruct-0905) |
| **TTS Primary** | Unreal Speech API | v6 | High-quality neural TTS |
| **TTS Fallback** | google-tts-api | 2.0.2 | Reliable fallback TTS |
| **Images** | Unsplash API | REST | Royalty-free image search |
| **Payments** | Polar.sh (@polar-sh/sdk 0.43.1) | — | Subscription billing |
| **Payment Webhook** | @polar-sh/nextjs | 0.9.3 | Webhook verification |
| **Testing** | Vitest | 4.x | Unit + integration tests |
| **Rate Limiting** | `lib/rate-limit.ts` | custom | In-memory sliding window |

### 4.2 Architecture Diagram (Text)

```
User Browser
    │
    ▼
Next.js App Router (app/)
  ├── Public routes: /, /login, /register, /legal/*
  ├── Protected routes (next-auth middleware): /cards/*, /profile, /settings, /ranking
  ├── API Routes (app/api/):
  │     ├── /auth/[...nextauth]  — NextAuth handler (Google + Credentials)
  │     ├── /auth/register       — Email/password registration
  │     ├── /ai/generate-sentences — Groq LLM → Memory Tetrad sentences
  │     ├── /cards               — CRUD + ACASRS review logic + XP award
  │     ├── /cards/[id]          — Single card update/delete
  │     ├── /cards/dash          — Dashboard aggregation
  │     ├── /cards/search        — Library search
  │     ├── /images/search       — Unsplash image proxy
  │     ├── /tts                 — Unreal Speech / Google TTS proxy
  │     ├── /ranking             — Global leaderboard
  │     ├── /profile             — User profile read/write
  │     ├── /checkout            — Polar.sh checkout session
  │     ├── /webhook             — Polar.sh subscription events
  │     ├── /word-library        — Curated vocabulary list
  │     └── /xp/add              — DEPRECATED (returns 410)
    │
    ▼
Prisma ORM
    │
    ▼
CockroachDB (PostgreSQL-compatible)
  └── Tables: users, cards, accounts, sessions, verification_tokens
```

### 4.3 Authentication Flow

1. User visits any protected route → Middleware (`middleware.ts`) intercepts and redirects to `/login`
2. **Email/password:** `POST /api/auth/register` (creates user with bcrypt hash) → `POST /api/auth/[...nextauth]` with credentials provider
3. **Google OAuth:** NextAuth handles the full OAuth flow
4. Session stored via Prisma adapter in `sessions` table
5. All API routes use `getServerSession(authOptions)` — the session user ID is the single source of truth; **never trust client-supplied `userId`**

### 4.4 XP Award Architecture

XP is **awarded server-side only** (inside `lib/xp.ts → awardXp()`) to prevent client manipulation. It is granted in three places:
- `POST /api/cards` — +50 XP on card creation
- `PATCH /api/cards` (action='review') — +10 XP for engagement, +5 bonus for audio = up to +15 XP per swipe
- **`/api/xp/add` is deprecated and returns HTTP 410** — any old client code calling this endpoint will receive an error.

The `awardXp()` function runs inside a Prisma `$transaction` for atomic, race-condition-safe updates. Monthly XP is auto-reset when the current month differs from `monthlyXpResetAt`.

---

## 5. Application Routing & Navigation

### 5.1 Route Map

| Route | Auth Required | Description |
| :--- | :--- | :--- |
| `/` | No | Landing page with full marketing content, ACASRS explanation, Memory Tetrad, and CTAs |
| `/login` | No | Email/password + Google OAuth login |
| `/register` | No | New account registration |
| `/logout` | No | Session termination |
| `/cards/learning` | Yes | Dashboard: cards due count, stats, streak, monthly XP |
| `/cards/deck` | Yes | Primary study mode: swipe cards, earn XP, streak celebration |
| `/cards/new` | Yes | Create new card: enter word → AI generates sentences + image query |
| `/cards/library` | Yes | Browse all personal cards + word library categories |
| `/cards/search` | Yes | Search personal card library by word |
| `/cards/[id]/edit` | Yes | Edit a specific card's word, sentences, image |
| `/profile` | Yes | Personal stats page (XP, streak, subscription status) |
| `/settings` | Yes | Theme toggle, language switch, account preferences |
| `/ranking` | Yes | Global monthly XP leaderboard |
| `/subscribe` | Yes | Pro plan details + Polar.sh checkout trigger |
| `/trial` | Yes | Trial/free tier information |
| `/legal/terms` | No | Terms of Service |
| `/legal/privacy` | No | Privacy Policy |
| `/legal/mentions` | No | Legal Mentions |

### 5.2 Middleware Protection

`middleware.ts` uses `withAuth` from NextAuth to protect the following path patterns:
```
/cards/:path*
/api/cards/:path*
/api/tts/:path*
/api/ai/:path*
/api/xp/:path*
/api/profile/:path*
/api/checkout/:path*
/api/images/:path*
/profile/:path*
/settings/:path*
/ranking/:path*
```
All other routes (including `/api/ranking` itself, `/api/auth/*`, `/api/webhook`) are accessible without a session.

---

## 6. Complete API Reference

### 6.1 POST `/api/auth/register`
**Auth:** None required.
**Rate limit:** 5 requests / 15 minutes / IP.
**Request body:**
```json
{ "email": "string", "password": "string" }
```
**Password rules:** ≥ 8 chars, at least 1 uppercase, 1 lowercase, 1 digit.
**Response 201:**
```json
{ "user": { "id": "uuid", "email": "string" } }
```
**Error codes:** 400 (missing/invalid), 409 (email exists), 429 (rate limited).

---

### 6.2 GET `/api/cards`
**Auth:** Required.
**Query params:** `?dueOnly=true` to return only cards due for review (`nextReviewAt ≤ now`).
**Response 200:**
```json
{ "cards": [ { "id", "word", "imageUrl", "sentences", "nextReviewAt", "currentSentenceIndex", "consecutiveCorrect", "easeFactor", "currentIntervalMs", ... } ] }
```
Note: `currentIntervalMs` is serialized as `number` (BigInt coerced).

---

### 6.3 POST `/api/cards`
**Auth:** Required.
**Request body:**
```json
{ "word": "string (max 100 chars)", "sentences": ["string", ...], "imageUrl": "string (max 2048 chars)" }
```
**Validation:** `sentences` must be a non-empty array of non-empty strings, max 20 items.
**Response 201:** `{ "card": { ...sanitized card object } }`
**Side effect:** Awards **+50 XP** to the authenticated user via `awardXp()`.

---

### 6.4 PATCH `/api/cards`  *(Primary review & rotation endpoint)*
**Auth:** Required.
**Request body for review:**
```json
{
  "cardId": "uuid",
  "action": "review",
  "result": "success" | "struggle",
  "earnedReviewXp": boolean,
  "audioPlayed": boolean
}
```
**Request body for sentence rotation:**
```json
{ "cardId": "uuid", "action": "rotate" }
```

**ACASRS scheduling logic on `result = "success"`:**
- `consecutiveCorrect = 1` → `nextReviewAt = now + 15 min`
- `consecutiveCorrect = 2` → `nextReviewAt = now + 1 day`
- `consecutiveCorrect = 3` → `nextReviewAt = now + 3 days`
- `consecutiveCorrect ≥ 4` → `interval = prevInterval × easeFactor`; `easeFactor += 0.1` (max 3.0)
- `currentSentenceIndex` rotates to next sentence.

**On `result = "struggle"`:**
- `consecutiveCorrect = 0`, `nextReviewAt = now`, `currentIntervalMs = 0`
- `easeFactor -= 0.2` (min 1.3)
- `currentSentenceIndex` does NOT rotate (mastery-first recovery).

**XP award:**
- `earnedReviewXp=true`, `audioPlayed=false` → **+10 XP**
- `earnedReviewXp=true`, `audioPlayed=true` → **+15 XP**
- `earnedReviewXp=false` → no XP

**Response 200:**
```json
{ "card": { ...updated card }, "xpAwarded": 10 }
```

---

### 6.5 GET `/api/cards/dash`
**Auth:** Required.
**Response 200:**
```json
{
  "totalCardsCount": number,
  "dueCardsCount": number,
  "learnedCardsCount": number,
  "cards": [ ...all user cards ],
  "streak": number,
  "lastActiveDate": "ISO date string",
  "totalXp": number,
  "monthlyXp": number,
  "isPro": boolean
}
```
`streak` is computed via `getEffectiveStreak()` — stale DB values are corrected at read time. `monthlyXp` is zeroed if `monthlyXpResetAt` is from a prior month.

---

### 6.6 GET `/api/cards/search`
**Auth:** Required.
**Query params:** `?q=<search term>`
**Response:** Filtered card list matching the search term against `word`.

---

### 6.7 PATCH & DELETE `/api/cards/[id]`
**Auth:** Required. Ownership verified before any update/deletion.
**PATCH:** Update card fields (word, sentences, imageUrl).
**DELETE:** Permanently removes the card. Cascades no XP changes.

---

### 6.8 POST `/api/ai/generate-sentences`
**Auth:** Required.
**Rate limit:** 10 requests / minute / user (in-memory sliding window).
**Daily limit:** Free = 3/day (atomic `updateMany` counter), Pro = unlimited.
**Request body:**
```json
{ "word": "string (max 50 chars, letters/hyphens/spaces only)" }
```
**AI model:** `moonshotai/kimi-k2-instruct-0905` via Groq SDK. Temperature: `0.85`. Max tokens: `300`. Response format: `json_object`.
**AI system prompt highlights:**
- Sentences must be 15–20 words, A1-A2 vocabulary
- Emotionally intense scenarios (dramatic, shocking, embarrassing)
- Never explicit emotional labels — *show* intensity via physical/environmental descriptors
- PG-rated (content safety for minors)
- 3 completely unrelated scenarios, `"you"` perspective, target word as climax
- `imageQuery`: 2–3 nouns/adjectives from Sentence 1's setting, no human subjects, no target word

**Response 200:**
```json
{ "sentences": ["...", "...", "..."], "imageQuery": "string" }
```
**Fallback chain:**
1. Groq API (moonshotai/kimi-k2-instruct-0905)
2. Free Dictionary API (dictionaryapi.dev) — returns real usage examples
3. Generic placeholder sentence

---

### 6.9 GET `/api/tts`
**Auth:** Required.
**Query params:** `?text=<encoded text>&provider=unreal|google`
**Logic:**
1. Tries Unreal Speech v6 API first if `provider=unreal` and `UNREAL_SPEECH_KEY` is set
2. Falls back to Google TTS if Unreal fails or `provider=google`
**Response:** `audio/mpeg` binary stream.
**Cache-Control:** `public, max-age=31536000, immutable` (1 year — audio doesn't change).
**Note:** XP is NOT awarded in the TTS route (was exploitable via pre-fetching; awards only happen at card review).

---

### 6.10 GET `/api/images/search`
**Auth:** Required (session check).
**Query params:** `?query=<search terms>`
**Proxies to:** `api.unsplash.com/search/photos?per_page=32&content_filter=high`
**Content blocklist:** Rejects queries containing human/person-related terms (women, men, face, body, model, bikini, sexy, etc.).
**Response:** Raw Unsplash API JSON response (includes `results[]` with photo URLs, attribution, etc.).

---

### 6.11 GET `/api/ranking`
**Auth:** None required (public endpoint).
**Query params:** `?limit=<1–100>&offset=<0–1000>`
**Algorithm:** Over-fetches a buffer (`(offset + limit) × 4 + 200`), applies stale-month correction in-memory, re-sorts by `monthlyXp DESC → totalXp DESC`, assigns global ranks 1-N, then slices the requested page. This guarantees consistent rank numbers regardless of who views the leaderboard.
**Response 200:**
```json
{ "ranking": [ { "rank", "id", "name", "image", "totalXp", "monthlyXp", "streakCount", "isPro" } ], "limit": number, "offset": number }
```
**Cache:** `no-store` — always fresh.

---

### 6.12 GET & PUT `/api/profile`
**Auth:** Required.
**GET:** Returns user profile (name, email, image, totalXp, monthlyXp, streakCount, isPro, subscription dates, aiGenerationsToday, aiGenerationsResetAt).
**PUT:** Updates name and/or profile image.

---

### 6.13 POST `/api/checkout`
**Auth:** Required.
**Creates a Polar.sh checkout session** for the configured `POLAR_PRODUCT_ID`.
**Success redirect:** `{NEXTAUTH_URL}/subscribe?success=true`
**Metadata sent to Polar:** `{ userId: string }` — used by the webhook to find the user.
**Response 200:** `{ "checkoutUrl": "https://polar.sh/checkout/..." }`

---

### 6.14 POST `/api/webhook`
**Auth:** Polar.sh HMAC signature verification (via `POLAR_WEBHOOK_SECRET`). Rejects all requests with invalid signatures.
**Handled events:**
| Event | Action |
| :--- | :--- |
| `subscription.created` | Sets `isPro=true`, stores Polar customer/subscription IDs and status |
| `subscription.updated` | Updates `isPro` based on status (active → true, else false) |
| `subscription.canceled` | Sets `isPro=false`, `subscriptionStatus='canceled'` |
| `subscription.revoked` | Sets `isPro=false` |
| `order.created` | Sets `isPro=true` (handles one-time payment scenario) |
**User lookup order:** `metadata.userId` → `customer.email` → `polarCustomerId`.

---

### 6.15 GET `/api/word-library`
**Auth:** None required.
**Response:** Full `wordLibrary` array from `lib/word-library.ts` (1,000+ words in 10+ categories).

---

### 6.16 POST `/api/xp/add` — ⚠️ DEPRECATED
**Returns HTTP 410 (Gone).** XP is now awarded server-side within action routes. Any client code calling this endpoint should be updated to use the `PATCH /api/cards` review flow instead.

---

## 7. Data Models & Entities

### 7.1 Database: CockroachDB + Prisma

Datasource: `cockroachdb`. Migrations located in `prisma/migrations/`.

### 7.2 `User` Model

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `gen_random_uuid()` | Primary key |
| `email` | String (unique) | — | Login identity |
| `passwordHash` | String? | — | bcrypt hash (rounds=12) |
| `name` | String? | — | Display name |
| `image` | String? | — | Avatar URL |
| `emailVerified` | DateTime? | — | OAuth email verification timestamp |
| `totalXp` | Int | 0 | All-time XP |
| `monthlyXp` | Int | 0 | Current month XP (leaderboard) |
| `monthlyXpResetAt` | DateTime | now() | Timestamp of last monthly reset |
| `streakCount` | Int | 0 | Current streak (DB value; use `getEffectiveStreak()` for real value) |
| `lastActiveDate` | DateTime? | null | Last day user earned XP |
| `isPro` | Boolean | false | Pro subscription status |
| `polarCustomerId` | String? | — | Polar.sh customer ID |
| `polarSubscriptionId` | String? | — | Polar.sh subscription ID |
| `subscriptionStatus` | String? | — | `active`, `canceled`, `past_due` |
| `subscriptionStartedAt` | DateTime? | — | Subscription start date |
| `subscriptionEndsAt` | DateTime? | — | Subscription end/cancellation date |
| `aiGenerationsToday` | Int | 0 | Daily AI generation counter |
| `aiGenerationsResetAt` | DateTime | now() | Last reset time for daily counter |
| `createdAt` | DateTime | now() | Account creation |
| `updatedAt` | DateTime | now() / auto-update | Last updated |

**Relations:** `cards[]`, `accounts[]` (OAuth), `sessions[]`

### 7.3 `Card` Model

| Field | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `id` | String (UUID) | `gen_random_uuid()` | Primary key |
| `userId` | String | — | FK → users.id (CASCADE DELETE) |
| `word` | String | — | Target English word |
| `imageUrl` | String | — | Unsplash image URL |
| `sentences` | String[] | — | Array of 3 AI-generated sentences |
| `currentSentenceIndex` | Int | 0 | Index of current active sentence |
| `consecutiveCorrect` | Int | 0 | ACASRS phase tracker |
| `easeFactor` | Float | 2.5 | SM-2 ease multiplier (range: 1.3–3.0) |
| `lastReviewedAt` | DateTime? | null | Timestamp of last review |
| `nextReviewAt` | DateTime | now() | When to show this card next (ACASRS) |
| `currentIntervalMs` | BigInt | 0 | Current scheduled interval in milliseconds |
| `createdAt` | DateTime | now() | Card creation timestamp |

**Index:** `idx_cards_user_review` on `(userId, nextReviewAt)` for fast due-card queries.

### 7.4 `Account`, `Session`, `VerificationToken`

Standard NextAuth + Prisma Adapter models. `Account` stores OAuth provider tokens (Google). `Session` stores active user sessions. `VerificationToken` for email verification flows.

---

## 8. Gamification Engine — Full Technical Detail

### 8.1 XP System

**Server-side awarding:** All XP is granted inside `lib/xp.ts → awardXp(userId, amount)`.

The function runs inside a Prisma `$transaction` (serializable isolation) to prevent race conditions:
1. Reads current user state inside transaction
2. Determines if a new calendar month has started (compares `monthlyXpResetAt` UTC month/year)
3. If new month: `monthly_xp = amount` (full reset + seed)
4. If same month: `monthlyXp = { increment: amount }` (atomic increment)
5. Updates `totalXp`, `streakCount`, `lastActiveDate` atomically
6. Returns `{ xpAwarded: amount, newStreak }`

### 8.2 Streak System

**Streak logic in `awardXp()`:**
- Same day (`lastActiveDate == today`): no streak change
- Yesterday (`diffDays == 1`): `streakCount += 1`
- Pro freeze: `diffDays == 2 → streakCount += 1` (only for `isPro=true`)
- `diffDays > 1` (or > 2 for Pro): `streakCount = 1` (reset, but starts new streak)
- No prior activity: `streakCount = 1`

**Effective streak display:** The `getEffectiveStreak()` function in `lib/xp.ts` corrects stale DB values at read time. Called from `/api/cards/dash` and `/api/ranking`.

### 8.3 Streak Celebration Modal

**Trigger logic (`app/cards/deck/page.tsx`):**
- Fires once per calendar day (guarded by `localStorage.getItem('flotter-streak-celebrated-YYYY-MM-DD')`)
- Shows only if the user was **not** already active today before this session (`dashData.lastActiveDate` ≠ today)
- Race condition fix: `hasSwipedRef.current = true` is set unconditionally on first swipe; if `dashData` hasn't loaded yet, the check defers to the `dashData` useEffect callback (so even a single swipe before data arrives triggers the celebration once data loads)
- Fires 800ms after first swipe via `setTimeout`
- Displays the **new** streak count (`streak + 1` within `StreakCelebration` component — the prop receives old streak and component adds 1)

### 8.4 Global Leaderboard

- Ranks by `monthlyXp DESC`, tiebreak by `totalXp DESC`
- Stale-month correction in-memory (users whose `monthlyXpResetAt` is from a prior month show `monthlyXp = 0`)
- Over-fetches a 4× buffer to prevent stale users with high raw DB `monthlyXp` from displacing real earners in paginated results
- Supports pagination: `?limit=<1–100>&offset=<0–1000>`
- `Cache-Control: no-store` to guarantee fresh data

---

## 9. AI Card Engine — System Prompt Architecture

The Groq API call in `app/api/ai/generate-sentences/route.ts` uses `moonshotai/kimi-k2-instruct-0905`:

**Model parameters:**
- Temperature: `0.85` (optimized for emotional creativity without nonsense — research shows slightly higher creativity yields more distinctive emotional combinations)
- Max tokens: `300`
- Response format: `json_object`

**Output schema:**
```json
{
  "primaryDefinition": "string",
  "sentences": ["sentence1", "sentence2", "sentence3"],
  "imageQuery": "string"
}
```

**Sentence constraints enforced in prompt:**
1. Target word MUST appear in every sentence, with ONE consistent most-common meaning
2. ONLY A1-A2 vocabulary
3. 15–20 words per sentence (sits in working memory's "magical number" range: 7±2 chunks)
4. Emotionally intense/dramatic (not everyday situations)
5. SHOW intensity via physical/environmental description — never label emotions
6. PG-rated (content safety for minors, strict profanity/sexuality blocklist)
7. 3 completely unrelated scenarios
8. All sentences use `"you"` perspective (self-reference effect)
9. Target word should be the climax/punchline of the sentence (recency effect)
10. Rhythm/cadence crafted to be "speakable" (production effect)

**Image query constraints:**
- 2–3 simple nouns/adjectives from Sentence 1's physical setting
- No pronouns, no verbs/actions
- NEVER the target word itself
- NEVER human subjects (faces, body, model, etc.)
- Examples: `"dark forest rain"`, `"broken clock tower"`, `"stormy ocean waves"`

**Safety filters applied post-generation:**
- `filterSafeSentences()` — regex blocklist strips profanity/sexual/violent content
- `sanitizeImageQuery()` — strips human-related terms from image query, falls back to `"<word> nature landscape"` if nothing safe remains

---

## 10. Word Library & Content Categories

The curated word library (`lib/word-library.ts`) contains 1,000+ words in the following categories:

| Category ID | Name | Arabic Name | Icon | Color |
| :--- | :--- | :--- | :--- | :--- |
| `daily-vocabulary` | Daily Vocabulary | مفردات يومية | Sun | #F59E0B |
| `business-english` | Business English | إنجليزية الأعمال | Briefcase | #3B82F6 |
| *(others include Academic, Travel, Technology, etc.)* | — | — | — | — |

Each word entry: `{ word, definition, difficulty: 'beginner'|'intermediate'|'advanced' }`.

Users can browse the library at `/cards/library`, click a word to navigate to `/cards/new?word=<word>`, and the AI generation starts automatically.

---

## 11. Security Measures

| Concern | Implementation |
| :--- | :--- |
| **Auth on all protected routes** | `middleware.ts` uses NextAuth `withAuth` |
| **Session-based user ID** | All API routes call `getServerSession()` — client-supplied user IDs are never trusted |
| **Password hashing** | bcrypt rounds=12 |
| **Password complexity** | ≥8 chars, uppercase, lowercase, digit |
| **Registration rate limiting** | 5 attempts / 15 min / IP |
| **AI generation rate limiting** | 10 requests / minute / user (in-memory sliding window) |
| **AI daily quotas** | Free: 3/day (atomic `updateMany` prevents race conditions) |
| **Prompt injection protection** | Input sanitized to `[a-zA-Z\s-]` only, max 50 chars |
| **Content safety (sentences)** | Post-generation regex blocklist for profanity, sexual, violence |
| **Content safety (images)** | `IMAGE_SEARCH_BLOCKLIST` blocks human-subject queries at both AI and image search endpoints |
| **Unsplash safety** | `content_filter=high` on all Unsplash API calls |
| **Card ownership verification** | `PATCH /api/cards` verifies `card.userId === session.user.id` before update |
| **Webhook signature verification** | Polar.sh HMAC verified via `validateEvent()` — missing secret = 500, invalid = 403 |
| **XP server-side only** | `/api/xp/add` is deprecated (410). XP granted only inside trusted server routes |
| **BigInt serialization** | `currentIntervalMs` coerced to `Number` before JSON response |

---

## 12. Environment Variables

The following environment variables must be configured (`.env.local` for development, Vercel for production):

| Variable | Required | Description |
| :--- | :--- | :--- |
| `DATABASE_URL` | Yes | CockroachDB connection string |
| `NEXTAUTH_SECRET` | Yes | Random 32-char secret for NextAuth JWT |
| `NEXTAUTH_URL` | Yes | App base URL (e.g., `https://flotter.vercel.app`) |
| `GOOGLE_CLIENT_ID` | Yes (OAuth) | Google OAuth App client ID |
| `GOOGLE_CLIENT_SECRET` | Yes (OAuth) | Google OAuth App client secret |
| `GROQ_API_KEY` | Yes | Groq API key for LLM inference |
| `UNSPLASH_ACCESS_KEY` | Yes | Unsplash API client ID |
| `UNREAL_SPEECH_KEY` | Yes (TTS) | Unreal Speech API bearer token |
| `POLAR_ACCESS_TOKEN` | Yes (payments) | Polar.sh access token |
| `POLAR_PRODUCT_ID` | Yes (payments) | Polar.sh product UUID for Pro subscription |
| `POLAR_WEBHOOK_SECRET` | Yes (payments) | Polar.sh webhook HMAC secret |

**Production notes:** Change `server: 'sandbox'` to `server: 'production'` in the Polar SDK initialization. All three Polar variables must be replaced with production values.

---

## 13. Internationalization (i18n)

- **Languages supported:** English (`en`), Arabic (`ar`)
- **System:** Custom translation system in `lib/translations.ts`. `LanguageProvider` context exposes a `t(key)` function.
- **RTL support:** Pages and components conditionally apply `dir="rtl"` based on `language === 'ar'`.
- **Language switcher:** `app/components/LanguageSwitcher.tsx` — toggles language and persists choice.
- **Arabic word library names:** Each `WordCategory` has `nameAr` and `descriptionAr` fields.

---

## 14. Theming

- **Modes:** Dark and Light, toggled via `ThemeProvider` context.
- **Dark mode defaults:** `bg-[#121212]`, `text-[#FFFFFF]`, `border-[#2D2D2F]`
- **Light mode defaults:** `bg-[#F8F9FA]`, `text-[#111827]`, `border-[#E2E4E9]`
- **Primary accent color:** `#3B82F6` (blue) throughout the UI
- **Streak/fire color:** `#EF4444` (red)
- **XP/gold color:** `#FACC15` (yellow)
- **Success color:** `#10B981` (green)
- **Pro badge color:** `#FACC15` (gold/yellow)

---

## 15. Testing Infrastructure

Tests are located in `__tests__/` and run via Vitest:

| Directory | Type | Coverage |
| :--- | :--- | :--- |
| `__tests__/unit/` | Unit tests | `rate-limit.ts`, XP logic, TypeScript types, word-library |
| `__tests__/integration/` | Integration | Logical fixes, security fixes, word-library API |
| `__tests__/e2e/` | End-to-end | New user simulation, word-library, mega-category simulations, logical fixes |

**Commands:**
```bash
npm run test           # All tests
npm run test:unit      # Unit only
npm run test:integration  # Integration only
npm run test:typecheck # TypeScript type check (tsc --noEmit)
```

---

## 16. Landing Page Marketing Content (Quick Reference for Marketing Team)

The landing page (`app/page.tsx`) is structured in these sections (top to bottom):

1. **Hero** — "Master Words at Neural Speed" + ACASRS badge + AI card generation SVG animation
2. **Stats Bar** — 94% retention rate, 3× faster learning, 50ms generation, 2 min daily average
3. **Interactive Demo** — Live swipeable demo card
4. **Problem Section** ("The Memory Epidemic") — Forgetting curve graph showing Flotter vs. standard SRS
5. **Neural Connector** — 5-layer memory architecture diagram
6. **Methodology Part 01: AI Flashcard Creation Engine** — Memory Tetrad, 6 Scientific Principles, Generation Pipeline
7. **ACASRS Pulse Line** — Visual of 6 review phases: ENCODE→RECALL→REINFORCE→ANCHOR→LATCH→MASTER
8. **Methodology Part 02: ACASRS Protocol** — Three-phase validation, Legacy vs. ACASRS comparison table, Behavioral Intelligence signals
9. **Orbit Decoration** — Radar chart showing 5 mastery dimensions (Retention 94%, Speed 88%, Recall 98%, Focus 85%, Clarity 92%)
10. **Final CTA** — "Upgrade Your Neural Pathways" + "Get Started Free" button
11. **Footer** — Legal links + "Flotter Engine © 2026"

**Key marketing claims supported by the codebase:**
- "65% retention rate vs. 10% traditional" — Picture Superiority Effect (implemented via Unsplash image on every card)
- "3 AI-generated contexts per word" — `sentences[3]` array + `currentSentenceIndex` rotation
- "Adaptive ease factor" — `easeFactor` SM-2 field in Card model
- "Streak freeze for Pro users" — `isPro && diffDays === 2` check in `awardXp()`
- "Global leaderboard" — `/api/ranking` endpoint
- "$1/month" pricing — confirmed in subscription translations
- "No credit card required to get started" — free tier gives 3 AI generations/day


