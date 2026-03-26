/**
 * Step 3 — Meaning Reveal Logic
 */

function initStep3() {
    console.log("Initializing Step 3: Meaning Reveal");
    renderInsights();

    // Trigger animations after a short delay
    setTimeout(() => {
        const cards = document.querySelectorAll('.insight-card');
        cards.forEach(card => card.classList.add('reveal'));
    }, 100);
}

function renderInsights() {
    const container = document.getElementById('insights-list');
    container.innerHTML = '';

    // We'll generate 3 insights based on available signals or defaults
    const insights = generateInsightData();

    insights.forEach((data, index) => {
        const card = document.createElement('div');
        const themes = ['lavender', 'sage', 'sand'];
        card.className = `insight-card ${themes[index % 3]}`;

        card.innerHTML = `
            <div class="insight-icon">
                <svg viewBox="0 0 24 24">${data.icon}</svg>
            </div>
            <h3 class="insight-title">${data.title}</h3>
            <p class="insight-text">${data.text}</p>
            <div class="grounded-badge">
                <span>Grounded in: ${data.source}</span>
            </div>
        `;

        container.appendChild(card);
    });
}

function generateInsightData() {
    // default icons
    const icons = {
        star: '<path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>',
        heart: '<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>',
        bulb: '<path d="M12 2c-3.31 0-6 2.69-6 6 0 2.38 1.38 4.44 3.38 5.41.51.24.87.72.87 1.28V16c0 .55.45 1 1 1h1.5c.55 0 1-.45 1-1v-1.31c0-.56.36-1.04.87-1.28C16.62 12.44 18 10.38 18 8c0-3.31-2.69-6-6-6zm-1 18h2v1h-2v-1zm-2-2h6v1H9v-1z"/>'
    };

    const data = [];

    // Insight 1: Based on Traits
    const trait = (signals.traits && signals.traits[0]) || "their unique nature";
    data.push({
        title: "The Core Essence",
        text: `The ${trait} nature of your recipient suggests they value depth and intentionality above all.`,
        source: trait,
        icon: icons.star
    });

    // Insight 2: Based on Moments
    const moment = (signals.moment && signals.moment[0]) || "shared memories";
    data.push({
        title: "Emotional Anchors",
        text: `Reference to ${moment.length > 20 ? moment.substring(0, 17) + "..." : moment} reveals a strong connection to milestones and sentimental objects.`,
        source: "Digital Moments",
        icon: icons.heart
    });

    // Insight 3: Based on general vibe
    data.push({
        title: "The Gifting Vibe",
        text: "We've triangulated a preference for timeless quality over temporary trends, prioritizing lasting value.",
        source: "Digital Synthesis",
        icon: icons.bulb
    });

    return data;
}

// Hook into router
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#step3') {
        initStep3();
    }
});

if (window.location.hash === '#step3') {
    initStep3();
}

/**
 * Navigation
 */
document.getElementById('step3-continue')?.addEventListener('click', () => {
    showScreen('step4');
});
