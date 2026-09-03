// Background Stars Initialization
function createStars() {
  const container = document.getElementById('stars');
  if (!container) return;

  container.innerHTML = '';
  const count = 100;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    star.style.left = `${Math.random() * 100}%`;
    star.style.top = `${Math.random() * 100}%`;
    
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    star.style.animationDelay = `${Math.random() * 2}s`;

    container.appendChild(star);
  }
}

// Countdown & Target Date Config
const TARGET_DATE = new Date('2026-05-07T00:00:00').getTime();
const CHORUS_START_TIME = 42; // Chorus start time in seconds

let isAudioPlaying = false;

function getAudioElement() {
  return document.getElementById('birthdayMusic');
}

// Modal Play Button Click Handler
function enableAudio(shouldPlay) {
  const modal = document.getElementById('audioModal');
  if (modal) {
    modal.style.display = 'none';
  }

  if (shouldPlay) {
    playMusic();
  }
}

// Play Music from Beginning
function playMusic() {
  const audio = getAudioElement();
  if (!audio) return;

  audio.play().then(() => {
    isAudioPlaying = true;
    updateMusicIcon(true);
  }).catch((err) => {
    console.warn('Autoplay prevented by browser policy:', err);
    isAudioPlaying = false;
    updateMusicIcon(false);
  });
}

// Jump to Chorus and Play (Triggered on Countdown Finish)
function playChorus() {
  const audio = getAudioElement();
  if (!audio) return;

  // Jump directly to chorus start timestamp
  audio.currentTime = CHORUS_START_TIME;
  
  audio.play().then(() => {
    isAudioPlaying = true;
    updateMusicIcon(true);
  }).catch((err) => {
    console.warn('Playback blocked. User interaction required:', err);
    // Show modal if playback was blocked by browser
    const modal = document.getElementById('audioModal');
    if (modal) modal.style.display = 'flex';
  });
}

// Toggle Audio Play / Pause
function toggleAudio() {
  const audio = getAudioElement();
  if (!audio) return;

  if (isAudioPlaying && !audio.paused) {
    audio.pause();
    isAudioPlaying = false;
    updateMusicIcon(false);
  } else {
    audio.play().then(() => {
      isAudioPlaying = true;
      updateMusicIcon(true);
    }).catch(console.error);
  }
}

function updateMusicIcon(playing) {
  const icon = document.getElementById('musicIcon');
  if (icon) {
    icon.textContent = playing ? '🔊' : '🎵';
  }
}

// Countdown Timer Engine
function updateCountdown() {
  const daysEl = document.getElementById('cd-days');
  const hoursEl = document.getElementById('cd-hours');
  const minsEl = document.getElementById('cd-mins');
  const secsEl = document.getElementById('cd-secs');

  if (!daysEl) return;

  const now = new Date().getTime();
  const diff = TARGET_DATE - now;

  if (diff <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minsEl.textContent = '00';
    secsEl.textContent = '00';

    // Reveal main birthday section & trigger chorus
    const countdownScreen = document.getElementById('countdownScreen');
    const birthdayReveal = document.getElementById('birthdayReveal');

    if (countdownScreen && birthdayReveal) {
      countdownScreen.classList.add('hidden');
      birthdayReveal.classList.remove('hidden');
    }

    playChorus();
    return;
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / 1000 / 60) % 60);
  const secs = Math.floor((diff / 1000) % 60);

  daysEl.textContent = String(days).padStart(2, '0');
  hoursEl.textContent = String(hours).padStart(2, '0');
  minsEl.textContent = String(mins).padStart(2, '0');
  secsEl.textContent = String(secs).padStart(2, '0');
}

// Initialize Page Features
document.addEventListener('DOMContentLoaded', () => {
  createStars();

  if (document.getElementById('cd-days')) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }
});