document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const header = document.querySelector('.header'); // Get the header element
    const heroSection = document.getElementById('hero'); // Get the hero section

    // Elements for project carousel
    const projectsGrid = document.querySelector('.projects-grid');
    const projectCards = document.querySelectorAll('.project-card');
    const projectNavButtonsContainer = document.querySelector('.project-navigation-buttons');
    const leftArrow = document.querySelector('.left-arrow');
    const rightArrow = document.querySelector('.right-arrow');


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
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'; // Change icon to sun
    };

    const disableDarkMode = () => {
        body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Change icon to moon
    };

    // Check saved theme preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        enableDarkMode();
    } else {
        disableDarkMode(); // Default to light if no preference or 'light'
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            disableDarkMode();
        } else {
            enableDarkMode();
        }
    });

    // Intersection Observer for Animations (Fade In Up)
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

    // --- Project Carousel Logic ---
    // Function to create navigation buttons (project names)
    function createProjectNavButtons() {
        if (projectNavButtonsContainer && projectCards.length > 0) {
            projectNavButtonsContainer.innerHTML = ''; // Clear existing buttons
            projectCards.forEach((card, index) => {
                card.id = `project-card-${index}`; // Ensure IDs for easy targeting
                
                // Get project name from the h3 tag inside the project card
                const projectNameElement = card.querySelector('h3');
                const projectName = projectNameElement ? projectNameElement.textContent : `Project ${index + 1}`; // Fallback

                const button = document.createElement('button'); // Create a button element
                button.classList.add('project-nav-btn'); // Add new class
                
                button.textContent = projectName; // Set button text to project name
                
                button.dataset.index = index;
                button.addEventListener('click', function () { // Use 'function' to get 'this' context
                    // Remove active class from all buttons
                    document.querySelectorAll('.project-nav-btn').forEach(btn => btn.classList.remove('active'));
                    // Add active class to the clicked button
                    this.classList.add('active');

                    projectCards[index].scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest',
                        inline: 'center' // Snap to center of the view
                    });
                });
                projectNavButtonsContainer.appendChild(button);
            });
        }
    }

    // Function to update active button AND project card based on scroll position
    // This function will now ONLY handle the 'active-project' class on cards, not the nav buttons
    function updateActiveButtonAndProjectCard() {
        if (projectCards.length === 0 || !projectsGrid || !projectNavButtonsContainer) return;

        let activeIndex = 0;
        let minDistance = Infinity;
        // Calculate the center point of the scrollable container's viewport
        const containerCenterX = projectsGrid.scrollLeft + projectsGrid.offsetWidth / 2;

        // Iterate through project cards to find the one closest to the center
        projectCards.forEach((card, index) => {
            const cardCenterX = card.offsetLeft + card.offsetWidth / 2;
            const distance = Math.abs(containerCenterX - cardCenterX);
            
            if (distance < minDistance) {
                minDistance = distance;
                activeIndex = index;
            }
        });
        
        // Update project card active/inactive state for visual fading (ONLY THIS PART REMAINS)
        projectCards.forEach((card, index) => {
            if (index === activeIndex) {
                card.classList.add('active-project');
            } else {
                card.classList.remove('active-project');
            }
        });
    }

    // --- Arrow Navigation Logic ---
    // Function to scroll the projects grid
    function scrollProjects(direction) {
        // Scroll by one card width plus the gap (350px + 30px = 380px)
        const scrollAmount = 380; 

        if (direction === 'left') {
            projectsGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        } else {
            projectsGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    }

    // Function to update arrow visibility (hide when at limits)
    function updateArrowVisibility() {
        if (!leftArrow || !rightArrow || !projectsGrid) return;

        const scrollTolerance = 5; // Small tolerance for floating point issues

        // Hide left arrow if at the very beginning
        if (projectsGrid.scrollLeft <= scrollTolerance) {
            leftArrow.classList.add('hidden');
        } else {
            leftArrow.classList.remove('hidden');
        }

        // Hide right arrow if at the very end
        // scrollWidth - clientWidth gives the maximum scrollable distance
        if (projectsGrid.scrollLeft + projectsGrid.clientWidth >= projectsGrid.scrollWidth - scrollTolerance) {
            rightArrow.classList.add('hidden');
        } else {
            rightArrow.classList.remove('hidden');
        }
    }


    // Initial calls for setup
    createProjectNavButtons(); 
    
    // Set the first project navigation button as active on initial load
    const firstProjectNavButton = document.querySelector('.project-nav-btn');
    if (firstProjectNavButton) {
        firstProjectNavButton.classList.add('active');
    }

    // Event listeners for arrows
    if (leftArrow) {
        leftArrow.addEventListener('click', () => scrollProjects('left'));
    }
    if (rightArrow) {
        rightArrow.addEventListener('click', () => scrollProjects('right'));
    }

    // Add scroll and resize listeners for updating project cards and arrows (nav buttons are no longer updated by scroll here)
    let scrollTimeout;
    projectsGrid.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveButtonAndProjectCard(); // This now only updates project card active state
            updateArrowVisibility();
        }, 50); // Debounce scroll event
    });
    window.addEventListener('resize', () => {
        updateActiveButtonAndProjectCard(); // This now only updates project card active state
        updateArrowVisibility();
    });

    // Initial calls to set the correct state on page load
    updateActiveButtonAndProjectCard(); 
    updateArrowVisibility();

});