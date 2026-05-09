/* ==============================
   THEME TOGGLE
   ============================== */
const themeToggleBtn = document.getElementById('theme-toggle');
const htmlElement = document.documentElement;

const setTheme = (theme) => {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    if (themeToggleBtn) {
        themeToggleBtn.innerHTML = theme === 'dark' ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
    }
};

if (themeToggleBtn) {
    const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(savedTheme);

    themeToggleBtn.addEventListener('click', () => {
        setTheme(htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
}

/* ==============================
   UI INTERACTIONS
   ============================== */

// Mobile Menu Toggle
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => navMenu.classList.add('show-menu'));
}

if (navClose && navMenu) {
    navClose.addEventListener('click', () => navMenu.classList.remove('show-menu'));
}

navLinks.forEach(link => {
    link.addEventListener('click', () => navMenu?.classList.remove('show-menu'));
});

// Sticky Header & Nav CTA
const header = document.getElementById('header');
const navCta = document.getElementById('nav-cta');

window.addEventListener('scroll', () => {
    const isScrolled = window.scrollY >= 50;
    if (header) {
        header.style.boxShadow = isScrolled ? '0 4px 15px rgba(0,0,0,0.1)' : 'none';
    }
    if (navCta) {
        navCta.style.display = isScrolled ? 'inline-flex' : 'none';
    }
});

/* ==============================
   GSAP ANIMATIONS
   ============================== */
document.addEventListener("DOMContentLoaded", () => {
    if (typeof gsap === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Hero Section
    if (document.querySelector('.gsap-hero')) {
        const heroTimeline = gsap.timeline();
        heroTimeline.fromTo(".gsap-hero", 
            { y: 50, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
        );
        if (document.querySelector('.gsap-mockup')) {
            heroTimeline.fromTo(".gsap-mockup", 
                { x: 100, opacity: 0 }, 
                { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
                "-=0.8"
            );
        }
    }

    // General Fade Up
    gsap.utils.toArray('.gsap-fade-up').forEach(section => {
        gsap.fromTo(section, 
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 1, ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    });

    // Sections Stagger Helpers
    const animateStagger = (target, trigger) => {
        if (document.querySelector(target) && document.querySelector(trigger)) {
            gsap.fromTo(target, 
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
                    scrollTrigger: {
                        trigger: trigger,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        }
    };

    animateStagger(".gsap-service", ".services-container");
    animateStagger(".gsap-portfolio", ".portfolio-container");
    animateStagger(".gsap-pricing", ".pricing-container");

    // Features Stagger
    if (document.querySelector('.gsap-feature')) {
        gsap.fromTo(".gsap-feature", 
            { scale: 0.8, opacity: 0 },
            {
                scale: 1, opacity: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.7)",
                scrollTrigger: {
                    trigger: ".features-container",
                    start: "top 85%",
                    toggleActions: "play none none reverse"
                }
            }
        );
    }

    // Process Animation
    if (document.querySelector('.process-container')) {
        gsap.fromTo(".gsap-process", 
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.25, ease: "power2.out",
                scrollTrigger: { trigger: ".process-container", start: "top 80%" }
            }
        );

        if (document.getElementById('process-line-fill')) {
            gsap.to("#process-line-fill", {
                width: "100%",
                duration: 1.5,
                ease: "power1.inOut",
                scrollTrigger: { trigger: ".process-container", start: "top 70%" }
            });
        }
    }

    // Portfolio Hover & Fullscreen
    document.querySelectorAll('.portfolio-card').forEach(card => {
        const video = card.querySelector('.hover-play');
        if (video) {
            card.addEventListener('mouseenter', () => video.play().catch(() => {}));
            
            card.addEventListener('mouseleave', () => {
                // Don't pause if currently in fullscreen
                if (!document.fullscreenElement) {
                    video.pause();
                }
            });

            // Click to open fullscreen
            card.addEventListener('click', (e) => {
                e.preventDefault();
                if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.webkitRequestFullscreen) { /* Safari */
                    video.webkitRequestFullscreen();
                }
            });
        }
    });
});
