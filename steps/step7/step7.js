function renderFinalSelection() {
    const gift = signals.selectedGift;
    if (!gift) return;

    const heroContainer = document.getElementById('final-hero-view');
    const scrollContainer = document.getElementById('scrollable-cards');

    // Render Hero
    heroContainer.innerHTML = `
        <img src="${gift.image}" alt="${gift.name}" onerror="this.src='assets/hero.png'">
        <div class="hero-details">
            <h3 class="hero-title">${gift.name}</h3>
            <p class="hero-why">"${gift.why}"</p>
        </div>
    `;

    // Render Scrollable Cards (other suggestions)
    const others = (signals.dynamicSuggestions || []).filter(g => g.id !== gift.id);
    if (others.length > 0) {
        scrollContainer.innerHTML = others.map(g => `
            <div class="rec-card" onclick="selectAnotherGift('${g.id}')">
                <img src="${g.image}" alt="${g.name}" onerror="this.src='assets/hero.png'">
                <div class="rec-name">${g.name}</div>
            </div>
        `).join('');
    } else {
        scrollContainer.innerHTML = '<p class="gift-why-text" style="padding: 0 24px;">No other suggestions at the moment.</p>';
    }
}

function selectAnotherGift(giftId) {
    const gift = (signals.dynamicSuggestions || []).find(g => g.id === giftId);
    if (gift) {
        signals.selectedGift = gift;
        saveState();
        renderFinalSelection();
    }
}

function saveFinalSelection() {
    const gift = signals.selectedGift;
    if (gift) {
        alert(`Successfully saved: ${gift.name}!`);
        // Additional save logic could go here
    }
}

function surpriseMe() {
    const pool = signals.dynamicSuggestions || [];
    if (pool.length > 0) {
        const randomGift = pool[Math.floor(Math.random() * pool.length)];
        signals.selectedGift = randomGift;
        saveState();
        renderFinalSelection();
        alert(`Surprise! How about the ${randomGift.name}?`);
    }
}

function restartJourney() {
    if (confirm("Are you sure you want to start a new gift journey? Current signals will be cleared.")) {
        localStorage.removeItem('sentra_signals');
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
