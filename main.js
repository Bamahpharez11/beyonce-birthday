import './style.css';
import media from './src/media.json';

document.documentElement.classList.add('js');
const $ = (selector) => document.querySelector(selector);
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let effectsPaused = reducedMotion.matches;
const motionButton = $('#motion-toggle');
const canvas = $('#effects');
const ctx = canvas.getContext('2d');
let width = innerWidth, height = innerHeight, particles = [], stars = [], frame = 0, lastFrame = 0;
const colors = ['#edb8c3', '#d6b780', '#fff1e6', '#b87991'];
function resizeCanvas() {
  width = innerWidth; height = innerHeight;
  const ratio = Math.min(devicePixelRatio || 1, 2);
  canvas.width = width * ratio; canvas.height = height * ratio;
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  stars = Array.from({ length: width < 760 ? 24 : 48 }, () => ({ x: Math.random() * width, y: Math.random() * height, r: .5 + Math.random(), phase: Math.random() * 6 }));
}
function draw(time) {
  frame = 0;
  if (effectsPaused || document.hidden) return;
  if (time - lastFrame < 30) { frame = requestAnimationFrame(draw); return; }
  const dt = Math.min((time - lastFrame) / 16.7, 2.5); lastFrame = time;
  ctx.clearRect(0, 0, width, height);
  for (const star of stars) {
    ctx.globalAlpha = .2 + (Math.sin(time / 1600 + star.phase) + 1) * .18;
    ctx.fillStyle = '#d6b780'; ctx.beginPath(); ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2); ctx.fill();
  }
  particles = particles.filter(p => p.life > 0 && p.y < height + 50);
  for (const p of particles) {
    p.x += p.vx * dt; p.y += p.vy * dt; p.vy += p.gravity * dt; p.life -= dt; p.rotation += p.spin * dt;
    ctx.save(); ctx.globalAlpha = Math.min(1, p.life / 25); ctx.translate(p.x, p.y); ctx.rotate(p.rotation); ctx.fillStyle = p.color;
    if (p.spark) { ctx.beginPath(); ctx.moveTo(0,-p.size); ctx.lineTo(p.size*.3,-p.size*.3); ctx.lineTo(p.size,0); ctx.lineTo(p.size*.3,p.size*.3); ctx.lineTo(0,p.size); ctx.lineTo(-p.size*.3,p.size*.3); ctx.lineTo(-p.size,0); ctx.lineTo(-p.size*.3,-p.size*.3); ctx.closePath(); ctx.fill(); }
    else ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * .6);
    ctx.restore();
  }
  ctx.globalAlpha = 1; frame = requestAnimationFrame(draw);
}
function syncMotion() {
  document.body.classList.toggle('effects-paused', effectsPaused);
  motionButton.textContent = effectsPaused ? 'Enable effects' : 'Pause effects';
  motionButton.setAttribute('aria-pressed', String(effectsPaused));
  if (effectsPaused || document.hidden) { cancelAnimationFrame(frame); frame = 0; particles = []; ctx.clearRect(0, 0, width, height); }
  else if (!frame) { lastFrame = performance.now(); frame = requestAnimationFrame(draw); }
}
resizeCanvas(); syncMotion();
addEventListener('resize', resizeCanvas, { passive: true });
document.addEventListener('visibilitychange', syncMotion);
motionButton.addEventListener('click', () => { effectsPaused = !effectsPaused; syncMotion(); });
reducedMotion.addEventListener('change', e => { effectsPaused = e.matches; syncMotion(); });
const petals = $('.petals');
for (let i = 0; i < 10; i++) {
  const petal = document.createElement('span'); petal.className = 'petal';
  petal.style.cssText = `--left:${Math.random()*100}%;--duration:${16+Math.random()*14}s;--delay:${-Math.random()*30}s;--blur:${i % 3 === 0 ? 2 : 0}px`;
  petals.append(petal);
}
let lastPointer = 0;
addEventListener('pointermove', e => {
  if (effectsPaused || e.pointerType !== 'mouse' || performance.now() - lastPointer < 40) return;
  lastPointer = performance.now();
  if (particles.length < 240) particles.push({ x: e.clientX, y: e.clientY, vx: (Math.random()-.5)*.6, vy: -.6, gravity: 0, size: 2+Math.random()*3, life: 25, rotation: 0, spin: .02, spark: true, color: colors[Math.floor(Math.random()*3)] });
}, { passive: true });
let toastTimer;
function toast(message) { $('#celebration-message').textContent = message; $('#celebration-message').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#celebration-message').classList.remove('visible'), 3400); }
function celebrate(message = 'The world is a little brighter with you in it ♡') {
  toast(message);
  if (effectsPaused) return;
  particles = particles.slice(-40);
  for (let i = 0; i < 150; i++) {
    const side = i % 2;
    particles.push({ x: side ? width : 0, y: height * .75, vx: (side ? -1 : 1) * (2 + Math.random()*7), vy: -5-Math.random()*10, gravity: .16, size: 4+Math.random()*5, life: 130+Math.random()*50, rotation: Math.random()*6, spin: (Math.random()-.5)*.15, color: colors[i%4] });
  }
}
$('.celebrate-button').addEventListener('click', () => celebrate());
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
let scrollPending = false;
function updateProgress() { const max = document.documentElement.scrollHeight - innerHeight; $('.reading-progress').style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`; scrollPending = false; }
addEventListener('scroll', () => { if (!scrollPending) { scrollPending = true; requestAnimationFrame(updateProgress); } }, { passive: true });
updateProgress();
$('.portrait-scene').addEventListener('pointermove', e => { if (effectsPaused || e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); $('.portrait').style.setProperty('--portrait-tilt', `${((e.clientX - r.left) / r.width - .5) * 5}deg`); });
$('.portrait-scene').addEventListener('pointerleave', () => $('.portrait').style.setProperty('--portrait-tilt','0deg'));
$('.envelope').addEventListener('click', () => {
  const letter = $('#birthday-letter'); letter.classList.add('highlight');
  letter.scrollIntoView({ behavior: effectsPaused ? 'instant' : 'smooth', block: 'center' });
  setTimeout(() => letter.classList.remove('highlight'), 1800);
});

// All original memories, with lightweight previews and keyboard-accessible viewing.
const captions = ['A little sunshine','Better together','That beautiful smile','Simply you','Our kind of happy','The silly days','My favorite moments','Always a little magic','A memory to keep','All the little things','A brighter day','Just being you'];
const memories = media.map((item, id) => ({ ...item, id, caption: item.type === 'video' ? 'A moment in motion' : captions[id % captions.length] }));
let filter = 'all', visibleMemories = memories, currentIndex = 0, lastTrigger;
const gallery = $('#gallery'), dialog = $('#lightbox');
const inViewVideos = new Set();
function syncPreview(video) {
  const shouldPlay = inViewVideos.has(video) && !document.hidden && !dialog.open;
  video.muted = true;
  if (!shouldPlay) { video.pause(); return; }
  if (!video.getAttribute('src')) video.src = video.dataset.src;
  video.play().then(() => {
    if (!inViewVideos.has(video) || document.hidden || dialog.open) video.pause();
  }).catch(() => { /* The poster remains available if playback is restricted. */ });
}
function syncPreviews() { gallery.querySelectorAll('video').forEach(syncPreview); }
const videoObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio >= .3) inViewVideos.add(entry.target);
    else inViewVideos.delete(entry.target);
    syncPreview(entry.target);
  });
}, { threshold: [0, .3] });
document.addEventListener('visibilitychange', () => {
  syncPreviews();
  if (document.hidden) $('.dialog-media video')?.pause();
});
function renderGallery() {
  visibleMemories = memories.filter(item => filter === 'all' || item.type === filter);
  gallery.querySelectorAll('video').forEach(video => video.pause());
  videoObserver.disconnect(); inViewVideos.clear();
  gallery.replaceChildren();
  visibleMemories.forEach((item, index) => {
    const button = document.createElement('button'); button.type = 'button'; button.className = 'memory';
    button.style.setProperty('--rotation', `${[-2,2,-1,1.5][index%4]}deg`);
    button.style.animationDelay = `${Math.min(index,7) * 45}ms`;
    button.setAttribute('aria-label', `Open ${item.type === 'video' ? 'video' : 'photo'} ${index+1}: ${item.caption}`);
    const wrapper = document.createElement('span'); wrapper.className = 'memory-image';
    if (item.type === 'video') {
      const video = document.createElement('video');
      video.dataset.src = item.src; video.poster = item.poster;
      video.muted = true; video.defaultMuted = true; video.loop = true;
      video.playsInline = true; video.preload = 'none'; video.tabIndex = -1;
      video.setAttribute('muted', ''); video.setAttribute('playsinline', '');
      video.setAttribute('aria-hidden', 'true');
      wrapper.append(video); videoObserver.observe(video);
      const hint = document.createElement('span'); hint.className = 'video-sound-hint';
      hint.textContent = 'Tap for sound ↗'; hint.setAttribute('aria-hidden', 'true'); wrapper.append(hint);
      button.setAttribute('aria-label', `Open video ${index+1} with sound: ${item.caption}`);
    } else {
      const image = document.createElement('img'); image.src = item.src; image.alt = '';
      image.loading = 'lazy'; image.decoding = 'async'; wrapper.append(image);
    }
    const caption = document.createElement('span'); caption.className = 'memory-caption'; caption.textContent = item.caption;
    const number = document.createElement('span'); number.className = 'memory-number'; number.textContent = String(index+1).padStart(2,'0');
    button.append(wrapper,caption,number); button.addEventListener('click', () => { lastTrigger = button; openMemory(index); }); gallery.append(button);
  });
  $('#gallery-status').textContent = `Showing all ${visibleMemories.length} memories.`;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b => b.setAttribute('aria-pressed',String(b === button))); renderGallery();
}));
function renderMemory() {
  const item = visibleMemories[currentIndex], host = $('.dialog-media');
  host.querySelector('video')?.pause(); host.replaceChildren();
  const element = document.createElement(item.type === 'video' ? 'video' : 'img');
  element.src = item.src;
  if (item.type === 'video') { element.controls = true; element.playsInline = true; element.preload = 'auto'; element.poster = item.poster; element.muted = false; }
  else element.alt = item.caption;
  host.append(element);
  if (item.type === 'video') element.play().catch(() => { /* Native controls offer retry. */ });
  $('.dialog-caption').textContent = `${item.caption} · ${currentIndex+1} / ${visibleMemories.length}`;
}
function openMemory(index) { currentIndex = index; if (!dialog.open) dialog.showModal(); syncPreviews(); renderMemory(); document.body.style.overflow = 'hidden'; }
function navigateMemory(direction) { currentIndex = (currentIndex + direction + visibleMemories.length) % visibleMemories.length; renderMemory(); }
$('.dialog-close').addEventListener('click', () => dialog.close());
$('.dialog-prev').addEventListener('click', () => navigateMemory(-1));
$('.dialog-next').addEventListener('click', () => navigateMemory(1));
dialog.addEventListener('close', () => { $('.dialog-media video')?.pause(); $('.dialog-media').replaceChildren(); document.body.style.overflow = ''; syncPreviews(); lastTrigger?.focus({ preventScroll: true }); });
dialog.addEventListener('click', e => { if(e.target === dialog) { const r = dialog.getBoundingClientRect(); if(e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
dialog.addEventListener('keydown', e => { if(e.target.tagName === 'VIDEO') return; if(e.key === 'ArrowRight') { e.preventDefault(); navigateMemory(1); } if(e.key === 'ArrowLeft') { e.preventDefault(); navigateMemory(-1); } });
renderGallery();

// Birthday surprises.
const candle = $('#wish-button');
candle.addEventListener('click', () => {
  if (candle.classList.contains('wished')) return;
  candle.classList.add('wished'); candle.setAttribute('aria-label','Your birthday wish has been made');
  $('#wish-message').textContent = 'May every beautiful thing you wished for find its way to you. ♡'; $('#relight').hidden = false;
  celebrate('A little wish, sent out into the universe ✦');
});
$('#relight').addEventListener('click', () => { candle.classList.remove('wished'); candle.setAttribute('aria-label','Make a wish and blow out the candle'); $('#wish-message').textContent = 'Close your eyes. Make a wish. Then tap the flame.'; $('#relight').hidden = true; candle.focus({ preventScroll: true }); });
$('#yes-button').addEventListener('click', () => { $('#love-response').textContent = 'We knew it. We love you more, Beyonce! ♡'; $('#love-prompt').textContent = 'Always, and then a little more.'; $('#yes-button').textContent = 'Loved, endlessly ♡'; $('#think-button').hidden = true; celebrate('You are so, so loved ♡'); });
let thinks = 0;
$('#think-button').addEventListener('click', () => { const messages = ['Take your time. We already know our answer. ♡','Still here. Still loving you. ♡','Okay, one more little nudge… ♡']; $('#love-prompt').textContent = messages[thinks++ % messages.length]; if (!effectsPaused) $('#yes-button').animate([{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],{duration:500}); });

// Keep the official audio iframe mounted when the compact player is closed.
const musicToggle = $('#music-toggle'), soundtrack = $('.soundtrack'), musicPanel = $('#music-panel');
function setMusicOpen(open) { soundtrack.classList.toggle('collapsed', !open); musicToggle.setAttribute('aria-expanded', String(open)); musicPanel.inert = !open; }
musicToggle.addEventListener('click', () => setMusicOpen(musicToggle.getAttribute('aria-expanded') !== 'true'));
setMusicOpen(false);
