/**
 * Step 5 — Meaning Check Logic
 */

function initStep5() {
    console.log("Initializing Step 5: Meaning Check");
    renderVerdict();
}

function renderVerdict() {
    const container = document.getElementById('verdict-view');
    const idea = signals.userGiftIdea || "your gift idea";

    const analysis = analyzeIdea(idea);

    container.className = `verdict-card ${analysis.status}`;
    container.innerHTML = `
        <div class="verdict-icon">
            <svg viewBox="0 0 24 24">${analysis.icon}</svg>
        </div>
        <div class="verdict-badge">Sentra Verdict</div>
        <h2 class="verdict-title">${analysis.title}</h2>
        <p class="verdict-description">“${idea}” — ${analysis.summary}</p>
        
        <div class="verdict-reasoning">
            ${analysis.reasons.map(r => `
                <div class="reasoning-item">
                    <div class="reason-bullet">${r.icon}</div>
                    <span>${r.text}</span>
                </div>
            `).join('')}
        </div>

        <div class="verdict-actions">
            <button class="continue-btn active" onclick="goToStep6FromVerdict()">Perfect, show variants</button>
            <div class="action-link" onclick="showScreen('step4')">Try a different idea</div>
        </div>
    `;
}

function analyzeIdea(idea) {
    const text = idea.toLowerCase();
    const results = {
        match: {
            status: 'match',
            title: 'A Perfect Fit',
            summary: 'This aligns beautifully with their personal landscape.',
            icon: '<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>'
        },
        neutral: {
            status: 'neutral',
            title: 'A Thoughtful Choice',
            summary: 'A solid option that resonates well with the occasion.',
            icon: '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>'
        },
        conflict: {
            status: 'conflict',
            title: 'Potential Mismatch',
            summary: 'There might be a slight conflict with their preferences.',
            icon: '<path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>'
        }
    };

    const icons = {
        plus: '✨',
        minus: '⚠️',
        info: 'ℹ️'
    };

    // Simulated keyword matching
    let final = results.neutral;
    let reasons = [];

    // Conflict Check (No flowers)
    const flowerWords = ['flower', 'bouquet', 'rose', 'lily', 'plant', 'floral'];
    const hasFlower = flowerWords.some(w => text.includes(w));

    // Check if any reject signal contains flower keywords
    const rejectedFlowers = (signals.rejects || []).some(r => {
        const rLower = r.toLowerCase();
        return rLower.includes('flower') || rLower.includes('flor') || rLower.includes('plant');
    });

    if (hasFlower && rejectedFlowers) {
        final = results.conflict;
        reasons.push({ icon: icons.minus, text: "Wait, you previously mentioned 'No flowers' as a rejection." });
    }

    // Match Check (Traits/Moments)
    const creativeWords = ['camera', 'paint', 'art', 'book', 'writing', 'pen', 'draw', 'creative'];
    const vintageWords = ['vintage', 'retro', 'old', 'vinyl', 'analog', 'timeless'];

    const isCreative = creativeWords.some(w => text.includes(w));
    const isVintage = vintageWords.some(w => text.includes(w));

    if (isCreative) {
        if (final.status !== 'conflict') final = results.match;
        reasons.push({ icon: icons.plus, text: "Matches their 'Creative' nature perfectly." });
    }

    if (isVintage) {
        if (final.status !== 'conflict') final = results.match;
        reasons.push({ icon: icons.plus, text: "Resonates with their love for timeless, analog aesthetics." });
    }

    // Default reason if empty
    if (reasons.length === 0) {
        reasons.push({ icon: icons.info, text: "A safe and elegant choice for the occasion." });
    }

    return { ...final, reasons };
}

function goToStep6FromVerdict() {
    showScreen('step6');
    if (typeof window.triggerStep6Render === 'function') {
        window.triggerStep6Render();
    }
}

// Hook into router
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#step5') {
        initStep5();
    }
});

if (window.location.hash === '#step5') {
    initStep5();
}
