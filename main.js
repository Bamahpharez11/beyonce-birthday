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

