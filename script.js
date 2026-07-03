'use strict';
/* ════════════════════════════════════════
   script.js — Archit Mangrulkar Portfolio
   Features:
   1. Tab navigation
   2. Custom cursor
   3. Three.js 3D rotating geometry
   4. Typewriter
   5. Visitor counter (localStorage)
   6. GitHub live status
   7. Scroll-triggered reveal + stat counters
   8. Glitch ticker
   9. Experience accordion
   10. Project canvas illustrations
   11. Skills tag pop animation
   12. Contact form
   13. CV iframe fallback
   ════════════════════════════════════════ */

/* ──────────────────────────────────────
   1. TAB NAVIGATION
────────────────────────────────────── */
function showTab(name) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  const target = document.getElementById('tab-' + name);
  if (!target) return;
  target.classList.add('active');
  window.scrollTo(0, 0);
  document.querySelectorAll('[data-tab]').forEach(a =>
    a.classList.toggle('active', a.dataset.tab === name));
  setTimeout(triggerReveal, 80);
  if (name === 'projects') setTimeout(drawAllCanvases, 150);
  if (name === 'skills')   setTimeout(animSkillTags, 400);
}

document.querySelectorAll('[data-tab]').forEach(el =>
  el.addEventListener('click', e => {
    e.preventDefault();
    showTab(el.dataset.tab);
    closeDr();
  }));

showTab('home');

/* ──────────────────────────────────────
   2. CUSTOM CURSOR
────────────────────────────────────── */
const cur = document.getElementById('cursor');
const curF = document.getElementById('cursor-follower');
let mx = -200, my = -200, fx = -200, fy = -200;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
document.addEventListener('mouseleave', () => { cur.style.opacity = '0'; curF.style.opacity = '0'; });
document.addEventListener('mouseenter', () => { cur.style.opacity = '1'; curF.style.opacity = '1'; });

function animCursor() {
  cur.style.left = mx + 'px'; cur.style.top = my + 'px';
  fx += (mx - fx) * 0.12; fy += (my - fy) * 0.12;
  curF.style.left = fx + 'px'; curF.style.top = fy + 'px';
  requestAnimationFrame(animCursor);
}
animCursor();

document.addEventListener('mouseover', e => {
  const el = e.target.closest('[data-cursor="link"], a, button');
  document.body.classList.toggle('cursor-link', !!el);
});

/* ──────────────────────────────────────
   3. THREE.JS  — Floating wireframe chip
   A rotating dodecahedron wireframe with
   a point cloud shell — represents the
   "computational geometry" in Archit's work
────────────────────────────────────── */
(function initThree() {
  if (!window.THREE) return;
  const canvas = document.getElementById('three-canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(0, 0, 5);

  // Central wireframe torus-knot (chip-like geometry)
  const torusGeo = new THREE.TorusKnotGeometry(1.1, 0.32, 120, 16);
  const torusMat = new THREE.MeshBasicMaterial({ color: 0xa78bfa, wireframe: true, opacity: 0.18, transparent: true });
  const torus = new THREE.Mesh(torusGeo, torusMat);
  scene.add(torus);

  // Inner dodecahedron
  const dodGeo = new THREE.DodecahedronGeometry(0.7, 0);
  const dodMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, opacity: 0.12, transparent: true });
  const dod = new THREE.Mesh(dodGeo, dodMat);
  scene.add(dod);

  // Particle cloud
  const pGeo = new THREE.BufferGeometry();
  const pCount = 800;
  const pPos = new Float32Array(pCount * 3);
  for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 14;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xa78bfa, size: 0.025, opacity: 0.4, transparent: true });
  scene.add(new THREE.Points(pGeo, pMat));

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', e => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 1.5;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 1.5;
  });

  window.addEventListener('resize', () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
  });

  let t = 0;
  function animate3() {
    requestAnimationFrame(animate3);
    t += 0.004;
    torus.rotation.x += 0.003;
    torus.rotation.y += 0.005;
    dod.rotation.x -= 0.004;
    dod.rotation.z += 0.003;
    camera.position.x += (mouseX * 0.6 - camera.position.x) * 0.04;
    camera.position.y += (-mouseY * 0.6 - camera.position.y) * 0.04;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate3();
})();

