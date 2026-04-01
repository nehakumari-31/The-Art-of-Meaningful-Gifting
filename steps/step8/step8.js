console.log('step8.js loaded');
document.addEventListener('DOMContentLoaded', () => {
    const confidenceBtns = document.querySelectorAll('.scale-btn');
    const intentBtns = document.querySelectorAll('.intent-btn');
    const finishBtn = document.getElementById('step8-finish');

    let selectedConfidence = null;
    let selectedIntent = null;

    // Confidence selection
    confidenceBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            confidenceBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedConfidence = btn.dataset.value;
            checkFormCompletion();
        });
    });

    // Intent selection
    intentBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            intentBtns.forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            selectedIntent = btn.dataset.value;
            checkFormCompletion();
        });
    });

    function checkFormCompletion() {
        if (selectedConfidence && selectedIntent) {
            finishBtn.classList.remove('disabled');
            finishBtn.classList.add('active');
        }
    }

    window.finishJourney = function () {
        if (!selectedConfidence || !selectedIntent) return;

        console.log('User Feedback:', {
            confidence: selectedConfidence,
            intent: selectedIntent,
            finalGift: signals.selectedGift ? signals.selectedGift.name : 'Unknown'
        });

        // Show a final success message (optional)
        const header = document.querySelector('#step8 header');
        const container = document.querySelector('.feedback-container');
        const bottomBar = document.querySelector('#step8 .bottom-bar');

        container.style.opacity = '0';
        bottomBar.style.opacity = '0';

        setTimeout(() => {
            container.style.display = 'none';
            bottomBar.style.display = 'none';

            header.innerHTML = `
                <div class="step-label">All Done</div>
                <h2 class="step-title">Thank you for being part of Sentra.</h2>
                <p class="step-subtext">Redirecting you to the start in a few seconds...</p>
                <div class="loader-pulse" style="margin-top: 40px; margin-left: auto; margin-right: auto;">
                    <svg viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
            `;
            header.style.opacity = '1';

            setTimeout(() => {
                localStorage.removeItem('sentra_signals');
                window.location.hash = 'splash';
                window.location.reload();
            }, 3000);
        }, 400);
    };
});
