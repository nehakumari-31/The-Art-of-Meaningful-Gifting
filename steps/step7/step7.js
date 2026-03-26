/**
 * Step 7 — Final Selection & Presentation Ritual Logic
 */

function renderFinalSelection() {
    const gift = signals.selectedGift;
    if (!gift) return;

    const heroContainer = document.getElementById('final-hero-view');
    const ritualSteps = document.getElementById('ritual-steps');

    // Render Hero
    heroContainer.innerHTML = `
        <img src="${gift.image}" alt="${gift.name}" onerror="this.src='assets/hero.png'">
        <div class="final-hero-overlay">
            <div class="final-badge">The Perfect Choice</div>
            <h1 class="final-gift-name">${gift.name}</h1>
        </div>
    `;

    // Generate Ritual based on Occasion
    const ritual = getRitualForOccasion(signals.occasion);

    ritualSteps.innerHTML = ritual.steps.map((step, idx) => `
        <div class="ritual-step">
            <div class="step-num">${idx + 1}</div>
            <div class="step-content">
                <h4>${step.title}</h4>
                <p>${step.text}</p>
            </div>
        </div>
    `).join('');

    document.getElementById('ritual-title').innerText = ritual.title;
}

function getRitualForOccasion(occasion) {
    const defaultRitual = {
        title: "A Presentation Ritual",
        steps: [
            { title: "Personalize the Card", text: "Mention a specific trait or moment you captured today to show they are truly seen." },
            { title: "Timing is Everything", text: "Find a quiet moment to present the gift, allowing the story behind it to be told." },
            { title: "Reflect on the Meaning", text: "Briefly explain why this particular item resonated with their unique personality." }
        ]
    };

    const rituals = {
        "Birthday": {
            title: "A Birthday Ritual",
            steps: [
                { title: "The Hand-written Note", text: "Begin the note by referencing their 'Creative' nature and how this gift supports that journey." },
                { title: "Unwrapping the Story", text: "Don't just hand it over. Tell them about the 'Meaning Drivers' you discovered today." },
                { title: "The Memory Anchor", text: "Ask them where they plan to keep it, anchoring the gift in their daily space." }
            ]
        },
        "Celebration": {
            title: "A Celebration Toast",
            steps: [
                { title: "Public vs Private", text: "Decide if they'd prefer a public toast or a quiet, meaningful acknowledgment." },
                { title: "Tie to Achievement", text: "Explicitly link the gift's characteristics to the milestone they are celebrating." },
                { title: "A Lasting memento", text: "Explain that this isn't just a gift, but a physical anchor for this specific success." }
            ]
        }
    };

    return rituals[occasion] || defaultRitual;
}

function restartJourney() {
    if (confirm("Are you sure you want to start a new gift journey? Current signals will be cleared.")) {
        localStorage.removeItem('sentra_signals');
        // Reset local signals object (in router.js) if possible, or just reload
        window.location.href = 'index.html#splash';
        window.location.reload();
    }
}

// Hook into router
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#step7') {
        renderFinalSelection();
    }
});

// Initial load check
if (window.location.hash === '#step7') {
    renderFinalSelection();
}
