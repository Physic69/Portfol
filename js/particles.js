/* ============================================
   BACKGROUND PARTICLES
   ============================================
   Floating pixel squares with connection lines
   ============================================ */

const particleCanvas = document.getElementById('particles');
const pCtx = particleCanvas ? particleCanvas.getContext('2d') : null;

let bgParticles = [];

const particleColors = [
    '#8B6914', '#6B4F12', '#5B8731', '#7EC850',
    '#7F7F7F', '#4AEDD9', '#FFD700', '#FF3B3B'
];

function resizeParticleCanvas() {
    if (!particleCanvas) return;
    particleCanvas.width = window.innerWidth;
    particleCanvas.height = window.innerHeight;
}

resizeParticleCanvas();
window.addEventListener('resize', () => {
    resizeParticleCanvas();
    initParticles();
});

class BgParticle {
    constructor() {
        this.x = Math.random() * particleCanvas.width;
        this.y = Math.random() * particleCanvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 0.2;
        this.speedY = (Math.random() - 0.5) * 0.2;
        this.opacity = Math.random() * 0.2 + 0.05;
        this.color = particleColors[Math.floor(Math.random() * particleColors.length)];
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
    }

    draw() {
        if (!pCtx) return;
        pCtx.fillStyle = this.color;
        pCtx.globalAlpha = this.opacity;
        pCtx.fillRect(this.x, this.y, this.size, this.size);
        pCtx.globalAlpha = 1;
    }
}

function initParticles() {
    bgParticles = [];
    const count = Math.min(50, Math.floor(window.innerWidth / 25));
    for (let i = 0; i < count; i++) {
        bgParticles.push(new BgParticle());
    }
}

function drawBgConnections() {
    if (!pCtx) return;

    for (let i = 0; i < bgParticles.length; i++) {
        for (let j = i + 1; j < bgParticles.length; j++) {
            const dx = bgParticles[i].x - bgParticles[j].x;
            const dy = bgParticles[i].y - bgParticles[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 120) {
                pCtx.beginPath();
                pCtx.moveTo(bgParticles[i].x, bgParticles[i].y);
                pCtx.lineTo(bgParticles[j].x, bgParticles[j].y);
                pCtx.strokeStyle = `rgba(74, 237, 217, ${0.04 * (1 - dist / 120)})`;
                pCtx.lineWidth = 1;
                pCtx.stroke();
            }
        }
    }
}

function animateBgParticles() {
    if (!pCtx) {
        requestAnimationFrame(animateBgParticles);
        return;
    }

    pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);

    for (const p of bgParticles) {
        p.update();
        p.draw();
    }

    drawBgConnections();
    requestAnimationFrame(animateBgParticles);
}

initParticles();
animateBgParticles();