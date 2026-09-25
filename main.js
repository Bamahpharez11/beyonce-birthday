import './style.css'

// 1. Particle Background Animation
const canvas = document.getElementById('particles-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particlesArray = [];
const numberOfParticles = 80; // Adjust for density

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 1 - 0.5;
    this.speedY = Math.random() * 1 - 0.5;
    this.color = Math.random() > 0.5 ? 'rgba(212, 175, 55, 0.4)' : 'rgba(232, 180, 184, 0.4)';
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.005;
    
    // Bounce off edges
    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
  }
  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function init() {
  for (let i = 0; i < numberOfParticles; i++) {
    particlesArray.push(new Particle());
  }
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update();
    particlesArray[i].draw();
  }
  requestAnimationFrame(animate);
}
init();
animate();

window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particlesArray = [];
  init();
});

// 2. Typing Effect
const textToType = "Happy Birthday, Beyonce!";
const typingElement = document.getElementById('typing-text');
let typingIndex = 0;

function typeWriter() {
  if (typingIndex < textToType.length) {
    typingElement.innerHTML += textToType.charAt(typingIndex);
    typingIndex++;
    setTimeout(typeWriter, 120); // Typing speed
  } else {
    // Show hidden elements after typing finishes
    document.querySelectorAll('.hero .hidden').forEach(el => el.classList.add('show'));
  }
}

// Start typing when page loads
window.onload = () => {
  setTimeout(typeWriter, 500);
}


// 3. Intersection Observer for Scroll Animations
const observerOptions = {
  root: null,
  rootMargin: '0px',
  threshold: 0.1
};

const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('show');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));


// 4. Lightbox Modal Logic
const modal = document.getElementById('lightbox-modal');
const modalContent = document.getElementById('modal-content');
const closeModal = document.getElementById('close-modal');

let allMediaItems = []; // Store all asset info for prev/next navigation
let currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  renderModalMedia(index);
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function renderModalMedia(index) {
  modalContent.innerHTML = '';
  const { src, isVideo } = allMediaItems[index];

  // Navigation arrows
  const prevBtn = document.createElement('button');
  prevBtn.className = 'nav-btn prev-btn';
  prevBtn.innerHTML = '&#8249;';
  prevBtn.onclick = (e) => { e.stopPropagation(); navigate(-1); };

  const nextBtn = document.createElement('button');
  nextBtn.className = 'nav-btn next-btn';
  nextBtn.innerHTML = '&#8250;';
  nextBtn.onclick = (e) => { e.stopPropagation(); navigate(1); };

  if (isVideo) {
    const video = document.createElement('video');
    video.src = src;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    video.style.maxWidth = '90vw';
    video.style.maxHeight = '85vh';
    modalContent.appendChild(prevBtn);
    modalContent.appendChild(video);
    modalContent.appendChild(nextBtn);
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Beyonce memory';
    modalContent.appendChild(prevBtn);
    modalContent.appendChild(img);
    modalContent.appendChild(nextBtn);
  }

  // Counter
  const counter = document.createElement('div');
  counter.className = 'modal-counter';
  counter.textContent = `${index + 1} / ${allMediaItems.length}`;
  modalContent.appendChild(counter);
}

function navigate(dir) {
  currentIndex = (currentIndex + dir + allMediaItems.length) % allMediaItems.length;
  renderModalMedia(currentIndex);
}

function closeLightbox() {
  modal.classList.remove('active');
  document.body.style.overflow = '';
  modalContent.innerHTML = '';
}

closeModal.addEventListener('click', closeLightbox);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (!modal.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') navigate(1);
  if (e.key === 'ArrowLeft') navigate(-1);
});


// 5. Populate Gallery
const assets = [
  "(12).JPEG",
  "0B28C981-7175-4756-969B-F155178FF90E.MOV",
  "59FE3140-9A08-43AC-A01A-E46CE01D836A.jpeg",
  "9638C49E-B4F1-4630-B597-D479F3245FAC.MOV",
  "D602BBA0-CF70-4FA2-952B-D7C63E3E60DE.MOV",
  "DSC00108.jpeg",
  "FD902286-B1C6-4F32-854C-9BFA2C6CBB3A.MOV",
  "Facetune88DAD31A-08EA-4F12-9E33-7CABCBA092DD.MOV",
  "IMG_1241.jpeg",
  "IMG_1277.JPG",
  "IMG_1278.JPG",
  "IMG_1446.JPG",
  "IMG_1465.jpeg",
  "IMG_1473.PNG",
  "IMG_1684.jpeg",
  "IMG_2067.jpeg",
  "IMG_2242.jpeg",
  "IMG_4569.MOV",
  "IMG_5207.JPG",
  "IMG_5210.JPG",
  "IMG_6803.jpeg",
  "IMG_7579.JPG",
  "IMG_8072.JPG",
  "IMG_9381.JPG",
  "IMG_9484.JPG",
  "IMG_9740.jpeg",
  "RPReplay_Final1612534938.mov",
  "cm-chat-media-video-1:f382dc0a-ac8f-509a-8e56-c4eb41193d29:9121:0:0.mov"
];

