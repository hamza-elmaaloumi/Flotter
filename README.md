Our app, Flotter, is a flashcard English learning app built for the modern, busy learner. We have been perfecting our algorithm to ensure that every second you spend in the app translates directly into long-term memory.
When compared to other apps, our added value is clear: we don’t just create random cards or use a generic Spaced Repetition System (SRS). Instead, Flotter is designed to be the fastest, most frictionless path to fluency.
Here is why Flotter is different:
1. Instant AI Generation (Zero-Effort Setup)
Traditional apps require you to spend time writing definitions or finding examples. With Flotter, you simply enter a word. Our AI instantly generates three context-rich sentences and suggests relevant visual imagery. In seconds, a high-quality, professional learning tool is ready. You don’t have time to write essays; we give you the content so you can focus on the learning.
2. The Power of "Contextual Cooperation"
We believe a word is only truly learned when it is anchored in reality. Our unique approach uses the cooperation between visual search and sentence variety:
The Image: Provides an immediate mental anchor.
The 3 Sentences: Show the word in different "lives" (different grammatical contexts).
When your brain sees the image and reads the word used in three distinct ways, it creates a "neural lock." This synergy makes the word virtually unforgettable.
3. Pure Speed: The "Swipe-to-Sync" Interaction
Most apps feel like work—they require typing, multiple-choice tests, or complex inputs. Flotter turns learning into a reflex. It is simply swiping left (to review) or right (to master).
No typing.
No long tests.
No friction.
It’s a high-speed experience designed for the person who has 2 minutes in an elevator or 5 minutes on a commute.
4. Audio-Visual Immersion
Every card comes with high-quality audio for all sentences. As you flip and swipe, you aren't just reading; you are hearing the correct pronunciation, rhythm, and intonation. This ensures that when you finally use the word in real life, you sound natural and confident.
5. Scientifically Optimized SRS
Our Spaced Repetition System (SRS) is the engine under the hood. It doesn't show you cards at random. It tracks your "struggle" and "success" to predict exactly when a word is about to fade from your memory, bringing it back at the perfect moment to move it from short-term to long-term storage.
6. Psychological Momentum (Streaks & Ranking)
Learning a language requires consistency, which is the hardest part. Flotter solves this through:
The Streak Spot: A prominent daily tracker that turns your learning into a "don't break the chain" mission.
Global Ranking: A competitive monthly leaderboard where you can see how your XP compares to learners worldwide.
This gamification ensures that even on days when you feel tired, the desire to maintain your rank and streak keeps you "floating" forward.
Flotter isn't just an app; it's a high-speed neural sync tool. Enter a word, swipe through the context, and master the language without ever feeling like you're studying.

---

## 🛠 Tech Stack

*   **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Database:** [PostgreSQL](https://www.postgresql.org/) via [Prisma ORM](https://www.prisma.io/)
*   **Authentication:** [NextAuth.js](https://next-auth.js.org/) (Email/Password & Session Management)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **External APIs:** 
    *   **Unsplash API:** For seamless image discovery.
    *   **ElevenLabs API:** For state-of-the-art TTS audio.
    *   **Google TTS:** For high-reliability audio fallbacks.

---

## 📂 Project Structure

### `/app`
Contains the Next.js App Router structure:
*   `api/`: Backend endpoints for CRUD operations, SRS logic, and external API proxies.
*   `cards/`: Core functional pages including `/deck` (Learning), `/new` (Creation), and `/search` (Library Management).
*   `components/`: Reusable UI elements (Headers, Footers, AdBanners).
*   `providers/`: React Context providers for User state and Authentication.

### `/prisma`
*   `schema.prisma`: The database blueprint defining Users, Accounts, and the complex Card model which stores SRS metadata.

### `/public` & `/sawrce`
*   Static assets and design system configuration files (JSON).

---

## 🎨 Design System: Flotter
Flotter follows a strict visual language:
*   **Palette:** Deep blacks (`#121212`), high-contrast icons (`#3B82F6` Blue, `#EF4444` Red), and subtle borders (`#2D2D2F`).
*   **Typography:** Bold uppercase labels (11px) for metadata and sharp headliners (19px-24px) for content.
*   **Radius:** Consistent 12px for interactive elements and 14px for cards.

---

## ⚙️ Getting Started

1.  **Clone the repository**
2.  **Install dependencies:** `npm install`
3.  **Setup Environment Variables:** Create a `.env` file with:
    *   `DATABASE_URL`: Your PostgreSQL connection string.
    *   `NEXT_AUTH_SECRET`: A secure string for auth.
    *   `UNSPLASH_ACCESS_KEY`: From Unsplash Developer portal.
    *   `NEXT_PUBLIC_ELEVEN_LABS_KEY`: From ElevenLabs dashboard.
4.  **Run Migrations:** `npx prisma migrate dev`
5.  **Start Development:** `npm run dev`

