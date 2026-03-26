/* ═══════════════════════════════════════
   SENTRA — Splash JS
   Handles: entry animation trigger,
   CTA click → router navigation
   ═══════════════════════════════════════ */

export function initSplash() {
  const cta = document.getElementById('splash-cta');
  if (!cta) return;

  cta.addEventListener('click', () => {
    // Fade out whole splash, then navigate
    const splash = document.getElementById('splash');
    splash.style.transition = 'opacity 0.5s ease';
    splash.style.opacity = '0';

    setTimeout(() => {
      window.router.navigate('step0');
    }, 480);
  });
}