/* ──────────────────────────────────────
   4. TYPEWRITER
   REPLACE: update roles array
────────────────────────────────────── */
const roles = ['C++ Engineer', 'Computer Vision Researcher', 'Systems Programmer', 'ML Runtime Optimizer', 'IIT Kharagpur Alum'];
const twEl = document.getElementById('tw-text');
let ri = 0, ci = 0, del = false;
function tw() {
  if (!twEl) return;
  const r = roles[ri];
  twEl.textContent = del ? r.slice(0, --ci) : r.slice(0, ++ci);
  if (!del && ci === r.length) { del = true; setTimeout(tw, 1800); return; }
  if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; }
  setTimeout(tw, del ? 48 : 85);
}
tw();

/* ──────────────────────────────────────
   5. VISITOR COUNTER (localStorage)
   Persists across all visits on the same browser.
   For true cross-user counting, replace this with
   a free counter API like countapi.xyz
────────────────────────────────────── */
(function initCounter() {
  const el = document.getElementById('visitor-count');
  if (!el) return;
  try {
    let count = parseInt(localStorage.getItem('am_visits') || '0', 10);
    count++;
    localStorage.setItem('am_visits', count);
    // Animate the count up
    let cur2 = 0;
    const step = Math.ceil(count / 30);
    const iv = setInterval(() => {
      cur2 = Math.min(cur2 + step, count);
      el.textContent = cur2.toLocaleString();
      if (cur2 >= count) clearInterval(iv);
    }, 40);
  } catch(e) {
    el.textContent = '—';
  }
})();

/* ──────────────────────────────────────
   6. GITHUB LIVE STATUS
   Fetches most recent public event from GitHub
────────────────────────────────────── */
(function setStatus() {
  const el = document.getElementById('status-text');
  if (el) el.textContent = 'Currently at Samsung Research, Bangalore';
})();

/* ──────────────────────────────────────
   7. SCROLL REVEAL + STAT COUNTERS
────────────────────────────────────── */
function triggerReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
  document.querySelectorAll('.tab.active .reveal').forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 65 + 'ms';
    obs.observe(el);
  });
  // Stats counter animation
  document.querySelectorAll('.reveal-stat').forEach((el, i) => {
    el.style.transitionDelay = i * 80 + 'ms';
    setTimeout(() => {
      el.classList.add('visible');
      const numEl = el.querySelector('.hs-n[data-target]');
      if (numEl) {
        const target = parseInt(numEl.dataset.target, 10);
        let n = 0;
        const iv = setInterval(() => {
          n = Math.min(n + 1, target);
          numEl.textContent = n;
          if (n >= target) clearInterval(iv);
        }, 60);
      }
    }, 300 + i * 100);
  });
}

/* ──────────────────────────────────────
   8. MOBILE DRAWER
────────────────────────────────────── */
const drawer  = document.getElementById('drawer');
const overlay = document.getElementById('overlay');
const ham     = document.getElementById('hamburger');
const drClose = document.getElementById('drawerClose');
function openDr()  { drawer.classList.add('open');  overlay.classList.add('open');  document.body.style.overflow='hidden'; }
function closeDr() { drawer.classList.remove('open'); overlay.classList.remove('open'); document.body.style.overflow=''; }
ham?.addEventListener('click', openDr);
drClose?.addEventListener('click', closeDr);
overlay?.addEventListener('click', closeDr);

/* ──────────────────────────────────────
   9. EXPERIENCE ACCORDION
────────────────────────────────────── */
document.querySelectorAll('.exp-row-header').forEach(hdr => {
  hdr.addEventListener('click', () => {
    const row = document.getElementById(hdr.dataset.exp);
    if (!row) return;
    const isOpen = row.classList.contains('open');
    document.querySelectorAll('.exp-row.open').forEach(r => r.classList.remove('open'));
    if (!isOpen) row.classList.add('open');
  });
});

