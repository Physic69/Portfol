/* ============================================
   CURSOR SYSTEM
   ============================================
   
   CURSOR_STYLE options:
   - 'glow'      → Glowing pixel dot with trailing tail (DEFAULT)
   - 'arrow'     → Pixel arrow cursor
   - 'square'    → Small spinning pixel square
   - 'crosshair' → Crosshair reticle (the crazy one)
   
   To switch cursor styles:
   1. Change CURSOR_STYLE below
   2. In css/style.css, uncomment the matching cursor CSS block
      and comment out the others
   ============================================ */

const CURSOR_STYLE = 'glow';
// const CURSOR_STYLE = 'arrow';
// const CURSOR_STYLE = 'square';
// const CURSOR_STYLE = 'crosshair';

const cursorEl = document.getElementById('customCursor');
const trailEl = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let trailX = 0, trailY = 0;

const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

if (isTouchDevice) {
    if (cursorEl) cursorEl.style.display = 'none';
    if (trailEl) trailEl.style.display = 'none';
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Hover detection for interactive elements
document.addEventListener('mouseover', (e) => {
    const interactive = e.target.closest('a, button, .btn, .filter-btn, .project-link, .contact-link, .skill-tag, .nav-links a');
    if (interactive && cursorEl) {
        cursorEl.classList.add('hovering');
    }
});

document.addEventListener('mouseout', (e) => {
    const interactive = e.target.closest('a, button, .btn, .filter-btn, .project-link, .contact-link, .skill-tag, .nav-links a');
    if (interactive && cursorEl) {
        cursorEl.classList.remove('hovering');
    }
});

function animateCursor() {
    if (isTouchDevice) {
        requestAnimationFrame(animateCursor);
        return;
    }

    // Main cursor — snappy follow
    const cursorSpeed = CURSOR_STYLE === 'arrow' ? 0.35 : 0.2;
    cursorX += (mouseX - cursorX) * cursorSpeed;
    cursorY += (mouseY - cursorY) * cursorSpeed;

    if (cursorEl) {
        cursorEl.style.left = cursorX + 'px';
        cursorEl.style.top = cursorY + 'px';
    }

    // Trail dot — lazy follow
    trailX += (mouseX - trailX) * 0.08;
    trailY += (mouseY - trailY) * 0.08;

    if (trailEl) {
        trailEl.style.left = trailX + 'px';
        trailEl.style.top = trailY + 'px';
    }

    requestAnimationFrame(animateCursor);
}

animateCursor();


/* ============================================
   CONSTELLATION TRAIL
   ============================================
   Dots appear along mouse path and connect
   with lines temporarily, then fade out.
   ============================================ */

const constellationCanvas = document.getElementById('constellationCanvas');
const conCtx = constellationCanvas ? constellationCanvas.getContext('2d') : null;

let constellationDots = [];
const CON_MAX_DOTS = 35;
const CON_DOT_LIFETIME = 2500;       // ms before dot fades
const CON_LINE_DISTANCE = 120;       // max px to draw connection line
const CON_SPAWN_INTERVAL = 60;       // ms between spawns
let lastConSpawn = 0;

function resizeConstellationCanvas() {
    if (!constellationCanvas) return;
    constellationCanvas.width = window.innerWidth;
    constellationCanvas.height = window.innerHeight;
}

resizeConstellationCanvas();
window.addEventListener('resize', resizeConstellationCanvas);

document.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastConSpawn < CON_SPAWN_INTERVAL) return;
    lastConSpawn = now;

    constellationDots.push({
        x: e.clientX,
        y: e.clientY,
        born: now,
        size: Math.random() * 2.5 + 1.5
    });

    // Cap array size
    if (constellationDots.length > CON_MAX_DOTS) {
        constellationDots.shift();
    }
});

