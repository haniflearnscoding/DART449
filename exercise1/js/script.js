// DOM Elements
const water = document.getElementById('water');
const yearDisplay = document.getElementById('current-year');
const progressDisplay = document.getElementById('progress');
const cityCards = document.querySelectorAll('.city-card');

// Configuration
const START_YEAR = 2024;
const END_YEAR = 2100;
const MAX_WATER_HEIGHT = 70;

// Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize GSAP animations
function initGSAP() {
    // Intro animations
    gsap.from('.intro h1', {
        y: 60,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.out'
    });

    gsap.from('.intro .subtitle', {
        y: 30,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out'
    });

    gsap.from('.intro .instruction, .intro .scroll-indicator', {
        opacity: 0,
        duration: 1,
        delay: 0.5
    });

    // Water level tied to scroll
    gsap.fromTo(water,
        {
            height: '0%',
            opacity: 0
        },
        {
            height: `${MAX_WATER_HEIGHT}%`,
            opacity: 1,
            ease: 'power1.in',
            scrollTrigger: {
                trigger: 'main',
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.5
            }
        }
    );

    // Water wave speed increases as it rises
    ScrollTrigger.create({
        trigger: 'main',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
            const waveSpeed = 4 - (self.progress * 2); // Speed up wave as water rises
            water.style.setProperty('--wave-duration', `${waveSpeed}s`);
        }
    });

    // Year and progress updates
    ScrollTrigger.create({
        trigger: 'main',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
            const progress = self.progress;
            const currentYear = Math.floor(START_YEAR + (progress * (END_YEAR - START_YEAR)));
            yearDisplay.textContent = currentYear;
            progressDisplay.textContent = Math.floor(progress * 100);
        }
    });

    // City cards animations
    cityCards.forEach((card) => {
        const image = card.querySelector('img');
        const dataOverlay = card.querySelector('.data-overlay');
        const year = dataOverlay.querySelector('h2');
        const stat = dataOverlay.querySelector('.stat');
        const impact = dataOverlay.querySelector('.impact');

        // Card fade in
        gsap.from(card, {
            y: 80,
            opacity: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });

        // Parallax on image
        gsap.to(image, {
            yPercent: 15,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            }
        });

        // Staggered text reveal
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top 65%',
                toggleActions: 'play none none reverse'
            }
        });

        tl.from(year, {
            y: 40,
            opacity: 0,
            duration: 0.8,
            ease: 'power2.out'
        })
        .from(stat, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.5')
        .from(impact, {
            y: 20,
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out'
        }, '-=0.4');

        // Fade out as scrolling past
        gsap.to(card, {
            opacity: 0.3,
            ease: 'none',
            scrollTrigger: {
                trigger: card,
                start: 'bottom 40%',
                end: 'bottom 10%',
                scrub: true
            }
        });
    });

    // Finale section
    const finale = document.querySelector('.finale');
    const finaleMessage = finale.querySelector('.message');
    const finaleH2 = finaleMessage.querySelector('h2');
    const finaleBigStat = finaleMessage.querySelector('.big-stat');
    const finaleTexts = finaleMessage.querySelectorAll('p:not(.big-stat)');

    const finaleTl = gsap.timeline({
        scrollTrigger: {
            trigger: finale,
            start: 'top 60%',
            toggleActions: 'play none none reverse'
        }
    });

    finaleTl.from(finaleH2, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: 'power2.out'
    })
    .from(finaleBigStat, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out'
    }, '-=0.5')
    .from(finaleTexts, {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
    }, '-=0.4');
}

// Restart button - water fills screen then returns to top
function initRestart() {
    const restartBtn = document.getElementById('restart');

    restartBtn.addEventListener('click', () => {
        // Disable scroll during transition
        document.body.style.overflow = 'hidden';

        // Get current water height before disabling ScrollTriggers
        const currentHeight = water.style.height || `${MAX_WATER_HEIGHT}%`;

        // Kill all ScrollTrigger animations on water
        ScrollTrigger.getAll().forEach(st => st.kill());

        // Ensure water stays at current position
        gsap.set(water, { height: currentHeight, opacity: 1 });

        // Fill screen with water
        gsap.to(water, {
            height: '100%',
            opacity: 1,
            duration: 0.8,
            ease: 'power2.inOut',
            onComplete: () => {
                // Scroll to top instantly (hidden by water)
                window.scrollTo(0, 0);

                // Update year display
                yearDisplay.textContent = START_YEAR;
                progressDisplay.textContent = '0';

                // Small delay then drain water
                setTimeout(() => {
                    gsap.to(water, {
                        height: '0%',
                        opacity: 0,
                        duration: 1,
                        ease: 'power2.out',
                        onComplete: () => {
                            // Re-enable scroll
                            document.body.style.overflow = '';

                            // Reinitialize all GSAP animations
                            initGSAP();
                        }
                    });
                }, 300);
            }
        });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initGSAP();
    initRestart();
});