/* ──────────────────────────────────────
   10. PROJECT CANVAS ILLUSTRATIONS
────────────────────────────────────── */
function drawAllCanvases() {
  [
    ['pc1', drawKalman],
    ['pc2', drawARMA],
    ['pc3', drawSQL],
    ['pc4', drawShell],
    ['pc5', drawHTTP],
  ].forEach(([id, fn]) => {
    const c = document.getElementById(id);
    if (!c) return;
    const dpr = window.devicePixelRatio || 1;
    c.width  = c.offsetWidth  * dpr;
    c.height = c.offsetHeight * dpr;
    const ctx = c.getContext('2d');
    ctx.scale(dpr, dpr);
    fn(ctx, c.offsetWidth, c.offsetHeight);
  });
}

function drawKalman(ctx, W, H) {
  ctx.fillStyle='#050d14'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(56,189,248,.06)'; ctx.lineWidth=1;
  for(let x=0;x<=W;x+=55){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,H);ctx.stroke();}
  for(let y=0;y<=H;y+=36){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  const n=Math.ceil(W/4)+1, a=[], b=[];
  for(let i=0;i<n;i++){a.push(H*.48+Math.sin(i*.038)*55+(Math.random()-.5)*26); b.push(H*.52+Math.sin(i*.038+.8)*45+(Math.random()-.5)*20);}
  const dl=(pts,c,al,lw)=>{ctx.beginPath();pts.forEach((y,i)=>{const x=i*4;i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});ctx.strokeStyle=c;ctx.globalAlpha=al;ctx.lineWidth=lw;ctx.stroke();};
  dl(a,'#38bdf8',.2,1.2); dl(b,'#a78bfa',.2,1.2);
  let s1=a[0],s2=b[0]; const ka=[],kb=[];
  a.forEach(v=>{s1=s1*.8+v*.2;ka.push(s1);}); b.forEach(v=>{s2=s2*.8+v*.2;kb.push(s2);});
  ctx.globalAlpha=1; dl(ka,'#38bdf8',1,2.5); dl(kb,'#a78bfa',1,2.5);
  ctx.globalAlpha=1; ctx.fillStyle='rgba(56,189,248,.9)'; ctx.font='bold 11px JetBrains Mono,monospace';
  ctx.fillText('KALMAN FILTER  PAIRS TRADING',14,20);
  ctx.fillStyle='rgba(167,139,250,.7)'; ctx.font='10px JetBrains Mono,monospace';
  ctx.fillText('15–22% annualized · −30% drawdown · 10ms update',14,H-12);
}

function drawARMA(ctx, W, H) {
  ctx.fillStyle='#0a0714'; ctx.fillRect(0,0,W,H);
  ctx.strokeStyle='rgba(167,139,250,.05)'; ctx.lineWidth=1;
  for(let y=0;y<H;y+=32){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(W,y);ctx.stroke();}
  const n=32,cw=Math.floor((W-24)/n)-3; let p=H*.5;
  for(let i=0;i<n;i++){
    p+=(Math.random()-.47)*14; p=Math.max(H*.1,Math.min(H*.85,p));
    const o=p-(Math.random()-.5)*12,cl=p+(Math.random()-.5)*12;
    const hi=Math.min(o,cl)-Math.random()*8,lo=Math.max(o,cl)+Math.random()*8;
    const x=12+i*(cw+3),bull=cl<o;
    ctx.strokeStyle=bull?'rgba(74,222,128,.9)':'rgba(248,113,113,.9)'; ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(x+cw/2,hi);ctx.lineTo(x+cw/2,lo);ctx.stroke();
    ctx.fillStyle=bull?'rgba(74,222,128,.65)':'rgba(248,113,113,.65)';
    ctx.fillRect(x,Math.min(o,cl),cw,Math.abs(cl-o)||2);
  }
  ctx.beginPath();
  for(let x=0;x<W;x+=3)ctx.lineTo(x,H*.88+Math.sin(x*.06)*10);
  ctx.strokeStyle='rgba(167,139,250,.75)'; ctx.lineWidth=1.8; ctx.stroke();
  ctx.fillStyle='rgba(167,139,250,.9)'; ctx.font='bold 11px JetBrains Mono,monospace';
  ctx.fillText('ARMA STRATEGY  AAPL',14,20);
  ctx.fillStyle='rgba(74,222,128,.8)'; ctx.font='10px JetBrains Mono,monospace';
  ctx.fillText('Sharpe 1.5 · +23% profit · BackTrader',14,H-12);
}

