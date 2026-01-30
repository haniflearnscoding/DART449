// State
let currentText = '';
let boxX = 0;
let boxY = 0;
let boxScale = 1;
let boxRotation = 0;

// Elements
const textDisplay = document.getElementById('text-display');
const styleBox = document.getElementById('style-box');
const currentKeyDisplay = document.getElementById('current-key');
const eventLog = document.getElementById('event-log');
const keyCapture = document.getElementById('key-capture');
const focusHint = document.getElementById('focus-hint');

// Colors for number keys
const colors = {
    '1': '#e74c3c',  // red
    '2': '#e67e22',  // orange
    '3': '#f1c40f',  // yellow
    '4': '#2ecc71',  // green
    '5': '#3498db',  // blue
    '6': '#9b59b6',  // purple
    '7': '#e91e63',  // pink
    '8': '#00bcd4',  // cyan
    '9': '#795548',  // brown
};

// Log helper
function log(type, message) {
    const time = new Date().toLocaleTimeString();
    const typeClass = type === 'text' ? 'log-text' : 'log-style';
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.innerHTML = `<span class="log-time">[${time}]</span> <span class="log-event">keydown</span> <span class="${typeClass}">${message}</span>`;
    eventLog.insertBefore(entry, eventLog.firstChild);
}

function clearLog() {
    eventLog.innerHTML = '<div class="log-entry" style="color:#888">Log cleared</div>';
}

// Keep focus on key capture
document.addEventListener('click', () => {
    keyCapture.focus();
    focusHint.textContent = 'Listening for keys...';
    focusHint.classList.add('active');
});

// Main keydown handler
document.addEventListener('keydown', (event) => {
    event.preventDefault();

    const key = event.key;
    const code = event.code;

    // Display current key
    currentKeyDisplay.innerHTML = `<span>${key}</span> <span style="font-size:1rem;color:#888">(${code})</span>`;

    // 1. TEXT CHANGES - Letter keys
    if (key.length === 1 && key.match(/[a-zA-Z]/)) {
        currentText += key.toUpperCase();
        if (currentText.length > 20) {
            currentText = currentText.slice(-20);
        }
        textDisplay.textContent = currentText;
        textDisplay.style.fontSize = `${Math.max(1, 2 - currentText.length * 0.05)}rem`;

        log('text', `Added "${key.toUpperCase()}" → "${currentText}"`);
    }

    // Backspace - remove last character
    if (key === 'Backspace' && currentText.length > 0) {
        const removed = currentText.slice(-1);
        currentText = currentText.slice(0, -1);
        textDisplay.textContent = currentText || 'Type letters to build text here';

        log('text', `Removed "${removed}" → "${currentText}"`);
    }

    // 2. STYLE CHANGES - Number keys change color
    if (colors[key]) {
        styleBox.style.background = colors[key];
        log('style', `Color changed to ${colors[key]}`);
    }

    // Arrow keys - transform the box
    if (key === 'ArrowUp') {
        boxY -= 10;
        styleBox.style.transform = `translate(${boxX}px, ${boxY}px) scale(${boxScale}) rotate(${boxRotation}deg)`;
        log('style', `Moved up → Y: ${boxY}px`);
    }
    if (key === 'ArrowDown') {
        boxY += 10;
        styleBox.style.transform = `translate(${boxX}px, ${boxY}px) scale(${boxScale}) rotate(${boxRotation}deg)`;
        log('style', `Moved down → Y: ${boxY}px`);
    }
    if (key === 'ArrowLeft') {
        boxRotation -= 15;
        styleBox.style.transform = `translate(${boxX}px, ${boxY}px) scale(${boxScale}) rotate(${boxRotation}deg)`;
        log('style', `Rotated left → ${boxRotation}deg`);
    }
    if (key === 'ArrowRight') {
        boxRotation += 15;
        styleBox.style.transform = `translate(${boxX}px, ${boxY}px) scale(${boxScale}) rotate(${boxRotation}deg)`;
        log('style', `Rotated right → ${boxRotation}deg`);
    }

    // + and - for scale
    if (key === '=' || key === '+') {
        boxScale = Math.min(2, boxScale + 0.1);
        styleBox.style.transform = `translate(${boxX}px, ${boxY}px) scale(${boxScale}) rotate(${boxRotation}deg)`;
        log('style', `Scale up → ${boxScale.toFixed(1)}`);
    }
    if (key === '-') {
        boxScale = Math.max(0.5, boxScale - 0.1);
        styleBox.style.transform = `translate(${boxX}px, ${boxY}px) scale(${boxScale}) rotate(${boxRotation}deg)`;
        log('style', `Scale down → ${boxScale.toFixed(1)}`);
    }

    // Space - reset everything
    if (key === ' ') {
        currentText = '';
        boxX = 0;
        boxY = 0;
        boxScale = 1;
        boxRotation = 0;

        textDisplay.textContent = 'Type letters to build text here';
        textDisplay.style.fontSize = '1.5rem';
        styleBox.style.background = '#9b59b6';
        styleBox.style.transform = 'none';

        log('text', 'Reset all text');
        log('style', 'Reset all styles');
    }
});

// Initial focus
keyCapture.focus();
log('text', 'Ready - press letter keys for text');
log('style', 'Ready - press 1-9 for colors, arrows to move');
