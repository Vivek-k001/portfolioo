/* =============================================
   VIVEK K PORTFOLIO — Main Script
   ============================================= */

'use strict';

// =============================================
// SHARED: Fast smooth scroll (700ms easeOutExpo)
// =============================================
function smoothScrollTo(target, duration) {
    duration = duration || 1600;
    const top = target.getBoundingClientRect().top + window.pageYOffset;
    const start = window.pageYOffset;
    const distance = top - start;
    let startTime = null;

    function easeInOutQuart(t) {
        return t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;
    }

    function animate(currentTime) {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        window.scrollTo(0, start + distance * easeInOutQuart(progress));
        if (progress < 1) requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
}

// =============================================
// SECTION INDEX MAP (for glass pill nav)
// =============================================
const sectionIds = ['hero', 'about', 'skills', 'projects', 'education', 'certs'];

function scrollToSection(index) {
    const id = sectionIds[index];
    const target = document.getElementById(id);
    if (!target) return;
    smoothScrollTo(target, 1600);
    updateActiveDot(index);
}

// =============================================
// DOT NAV — Active State
// =============================================
const totalDots = sectionIds.length;

function updateActiveDot(index) {
    for (let i = 0; i < totalDots; i++) {
        const d = document.getElementById(`dot-${i}`);
        if (d) d.classList.toggle('active', i === index);
    }
}

// IntersectionObserver for auto-updating active dot
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const idx = sectionIds.indexOf(entry.target.id);
            if (idx !== -1) updateActiveDot(idx);
        }
    });
}, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

sectionIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
});

// =============================================
// THEME TOGGLE
// =============================================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

const savedTheme = localStorage.getItem('vk-theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('vk-theme', next);
});

// =============================================
// CUSTOM CURSOR
// =============================================
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let ringX = 0, ringY = 0, dotX = 0, dotY = 0;
let cursorStarted = false;

function moveCursor(e) {
    dotX = e.clientX; dotY = e.clientY;
    cursorDot.style.left = dotX + 'px';
    cursorDot.style.top = dotY + 'px';
    if (!cursorStarted) { cursorStarted = true; animRing(); }
}

const rgbTextElements = document.querySelectorAll('[data-rgb-hover="true"]');
function animRing() {
    ringX += (dotX - ringX) * 0.11;
    ringY += (dotY - ringY) * 0.11;
    cursorRing.style.left = ringX + 'px';
    cursorRing.style.top = ringY + 'px';

    // Pass the lagged positioning directly into the text element!
    rgbTextElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const x = ringX - rect.left;
        const y = ringY - rect.top;
        el.style.setProperty('--mouse-x', `${x}px`);
        el.style.setProperty('--mouse-y', `${y}px`);
    });

    requestAnimationFrame(animRing);
}

document.addEventListener('mousemove', moveCursor);
document.addEventListener('mouseleave', () => {
    cursorDot.style.opacity = '0';
    cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
    if (html.getAttribute('data-theme') !== 'light') {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '0.5';
    }
});

// Scale up cursor on interactive elements
document.addEventListener('mouseover', (e) => {
    const el = e.target.closest('a, button, .project-card, .cert-card, .zigzag-content, .carousel-track img');
    if (el) {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(2.2)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1.6)';
        cursorRing.style.opacity = '0.3';
    } else {
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorRing.style.opacity = '0.5';
    }
});

// =============================================
// SCROLL PROGRESS BAR
// =============================================
const progressBar = document.getElementById('scrollProgressBar');

function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    // Timeline drawing logic
    const zigBlock = document.getElementById('zigzagTimeline');
    const zigLine = document.getElementById('timelineProgress');
    if (zigBlock && zigLine) {
        const rect = zigBlock.getBoundingClientRect();
        // Calculate how much of the timeline container has scrolled past the middle of the screen
        const elementTopOffset = rect.top - (window.innerHeight / 2);
        const elementHeight = rect.height;

        // Progress between 0 and 1
        let progressPercent = 0;
        if (elementTopOffset < 0) {
            progressPercent = Math.min(1, Math.abs(elementTopOffset) / elementHeight);
        }
        zigLine.style.height = (progressPercent * 100) + '%';
    }
}
window.addEventListener('scroll', updateProgress, { passive: true });
// =============================================
// SCROLL REVEAL (lightweight [data-aos])
// =============================================
const aosEls = document.querySelectorAll('[data-aos]');
const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObs.unobserve(entry.target);
        }
    });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
aosEls.forEach(el => revealObs.observe(el));

