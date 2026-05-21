/* ============================================================
   PRIMETECH MAIN.JS — Cinematic Interaction Engine
   ============================================================ */

/* ==========================================
   1. THEME TOGGLE SYSTEM (Light Theme Default)
   ========================================== */
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlEl = document.documentElement;

const setTheme = (theme) => {
  htmlEl.setAttribute('data-theme', theme);
  localStorage.setItem('pt-theme', theme);
  if (themeToggleBtn) {
    themeToggleBtn.innerHTML =
      theme === 'dark' ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
  }
};

// Restore saved theme or default to light
const savedTheme = localStorage.getItem('pt-theme') || 'light';
setTheme(savedTheme);

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    const current = htmlEl.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });
}

/* ==========================================
   2. MOBILE NAVIGATION
   ========================================== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav-link');

const openNav = () => navMenu?.classList.add('show-menu');
const closeNav = () => navMenu?.classList.remove('show-menu');

navToggle?.addEventListener('click', openNav);
navClose?.addEventListener('click', closeNav);
navLinks.forEach(link => link.addEventListener('click', closeNav));

/* ==========================================
   3. SCROLL-AWARE NAVIGATION — ALWAYS VISIBLE
   ========================================== */
const header = document.getElementById('header');
let scrollTicking = false;

const updateNav = () => {
  if (!header) { scrollTicking = false; return; }
  // Only switch between transparent and glass — never hide
  if (window.scrollY > 60) {
    header.classList.add('header-scrolled');
  } else {
    header.classList.remove('header-scrolled');
  }
  scrollTicking = false;
};

window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(updateNav);
    scrollTicking = true;
  }
}, { passive: true });

// Run once on load to set correct initial state
updateNav();


/* ==========================================
   4. LENIS SMOOTH MOMENTUM SCROLLING
   ========================================== */
let lenis;

const initLenis = () => {
  if (typeof Lenis === 'undefined') return;

  lenis = new Lenis({
    duration: 1.15,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.9,
    infinite: false,
  });

  // RAF loop
  const raf = (time) => {
    lenis.raf(time);
    requestAnimationFrame(raf);
  };
  requestAnimationFrame(raf);

  // Sync with GSAP ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
};

/* ==========================================
   5. CINEMATIC HERO REVEAL SEQUENCER
   ========================================== */
const runHeroReveal = () => {
  // Animate hero headline lines (clip from below)
  const lines = document.querySelectorAll('.hero-line-inner');
  lines.forEach((inner, i) => {
    setTimeout(() => {
      inner.style.transition = `transform 1.1s cubic-bezier(0.16, 1, 0.3, 1)`;
      inner.style.transform = 'translateY(0%)';
    }, 200 + i * 130);
  });

  // Animate hero-anim elements (fade + slide)
  const anims = document.querySelectorAll('.hero-anim');
  anims.forEach(el => {
    const delayIndex = parseInt(el.getAttribute('data-delay') || '0');
    setTimeout(() => {
      el.classList.add('is-ready');
    }, 100 + delayIndex * 110);
  });

  // Reveal floating visual panel
  const panel = document.querySelector('.hero-visual-panel');
  if (panel) {
    setTimeout(() => {
      panel.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1), transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      panel.style.opacity = '1';
      panel.style.transform = 'translateY(-50%) translateX(0)';
    }, 600);
    panel.style.opacity = '0';
    panel.style.transform = 'translateY(-50%) translateX(40px)';
  }
};

/* ==========================================
   6. 3D FLOATING SHAPES — PARALLAX SYSTEM
   ========================================== */
const initFloatingShapes = () => {
  const shapes = document.querySelectorAll('.float-shape');
  if (!shapes.length) return;

  // Fade shapes in after a short delay
  setTimeout(() => {
    shapes.forEach(s => s.classList.add('is-visible'));
  }, 800);

  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let scrollY = 0;
  let rafId;

  // Smooth mouse tracking
  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2; // -1 to 1
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });

  // Lerp helper
  const lerp = (a, b, t) => a + (b - a) * t;

  const tick = () => {
    // Smooth damp the mouse
    targetX = lerp(targetX, mouseX, 0.04);
    targetY = lerp(targetY, mouseY, 0.04);

    shapes.forEach(shape => {
      const depth = parseFloat(shape.getAttribute('data-depth') || '0.3');
      const moveX = targetX * depth * 35;
      const moveY = targetY * depth * 20 - scrollY * depth * 0.12;

      // Read existing CSS animation by only adding transform override on top
      shape.style.setProperty('--px-x', `${moveX.toFixed(2)}px`);
      shape.style.setProperty('--px-y', `${moveY.toFixed(2)}px`);
    });

    rafId = requestAnimationFrame(tick);
  };

  tick();
};

