// ── Global State & Persistence ──────────────────
// Reset signals on every refresh (per user requirement)
const signals = {
    occasion: "",
    traits: [],
    them: [],
    event: [],
    image: [],
    moments: [],
    spending: [],
    preferences: [],
    rejects: [],
    userGiftIdea: "",
    groqApiKey: "",
    dynamicSuggestions: []
};
// Optional: Clear existing storage to ensure a clean start
localStorage.removeItem('sentra_signals');

function saveState() {
    localStorage.setItem('sentra_signals', JSON.stringify(signals));
}

// Global exposure for debugging
window.signals = signals;

// ── Router ──────────────────────────────────────
const SCREENS = ['splash', 'step0', 'step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7'];

function showScreen(name) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));
    const el = document.getElementById(name);
    if (el) {
        el.classList.add('active');
        el.scrollTop = 0;
    }
    window.location.hash = name;
}

// Initial show
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash.replace('#', '') || 'splash';
    showScreen(hash);
});

window.addEventListener('hashchange', () => {
    const name = window.location.hash.replace('#', '');
    if (SCREENS.includes(name)) showScreen(name);
});
