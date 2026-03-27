// ── Step 1 Logic ────────────────────────────────
function getSignalCount() {
  return Object.values(signals).reduce((acc, curr) => acc + (Array.isArray(curr) ? curr.length : 0), 0);
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
    body.innerHTML = `
      <div class="input-group" style="text-align: center; padding: 20px;">
        <div style="width: 100%; height: 120px; border: 2px dashed #DDD; border-radius: 16px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px;">
          <svg viewBox="0 0 24 24" style="width: 48px; fill: #DDD;"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        </div>
        <button class="add-btn" onclick="handleSignalAdd('image', 'assets/hero.png')">Simulate Upload</button>
      </div>
    `;
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

  if (!Array.isArray(signals[stateKey])) signals[stateKey] = [];
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

function updateCanvas() {
  const container = document.getElementById('canvas-items');
  container.innerHTML = '';

  // Simple logic to place items on canvas
  for (const type in signals) {
    if (!Array.isArray(signals[type])) continue;
    signals[type].forEach(val => {
      const item = document.createElement('div');
      item.className = `signal-item ${type === 'moments' ? 'bubble' : (type === 'traits' ? 'trait' : (type === 'image' ? 'image-card' : (type === 'rejects' ? 'reject' : '')))}`;

      if (type === 'image') {
        item.innerHTML = `<img src="${val}" alt="Signal">`;
      } else {
        item.innerText = val;
      }

      // Randomize position slightly
      item.style.position = 'absolute';
      item.style.left = `${10 + (Math.random() * 60)}%`;
      item.style.top = `${15 + (Math.random() * 60)}%`;
      item.style.transform = `rotate(${(Math.random() * 20) - 10}deg)`;

      container.appendChild(item);
    });
  }
}

document.getElementById('step1-continue')?.addEventListener('click', () => {
  showScreen('step2');
});
