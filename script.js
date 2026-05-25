const files = {
    'portfolio.js': `
<span class="keyword">const</span> <span class="constant">developer</span> = {
    <span class="property">name</span>: <span class="string">'Leul Abiti'</span>,
    <span class="property">role</span>: <span class="string">'Frontend Engineer'</span>,
    <span class="property">location</span>: <span class="string">'Addis Ababa, ET'</span>,
    <span class="property">status</span>: <span class="string">'available'</span>,
    <span class="property">skills</span>: [
        <span class="string">'React'</span>, <span class="string">'TypeScript'</span>,
        <span class="string">'Next.js'</span>, <span class="string">'Tailwind'</span>
    ],
    <span class="property">stats</span>: {
        <span class="property">projects</span>: <span class="constant">6</span>,
        <span class="property">clients</span>: <span class="constant">100</span>,
        <span class="property">experience</span>: <span class="constant">4</span>
    }
};

<span class="comment">// Turning imagination into reality through code.</span>
<span class="keyword">export default</span> <span class="constant">developer</span>;
`,
    'projects.js': `
<span class="keyword">const</span> <span class="constant">projects</span> = [
    {
        <span class="property">title</span>: <span class="string">'MED-CHAIN'</span>,
        <span class="property">tech</span>: [<span class="string">'Blockchain'</span>, <span class="string">'Java'</span>],
        <span class="property">status</span>: <span class="string">'Production'</span>
    },
    {
        <span class="property">title</span>: <span class="string">'MohSquare'</span>,
        <span class="property">tech</span>: [<span class="string">'React'</span>, <span class="string">'Python'</span>],
        <span class="property">status</span>: <span class="string">'Live'</span>
    }
];

<span class="keyword">function</span> <span class="function">renderProjects</span>(<span class="constant">list</span>) {
    <span class="keyword">return</span> <span class="constant">list</span>.<span class="function">map</span>(<span class="constant">p</span> => <span class="function">createCard</span>(<span class="constant">p</span>));
}
`,
    'principles.css': `
<span class="constant">.philosophy</span> {
    <span class="property">performance</span>: <span class="string">lightning-fast</span>;
    <span class="property">aesthetics</span>: <span class="string">beautiful</span>;
    <span class="property">responsive</span>: <span class="string">seamless</span>;
    <span class="property">maintainability</span>: <span class="string">high</span>;
}

<span class="constant">.code-quality</span> {
    <span class="property">cleanliness</span>: <span class="constant">100%</span>;
    <span class="property">documentation</span>: <span class="constant">comprehensive</span>;
}
`,
    'contact.js': `
<span class="keyword">async function</span> <span class="function">hireDeveloper</span>(<span class="constant">inquiry</span>) {
    <span class="keyword">const</span> <span class="constant">response</span> = <span class="keyword">await</span> <span class="function">fetch</span>(<span class="string">'/api/contact'</span>, {
        <span class="property">method</span>: <span class="string">'POST'</span>,
        <span class="property">body</span>: <span class="constant">JSON</span>.<span class="function">stringify</span>(<span class="constant">inquiry</span>)
    });

    <span class="keyword">return</span> <span class="constant">response</span>.<span class="function">json</span>();
}

<span class="comment">// Let's build something amazing together.</span>
`,
};

document.addEventListener('DOMContentLoaded', () => {
    initEditor();
    initStats();
    renderPreviewContent();
    initSyncScroll();
});

