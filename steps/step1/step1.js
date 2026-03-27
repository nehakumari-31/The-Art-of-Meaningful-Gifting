// ── Step 1 Logic ────────────────────────────────
const CANVAS_SIGNAL_KEYS = ['traits', 'moments', 'them', 'event', 'rejects', 'image'];
let pendingImageValue = "";

function getSignalCount() {
  return CANVAS_SIGNAL_KEYS.reduce((acc, key) => {
    const arr = signals[key];
    return acc + (Array.isArray(arr) ? arr.length : 0);
  }, 0);
}


const signalOptions = {
  traits: ["Introvert", "Creative", "Minimalist", "Techie", "Outdoorsy", "Sentimental", "Humorous", "Practical"],
  them: ["A messy desk with plants", "Morning coffee routine", "Loves vintage vinyl", "Hiker at heart", "Night owl"],
  event: ["New Job", "Just Moved", "First Anniversary", "Promotion", "Graduation"],
  rejects: ["No flowers", "Discards generic cards", "Avoids plastic", "Not a cook", "Hates bright colors"]
};

function openSignalModal(type) {
  const overlay = document.getElementById('signal-overlay');
  const title = document.getElementById('overlay-title');
  const body = document.getElementById('overlay-body');

  document.querySelectorAll('.toolbar-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.toolbar-btn[onclick*="${type}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  overlay.classList.add('active');
  title.innerText = `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  if (type === 'moment') {
    body.innerHTML = `
      <div class="input-group">
        <label>A meaningful message from chat or life</label>
        <textarea id="moment-input" placeholder="e.g. 'I miss our long walks in the park...'"></textarea>
      </div>
      <div class="overlay-footer">
        <button class="add-btn" onclick="handleSignalAdd('moment')">Add to World</button>
      </div>
    `;
  } else if (type === 'image') {
    pendingImageValue = "";
    body.innerHTML = `
      <div class="input-group" style="text-align: center; padding: 20px;">
        <div style="width: 100%; height: 120px; border: 2px dashed #DDD; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <svg viewBox="0 0 24 24" style="width: 48px; fill: #DDD;"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        </div>
        <input id="image-upload-input" type="file" accept="image/*" style="display:none;" />
        <button class="add-btn" onclick="document.getElementById('image-upload-input').click()">Choose image</button>
        <button id="image-add-btn" class="add-btn" style="margin-top: 10px; opacity: 0.5;" disabled onclick="handleSignalAdd('image', pendingImageValue)">Add to World</button>
      </div>
    `;
    const fileInput = document.getElementById('image-upload-input');
    const imageAddBtn = document.getElementById('image-add-btn');
    fileInput?.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target && typeof e.target.result === 'string' ? e.target.result : "";
        if (!result) return;
        pendingImageValue = result;
        imageAddBtn.disabled = false;
        imageAddBtn.style.opacity = "1";
      };
      reader.readAsDataURL(file);
    });
  } else {
    const options = signalOptions[type] || [];
    body.innerHTML = `
      <div class="signal-option-list">
        ${options.map(opt => `<div class="option-item" onclick="handleSignalAdd('${type}', '${opt}')">${opt}</div>`).join('')}
      </div>
    `;
  }
}

function closeSignalModal() {
  document.getElementById('signal-overlay').classList.remove('active');
}

function handleSignalAdd(type, value) {
  const stateKey = type === 'moment' ? 'moments' : type;

  if (type === 'moment') {
    value = document.getElementById('moment-input').value.trim();
    if (!value) return;
  }

  if (type === 'image' && !value) return;

  if (!Array.isArray(signals[stateKey])) signals[stateKey] = [];
  if (signals[stateKey].includes(value)) return;
  signals[stateKey].push(value);
  saveState();


  updateCanvas();
  closeSignalModal();

  // Update badge
  const count = getSignalCount();
  document.getElementById('canvas-count-badge').innerText = `${count} thing${count !== 1 ? 's' : ''} added`;

  // Enable continue
  const continueBtn1 = document.getElementById('step1-continue');
  continueBtn1.classList.remove('disabled');
  continueBtn1.classList.add('active');

  // Hide empty state
  document.getElementById('canvas-empty-state').style.display = 'none';
}

function removeSignal(type, index) {
  if (!Array.isArray(signals[type])) return;
  signals[type].splice(index, 1);
  saveState();
  updateCanvas();
  updateStep1Controls();
}

function updateStep1Controls() {
  const count = getSignalCount();
  const countBadge = document.getElementById('canvas-count-badge');
  const continueBtn1 = document.getElementById('step1-continue');
  const emptyState = document.getElementById('canvas-empty-state');

  if (countBadge) countBadge.innerText = `${count} thing${count !== 1 ? 's' : ''} added`;
  if (emptyState) emptyState.style.display = count > 0 ? 'none' : 'block';
  if (continueBtn1) {
    continueBtn1.classList.toggle('disabled', count === 0);
    continueBtn1.classList.toggle('active', count > 0);
  }
}

function updateCanvas() {
  const container = document.getElementById('canvas-items');
  container.innerHTML = '';

  for (const type of CANVAS_SIGNAL_KEYS) {
    if (!Array.isArray(signals[type])) continue;
    signals[type].forEach((val, idx) => {
      const item = document.createElement('div');
      item.className = `signal-item ${type === 'moments' ? 'bubble' : (type === 'traits' ? 'trait' : (type === 'image' ? 'image-card' : (type === 'rejects' ? 'reject' : '')))}`;

      if (type === 'image') {
        item.innerHTML = `<img src="${val}" alt="Signal"><button class="signal-remove-btn" type="button" aria-label="Remove image">x</button>`;
      } else {
        item.innerHTML = `<span>${val}</span><button class="signal-remove-btn" type="button" aria-label="Remove item">x</button>`;
      }

      const removeBtn = item.querySelector('.signal-remove-btn');
      removeBtn?.addEventListener('click', (event) => {
        event.stopPropagation();
        removeSignal(type, idx);
      });

      container.appendChild(item);
    });
  }
}

function initStep1() {
  updateCanvas();
  updateStep1Controls();
}

window.addEventListener('hashchange', () => {
  if (window.location.hash === '#step1') initStep1();
});

if (window.location.hash === '#step1') {
  initStep1();
}

document.getElementById('step1-continue')?.addEventListener('click', () => {
  if (getSignalCount() > 0) showScreen('step2');
});
