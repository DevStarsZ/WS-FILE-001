// Particle system
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
        this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
        if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

for (let i = 0; i < 100; i++) {
    particles.push(new Particle());
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.strokeStyle = `rgba(0, 255, 255, ${0.2 - distance / 500})`;
                ctx.lineWidth = 1;
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    connectParticles();
    requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Form submission
document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Message sent! (This is a demo)');
});

// Animate skills on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
});

document.querySelectorAll('.project-card, .skill-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(50px)';
    card.style.transition = 'all 0.6s ease';
    observer.observe(card);
});

// Container click handlers
document.querySelectorAll('.website-container').forEach((container, index) => {
    const iframe = container.querySelector('iframe');

    // Ensure iframe loads and gets focus
    if (iframe) {
        iframe.addEventListener('load', () => {
            console.log(`Iframe ${index + 1} loaded successfully`);
        });

        // Direct iframe click handler
        iframe.addEventListener('click', () => {
            activeContainer = container;
            console.log(`Iframe ${index + 1} clicked directly - set as active`);
        });

        // Container click handler (for background clicks)
        container.addEventListener('click', (e) => {
            // Only trigger if clicking on the container itself, not the iframe
            if (e.target === container) {
                activeContainer = container;
                // Add a click effect
                container.style.transform = 'scale(0.98)';
                setTimeout(() => {
                    container.style.transform = '';
                }, 150);

                console.log(`Container ${index + 1} clicked - set as active`);
            }
        });

        // Also handle keyboard activation
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activeContainer = container;
                console.log(`Container ${index + 1} activated via keyboard`);
            }
        });
    }
});

// Global keyboard event forwarding to active iframe
let activeContainer = null;

// Update active container tracking
document.querySelectorAll('.website-container').forEach((container, index) => {
    const iframe = container.querySelector('iframe');
    if (iframe) {
        iframe.addEventListener('click', () => {
            activeContainer = container;
            console.log(`Iframe ${index + 1} clicked - set as active`);
        });

        container.addEventListener('click', (e) => {
            if (e.target === container) {
                activeContainer = container;
                console.log(`Container ${index + 1} clicked - set as active`);
            }
        });
    }
});

document.addEventListener('keydown', (e) => {
    if (activeContainer) {
        const iframe = activeContainer.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
            try {
                // Create a new keyboard event for the iframe
                const iframeEvent = new KeyboardEvent('keydown', {
                    key: e.key,
                    code: e.code,
                    keyCode: e.keyCode,
                    which: e.which,
                    shiftKey: e.shiftKey,
                    ctrlKey: e.ctrlKey,
                    altKey: e.altKey,
                    metaKey: e.metaKey,
                    bubbles: true,
                    cancelable: true
                });

                // Dispatch the event to the iframe's document
                iframe.contentWindow.document.dispatchEvent(iframeEvent);

                // Prevent the parent from handling the event
                e.stopPropagation();
                e.preventDefault();

                console.log(`Forwarded key ${e.key} to active container`);
            } catch (error) {
                console.log('Could not forward keyboard event:', error);
            }
        }
    }
});

// Deactivate container when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.website-container')) {
        activeContainer = null;
        console.log('Deactivated active container');
    }
});
