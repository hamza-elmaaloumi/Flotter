## 1. Overview
**App Name:** Flotter  
**Core Purpose:** A high-speed, AI-powered flashcard web application designed for modern, busy learners to master English vocabulary through contextual immersion and frictionless interactions.  
**Target Users:** Busy professionals, students, and language learners who have limited time (2–5 minute pockets) and want to improve their English without the tedious manual setup of traditional study tools.  

## 2. Core Features
*   **Instant AI Generation (Zero-Effort Setup):** Users simply enter a word, and the AI (via Groq API) instantly generates three context-rich sentences and an optimized image search query.
*   **Contextual Cooperation:** Every flashcard anchors memory using a visual image (via Unsplash) combined with the word used in three distinct grammatical contexts.
*   **Swipe-to-Sync Interaction:** A frictionless, Tinder-style interface where users swipe right to master (success) or left to review (struggle)—no typing or multiple-choice tests required.
*   **Audio-Visual Immersion:** High-quality, automatic Text-to-Speech (TTS) audio for all sentences using Unreal Speech (with Google TTS fallback) to teach correct pronunciation and rhythm.
*   **Scientifically Optimized SRS:** A built-in Spaced Repetition System tracks user performance (ease factor, consecutive correct answers) to schedule reviews at the exact moment a word is about to fade from memory.
*   **Psychological Momentum (Gamification):**
    *   **XP & Streaks:** Users earn XP automatically on the server for every interaction — **+10 XP** per card review swipe, **+5 bonus XP** for listening to the audio before swiping (total +15), and **+50 XP** for creating a new card. Daily streaks are tracked via a visual animated "flame" UI.
    *   **Pro Streak Freeze:** Pro subscribers get a 1-day streak freeze — missing a single day does not break their streak.
    *   **Global Ranking:** A competitive monthly leaderboard featuring Gold, Silver, and Bronze podiums to compare XP with learners worldwide. Monthly XP resets at the start of each new month.
*   **Personal Dashboard:** Displays total cards, due cards, current streak, total XP, and a visual 7-day progress tracker.
*   **Library Management:** A search interface to easily find and manage previously created flashcards.
*   **Multi-Language Support:** Full localization for English and Arabic interfaces.
*   **Theme Support:** Seamless Dark and Light mode toggle for comfortable viewing.
*   **Settings & Support:** A dedicated Settings page provides an XP guide, learning tips, language and theme controls, and a direct support email (`support@flotter.app`).
*   **Legal Pages:** Includes Privacy Policy, Terms of Service, and Legal Mentions pages.
*   **Security & Rate Limiting:** Built-in API rate limiting to prevent abuse and ensure platform stability. Registration enforces strong password requirements (minimum 8 characters with uppercase, lowercase, and a number).

## 3. Technical Stack
*   **Frontend:** Next.js 16 (App Router), React 19, TypeScript
*   **Styling & Animation:** Tailwind CSS v4, Framer Motion (for swipe gestures), Lucide React (icons)
*   **Forms:** React Hook Form
*   **HTTP Client:** Axios
*   **Backend:** Next.js API Routes
*   **Database:** CockroachDB (PostgreSQL-compatible) accessed via Prisma ORM
*   **Authentication:** NextAuth.js supporting Google OAuth and Credentials (Email/Password)
*   **Testing:** Vitest for unit, integration, and E2E testing
*   **External APIs:**
    *   **Groq API:** For AI-driven sentence and image query generation.
    *   **Unsplash API:** For seamless image discovery and visual anchoring.
    *   **Unreal Speech API & Google TTS:** For high-quality audio generation.
    *   **Polar.sh:** For handling Pro tier subscriptions and checkouts.
*   **Hosting:** Vercel

## 4. User Flow
1.  **Authentication:** Users sign up or log in securely via Google or Email/Password.
2.  **Card Creation:** The user enters a single English word. The AI automatically generates three example sentences and fetches relevant images. The user selects an image and saves the card.
3.  **Learning/Review (The Deck):** The user accesses their due cards from the dashboard. They view the image and sentences, listen to the auto-playing audio, and swipe right (knew it) or left (struggled).
4.  **Progression:** Each swipe and audio completion awards XP. The SRS algorithm recalculates the next review date for that specific card.
5.  **Gamification Loop:** The user checks the dashboard to see their daily streak update and visits the Ranking page to see their standing on the global leaderboard.
6.  **Monetization:** Free users are limited to **3 AI card generations per day** and are prompted to upgrade to a Pro subscription (via Polar) for unlimited AI usage, an ad-free experience, and a streak-freeze benefit.

## 5. Unique Value Proposition
**Main Problem Solved:** Traditional flashcard apps feel like work—they require tedious manual data entry, typing, and long tests, causing busy learners to lose consistency and quit.  
**Value Proposition:** The fastest, most frictionless path to English fluency, combining zero-effort AI card creation with an intuitive swipe-based review system.  
**Primary Benefit:** Master English vocabulary and pronunciation in just minutes a day without ever feeling like you are studying.  

**Marketing-Ready Benefit Statements:**
*   **Zero-Effort Setup:** Enter a word, and our AI instantly builds a complete, context-rich flashcard in seconds.
*   **Swipe-to-Sync:** Learn at the speed of thought with intuitive swipe gestures—no typing, no friction.
*   **Contextual Memory:** Lock words into your brain permanently using a powerful synergy of visual images and diverse sentence contexts.
*   **Audio-Visual Immersion:** Hear native pronunciation instantly as you swipe, ensuring you sound natural and confident in real life.
*   **Gamified Consistency:** Turn learning into an addiction with daily streaks, XP rewards, and a competitive global leaderboard.

## 6. Marketing-Ready Description
**Short Description:**  
Flotter is an AI-powered English learning web app that turns vocabulary mastery into a fast, frictionless swipe-based experience.

**Medium Description:**  
Flotter revolutionizes language learning for busy people. Simply enter a word, and our AI instantly generates a context-rich flashcard complete with images and native audio. With an intuitive swipe interface, scientifically optimized spaced repetition, and built-in gamification, Flotter makes mastering English as easy and addictive as checking your phone.

**Detailed Product Overview:**  
Flotter is a next-generation flashcard web application designed specifically for modern, busy English learners. Unlike traditional apps that require tedious manual setup, Flotter uses advanced AI to instantly generate three context-rich sentences and relevant imagery for any word you enter. The learning experience is stripped of all friction—there are no typing exercises or multiple-choice tests, just a fluid swipe-left or swipe-right interface. Under the hood, a scientifically optimized Spaced Repetition System (SRS) ensures words are reviewed at the exact moment they are about to be forgotten. Combined with high-quality text-to-speech audio, daily streaks, and a global XP leaderboard, Flotter transforms language study from a chore into a high-speed neural sync.

## 7. Platform & Availability
*   **Platform:** Web Application (Optimized for mobile and desktop browsers)
*   **Hosting:** Hosted securely on Vercel
*   **Availability:** Accessible via web browser only. *(Note: This application is NOT available on the Apple App Store or Google Play Store).*