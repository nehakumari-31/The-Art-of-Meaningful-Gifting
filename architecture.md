# GiftSense — Architecture Document

## 1. Overview

**Sentra** *(from "Sentiment" + "Center")* is a mobile-first gifting assistant that helps users give meaningful, personalised gifts by capturing signals about the recipient and evaluating gift ideas against defined "meaning drivers."

> *"We're moving from 'I hope they like it' to 'I know they'll love it' — by triangulating their environment, their digital taste, and their personal history."*

The prototype is a **splash + 8-step wizard flow** (Splash → Step 0 → Step 7) built as a single-page application (SPA). Each step builds on the previous, culminating in an actionable gifting decision.

---

## 2. High-Level Flow

```
[Splash] Sentra Intro Screen
        ↓
[Step 0] Occasion Selector
        ↓
[Step 1] Build Their World (multi-signal input)
        ↓
[Step 2] Signal Aggregation (system processing)
        ↓
[Step 3] Meaning Reveal (insight layer)
        ↓
[Step 4] Gift Idea Input
        ↓
[Step 5] Meaning Check (evaluation)
        ↓
[Step 6] Explanation Layer
        ↓
[Step 7] Upgrade Path → Final Decision
```

**One-liner:** Capture signals → Define meaning → Check gift → Improve decision

---

## 3. Tech Stack

| Layer        | Technology                         | Notes                                      |
|--------------|------------------------------------|--------------------------------------------|
| UI / View    | HTML5 + CSS3 + Vanilla JS          | Mobile-first, no framework required for MVP|
| Routing      | Hash-based SPA routing (`#step-0`) | Keeps it framework-free                    |
| State        | `sessionStorage` / JS module state | Holds recipient profile between steps      |
| Styling      | CSS Custom Properties (variables)  | Tokens for colors, spacing, typography     |
| Fonts        | Google Fonts (Inter / Outfit)      | Loaded via CDN link tag                    |
| Images       | Unsplash Source API                | `https://source.unsplash.com/...` for cards|
| AI / Logic   | Rule-based scoring (MVP)           | Simulates LLM; upgradeable to OpenAI API   |

---

## 4. Project Folder Structure

```
The-Art-of-Meaningful-Gifting/
├── index.html              # Entry point, loads all steps
├── splash.css              # Sentra splash screen styles
├── splash.js               # Splash animation + CTA handler
├── style/
│   ├── tokens.css          # Design tokens (colors, spacing, fonts)
│   ├── global.css          # Reset + base styles
│   ├── step0.css           # Occasion Selector styles
│   ├── step1.css           # Build Their World styles
│   ├── step2.css           # Signal Aggregation / Loading styles
│   ├── step3.css           # Meaning Reveal styles
│   ├── step4.css           # Gift Input styles
│   ├── step5.css           # Meaning Check styles
│   ├── step6.css           # Explanation styles
│   └── step7.css           # Upgrade Path styles
├── js/
│   ├── router.js           # Step-to-step navigation
│   ├── state.js            # Global recipient profile & gift state
│   ├── step0.js            # Occasion selection logic + chip input
│   ├── step1.js            # Signal collection (upload, traits, etc.)
│   ├── step2.js            # Signal aggregation & profile builder
│   ├── step3.js            # Meaning reveal display
│   ├── step4.js            # Gift idea input handler
│   ├── step5.js            # Meaning check evaluation engine
│   ├── step6.js            # Explanation renderer
│   └── step7.js            # Upgrade path logic
├── assets/
│   └── icons/              # SVG icons for toolbar (Step 1)
├── task.md                 # Project task checklist
├── architecture.md         # This document
└── README.md               # Project overview
```

---

## 5. State Management

All data collected across steps is stored in a central **Recipient Profile** object (held in `state.js` and persisted to `sessionStorage`):

```json
{
  "occasion": "Birthday",
  "customOccasions": [],
  "signals": {
    "images": [],
    "moments": [],
    "traits": [],
    "lifeEvents": [],
    "feelsLikeThem": [],
    "wontLike": []
  },
  "meaningProfile": {
    "drivers": [],
    "genericTriggers": [],
    "meaningTriggers": []
  },
  "giftIdea": "",
  "evaluation": {
    "verdict": "",
    "matchedSignals": [],
    "mismatchedSignals": [],
    "upgradeSuggestions": []
  }
}
```

