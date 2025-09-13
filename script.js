// ====== Theme toggle (persist + system fallback) ======
const themeToggle = document.getElementById('theme-toggle');
const savedTheme = localStorage.getItem('theme');

// apply theme: if saved === 'dark' OR (no saved and system prefers dark) => dark, else light (no attribute)
if (savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
  document.documentElement.setAttribute('data-theme', 'dark');
} else {
  document.documentElement.removeAttribute('data-theme');
}

function renderThemeButton() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  themeToggle.innerHTML = isDark ? '<i class="fas fa-sun" aria-hidden="true"></i>' : '<i class="fas fa-moon" aria-hidden="true"></i>';
  themeToggle.setAttribute('aria-pressed', String(isDark));
}
renderThemeButton();

themeToggle.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    // switch to light
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    // switch to dark
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
  renderThemeButton();
});

// ====== Mobile nav toggle ======
const navToggle = document.getElementById('nav-toggle');
const navList = document.querySelector('.nav-list');
if (navToggle && navList) {
  navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navList.classList.toggle('open');
  });
}

// ====== Smooth scroll & active nav highlight ======
const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (navList && navList.classList.contains('open')) navList.classList.remove('open');
    navToggle.setAttribute('aria-expanded','false');
  });
});

// Use sections (with ids) for highlighting - includes main cards/sections
const sections = document.querySelectorAll('main .section, main section.card');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      const id = entry.target.id;
      if (id) {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${id}"]`);
        if (active) active.classList.add('active');
      }
    }
  });
}, { threshold: 0.18 });

document.querySelectorAll('.card, .section').forEach(el => observer.observe(el));

// ====== Progress bar & back-to-top ======
const progressBar = document.getElementById('progress-bar');
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
  const pct = (window.scrollY / (docH <= 0 ? 1 : docH)) * 100;
  progressBar.style.width = pct + '%';
  backBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
});
backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ====== Project filtering with fade animation ======
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');
filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    projectCards.forEach(card => {
      const cat = card.dataset.category;
      if (filter === 'all' || filter === cat) {
        card.style.display = '';
        card.style.opacity = 0;
        setTimeout(() => { card.style.opacity = 1; }, 60);
      } else {
        card.style.opacity = 0;
        setTimeout(() => { card.style.display = 'none'; }, 180);
      }
    });
  });
  // Keyboard accessibility
  btn.setAttribute('tabindex', '0');
  btn.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') btn.click();
  });
});

// ====== Reduced motion handling ======
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.card, .section').forEach(el => el.classList.add('visible'));
}

// ====== Smooth theme transition ======
const themeTransition = () => {
  document.documentElement.classList.add('theme-transition');
  setTimeout(() => document.documentElement.classList.remove('theme-transition'), 500);
};
themeToggle.addEventListener('click', themeTransition);

// === Animated Hero Background (particles/gradient) ===
window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = 320;
  }
  resize();
  window.addEventListener('resize', resize);
  // Simple animated gradient/particles
  let t = 0;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    // Gradient
    const grad = ctx.createLinearGradient(0,0,canvas.width,canvas.height);
    grad.addColorStop(0, '#8b5cf6');
    grad.addColorStop(1, '#06b6d4');
    ctx.fillStyle = grad;
    ctx.fillRect(0,0,canvas.width,canvas.height);
    // Particles
    for(let i=0;i<18;i++){
      const x = (canvas.width/18)*i + Math.sin(t+i)*18;
      const y = 80 + Math.sin(t/2+i)*30;
      ctx.beginPath();
      ctx.arc(x, y, 8+Math.sin(t+i)*2, 0, 2*Math.PI);
      ctx.fillStyle = `rgba(255,255,255,${0.08+0.08*Math.abs(Math.sin(t+i))})`;
      ctx.fill();
    }
    t += 0.012;
    requestAnimationFrame(draw);
  }
  draw();
});

// === Project Card Modal ===
const modalBackdrop = document.getElementById('project-modal-backdrop');
const modal = document.getElementById('project-modal');
const modalClose = document.getElementById('project-modal-close');
const modalContent = document.getElementById('project-modal-content');
function openProjectModal(project) {
  document.getElementById('global-spinner').style.display = 'block';
  setTimeout(() => { // Simulate loading
    document.getElementById('global-spinner').style.display = 'none';
    modalContent.innerHTML = `
      <h2>${project.title}</h2>
      <img src="${project.img}" alt="${project.title}" style="width:100%;border-radius:8px;margin-bottom:8px;" />
      <p>${project.desc}</p>
      <div><b>Tech Stack:</b> ${project.stack}</div>
      <a href="${project.link}" target="_blank" class="btn primary" style="margin-top:10px;">Live Demo</a>
    `;
    modalBackdrop.style.display = 'flex';
  }, 500);
}
modalClose.onclick = () => { modalBackdrop.style.display = 'none'; };
modalBackdrop.onclick = e => { if(e.target===modalBackdrop) modalBackdrop.style.display = 'none'; };
// Attach modal to project cards
const projectData = [
  { title:'Advance — Bankist (DOM)', img:'images/project-1.jpg', desc:'DOM-based banking simulation with realtime calculations.', stack:'JavaScript, DOM, CSS', link:'https://advance-dom.netlify.app' },
  { title:'PlayWithText App', img:'images/project 2 i.jpg', desc:'React-based text transformation tool.', stack:'React, JavaScript, CSS', link:'https://playwithtext.netlify.app' },
  { title:'Invoice Bot (UiPath)', img:'images/invoice-bot.jpg', desc:'Automated invoice extraction and GL posting with validation rules.', stack:'UiPath, RPA', link:'#' }
];
projectCards.forEach((card, i) => {
  card.style.cursor = 'pointer';
  card.onclick = () => openProjectModal(projectData[i]);
});

