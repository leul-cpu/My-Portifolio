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

    // 4. Contact Form Validation, Copying & Draft Persistence Module
    const contactForm = document.getElementById('contact-form');
    const contactStatus = document.getElementById('contact-status');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const nameFeedback = document.getElementById('name-validation-message');
    const emailFeedback = document.getElementById('email-validation-message');
    const messageFeedback = document.getElementById('message-validation-message');
    const charCountEl = document.getElementById('message-char-count');

    let debounceTimer;
    let emailHasBeenBlurred = false;
    let nameHasBeenBlurred = false;
    let messageHasBeenBlurred = false;

    // Real-time Name Validation
    const validateName = (isBlur = false) => {
        if (!nameInput || !nameFeedback) return false;
        const value = nameInput.value.trim();
        if (!value) {
            if (isBlur || nameHasBeenBlurred) {
                nameFeedback.textContent = '⚠ Please enter your name';
                nameFeedback.className = 'field-feedback active invalid';
                nameInput.classList.remove('is-valid');
                nameInput.classList.add('is-invalid');
                nameInput.setAttribute('aria-invalid', 'true');
            } else {
                nameFeedback.textContent = '';
                nameFeedback.className = 'field-feedback';
                nameInput.classList.remove('is-valid', 'is-invalid');
                nameInput.removeAttribute('aria-invalid');
            }
            return false;
        }

        nameFeedback.textContent = '✓ Name entered';
        nameFeedback.className = 'field-feedback active valid';
        nameInput.classList.remove('is-invalid');
        nameInput.classList.add('is-valid');
        nameInput.setAttribute('aria-invalid', 'false');
        return true;
    };

    // Real-time Email Validation
    const validateEmail = (isBlur = false) => {
        if (!emailInput || !emailFeedback) return false;
        const value = emailInput.value.trim();
        if (!value) {
            if (isBlur || emailHasBeenBlurred) {
                emailFeedback.textContent = '⚠ Please enter your email address';
                emailFeedback.className = 'field-feedback active invalid';
                emailInput.classList.remove('is-valid');
                emailInput.classList.add('is-invalid');
                emailInput.setAttribute('aria-invalid', 'true');
            } else {
                emailFeedback.textContent = '';
                emailFeedback.className = 'field-feedback';
                emailInput.classList.remove('is-valid', 'is-invalid');
                emailInput.removeAttribute('aria-invalid');
            }
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(value);

        if (isValid) {
            emailFeedback.textContent = '✓ Valid email format';
            emailFeedback.className = 'field-feedback active valid';
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
            emailInput.setAttribute('aria-invalid', 'false');
            return true;
        } else if (isBlur || emailHasBeenBlurred) {
            emailFeedback.textContent = '⚠ Please enter a valid email format';
            emailFeedback.className = 'field-feedback active invalid';
            emailInput.classList.remove('is-valid');
            emailInput.classList.add('is-invalid');
            emailInput.setAttribute('aria-invalid', 'true');
        }
        return false;
    };

    // Real-time Message Validation
    const validateMessage = (isBlur = false) => {
        if (!messageInput || !messageFeedback) return false;
        const value = messageInput.value.trim();
        if (!value) {
            if (isBlur || messageHasBeenBlurred) {
                messageFeedback.textContent = '⚠ Please enter your message';
                messageFeedback.className = 'field-feedback active invalid';
                messageInput.classList.remove('is-valid');
                messageInput.classList.add('is-invalid');
                messageInput.setAttribute('aria-invalid', 'true');
            } else {
                messageFeedback.textContent = '';
                messageFeedback.className = 'field-feedback';
                messageInput.classList.remove('is-valid', 'is-invalid');
                messageInput.removeAttribute('aria-invalid');
            }
            return false;
        }

        messageFeedback.textContent = '✓ Message entered';
        messageFeedback.className = 'field-feedback active valid';
        messageInput.classList.remove('is-invalid');
        messageInput.classList.add('is-valid');
        messageInput.setAttribute('aria-invalid', 'false');
        return true;
    };

    // Update Message Character Counter
    const updateCharCount = () => {
        if (!messageInput || !charCountEl) return;
        const currentLength = messageInput.value.length;
        const maxLength = parseInt(messageInput.getAttribute('maxlength') || '1000', 10);
        charCountEl.textContent = `${currentLength} / ${maxLength} characters`;

        if (currentLength >= maxLength * 0.9) {
            charCountEl.classList.add('near-limit');
        } else {
            charCountEl.classList.remove('near-limit');
        }
    };

    // Setup Event Listeners for Input Elements
    if (nameInput) {
        nameInput.addEventListener('input', () => validateName());
        nameInput.addEventListener('blur', () => {
            nameHasBeenBlurred = true;
            validateName(true);
        });
    }

    if (emailInput) {
        emailInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const value = emailInput.value.trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(value)) {
                validateEmail();
            } else {
                debounceTimer = setTimeout(() => validateEmail(), 800);
            }
        });
        emailInput.addEventListener('blur', () => {
            emailHasBeenBlurred = true;
            validateEmail(true);
        });
    }

    if (messageInput) {
        messageInput.addEventListener('input', () => {
            updateCharCount();
            validateMessage();
        });
        messageInput.addEventListener('blur', () => {
            messageHasBeenBlurred = true;
            validateMessage(true);
        });
    }

    // Consolidated Form Submission Listener
    if (contactForm && contactStatus) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;

        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Set touched flags on submission so error messages are visible immediately
            nameHasBeenBlurred = true;
            emailHasBeenBlurred = true;
            messageHasBeenBlurred = true;

            const isNameValid = validateName(true);
            const isEmailValid = validateEmail(true);
            const isMessageValid = validateMessage(true);

            if (!isNameValid) {
                if (nameInput) nameInput.focus();
                if (typeof window.showToast === 'function') {
                    window.showToast('Please enter your name.');
                }
            }

            if (!isEmailValid) {
                if (emailInput) emailInput.focus();
                if (typeof window.showToast === 'function') {
                    window.showToast('Please enter a valid email address.');
                }
                return;
            }

            if (!isMessageValid) {
                if (messageInput) messageInput.focus();
                if (typeof window.showToast === 'function') {
                    window.showToast('Please enter your message.');
                }
            }

            if (btn.classList.contains('btn-loading') || btn.classList.contains('btn-success')) return;

            btn.classList.add('btn-loading');
            btn.setAttribute('aria-busy', 'true');
            btn.setAttribute('aria-disabled', 'true');
            contactStatus.textContent = 'Sending message...';

            setTimeout(() => {
                btn.classList.remove('btn-loading');
                btn.classList.add('btn-success');
                btn.textContent = 'Message Sent!';
                btn.setAttribute('aria-busy', 'false');
                contactStatus.textContent = 'Message successfully sent to Leul.';

                contactForm.reset();
                setTimeout(() => {
                    btn.classList.remove('btn-success');
                    btn.textContent = originalText;
                    btn.removeAttribute('aria-busy');
                    btn.removeAttribute('aria-disabled');
                    contactStatus.textContent = '';
                }, 4000);
            }, 800);
        });

        contactForm.addEventListener('reset', () => {
            emailHasBeenBlurred = false;
            nameHasBeenBlurred = false;
            messageHasBeenBlurred = false;

            if (nameInput) {
                nameInput.classList.remove('is-valid', 'is-invalid');
                nameInput.removeAttribute('aria-invalid');
            }
            if (emailInput) {
                emailInput.classList.remove('is-valid', 'is-invalid');
                emailInput.removeAttribute('aria-invalid');
            }
            if (messageInput) {
                messageInput.classList.remove('is-valid', 'is-invalid');
                messageInput.removeAttribute('aria-invalid');
            }

            if (nameFeedback) {
                nameFeedback.textContent = '';
                nameFeedback.className = 'field-feedback';
            }
            if (emailFeedback) {
                emailFeedback.textContent = '';
                emailFeedback.className = 'field-feedback';
            }
            if (messageFeedback) {
                messageFeedback.textContent = '';
                messageFeedback.className = 'field-feedback';
            }

            setTimeout(() => {
                updateCharCount();
            }, 0);

            localStorage.removeItem('contact_form_draft');
        });
    }

    // Email Copy Helper
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

    const copyEmailBtn = document.getElementById('btn-copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', () => {
            const emailAddress = 'leulabiti98@gmail.com';

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
        textArea.style.position = 'fixed';
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


    // 4.02 Contact Form Draft Persistence
    const formFields = {
        name: document.getElementById('name'),
        email: document.getElementById('email'),
        message: document.getElementById('message')
    };

    const saveDraft = () => {
        const draft = {
            name: nameInput ? nameInput.value : '',
            email: emailInput ? emailInput.value : '',
            message: messageInput ? messageInput.value : ''
        };
        const hasData = draft.name.trim() || draft.email.trim() || draft.message.trim();
        if (hasData) {
            localStorage.setItem('contact_form_draft', JSON.stringify(draft));
        } else {
            localStorage.removeItem('contact_form_draft');
        }
    };

    const restoreDraft = () => {
        try {
            const saved = localStorage.getItem('contact_form_draft');
            if (saved) {
                const draft = JSON.parse(saved);
                let restoredAny = false;

                if (nameInput && draft.name) {
                    nameInput.value = draft.name;
                    restoredAny = true;
                    validateName();
                }
                if (emailInput && draft.email) {
                    emailInput.value = draft.email;
                    restoredAny = true;
                    validateEmail();
                }
                if (messageInput && draft.message) {
                    messageInput.value = draft.message;
                    restoredAny = true;
                    updateCharCount();
                    validateMessage();
                }

                if (restoredAny) {
                    setTimeout(() => {
                        if (typeof window.showToast === 'function') {
                            window.showToast('Draft restored from your last visit!');
                        }
                    }, 1600);
                }
            }
        } catch (e) {
            console.error('Failed to restore draft', e);
        }
    };

    if (contactForm && nameInput && emailInput && messageInput) {
        nameInput.addEventListener('input', saveDraft);
        emailInput.addEventListener('input', saveDraft);
        messageInput.addEventListener('input', saveDraft);
        restoreDraft();
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
                modalDeviceDesktop.setAttribute('aria-pressed', 'true');
                modalDeviceMobile.classList.remove('active');
                modalDeviceDesktop.setAttribute('aria-pressed', 'true');
                modalDeviceMobile.setAttribute('aria-pressed', 'false');

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

        // Keyboard: Focus trap, Escape close, and View simulation shortcuts (D for Desktop, M for Mobile)
        document.addEventListener('keydown', (e) => {
            if (previewModal.classList.contains('active')) {
                handleFocusTrap(previewModal, e);
                if (e.key === 'Escape') {
                    closeModal();
                    return;
                }

                // Safety checks before intercepting keyboard shortcuts
                if (e.target) {
                    const targetTag = e.target.tagName ? e.target.tagName.toLowerCase() : '';
                    const isEditable = e.target.isContentEditable || e.target.getAttribute('contenteditable') === 'true';
                    if (targetTag === 'input' || targetTag === 'textarea' || isEditable) {
                        return;
                    }
                }

                if (e.key === 'd' || e.key === 'D') {
                    if (modalDeviceDesktop) {
                        modalDeviceDesktop.click();
                    }
                } else if (e.key === 'm' || e.key === 'M') {
                    if (modalDeviceMobile) {
                        modalDeviceMobile.click();
                    }
                }
            }
        });

        // Device simulator controls
        if (modalDeviceDesktop && modalDeviceMobile && iframeViewport) {
            modalDeviceDesktop.addEventListener('click', () => {
                iframeViewport.classList.remove('mobile');
                modalDeviceDesktop.classList.add('active');
                modalDeviceDesktop.setAttribute('aria-pressed', 'true');
                modalDeviceMobile.classList.remove('active');
                modalDeviceDesktop.setAttribute('aria-pressed', 'true');
                modalDeviceMobile.setAttribute('aria-pressed', 'false');
            });

            modalDeviceMobile.addEventListener('click', () => {
                iframeViewport.classList.add('mobile');
                modalDeviceMobile.classList.add('active');
                modalDeviceMobile.setAttribute('aria-pressed', 'true');
                modalDeviceDesktop.classList.remove('active');
                modalDeviceMobile.setAttribute('aria-pressed', 'true');
                modalDeviceDesktop.setAttribute('aria-pressed', 'false');
            });
        }
    }

    // 8.5 Testimonial Avatar Fallback (ui-avatars.com)
    const testimonialAvatars = document.querySelectorAll('.author-avatar');
    testimonialAvatars.forEach(avatar => {
        const handleAvatarError = () => {
            const card = avatar.closest('.testimonial-card');
            if (!card) return;
            const nameEl = card.querySelector('.author-name');
            const rawName = nameEl ? nameEl.textContent.replace(' →', '').trim() : 'Client';

            // Clean up the name for the UI Avatar service URL
            const nameParam = encodeURIComponent(rawName);
            // Use premium-aligned colors (dark green theme fallback for light or dark mode)
            avatar.src = `https://ui-avatars.com/api/?name=${nameParam}&background=0D0D0D&color=FAFAFA&size=128&bold=true`;

            // Remove listener to prevent infinite loops if the fallback service itself fails
            avatar.removeEventListener('error', handleAvatarError);
        };
        avatar.addEventListener('error', handleAvatarError);
    });

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

    // 13.5 Floating Back to Top Button Logic
    const backToTopBtn = document.getElementById('back-to-top');
    const skipLink = document.querySelector('.skip-link');
    const mainContent = document.getElementById('main');

    if (skipLink && mainContent) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('visible');
                backToTopBtn.setAttribute('aria-hidden', 'false');
                backToTopBtn.setAttribute('tabindex', '0');
            } else {
                backToTopBtn.classList.remove('visible');
                backToTopBtn.setAttribute('aria-hidden', 'true');
                backToTopBtn.setAttribute('tabindex', '-1');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            // Redirect keyboard focus to top skip link when clicked
            if (skipLink) {
                // Focus slightly after to let the smooth scroll begin
                setTimeout(() => {
                    skipLink.focus();
                }, 100);
            }
        });
    }

    // 13.7 Skip Link Click programmatic focus redirection
    if (skipLink) {
        skipLink.addEventListener('click', (e) => {
            e.preventDefault();
            const mainContent = document.getElementById('main');
            if (mainContent) {
                mainContent.focus();
                const topOffset = mainContent.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: topOffset,
                    behavior: 'smooth'
                });
            }
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

    // ==========================================================================
    // 15. Graphic Design Showcase & Custom Lightbox Module
    // ==========================================================================
    const graphics = [
        {
            src: "IMG_2107.PNG",
            title: "Freshly Made Beetroot Juice",
            client: "Madiga Restaurant & Café",
            category: "Social Posts",
            year: 2025,
            alt: "Promotional graphic for Madiga Restaurant featuring freshly made beetroot juice, wellness benefits, and café atmosphere."
        },
        {
            src: "IMG_2608.PNG",
            title: "Back to School Hero Campaign",
            client: "Kuncho",
            category: "Posters",
            year: 2025,
            alt: "Vibrant back to school campaign poster for Kuncho featuring backpacks, water bottles, and stationery."
        },
        {
            src: "IMG_2108.PNG",
            title: "Trendy Lunch Boxes Campaign",
            client: "Sheva Toys",
            category: "Social Posts",
            year: 2025,
            alt: "Product showcase graphic for Sheva Toys featuring trendy, durable lunch boxes for school kids."
        },
        {
            src: "IMG_2109.PNG",
            title: "Kuncho Brand Teaser Launch",
            client: "Kuncho",
            category: "Stories",
            year: 2025,
            alt: "Coming soon brand launch teaser graphic for Kuncho kids & teens accessories with 3D logo emblem."
        },
        {
            src: "IMG_2611.PNG",
            title: "Back to School Essentials",
            client: "Sheva Toys",
            category: "Posters",
            year: 2025,
            alt: "Colorful promotional poster for Sheva Toys showcasing back-to-school essentials including backpacks, lunchboxes, and stationery."
        },
        {
            src: "IMG_2620.PNG",
            title: "Eat Your Protein Campaign",
            client: "Madiga Restaurant & Café",
            category: "Social Posts",
            year: 2025,
            alt: "Healthy dining social poster for Madiga Café emphasizing high protein meals with chicken, eggs, and spinach."
        },
        {
            src: "IMG_2621.PNG",
            title: "Tailoring Scissors Commercial",
            client: "Nesbir Trading PLC",
            category: "Branding",
            year: 2024,
            alt: "Commercial marketing poster for Nesbir Trading showcasing sharp, durable tailoring scissors and stationery supplies."
        },
        {
            src: "IMG_2858.PNG",
            title: "Ethiopian New Year Celebration",
            client: "Madiga Café & Restaurant",
            category: "Stories",
            year: 2024,
            alt: "Warm holiday celebration poster for Madiga Café wishing Happy Ethiopian New Year with traditional feast and scenic Addis Ababa sunrise."
        },
        {
            src: "IMG_2860.PNG",
            title: "Enkutatash Children's New Year",
            client: "Kuncho",
            category: "Posters",
            year: 2024,
            alt: "Festive Ethiopian New Year poster for Kuncho featuring children in traditional attire celebrating with yellow Adey Abeba flowers."
        },
        {
            src: "IMG_3106.PNG",
            title: "Commercial Waste Bin Launch",
            client: "Atlantic Trading PLC",
            category: "Branding",
            year: 2024,
            alt: "Industrial product poster for Atlantic Trading highlighting durable commercial waste bins with wheels."
        },
        {
            src: "IMG_3146.PNG",
            title: "Outdoor Table Set Promotion",
            client: "Atlantic Trading PLC",
            category: "Branding",
            year: 2024,
            alt: "Commercial patio table set product promotional poster for Atlantic Trading."
        },
        {
            src: "IMG_3156.PNG",
            title: "Umbrella Shade Promotional Banner",
            client: "Atlantic Trading PLC",
            category: "Posters",
            year: 2024,
            alt: "Large cantilever patio umbrella shade product banner for Atlantic Trading PLC."
        },
        {
            src: "water bottle.png",
            title: "Hydrate Play Repeat Kids Bottles",
            client: "Kuncho",
            category: "Social Posts",
            year: 2025,
            alt: "Fun and stylish kids water bottle promotional graphic for Kuncho with cartoon characters and lifestyle shots."
        }
    ];

    const graphicsGrid = document.getElementById('graphics-grid');
    const filterButtons = document.querySelectorAll('.graphics-filter-btn');

    if (graphicsGrid) {
        let currentFilter = 'all';
        let filteredGraphics = [...graphics];
        let currentLightboxIndex = 0;
        let lastActiveTrigger = null;

        // Render cards into masonry grid
        function renderGraphicsGrid() {
            graphicsGrid.innerHTML = '';

            graphics.forEach((item, index) => {
                const card = document.createElement('figure');
                card.className = 'graphic-card fade-in';
                card.dataset.category = item.category;
                card.dataset.src = item.src;
                card.setAttribute('tabindex', '0');
                card.setAttribute('role', 'button');
                card.setAttribute('aria-label', `View ${item.title} — ${item.client} (${item.category})`);
                card.style.setProperty('--delay', `${(index % 6) * 0.08}s`);

                card.innerHTML = `
                    <div class="graphic-media-wrap">
                        <picture>
                            <img class="graphic-img" 
                                 src="${item.src}" 
                                 alt="${item.alt}" 
                                 loading="lazy" 
                                 decoding="async">
                        </picture>
                        <div class="graphic-overlay">
                            <figcaption class="graphic-caption">
                                <div class="graphic-meta-row">
                                    <span class="graphic-category-tag">${item.category}</span>
                                    <span class="graphic-dot"></span>
                                    <span class="graphic-year">${item.year}</span>
                                </div>
                                <h3 class="graphic-title">${item.title}</h3>
                                <p class="graphic-client">${item.client}</p>
                            </figcaption>
                        </div>
                    </div>
                `;

                // Open Lightbox on click or keyboard Enter/Space
                card.addEventListener('click', () => {
                    openLightbox(item);
                });

                card.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        openLightbox(item);
                    }
                });

                graphicsGrid.appendChild(card);
            });

            // Trigger scroll reveal observer for freshly rendered cards
            const graphicCards = graphicsGrid.querySelectorAll('.graphic-card');
            const cardFadeObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, { root: null, rootMargin: '0px', threshold: 0.08 });

            graphicCards.forEach(card => cardFadeObserver.observe(card));
        }

        renderGraphicsGrid();

        // Filter tab interactions
        function setFilter(filter) {
            currentFilter = filter;
            const cards = graphicsGrid.querySelectorAll('.graphic-card');

            filterButtons.forEach(btn => {
                const isSelected = btn.dataset.filter === filter;
                btn.classList.toggle('active', isSelected);
                btn.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
            });

            cards.forEach(card => {
                const cardCategory = card.dataset.category;
                const matches = filter === 'all' || cardCategory.toLowerCase() === filter.toLowerCase();

                if (matches) {
                    card.classList.remove('is-hidden');
                    card.classList.remove('filtering-out');
                    card.classList.add('filtering-in');
                } else {
                    card.classList.remove('filtering-in');
                    card.classList.add('filtering-out');
                    setTimeout(() => {
                        if (card.classList.contains('filtering-out')) {
                            card.classList.add('is-hidden');
                        }
                    }, 200);
                }
            });

            // Update current navigable array for lightbox
            if (filter === 'all') {
                filteredGraphics = [...graphics];
            } else {
                filteredGraphics = graphics.filter(g => g.category.toLowerCase() === filter.toLowerCase());
            }
        }

        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                setFilter(btn.dataset.filter);
            });
        });

        // Lightbox Elements
        const lightbox = document.getElementById('graphics-lightbox');
        const lightboxImg = document.getElementById('lightbox-img');
        const lightboxTitle = document.getElementById('lightbox-title');
        const lightboxClient = document.getElementById('lightbox-client');
        const lightboxCategory = document.getElementById('lightbox-category');
        const lightboxYear = document.getElementById('lightbox-year');
        const lightboxClose = document.getElementById('lightbox-close');
        const lightboxPrev = document.getElementById('lightbox-prev');
        const lightboxNext = document.getElementById('lightbox-next');
        const lightboxBackdrop = document.getElementById('lightbox-backdrop');

        function updateLightboxView() {
            if (!filteredGraphics.length) return;
            const item = filteredGraphics[currentLightboxIndex];
            if (!item) return;

            if (lightboxImg) {
                lightboxImg.style.opacity = '0.3';
                lightboxImg.src = item.src;
                lightboxImg.alt = item.alt || item.title;
                lightboxImg.onload = () => {
                    lightboxImg.style.opacity = '1';
                };
            }

            if (lightboxTitle) lightboxTitle.textContent = item.title;
            if (lightboxClient) lightboxClient.textContent = item.client;
            if (lightboxCategory) lightboxCategory.textContent = item.category;
            if (lightboxYear) lightboxYear.textContent = item.year;
        }

        function openLightbox(item) {
            lastActiveTrigger = document.activeElement;
            currentLightboxIndex = filteredGraphics.findIndex(g => g.src === item.src);
            if (currentLightboxIndex === -1) {
                currentLightboxIndex = 0;
            }

            updateLightboxView();

            if (lightbox) {
                lightbox.classList.add('is-open');
                lightbox.setAttribute('aria-hidden', 'false');
                document.body.style.overflow = 'hidden';

                setTimeout(() => {
                    lightboxClose?.focus();
                }, 50);
            }
        }

        function closeLightbox() {
            if (!lightbox || !lightbox.classList.contains('is-open')) return;
            lightbox.classList.remove('is-open');
            lightbox.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';

            if (lastActiveTrigger && typeof lastActiveTrigger.focus === 'function') {
                lastActiveTrigger.focus();
            }
        }

        function prevGraphic() {
            if (filteredGraphics.length <= 1) return;
            currentLightboxIndex = (currentLightboxIndex - 1 + filteredGraphics.length) % filteredGraphics.length;
            updateLightboxView();
        }

        function nextGraphic() {
            if (filteredGraphics.length <= 1) return;
            currentLightboxIndex = (currentLightboxIndex + 1) % filteredGraphics.length;
            updateLightboxView();
        }

        lightboxClose?.addEventListener('click', closeLightbox);
        lightboxBackdrop?.addEventListener('click', closeLightbox);
        lightboxPrev?.addEventListener('click', prevGraphic);
        lightboxNext?.addEventListener('click', nextGraphic);

        // Keyboard navigation and focus trap
        document.addEventListener('keydown', (e) => {
            if (!lightbox || !lightbox.classList.contains('is-open')) return;

            if (e.key === 'Escape') {
                e.preventDefault();
                closeLightbox();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevGraphic();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextGraphic();
            } else if (e.key === 'Tab') {
                handleFocusTrap(lightbox, e);
            }
        });

        // Touch swipe gestures for mobile
        let touchStartX = 0;
        let touchStartY = 0;

        if (lightbox) {
            lightbox.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    touchStartX = e.touches[0].clientX;
                    touchStartY = e.touches[0].clientY;
                }
            }, { passive: true });

            lightbox.addEventListener('touchend', (e) => {
                if (e.changedTouches.length === 1) {
                    const deltaX = e.changedTouches[0].clientX - touchStartX;
                    const deltaY = e.changedTouches[0].clientY - touchStartY;

                    // Ensure dominant horizontal movement over 45px
                    if (Math.abs(deltaX) > 45 && Math.abs(deltaX) > Math.abs(deltaY) * 1.4) {
                        if (deltaX < 0) {
                            nextGraphic();
                        } else {
                            prevGraphic();
                        }
                    }
                }
            }, { passive: true });
        }
    }

});
