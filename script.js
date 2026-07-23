document.addEventListener('DOMContentLoaded', () => {
    // 0. Skeleton Loading State — full site
    // body.page-loading hides real content behind skeleton bones across ALL sections.
    // After 1.5 s (simulated load), remove the class to reveal real content.
    setTimeout(() => {
        document.body.classList.remove('page-loading');
    }, 1500);

    // Utility: Focus Trapping
    function handleFocusTrap(container, e) {
        if (e.key !== 'Tab') return;
        const focusable = container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            last.focus();
            e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
            first.focus();
            e.preventDefault();
        }
    }

    // 1. Mobile Navigation Toggle
    const navMenuBtn = document.getElementById('nav-menu-btn');
    const navMobileOverlay = document.getElementById('nav-mobile-overlay');
    const mobileLinks = navMobileOverlay.querySelectorAll('a');

    function toggleMenu() {
        const isExpanded = navMenuBtn.getAttribute('aria-expanded') === 'true';
        navMenuBtn.setAttribute('aria-expanded', !isExpanded);
        navMenuBtn.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
        navMenuBtn.classList.toggle('active');
        navMobileOverlay.classList.toggle('active');
        navMobileOverlay.setAttribute('aria-hidden', isExpanded);

        document.body.style.overflow = isExpanded ? '' : 'hidden';

        if (!isExpanded) {
            // Focus the first link when opening
            setTimeout(() => {
                const firstLink = navMobileOverlay.querySelector('a');
                if (firstLink) firstLink.focus();
            }, 300);
        } else {
            // Return focus to button when closing
            navMenuBtn.focus();
        }
    }

    if (navMenuBtn) {
        navMenuBtn.addEventListener('click', toggleMenu);
        document.addEventListener('keydown', (e) => {
            if (navMobileOverlay.classList.contains('active')) {
                handleFocusTrap(navMobileOverlay, e);
                if (e.key === 'Escape') toggleMenu();
            }
        });
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

    // Helper to handle copy success UI state changes
    function triggerCopySuccess(button) {
        if (typeof window.showToast === 'function') {
            window.showToast('Email copied to clipboard!');
        }

        if (!button) return;
        const originalLabel = button.getAttribute('aria-label') || 'Copy email address';
        const originalTitle = button.getAttribute('title') || 'Copy to clipboard';

        button.setAttribute('aria-label', 'Email address copied!');
        button.setAttribute('title', 'Email address copied!');
        button.classList.add('copied');

        setTimeout(() => {
            button.setAttribute('aria-label', originalLabel);
            button.setAttribute('title', originalTitle);
            button.classList.remove('copied');
        }, 3000);
    }

    // 4.05 Copy Email to Clipboard Feature
    const copyEmailBtn = document.getElementById('btn-copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailAddress = 'leulabiti98@gmail.com';

            // Modern copy API with fallback
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(emailAddress)
                    .then(() => {
                        triggerCopySuccess(copyEmailBtn);
                    })
                    .catch(() => {
                        fallbackCopyText(emailAddress, copyEmailBtn);
                    });
            } else {
                fallbackCopyText(emailAddress, copyEmailBtn);
            }
        });
    }

    function fallbackCopyText(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed'; // Avoid scrolling to bottom
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            document.execCommand('copy');
            triggerCopySuccess(button);
        } catch (err) {
            console.error('Failed to copy text', err);
        }
        document.body.removeChild(textArea);
    }

    // 4.1 Contact Form Textarea Character Counter
    const messageTextarea = document.getElementById('message');
    const charCountEl = document.getElementById('message-char-count');
    if (messageTextarea && charCountEl) {
        const updateCharCount = () => {
            const currentLength = messageTextarea.value.length;
            const maxLength = parseInt(messageTextarea.getAttribute('maxlength') || '1000', 10);
            charCountEl.textContent = `${currentLength} / ${maxLength} characters`;

            // Add warn state if approaching 90% of max capacity
            if (currentLength >= maxLength * 0.9) {
                charCountEl.classList.add('near-limit');
            } else {
                charCountEl.classList.remove('near-limit');
            }
        };

        messageTextarea.addEventListener('input', updateCharCount);

        if (contactForm) {
            contactForm.addEventListener('reset', () => {
                setTimeout(updateCharCount, 0);
            });
        }
    }

    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        // Navbar scrolled state
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // 6. Dark Mode Toggle & Keyboard Shortcut Support
    const themeToggleBtn = document.getElementById('theme-toggle');
    if (themeToggleBtn) {
        const themeColorMeta = document.querySelector('meta[name="theme-color"]');

        const updateThemeUI = () => {
            const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
            const label = isDark ? 'Switch to light mode (Press T)' : 'Switch to dark mode (Press T)';
            themeToggleBtn.setAttribute('aria-label', label);
            themeToggleBtn.setAttribute('title', label);
            if (themeColorMeta) {
                themeColorMeta.setAttribute('content', isDark ? '#050505' : '#FFFFFF');
            }
        };

        const toggleTheme = () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
            }
            updateThemeUI();
        };

        // Check for saved theme, default to dark mode
        const currentTheme = localStorage.getItem('theme');
        if (currentTheme === 'light') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
        updateThemeUI();

        themeToggleBtn.addEventListener('click', toggleTheme);

        // Global Keyboard Shortcut: Press 'T' to toggle theme
        document.addEventListener('keydown', (e) => {
            if (!e.target) return;
            const targetTag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
            const isEditable = e.target.isContentEditable || e.target.getAttribute('contenteditable') === 'true';

            // Do not toggle theme if the user is currently typing in an input, textarea, or contenteditable element
            if (targetTag === 'input' || targetTag === 'textarea' || isEditable) {
                return;
            }

            if (e.key === 't' || e.key === 'T') {
                toggleTheme();
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
    let lastFocusedElement = null;

    if (previewModal && modalIframe && modalLoader) {
        // Open Modal
        previewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                lastFocusedElement = document.activeElement;
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

                // Focus the close button
                setTimeout(() => {
                    modalCloseBtn.focus();
                }, 100);
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

            // Return focus to the trigger button
            if (lastFocusedElement) {
                lastFocusedElement.focus();
            }
        };

        // Click close triggers
        modalCloseBtn.addEventListener('click', closeModal);

        previewModal.addEventListener('click', (e) => {
            // If clicking the blurred outer container directly, close modal
            if (e.target === previewModal) {
                closeModal();
            }
        });

        // Keyboard: Focus trap & Escape close
        document.addEventListener('keydown', (e) => {
            if (previewModal.classList.contains('active')) {
                handleFocusTrap(previewModal, e);
                if (e.key === 'Escape') closeModal();
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
        const container = btn.parentElement;
        const titleEl = container.querySelector('.card-title, .project-title, .author-name');
        const titleText = titleEl ? titleEl.textContent.replace(' →', '').trim() : '';

        if (titleText) {
            btn.setAttribute('aria-label', `Read more about ${titleText}`);
        }

        btn.addEventListener('click', () => {
            const desc = container.querySelector('.card-desc, .project-desc, .testimonial-quote');

            if (desc) {
                const isExpanded = desc.classList.toggle('expanded');
                btn.setAttribute('aria-expanded', isExpanded);
                btn.textContent = isExpanded ? 'Read Less -' : 'Read More +';
                if (titleText) {
                    btn.setAttribute('aria-label', isExpanded ? `Read less about ${titleText}` : `Read more about ${titleText}`);
                }
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

        document.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-active');
        });

        document.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-active');
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
    const navLinks = document.querySelectorAll('.nav-links a, .nav-brand, .nav-mobile-overlay a');

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

    // 13. Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = height > 0 ? (window.scrollY / height) : 0;
            const percentage = Math.round(scrolled * 100);

            scrollProgress.style.transform = `scaleX(${scrolled})`;
            scrollProgress.setAttribute('aria-valuenow', percentage);
        });
    }

    // 14. Toast Notification
    window.showToast = function(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.setAttribute('role', 'status');
        toast.setAttribute('aria-live', 'polite');
        toast.textContent = message;
        document.body.appendChild(toast);
        
        // Trigger reflow for animation
        void toast.offsetWidth;
        toast.classList.add('visible');

        setTimeout(() => {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // 15. Back to Top Button Interaction & Accessibility
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        const toggleBackToTop = () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.removeAttribute('aria-hidden');
                backToTopBtn.setAttribute('tabindex', '0');
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.setAttribute('aria-hidden', 'true');
                backToTopBtn.setAttribute('tabindex', '-1');
            }
        };

        window.addEventListener('scroll', toggleBackToTop);

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // After scrolling to top, gracefully redirect keyboard focus to the skip-link
            // to avoid focus loss or keeping focus on an invisible button.
            const skipLink = document.querySelector('.skip-link');
            if (skipLink) {
                // Wait briefly for scroll animation to initiate/finish so focus transition feels natural
                setTimeout(() => {
                    skipLink.focus();
                }, 100);
            }
        });
    }
});
