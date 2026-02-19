# Flotter - Neural-Enhanced Vocabulary Mastery

Flotter is a high-performance, dark-themed vocabulary learning platform designed for users who want to master new languages or specialized terminology through **Spaced Repetition (SRS)**, **Visual Association**, and **AI-Powered Audio Context**.

Inspired by modern minimalist design systems, Flotter provides a distraction-free environment that focuses on building long-term memory through multi-sensory engagement.

## 🚀 Key Features

### 1. The Deck (Learning Interface)
The core of Flotter is **"The Deck"**, an intelligent flashcard system that utilizes a dual-sided learning approach:
*   **Front Side:** Displays the target vocabulary word and a primary visual cue.
*   **Back Side:** Reveals context-rich sentences and plays high-quality audio.
*   **Feedback Loop:** Users categorize their retention as "Success" or "Struggle," which feeds directly into the SRS algorithm.

### 2. Spaced Repetition System (SRS)
Flotter doesn't just show cards randomly. It calculates the optimal time to review each word based on:
*   **Ease Factor:** Adjusts dynamically based on your performance.
*   **Consecutive Successes:** Increases intervals for well-known words.
*   **Sentence Rotation:** If a card has multiple sentences, Flotter rotates them during reviews to ensure you understand the *word*, not just a specific sentence.

### 3. AI-Powered Audio (ElevenLabs)
Every word and sentence is brought to life with premium AI audio:
*   **Primary Engine:** ElevenLabs Multilingual v2 for natural, ultra-realistic pronunciation.
*   **Fallback:** Robust Google TTS integration ensures audio is always available, even if API limits are reached.

### 4. Integrated Visual Search (Unsplash)
Building cards is fast and intuitive. When adding a word, Flotter provides an integrated **Unsplash search grid**, allowing you to pick the perfect visual anchor for your new vocabulary in seconds.

### 5. Progress Dashboard
*   **Momentum Ring:** A visual representation of your daily objective progress.
*   **Status Tiers:** Track cards through three stages: `Review` (Due now), `Learning` (Active), and `Mastered` (Long-term retention).
*   **Recent Activity:** A quick view of your latest additions and review history.

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

