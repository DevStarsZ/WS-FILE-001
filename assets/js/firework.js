// Fireworks Simulation for Portfolio
const fireworksCanvas = document.getElementById('fireworksCanvas');

let fireworks = [];
let particles = [];
let animationId = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (fireworksCanvas) {
        initFireworks();
    }
});

function initFireworks() {
    const ctx = fireworksCanvas.getContext('2d');
    if (!ctx) return;
    
    // Set initial canvas size
    resizeFireworksCanvas();
    
    // Start animation
    animate(0);
    
    // Handle window resize
    window.addEventListener('resize', resizeFireworksCanvas);
    
    // Click to create custom fireworks
    fireworksCanvas.addEventListener('click', (e) => {
        const rect = fireworksCanvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        createFirework(x, y);
    });
}

function resizeFireworksCanvas() {
    if (!fireworksCanvas) return;
    
    const container = fireworksCanvas.parentElement;
    if (!container) return;
    
    fireworksCanvas.width = container.clientWidth;
    fireworksCanvas.height = container.clientHeight;
}

class Particle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.velocity = {
            x: (Math.random() - 0.5) * 8,
            y: (Math.random() - 0.5) * 8
        };
        this.alpha = 1;
        this.decay = Math.random() * 0.015 + 0.01;
        this.gravity = 0.05;
        this.size = Math.random() * 3 + 1;
    }
    
    update() {
        this.velocity.y += this.gravity;
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= this.decay;
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}

class Firework {
    constructor(x, y) {
        this.x = x || Math.random() * fireworksCanvas.width;
        this.y = y || fireworksCanvas.height;
        this.targetY = Math.random() * fireworksCanvas.height * 0.5 + 50;
        this.velocity = (this.y - this.targetY) / 60;
        this.particles = [];
        this.exploded = false;
        this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
        this.trailParticles = [];
    }
    
    update() {
        if (!this.exploded) {
            this.y -= this.velocity;
            
            // Add trail
            if (Math.random() < 0.3) {
                this.trailParticles.push({
                    x: this.x,
                    y: this.y,
                    alpha: 0.5,
                    size: 2
                });
            }
            
            if (this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.particles.forEach((p, i) => {
                p.update();
                if (p.alpha <= 0) {
                    this.particles.splice(i, 1);
                }
            });
        }
        
        // Update trail
        this.trailParticles.forEach((t, i) => {
            t.alpha -= 0.02;
            if (t.alpha <= 0) {
                this.trailParticles.splice(i, 1);
            }
        });
    }
    
    explode() {
        this.exploded = true;
        const particleCount = Math.random() * 50 + 100;
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(new Particle(this.x, this.y, this.color));
        }
    }
    
    draw(ctx) {
        if (!this.exploded) {
            // Draw trail
            this.trailParticles.forEach(t => {
                ctx.save();
                ctx.globalAlpha = t.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(t.x, t.y, t.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            });
            
            // Draw rocket
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fill();
        } else {
            this.particles.forEach(p => p.draw(ctx));
        }
    }
    
    isDone() {
        return this.exploded && this.particles.length === 0;
    }
}

function createFirework(x, y) {
    if (!fireworksCanvas) return;
    
    fireworks.push(new Firework(x, y));
}

let lastFireworkTime = 0;

function animate(currentTime) {
    const ctx = fireworksCanvas.getContext('2d');
    if (!ctx) return;
    
    // Clear with fade effect
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    
    // Launch new fireworks automatically
    if (currentTime - lastFireworkTime > Math.random() * 500 + 500) {
        fireworks.push(new Firework());
        lastFireworkTime = currentTime;
    }
    
    // Update and draw fireworks
    fireworks.forEach((fw, i) => {
        fw.update();
        fw.draw(ctx);
        
        if (fw.isDone()) {
            fireworks.splice(i, 1);
        }
    });
    
    animationId = requestAnimationFrame(animate);
}