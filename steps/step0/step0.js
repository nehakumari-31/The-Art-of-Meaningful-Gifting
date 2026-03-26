// ── Step 0 Logic ────────────────────────────────
const cards = document.querySelectorAll('.occasion-card');
const continueBtn = document.getElementById('step0-continue');

cards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Prevent selection if clicking input or chips
        if (e.target.tagName === 'INPUT' || e.target.classList.contains('add-custom-cta') || e.target.closest('.chips-container') || e.target.classList.contains('chip-remove')) return;

        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        signals.occasion = card.dataset.id;
        saveState();

        // Activate button
        continueBtn.classList.remove('disabled');
        continueBtn.classList.add('active');
    });
});

function toggleCustomInput(e, id) {
    e.stopPropagation();
    const container = document.getElementById(`input-${id}`);
    container.style.display = container.style.display === 'block' ? 'none' : 'block';
    if (container.style.display === 'block') {
        container.querySelector('input').focus();
    }
}

function handleCustomInput(e, id) {
    if (e.key === 'Enter' && e.target.value.trim()) {
        const val = e.target.value.trim();
        if (!signals.traits.includes(val)) {
            signals.traits.push(val);
            saveState();
            renderChips(id);
        }
        e.target.value = '';
    }
}

function renderChips(id) {
    const container = document.getElementById(`chips-${id}`);
    container.innerHTML = '';
    // Use traits for custom chips as well
    signals.traits.forEach((val, idx) => {
        const chip = document.createElement('div');
        chip.className = 'chip';
        chip.innerHTML = `${val} <span class="chip-remove" onclick="removeChip(event, '${id}', ${idx})">×</span>`;
        container.appendChild(chip);
    });
}

function removeChip(e, id, idx) {
    e.stopPropagation();
    signals.traits.splice(idx, 1);
    saveState();
    renderChips(id);
}

continueBtn.addEventListener('click', () => {
    if (!continueBtn.classList.contains('disabled')) {
        showScreen('step1');
    }
});