// =============================================
// HERO CANVAS — Grid Lines + Particle Network
// =============================================
(function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [], raf;

    function resize() {
        W = canvas.width = canvas.offsetWidth;
        H = canvas.height = canvas.offsetHeight;
        initParticles();
    }

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * W;
            this.y = Math.random() * H;
            this.vx = (Math.random() - 0.5) * 0.35;
            this.vy = (Math.random() - 0.5) * 0.35;
            this.r = Math.random() * 1.2 + 0.4;
            this.a = Math.random() * 0.5 + 0.05;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 210, 230, ${this.a})`;
            ctx.fill();
        }
    }

    function initParticles() {
        const count = Math.min(Math.floor((W * H) / 8500), 110);
        particles = Array.from({ length: count }, () => new Particle());
    }

    function drawGrid() {
        const isDark = html.getAttribute('data-theme') !== 'light';
        const lineAlpha = isDark ? 0.06 : 0.04;
        const gap = 52;
        ctx.strokeStyle = `rgba(180, 190, 210, ${lineAlpha})`;
        ctx.lineWidth = 0.5;
        for (let x = 0; x < W; x += gap) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
        }
        for (let y = 0; y < H; y += gap) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
        }
    }

    function connectParticles() {
        const maxDist = 110;
        const isDark = html.getAttribute('data-theme') !== 'light';
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const d = Math.sqrt(dx * dx + dy * dy);
                if (d < maxDist) {
                    const alpha = (1 - d / maxDist) * (isDark ? 0.2 : 0.08);
                    ctx.strokeStyle = `rgba(180, 190, 210, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function loop() {
        ctx.clearRect(0, 0, W, H);
        drawGrid();
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        raf = requestAnimationFrame(loop);
    }

    window.addEventListener('resize', () => {
        cancelAnimationFrame(raf);
        resize();
        loop();
    });

    resize();
    loop();
})();

// Hero canvas parallax
window.addEventListener('scroll', () => {
    const canvas = document.getElementById('heroCanvas');
    if (canvas) canvas.style.transform = `translateY(${window.scrollY * 0.22}px)`;
}, { passive: true });

// =============================================
// TYPEWRITER EFFECT
// =============================================
(function initTypewriter() {
    const el = document.getElementById('typewriterText');
    if (!el) return;
    const roles = [
        'Flutter Developer',
        'Desktop App Developer',
        'React Developer',
        'Frontend Web Developer',
        'UI/UX Designer',
        'Data Analyst'
    ];
    let ri = 0, ci = 0, deleting = false;
    const sp = { type: 80, del: 44, pause: 2200 };

    function tick() {
        const cur = roles[ri];
        if (!deleting) {
            el.textContent = cur.slice(0, ci + 1);
            ci++;
            if (ci === cur.length) { deleting = true; setTimeout(tick, sp.pause); return; }
        } else {
            el.textContent = cur.slice(0, ci - 1);
            ci--;
            if (ci === 0) { deleting = false; ri = (ri + 1) % roles.length; }
        }
        setTimeout(tick, deleting ? sp.del : sp.type);
    }
    setTimeout(tick, 1100);
})();

// =============================================
// SMOOTH SCROLL for anchor links (incl. "View My Work")
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
        const href = a.getAttribute('href');
        const target = href.length > 1 && document.querySelector(href);
        if (target) {
            e.preventDefault();
            smoothScrollTo(target, 1600);
        }
    });
});

// =============================================
// INFINITE LOGO CAROUSEL
// =============================================
const logoFiles = [
    "ai logo.png", "c logo.png", "css logo.png", "docker-logo.png",
    "flutter logo.png", "html logo.png", "java logo.png", "javascript logo.png",
    "ml logo.png", "n8n-logo.png", "php logo.png", "python logo.png",
    "react logo.png", "sql logo.png", "svelte-logo.png", "typescript-logo.png"
];
const folderPath = "logo/";
const rowsCount = 3;

function createCarousel() {
    const container = document.getElementById('carouselContainer');
    if (!container) return;
    for (let i = 0; i < rowsCount; i++) {
        const row = document.createElement('div');
        row.className = 'carousel-row';
        const track = document.createElement('div');
        track.className = 'carousel-track';
        let list = [...logoFiles, ...logoFiles];
        if (i === 1) list = list.slice(5).concat(list.slice(0, 5));
        if (i === 2) list = list.slice(10).concat(list.slice(0, 10));
        list.forEach(name => {
            const img = document.createElement('img');
            img.src = `${folderPath}${name}`;
            img.alt = name.replace(/\.[^/.]+$/, '');
            img.loading = 'lazy';
            track.appendChild(img);
        });
        row.appendChild(track);
        container.appendChild(row);
    }
}
document.addEventListener('DOMContentLoaded', createCarousel);