const galleryContainer = document.getElementById('gallery-container');

assets.forEach((asset, index) => {
  const isVideo = asset.toLowerCase().endsWith('.mov') || asset.toLowerCase().endsWith('.mp4');
  const src = `/assets/${encodeURI(asset)}`;

  allMediaItems.push({ src, isVideo });

  const item = document.createElement('div');
  item.classList.add('gallery-item', 'fade-in', 'hidden');
  item.title = 'Click to view';

  if (isVideo) {
    const video = document.createElement('video');
    video.src = src;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    item.appendChild(video);
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = 'Beautiful memory';
    item.appendChild(img);
  }

  // Click to open lightbox
  item.addEventListener('click', () => openLightbox(index));

  galleryContainer.appendChild(item);
  observer.observe(item);
});


// ============================================================
// SPECIAL EFFECTS
// ============================================================

// --- A. Cursor Sparkle Trail ---
const sparkleCanvas = document.getElementById('sparkle-canvas');
const sCtx = sparkleCanvas.getContext('2d');
sparkleCanvas.width = window.innerWidth;
sparkleCanvas.height = window.innerHeight;
sparkleCanvas.classList.add('active');

let sparkles = [];
window.addEventListener('mousemove', (e) => {
  for (let i = 0; i < 3; i++) {
    sparkles.push({
      x: e.clientX + (Math.random() - 0.5) * 20,
      y: e.clientY + (Math.random() - 0.5) * 20,
      size: Math.random() * 6 + 2,
      alpha: 1,
      color: Math.random() > 0.5 ? '#d4af37' : '#e8b4b8',
      vx: (Math.random() - 0.5) * 2,
      vy: -(Math.random() * 2 + 1),
    });
  }
});

function animateSparkles() {
  sCtx.clearRect(0, 0, sparkleCanvas.width, sparkleCanvas.height);
  sparkles = sparkles.filter(s => s.alpha > 0.01);
  sparkles.forEach(s => {
    s.x += s.vx;
    s.y += s.vy;
    s.alpha -= 0.04;
    s.size *= 0.95;
    sCtx.save();
    sCtx.globalAlpha = s.alpha;
    sCtx.fillStyle = s.color;
    sCtx.shadowBlur = 8;
    sCtx.shadowColor = s.color;
    sCtx.beginPath();
    // Draw a little star
    for (let i = 0; i < 5; i++) {
      const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
      const r = i % 2 === 0 ? s.size : s.size / 2;
      i === 0 ? sCtx.moveTo(s.x + r * Math.cos(angle), s.y + r * Math.sin(angle))
              : sCtx.lineTo(s.x + r * Math.cos(angle), s.y + r * Math.sin(angle));
    }
    sCtx.closePath();
    sCtx.fill();
    sCtx.restore();
  });
  requestAnimationFrame(animateSparkles);
}
animateSparkles();

window.addEventListener('resize', () => {
  sparkleCanvas.width = window.innerWidth;
  sparkleCanvas.height = window.innerHeight;
});


