// ── Step 1 Logic ────────────────────────────────
const CANVAS_SIGNAL_KEYS = ['traits', 'moments', 'them', 'spending', 'preferences', 'event', 'rejects', 'image'];
let pendingImageValue = "";

function getSignalCount() {
  return CANVAS_SIGNAL_KEYS.reduce((acc, key) => {
    const arr = signals[key];
    return acc + (Array.isArray(arr) ? arr.length : 0);
  }, 0);
}


const signalOptions = {
  traits: ["Introvert", "Creative", "Minimalist", "Techie", "Outdoorsy", "Sentimental", "Humorous", "Practical"],
  them: ["Coffee ☕", "Traveling ✈️", "Music 🎧", "Reading 📚", "Fitness 🏋️"],
  event: ["New Job", "Just Moved", "First Anniversary", "Promotion", "Graduation"],
  spending: ["Saves money", "Splurges on experiences", "Buys useful things", "Loves premium stuff"],
  preferences: ["Are useful", "Feel emotional", "Are aesthetic", "Are experiences"],
  rejects: [
    "Flowers aren’t their thing",
    "💌 Not into generic cards",
    "♻️ Prefers sustainable choices",
    "🍳 Doesn’t enjoy cooking",
    "🎨 Prefers subtle colors"
  ]
};

function openSignalModal(type) {
  const overlay = document.getElementById('signal-overlay');
  const title = document.getElementById('overlay-title');
  const body = document.getElementById('overlay-body');

  document.querySelectorAll('.toolbar-btn').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.querySelector(`.toolbar-btn[onclick*="${type}"]`);
  if (activeBtn) activeBtn.classList.add('active');

  overlay.classList.add('active');
  const modalTitles = {
    them: "They enjoy",
    spending: "How they spend",
    preferences: "They prefer gifts that…",
    rejects: "Not their vibe"
  };
  title.innerText = modalTitles[type] || `Add ${type.charAt(0).toUpperCase() + type.slice(1)}`;

  if (type === 'moment') {
    body.innerHTML = `
      <div class="input-group">
        <label>A meaningful message from chat or life</label>
        <textarea id="moment-input" placeholder="e.g. 'I miss our long walks in the park...'"></textarea>
      </div>
      <div class="overlay-footer">
        <button id="moment-add-btn" class="add-btn">Add to World</button>
      </div>
    `;
    const momentAddBtn = document.getElementById('moment-add-btn');
    momentAddBtn?.addEventListener('click', () => handleSignalAdd('moment'));
  } else if (type === 'image') {
    pendingImageValue = "";
    body.innerHTML = `
      <div class="input-group" style="text-align: center; padding: 20px;">
        <div class="image-upload-description" style="text-align: left; margin-bottom: 20px;">
          <h4 style="margin: 0 0 8px 0; color: #444; font-size: 1.1rem;">A Glimpse Into Their World</h4>
          <p style="margin: 0 0 4px 0; color: #666; font-size: 0.9rem;">Room / desk / recent photo</p>
          <p style="margin: 0 0 12px 0; color: #666; font-size: 0.9rem;">Something they own or use daily</p>
          <div style="background: rgba(183, 110, 48, 0.1); padding: 10px; border-radius: 8px; border-left: 4px solid #b76e30;">
             <p style="margin: 0; color: #b76e30; font-size: 0.9rem; font-weight: 500;">
               👉 Insight: lifestyle, taste, habits
             </p>
          </div>
        </div>
        <div id="image-upload-dropzone" style="width: 100%; height: 160px; border: 2px dashed #DDD; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; cursor: pointer; transition: all 0.3s ease; position: relative; overflow: hidden;">
          <div id="image-placeholder-content" style="text-align: center;">
            <svg viewBox="0 0 24 24" style="width: 48px; fill: #DDD;"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
            <p style="margin: 8px 0 0 0; color: #999; font-size: 0.85rem;">Click to upload</p>
          </div>
          <img id="image-preview" style="display: none; width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <input id="image-upload-input" type="file" accept="image/*" style="display:none;" />
        <button id="image-choose-btn" class="add-btn">Choose image</button>
        <button id="image-add-btn" class="add-btn" style="margin-top: 10px; opacity: 0.5;" disabled>Add to World</button>
      </div>
    `;
    const fileInput = document.getElementById('image-upload-input');
    const chooseImageBtn = document.getElementById('image-choose-btn');
    const imageAddBtn = document.getElementById('image-add-btn');
    const dropzone = document.getElementById('image-upload-dropzone');
    const preview = document.getElementById('image-preview');
    const placeholderContent = document.getElementById('image-placeholder-content');

    chooseImageBtn?.addEventListener('click', () => fileInput?.click());
    dropzone?.addEventListener('click', () => fileInput?.click());

    fileInput?.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target && typeof e.target.result === 'string' ? e.target.result : "";
        if (!result) return;
        pendingImageValue = result;

        // Show preview
        if (preview && placeholderContent) {
          preview.src = result;
          preview.style.display = 'block';
          placeholderContent.style.display = 'none';
          dropzone.style.border = '2px solid #b76e30';
        }

        imageAddBtn.disabled = false;
        imageAddBtn.style.opacity = "1";
      };
      reader.readAsDataURL(file);
    });
    imageAddBtn?.addEventListener('click', () => handleSignalAdd('image', pendingImageValue));
  } else {
    const options = signalOptions[type] || [];
    body.innerHTML = `
      <div class="signal-option-list">
        ${options.map(opt => `<div class="option-item" data-value="${opt.replace(/"/g, '&quot;')}">${opt}</div>`).join('')}
        ${(type === 'them' || type === 'preferences') ? `
          <div class="input-group" style="margin-top: 16px;">
            <label>${type === 'preferences' ? 'Others' : 'Other'}</label>
            <div style="display: flex; gap: 8px;">
              <input type="text" id="${type}-other-input" class="custom-input" placeholder="${type === 'preferences' ? '-------' : 'e.g. Cooking, Gaming'}" style="flex: 1; border: 1px solid #DDD; padding: 10px; border-radius: 8px;" />
              <button id="${type}-other-add-btn" class="add-btn" style="width: auto; padding: 10px 20px;">Add</button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
    body.querySelectorAll('.option-item').forEach((item) => {
      item.addEventListener('click', () => {
        const value = item.getAttribute('data-value') || "";
        handleSignalAdd(type, value);
      });
    });

    if (type === 'them' || type === 'preferences') {
      const otherInput = document.getElementById(`${type}-other-input`);
      const otherAddBtn = document.getElementById(`${type}-other-add-btn`);
      otherAddBtn?.addEventListener('click', () => {
        const val = otherInput.value.trim();
        if (val) handleSignalAdd(type, val);
      });
      otherInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          const val = otherInput.value.trim();
          if (val) handleSignalAdd(type, val);
        }
      });
    }
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
  // Try to save, but proceed even if it fails (e.g. storage limit exceeded)
  try {
    saveState();
  } catch (err) {
    console.warn("Failed to save state to localStorage:", err);
    if (type === 'image') {
      alert("Note: This image is quite large and won't be saved for your next session, but you can use it now.");
    }
  }

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

window.openSignalModal = openSignalModal;
window.closeSignalModal = closeSignalModal;

document.getElementById('step1-continue')?.addEventListener('click', () => {
  if (getSignalCount() > 0) showScreen('step2');
});
