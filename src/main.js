/**
 * Main logic:
 * 1. Reads ?v= from URL
 * 2. Fetches src/videos.json
 * 3. If key found → loads video from /videos/
 * 4. If not → shows error scene
 */

(async () => {
  const params = new URLSearchParams(window.location.search);
  const key = params.get('v')?.trim().toLowerCase();

  // No key at all → error
  if (!key) {
    showScene('error');
    return;
  }

  // Fetch video map
  let videoMap;
  try {
    const res = await fetch('src/videos.json');
    if (!res.ok) throw new Error('JSON not found');
    videoMap = await res.json();
  } catch {
    showScene('error');
    return;
  }

  // Key not in map → error
  if (!videoMap[key]) {
    showScene('error');
    return;
  }

  // Load video
  const filename = videoMap[key];
  const player = document.getElementById('video-player');
  player.src = `videos/${encodeURIComponent(filename)}`;
  player.load();

  showScene('video');
  spawnPetals();
  observeMessageLines();
})();

// ── Scene switching ──────────────────────────────────────────────────────────
function showScene(name) {
  ['loading', 'video', 'error'].forEach(id => {
    const el = document.getElementById(`scene-${id}`);
    if (id === name) el.removeAttribute('hidden');
    else el.setAttribute('hidden', '');
  });
}

// ── Pétalas animadas ─────────────────────────────────────────────────────────
function spawnPetals() {
  const container = document.getElementById('petals');
  const emojis = ['🌸', '🌺', '🌷', '💮', '🌸', '🌸'];

  for (let i = 0; i < 18; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    petal.setAttribute('aria-hidden', 'true');

    const size   = Math.random() * 14 + 10;
    const left   = Math.random() * 100;
    const delay  = Math.random() * 10;
    const dur    = Math.random() * 6 + 7;

    petal.style.cssText = `
      left: ${left}%;
      font-size: ${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    `;
    container.appendChild(petal);
  }
}

// ── Reveal das linhas da mensagem ────────────────────────────────────────────
function observeMessageLines() {
  const lines = document.querySelectorAll('.msg-line');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  lines.forEach(line => observer.observe(line));
}
