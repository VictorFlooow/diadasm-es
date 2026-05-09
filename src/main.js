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

  if (!key) { showScene('error'); return; }

  let videoMap;
  try {
    const res = await fetch('src/videos.json');
    if (!res.ok) throw new Error();
    videoMap = await res.json();
  } catch {
    showScene('error');
    return;
  }

  if (!videoMap[key]) {
    showScene('error');
    return;
  }

  const player = document.getElementById('video-player');
  player.src = `videos/${encodeURIComponent(videoMap[key])}`;
  player.load();

  showScene('video');
  spawnSparkles();
  observeMessageLines();
})();

/* ── Troca de cenas ─────────────────────────────────────────────────────── */
function showScene(name) {
  ['loading', 'video', 'error'].forEach(id => {
    const el = document.getElementById(`scene-${id}`);
    if (id === name) el.removeAttribute('hidden');
    else el.setAttribute('hidden', '');
  });
}

/* ── Sparkles (estrelinhas de fundo) ───────────────────────────────────── */
function spawnSparkles() {
  const container = document.getElementById('starfield');
  const glyphs = ['✦', '✦', '·', '·', '✧', '·'];

  for (let i = 0; i < 28; i++) {
    const star = document.createElement('span');
    star.className = 'sparkle';
    star.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    star.setAttribute('aria-hidden', 'true');

    const size  = Math.random() * 7 + 5;
    const left  = Math.random() * 100;
    const top   = Math.random() * 100;
    const delay = Math.random() * 5;
    const dur   = Math.random() * 4 + 3;

    star.style.cssText = `
      left: ${left}%;
      top: ${top}%;
      font-size: ${size}px;
      animation-delay: ${delay}s;
      animation-duration: ${dur}s;
    `;
    container.appendChild(star);
  }
}

/* ── Reveal das linhas da mensagem ─────────────────────────────────────── */
function observeMessageLines() {
  const lines = document.querySelectorAll('.msg-line, .msg-sig');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  lines.forEach(line => observer.observe(line));
}
