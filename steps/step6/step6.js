// ── Step 6 Logic: Gift Curation ──────────────────

const GIFT_DATABASE = [
    {
        id: "leica-m11",
        name: "Leica M11 Camera",
        price: "$8,995",
        image: "assets/premium_leica_gift_1774543367880.png", // Using the newly generated asset
        traits: ["Creative", "Minimalist"],
        occasions: ["Birthday", "Celebration"],
        why: "A masterpiece of craft for their creative soul, stripped of everything but the essential."
    },
    {
        id: "minimalist-watch",
        name: "Nomos Tangente",
        price: "$2,030",
        image: "assets/designer_watch_gift.png", // Fallback if not exists
        traits: ["Minimalist", "Practical"],
        occasions: ["Graduation", "Promotion", "Birthday"],
        why: "Clean lines and German precision for someone who values clarity and time."
    },
    {
        id: "art-journal-set",
        name: "Handmade Leather Journal",
        price: "$120",
        image: "assets/festival.png", // Contextual fallback
        traits: ["Creative", "Sentimental"],
        occasions: ["Informal", "Birthday"],
        why: "A tactile space for their thoughts, perfect for a creative mind."
    },
    {
        id: "smart-lamp",
        name: "Dyson Solarcycle Morph",
        price: "$650",
        image: "assets/minimalist_lamp_gift.png",
        traits: ["Techie", "Practical"],
        occasions: ["Just Moved", "New Job"],
        why: "Intelligent lighting that adapts to their day, perfect for their tech-forward lifestyle."
    },
    {
        id: "outdoor-kit",
        name: "Yeti Trailhead Camp Chair",
        price: "$300",
        image: "assets/informal.png",
        traits: ["Outdoorsy", "Practical"],
        occasions: ["Birthday", "Informal"],
        why: "Durability meets comfort for their next great adventure."
    }
];

async function getDynamicSuggestionsFromGroq() {
    // API key is injected at runtime via window.__SENTRA_GROQ_KEY
    // Never hardcode secrets in source files.
    const injectedKey = (window.__SENTRA_GROQ_KEY || "").trim();
    const apiKey = (signals.groqApiKey || injectedKey || "").trim();
    if (!apiKey) return null;

    const profile = {
        occasion: signals.occasion || "General",
        traits: signals.traits || [],
        moments: signals.moment || signals.moments || [],
        them: signals.them || [],
        event: signals.event || [],
        rejects: signals.rejects || []
    };

    const prompt = `You are a premium gift curator.
Generate exactly 6 realistic gift ideas tailored to this recipient profile.
Return only valid JSON with this shape:
{
  "gifts": [
    { "name": "...", "price": "$...", "why": "...", "traits": ["..."], "occasions": ["..."] }
  ]
}

Rules:
- Keep prices believable and varied.
- Never suggest anything matching rejects.
- Make "why" specific and human.
- Do not include markdown, prose, or code fences.

Profile:
${JSON.stringify(profile, null, 2)}`;

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                temperature: 0.8,
                max_tokens: 900,
                messages: [
                    { role: "system", content: "You return strict JSON only." },
                    { role: "user", content: prompt }
                ]
            })
        });

        if (!response.ok) {
            console.warn("Groq request failed:", response.status);
            return null;
        }

        const data = await response.json();
        const raw = data?.choices?.[0]?.message?.content || "";
        const jsonStart = raw.indexOf("{");
        const jsonEnd = raw.lastIndexOf("}");
        if (jsonStart === -1 || jsonEnd === -1 || jsonEnd <= jsonStart) return null;
        const parsed = JSON.parse(raw.slice(jsonStart, jsonEnd + 1));
        if (!Array.isArray(parsed?.gifts)) return null;

        return parsed.gifts.slice(0, 8).map((gift, idx) => ({
            id: `ai-${idx + 1}`,
            name: gift.name || `Curated Gift ${idx + 1}`,
            price: gift.price || "Price varies",
            image: "assets/hero.png",
            traits: Array.isArray(gift.traits) ? gift.traits : [],
            occasions: Array.isArray(gift.occasions) ? gift.occasions : [signals.occasion || "General"],
            why: gift.why || "Selected based on their profile and your signals.",
            source: "ai"
        }));
    } catch (error) {
        console.warn("Groq parse/request error:", error);
        return null;
    }
}

function setLoadingState(container) {
    container.innerHTML = `
        <div class="gift-card" style="min-width: 100%; text-align:center; padding: 24px;">
            <div class="gift-badge">Preparing curation</div>
            <h3 class="gift-name">Generating dynamic suggestions...</h3>
            <p class="gift-why-text">Using your Step 1 signals to craft realistic picks.</p>
        </div>
    `;
}

async function renderGiftOptions() {
    const container = document.getElementById('gift-options-list');
    if (!container) return;

    container.innerHTML = '';
    setLoadingState(container);

    // Always re-fetch fresh — results change with every new set of signals
    const generated = await getDynamicSuggestionsFromGroq();
    let displayGifts;

    if (generated && generated.length > 0) {
        // AI gifts are already tailored by the prompt — show them all as-is
        signals.dynamicSuggestions = generated;
        saveState();
        displayGifts = generated;
    } else {
        // Static fallback: score each gift against current signals so different
        // inputs always surface different items, then shuffle ties randomly.
        const occasionNorm = (signals.occasion || "").toLowerCase();
        const scored = GIFT_DATABASE.map(gift => {
            const traitScore = (gift.traits || []).filter(t =>
                (signals.traits || []).map(s => s.toLowerCase()).includes(t.toLowerCase())
            ).length;
            const occasionScore = (gift.occasions || []).some(o =>
                o.toLowerCase() === occasionNorm
            ) ? 1 : 0;
            return { gift, score: traitScore + occasionScore, rand: Math.random() };
        });
        scored.sort((a, b) => b.score - a.score || b.rand - a.rand);
        displayGifts = scored.map(s => s.gift);
    }

    container.innerHTML = '';

    displayGifts.forEach(gift => {
        const card = document.createElement('div');
        card.className = 'gift-card';
        card.style.cursor = 'default';

        card.innerHTML = `
            <div class="gift-card-content">
                <div class="gift-badge">${getGiftBadge(gift)}</div>
                <h3 class="gift-name">${gift.name}</h3>
                <div class="gift-why">
                    <p class="gift-why-label">Why it fits</p>
                    <p class="gift-why-text">"${gift.why}"</p>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function getGiftBadge(gift) {
    if ((gift.traits || []).some(t => (signals.traits || []).includes(t))) {
        return "Personal Match";
    }
    if ((gift.occasions || []).includes(signals.occasion)) {
        return "Occasion Perfect";
    }
    if (gift.source === "ai") {
        return "AI Curated";
    }
    return "Handpicked";
}



// Ensure rendering happens when screen is shown
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#step6') {
        renderGiftOptions();
    }
});

// Allow other modules to explicitly trigger a fresh render
window.triggerStep6Render = function() {
    renderGiftOptions();
};

// Initial check if we land directly on step6
if (window.location.hash === '#step6') {
    renderGiftOptions();
}
