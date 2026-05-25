document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initRevealAnimations();
    initStatsCounter();
    initMagneticElements();
    initTiltEffect();
    initMobileNav();
});

// ── CUSTOM CURSOR ──
function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const dot = document.querySelector('.custom-cursor-dot');

    if (!cursor || !dot) return;

    // Detect touch device
    if ('ontouchstart' in window) {
        cursor.style.display = 'none';
        dot.style.display = 'none';
        return;
    }

    document.body.classList.add('custom-cursor-active');

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let dotX = 0, dotY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Smooth interpolation for main cursor
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;

        // Faster interpolation for dot
        dotX += (mouseX - dotX) * 0.2;
        dotY += (mouseY - dotY) * 0.2;
        dot.style.transform = `translate3d(${dotX}px, ${dotY}px, 0)`;

        requestAnimationFrame(animate);
    }
    animate();

    // Hover states
    const interactables = document.querySelectorAll('a, button, .bento-tile');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform += ' scale(1.5)';
            cursor.style.background = 'var(--accent)';
            cursor.style.opacity = '0.2';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.background = 'var(--accent)';
            cursor.style.opacity = '0.5';
        });
    });
}

// ── REVEAL ANIMATIONS ──
function initRevealAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ── STATS COUNTER ──
function initStatsCounter() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-target'));
                const suffix = target.getAttribute('data-suffix') || '';
                let current = 0;
                const duration = 2000;
                const stepTime = Math.abs(Math.floor(duration / countTo));

                const timer = setInterval(() => {
                    current += Math.ceil(countTo / 50);
                    if (current >= countTo) {
                        target.innerText = countTo + suffix;
                        clearInterval(timer);
                    } else {
                        target.innerText = current + suffix;
                    }
                }, stepTime);
                observer.unobserve(target);
            }
        });
    }, { threshold: 1 });

    document.querySelectorAll('.stat-num').forEach(el => observer.observe(el));
}

// ── MAGNETIC EFFECT ──
function initMagneticElements() {
    const magnetics = document.querySelectorAll('.magnetic');

    magnetics.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            el.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });
}

// ── TILT EFFECT ──
function initTiltEffect() {
    const tiles = document.querySelectorAll('[data-tilt]');

    tiles.forEach(tile => {
        tile.addEventListener('mousemove', (e) => {
            const rect = tile.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            tile.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        tile.addEventListener('mouseleave', () => {
            tile.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// ── MOBILE NAV ──
function initMobileNav() {
    const toggle = document.getElementById('navToggle');
    const links = document.querySelector('.nav-links');

    if (!toggle) return;

    toggle.addEventListener('click', () => {
        toggle.classList.toggle('active');
        links.classList.toggle('active');
        document.body.style.overflow = links.classList.contains('active') ? 'hidden' : '';
    });
}