---

## 6. Step-by-Step Architecture

### Splash – Sentra Intro Screen
- **UI:** Full-screen warm background (`#F7F4EF`), centred app name **"Sentra"** with fade-in animation
- **Content:**
  - App name in large Outfit font
  - Hero image (warmth & intelligence theme)
  - Tagline: *"From 'I hope they like it' to 'I know they'll love it'"*
  - Subtext: *"Gifting powered by sentiment, centered on them."*
  - "Get Started →" bronze CTA
- **Output:** Navigates to Step 0
- **No state written** — purely presentational

### Step 0 – Occasion Selector
- **UI:** 2×2 card grid, single selection, chip input on "+ Add your own"
- **Output:** `state.occasion`, `state.customOccasions[]`
- **Gate:** "Continue →" enabled only after selection

### Step 1 – Build Their World
- **UI:** Canvas + floating toolbar (6 signal types)
- **Signals collected:**
  - Image upload → stored as base64 / file ref
  - Chat moment → stored as text
  - Traits → multi-select chips
  - "This is them" / "Won't like" → curated option lists
  - Life events → dropdown or chips
- **Output:** `state.signals`
- **Gate:** "Continue →" enabled after ≥1 signal added

### Step 2 – Signal Aggregation
- **Process:** JS function reads `state.signals`, detects patterns, builds recipient summary
- **UI:** Loading animation → summary reveal card
- **Output:** `state.meaningProfile` (pre-filled with rule-based logic)

### Step 3 – Meaning Reveal
- **UI:** Three colour-coded cards (Drivers / Generic Triggers / Meaning Triggers)
- **Data source:** `state.meaningProfile`

### Step 4 – Gift Idea Input
- **UI:** Single text field with submit button
- **Output:** `state.giftIdea`

### Step 5 – Meaning Check
- **Logic:** Scores gift idea against `state.meaningProfile.drivers`
  - Score > 70% → ✅ Aligned
  - 40–70% → ⚠️ Partial
  - < 40% → ❌ Generic
- **Output:** `state.evaluation.verdict`, `state.evaluation.matchedSignals[]`

### Step 6 – Explanation Layer
- **UI:** Positive match cards + gap cards side by side
- **Data source:** `state.evaluation`

### Step 7 – Upgrade Path
- **UI:** 2–3 upgrade suggestion cards with actionable text
- **Data source:** `state.evaluation.upgradeSuggestions[]`
- **Actions:** "Start Over" (clears state) | "Save Decision" (download/copy summary)

---

## 7. Design System

| Token           | Value      | Usage                            |
|-----------------|------------|----------------------------------|
| `--bg-primary`  | `#F7F4EF`  | Warm off-white (Steps 0, 3–7)    |
| `--accent`      | `#C17F3E`  | Bronze – CTA buttons, selection  |
| `--text-dark`   | `#1A1A1A`  | Primary text                     |
| `--text-muted`  | `#888888`  | Subtext / labels                 |
| `--bg-purple`   | `#4B2A75`  | Deep purple (Step 1)             |
| `--canvas-pink` | `#F4A7C1`  | Canvas background (Step 1)       |
| `--card-bg`     | `#FFFFFF`  | Card surfaces                    |
| `--radius-card` | `16px`     | Card border radius               |
| `--radius-btn`  | `12px`     | Button border radius             |

**Fonts:** Inter (primary) · Outfit (headings) — loaded from Google Fonts

---

## 8. Upgrade Path (Post-MVP)

| Feature              | Implementation                          |
|----------------------|-----------------------------------------|
| Real AI evaluation   | OpenAI API (GPT-4o) for meaning scoring |
| Image analysis       | Vision API to interpret lifestyle photos|
| Persistent storage   | Firebase / Supabase                     |
| Auth                 | Google Sign-In                          |
| Gift Marketplace     | Curated affiliate links based on profile|