// --- B. Confetti Explosion ---
function launchConfetti() {
  const colors = ['#d4af37', '#e8b4b8', '#ff8fab', '#fff', '#c084fc', '#67e8f9'];
  for (let i = 0; i < 160; i++) {
    const confetti = document.createElement('div');
    confetti.style.cssText = `
      position: fixed;
      width: ${Math.random() * 10 + 6}px;
      height: ${Math.random() * 6 + 4}px;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      left: ${Math.random() * 100}vw;
      top: -10px;
      border-radius: 2px;
      z-index: 99999;
      pointer-events: none;
      opacity: 1;
      transform: rotate(${Math.random() * 360}deg);
    `;
    document.body.appendChild(confetti);
    const duration = Math.random() * 2000 + 1500;
    const xDrift = (Math.random() - 0.5) * 300;
    confetti.animate([
      { transform: `translateY(0) translateX(0) rotate(0deg)`, opacity: 1 },
      { transform: `translateY(110vh) translateX(${xDrift}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], { duration, easing: 'cubic-bezier(0.25,0.46,0.45,0.94)', fill: 'forwards' })
      .onfinish = () => confetti.remove();
  }
}


// --- C. Floating Hearts ---
function spawnHeart(x, y) {
  const hearts = ['💖', '💕', '💗', '💓', '💝', '💘'];
  const el = document.createElement('div');
  el.className = 'floating-heart';
  el.textContent = hearts[Math.floor(Math.random() * hearts.length)];
  el.style.left = `${x + (Math.random() - 0.5) * 60}px`;
  el.style.top = `${y}px`;
  el.style.fontSize = `${Math.random() * 1.5 + 1}rem`;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2000);
}

// Spawn hearts randomly while on the page
setInterval(() => {
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  spawnHeart(x, y);
}, 800);


// --- D. Fleeing "No" Button & Yes response ---
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const loveResponse = document.getElementById('love-response');

// Position No button absolutely inside its parent
const loveSection = document.getElementById('love-section');

// Track No button position (viewport coords)
let noBtnX = null;
let noBtnY = null;

function initNoBtnPosition() {
  const rect = noBtn.getBoundingClientRect();
  noBtnX = rect.left;
  noBtnY = rect.top;
  // Switch to fixed positioning so it can roam freely
  noBtn.style.position = 'fixed';
  noBtn.style.left = noBtnX + 'px';
  noBtn.style.top = noBtnY + 'px';
  noBtn.style.zIndex = '9996';
}

observer.observe(document.getElementById('love-section'));

// Initialize No button position once the section is visible
const loveObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setTimeout(initNoBtnPosition, 600); // wait for fade-in
      loveObserver.disconnect();
    }
  });
}, { threshold: 0.3 });
loveObserver.observe(document.getElementById('love-section'));

const FLEE_RADIUS = 130; // px — how close before it flees
const FLEE_DISTANCE = 220; // px — how far it jumps

document.addEventListener('mousemove', (e) => {
  if (noBtnX === null) return;

  const btnCenterX = noBtnX + noBtn.offsetWidth / 2;
  const btnCenterY = noBtnY + noBtn.offsetHeight / 2;
  const dx = e.clientX - btnCenterX;
  const dy = e.clientY - btnCenterY;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < FLEE_RADIUS) {
    // Flee in the opposite direction
    const angle = Math.atan2(dy, dx);
    const fleeAngle = angle + Math.PI + (Math.random() - 0.5) * 0.8;
    let newX = noBtnX - Math.cos(fleeAngle) * FLEE_DISTANCE;
    let newY = noBtnY - Math.sin(fleeAngle) * FLEE_DISTANCE;

    // Keep within viewport
    newX = Math.max(0, Math.min(window.innerWidth - noBtn.offsetWidth - 10, newX));
    newY = Math.max(0, Math.min(window.innerHeight - noBtn.offsetHeight - 10, newY));

    noBtnX = newX;
    noBtnY = newY;
    noBtn.style.left = noBtnX + 'px';
    noBtn.style.top = noBtnY + 'px';
  }
});

// Also flee on touch (mobile)
document.addEventListener('touchmove', (e) => {
  const touch = e.touches[0];
  if (!touch || noBtnX === null) return;
  const fakeEvent = { clientX: touch.clientX, clientY: touch.clientY };
  document.dispatchEvent(new MouseEvent('mousemove', fakeEvent));
}, { passive: true });

// Yes button — big celebration
yesBtn.addEventListener('click', (e) => {
  launchConfetti();
  // Spawn a burst of hearts from click point
  for (let i = 0; i < 12; i++) {
    setTimeout(() => spawnHeart(e.clientX, e.clientY), i * 80);
  }
  // Show the love response
  loveResponse.textContent = '🥰 We knew it! We love you more, Beyonce! 💖';
  loveResponse.classList.remove('hidden');
  loveResponse.classList.add('show');
  // Hide the buttons
  yesBtn.style.transform = 'scale(1.3)';
  yesBtn.style.boxShadow = '0 0 40px rgba(212,175,55,0.9)';
  noBtn.style.display = 'none';
});


// ============================================================
// BACKGROUND MUSIC PLAYER
// ============================================================
const audio = document.getElementById('bg-audio');
const musicToggle = document.getElementById('music-toggle');
const musicIcon = document.getElementById('music-icon');
const musicInfo = document.getElementById('music-info');
const musicBars = musicInfo.querySelector('.music-bars');

audio.volume = 0.35;
let isPlaying = false;
let infoTimeout;

function setPlaying(play) {
  isPlaying = play;
  if (play) {
    audio.play();
    musicIcon.textContent = '🎵';
    musicToggle.classList.add('spinning');
    musicBars.classList.remove('paused');
    // Show info panel
    musicInfo.classList.add('visible');
    clearTimeout(infoTimeout);
    infoTimeout = setTimeout(() => musicInfo.classList.remove('visible'), 4000);
  } else {
    audio.pause();
    musicIcon.textContent = '▶️';
    musicToggle.classList.remove('spinning');
    musicBars.classList.add('paused');
    musicInfo.classList.remove('visible');
  }
}

musicToggle.addEventListener('click', () => {
  setPlaying(!isPlaying);
});

// Auto-start on first user interaction (browser policy requires this)
const startOnInteraction = () => {
  if (!isPlaying) setPlaying(true);
  document.removeEventListener('click', startOnInteraction);
  document.removeEventListener('keydown', startOnInteraction);
  document.removeEventListener('touchstart', startOnInteraction);
};
document.addEventListener('click', startOnInteraction);
document.addEventListener('keydown', startOnInteraction);
document.addEventListener('touchstart', startOnInteraction, { passive: true });

// Fade in the audio nicely
audio.addEventListener('play', () => {
  audio.volume = 0;
  let vol = 0;
  const fade = setInterval(() => {
    vol = Math.min(vol + 0.02, 0.35);
    audio.volume = vol;
    if (vol >= 0.35) clearInterval(fade);
  }, 60);
});

