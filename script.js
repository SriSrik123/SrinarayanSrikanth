document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const header = document.querySelector('.header'); // Get the header element
    const heroSection = document.getElementById('hero'); // Get the hero section

    // Toggle hamburger menu (will only work if HTML elements exist)
    if (hamburger && navMenu) {
        hamburger.addEventListener("click", () => {
            hamburger.classList.toggle("active");
            navMenu.classList.toggle("active");
        });
    }

    // Close menu when a nav link is clicked (for mobile)
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            if (hamburger && navMenu) {
                hamburger.classList.remove("active");
                navMenu.classList.remove("active");
            }
        });
    });

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Dark Mode Toggle Logic
    const enableDarkMode = () => {
        body.classList.add('dark-mode');
        if (themeToggle && themeToggle.querySelector('i')) {
            themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        }
        localStorage.setItem('theme', 'dark');
    };

    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        if (themeToggle && themeToggle.querySelector('i')) {
            themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        }
        localStorage.setItem('theme', 'light');
    };

    // Check saved theme preference on load
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === null || savedTheme === 'light') {
        enableDarkMode(); // Default to dark mode
    } else if (savedTheme === 'dark') {
        enableDarkMode(); // Apply dark mode if previously saved
    }

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('dark-mode')) {
                disableDarkMode();
            } else {
                enableDarkMode();
            }
        });
    }

    // Scroll Animation Logic (Intersection Observer) for elements entering view
    const animateElements = document.querySelectorAll('.project-card, .skill-category, .experience-item, .interest-item');

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the item is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    animateElements.forEach(element => {
        observer.observe(element);
    });

    // Header Visibility on Scroll Logic
    if (heroSection && header) {
        const headerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // If hero section is NOT intersecting (i.e., scrolled past it)
                if (!entry.isIntersecting && entry.boundingClientRect.bottom <= 0) {
                    header.classList.add('header-visible');
                } else {
                    // If hero section IS intersecting (i.e., scrolled back to it or at the very top)
                    header.classList.remove('header-visible');
                }
            });
        }, {
            root: null, // viewport
            rootMargin: '0px',
            threshold: 0 // As soon as any part of the hero section leaves the viewport
        });

        headerObserver.observe(heroSection);
    }
});