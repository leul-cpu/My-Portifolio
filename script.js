document.addEventListener('DOMContentLoaded', () => {
    // 0. Skeleton Loading State — full site
    // body.page-loading hides real content behind skeleton bones across ALL sections.
    // After 1.5 s (simulated load), remove the class to reveal real content.
    setTimeout(() => {
        document.body.classList.remove('page-loading');
    }, 1500);

    // 1. Mobile Navigation Toggle
    const navMenuBtn = document.getElementById('nav-menu-btn');
    const navMobileOverlay = document.getElementById('nav-mobile-overlay');
    const mobileLinks = navMobileOverlay.querySelectorAll('a');

    function toggleMenu() {
        const isExpanded = navMenuBtn.getAttribute('aria-expanded') === 'true';
        navMenuBtn.setAttribute('aria-expanded', !isExpanded);
        navMenuBtn.classList.toggle('active');
        navMobileOverlay.classList.toggle('active');

        document.body.style.overflow = isExpanded ? '' : 'hidden';
    }

    if (navMenuBtn) {
        navMenuBtn.addEventListener('click', toggleMenu);
    }

    mobileLinks.forEach(link => {
        link.addEventListener('click', toggleMenu);
    });

    // 2. Intersection Observer for fade-in animations
    const fadeElements = document.querySelectorAll('.fade-in');

    if (fadeElements.length > 0) {
        // Add staggered delays based on sequence
        fadeElements.forEach((el, index) => {
            el.style.setProperty('--delay', `${(index % 5) * 0.1}s`);
        });

        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const fadeObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        fadeElements.forEach(el => {
            fadeObserver.observe(el);
        });
    }

    // 3. Current Year for Footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 4. Contact Form Submission Handling
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');
    if (contactForm && contactStatus) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (btn.classList.contains('btn-loading') || btn.classList.contains('btn-success')) return;
            btn.classList.add('btn-loading');
            contactStatus.textContent = 'Sending message...';
            setTimeout(() => {
                btn.classList.remove('btn-loading');
                btn.classList.add('btn-success');
                btn.textContent = 'Message Sent!';
                contactStatus.textContent = 'Message successfully sent to Leul.';
                contactForm.reset();
                setTimeout(() => {
                    btn.classList.remove('btn-success');
                    btn.textContent = originalText;
                    contactStatus.textContent = '';
                }, 4000);
            }, 800);
        });
    }

    // 5. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 6. Dark Mode Toggle
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        // Check for saved theme, default to dark mode
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // 7. Mouse-tracking glow and 3D Tilt for cards
    const cards = document.querySelectorAll('.card, .project-card');
    if (cards.length > 0) {
        cards.forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                card.style.setProperty('--mouse-x', `${x}px`);
                card.style.setProperty('--mouse-y', `${y}px`);

                // 3D Tilt Physics
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6; // Max 6 deg
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.setProperty('--rotate-x', `${rotateX}deg`);
                card.style.setProperty('--rotate-y', `${rotateY}deg`);
            });

            // Reset on leave
            card.addEventListener('mouseleave', () => {
                card.style.setProperty('--rotate-x', '0deg');
                card.style.setProperty('--rotate-y', '0deg');
            });
        });
    }

    // 8. Vanilla JS Live Preview Modal Engine
    const previewModal = document.getElementById('preview-modal');
    const modalIframe = document.getElementById('modal-iframe');
    const modalLoader = document.getElementById('modal-loader');
    const modalCloseBtn = document.getElementById('modal-close');
    const modalExternalLink = document.getElementById('modal-external-link');
    const modalDeviceDesktop = document.getElementById('modal-device-desktop');
    const modalDeviceMobile = document.getElementById('modal-device-mobile');
    const iframeViewport = document.querySelector('.iframe-viewport');
    const previewButtons = document.querySelectorAll('.btn-preview');

    if (previewModal && modalIframe && modalLoader) {
        // Open Modal
        previewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const previewUrl = btn.getAttribute('data-preview-url');
                const projectTitle = btn.closest('.project-content').querySelector('.project-title').textContent;

                // Set modal title details
                const modalTitle = document.getElementById('modal-title');
                if (modalTitle) {
                    modalTitle.textContent = `${projectTitle} — Live Preview`;
                }

                // Prepare iframe
                modalLoader.classList.remove('hidden');
                modalIframe.src = previewUrl;
                modalExternalLink.href = previewUrl;

                // Reset device view simulator to Desktop by default
                iframeViewport.classList.remove('mobile');
                modalDeviceDesktop.classList.add('active');
                modalDeviceMobile.classList.remove('active');

                // Display Modal
                previewModal.classList.add('active');
                previewModal.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden'; // Block background scroll
            });
        });

        // Iframe finish loading indicator trigger
        modalIframe.addEventListener('load', () => {
            modalLoader.classList.add('hidden');
        });

        // Close Modal function
        const closeModal = () => {
            previewModal.classList.remove('active');
            previewModal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = ''; // Restore scroll

            // Wipe source to stop audio/video/scripts running in background iframe
            modalIframe.src = '';
        };

        // Click close triggers
        modalCloseBtn.addEventListener('click', closeModal);

        previewModal.addEventListener('click', (e) => {
            // If clicking the blurred outer container directly, close modal
            if (e.target === previewModal) {
                closeModal();
            }
        });

        // Keyboard close (ESC key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && previewModal.classList.contains('active')) {
                closeModal();
            }
        });

        // Device simulator controls
        if (modalDeviceDesktop && modalDeviceMobile && iframeViewport) {
            modalDeviceDesktop.addEventListener('click', () => {
                iframeViewport.classList.remove('mobile');
                modalDeviceDesktop.classList.add('active');
                modalDeviceMobile.classList.remove('active');
            });

            modalDeviceMobile.addEventListener('click', () => {
                iframeViewport.classList.add('mobile');
                modalDeviceMobile.classList.add('active');
                modalDeviceDesktop.classList.remove('active');
            });
        }
    }

    // 9. Read More Toggle for Mobile
    const readMoreButtons = document.querySelectorAll('.read-more-btn');
    readMoreButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const container = btn.parentElement;
            const desc = container.querySelector('.card-desc, .project-desc, .testimonial-quote');

            if (desc) {
                const isExpanded = desc.classList.toggle('expanded');
                btn.setAttribute('aria-expanded', isExpanded);
                btn.textContent = isExpanded ? 'Read Less -' : 'Read More +';
            }
        });
    });

    // 10. TikTok Thumbnail Loader via oEmbed API
    const editThumbnailWraps = document.querySelectorAll('.edit-thumbnail-wrap');

    async function loadTikTokThumbnail(wrap) {
        const tiktokUrl = wrap.getAttribute('data-tiktok-url');
        const thumbId = wrap.querySelector('.edit-thumbnail-img').id;
        const thumbEl = document.getElementById(thumbId);

        if (!tiktokUrl || !thumbEl) return;

        try {
            const oEmbedUrl = `https://www.tiktok.com/oembed?url=${encodeURIComponent(tiktokUrl)}`;
            const response = await fetch(oEmbedUrl);

            if (response.ok) {
                const data = await response.json();
                if (data.thumbnail_url) {
                    const img = new Image();
                    img.onload = () => {
                        thumbEl.style.backgroundImage = `url('${data.thumbnail_url}')`;
                        thumbEl.classList.add('loaded');
                    };
                    img.onerror = () => applyFallbackGradient(thumbEl);
                    img.src = data.thumbnail_url;
                } else {
                    applyFallbackGradient(thumbEl);
                }
            } else {
                applyFallbackGradient(thumbEl);
            }
        } catch (err) {
            applyFallbackGradient(thumbEl);
        }
    }

    function applyFallbackGradient(el) {
        el.style.backgroundImage = 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 40%, #0d0d0d 100%)';
        el.classList.add('loaded');
    }

    editThumbnailWraps.forEach(wrap => {
        // Load thumbnail
        loadTikTokThumbnail(wrap);

        // Click/keyboard opens TikTok in new tab
        const openTikTok = () => {
            const url = wrap.getAttribute('data-tiktok-url');
            if (url) window.open(url, '_blank', 'noopener,noreferrer');
        };

        wrap.addEventListener('click', openTikTok);
        wrap.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openTikTok();
            }
        });
    });

    // 11. Custom Cursor Engine
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia('(pointer: fine)').matches) {
        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;
        let isHovering = false;

        window.addEventListener('mousemove', (e) => {
            if (!document.body.classList.contains('cursor-active')) {
                document.body.classList.add('cursor-active');
            }
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Immediate position for dot (centered: -3px offset for 6px dot)
            cursorDot.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
        });

        const animateCursor = () => {
            // Smoothly follow for outline (lerp)
            const lerp = 0.15;
            outlineX += (mouseX - outlineX) * lerp;
            outlineY += (mouseY - outlineY) * lerp;

            const scale = isHovering ? 1.5 : 1;
            cursorOutline.style.transform = `translate3d(${outlineX - 15}px, ${outlineY - 15}px, 0) scale(${scale})`;

            requestAnimationFrame(animateCursor);
        };
        requestAnimationFrame(animateCursor);

        // Hover effect for interactive elements (Event Delegation)
        document.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, [role="button"], .edit-thumbnail-wrap');
            if (target) {
                isHovering = true;
                document.body.classList.add('cursor-hover');
            }
        });

        document.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, [role="button"], .edit-thumbnail-wrap');
            if (target) {
                isHovering = false;
                document.body.classList.remove('cursor-hover');
            }
        });
    }

    // 12. Scroll Spy using IntersectionObserver
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a, .nav-brand');

    const scrollSpyOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const scrollSpyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href === `#${id}`) {
                        link.classList.add('active');
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.classList.remove('active');
                        link.removeAttribute('aria-current');
                    }
                });
            }
        });
    }, scrollSpyOptions);

    sections.forEach(section => {
        scrollSpyObserver.observe(section);
    });
});
