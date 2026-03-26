/**
 * Step 4 — Gift Idea Selection Logic
 */

let userGiftIdea = "";

function initStep4() {
    console.log("Initializing Step 4: Gift Idea Selection");
    const textarea = document.getElementById('gift-proposal');
    const checkBtn = document.getElementById('check-idea-btn');
    const keyInput = document.getElementById('groq-api-key');

    if (textarea) {
        textarea.value = userGiftIdea;
        textarea.addEventListener('input', (e) => {
            userGiftIdea = e.target.value;
            signals.userGiftIdea = userGiftIdea;
            saveState();
            if (userGiftIdea.trim().length > 2) {
                checkBtn.classList.remove('disabled');
                checkBtn.classList.add('active');
            } else {
                checkBtn.classList.add('disabled');
                checkBtn.classList.remove('active');
            }
        });

        // Auto-focus after a short delay
        setTimeout(() => textarea.focus(), 500);
    }

    if (keyInput) {
        const injectedKey = (window.__SENTRA_GROQ_KEY || "").trim();
        keyInput.value = signals.groqApiKey || injectedKey || "";
        keyInput.addEventListener('input', (e) => {
            signals.groqApiKey = e.target.value.trim();
            saveState();
        });
    }
}

function handleCheckIdea() {
    if (userGiftIdea.trim().length > 2) {
        // Store the idea globally
        signals.userGiftIdea = userGiftIdea.trim();
        saveState();
        showScreen('step5'); // Move to Meaning Check
    }
}

function handleSentraCuration() {
    // Clear user idea specifically if they choose Sentra's path
    signals.userGiftIdea = "";
    signals.dynamicSuggestions = [];
    saveState();
    showScreen('step6'); // Skip to Gift Options
}

// Hook into router
window.addEventListener('hashchange', () => {
    if (window.location.hash === '#step4') {
        initStep4();
    }
});

if (window.location.hash === '#step4') {
    initStep4();
}

// Event Listeners
document.getElementById('check-idea-btn')?.addEventListener('click', handleCheckIdea);
document.getElementById('sentra-suggest-btn')?.addEventListener('click', handleSentraCuration);
