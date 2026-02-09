

// Select the main headline in the hero section
const heroHeadline = document.querySelector('main section:first-child h1');

// Select all navigation links
const navLinks = document.querySelectorAll('nav a');

// Select all images in the main content area
const contentImages = document.querySelectorAll('main img');

// Select all sections for scroll animations
const sections = document.querySelectorAll('main section');

// Select the footer for dynamic copyright year
const footerCopyright = document.querySelector('footer p:first-child');




// Update footer copyright year dynamically
function updateCopyrightYear() {
    const currentYear = new Date().getFullYear();
    if (footerCopyright) {
        footerCopyright.innerHTML = `&copy; ${currentYear} Aurum Streetwear. All rights reserved.`;
    }
}

// Call the copyright update function
updateCopyrightYear();

// ==========================================
// NAVIGATION LINK HIGHLIGHTING
// Highlight active navigation link
// ==========================================

// AI-assisted suggestion: Automatically highlight the current page in navigation
function highlightActiveNav() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        
        // Add 'active' class to current page link
        if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
}

// Call navigation highlighting function
highlightActiveNav();

// ==========================================
// EVENT HANDLING - Navigation Hover Effects
// Enhanced interaction feedback for navigation
// ==========================================

// Add event listeners to all navigation links
navLinks.forEach(link => {
    // Mouseenter event - when user hovers over link
    link.addEventListener('mouseenter', function(event) {
        // Add a visual indicator
        event.target.style.transform = 'scale(1.05)';
        event.target.style.transition = 'transform 0.2s ease';
    });
    
    // Mouseleave event - when user stops hovering
    link.addEventListener('mouseleave', function(event) {
        // Reset the visual indicator
        event.target.style.transform = 'scale(1)';
    });
    
    // Click event - provide feedback on click
    link.addEventListener('click', function(event) {
        // Add a brief animation on click
        event.target.style.transform = 'scale(0.95)';
        setTimeout(() => {
            event.target.style.transform = 'scale(1)';
        }, 150);
    });
});

// ==========================================
// EVENT HANDLING - Image Interactions
// Image zoom effect on hover
// ==========================================

// // Add hover effect to all images
// contentImages.forEach(image => {
//     // Mouseenter event for images
//     image.addEventListener('mouseenter', function(event) {
//         event.target.style.transform = 'scale(1.05)';
//         event.target.style.boxShadow = '0 8px 20px rgba(255, 215, 0, 0.4)';
//         event.target.style.transition = 'all 0.3s ease';
//     });
    
//     // Mouseleave event for images
//     image.addEventListener('mouseleave', function(event) {
//         event.target.style.transform = 'scale(1)';
//         event.target.style.boxShadow = 'none';
//     });
    
//     // Click event - alert with image description
//     image.addEventListener('click', function(event) {
//         const altText = event.target.getAttribute('alt');
//         if (altText) {
//             alert(`You clicked: ${altText}`);
//         }
//     });
// });

// ==========================================
// EVENT HANDLING - Smooth Scroll to Sections
// Enhance navigation experience
// ==========================================

// Add smooth scrolling for internal anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(event) {
        event.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==========================================
// EVENT HANDLING - Scroll Animation
// Fade in sections as user scrolls
// ==========================================

// AI-assisted suggestion: Intersection Observer for scroll animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when section comes into view
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Set initial state and observe all sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        observer.observe(section);
    });
}

// Initialize scroll animations
setupScrollAnimations();

// ==========================================
// EVENT HANDLING - Welcome Alert
// Show welcome message on first visit
// ==========================================

// Check if user has visited before using localStorage
function showWelcomeMessage() {
    const hasVisited = localStorage.getItem('aurumVisited');
    
    if (!hasVisited) {
        // First-time visitor
        setTimeout(() => {
            alert('Welcome to Aurum! 🌟\n\nWhere stories wear gold and creativity knows no bounds.\n\nExplore our latest drops and join the movement!');
            localStorage.setItem('aurumVisited', 'true');
        }, 1000); // Delay by 1 second for better UX
    }
}

// Call welcome message function
showWelcomeMessage();

// ==========================================
// EVENT HANDLING - Button Interactions
// Handle all button clicks on the page
// ==========================================

// Select all buttons (if any exist)
const buttons = document.querySelectorAll('button');

buttons.forEach(button => {
    button.addEventListener('click', function(event) {
        // Prevent default action
        event.preventDefault();
        
        // Visual feedback
        event.target.style.transform = 'scale(0.95)';
        
        // Reset after animation
        setTimeout(() => {
            event.target.style.transform = 'scale(1)';
        }, 200);
        
        // Log button click (for testing/debugging)
        console.log('Button clicked:', event.target.textContent);
    });
});








