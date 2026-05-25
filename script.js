document.addEventListener('DOMContentLoaded', () => {
    initTerminal();
    updateTime();
    setInterval(updateTime, 1000);
    simulateLoad();
    startBootSequence();
});

const COMMANDS = {
    help: () => `
<div class="output-line">AVAILABLE_COMMANDS:</div>
<div class="output-line">  <span class="output-cmd">about</span> ....... Engineer profile and stack</div>
<div class="output-line">  <span class="output-cmd">projects</span> .... Access data fragments</div>
<div class="output-line">  <span class="output-cmd">contact</span> ..... Open secure link</div>
<div class="output-line">  <span class="output-cmd">clear</span> ....... Clear terminal buffer</div>
<div class="output-line">  <span class="output-cmd">exit</span> ........ Terminate session</div>
`,
    about: () => `
<div class="output-title">NOVA_ENGINEER_PROFILE: LEUL_ABITI</div>
<div class="output-line mt-1">ROLE: Frontend-focused Software Developer</div>
<div class="output-line">LOCATION: Addis Ababa, Ethiopia</div>
<div class="output-line">STATUS: Currently available for high-impact collaborations.</div>
<div class="output-line mt-1">CORE_STACK:</div>
<div class="output-line">  [React] [Next.js] [TypeScript] [Tailwind]</div>
<div class="output-line">  [Java/Spring] [Python] [UI/UX]</div>
`,
    projects: () => `
<div class="output-title">DATA_FRAGMENTS: RECENT_WORK</div>
<div class="project-fragment">
    <div class="highlight">MED-CHAIN</div>
    <div class="output-line">Secure medical record ecosystem on blockchain.</div>
    <div class="tech-tag">Java</div><div class="tech-tag">Spring</div><div class="tech-tag">JS</div>
</div>
<div class="project-fragment">
    <div class="highlight">MOHSQUARE</div>
    <div class="output-line">Portfolio platform for visual artists.</div>
    <div class="tech-tag">React</div><div class="tech-tag">Python</div><div class="tech-tag">CSS</div>
</div>
<div class="project-fragment">
    <div class="highlight">LEULFIT</div>
    <div class="output-line">Immersive health & fitness tracking prototype.</div>
    <div class="tech-tag">HTML</div><div class="tech-tag">CSS</div><div class="tech-tag">JS</div>
</div>
<p class="output-line mt-1">Total: 6 fragments indexed.</p>
`,
    contact: () => `
<div class="output-title">ESTABLISHING_SECURE_LINK...</div>
<div class="output-line mt-1">EMAIL: <span class="highlight">leulabiti98@gmail.com</span></div>
<div class="output-line">GITHUB: github.com/leul-cpu</div>
<div class="output-line">LINKEDIN: linkedin.com/in/leul-abiti</div>
<div class="output-line mt-1">MESSAGE: "Let's turn your imagination into reality."</div>
`,
    clear: () => {
        document.getElementById('terminalOutput').innerHTML = '';
        return '';
    },
    exit: () => `
<div class="output-line">SESSION_TERMINATED.</div>
<div class="output-line">Closing link...</div>
<div class="output-line mt-1">Note: This is a web-simulated terminal. Refresh to reboot.</div>
`
};

function initTerminal() {
    const input = document.getElementById('terminalInput');
    const output = document.getElementById('terminalOutput');

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = input.value.trim().toLowerCase();
            input.value = '';

            // Echo command
            const cmdLine = document.createElement('div');
            cmdLine.className = 'output-line mt-1';

            const promptSpan = document.createElement('span');
            promptSpan.className = 'prompt';
            promptSpan.textContent = 'nova@root:~$ ';

            const cmdSpan = document.createElement('span');
            cmdSpan.textContent = val;

            cmdLine.appendChild(promptSpan);
            cmdLine.appendChild(cmdSpan);
            output.appendChild(cmdLine);

            // Execute command
            if (COMMANDS[val]) {
                const response = document.createElement('div');
                typeWriter(COMMANDS[val](), response);
                output.appendChild(response);
            } else if (val !== '') {
                const error = document.createElement('div');
                error.className = 'output-line';

                const errPrefix = document.createElement('span');
                errPrefix.textContent = 'ERROR: COMMAND_NOT_FOUND: ';

                const errCmd = document.createElement('span');
                errCmd.textContent = val;

                const errSuffix = document.createElement('span');
                errSuffix.textContent = ". Type 'help' for options.";

                error.appendChild(errPrefix);
                error.appendChild(errCmd);
                error.appendChild(errSuffix);
                output.appendChild(error);
            }

            output.scrollTop = output.scrollHeight;
            logAction(val);
        }
    });

    // Handle clicks for commands
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('output-cmd')) {
            input.value = e.target.innerText;
            input.focus();
            const event = new KeyboardEvent('keydown', {'key': 'Enter'});
            input.dispatchEvent(event);
        }
    });
}

function updateTime() {
    const timeEl = document.getElementById('osTime');
    const now = new Date();
    timeEl.innerText = now.toTimeString().split(' ')[0];
}

function logAction(cmd) {
    const logs = document.getElementById('systemLogs');
    const log = document.createElement('div');
    log.className = 'log-line';
    log.innerText = `> EXEC_CMD: ${cmd.toUpperCase()}`;
    logs.prepend(log);
    if (logs.children.length > 8) logs.removeChild(logs.lastChild);
}

function typeWriter(html, element, speed = 1) {
    let i = 0;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const textNodes = Array.from(tempDiv.childNodes);

    element.innerHTML = '';

    function write() {
        if (i < textNodes.length) {
            const node = textNodes[i].cloneNode(true);
            element.appendChild(node);
            i++;
            setTimeout(write, speed);
        }
    }
    write();
}

async function startBootSequence() {
    const output = document.getElementById('terminalOutput');
    const bootLines = [
        { text: 'INIT_SYSTEM_BOOT...', class: 'boot-line' },
        { text: 'LOAD_KERNEL_MODULES [OK]', class: 'boot-line' },
        { text: 'IDENTIFYING_ENGINEER: <span class="highlight">LEUL_ABITI</span>', class: 'boot-line' },
        { text: 'ACCESS_GRANTED. WELCOME BACK.', class: 'boot-line' },
        { text: "Type 'help' for available commands.", class: 'boot-line mt-1' }
    ];

    output.innerHTML = '';
    for (const line of bootLines) {
        const div = document.createElement('div');
        div.className = line.class;
        output.appendChild(div);
        await new Promise(resolve => {
            typeWriter(line.text, div, 10);
            setTimeout(resolve, 300);
        });
    }
}

function simulateLoad() {
    const bars = document.querySelectorAll('.bar');
    setInterval(() => {
        bars.forEach(bar => {
            const current = parseInt(bar.style.width);
            const delta = Math.floor(Math.random() * 10) - 4;
            const next = Math.max(5, Math.min(95, current + delta));
            bar.style.width = `${next}%`;
        });
    }, 2000);
}
