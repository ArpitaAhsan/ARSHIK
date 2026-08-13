const envelopeScreen = document.getElementById('envelopeScreen');
const envelopeStage = document.getElementById('envelopeStage');
const openEnvelope = document.getElementById('openEnvelope');
const music = document.getElementById('music');
const musicControl = document.getElementById('musicControl');
const musicIcon = document.getElementById('musicIcon');
const declineBtn = document.getElementById('declineBtn');
const acceptBtn = document.getElementById('acceptBtn');
const rsvpButtons = document.getElementById('rsvpButtons');
const rsvpSuccess = document.getElementById('rsvpSuccess');

let musicStarted = false;
let opened = false;

function startMusic() {
  if (musicStarted) return;
  music.volume = 0;
  const playPromise = music.play();
  if (playPromise && typeof playPromise.then === 'function') {
    playPromise.then(() => {
      musicStarted = true;
      musicControl.classList.add('visible');
      let v = 0;
      const fade = setInterval(() => {
        v += 0.025;
        music.volume = Math.min(v, 0.48);
        if (v >= 0.48) clearInterval(fade);
      }, 70);
    }).catch(() => {
      // If the browser still blocks audio, the next tap/scroll interaction retries it.
    });
  }
}

function openInvitation() {
  if (opened) return;
  opened = true;
  envelopeStage.classList.add('open');
  startMusic();
  setTimeout(() => envelopeScreen.classList.add('hidden'), 2150);
}

openEnvelope.addEventListener('click', openInvitation);
envelopeStage.addEventListener('click', (e) => {
  if (!opened && e.target !== openEnvelope) openInvitation();
});

musicControl.addEventListener('click', () => {
  if (music.paused) {
    music.play();
    music.volume = 0.48;
    musicIcon.textContent = '♪';
    musicControl.setAttribute('aria-label', 'Mute music');
  } else {
    music.pause();
    musicIcon.textContent = '×';
    musicControl.setAttribute('aria-label', 'Play music');
  }
});

// Keep retrying audio on normal user interactions if a browser deferred playback.
['touchstart', 'scroll', 'pointerdown'].forEach(evt => {
  window.addEventListener(evt, () => {
    if (opened && !musicStarted) startMusic();
  }, { passive: true });
});

// Playful RSVP: the decline button refuses to be pressed.
function dodgeDecline() {
  const parent = rsvpButtons.getBoundingClientRect();
  const button = declineBtn.getBoundingClientRect();
  const maxX = Math.max(18, parent.width - button.width - 18);
  const maxY = Math.max(12, parent.height - button.height - 8);
  const x = Math.random() * maxX - maxX / 2;
  const y = Math.random() * maxY - maxY / 2;
  declineBtn.style.left = `${x}px`;
  declineBtn.style.top = `${y}px`;
  declineBtn.style.transform = `rotate(${(Math.random() * 8 - 4).toFixed(1)}deg)`;
}
['pointerenter', 'pointerdown', 'touchstart', 'focus'].forEach(evt => {
  declineBtn.addEventListener(evt, (e) => {
    e.preventDefault();
    dodgeDecline();
    declineBtn.blur();
  }, { passive: false });
});
declineBtn.addEventListener('click', (e) => { e.preventDefault(); dodgeDecline(); });

acceptBtn.addEventListener('click', () => {
  rsvpButtons.hidden = true;
  rsvpSuccess.hidden = false;
});
