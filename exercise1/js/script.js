// DOM Elements
const water = document.getElementById('water');
const yearDisplay = document.getElementById('current-year');
const progressDisplay = document.getElementById('progress');
const cityCards = document.querySelectorAll('.city-card');
const timelineSections = document.querySelectorAll('.timeline');

// Configuration
const START_YEAR = 2024;
const END_YEAR = 2100;
const MAX_WATER_HEIGHT = 85; // Maximum water height percentage

// Calculate scroll progress (0 to 1)
function getScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    return Math.min(scrollTop / docHeight, 1);
}

// Update water level based on scroll
function updateWaterLevel(progress) {
    const waterHeight = progress * MAX_WATER_HEIGHT;
    water.style.height = `${waterHeight}%`;
}

// Update year display based on scroll
function updateYear(progress) {
    const yearRange = END_YEAR - START_YEAR;
    const currentYear = Math.floor(START_YEAR + (progress * yearRange));
    yearDisplay.textContent = currentYear;
}

// Update progress percentage
function updateProgress(progress) {
    progressDisplay.textContent = Math.floor(progress * 100);
}

// Check if element is in viewport
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    return (
        rect.top < windowHeight * 0.75 &&
        rect.bottom > windowHeight * 0.25
    );
}

// Check if element is submerged (below water line)
function isSubmerged(element, waterHeight) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight;
    const waterLine = windowHeight - (windowHeight * (waterHeight / 100));
    return rect.top > waterLine;
}

// Update city card visibility and submersion
function updateCityCards(waterHeight) {
    cityCards.forEach(card => {
        // Check if card is visible in viewport
        if (isInViewport(card)) {
            card.classList.add('visible');
        }

        // Check if card is submerged
        if (isSubmerged(card, waterHeight)) {
            card.classList.add('submerged');
        } else {
            card.classList.remove('submerged');
        }
    });
}

// Main scroll handler
function handleScroll() {
    const progress = getScrollProgress();
    const waterHeight = progress * MAX_WATER_HEIGHT;

    updateWaterLevel(progress);
    updateYear(progress);
    updateProgress(progress);
    updateCityCards(waterHeight);
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        if (!inThrottle) {
            func.apply(this, arguments);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Initialize
function init() {
    // Initial call
    handleScroll();

    // Scroll event with throttling
    window.addEventListener('scroll', throttle(handleScroll, 16));

    // Handle resize
    window.addEventListener('resize', throttle(handleScroll, 100));
}

// Run when DOM is ready
document.addEventListener('DOMContentLoaded', init);
