/* ═══════════════════════════════════════
   SENTRA — Client-side Router
   Hash-based: #splash, #step0 … #step7
   ═══════════════════════════════════════ */

import { initSplash } from './splash.js';

const routes = {
    splash: { screenId: 'splash', init: initSplash },
    step0: { screenId: 'step0', init: null }, // filled in as steps are built
    step1: { screenId: 'step1', init: null },
    step2: { screenId: 'step2', init: null },
    step3: { screenId: 'step3', init: null },
    step4: { screenId: 'step4', init: null },
    step5: { screenId: 'step5', init: null },
    step6: { screenId: 'step6', init: null },
    step7: { screenId: 'step7', init: null },
};

function showScreen(name) {
    document.querySelectorAll('.screen').forEach(el => el.classList.remove('active'));

    const route = routes[name] || routes['splash'];
    const el = document.getElementById(route.screenId);
    if (el) {
        el.classList.add('active');
        el.style.opacity = '1';
    }
    if (route.init) route.init();
    window.location.hash = name;
}

function navigate(name) {
    showScreen(name);
}

// Boot
function boot() {
    const hash = window.location.hash.replace('#', '') || 'splash';
    showScreen(hash);
}

window.router = { navigate };
window.addEventListener('hashchange', () => {
    const name = window.location.hash.replace('#', '');
    if (routes[name]) showScreen(name);
});

boot();