/* Because CSS animations and transform can conflict,
   we use a wrapper translate on each shape via a CSS var */
const injectShapeTranslate = () => {
  const style = document.createElement('style');
  style.textContent = `
    .float-shape {
      transform: translate(var(--px-x, 0px), var(--px-y, 0px));
    }
    .float-shape--ring   { animation: floatRotate 18s linear infinite; transform: translate(var(--px-x, 0px), var(--px-y, 0px)) rotate(var(--rot, 0deg)); }
    .float-shape--cube   { animation: none; }
    .float-shape--torus  { animation: none; }
    .float-shape--sphere { animation: none; }
    .float-shape--dot-grid { animation: none; }
    .float-shape--blob   { animation: blobMorph 20s ease-in-out infinite; }
    .float-shape--line   { animation: none; }
  `;
  document.head.appendChild(style);
};

/* ==========================================
   7. GSAP SCROLL ANIMATIONS
   ========================================== */
const initScrollAnimations = () => {
  if (typeof gsap === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Generic fade-up trigger
  gsap.utils.toArray('.gsap-fade-up').forEach(el => {
    gsap.fromTo(el,
      { y: 55, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.1, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' }
      }
    );
  });

  // Service cards stagger
  if (document.querySelector('.service-card-new')) {
    gsap.fromTo('.service-card-new',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', stagger: 0.12,
        scrollTrigger: { trigger: '.services-grid', start: 'top 86%' }
      }
    );
  }

  // Why Choose Us cards stagger
  if (document.querySelector('.why-card')) {
    gsap.fromTo('.why-card',
      { y: 40, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 0.85, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: '.why-container', start: 'top 86%' }
      }
    );
  }

  // Pricing cards stagger
  if (document.querySelector('.pricing-card-new')) {
    gsap.fromTo('.pricing-card-new',
      { y: 50, opacity: 0 },
      {
        y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', stagger: 0.14,
        scrollTrigger: { trigger: '.pricing-grid', start: 'top 86%' }
      }
    );
  }

  // Portfolio rows
  if (document.querySelector('.portfolio-row-new')) {
    gsap.utils.toArray('.portfolio-row-new').forEach(row => {
      gsap.fromTo(row,
        { y: 70, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 1.2, ease: 'power4.out',
          scrollTrigger: { trigger: row, start: 'top 87%' }
        }
      );
    });
  }

  // Process fill line
  const fillLine = document.getElementById('process-line-fill');
  const processWrapper = document.querySelector('.process-wrapper');
  if (fillLine && processWrapper) {
    gsap.to(fillLine, {
      width: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: processWrapper,
        start: 'top 75%',
        end: 'bottom 60%',
        scrub: true,
      }
    });

    gsap.utils.toArray('.process-step-new').forEach(step => {
      gsap.fromTo(step,
        { y: 30, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: 'power3.out',
          scrollTrigger: {
            trigger: step,
            start: 'top 87%',
            onEnter: () => step.classList.add('active'),
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }

  // Scroll-parallax on hero visual panel
  const visualPanel = document.querySelector('.hero-visual-panel');
  if (visualPanel) {
    gsap.to(visualPanel, {
      yPercent: 12,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.2,
      }
    });
  }
};

/* ==========================================
   8. MOUSE-TRACKING GLOW ON CARDS
   ========================================== */
const initCardGlow = () => {
  const cards = document.querySelectorAll(
    '.service-card-new, .pricing-card-new, .why-card, .internship-banner'
  );
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    });
  });
};

/* ==========================================
   9. SCROLL INDICATOR AUTO-HIDE
   ========================================== */
const initScrollIndicator = () => {
  const indicator = document.querySelector('.scroll-invitation');
  if (!indicator) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 120) {
      indicator.classList.add('hidden');
    } else {
      indicator.classList.remove('hidden');
    }
  }, { passive: true });

  indicator.addEventListener('click', () => {
    const target = document.getElementById('services');
    if (lenis && target) {
      lenis.scrollTo(target);
    } else {
      target?.scrollIntoView({ behavior: 'smooth' });
    }
  });
};

