document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initReveal();
    initNav();
});

function initCursor() {
    const cursor = document.querySelector('.cursor-crosshair');
    if (!cursor) return;

    window.addEventListener('mousemove', (e) => {
        cursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    });
}

function initReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

function initNav() {
    const links = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section, footer');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (pageYOffset >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}
