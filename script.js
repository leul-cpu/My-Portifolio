(function () {
    'use strict';

    const body = document.body;
    const toggle = document.getElementById('mode-toggle');
    const caption = document.getElementById('toggle-caption');
    const heroTag = document.getElementById('hero-tag');
    const heroRole = document.getElementById('hero-role');
    const footerBadge = document.getElementById('footer-mode-badge');
    const cursor = document.getElementById('cursor-dot');
    const menuBtn = document.getElementById('nav-menu-btn');
    const mobileOverlay = document.getElementById('nav-mobile-overlay');

    const SW_ROLE = 'Building software, designing hardware, editing video, and drafting contracts turning ideas into complete, finished products.';
    const HW_ROLE = 'Designing custom microcontroller firmware, motorized mechanical systems, and PCB layouts — bridging raw physical electronics with real-world control systems.';
    const SW_TAG = '[ System.mode = SOFTWARE ]';
    const HW_TAG = '[ System.mode = HARDWARE ]';

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isFinePointer = window.matchMedia('(pointer: fine) and (hover: hover)').matches;
    const savedMode = localStorage.getItem('portfolio-mode') || 'sw';

    function applyMode(mode, animate) {
        const isSW = mode === 'sw';
        body.classList.remove('sw', 'hw');
        body.classList.add(mode);
        toggle.checked = !isSW;
        toggle.setAttribute('aria-checked', String(!isSW));
        caption.textContent = isSW ? 'Viewing: Software Mode' : 'Viewing: Hardware Mode';
        footerBadge.textContent = isSW ? '// SW_MODE' : '// HW_MODE';

        if (animate && !prefersReducedMotion) {
            [heroTag, heroRole].forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(10px)';
            });
            setTimeout(() => {
                heroTag.textContent = isSW ? SW_TAG : HW_TAG;
                heroRole.textContent = isSW ? SW_ROLE : HW_ROLE;
                [heroTag, heroRole].forEach(el => {
                    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    el.style.opacity = '1';
                    el.style.transform = 'translateY(0)';
                });
            }, 180);
        } else {
            heroTag.textContent = isSW ? SW_TAG : HW_TAG;
            heroRole.textContent = isSW ? SW_ROLE : HW_ROLE;
        }

        localStorage.setItem('portfolio-mode', mode);
        document.querySelector('meta[name="theme-color"]').setAttribute('content', isSW ? '#070a09' : '#f7f4eb');
    }

    applyMode(savedMode, false);

    toggle.addEventListener('change', () => {
        applyMode(toggle.checked ? 'hw' : 'sw', true);
    });

    const setMenuOpen = (open) => {
        menuBtn.classList.toggle('open', open);
        mobileOverlay.classList.toggle('open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        mobileOverlay.setAttribute('aria-hidden', String(!open));
        document.body.style.overflow = open ? 'hidden' : '';
    };

    menuBtn.addEventListener('click', () => setMenuOpen(!mobileOverlay.classList.contains('open')));

    mobileOverlay.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') setMenuOpen(false);
    });

    const revealEls = document.querySelectorAll('.reveal');
    let staggerCount = 0;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (!el.dataset.staggerSet) {
                el.style.transitionDelay = (staggerCount++ % 6) * 70 + 'ms';
                el.dataset.staggerSet = '1';
            }
            el.classList.add('visible');
            observer.unobserve(el);
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' });

    revealEls.forEach(el => observer.observe(el));

    const heroSection = document.getElementById('home');
    if (heroSection) {
        if (prefersReducedMotion) {
            heroSection.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        } else {
            requestAnimationFrame(() => {
                heroSection.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
            });
        }
    }

    const statEls = document.querySelectorAll('.stat-val[data-count]');

    const animateStat = (el, end, suffix) => {
        if (prefersReducedMotion) { el.textContent = end + suffix; return; }
        const start = performance.now();
        const duration = 1400;
        const step = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(end * eased) + suffix;
            if (t < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                animateStat(el, Number(el.dataset.count), el.dataset.suffix || '');
                statsObserver.unobserve(el);
            }
        });
    }, { threshold: 0.1 });

    statEls.forEach(el => statsObserver.observe(el));

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const id = anchor.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            setMenuOpen(false);
            target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        });
    });

    if (!prefersReducedMotion && isFinePointer && cursor) {
        document.addEventListener('mousemove', e => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        }, { passive: true });

        document.querySelectorAll('a, button, label, .project-row').forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('big'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('big'));
        });
    } else if (cursor) {
        cursor.remove();
    }
})();
