const envelopeScreen = document.getElementById('envelopeScreen');
const envelopeStage = document.getElementById('envelopeStage');
const afStamp = document.getElementById('afStamp');
const music = document.getElementById('music');
const musicControl = document.getElementById('musicControl');
const musicIcon = document.getElementById('musicIcon');
const declineBtn = document.getElementById('declineBtn');
const acceptBtn = document.getElementById('acceptBtn');
const rsvpButtons = document.getElementById('rsvpButtons');
const rsvpSuccess = document.getElementById('rsvpSuccess');

let musicStarted = false;
let opened = false;
let declineHoverCount = 0;
let isAnimating = false;

const teaseEl = document.createElement('div');
teaseEl.className = 'decline-tease';
teaseEl.textContent = '💕 Come on! Say YES!';
declineBtn.parentNode.insertBefore(teaseEl, declineBtn.nextSibling);

function startMusic() {
    if (musicStarted) return;
    music.volume = 0;
    const playPromise = music.play();
    if (playPromise && typeof playPromise.then === 'function') {
        playPromise.then(() => {
            musicStarted = true;
            musicControl.classList.add('visible');
            let volume = 0;
            const fade = setInterval(() => {
                volume += 0.025;
                music.volume = Math.min(volume, 0.48);
                if (volume >= 0.48) clearInterval(fade);
            }, 70);
        }).catch(() => {});
    }
}

function openInvitation() {
    if (opened) return;
    opened = true;
    envelopeStage.classList.add('open');
    startMusic();
    setTimeout(() => {
        envelopeScreen.classList.add('hidden');
    }, 800);
}

afStamp.addEventListener('click', openInvitation);
afStamp.addEventListener('touchstart', (e) => {
    e.preventDefault();
    openInvitation();
}, { passive: false });

envelopeStage.addEventListener('click', (e) => {
    if (!opened && e.target === envelopeStage) openInvitation();
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

['touchstart', 'scroll', 'pointerdown'].forEach((eventName) => {
    window.addEventListener(eventName, () => {
        if (opened && !musicStarted) startMusic();
    }, { passive: true });
});

document.addEventListener('mousemove', (event) => {
    if (rsvpButtons.hidden) return;
    const rect = declineBtn.getBoundingClientRect();
    const buttonCenterX = rect.left + rect.width / 2;
    const buttonCenterY = rect.top + rect.height / 2;
    const dx = event.clientX - buttonCenterX;
    const dy = event.clientY - buttonCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 200) {
        const strength = Math.max(0, 1 - (distance / 200));
        const maxOffset = 15;
        const angle = Math.atan2(dy, dx);
        const offsetX = Math.cos(angle) * maxOffset * strength;
        const offsetY = Math.sin(angle) * maxOffset * strength;
        declineBtn.style.transform = `translate(${offsetX}px, ${offsetY}px) rotate(${offsetX * 0.05}deg)`;
        declineBtn.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
        declineBtn.classList.add('attracted');
        declineBtn.classList.remove('idle');
        if (distance < 100 && declineHoverCount < 3) {
            teaseEl.textContent = '😊 Trying to click me?';
            teaseEl.style.opacity = '0.8';
        } else if (distance < 100 && declineHoverCount < 6) {
            teaseEl.textContent = '😄 Nope! Say YES instead!';
            teaseEl.style.opacity = '0.8';
        } else if (distance < 100 && declineHoverCount < 10) {
            teaseEl.textContent = '😂 You\'re persistent!';
            teaseEl.style.opacity = '0.8';
        }
    } else {
        declineBtn.style.transform = 'translate(0px, 0px) rotate(0deg)';
        declineBtn.classList.remove('attracted');
        declineBtn.classList.add('idle');
        teaseEl.style.opacity = '0';
    }
});

function gentleDodge() {
    if (isAnimating) return;
    isAnimating = true;
    declineHoverCount++;
    const direction = Math.random() > 0.5 ? 1 : -1;
    const dodgeX = direction * (15 + Math.random() * 15);
    const dodgeY = (Math.random() - 0.5) * 30;
    declineBtn.classList.remove('dodging');
    void declineBtn.offsetWidth;
    declineBtn.classList.add('dodging');
    declineBtn.style.transform = `translate(${dodgeX}px, ${dodgeY}px) rotate(${dodgeX * 0.08}deg)`;
    declineBtn.style.transition = 'transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)';
    
    const smallText = declineBtn.querySelector('small');
    const messages = [
        '🎯 You can\'t catch me!',
        '😄 Nope! Not today!',
        '😂 Keep trying!',
        '✨ Almost there... not!',
        '🤭 You\'re so persistent!',
        '💖 Just say YES already!',
        '😘 I\'m too fast for you!',
        '🎊 Give up and click ACCEPT!'
    ];
    const msgIndex = Math.min(declineHoverCount - 1, messages.length - 1);
    const currentMsg = messages[msgIndex] || messages[messages.length - 1];
    
    if (smallText) {
        smallText.textContent = currentMsg;
        smallText.style.opacity = '1';
        smallText.style.color = '#a88b58';
        smallText.style.fontSize = '0.7rem';
        smallText.style.transition = 'all 0.6s ease';
    }
    teaseEl.textContent = currentMsg;
    teaseEl.style.opacity = '0.9';
    
    setTimeout(() => {
        isAnimating = false;
        setTimeout(() => {
            if (!declineBtn.matches(':hover')) {
                declineBtn.style.transform = 'translate(0px, 0px) rotate(0deg)';
                declineBtn.classList.remove('dodging');
                declineBtn.classList.add('idle');
                teaseEl.style.opacity = '0';
            }
        }, 1500);
    }, 800);
}

['pointerdown', 'touchstart', 'click'].forEach((eventName) => {
    declineBtn.addEventListener(eventName, (event) => {
        event.preventDefault();
        event.stopPropagation();
        gentleDodge();
        declineBtn.blur();
    }, { passive: false });
});

let idleInterval = setInterval(() => {
    if (!declineBtn.classList.contains('attracted') && 
        !declineBtn.classList.contains('dodging') && 
        !isAnimating) {
        declineBtn.classList.add('idle');
    }
}, 3000);

acceptBtn.addEventListener('click', () => {
    rsvpButtons.hidden = true;
    rsvpSuccess.hidden = false;
    clearInterval(idleInterval);
});

// ===============================
// SCROLL TO NEXT PAGE
// ===============================

function scrollToNextPage(button) {
  // Find the parent .page section
  const currentPage = button.closest('.page');
  
  // Find the next .page element after the current one
  let nextPage = currentPage.nextElementSibling;
  
  // Skip any non-page elements (text nodes, comments, etc.)
  while (nextPage && !nextPage.classList.contains('page')) {
    nextPage = nextPage.nextElementSibling;
  }
  
  // If there's a next page, scroll to it
  if (nextPage) {
    nextPage.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}