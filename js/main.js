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

    // Hero Section - Subtler & Snappier
    if (document.querySelector('.gsap-hero')) {
        const heroTimeline = gsap.timeline();
        heroTimeline.fromTo(".gsap-hero", 
            { y: 25, opacity: 0 }, 
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.12, ease: "power2.out" }
        );
        if (document.querySelector('.gsap-mockup')) {
            heroTimeline.fromTo(".gsap-mockup", 
                { x: 30, opacity: 0 }, 
                { x: 0, opacity: 1, duration: 0.8, ease: "power2.out" },
                "-=0.5"
            );
        }
    }

    // General Fade Up - Clean, Snappy & Play Once (prevents elements hiding on scroll up!)
    gsap.utils.toArray('.gsap-fade-up').forEach(section => {
        gsap.fromTo(section, 
            { y: 25, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.5, ease: "power1.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    });

    // Sections Stagger Helpers - Subtle Rise, Fast Play, Play Once
    const animateStagger = (target, trigger) => {
        if (document.querySelector(target) && document.querySelector(trigger)) {
            gsap.fromTo(target, 
                { y: 20, opacity: 0 },
                {
                    y: 0, opacity: 1, duration: 0.45, stagger: 0.1, ease: "power1.out",
                    scrollTrigger: {
                        trigger: trigger,
                        start: "top 85%",
                        toggleActions: "play none none none"
                    }
                }
            );
        }
    };

    animateStagger(".gsap-service", ".services-container");
    animateStagger(".gsap-portfolio", ".portfolio-rows-container");
    animateStagger(".gsap-pricing", ".pricing-container");

    // Features Stagger - Gentle Fade-up
    if (document.querySelector('.gsap-feature')) {
        gsap.fromTo(".gsap-feature", 
            { y: 15, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.4, stagger: 0.08, ease: "power1.out",
                scrollTrigger: {
                    trigger: ".features-container",
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );
    }

    // Process Animation - Minimalist Flow
    if (document.querySelector('.process-container')) {
        gsap.fromTo(".gsap-process", 
            { y: 15, opacity: 0 },
            {
                y: 0, opacity: 1, duration: 0.4, stagger: 0.12, ease: "power1.out",
                scrollTrigger: { 
                    trigger: ".process-container", 
                    start: "top 85%",
                    toggleActions: "play none none none"
                }
            }
        );

        if (document.getElementById('process-line-fill')) {
            gsap.to("#process-line-fill", {
                width: "100%",
                duration: 1,
                ease: "power2.out",
                scrollTrigger: { 
                    trigger: ".process-container", 
                    start: "top 80%",
                    toggleActions: "play none none none"
                }
            });
        }
    }

    // Portfolio Filtering and Dynamic Alternating Row Fix
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioRows = document.querySelectorAll('.portfolio-row');

    const filterProjects = (category) => {
        let visibleCount = 0;
        portfolioRows.forEach(row => {
            const matches = category === 'all' || row.getAttribute('data-category') === category;
            if (matches) {
                row.style.display = 'flex';
                // Delay slightly to trigger transition smoothly
                setTimeout(() => {
                    row.style.opacity = '1';
                    row.style.transform = 'translateY(0)';
                }, 50);

                // Dynamically alternate layout for visible rows
                if (visibleCount % 2 === 1) {
                    row.classList.add('row-reverse');
                } else {
                    row.classList.remove('row-reverse');
                }
                visibleCount++;
            } else {
                row.style.opacity = '0';
                row.style.transform = 'translateY(15px)';
                row.style.display = 'none';
            }
        });

        // REFRESH ScrollTrigger: recalculate heights instantly to prevent lower sections from hiding!
        setTimeout(() => {
            if (window.ScrollTrigger) {
                ScrollTrigger.refresh();
            }
        }, 150);
    };

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const category = btn.getAttribute('data-filter');
            filterProjects(category);
        });
    });

    // Initialize layout direction
    filterProjects('all');

    // Skeleton Loader and Lazy Loading State Manager
    const portfolioMedias = document.querySelectorAll('.portfolio-media, .portfolio-img-wrap');

    portfolioMedias.forEach(media => {
        const img = media.querySelector('img');
        const video = media.querySelector('video');

        if (img) {
            if (img.complete) {
                media.classList.remove('skeleton');
                media.classList.add('loaded');
            } else {
                img.addEventListener('load', () => {
                    media.classList.remove('skeleton');
                    media.classList.add('loaded');
                });
                img.addEventListener('error', () => {
                    media.classList.remove('skeleton');
                    media.classList.add('loaded');
                });
            }
        } else if (video) {
            const onVideoLoad = () => {
                media.classList.remove('skeleton');
                media.classList.add('loaded');
            };

            // Wait for metadata or first frames to avoid layout flashing
            video.addEventListener('loadeddata', onVideoLoad);
            video.addEventListener('loadedmetadata', onVideoLoad);
            video.addEventListener('canplay', onVideoLoad);
            video.addEventListener('error', onVideoLoad);
            
            if (video.readyState >= 1) {
                onVideoLoad();
            }
        }
    });

    // Video Hover-Play & Fullscreen Manager
    const videoContainers = document.querySelectorAll('.portfolio-media, .portfolio-img-wrap, .portfolio-card, .portfolio-row');
    
    videoContainers.forEach(container => {
        const video = container.querySelector('.portfolio-video');
        if (!video) return;

        // Ensure clean fallback state
        video.muted = true;
        video.loop = true;
        video.playsInline = true;

        // Hover Play / Pause
        container.addEventListener('mouseenter', () => {
            video.play().catch(err => {
                // Ignore autoplay/user-interaction blocks
            });
        });

        container.addEventListener('mouseleave', () => {
            video.pause();
        });

        // Click for Fullscreen with Unmute
        video.style.cursor = 'zoom-in'; // visually indicate zoom-ability
        video.title = 'Click to view fullscreen with sound';
        
        video.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card events
            
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) { /* Safari/iOS */
                video.webkitRequestFullscreen();
            } else if (video.msRequestFullscreen) { /* IE/Edge */
                video.msRequestFullscreen();
            }
            
            // Unmute in fullscreen for premium audio experience
            video.muted = false;
            video.play().catch(err => console.log(err));
        });

        // Auto-mute again when exiting fullscreen
        const handleFullscreenChange = () => {
            const isFullscreen = document.fullscreenElement || 
                                 document.webkitFullscreenElement || 
                                 document.msFullscreenElement;
            if (!isFullscreen) {
                video.muted = true;
            }
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('msfullscreenchange', handleFullscreenChange);
    });
});