function drawSQL(ctx, W, H) {
  ctx.fillStyle='#0a0714'; ctx.fillRect(0,0,W,H);
  const nodes=[{x:W/2,y:50,l:'SELECT',c:'#a78bfa'},{x:W/2-130,y:125,l:'JOIN',c:'#38bdf8'},{x:W/2+120,y:125,l:'WHERE',c:'#38bdf8'},{x:W/2-200,y:205,l:'table_a',c:'#4ade80'},{x:W/2-55,y:205,l:'table_b',c:'#4ade80'},{x:W/2+65,y:205,l:'id > 0',c:'#fbbf24'},{x:W/2+175,y:205,l:'!= NULL',c:'#fbbf24'}];
  [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]].forEach(([a,b])=>{
    ctx.beginPath();ctx.moveTo(nodes[a].x,nodes[a].y+15);ctx.lineTo(nodes[b].x,nodes[b].y-15);
    ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=1.5;ctx.stroke();
  });
  nodes.forEach(n=>{
    if(ctx.roundRect){ctx.beginPath();ctx.roundRect(n.x-48,n.y-15,96,30,5);}else{ctx.beginPath();ctx.rect(n.x-48,n.y-15,96,30);}
    ctx.fillStyle=n.c+'1a';ctx.fill(); ctx.strokeStyle=n.c+'77';ctx.lineWidth=1.5;ctx.stroke();
    ctx.fillStyle=n.c;ctx.font='bold 10px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText(n.l,n.x,n.y+4);
  });
  ctx.textAlign='left';
  ctx.fillStyle='rgba(56,189,248,.9)';ctx.font='bold 11px JetBrains Mono,monospace';ctx.fillText('SQL QUERY REWRITER  AST',14,22);
  ctx.fillStyle='rgba(167,139,250,.8)';ctx.font='10px JetBrains Mono,monospace';ctx.fillText('3× speedup · Lex & Yacc · C++ query tree',14,H-12);
}

function drawShell(ctx, W, H) {
  ctx.fillStyle='#050f09'; ctx.fillRect(0,0,W,H);
  ctx.fillStyle='#0a1a10'; ctx.fillRect(0,0,W,34);
  ['#ef4444','#fbbf24','#4ade80'].forEach((c,i)=>{ctx.beginPath();ctx.arc(16+i*22,17,6,0,Math.PI*2);ctx.fillStyle=c;ctx.fill();});
  ctx.fillStyle='#6b7280';ctx.font='11px JetBrains Mono,monospace';ctx.fillText('archit@unix  ~/shell  zsh',70,21);
  [['$ ls -la | grep .cpp | wc -l','#4ade80'],['  42','#e2e8f0'],['$ ./squashbug --scan /proc','#4ade80'],['  [WARN] pid 4821  heuristic matched','#fbbf24'],['  [KILL] pid 4821 terminated','#f87171'],['$ dijkstra --graph shm --src A','#4ade80'],['  path: A → C → E → F  (cost = 7)','#38bdf8'],['$ _','#4ade80']].forEach((l,i)=>{ctx.fillStyle=l[1];ctx.font='10.5px JetBrains Mono,monospace';ctx.fillText(l[0],14,52+i*22);});
  ctx.fillStyle='rgba(167,139,250,.9)';ctx.font='bold 11px JetBrains Mono,monospace';ctx.fillText('UNIX SHELL  IPC  C++',14,H-12);
}

