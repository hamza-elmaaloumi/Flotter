

1. Finalized Data Model (SQL Schema)
`CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    word TEXT NOT NULL,
    image_url TEXT NOT NULL,
    sentences TEXT[] NOT NULL,
    
    -- SRS Tracking
    current_sentence_index INTEGER DEFAULT 0,
    consecutive_correct INTEGER DEFAULT 0,
    ease_factor FLOAT DEFAULT 2.5,    -- The standard SM-2 starting point
    
    last_reviewed_at TIMESTAMP WITH TIME ZONE,
    next_review_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    current_interval_ms BIGINT DEFAULT 0, 
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Essential for performance
CREATE INDEX idx_cards_user_review ON cards (user_id, next_review_at);`

2. The SRS Engine (Technical Specification)To make implementation deterministic, we define the update_srs function logic here.Inputs: swipe_direction (Left/Right), current_interval, consecutive_correct.ScenarioLogic / MathResulting StateSwipe Left (Struggle)Reset consecutive_correct = 0; Set next_review_at = now + 10s Swipe Right (First time)consecutive_correct = 1; Set next_review_at = now + 6h Swipe Right (Subsequent)consecutive_correct++; new_interval = current_interval * 2.5; next_review_at = now + new_interval

3. API Contract (Core Routes)
These are the endpoints we will build in Next.js /api routes.
Auth
POST /api/auth/register: Takes email/password, creates user, returns JWT.
POST /api/auth/login: Validates, returns JWT.
Cards
GET /api/cards: Returns cards where next_review_at <= now.
POST /api/cards: Validates 3 sentences + word + image; saves to DB.
PATCH /api/cards/[id]/review: Takes the swipe result and updates the SRS fields.
GET /api/images/search?query=word.

5. MVP Task List (The "Build" Order)
Project Setup: Next.js + Tailwind + Lucide Icons + TypeScript config.
Auth Implementation: Create the login/register forms.
Card Creation: Form with Unsplash API integration and "3-sentence" validation.
The "Deck" Page: Fetch due cards.
The Flashcard Component: Implement the Click-to-Flip (with character masking) and Web Speech API audio trigger.
The Swipe Logic: Hook up the Left/Right swipes to the API to update the DB.