/* ==========================================
   10. INTERACTIVE ORB — mouse tracking
   ========================================== */
const initOrbTracking = () => {
  const orbs = document.querySelectorAll('.glow-orb');
  if (!orbs.length || typeof gsap === 'undefined') return;

  window.addEventListener('mousemove', (e) => {
    const mx = e.clientX / window.innerWidth - 0.5;
    const my = e.clientY / window.innerHeight - 0.5;

    orbs.forEach((orb, i) => {
      const depth = (i + 1) * 40;
      gsap.to(orb, {
        x: mx * depth,
        y: my * depth,
        duration: 2.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });
  }, { passive: true });
};

/* ==========================================
   11. PORTFOLIO CATEGORY FILTER
   ========================================== */
const initPortfolioFilter = () => {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const rows = document.querySelectorAll('.portfolio-row-new');
  if (!filterBtns.length) return;

  const filter = (cat) => {
    let visible = 0;
    rows.forEach(row => {
      const match = cat === 'all' || row.dataset.category === cat;
      if (match) {
        row.style.display = 'flex';
        row.style.opacity = '0';
        row.style.transform = 'translateY(30px)';
        setTimeout(() => {
          row.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }, 50 + visible * 60);

        if (visible % 2 === 1) row.classList.add('row-reverse');
        else row.classList.remove('row-reverse');
        visible++;
      } else {
        row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        row.style.opacity = '0';
        row.style.transform = 'translateY(20px)';
        setTimeout(() => { row.style.display = 'none'; }, 300);
      }
    });

    setTimeout(() => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    }, 200);
  };

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      filter(btn.dataset.filter);
    });
  });

  // Init
  if (rows.length) filter('all');
};

/* ==========================================
   12. SKELETON / LAZY MEDIA LOADER
   ========================================== */
const initSkeletonLoader = () => {
  const wrappers = document.querySelectorAll(
    '.mockup-wrapper, .portfolio-media-box, .portfolio-img-wrap, .hero-panel-img'
  );

  wrappers.forEach(wrap => {
    const img = wrap.querySelector('img');
    const video = wrap.querySelector('video');

    const done = () => {
      wrap.classList.remove('skeleton');
      wrap.classList.add('loaded');
    };

    if (img) {
      if (img.complete && img.naturalWidth) { done(); }
      else { img.addEventListener('load', done); img.addEventListener('error', done); }
    } else if (video) {
      if (video.readyState >= 1) { done(); }
      video.addEventListener('loadedmetadata', done);
      video.addEventListener('loadeddata', done);
      video.addEventListener('canplay', done);
      video.addEventListener('error', done);
    }
  });
};

/* ==========================================
   13. VIDEO HOVER + FULLSCREEN CONTROLLER
   ========================================== */
const initVideoController = () => {
  const containers = document.querySelectorAll(
    '.portfolio-media-box, .portfolio-img-wrap'
  );

  containers.forEach(con => {
    const video = con.querySelector('video');
    if (!video) return;

    video.muted = true;
    video.loop = true;
    video.playsInline = true;

    con.addEventListener('mouseenter', () => video.play().catch(() => { }));
    con.addEventListener('mouseleave', () => video.pause());

    video.style.cursor = 'zoom-in';
    video.addEventListener('click', (e) => {
      e.stopPropagation();
      const req = video.requestFullscreen || video.webkitRequestFullscreen || video.msRequestFullscreen;
      if (req) req.call(video);
      video.muted = false;
      video.play().catch(() => { });
    });

    const onFSChange = () => {
      const fs = document.fullscreenElement || document.webkitFullscreenElement;
      if (!fs) video.muted = true;
    };
    document.addEventListener('fullscreenchange', onFSChange);
    document.addEventListener('webkitfullscreenchange', onFSChange);
  });
};

/* ==========================================
   BOOT — DOMContentLoaded
   ========================================== */