// =============================================
// 3D SLIDER — Drag + Touch + Wheel + Auto-spin
// =============================================
document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    if (!container || !slider) return;

    let isDragging = false, lastX = 0, currentRotation = 0, velocity = 0;
    const autoSpeed = 0.55, dragSpeed = 0.14, friction = 0.04;

    container.addEventListener('mousedown', (e) => { isDragging = true; lastX = e.clientX; velocity = 0; });
    window.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const diff = e.clientX - lastX;
        velocity = diff * dragSpeed;
        currentRotation += velocity;
        slider.style.transform = `rotateY(${currentRotation}deg)`;
        lastX = e.clientX;
    });
    window.addEventListener('mouseup', () => { isDragging = false; });

    container.addEventListener('touchstart', (e) => { isDragging = true; lastX = e.touches[0].clientX; velocity = 0; }, { passive: true });
    window.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        const diff = e.touches[0].clientX - lastX;
        velocity = diff * dragSpeed;
        currentRotation += velocity;
        slider.style.transform = `rotateY(${currentRotation}deg)`;
        lastX = e.touches[0].clientX;
    }, { passive: true });
    window.addEventListener('touchend', () => { isDragging = false; });

    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        velocity += e.deltaY * 0.04;
    }, { passive: false });

    function animate() {
        requestAnimationFrame(animate);
        if (!isDragging) {
            velocity += (autoSpeed - velocity) * friction;
            currentRotation += velocity;
            slider.style.transform = `rotateY(${currentRotation}deg)`;
        }
    }
    animate();
});

// =============================================
// MAGNETIC BUTTON PHYSICS
// =============================================
document.querySelectorAll('.btn-primary, .social-pill, .footer-big-text').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distX = e.clientX - centerX;
        const distY = e.clientY - centerY;

        // Push the element slightly in the direction of the cursor natively
        btn.style.transform = `translate(${distX * 0.35}px, ${distY * 0.35}px) scale(1.05)`;
        btn.style.transition = 'transform 0.1s ease-out';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate(0px, 0px) scale(1)';
        btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });

    // =============================================
    // 3D TILT GYROSCOPE ENGINE (Desktop + Android)
    // =============================================
    const tiltElements = document.querySelectorAll('.project-card, .cert-card');

    const handleTilt = (e, el) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Rotate max 8 deg
        const multiplier = 8;
        const xPct = (x / rect.width - 0.5) * 2;
        const yPct = (y / rect.height - 0.5) * 2;

        el.style.transform = `perspective(1000px) rotateX(${yPct * -multiplier}deg) rotateY(${xPct * multiplier}deg) scale(1.02)`;
    };

    const handleLeave = (el) => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
    };

    tiltElements.forEach(el => {
        el.style.transition = 'transform 0.15s ease-out';
        el.addEventListener('mousemove', (e) => handleTilt(e, el));
        el.addEventListener('mouseleave', () => {
            el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
            handleLeave(el);
            setTimeout(() => el.style.transition = 'transform 0.15s ease-out', 500);
        });
    });

    // Android Gyroscope tracking (Ignoring iOS permission prompts)
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== 'function') {
        window.addEventListener('deviceorientation', (e) => {
            // e.beta (front-to-back), e.gamma (left-to-right)
            let beta = e.beta || 0;
            let gamma = e.gamma || 0;

            // Clamp bounds
            beta = Math.max(-30, Math.min(30, beta));
            gamma = Math.max(-30, Math.min(30, gamma));

            // Normalize
            const rotateX = beta * -0.25;
            const rotateY = gamma * 0.25;

            tiltElements.forEach(el => {
                const rect = el.getBoundingClientRect();
                // Only affect elements within view context
                if (rect.top < window.innerHeight && rect.bottom > 0) {
                    el.style.transition = 'transform 0.1s linear';
                    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
                }
            });
        });
    }
});

// =============================================
// NUMBER COUNT UP ENGINE
// =============================================
const countUpObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            el.classList.add('in-view');
            const target = parseInt(el.getAttribute('data-target'), 10);
            const duration = 1500; // 1.5 seconds
            let startTime = null;

            function animateCount(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = timestamp - startTime;
                const ratio = Math.min(progress / duration, 1);
                // ease out quad
                const easeOut = 1 - (1 - ratio) * (1 - ratio);
                const currentVal = Math.floor(easeOut * target);
                el.childNodes[0].textContent = currentVal;

                if (progress < duration) {
                    requestAnimationFrame(animateCount);
                } else {
                    el.childNodes[0].textContent = target;
                }
            }
            requestAnimationFrame(animateCount);
            
            // Unobserve after animating once
            observer.unobserve(el);
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.count-up').forEach(el => {
    countUpObserver.observe(el);
});
