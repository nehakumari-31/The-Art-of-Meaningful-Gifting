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

    let dynamicGifts = signals.dynamicSuggestions;
    if (!Array.isArray(dynamicGifts) || dynamicGifts.length === 0) {
        const generated = await getDynamicSuggestionsFromGroq();
        if (generated && generated.length > 0) {
            signals.dynamicSuggestions = generated;
            saveState();
            dynamicGifts = generated;
        }
    }

    // Filter gifts based on signals
    const sourcePool = Array.isArray(dynamicGifts) && dynamicGifts.length > 0 ? dynamicGifts : GIFT_DATABASE;
    const filteredGifts = sourcePool.filter(gift => {
        // Match by trait
        const traitMatch = (gift.traits || []).some(t => (signals.traits || []).includes(t));
        // Match by occasion
        const occasionMatch = (gift.occasions || []).includes(signals.occasion);

        return traitMatch || occasionMatch;
    });

    // If no specific matches, show all as "Curated for You"
    const displayGifts = filteredGifts.length > 0 ? filteredGifts : sourcePool;
    container.innerHTML = '';

    displayGifts.forEach(gift => {
        const card = document.createElement('div');
        card.className = 'gift-card';
        card.onclick = () => selectGift(gift);

        card.innerHTML = `
            <img src="${gift.image}" alt="${gift.name}" class="gift-card-image" onerror="this.src='assets/hero.png'">
            <div class="gift-card-content">
                <div class="gift-badge">${getGiftBadge(gift)}</div>
                <h3 class="gift-name">${gift.name}</h3>
                <p class="gift-price">${gift.price}</p>
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

function selectGift(gift) {
    signals.selectedGift = gift;
    saveState();
    showScreen('step7');
    renderFinalSelection();
}

// Ensure rendering happens when screen is shown
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#step6') {
        renderGiftOptions();
    }
});

// Initial check if we land directly on step6
if (window.location.hash === '#step6') {
    renderGiftOptions();
}
