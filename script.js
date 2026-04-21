/* ============================================================
   PORTFÓLIO — ANA JÚLIA JANNUZZI
   script.js — Interações, animações e comportamentos
   ============================================================ */

/* ── 1. CURSOR PERSONALIZADO ──────────────────────────────── */
const cursor    = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

// Segue o mouse suavemente
document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  // Dot segue instantaneamente
  cursorDot.style.left = mouseX + 'px';
  cursorDot.style.top  = mouseY + 'px';
});

// Suaviza o cursor maior
function animateCursor() {
  const speed = 0.14;
  cursorX += (mouseX - cursorX) * speed;
  cursorY += (mouseY - cursorY) * speed;

  if (cursor) {
    cursor.style.left = cursorX + 'px';
    cursor.style.top  = cursorY + 'px';
  }

  requestAnimationFrame(animateCursor);
}
animateCursor();

// Efeito hover em elementos clicáveis
const hoverEls = document.querySelectorAll('a, button, .tech-card, .projeto-card, .contato-card, .highlight-card');
hoverEls.forEach(el => {
  el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hovering'));
  el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hovering'));
});


/* ── 2. NAVBAR — SCROLL + HAMBURGER ──────────────────────── */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Adiciona classe .scrolled quando rolar a página
window.addEventListener('scroll', () => {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Atualiza link ativo no menu
  updateActiveNavLink();
});

// Abre/fecha menu mobile
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Fecha o menu ao clicar em um link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// Fecha o menu ao clicar fora
document.addEventListener('click', (e) => {
  if (!navbar.contains(e.target)) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  }
});

// Destaca o link da seção visível
function updateActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-link');

  let currentId = '';
  sections.forEach(section => {
    const top = section.getBoundingClientRect().top;
    if (top <= 120) {
      currentId = section.id;
    }
  });

  links.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === `#${currentId}`) {
      link.style.color = 'var(--accent)';
    }
  });
}


/* ── 3. ANIMAÇÕES DE REVEAL NO SCROLL ──────────────────────── */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Delay em cascata para elementos em grupo
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.12,
    rootMargin: '0px 0px -50px 0px'
  }
);

// Aplica delays em cascata nos cards
function applyStaggerDelay(selector, delayStep = 120) {
  document.querySelectorAll(selector).forEach((el, i) => {
    el.dataset.delay = i * delayStep;
  });
}

// Stagger em cards de tecnologia
applyStaggerDelay('.tech-card', 80);
// Stagger em cards de projeto
applyStaggerDelay('.projeto-card', 150);
// Stagger em cards de contato
applyStaggerDelay('.contato-card', 100);
// Stagger nos highlights
applyStaggerDelay('.highlight-card', 100);

// Observa todos os elementos com classe .reveal
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));


/* ── 4. ANIMAÇÃO DAS BARRAS DE TECNOLOGIA ─────────────────── */
// Anima a barra de progresso quando o card fica visível
const techObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fills = entry.target.querySelectorAll('.tech-fill');
        fills.forEach((fill, i) => {
          const targetWidth = fill.style.width;
          fill.style.width = '0';
          setTimeout(() => {
            fill.style.width = targetWidth;
          }, 200 + i * 80);
        });
        techObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

// Observa a seção de tecnologias
const techSection = document.querySelector('.tecnologias');
if (techSection) techObserver.observe(techSection);


/* ── 5. SCROLL SUAVE (suporte extra para Safari antigo) ────── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const targetId = link.getAttribute('href');
    const target   = document.querySelector(targetId);
    if (!target) return;

    e.preventDefault();
    const offset = 80; // compensa navbar fixa
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;

    window.scrollTo({ top, behavior: 'smooth' });
  });
});


/* ── 6. EFEITO TYPING NO HERO ──────────────────────────────── */
// Pequeno efeito de digitação no subtitle do hero
function typeEffect(element, text, speed = 40) {
  let i = 0;
  element.textContent = '';

  function type() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  }

  setTimeout(type, 800); // delay inicial
}


/* ── 7. EFEITO PARALLAX LEVE NO HERO ──────────────────────── */
const heroGrid = document.querySelector('.hero-grid');

window.addEventListener('scroll', () => {
  if (!heroGrid) return;
  const scrolled = window.scrollY;
  heroGrid.style.transform = `translateY(${scrolled * 0.3}px)`;
});


/* ── 8. CONTADOR DO SCROLL INDICATOR ──────────────────────── */
// Atualiza o indicador visual de scroll da hero
const scrollBar = document.querySelector('.scroll-bar');

window.addEventListener('scroll', () => {
  if (!scrollBar) return;
  const maxScroll = document.body.scrollHeight - window.innerHeight;
  const progress  = (window.scrollY / maxScroll) * 100;
  scrollBar.style.width = `${Math.min(progress * 3, 60)}px`;
});


/* ── 9. HIGHLIGHT DE CARDS DE PROJETO AO HOVER ─────────────── */
// Efeito de brilho seguindo o mouse nos cards
document.querySelectorAll('.projeto-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x    = ((e.clientX - rect.left) / rect.width)  * 100;
    const y    = ((e.clientY - rect.top)  / rect.height) * 100;

    card.style.setProperty('--mouse-x', `${x}%`);
    card.style.setProperty('--mouse-y', `${y}%`);
  });
});


/* ── 10. EASTER EGG NO CONSOLE ─────────────────────────────── */
console.log(
  `%c
  ╔═══════════════════════════════════╗
  ║  Ana Júlia Jannuzzi — Portfólio  ║
  ║  Desenvolvedora Backend           ║
  ║  ADS — Foco em APIs & Sistemas    ║
  ╚═══════════════════════════════════╝
  `,
  'color: #71ecc8; font-family: monospace; font-size: 12px;'
);
console.log('%c👾 Olá, curioso(a)! Boas-vindas ao código.', 'color: #a78bfa; font-size: 13px;');


/* ── 11. FEEDBACK VISUAL AO CLICAR EM LINKS DO CONTATO ──────── */
document.querySelectorAll('.contato-card').forEach(card => {
  card.addEventListener('click', () => {
    card.style.transform = 'scale(0.97)';
    setTimeout(() => {
      card.style.transform = '';
    }, 150);
  });
});


/* ── 12. INICIALIZAÇÃO ─────────────────────────────────────── */
// Garante que a navbar inicie correta no reload com scroll
window.dispatchEvent(new Event('scroll'));