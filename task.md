# GiftSense – Working Prototype Task List

## 🗂️ Project Setup
- [x] Initialize project folder structure
- [x] Set up HTML/CSS/JS scaffold
- [x] Create shared design tokens (colors, fonts, spacing)
- [x] Set up routing between steps (Step 0 → Step 7)
- [x] Add transition animations between screens
- [x] Implement Global State & Persistence (localStorage)

---

## 🌟 Splash Screen — Sentra Intro
- [x] Design full-screen splash with warm background (`#F7F4EF`)
- [x] Display app name **"Sentra"** in large, elegant typography
- [x] Add tagline and subtext
- [x] Add "Get Started →" bronze CTA button
- [x] Animate app name on load
- [x] Navigate to Occasion Selector on CTA tap

---

## 🟣 Step 0 — Occasion Selector
- [x] Build mobile-first screen layout
- [x] Add heading "Let's choose the moment"
- [x] Build 2×2 card grid (Birthday, Celebration, Festival, Informal)
- [x] Implement selection logic and custom chip input
- [x] Style "Continue →" button (active after selection)

---

## 🟢 Step 1 — Build Their World
- [x] Build screen with deep purple background (`#4B2A75`)
- [x] Build large rounded canvas for signals
- [x] Add chip count badge and empty state
- [x] Build floating bottom toolbar (Image, Moment, Traits, Them, Event, Reject)
- [x] Show added items as cards/bubbles on canvas
- [x] Activate "Continue →" button after ≥1 signal added

---

## 🟡 Step 2 — Signal Aggregation
- [x] Combine all signals into a unified profile
- [x] Display "Understanding them…" loading screen
- [x] Output: Recipient profile summary card

---

## 🔵 Step 3 — Meaning Reveal
- [x] Build Meaning Reveal screen with cascading insight cards
- [x] Display Lavender (Context), Sage (Drivers), Sand (Vibe) cards
- [x] Implement "Why this matters" toggleable details
- [x] CTA "Continue to check your gift →"

---

## 🔴 Step 4 — Gift Idea Input
- [x] Build dual-path selection screen
- [x] Add text input for custom gift ideas
- [x] Implement real-time validation and button activation
- [x] Add secondary "Sentra, suggest something" path

---

## 🟠 Step 5 — Meaning Check (Verdict)
- [x] Evaluate gift idea against signals (Match, Neutral, Conflict)
- [x] Design color-coded verdict card (Green/Yellow/Red)
- [x] Add status-based iconography and reasoning
- [x] **Verified:** Correctly identifies matches (Traits) and conflicts (Rejects)
- [x] **Verified:** State persists across reloads via localStorage

---

## 🟡 Step 6 — Gift Options (Curation)
- [/] Build horizontal gift curation grid
- [ ] Implement price/value tiered categorization
- [ ] Add "Why it fits" dynamic tags
- [ ] Design premium product cards with imagery

---

## 🔁 Step 7 — Final Selection & Selection
- [ ] Build product detail/expanded view
- [ ] Implement final celebratory confirmation
- [ ] Add "Start Over" and "Save Decision" actions

---

## ✅ Final Polish
- [ ] Ensure smooth step-to-step transitions
- [ ] Make all screens mobile-first responsive
- [ ] Validate color palette consistency
- [ ] Write final project documentation
