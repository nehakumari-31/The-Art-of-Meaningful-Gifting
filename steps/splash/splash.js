// ── Splash Logic ────────────────────────────────
document.getElementById('splash-cta')?.addEventListener('click', () => {
    const splash = document.getElementById('splash');
    splash.style.transition = 'opacity 0.5s ease';
    splash.style.opacity = '0';
    setTimeout(() => { showScreen('step0'); }, 480);
});