function drawHTTP(ctx, W, H) {
  ctx.fillStyle='#07111f'; ctx.fillRect(0,0,W,H);
  const MY=H/2,CX=85,SX=W-85;
  const box=(x,t,s)=>{
    if(ctx.roundRect){ctx.beginPath();ctx.roundRect(x-58,MY-42,116,84,7);}else{ctx.beginPath();ctx.rect(x-58,MY-42,116,84);}
    ctx.fillStyle='rgba(56,189,248,.07)';ctx.fill();
    ctx.strokeStyle='rgba(56,189,248,.35)';ctx.lineWidth=1.5;
    if(ctx.roundRect){ctx.roundRect(x-58,MY-42,116,84,7);}else{ctx.rect(x-58,MY-42,116,84);}
    ctx.stroke();
    ctx.fillStyle='#38bdf8';ctx.font='bold 11px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText(t,x,MY-10);
    ctx.fillStyle='#94a3b8';ctx.font='9.5px JetBrains Mono,monospace';ctx.fillText(s,x,MY+8);
  };
  box(CX,'CLIENT','CLI Browser'); box(SX,'SERVER','HTTP 1.1');
  [{y:MY-58,l:'GET /file.pdf',d:1,c:'#4ade80'},{y:MY-28,l:'200 OK + body',d:-1,c:'#a78bfa'},{y:MY+12,l:'PUT /upload.pdf',d:1,c:'#4ade80'},{y:MY+42,l:'201 Created',d:-1,c:'#a78bfa'}].forEach(m=>{
    const x1=m.d===1?CX+60:SX-60,x2=m.d===1?SX-60:CX+60;
    ctx.beginPath();ctx.moveTo(x1,m.y);ctx.lineTo(x2,m.y);ctx.strokeStyle=m.c;ctx.lineWidth=1.5;ctx.setLineDash([5,3]);ctx.stroke();ctx.setLineDash([]);
    ctx.beginPath();ctx.moveTo(x2,m.y);ctx.lineTo(x2-m.d*9,m.y-5);ctx.lineTo(x2-m.d*9,m.y+5);ctx.closePath();ctx.fillStyle=m.c;ctx.fill();
    ctx.fillStyle=m.c+'cc';ctx.font='9px JetBrains Mono,monospace';ctx.textAlign='center';ctx.fillText(m.l,(x1+x2)/2,m.y-5);
  });
  ctx.textAlign='left';
  ctx.fillStyle='rgba(56,189,248,.9)';ctx.font='bold 11px JetBrains Mono,monospace';ctx.fillText('MyHTTP TCP BROWSER',14,22);
  ctx.fillStyle='rgba(74,222,128,.75)';ctx.font='10px JetBrains Mono,monospace';ctx.fillText('OpenSSL · HTTP 1.1 · Concurrent · GET/PUT',14,H-12);
}

/* ──────────────────────────────────────
   11. SKILLS TAG ANIMATION
────────────────────────────────────── */
function animSkillTags() {
  document.querySelectorAll('.anim-tag').forEach((t, i) => {
    setTimeout(() => {
      t.classList.add('popped');
      setTimeout(() => t.classList.remove('popped'), 400);
    }, i * 55);
  });
}

/* ──────────────────────────────────────
   12. CONTACT FORM
────────────────────────────────────── */
const form = document.querySelector('.contact-form');
if (form) {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...'; btn.disabled = true;
    try {
      const res = await fetch(form.action, { method:'POST', body:new FormData(form), headers:{Accept:'application/json'} });
      if (res.ok) { btn.innerHTML='<i class="fa-solid fa-circle-check"></i> Sent!'; btn.style.background='#22c55e'; form.reset(); }
      else throw 0;
    } catch { btn.innerHTML='<i class="fa-solid fa-triangle-exclamation"></i> Failed — email me directly'; btn.style.background='#ef4444'; }
    setTimeout(()=>{ btn.innerHTML=orig; btn.style.background=''; btn.disabled=false; }, 4000);
  });
}

/* ──────────────────────────────────────
   13. CV IFRAME FALLBACK
────────────────────────────────────── */
const cvi = document.getElementById('cv-iframe');
if (cvi) cvi.addEventListener('error', () => cvi.classList.add('error'));
