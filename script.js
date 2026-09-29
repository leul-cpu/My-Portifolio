(function () {
'use strict';
function handleFocusTrap(container, e) {
if (e.key !== 'Tab') return;
const focusable = container.querySelectorAll('a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])');
if (!focusable.length) return;
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
const navMenuBtn = document.getElementById('nav-menu-btn');
const navMobileOverlay = document.getElementById('nav-mobile-overlay');
if (navMenuBtn && navMobileOverlay) {
const toggleMenu = () => {
const isExpanded = navMenuBtn.getAttribute('aria-expanded') === 'true';
navMenuBtn.setAttribute('aria-expanded', !isExpanded);
navMenuBtn.setAttribute('aria-label', isExpanded ? 'Open menu' : 'Close menu');
navMenuBtn.classList.toggle('active');
navMobileOverlay.classList.toggle('active');
navMobileOverlay.setAttribute('aria-hidden', isExpanded ? 'true' : 'false');
document.body.style.overflow = isExpanded ? '' : 'hidden';
if (!isExpanded) {
const firstLink = navMobileOverlay.querySelector('a');
if (firstLink) setTimeout(() => firstLink.focus(), 100);
} else {
navMenuBtn.focus();
}
};
navMenuBtn.addEventListener('click', toggleMenu);
navMobileOverlay.querySelectorAll('a').forEach(link => {
link.addEventListener('click', toggleMenu);
});
document.addEventListener('keydown', (e) => {
if (navMobileOverlay.classList.contains('active')) {
handleFocusTrap(navMobileOverlay, e);
if (e.key === 'Escape') toggleMenu();
}
});
}
const fadeElements = document.querySelectorAll('.fade-in');
if (fadeElements.length && 'IntersectionObserver' in window) {
const fadeObserver = new IntersectionObserver((entries, observer) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
entry.target.classList.add('visible');
observer.unobserve(entry.target);
}
});
}, { rootMargin: '0px 0px -40px 0px', threshold: 0.05 });
fadeElements.forEach(el => fadeObserver.observe(el));
} else {
fadeElements.forEach(el => el.classList.add('visible'));
}
const yearSpan = document.getElementById('year');
if (yearSpan) {
yearSpan.textContent = new Date().getFullYear();
}
const themeToggleBtn = document.getElementById('theme-toggle');
if (themeToggleBtn) {
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const updateThemeUI = (isDark) => {
const label = isDark ? 'Switch to light mode (Press T)' : 'Switch to dark mode (Press T)';
themeToggleBtn.setAttribute('aria-label', label);
themeToggleBtn.setAttribute('title', label);
if (themeColorMeta) {
themeColorMeta.setAttribute('content', isDark ? '#050505' : '#FFFFFF');
}
};
const toggleTheme = () => {
const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
if (isDark) {
document.documentElement.removeAttribute('data-theme');
try { localStorage.setItem('theme', 'light'); } catch (e) {}
updateThemeUI(false);
} else {
document.documentElement.setAttribute('data-theme', 'dark');
try { localStorage.setItem('theme', 'dark'); } catch (e) {}
updateThemeUI(true);
}
};
themeToggleBtn.addEventListener('click', toggleTheme);
document.addEventListener('keydown', (e) => {
if (!e.target) return;
const tag = (e.target.tagName || '').toLowerCase();
if (tag === 'input' || tag === 'textarea' || e.target.isContentEditable) return;
if (e.key === 't' || e.key === 'T') {
toggleTheme();
}
});
}
const navbar = document.querySelector('.navbar');
const backToTopBtn = document.getElementById('back-to-top');
let ticking = false;
window.addEventListener('scroll', () => {
if (!ticking) {
window.requestAnimationFrame(() => {
const scrollY = window.scrollY;
if (navbar) {
if (scrollY > 40) navbar.classList.add('scrolled');
else navbar.classList.remove('scrolled');
}
if (backToTopBtn) {
if (scrollY > 400) {
backToTopBtn.classList.add('visible');
backToTopBtn.setAttribute('aria-hidden', 'false');
backToTopBtn.setAttribute('tabindex', '0');
} else {
backToTopBtn.classList.remove('visible');
backToTopBtn.setAttribute('aria-hidden', 'true');
backToTopBtn.setAttribute('tabindex', '-1');
}
}
ticking = false;
});
ticking = true;
}
}, { passive: true });
if (backToTopBtn) {
backToTopBtn.addEventListener('click', () => {
window.scrollTo({ top: 0, behavior: 'smooth' });
});
}
window.showToast = function (message) {
let toast = document.querySelector('.toast-notification');
if (!toast) {
toast = document.createElement('div');
toast.className = 'toast-notification';
toast.setAttribute('role', 'status');
toast.setAttribute('aria-live', 'polite');
document.body.appendChild(toast);
}
toast.textContent = message;
toast.classList.add('visible');
setTimeout(() => {
toast.classList.remove('visible');
}, 3000);
};
const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const messageInput = document.getElementById('message');
const charCountEl = document.getElementById('message-char-count');
const contactStatus = document.getElementById('contact-status');
if (contactForm && nameInput && emailInput && messageInput) {
const nameFeedback = document.getElementById('name-validation-message');
const emailFeedback = document.getElementById('email-validation-message');
const messageFeedback = document.getElementById('message-validation-message');
const updateCharCount = () => {
if (charCountEl) {
charCountEl.textContent = `${messageInput.value.length} / 1000 characters`;
}
};
const saveDraft = () => {
try {
const draft = { name: nameInput.value, email: emailInput.value, message: messageInput.value };
if (draft.name.trim() || draft.email.trim() || draft.message.trim()) {
localStorage.setItem('contact_draft', JSON.stringify(draft));
} else {
localStorage.removeItem('contact_draft');
}
} catch (e) {}
};
const restoreDraft = () => {
try {
const saved = localStorage.getItem('contact_draft');
if (saved) {
const draft = JSON.parse(saved);
if (draft.name) nameInput.value = draft.name;
if (draft.email) emailInput.value = draft.email;
if (draft.message) messageInput.value = draft.message;
updateCharCount();
}
} catch (e) {}
};
restoreDraft();
messageInput.addEventListener('input', () => {
updateCharCount();
saveDraft();
});
nameInput.addEventListener('input', saveDraft);
emailInput.addEventListener('input', saveDraft);
const validateName = () => {
const val = nameInput.value.trim();
if (!val) {
if (nameFeedback) { nameFeedback.textContent = 'Please enter your name.'; nameFeedback.className = 'field-feedback active invalid'; }
return false;
}
if (nameFeedback) { nameFeedback.textContent = ''; nameFeedback.className = 'field-feedback'; }
return true;
};
const validateEmail = () => {
const val = emailInput.value.trim();
const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!val || !re.test(val)) {
if (emailFeedback) { emailFeedback.textContent = 'Please enter a valid email address.'; emailFeedback.className = 'field-feedback active invalid'; }
return false;
}
if (emailFeedback) { emailFeedback.textContent = ''; emailFeedback.className = 'field-feedback'; }
return true;
};
const validateMessage = () => {
const val = messageInput.value.trim();
if (!val) {
if (messageFeedback) { messageFeedback.textContent = 'Please enter your message.'; messageFeedback.className = 'field-feedback active invalid'; }
return false;
}
if (messageFeedback) { messageFeedback.textContent = ''; messageFeedback.className = 'field-feedback'; }
return true;
};
nameInput.addEventListener('blur', validateName);
emailInput.addEventListener('blur', validateEmail);
messageInput.addEventListener('blur', validateMessage);
contactForm.addEventListener('submit', (e) => {
e.preventDefault();
const valid = validateName() & validateEmail() & validateMessage();
if (!valid) return;
const submitBtn = contactForm.querySelector('button[type="submit"]');
const originalText = submitBtn.textContent;
submitBtn.classList.add('btn-loading');
submitBtn.disabled = true;
setTimeout(() => {
submitBtn.classList.remove('btn-loading');
submitBtn.classList.add('btn-success');
submitBtn.textContent = 'Message Sent!';
if (contactStatus) contactStatus.textContent = 'Message successfully sent.';
contactForm.reset();
updateCharCount();
try { localStorage.removeItem('contact_draft'); } catch (err) {}
setTimeout(() => {
submitBtn.classList.remove('btn-success');
submitBtn.disabled = false;
submitBtn.textContent = originalText;
}, 3500);
}, 600);
});
}
const copyEmailBtn = document.getElementById('btn-copy-email');
if (copyEmailBtn) {
copyEmailBtn.addEventListener('click', () => {
const email = 'leulabiti98@gmail.com';
if (navigator.clipboard && navigator.clipboard.writeText) {
navigator.clipboard.writeText(email).then(() => {
window.showToast('Email copied to clipboard!');
}).catch(() => {
window.showToast(email);
});
} else {
window.showToast(email);
}
});
}
const previewModal = document.getElementById('preview-modal');
const modalIframe = document.getElementById('modal-iframe');
const modalLoader = document.getElementById('modal-loader');
const modalCloseBtn = document.getElementById('modal-close');
const modalExternalLink = document.getElementById('modal-external-link');
const modalDeviceDesktop = document.getElementById('modal-device-desktop');
const modalDeviceMobile = document.getElementById('modal-device-mobile');
const iframeViewport = document.querySelector('.iframe-viewport');
const modalTitle = document.getElementById('modal-title');
let lastActiveTrigger = null;
if (previewModal && modalIframe) {
const closePreview = () => {
previewModal.classList.remove('active');
previewModal.setAttribute('aria-hidden', 'true');
document.body.style.overflow = '';
modalIframe.src = '';
if (lastActiveTrigger) lastActiveTrigger.focus();
};
document.querySelectorAll('.btn-preview').forEach(btn => {
btn.addEventListener('click', (e) => {
e.preventDefault();
lastActiveTrigger = btn;
const previewUrl = btn.getAttribute('data-preview-url');
const projectCard = btn.closest('.project-card');
const titleText = projectCard ? projectCard.querySelector('.project-title').textContent : 'Live Preview';
if (modalTitle) modalTitle.textContent = `${titleText} — Live Preview`;
if (modalExternalLink) modalExternalLink.href = previewUrl;
if (modalLoader) modalLoader.classList.remove('hidden');
modalIframe.src = previewUrl;
if (iframeViewport) iframeViewport.classList.remove('mobile');
if (modalDeviceDesktop) modalDeviceDesktop.classList.add('active');
if (modalDeviceMobile) modalDeviceMobile.classList.remove('active');
previewModal.classList.add('active');
previewModal.setAttribute('aria-hidden', 'false');
document.body.style.overflow = 'hidden';
if (modalCloseBtn) modalCloseBtn.focus();
});
});
modalIframe.addEventListener('load', () => {
if (modalLoader) modalLoader.classList.add('hidden');
});
if (modalCloseBtn) modalCloseBtn.addEventListener('click', closePreview);
previewModal.addEventListener('click', (e) => {
if (e.target === previewModal) closePreview();
});
if (modalDeviceDesktop && modalDeviceMobile && iframeViewport) {
modalDeviceDesktop.addEventListener('click', () => {
iframeViewport.classList.remove('mobile');
modalDeviceDesktop.classList.add('active');
modalDeviceDesktop.setAttribute('aria-pressed', 'true');
modalDeviceMobile.classList.remove('active');
modalDeviceMobile.setAttribute('aria-pressed', 'false');
});
modalDeviceMobile.addEventListener('click', () => {
iframeViewport.classList.add('mobile');
modalDeviceMobile.classList.add('active');
modalDeviceMobile.setAttribute('aria-pressed', 'true');
modalDeviceDesktop.classList.remove('active');
modalDeviceDesktop.setAttribute('aria-pressed', 'false');
});
}
document.addEventListener('keydown', (e) => {
if (previewModal.classList.contains('active')) {
handleFocusTrap(previewModal, e);
if (e.key === 'Escape') closePreview();
}
});
}
const graphicsData = [
{
src: "IMG_2107.jpg",
width: 1086,
height: 1448,
title: "Freshly Made Beetroot Juice",
client: "Madiga Restaurant & Café",
category: "Social Posts",
year: 2025,
alt: "Promotional graphic for Madiga Restaurant featuring freshly made beetroot juice."
},
{
src: "IMG_2608.jpg",
width: 1054,
height: 1492,
title: "Back to School Hero Campaign",
client: "Kuncho",
category: "Posters",
year: 2025,
alt: "Back to school campaign poster for Kuncho featuring backpacks and stationery."
},
{
src: "IMG_2108.jpg",
width: 1024,
height: 1536,
title: "Trendy Lunch Boxes Campaign",
client: "Sheva Toys",
category: "Social Posts",
year: 2025,
alt: "Product showcase graphic for Sheva Toys featuring durable lunch boxes."
},
{
src: "IMG_2109.jpg",
width: 1024,
height: 1536,
title: "Kuncho Brand Teaser Launch",
client: "Kuncho",
category: "Stories",
year: 2025,
alt: "Coming soon brand launch teaser graphic for Kuncho."
},
{
src: "IMG_2611.jpg",
width: 1024,
height: 1536,
title: "Back to School Essentials",
client: "Sheva Toys",
category: "Posters",
year: 2025,
alt: "Promotional poster for Sheva Toys showcasing back-to-school essentials."
},
{
src: "IMG_2620.jpg",
width: 1054,
height: 1492,
title: "Eat Your Protein Campaign",
client: "Madiga Restaurant & Café",
category: "Social Posts",
year: 2025,
alt: "Healthy dining social poster for Madiga Café emphasizing high protein meals."
},
{
src: "IMG_2621.jpg",
width: 1024,
height: 1536,
title: "Tailoring Scissors Commercial",
client: "Nesbir Trading PLC",
category: "Branding",
year: 2024,
alt: "Commercial marketing poster for Nesbir Trading showcasing tailoring scissors."
},
{
src: "IMG_2858.jpg",
width: 1024,
height: 1536,
title: "Ethiopian New Year Celebration",
client: "Madiga Café & Restaurant",
category: "Stories",
year: 2024,
alt: "Holiday celebration poster for Madiga Café wishing Happy Ethiopian New Year."
}
];
const graphicsGrid = document.getElementById('graphics-grid');
const filterButtons = document.querySelectorAll('.graphics-filter-btn');
if (graphicsGrid) {
let activeFilter = 'all';
let currentIdx = 0;
let lightboxTrigger = null;
function renderCards() {
graphicsGrid.innerHTML = '';
graphicsData.forEach((item, index) => {
const card = document.createElement('figure');
card.className = 'graphic-card fade-in';
card.dataset.category = item.category;
card.setAttribute('tabindex', '0');
card.setAttribute('role', 'button');
card.setAttribute('aria-label', `View ${item.title} — ${item.client} (${item.category})`);
card.innerHTML = `
<div class="graphic-media-wrap">
<img class="graphic-img"
src="${item.src}"
alt="${item.alt}"
width="${item.width}"
height="${item.height}"
loading="lazy"
decoding="async">
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
card.addEventListener('click', () => openLightbox(index, card));
card.addEventListener('keydown', (e) => {
if (e.key === 'Enter' || e.key === ' ') {
e.preventDefault();
openLightbox(index, card);
}
});
graphicsGrid.appendChild(card);
});
}
renderCards();
filterButtons.forEach(btn => {
btn.addEventListener('click', () => {
const filter = btn.dataset.filter;
activeFilter = filter;
filterButtons.forEach(b => {
const isActive = b.dataset.filter === filter;
b.classList.toggle('active', isActive);
b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
});
const cards = graphicsGrid.querySelectorAll('.graphic-card');
cards.forEach(card => {
const match = filter === 'all' || card.dataset.category.toLowerCase() === filter.toLowerCase();
card.classList.toggle('is-hidden', !match);
});
});
});
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
const item = graphicsData[currentIdx];
if (!item || !lightbox) return;
if (lightboxImg) {
lightboxImg.src = item.src;
lightboxImg.alt = item.alt;
lightboxImg.width = item.width;
lightboxImg.height = item.height;
}
if (lightboxTitle) lightboxTitle.textContent = item.title;
if (lightboxClient) lightboxClient.textContent = item.client;
if (lightboxCategory) lightboxCategory.textContent = item.category;
if (lightboxYear) lightboxYear.textContent = item.year;
}
function openLightbox(index, triggerEl) {
lightboxTrigger = triggerEl;
currentIdx = index;
updateLightboxView();
if (lightbox) {
lightbox.classList.add('is-open');
lightbox.setAttribute('aria-hidden', 'false');
document.body.style.overflow = 'hidden';
if (lightboxClose) lightboxClose.focus();
}
}
function closeLightbox() {
if (!lightbox || !lightbox.classList.contains('is-open')) return;
lightbox.classList.remove('is-open');
lightbox.setAttribute('aria-hidden', 'true');
document.body.style.overflow = '';
if (lightboxTrigger) lightboxTrigger.focus();
}
if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
if (lightboxPrev) {
lightboxPrev.addEventListener('click', () => {
currentIdx = (currentIdx - 1 + graphicsData.length) % graphicsData.length;
updateLightboxView();
});
}
if (lightboxNext) {
lightboxNext.addEventListener('click', () => {
currentIdx = (currentIdx + 1) % graphicsData.length;
updateLightboxView();
});
}
document.addEventListener('keydown', (e) => {
if (lightbox && lightbox.classList.contains('is-open')) {
handleFocusTrap(lightbox, e);
if (e.key === 'Escape') closeLightbox();
else if (e.key === 'ArrowLeft') {
currentIdx = (currentIdx - 1 + graphicsData.length) % graphicsData.length;
updateLightboxView();
} else if (e.key === 'ArrowRight') {
currentIdx = (currentIdx + 1) % graphicsData.length;
updateLightboxView();
}
}
});
}
})();