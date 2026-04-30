class Particle {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.originalX = x;
        this.originalY = y;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }

    update(particles, mouse) {
        // Move particles
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Bounce off edges
        if (this.x + this.radius > window.innerWidth || this.x - this.radius < 0) {
            this.velocity.x = -this.velocity.x;
        }
        if (this.y + this.radius > window.innerHeight || this.y - this.radius < 0) {
            this.velocity.y = -this.velocity.y;
        }

        // Mouse repulsion
        if (mouse) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const maxDistance = 100;
            if (distance < maxDistance) {
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * 0.5;
                const directionY = forceDirectionY * force * 0.5;
                this.velocity.x -= directionX;
                this.velocity.y -= directionY;
            }
        }

        // Connect with nearby particles
        for (let i = 0; i < particles.length; i++) {
            const dx = this.x - particles[i].x;
            const dy = this.y - particles[i].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(0, 212, 255, ${1 - distance / 120})`;
                ctx.lineWidth = 1;
                ctx.moveTo(this.x, this.y);
                ctx.lineTo(particles[i].x, particles[i].y);
                ctx.stroke();
                ctx.closePath();
            }
        }

        this.draw(ctx);
    }
}

function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    for (let i = 0; i < particleCount; i++) {
        const radius = Math.random() * 2 + 1;
        const x = Math.random() * (window.innerWidth - radius * 2) + radius;
        const y = Math.random() * (window.innerHeight - radius * 2) + radius;
        const color = '#00d4ff';
        const velocity = {
            x: (Math.random() - 0.5) * 0.5,
            y: (Math.random() - 0.5) * 0.5
        };
        particles.push(new Particle(x, y, radius, color, velocity));
    }

    let mouse = {
        x: null,
        y: null
    };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    function animate() {
        requestAnimationFrame(animate);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update(particles, mouse);
        }
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

window.addEventListener('load', initParticles);