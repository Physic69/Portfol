/* ============================================
   INITIALIZE IMAGES (Base64)
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    const profileImg = document.getElementById('profile-img');
    if (profileImg && typeof profileImageData !== 'undefined') {
        profileImg.src = profileImageData;
    }
});


/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
});


/* ============================================
   PROJECT FILTER
   ============================================ */

function filterProjects(category, btn) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
    });
    if (btn) btn.classList.add('active');

    // Filter cards
    document.querySelectorAll('.project-card').forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
            card.style.display = 'flex';
            card.style.animation = 'fadeInUp 0.4s ease-out forwards';
        } else {
            card.style.display = 'none';
        }
    });
}

// Make filterProjects globally accessible
window.filterProjects = filterProjects;


/* ============================================
   MAKE NAV FUNCTIONS GLOBAL (for onclick in HTML)
   ============================================ */

window.toggleNav = typeof toggleNav !== 'undefined' ? toggleNav : () => {};
window.closeNav = typeof closeNav !== 'undefined' ? closeNav : () => {};