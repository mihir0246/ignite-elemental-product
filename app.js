/* ============================================================
   IGNITE — Seamless Interactive Cinematic Canvas
   Continuous 60FPS Video + Chapter Navigation + Product Modals
   ============================================================ */

const video = document.getElementById('phoenixVideo');
const progressFill = document.getElementById('progressFill');
const heroHotspots = document.getElementById('heroHotspots');
const ringHotspots = document.getElementById('ringHotspots');
const navLinks = document.querySelectorAll('.nav-item-btn');
const modal = document.getElementById('productModal');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalDesc = document.getElementById('modalDesc');
const modalConfirmBtn = document.getElementById('modalConfirmBtn');
const audioToggle = document.getElementById('audioToggle');
const soundOffIcon = document.querySelector('.sound-off');
const soundOnIcon = document.querySelector('.sound-on');

let isAudioPlaying = false;
let audioCtx = null;

/* ────────────────────────────────────────────────────────────
   1. Video Playback & Chapter Management
   ──────────────────────────────────────────────────────────── */
const CHAPTERS = {
  hero: { time: 1.25, name: 'All Crystals' },
  feather: { time: 5.2, name: 'Rubies' },
  ring: { time: 7.8, name: 'Rings' }
};

if (video) {
  video.muted = true;
  video.loop = true;
  video.playbackRate = 1.0;

  // Set initial starting time to the glorious phoenix screen
  const startPlaying = () => {
    video.currentTime = CHAPTERS.hero.time;
    video.play().catch(() => {
      // Autoplay fallback
      document.addEventListener('click', () => video.play(), { once: true });
    });
  };

  if (video.readyState >= 1) {
    startPlaying();
  } else {
    video.addEventListener('loadedmetadata', startPlaying);
  }

  // Update hotspot visibility and progress based on video time
  video.addEventListener('timeupdate', () => {
    const t = video.currentTime;
    const duration = video.duration || 10.08;

    if (progressFill) {
      progressFill.style.width = `${(t / duration) * 100}%`;
    }

    // Toggle hotspots between Hero and Ring sections
    if (t < 5.0) {
      heroHotspots.style.opacity = '1';
      heroHotspots.style.pointerEvents = 'auto';
      ringHotspots.classList.remove('active');
      setActiveNav(0);
    } else if (t >= 5.0 && t < 7.2) {
      heroHotspots.style.opacity = '0';
      heroHotspots.style.pointerEvents = 'none';
      ringHotspots.classList.remove('active');
      setActiveNav(1);
    } else {
      heroHotspots.style.opacity = '0';
      heroHotspots.style.pointerEvents = 'none';
      ringHotspots.classList.add('active');
      setActiveNav(3);
    }
  });
}

function setActiveNav(index) {
  navLinks.forEach((link, i) => {
    link.classList.toggle('active', i === index);
  });
}

/* ────────────────────────────────────────────────────────────
   2. Chapter Navigation (Click to Jump Chapters)
   ──────────────────────────────────────────────────────────── */
navLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const progress = parseFloat(link.dataset.progress || 0);
    if (video && video.duration) {
      if (progress === 0) {
        video.currentTime = CHAPTERS.hero.time;
      } else if (progress < 0.6) {
        video.currentTime = CHAPTERS.feather.time;
      } else {
        video.currentTime = CHAPTERS.ring.time;
      }
      video.play();
    }
  });
});

const scrollDownBtn = document.getElementById('scrollDownBtn');
if (scrollDownBtn) {
  scrollDownBtn.addEventListener('click', () => {
    if (video) {
      video.currentTime = CHAPTERS.feather.time;
      video.play();
    }
  });
}

// Wheel navigation: Scrolling jumps or scrubs smoothly between chapters
let isScrolling = false;
window.addEventListener('wheel', (e) => {
  if (isScrolling || !video) return;
  isScrolling = true;

  if (e.deltaY > 30) {
    // Scroll down: advance to next chapter
    if (video.currentTime < 4.8) {
      video.currentTime = CHAPTERS.feather.time;
    } else if (video.currentTime < 7.2) {
      video.currentTime = CHAPTERS.ring.time;
    }
  } else if (e.deltaY < -30) {
    // Scroll up: back to previous chapter
    if (video.currentTime > 7.2) {
      video.currentTime = CHAPTERS.feather.time;
    } else if (video.currentTime > 4.8) {
      video.currentTime = CHAPTERS.hero.time;
    }
  }

  setTimeout(() => { isScrolling = false; }, 600);
}, { passive: true });

