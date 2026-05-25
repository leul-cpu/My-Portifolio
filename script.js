/* ===================================================
   LEUL — Premium Developer Portfolio Scripts
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ── Scroll Reveal Animation ──
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target); // Only reveal once
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ── Navbar Stickiness ──
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // ── Mobile Menu Toggle ──
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

        }
    });

    // ── Project Bento Card Hover Glow ──
    const projectCards = document.querySelectorAll('.itsvg-card');

    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            // Calculate mouse position relative to the card
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Set CSS variables for the radial gradient center
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ── Stats Count-up Animation ──
    const stats = document.querySelectorAll('.stat-num');

    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const suffix = obj.getAttribute('data-suffix') || obj.innerText.replace(/[0-9]/g, '');
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const currentCount = Math.floor(progress * (end - start) + start);
            obj.textContent = currentCount + suffix;
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const endValue = parseInt(target.getAttribute('data-target') || target.innerText.replace(/[^0-9]/g, ''));
                if (!isNaN(endValue)) {
                    animateValue(target, 0, endValue, 2000);
                }
                statsObserver.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => statsObserver.observe(stat));

    // ── Magnetic Buttons ──
    const magneticBtns = document.querySelectorAll('.btn-nav, .btn-primary');

    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.5}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // ── Custom Cursor ──
    const cursor = document.querySelector('.custom-cursor');
    const cursorDot = document.querySelector('.custom-cursor-dot');
    const links = document.querySelectorAll('a, button, .itsvg-card');

    if (cursor && cursorDot && window.innerWidth > 768) {
        document.body.classList.add('custom-cursor-active');

        document.addEventListener('mousemove', (e) => {
            const { clientX: x, clientY: y } = e;
            cursor.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
            cursorDot.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`;
        });
    }

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('hover');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('hover');
        });
    });

    // ── Parallax Background ──
    window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        const grid = document.querySelector('.hero-bg-grid');
        const glow1 = document.querySelector('.hero-glow-1');
        const glow2 = document.querySelector('.hero-glow-2');

        if (grid) grid.style.transform = `translateY(${scrolled * 0.3}px)`;
        if (glow1) glow1.style.transform = `translateY(${scrolled * 0.15}px)`;
        if (glow2) glow2.style.transform = `translateY(${scrolled * 0.1}px)`;
    });

    // ── Smooth Scroll for Anchor Links ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu on click

            }
        });
    });

});