// === Testimonials Carousel ===
const testimonials = [
  { text: 'Harsh is a top-tier SDET. His automation skills saved us countless hours!', author: 'A. Manager, Cognizant' },
  { text: 'His attention to detail and passion for quality is unmatched.', author: 'S. Lead, Bytexus' },
  { text: 'A true team player and automation expert.', author: 'QA Director' }
];
let testimonialIdx = 0;
const carousel = document.getElementById('testimonials-carousel');
function renderTestimonial(idx) {
  carousel.innerHTML = `<div class="testimonial">${testimonials[idx].text}<div class="testimonial-author">— ${testimonials[idx].author}</div></div>
    <div class="carousel-controls">
      <button class="carousel-btn" id="prev-t">Prev</button>
      <button class="carousel-btn" id="next-t">Next</button>
    </div>`;
  document.getElementById('prev-t').onclick = () => { testimonialIdx = (testimonialIdx-1+testimonials.length)%testimonials.length; renderTestimonial(testimonialIdx); };
  document.getElementById('next-t').onclick = () => { testimonialIdx = (testimonialIdx+1)%testimonials.length; renderTestimonial(testimonialIdx); };
}
if(carousel) renderTestimonial(testimonialIdx);

// === Skills Graph (Chart.js) ===
window.addEventListener('DOMContentLoaded', () => {
  if(window.Chart && document.getElementById('ai-skills-graph')) {
    const ctx = document.createElement('canvas');
    document.getElementById('ai-skills-graph').innerHTML = '';
    document.getElementById('ai-skills-graph').appendChild(ctx);
    new Chart(ctx, {
      type: 'radar',
      data: {
        labels: ['Selenium', 'TestNG', 'RestAssured', 'UiPath', 'SQL', 'React', 'API Testing'],
        datasets: [{
          label: 'Skill Level',
          data: [9,8,8,7,7,6,6],
          backgroundColor: 'rgba(139,92,246,0.2)',
          borderColor: '#8b5cf6',
          pointBackgroundColor: '#06b6d4',
        }]
      },
      options: { responsive:true, plugins:{legend:{display:false}}, scales:{r:{min:0,max:10,ticks:{stepSize:2}}} }
    });
  }
});

// === Timeline Reveal on Scroll ===
function revealTimeline() {
  document.querySelectorAll('.timeline-item').forEach(item => {
    const rect = item.getBoundingClientRect();
    if(rect.top < window.innerHeight-60) item.classList.add('visible');
  });
}
window.addEventListener('scroll', revealTimeline);
window.addEventListener('DOMContentLoaded', revealTimeline);

// === Microinteractions: Ripple Effect ===
function addRipple(e) {
  const btn = e.currentTarget;
  const circle = document.createElement('span');
  circle.className = 'ripple';
  circle.style.left = `${e.offsetX}px`;
  circle.style.top = `${e.offsetY}px`;
  btn.appendChild(circle);
  setTimeout(()=>circle.remove(), 600);
}
document.querySelectorAll('.btn, .filter-btn, .carousel-btn').forEach(btn => {
  btn.addEventListener('click', addRipple);
});

// === Sound Effects ===
let soundEnabled = true;
const clickSound = new Audio('https://cdn.pixabay.com/audio/2022/07/26/audio_124bfae7b2.mp3');
const muteBtn = document.getElementById('mute-btn');
if(muteBtn) {
  muteBtn.onclick = () => {
    soundEnabled = !soundEnabled;
    muteBtn.innerHTML = soundEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
  };
}
document.body.addEventListener('click', e => {
  if(soundEnabled && (e.target.classList.contains('btn') || e.target.classList.contains('filter-btn') || e.target.classList.contains('carousel-btn'))) {
    clickSound.currentTime = 0; clickSound.play();
  }
}, true);

// === Spinner Utility ===
function showSpinner(show) {
  document.getElementById('global-spinner').style.display = show ? 'block' : 'none';
}

// === Contact Form Validation ===
const contactForm = document.getElementById('contact-form');
const contactFeedback = document.getElementById('contact-feedback');
if(contactForm) {
  contactForm.onsubmit = e => {
    e.preventDefault();
    showSpinner(true);
    setTimeout(() => {
      showSpinner(false);
      contactFeedback.textContent = 'Thank you! Your message has been sent.';
      contactForm.reset();
    }, 1200);
  };
}