function renderPreviewContent() {
    const projectData = [
        { title: 'MED-CHAIN', tech: ['Blockchain', 'Java'], url: '#' },
        { title: 'MohSquare', tech: ['React', 'Python'], url: '#' },
        { title: 'LeulFit', tech: ['HealthTech', 'CSS'], url: '#' }
    ];

    const principleData = [
        { title: 'Performance', desc: 'Lightning-fast load times and smooth interactions.' },
        { title: 'Responsiveness', desc: 'Seamless adaptation across all devices and sizes.' },
        { title: 'Beautiful UI', desc: 'Crafting intuitive and aesthetically pleasing designs.' },
        { title: 'Latest Tech', desc: 'Leveraging cutting-edge tools for modern solutions.' }
    ];

    const projectContainer = document.querySelector('.project-cards');
    projectContainer.innerHTML = projectData.map(p => `
        <div class="project-card" data-tilt>
            <div class="p-card-info">
                <h3>${p.title}</h3>
                <div class="p-card-tech">
                    ${p.tech.map(t => `<span>${t}</span>`).join('')}
                </div>
            </div>
            <a href="${p.url}" class="p-card-link">↗</a>
        </div>
    `).join('');

    const principleContainer = document.querySelector('.principle-cards');
    principleContainer.innerHTML = principleData.map(p => `
        <div class="principle-card">
            <h3>${p.title}</h3>
            <p>${p.desc}</p>
        </div>
    `).join('');
}

function initEditor() {
    const editorContent = document.getElementById('editorContent');
    const lineNumbers = document.getElementById('lineNumbers');
    const tabs = document.querySelectorAll('.tab');
    const treeItems = document.querySelectorAll('.tree-item');

    window.loadFile = function(fileName, scrollPreview = true) {
        const content = files[fileName];
        if (!content) return;

        editorContent.innerHTML = content.trim();

        // Update line numbers
        const lines = content.trim().split('\n').length;
        lineNumbers.innerHTML = Array.from({length: lines}, (_, i) => i + 1).join('<br>');

        // Update UI
        document.querySelectorAll('.tab, .tree-item').forEach(el => {
            if (el.getAttribute('data-file') === fileName) {
                el.classList.add('active');
            } else {
                el.classList.remove('active');
            }
        });

        if (scrollPreview) {
            const sectionMap = {
                'portfolio.js': 'hero',
                'projects.js': 'projects',
                'principles.css': 'principles',
                'contact.js': 'contact'
            };
            const sectionId = sectionMap[fileName];
            if (sectionId) {
                const section = document.getElementById(sectionId);
                const container = document.getElementById('previewContainer');
                if (section && container) {
                    container.scrollTo({
                        top: section.offsetTop - 20,
                        behavior: 'smooth'
                    });
                }
            }
        }
    }

    tabs.forEach(tab => tab.addEventListener('click', () => window.loadFile(tab.getAttribute('data-file'))));
    treeItems.forEach(item => item.addEventListener('click', () => window.loadFile(item.getAttribute('data-file'))));

    // Initial load
    window.loadFile('portfolio.js');
}

function initStats() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const countTo = parseInt(target.getAttribute('data-target'));
                let current = 0;
                const duration = 2000;
                const step = duration / countTo;

                const timer = setInterval(() => {
                    current++;
                    target.innerText = current + (target.parentElement.classList.contains('p-stat') && countTo === 100 ? '%' : '+');
                    if (current >= countTo) clearInterval(timer);
                }, step);
                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.num').forEach(num => observer.observe(num));
}

function initSyncScroll() {
    const previewContainer = document.getElementById('previewContainer');
    const sections = document.querySelectorAll('.preview-section');
    const fileMap = {
        'hero': 'portfolio.js',
        'projects': 'projects.js',
        'principles': 'principles.css',
        'contact': 'contact.js'
    };

    previewContainer.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (previewContainer.scrollTop >= sectionTop - 200) {
                currentSection = section.getAttribute('id');
            }
        });

        if (currentSection && fileMap[currentSection]) {
            const fileName = fileMap[currentSection];
            const activeTab = document.querySelector('.tab.active');
            if (activeTab && activeTab.getAttribute('data-file') !== fileName) {
                // We use a window-level function to load file without triggering scroll recursion
                window.loadFile(fileName, false);
            }
        }
    });
}
