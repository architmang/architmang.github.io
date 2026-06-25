/* ============================================================
   script.js — Portfolio interactivity
   REPLACE: typewriterRoles array with your own titles
   ============================================================ */

'use strict';

/* ─── 1. TYPEWRITER EFFECT ─────────────────────────────────── */
// REPLACE: update this array with your own roles/titles
const typewriterRoles = [
  'C++ Engineer',
  'Computer Vision Researcher',
  'Systems Programmer',
  'ML Runtime Optimizer',
  'IIT Kharagpur Alum',
];

const typewriterEl = document.getElementById('typewriter-text');
let roleIdx = 0, charIdx = 0, deleting = false;

function typeStep() {
  const role = typewriterRoles[roleIdx];
  if (!deleting) {
    typewriterEl.textContent = role.slice(0, ++charIdx);
    if (charIdx === role.length) {
      deleting = true;
      setTimeout(typeStep, 1800);
      return;
    }
  } else {
    typewriterEl.textContent = role.slice(0, --charIdx);
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % typewriterRoles.length;
    }
  }
  setTimeout(typeStep, deleting ? 55 : 90);
}
typeStep();

/* ─── 2. HERO CANVAS — floating node network ─────────────────
   Signature element: a sparse particle graph that reacts to
   mouse movement, referencing network/graph algorithms in Archit's work.
   ──────────────────────────────────────────────────────────── */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const ACCENT   = '#a78bfa'; // REPLACE: match --accent in style.css
  const ACCENT2  = '#38bdf8'; // REPLACE: match --accent-2 in style.css
  const COUNT    = 55;
  const MAX_DIST = 160;

  let W, H, nodes, mouse = { x: -999, y: -999 };

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); buildNodes(); });

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function buildNodes() {
    nodes = Array.from({ length: COUNT }, () => ({
      x: rand(0, W), y: rand(0, H),
      vx: rand(-0.25, 0.25), vy: rand(-0.25, 0.25),
      r: rand(1.5, 3.5),
      hue: Math.random() < 0.6 ? ACCENT : ACCENT2,
    }));
  }
  buildNodes();

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // move
    nodes.forEach(n => {
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;
    });

    // edges
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < MAX_DIST) {
          ctx.beginPath();
          ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = ACCENT;
          ctx.globalAlpha = (1 - dist / MAX_DIST) * 0.18;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // mouse-repel & highlight nearby edges
    nodes.forEach(n => {
      const mdx = n.x - mouse.x, mdy = n.y - mouse.y;
      const md = Math.hypot(mdx, mdy);
      if (md < 120) {
        n.x += (mdx / md) * 0.6;
        n.y += (mdy / md) * 0.6;
      }
    });

    // dots
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.hue;
      ctx.globalAlpha = 0.65;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ─── 3. NAVBAR SCROLL BEHAVIOR ──────────────────────────────── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ─── 4. MOBILE MENU ─────────────────────────────────────────── */
const hamburger     = document.getElementById('hamburger');
const mobileMenu    = document.getElementById('mobileMenu');
const mobileClose   = document.getElementById('mobileClose');
const mobileOverlay = document.getElementById('mobileOverlay');

function openMenu() {
  mobileMenu.classList.add('open');
  mobileOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', openMenu);
mobileClose.addEventListener('click', closeMenu);
mobileOverlay.addEventListener('click', closeMenu);
document.querySelectorAll('.mobile-link').forEach(l => l.addEventListener('click', closeMenu));

/* ─── 5. SCROLL REVEAL ───────────────────────────────────────── */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

// Animate sections, cards, skill groups
document.querySelectorAll(
  '.glass-card, .proj-card, .stat-card, .skill-group, ' +
  '.about-text, .contact-info, .contact-form, .section-title, .section-label'
).forEach((el, i) => {
  el.classList.add('reveal');
  el.style.transitionDelay = `${(i % 6) * 60}ms`;
  revealObserver.observe(el);
});

/* ─── 6. SMOOTH SCROLL OFFSET (for fixed nav) ────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = navbar.offsetHeight + 16;
    window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
  });
});

/* ─── 7. ACTIVE NAV LINK HIGHLIGHT ──────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const activeObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      navAnchors.forEach(a => a.classList.remove('active'));
      const match = document.querySelector(`.nav-links a[href="#${e.target.id}"]`);
      if (match) match.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });
sections.forEach(s => activeObserver.observe(s));

/* inject active link style */
const style = document.createElement('style');
style.textContent = `.nav-links a.active { color: var(--accent); }`;
document.head.appendChild(style);

/* ─── 8. CONTACT FORM FEEDBACK ───────────────────────────────── */
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message sent!';
        btn.style.background = '#22c55e';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error('Server error');
      }
    } catch {
      btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed — try emailing directly';
      btn.style.background = '#ef4444';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 4000);
    }
  });
}
