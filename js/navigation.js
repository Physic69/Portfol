/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    }
});


/* ============================================
   MOBILE NAVIGATION
   ============================================ */

const navLinks = document.getElementById('navLinks');
const hamburger = document.getElementById('hamburger');
const navOverlay = document.getElementById('navOverlay');

function toggleNav() {
    if (navLinks) navLinks.classList.toggle('active');
    if (hamburger) hamburger.classList.toggle('active');
    if (navOverlay) navOverlay.classList.toggle('active');
}

function closeNav() {
    if (navLinks) navLinks.classList.remove('active');
    if (hamburger) hamburger.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
}

if (navOverlay) {
    navOverlay.addEventListener('click', closeNav);
}


/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);

        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});