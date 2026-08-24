/**
 * =============================================
 *  EASTER EGGS MODULE - SANDBOX
 * =============================================
 * Handles the Glassmorphic Terminal and Physics Shatter.
 * Entirely modular. Delete script import to completely remove.
 */

document.addEventListener('DOMContentLoaded', () => {

    /* ========================================================
       1. GLASSMORPHIC TERMINAL (~/$)
    ======================================================== */
    const createTerminalDOM = () => {
        const overlay = document.createElement('div');
        overlay.id = 'easter-terminal-overlay';
        overlay.innerHTML = `
            <div class="terminal-window">
                <div class="terminal-header">
                    <div class="terminal-controls">
                        <div class="t-btn t-close" id="term-close"></div>
                        <div class="t-btn t-min"></div>
                        <div class="t-btn t-max"></div>
                    </div>
                    <div class="terminal-title">vivek@portfolio: ~</div>
                    <div></div>
                </div>
                <div class="terminal-body" id="term-body">
                    <div class="terminal-line">Welcome to VivekOS v1.0.0.</div>
                    <div class="terminal-line">Type 'help' to see available commands.</div>
                    <div class="terminal-input-row" id="term-input-row">
                        <span class="cmd-prompt"><span class="cmd-user">vivek</span>@<span class="cmd-dir">~</span>$</span>
                        <input type="text" class="terminal-input" id="term-input" autocomplete="off" spellcheck="false">
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
        return { overlay, input: document.getElementById('term-input'), body: document.getElementById('term-body'), row: document.getElementById('term-input-row') };
    };

    const termDOM = createTerminalDOM();
    let isTermActive = false;

    const toggleTerminal = () => {
        isTermActive = !isTermActive;
        if (isTermActive) {
            termDOM.overlay.classList.add('active');
            setTimeout(() => termDOM.input.focus(), 100);
        } else {
            termDOM.overlay.classList.remove('active');
            termDOM.input.blur();
        }
    };

    // Trigger: Backtick Key
    document.addEventListener('keydown', (e) => {
        if (e.key === '`') {
            e.preventDefault();
            toggleTerminal();
        }
    });

    // Trigger: Mobile/Logo Click (Single tap)
    const logoLink = document.querySelector('.logo-link');
    if (logoLink) {
        logoLink.addEventListener('click', (e) => {
            e.preventDefault();
            toggleTerminal();
        });
    }

    document.getElementById('term-close').addEventListener('click', () => { toggleTerminal(); });

    // Terminal Commands
    termDOM.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const val = termDOM.input.value.trim().toLowerCase();
            if (!val) return;

            // Log command
            const cmdEcho = document.createElement('div');
            cmdEcho.className = 'terminal-line';
            cmdEcho.innerHTML = `<span class="cmd-prompt"><span class="cmd-user">vivek</span>@<span class="cmd-dir">~</span>$</span> ${val}`;
            termDOM.body.insertBefore(cmdEcho, termDOM.row);

            // Handle output
            const outLine = document.createElement('div');
            outLine.className = 'terminal-line';

            if (val === 'help') {
                outLine.innerHTML = `Available commands:<br>
                > whoami<br>
                > skills<br>
                > sudo hire --now<br>
                > clear<br>
                > exit`;
            } else if (val === 'whoami') {
                outLine.innerHTML = `Vivek K - Creative Developer & Tech Enthusiast. Building the next gen.`;
            } else if (val === 'skills') {
                outLine.innerHTML = `React, Python, Node, Flutter, Web3, UI/UX, Cyber Security, Breathing.`;
            } else if (val === 'sudo hire --now') {
                outLine.innerHTML = `[SUCCESS] Authorized user. Initializing hire sequence... Prepare an offer letter immediately.`;
                outLine.style.color = '#00ff99';
            } else if (val === 'clear') {
                const logs = termDOM.body.querySelectorAll('.terminal-line:not(#term-input-row)');
                logs.forEach(l => l.remove());
                termDOM.input.value = '';
                return;
            } else if (val === 'exit') {
                termDOM.input.value = '';
                toggleTerminal();
                return;
            } else {
                outLine.innerHTML = `Command not found: ${val}`;
                outLine.style.color = '#ff5f56';
            }

            termDOM.body.insertBefore(outLine, termDOM.row);
            termDOM.input.value = '';
            termDOM.body.scrollTop = termDOM.body.scrollHeight;
        }
    });

    // Keep focus inside terminal
    termDOM.overlay.addEventListener('click', () => {
        if (isTermActive) termDOM.input.focus();
    });



});
