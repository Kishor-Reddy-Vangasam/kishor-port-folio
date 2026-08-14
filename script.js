/* ═══════════════════════════════════════
   KISHOR REDDY PORTFOLIO — script.js
═══════════════════════════════════════ */

// ── NAVBAR SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled');
  else navbar.classList.remove('scrolled');
});

// ── HAMBURGER MENU ──
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ── TYPED TEXT ──
const phrases = [
  'MCA Student',
  'AI & ML Enthusiast',
  'Full-Stack Developer',
  'Python Developer',
  'Problem Solver'
];
let phraseIdx = 0, charIdx = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function typeLoop() {
  const current = phrases[phraseIdx];
  if (deleting) {
    charIdx--;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === 0) {
      deleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeLoop, 400);
      return;
    }
    setTimeout(typeLoop, 50);
  } else {
    charIdx++;
    typedEl.textContent = current.slice(0, charIdx);
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeLoop, 2000);
      return;
    }
    setTimeout(typeLoop, 90);
  }
}
typeLoop();

// ── PARTICLES ──
const particlesEl = document.getElementById('particles');
const PARTICLE_COUNT = 30;

function createParticle() {
  const p = document.createElement('div');
  p.classList.add('particle');
  const x = Math.random() * 100;
  const size = Math.random() * 3 + 1;
  const duration = Math.random() * 8 + 6;
  const delay = Math.random() * 10;
  p.style.cssText = `
    left: ${x}%;
    bottom: ${Math.random() * 30}%;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: 0;
  `;
  particlesEl.appendChild(p);
}
for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

// ── SCROLL REVEAL ──
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);
revealEls.forEach(el => revealObserver.observe(el));

// ── ACTIVE NAV LINK ──
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const activeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinkEls.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  },
  { threshold: 0.4 }
);
sections.forEach(s => activeObserver.observe(s));

// ── SMOOTH ANCHOR SCROLL ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── SKILL PILL TILT ──
document.querySelectorAll('.pill').forEach(pill => {
  pill.addEventListener('mousemove', (e) => {
    const rect = pill.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    pill.style.transform = `scale(1.08) rotateX(${-y * 10}deg) rotateY(${x * 10}deg)`;
  });
  pill.addEventListener('mouseleave', () => {
    pill.style.transform = '';
  });
});

// ── PROJECT CARD TILT ──
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `translateY(-6px) rotateX(${-y * 5}deg) rotateY(${x * 5}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ── CONTACT FORM ──
const contactForm = document.getElementById('contactForm');
const submitBtn   = document.getElementById('submitBtn');

contactForm.addEventListener('submit', async function (e) {
  e.preventDefault();
  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  if (!name || !email || !message) return;

  submitBtn.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="animation:spin 1s linear infinite">
      <circle cx="12" cy="12" r="10" stroke-opacity="0.3"/>
      <path d="M12 2a10 10 0 0 1 10 10"/>
    </svg>
    Sending…
  `;
  submitBtn.disabled = true;

  try {
    const formData = new FormData(contactForm);
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData
    });
    const data = await response.json();

    if (data.success) {
      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
        Message Sent!
      `;
      submitBtn.style.background = '#16a34a';
      contactForm.reset();
    } else {
      throw new Error(data.message || 'Submission failed');
    }
  } catch (err) {
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Failed — Try Again
    `;
    submitBtn.style.background = '#dc2626';
  }

  setTimeout(() => {
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
      </svg>
      Send Message
    `;
    submitBtn.style.background = '';
    submitBtn.disabled = false;
  }, 3500);
});

// ── SPIN KEYFRAME (dynamic injection) ──
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin { to { transform: rotate(360deg); } }
  .nav-link.active { color: #60a5fa !important; }
  .nav-link.active::after { width: 100% !important; }
`;
document.head.appendChild(styleSheet);

// ── COUNTER ANIMATION ──
function animateCounter(el, target, suffix = '') {
  const duration = 1500;
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = isFloat
      ? (eased * target).toFixed(1)
      : Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const nums = entry.target.querySelectorAll('.stat-num');
    nums[0] && animateCounter(nums[0], 8.5, '');
    nums[1] && animateCounter(nums[1], 2, '+');
    nums[2] && animateCounter(nums[2], 6, '+');
    statsObserver.unobserve(entry.target);
  });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);
