// DOM Elements
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const particlesContainer = document.querySelector('.particles-container');
const skillLevels = document.querySelectorAll('.skill-level');
const statValues = document.querySelectorAll('.stat-value');
const form = document.querySelector('.contact-form');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Create particles
    createParticles();
    
    // Animate stats
    animateStats();
    
    // Animate skill bars
    animateSkills();
    
    // Setup event listeners
    setupEventListeners();
    
    // Setup form
    setupForm();
    
    // Initialize portfolio features
    initPortfolio();
});

// Create floating particles
function createParticles() {
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random properties
        const size = Math.random() * 3 + 1;
        const posX = Math.random() * 100;
        const delay = Math.random() * 20;
        const duration = Math.random() * 10 + 10;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.animationDuration = `${duration}s`;
        
        // Random color
        const colors = ['#00f3ff', '#ff00ff', '#00ff88', '#ffaa00'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.background = color;
        
        particlesContainer.appendChild(particle);
    }
}

// Animate statistics
function animateStats() {
    statValues.forEach(stat => {
        const target = parseInt(stat.getAttribute('data-target'));
        const increment = target / 100;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current);
        }, 20);
    });
}

// Animate skill bars
function animateSkills() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const skillLevel = entry.target;
                const level = skillLevel.getAttribute('data-level');
                skillLevel.style.width = `${level}%`;
                observer.unobserve(skillLevel);
            }
        });
    }, {
        threshold: 0.5
    });

    skillLevels.forEach(skill => observer.observe(skill));
}

// Initialize portfolio features
function initPortfolio() {
    // Initialize typewriter effect on terminal
    const terminalTexts = document.querySelectorAll('.terminal-line');
    terminalTexts.forEach((line, index) => {
        if (line.classList.contains('output')) {
            const text = line.textContent;
            setTimeout(() => {
                typeWriter(line, text, 30);
            }, index * 500);
        }
    });
}

// Setup event listeners
function setupEventListeners() {
    // Hamburger menu
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            if (navMenu) navMenu.classList.toggle('active');
        });
    }

    // Navigation links
    if (navLinks.length > 0) {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                // Close mobile menu
                if (hamburger) hamburger.classList.remove('active');
                if (navMenu) navMenu.classList.remove('active');
                
                // Update active link
                navLinks.forEach(l => l.classList.remove('active'));
                link.classList.add('active');
                
                // Smooth scroll
                const targetId = link.getAttribute('href');
                if (targetId.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    // Window scroll for header effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.neon-header');
        if (header && window.scrollY > 100) {
            header.style.background = 'rgba(10, 10, 26, 0.95)';
            header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
        } else if (header) {
            header.style.background = 'rgba(10, 10, 26, 0.9)';
            header.style.boxShadow = 'none';
        }
    });
}

// Typewriter effect for terminal
function typeWriter(element, text, speed = 50) {
    let i = 0;
    const originalText = text;
    element.textContent = '';
    
    function type() {
        if (i < originalText.length) {
            element.textContent += originalText.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Form handling
function setupForm() {
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Validate
        if (!data.name || !data.email || !data.message) {
            showNotification('Please fill in all fields', 'error');
            return;
        }
        
        // Simulate sending
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.querySelector('span').textContent;
        
        submitBtn.disabled = true;
        submitBtn.querySelector('span').textContent = 'SENDING...';
        
        setTimeout(() => {
            showNotification('Message sent successfully!', 'success');
            form.reset();
            
            submitBtn.disabled = false;
            submitBtn.querySelector('span').textContent = originalText;
        }, 1500);
    });
}

function showNotification(message, type) {
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? 'rgba(0, 255, 136, 0.2)' : 'rgba(255, 0, 0, 0.2)'};
        border: 1px solid ${type === 'success' ? '#00ff88' : '#ff0000'};
        color: white;
        border-radius: 5px;
        z-index: 10000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}