/* Hero portfolio showcase — auto-cycles with progress bars */
const initHeroShowcase = () => {
  const slides = document.querySelectorAll('.showcase-slide');
  const progItems = document.querySelectorAll('.showcase-prog-item');
  if (!slides.length) return;

  let current = 0;
  let timer = null;
  const frame = document.getElementById('showcaseFrame');
  const INTERVAL = 3500;

  const resetProgress = () => {
    progItems.forEach(p => {
      p.classList.remove('is-active');
      // Force reflow so animation restarts cleanly
      const fill = p.querySelector('.showcase-prog-fill');
      if (fill) { fill.style.animation = 'none'; fill.getBoundingClientRect(); fill.style.animation = ''; }
    });
  };

  const goTo = (index) => {
    slides[current].classList.remove('is-active');
    resetProgress();
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    if (progItems[current]) progItems[current].classList.add('is-active');
  };

  const startCycle = () => {
    timer = setInterval(() => goTo(current + 1), INTERVAL);
  };
  const stopCycle = () => clearInterval(timer);

  // Progress bar click navigation
  progItems.forEach(item => {
    item.addEventListener('click', () => {
      stopCycle();
      goTo(parseInt(item.dataset.target));
      startCycle();
    });
  });

  // Pause on hover
  frame?.addEventListener('mouseenter', stopCycle);
  frame?.addEventListener('mouseleave', startCycle);

  // Init first active
  if (progItems[0]) progItems[0].classList.add('is-active');
  startCycle();
};

/* Marquee section — viewport entrance animation */
const initMarqueeSection = () => {
  const section = document.querySelector('.marquee-section');
  if (!section) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        section.classList.add('is-visible');
        observer.disconnect();
      }
    },
    { threshold: 0.15 }
  );

  observer.observe(section);
};

/* ==========================================
   14. FAQ ACCORDION INTERACTION
   ========================================== */
const initFAQ = () => {
  const faqQuestions = document.querySelectorAll('.faq-question');

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const faqItem = btn.closest('.faq-item');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Toggle current
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        faqItem.classList.remove('is-open');
      } else {
        btn.setAttribute('aria-expanded', 'true');
        faqItem.classList.add('is-open');
      }
    });
  });
};


document.addEventListener('DOMContentLoaded', () => {
  initLenis();

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      runHeroReveal();
    });
  });

  injectShapeTranslate();
  initFloatingShapes();

  setTimeout(() => { initScrollAnimations(); }, 100);

  initCardGlow();
  initScrollIndicator();
  initOrbTracking();
  initPortfolioFilter();
  initSkeletonLoader();
  initVideoController();
  initHeroShowcase();
  initMarqueeSection();
  initInternStarfield();
  initSplitHeroParallax();
  initFAQ();
});

/* ============================================================
   INTERNSHIP SECTION — CANVAS STARFIELD ANIMATION
   ============================================================ */
