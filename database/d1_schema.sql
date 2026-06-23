-- Cloudflare D1 Database Schema for International MCQ Solve
-- Optimised for Serverless SQLite

-- 1. Users Table (Email & Password Authentication)
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Index for fast user retrieval
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. Posts Table (MCQ Exam Sheets)
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    category TEXT NOT NULL,          -- 'html', 'css', 'medical', 'job-exam', 'ssc', 'hsc', etc.
    year INTEGER NOT NULL,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    subject_code TEXT,
    subject TEXT,
    board TEXT DEFAULT 'General',
    mcq_count INTEGER DEFAULT 40,
    answers TEXT NOT NULL,           -- JSON structure: { ka: ["a", "b", ...], kha: [...] }
    explanations TEXT,               -- JSON structure: ["Explanation Q1", "Explanation Q2", ...]
    questions TEXT,                  -- JSON structure: [ { q: "Q text", a: "opt A", b: "opt B", c: "opt C", d: "opt D" }, ... ]
    status TEXT DEFAULT 'draft',     -- 'draft', 'published'
    author TEXT DEFAULT 'Admin',     -- author name set by admin panel
    published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category, status);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published_at, status);

-- 3. Practice Sessions Table (User Attempt History)
CREATE TABLE IF NOT EXISTS practice_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    post_id INTEGER NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    answers TEXT NOT NULL,           -- JSON structure of user's selected answers: [ "a", "c", ... ]
    time_spent INTEGER DEFAULT 0,    -- Time spent in seconds
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_practice_user ON practice_sessions(user_id, created_at DESC);

-- 4. Site Visits Table (Traffic Tracking)
CREATE TABLE IF NOT EXISTS site_visits (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    path TEXT NOT NULL,
    user_agent TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_visits_created ON site_visits(created_at);

-- 5. Settings Table (SEO Metadata & Customisations)
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
);
