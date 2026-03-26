// ── Step 2 Logic ────────────────────────────────

const analysisMessages = [
    "Triangulating data points...",
    "Analyzing digital taste...",
    "Weighting sentiment...",
    "Finalizing recipient snapshot..."
];

/**
 * Trigger the Step 2 sequence
 */
function initStep2() {
    const loaderContainer = document.getElementById('loader-container');
    const summaryContainer = document.getElementById('summary-container');
    const loaderText = document.getElementById('loader-text');

    // Reset UI states
    loaderContainer.style.display = 'flex';
    summaryContainer.style.display = 'none';

    // Cycle through messages
    let msgIndex = 0;
    const cycleInterval = setInterval(() => {
        msgIndex++;
        if (msgIndex < analysisMessages.length) {
            loaderText.innerText = analysisMessages[msgIndex];
        } else {
            clearInterval(cycleInterval);
        }
    }, 700);

    // After analysis completes (e.g. 2.8s)
    setTimeout(() => {
        renderSummary();
        loaderContainer.style.display = 'none';
        summaryContainer.style.display = 'flex';
    }, 3000);
}

/**
 * Render the summary based on global signals state
 */
function renderSummary() {
    const container = document.getElementById('summary-groups');
    container.innerHTML = '';

    // Extract non-empty categories from global signals
    // Note: signals is defined in step1.js and managed globally
    const categories = {
        traits: "Personality Traits",
        moment: "Key Moments",
        them: "Personal History",
        event: "Life Events",
        reject: "Avoid / Rejects"
    };

    for (const [key, label] of Object.entries(categories)) {
        const items = signals[key];
        if (items && items.length > 0) {
            const group = document.createElement('div');
            group.className = 'summary-group';

            const groupLabel = document.createElement('div');
            groupLabel.className = 'summary-group-label';
            groupLabel.innerText = label;

            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'summary-items';

            items.forEach(val => {
                const pill = document.createElement('div');
                pill.className = `summary-pill ${key === 'reject' ? 'reject' : ''}`;

                if (key === 'image') {
                    pill.innerText = "Captured Visual Reference";
                } else {
                    // Trim long text for summary pills
                    pill.innerText = val.length > 30 ? val.substring(0, 27) + "..." : val;
                }

                itemsContainer.appendChild(pill);
            });

            group.appendChild(groupLabel);
            group.appendChild(itemsContainer);
            container.appendChild(group);
        }
    }

    // Handle Image separately if needed, or just count visuals
    if (signals.image && signals.image.length > 0) {
        const imgGroup = document.createElement('div');
        imgGroup.className = 'summary-group';
        imgGroup.innerHTML = `
        <div class="summary-group-label">Visual Taste</div>
        <div class="summary-items">
            <div class="summary-pill">${signals.image.length} aesthetic references triangulated</div>
        </div>
      `;
        container.appendChild(imgGroup);
    }
}

// Hook into the router to trigger initStep2 when #step2 is active
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#step2') {
        initStep2();
    }
});

// Also check on initial load if starting at #step2
if (window.location.hash === '#step2') {
    initStep2();
}

/**
 * Event Listener for "Confirm & Continue"
 */
document.getElementById('step2-continue')?.addEventListener('click', () => {
    showScreen('step3'); // Proceed to Step 3
});