function initInternStarfield() {
  const canvas = document.getElementById('internStarfield');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const section = canvas.closest('.internship');
  if (!section) return;

  let W, H, stars = [], shootingStars = [], raf;

  /* ─── Resize handler ─── */
  function resize() {
    W = canvas.width = section.offsetWidth;
    H = canvas.height = section.offsetHeight;
    initStars();
  }

  /* ─── Get theme-aware star colour ─── */
  function starColor(alpha) {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark
      ? `rgba(255, 255, 255, ${alpha})`
      : `rgba(200, 220, 255, ${alpha})`;
  }

  /* ─── Create star pool ─── */
  function initStars() {
    const count = Math.round((W * H) / 3800);
    stars = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.2,
      base: Math.random() * 0.55 + 0.15,   // base opacity
      twinkleSpeed: Math.random() * 0.02 + 0.004,
      twinkleOffset: Math.random() * Math.PI * 2,
      glowColor: Math.random() > 0.7
        ? `rgba(120, 160, 255,`   // blue tint
        : `rgba(255, 255, 255,`,  // pure white
    }));
  }

  /* ─── Shooting star spawner ─── */
  function spawnShootingStar() {
    if (shootingStars.length >= 3) return;
    shootingStars.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.4,
      len: Math.random() * 160 + 80,
      speed: Math.random() * 5 + 4,
      angle: (Math.PI / 5) + Math.random() * (Math.PI / 8),
      life: 0,
      maxLife: Math.random() * 60 + 40,
      width: Math.random() * 1.5 + 0.5,
    });
  }

  let frame = 0;

  /* ─── Main draw loop ─── */
  function draw() {
    ctx.clearRect(0, 0, W, H);
    frame++;

    /* Draw twinkling stars */
    stars.forEach(s => {
      const t = frame * s.twinkleSpeed + s.twinkleOffset;
      const alpha = s.base + Math.sin(t) * (s.base * 0.6);
      const a = Math.max(0.02, Math.min(1, alpha));

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);

      /* Glow for larger stars */
      if (s.r > 1.1) {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 3);
        g.addColorStop(0, s.glowColor + `${a})`);
        g.addColorStop(1, s.glowColor + '0)');
        ctx.fillStyle = g;
        ctx.arc(s.x, s.y, s.r * 3, 0, Math.PI * 2);
      } else {
        ctx.fillStyle = starColor(a);
      }
      ctx.fill();
    });

    /* Spawn shooting star occasionally */
    if (frame % 150 === 0 && Math.random() > 0.4) spawnShootingStar();

    /* Draw & age shooting stars */
    shootingStars = shootingStars.filter(ss => {
      ss.life++;
      const progress = ss.life / ss.maxLife;
      const alpha = progress < 0.3 ? progress / 0.3 : 1 - (progress - 0.3) / 0.7;

      const tailX = ss.x - Math.cos(ss.angle) * ss.len * progress;
      const tailY = ss.y - Math.sin(ss.angle) * ss.len * progress;
      const headX = ss.x + Math.cos(ss.angle) * ss.speed * ss.life;
      const headY = ss.y + Math.sin(ss.angle) * ss.speed * ss.life;

      const grad = ctx.createLinearGradient(tailX, tailY, headX, headY);
      grad.addColorStop(0, `rgba(255,255,255,0)`);
      grad.addColorStop(0.6, `rgba(180,200,255,${alpha * 0.4})`);
      grad.addColorStop(1, `rgba(255,255,255,${alpha})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(headX, headY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = ss.width;
      ctx.stroke();

      return ss.life < ss.maxLife;
    });

    raf = requestAnimationFrame(draw);
  }

  /* ─── Pause when section is off-screen ─── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { if (!raf) draw(); }
      else { cancelAnimationFrame(raf); raf = null; }
    });
  }, { threshold: 0.05 });
  io.observe(section);

  /* ─── Init ─── */
  resize();
  window.addEventListener('resize', resize);

  /* ─── Theme change → re-colour stars ─── */
  const themeBtn = document.getElementById('theme-toggle');
  themeBtn?.addEventListener('click', () => {
    // Stars colour is re-evaluated per frame, so no action needed.
    // Just re-init for density difference between themes if desired.
    setTimeout(initStars, 50);
  });
}

/* ============================================================
   SUBPAGE SPLIT-HERO PARALLAX INTERACTION
   ============================================================ */
function initSplitHeroParallax() {
  const hero = document.querySelector('.pg-hero--split');
  const orbitWrapper = document.querySelector('.interactive-orbit-wrapper');
  if (!hero || !orbitWrapper) return;

  // Check prefers-reduced-motion
  const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (mediaQuery.matches) return;

  const panels = orbitWrapper.querySelectorAll('.floating-panel');
  const center = orbitWrapper.querySelector('.orbit-center');

  let mouseX = 0, mouseY = 0;
  let currentX = 0, currentY = 0;

  hero.addEventListener('mousemove', (e) => {
    const rect = hero.getBoundingClientRect();
    // Normalize coordinates around center of hero section
    mouseX = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
    mouseY = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
  }, { passive: true });

  hero.addEventListener('mouseleave', () => {
    mouseX = 0;
    mouseY = 0;
  });

  const lerp = (a, b, t) => a + (b - a) * t;

  function tick() {
    currentX = lerp(currentX, mouseX, 0.06);
    currentY = lerp(currentY, mouseY, 0.06);

    // Apply parallax offset to floating panels via CSS Custom Properties
    panels.forEach((panel) => {
      const isSpeed = panel.classList.contains('panel-speed-stat');
      const factor = isSpeed ? 30 : -30;
      panel.style.setProperty('--para-x', `${(currentX * factor).toFixed(1)}px`);
      panel.style.setProperty('--para-y', `${(currentY * factor).toFixed(1)}px`);
    });

    // Apply subtle parallax to orbit center
    if (center) {
      center.style.transform = `translate(${(currentX * 15).toFixed(1)}px, ${(currentY * 15).toFixed(1)}px)`;
    }

    requestAnimationFrame(tick);
  }

  tick();
}