function drawConstellation() {
    if (!conCtx) {
        requestAnimationFrame(drawConstellation);
        return;
    }

    conCtx.clearRect(0, 0, constellationCanvas.width, constellationCanvas.height);

    const now = Date.now();

    // Remove expired dots
    constellationDots = constellationDots.filter(d => now - d.born < CON_DOT_LIFETIME);

    // Draw connections
    for (let i = 0; i < constellationDots.length; i++) {
        for (let j = i + 1; j < constellationDots.length; j++) {
            const a = constellationDots[i];
            const b = constellationDots[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < CON_LINE_DISTANCE) {
                const aAge = (now - a.born) / CON_DOT_LIFETIME;
                const bAge = (now - b.born) / CON_DOT_LIFETIME;
                const opacity = (1 - Math.max(aAge, bAge)) * (1 - dist / CON_LINE_DISTANCE) * 0.4;

                conCtx.beginPath();
                conCtx.moveTo(a.x, a.y);
                conCtx.lineTo(b.x, b.y);
                conCtx.strokeStyle = `rgba(74, 237, 217, ${opacity})`;
                conCtx.lineWidth = 1;
                conCtx.stroke();
            }
        }
    }

    // Draw dots
    for (const dot of constellationDots) {
        const age = (now - dot.born) / CON_DOT_LIFETIME;
        const opacity = 1 - age;

        conCtx.fillStyle = `rgba(74, 237, 217, ${opacity * 0.7})`;
        conCtx.fillRect(
            dot.x - dot.size / 2,
            dot.y - dot.size / 2,
            dot.size,
            dot.size
        );

        // Glow
        conCtx.fillStyle = `rgba(74, 237, 217, ${opacity * 0.15})`;
        const glowSize = dot.size * 3;
        conCtx.fillRect(
            dot.x - glowSize / 2,
            dot.y - glowSize / 2,
            glowSize,
            glowSize
        );
    }

    requestAnimationFrame(drawConstellation);
}

drawConstellation();


/* ============================================
   SHOCKWAVE CLICK EFFECT
   ============================================
   Pixelated expanding square rings on click.
   ============================================ */

const shockwaveCanvas = document.getElementById('shockwaveCanvas');
const swCtx = shockwaveCanvas ? shockwaveCanvas.getContext('2d') : null;

let shockwaves = [];

function resizeShockwaveCanvas() {
    if (!shockwaveCanvas) return;
    shockwaveCanvas.width = window.innerWidth;
    shockwaveCanvas.height = window.innerHeight;
}

resizeShockwaveCanvas();
window.addEventListener('resize', resizeShockwaveCanvas);

const shockwaveColors = [
    { r: 74, g: 237, b: 217 },   // diamond blue
    { r: 126, g: 200, b: 80 },   // grass green
    { r: 255, g: 215, b: 0 },    // gold
];

document.addEventListener('click', (e) => {
    const color = shockwaveColors[Math.floor(Math.random() * shockwaveColors.length)];

    // Main ring
    shockwaves.push({
        x: e.clientX,
        y: e.clientY,
        radius: 0,
        maxRadius: 120,
        speed: 4,
        lineWidth: 3,
        color: color,
        born: Date.now()
    });

    // Secondary ring (delayed, thinner)
    setTimeout(() => {
        shockwaves.push({
            x: e.clientX,
            y: e.clientY,
            radius: 0,
            maxRadius: 80,
            speed: 3,
            lineWidth: 2,
            color: color,
            born: Date.now()
        });
    }, 80);

    // Third ring (more delayed, smallest)
    setTimeout(() => {
        shockwaves.push({
            x: e.clientX,
            y: e.clientY,
            radius: 0,
            maxRadius: 50,
            speed: 2.5,
            lineWidth: 1,
            color: color,
            born: Date.now()
        });
    }, 160);
});

function drawShockwaves() {
    if (!swCtx) {
        requestAnimationFrame(drawShockwaves);
        return;
    }

    swCtx.clearRect(0, 0, shockwaveCanvas.width, shockwaveCanvas.height);

    shockwaves = shockwaves.filter(sw => sw.radius < sw.maxRadius);

    for (const sw of shockwaves) {
        sw.radius += sw.speed;

        const progress = sw.radius / sw.maxRadius;
        const opacity = 1 - progress;
        const { r, g, b } = sw.color;

        // Draw pixelated square ring
        const halfSize = sw.radius;
        const x = sw.x - halfSize;
        const y = sw.y - halfSize;
        const size = halfSize * 2;

        swCtx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.6})`;
        swCtx.lineWidth = sw.lineWidth;
        swCtx.strokeRect(x, y, size, size);

        // Inner glow ring
        if (progress < 0.5) {
            const innerOpacity = (1 - progress * 2) * 0.2;
            swCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${innerOpacity})`;
            swCtx.fillRect(x, y, size, size);
        }

        // Corner accents (pixel dots at corners)
        const cornerSize = Math.max(2, sw.lineWidth + 1);
        swCtx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity * 0.9})`;
        swCtx.fillRect(x - 1, y - 1, cornerSize, cornerSize);
        swCtx.fillRect(x + size - cornerSize + 1, y - 1, cornerSize, cornerSize);
        swCtx.fillRect(x - 1, y + size - cornerSize + 1, cornerSize, cornerSize);
        swCtx.fillRect(x + size - cornerSize + 1, y + size - cornerSize + 1, cornerSize, cornerSize);
    }

    requestAnimationFrame(drawShockwaves);
}

drawShockwaves();