/* ────────────────────────────────────────────────────────────
   3. Interactive Product Modal
   ──────────────────────────────────────────────────────────── */
const products = {
  flameBlaze: {
    title: 'Flame Blaze Ring',
    desc: 'Forged in 18K sculpted rose gold with a core Mandarin flame garnet, accented by brilliant-cut diamond contours mirroring eternal heat.',
  },
  emberCrown: {
    title: 'Ember Crown Ring',
    desc: 'An architectural marquise ruby suspended in warm gold prongs, engineered with precision caustics that catch ambient light.',
  },
  general: {
    title: 'Reserve Exclusive Allocation',
    desc: 'Enter the Phoenix collectors ledger. Each numbered creation is forged on demand in our atelier and registered on physical provenance card.',
  },
};

function openProductModal(type) {
  const item = products[type] || products.general;
  modalTitle.textContent = item.title;
  modalDesc.textContent = item.desc;
  modal.showModal();
}

// Card triggers
const cardFlame = document.getElementById('cardFlameBlaze');
if (cardFlame) cardFlame.addEventListener('click', () => openProductModal('flameBlaze'));

const cardEmber = document.getElementById('cardEmberCrown');
if (cardEmber) cardEmber.addEventListener('click', () => openProductModal('emberCrown'));

// Preorder triggers
document.querySelectorAll('.preorder-trigger').forEach((btn) => {
  btn.addEventListener('click', () => openProductModal('general'));
});

// Editorial Badges
document.querySelectorAll('.badge-hitbox').forEach((badge) => {
  badge.addEventListener('click', () => {
    const idx = badge.dataset.index;
    modalTitle.textContent = `Atelier Lookbook #${idx}`;
    modalDesc.textContent = `High-jewelry editorial demonstration capturing the organic light refraction of our fire-shaped gemstone creations.`;
    modal.showModal();
  });
});

// Modal close
if (modalClose) {
  modalClose.addEventListener('click', () => modal.close());
}

modal.addEventListener('click', (e) => {
  if (e.target === modal) modal.close();
});

if (modalConfirmBtn) {
  modalConfirmBtn.addEventListener('click', () => {
    modalConfirmBtn.textContent = 'ALLOCATION CONFIRMED ✓';
    modalConfirmBtn.style.background = '#27ae60';
    setTimeout(() => {
      modal.close();
      modalConfirmBtn.textContent = 'RESERVE ALLOCATION';
      modalConfirmBtn.style.background = '';
    }, 1200);
  });
}

/* ────────────────────────────────────────────────────────────
   4. Atmospheric Audio (Web Audio API)
   ──────────────────────────────────────────────────────────── */
function createFlameAmbiance() {
  if (audioCtx) return;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.96900 * b2 + white * 0.1538520;
    b3 = 0.86650 * b3 + white * 0.3104856;
    b4 = 0.55000 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.0168980;
    output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
    b6 = white * 0.115926;
  }

  const whiteNoise = audioCtx.createBufferSource();
  whiteNoise.buffer = noiseBuffer;
  whiteNoise.loop = true;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(320, audioCtx.currentTime);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);

  whiteNoise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  whiteNoise.start(0);
}

if (audioToggle) {
  audioToggle.addEventListener('click', () => {
    if (!audioCtx) {
      createFlameAmbiance();
      isAudioPlaying = true;
      soundOffIcon.style.display = 'none';
      soundOnIcon.style.display = 'block';
    } else if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      isAudioPlaying = true;
      soundOffIcon.style.display = 'none';
      soundOnIcon.style.display = 'block';
    } else {
      audioCtx.suspend();
      isAudioPlaying = false;
      soundOffIcon.style.display = 'block';
      soundOnIcon.style.display = 'none';
    }
  });
}
