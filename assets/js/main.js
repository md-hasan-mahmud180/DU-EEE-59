// Typewriter Effect
document.addEventListener('DOMContentLoaded', () => {
    const typewriterText = document.getElementById('typewriter-text');
    const phrases = [
        "Engineers of Tomorrow",
        "Class of 2027",
        "Excellence in Electrical Engineering"
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const pauseBetweenPhrases = 1500;

    function typeWriter() {
        const currentPhrase = phrases[phraseIndex];
        if (isDeleting) {
            typewriterText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typewriterText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typeWriter, pauseBetweenPhrases);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(typeWriter, typeSpeed);
        } else {
            setTimeout(typeWriter, isDeleting ? typeSpeed / 2 : typeSpeed);
        }
    }

    // Start typewriter after a short delay
    setTimeout(typeWriter, 500);

    // Countdown Timer
    function updateCountdown() {
        const countdownElements = document.querySelectorAll('.countdown');
        countdownElements.forEach(element => {
            const targetDate = new Date(element.getAttribute('data-target-date'));
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                element.innerHTML = '<span class="expired">Event started!</span>';
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            element.querySelector('.days').textContent = String(days).padStart(2, '0');
            element.querySelector('.hours').textContent = String(hours).padStart(2, '0');
            element.querySelector('.minutes').textContent = String(minutes).padStart(2, '0');
            element.querySelector('.seconds').textContent = String(seconds).padStart(2, '0');
        });
    }

    // Update countdown every second
    setInterval(updateCountdown, 1000);
    updateCountdown(); // Initial call

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add active class to nav links based on scroll position
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (pageYOffset >= sectionTop - 60) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });
});