document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;

    // Toggle hamburger menu
    hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
    });

    // Close menu when a nav link is clicked (for mobile)
    navLinks.forEach(link => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navMenu.classList.remove("active");
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
        // Ensure the moon icon is visible when dark mode is enabled
        themeToggle.querySelector('i').classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'dark');
    };

    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        // Ensure the sun icon is visible when light mode is enabled
        themeToggle.querySelector('i').classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'light');
    };

    // Check saved theme preference on load
    const savedTheme = localStorage.getItem('theme');

    // If no theme is saved, or if it's explicitly 'light', default to dark mode.
    // Otherwise, apply the saved theme.
    if (savedTheme === null || savedTheme === 'light') { // Changed logic here
        enableDarkMode(); // Default to dark mode
    } else if (savedTheme === 'dark') {
        enableDarkMode(); // Apply dark mode if previously saved
    }

    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });
});