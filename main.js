/* ==============================
   THEME TOGGLE
   ============================== */
const htmlElement = document.documentElement;
const themeToggleBtn = document.getElementById('theme-toggle');
// Define theme toggle
function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    // Update toggle icon
    if (theme === 'dark') {
        themeToggleBtn.innerHTML = "<i class='bx bx-sun'></i>";
    } else {
        themeToggleBtn.innerHTML = "<i class='bx bx-moon'></i>";
    }
}

// Check local storage or system preference
const savedTheme = localStorage.getItem('theme');
const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme) {
    setTheme(savedTheme);
} else {
    setTheme(systemPrefersDark ? 'dark' : 'light');
}

themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
});

/* ==============================
   UI INTERACTIONS
   ============================== */

// Mobile Menu Toggle
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav-link');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.add('show-menu');
    });
}

if (navClose) {
    navClose.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
}

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('show-menu');
    });
});

// Sticky Header
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY >= 50) {
        header.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)';
        document.getElementById('nav-cta').style.display = 'inline-flex';
    } else {
        header.style.boxShadow = 'none';
        document.getElementById('nav-cta').style.display = 'none';
    }
});

/* ==============================
   GSAP ANIMATIONS
   ============================== */
document.addEventListener("DOMContentLoaded", (event) => {
    // Register ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Hero Section Animations
    const heroTimeline = gsap.timeline();
    
    heroTimeline.fromTo(".gsap-hero", 
        { y: 50, opacity: 0 }, 
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: "power3.out" }
    );
    
    heroTimeline.fromTo(".gsap-mockup", 
        { x: 100, opacity: 0 }, 
        { x: 0, opacity: 1, duration: 1.2, ease: "power3.out" },
        "-=0.8"
    );

    // Fade Up General Sections
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

    // Services Stagger
    gsap.fromTo(".gsap-service", 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
            scrollTrigger: {
                trigger: ".services-container",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Features Stagger
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

    // Portfolio Stagger
    gsap.fromTo(".gsap-portfolio", 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
            scrollTrigger: {
                trigger: ".portfolio-container",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Pricing Stagger
    gsap.fromTo(".gsap-pricing", 
        { y: 50, opacity: 0 },
        {
            y: 0, opacity: 1, duration: 0.8, stagger: 0.2, ease: "power2.out",
            scrollTrigger: {
                trigger: ".pricing-container",
                start: "top 80%",
                toggleActions: "play none none reverse"
            }
        }
    );

    // Process Line Animation
    const processContainer = document.querySelector('.process-container');
    if (processContainer) {
        // Stagger steps
        gsap.fromTo(".gsap-process", 
            { y: 30, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.6, stagger: 0.25, ease: "power2.out",
                scrollTrigger: {
                    trigger: ".process-container",
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            }
        );

        // Fill line
        gsap.to("#process-line-fill", {
            width: "100%",
            duration: 1.5,
            ease: "power1.inOut",
            scrollTrigger: {
                trigger: ".process-container",
                start: "top 70%",
                toggleActions: "play none none none"
            }
        });
    }

    // ==============================
    // PORTFOLIO VIDEO HOVER EFFECT
    // ==============================
    const portfolioCards = document.querySelectorAll('.portfolio-card');
    portfolioCards.forEach(card => {
        const video = card.querySelector('.hover-play');
        if (video) {
            card.addEventListener('mouseenter', () => {
                video.play().catch(e => console.log("Autoplay prevented:", e));
            });
            card.addEventListener('mouseleave', () => {
                video.pause();
            });
        }
    });
});
