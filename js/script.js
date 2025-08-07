// DOM Elements
const scrollNavDots = document.querySelectorAll('.nav-dot');
const sections = document.querySelectorAll('section');
const heroSection = document.querySelector('.hero-section');

// Language system - translations are loaded from external files
const translations = {
    it: translations_it,
    en: translations_en,
    fr: translations_fr,
    es: translations_es
};

let currentLanguage = 'en';

// Language switching function
function switchLanguage(lang) {
    currentLanguage = lang;

    // Update all translatable elements
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });

    // Store language preference
    localStorage.setItem('preferredLanguage', lang);
}

// Initialize language system
function initLanguageSystem() {
    // Set up language button listeners
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = btn.dataset.lang;
            switchLanguage(lang);
        });
    });

    // Load saved language preference or default to Italian
    const savedLang = localStorage.getItem('preferredLanguage') || 'it';
    switchLanguage(savedLang);
}

// Parallax and Scroll Effects
let ticking = false;

function updateScrollEffects() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;

    // Hero parallax effect
    if (heroSection) {
        const heroElements = heroSection.querySelectorAll('.parallax-element, .floating-leaf');
        heroElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = scrollTop * speed;
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Menu items fade-in animation
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.top < windowHeight * 0.8;

        if (isVisible) {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        }
    });

    // Update navigation dots
    updateNavigationDots();

    ticking = false;
}

function requestTick() {
    if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
    }
}

// Navigation Dots Update
function updateNavigationDots() {
    const scrollTop = window.pageYOffset;
    const windowHeight = window.innerHeight;
    let currentSection = '';

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= windowHeight / 2 && rect.bottom >= windowHeight / 2) {
            currentSection = section.id;
        }
    });

    scrollNavDots.forEach(dot => {
        dot.classList.remove('active');
        if (dot.dataset.section === currentSection) {
            dot.classList.add('active');
        }
    });
}

// Smooth scrolling for navigation dots
scrollNavDots.forEach(dot => {
    dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = dot.getAttribute('href');
        const targetSection = document.querySelector(targetId);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Google Maps Integration
function initMap() {
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // Restaurant location (Milan, Italy)
    const restaurantLocation = { lat: 45.4642, lng: 9.1900 };

    const mapOptions = {
        zoom: 15,
        center: restaurantLocation,
        styles: [
            {
                "featureType": "all",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "weight": "2.00"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#9c9c9c"
                    }
                ]
            },
            {
                "featureType": "all",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#f2f2f2"
                    }
                ]
            },
            {
                "featureType": "landscape",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "landscape.man_made",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "all",
                "stylers": [
                    {
                        "saturation": -100
                    },
                    {
                        "lightness": 45
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#eeeeee"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#7b7b7b"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "simplified"
                    }
                ]
            },
            {
                "featureType": "road.arterial",
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "all",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "all",
                "stylers": [
                    {
                        "color": "#46bcec"
                    },
                    {
                        "visibility": "on"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    {
                        "color": "#c8d7d4"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#070707"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#ffffff"
                    }
                ]
            }
        ],
        disableDefaultUI: true,
        zoomControl: true,
        scrollwheel: false,
        draggable: true
    };

    try {
        const map = new google.maps.Map(mapContainer, mapOptions);

        // Custom marker
        const marker = new google.maps.Marker({
            position: restaurantLocation,
            map: map,
            title: 'ti FA sentire a casa',
            animation: google.maps.Animation.DROP,
            icon: {
                url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="20" cy="20" r="18" fill="#8B4513" stroke="#ffffff" stroke-width="4"/>
                        <text x="20" y="26" text-anchor="middle" fill="white" font-family="Arial" font-size="20" font-weight="bold">🥪</text>
                    </svg>
                `),
                scaledSize: new google.maps.Size(40, 40),
                anchor: new google.maps.Point(20, 20)
            }
        });

        // Info window
        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div style="padding: 10px; font-family: 'Open Sans', sans-serif;">
                    <h3 style="margin: 0 0 10px 0; color: #8B4513;">ti FA sentire a casa</h3>
                    <p style="margin: 0; color: #666;">Via Roma, 123<br>20100 Milano, Italia</p>
                    <p style="margin: 10px 0 0 0; color: #8B4513; font-weight: 600;">Orari: Lun-Ven 8:00-20:00</p>
                </div>
            `
        });

        marker.addListener('click', () => {
            infoWindow.open(map, marker);
        });

    } catch (error) {
        console.log('Google Maps not available');
        mapContainer.innerHTML = `
            <div class="map-loading">
                <p>Map not available. Visit us at: Aspire Building Strasbourg, France</p>
            </div>
        `;
    }
}

// Initialize menu items animation
function initMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'all 0.6s ease';
    });
}

// Social links interaction
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.1)';
        });

        link.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Logo hover effect
function initLogoEffects() {
    const logo = document.querySelector('.main-logo');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05) rotate(2deg)';
            this.style.filter = 'drop-shadow(0 15px 30px rgba(139, 69, 19, 0.3))';
        });

        logo.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
            this.style.filter = 'drop-shadow(0 10px 20px rgba(139, 69, 19, 0.2))';
        });
    }
}

// Floating elements animation
function initFloatingElements() {
    const floatingLeaves = document.querySelectorAll('.floating-leaf');
    floatingLeaves.forEach((leaf, index) => {
        // Random animation duration and delay for more natural movement
        const duration = 4 + Math.random() * 4; // 4-8 seconds
        const delay = Math.random() * 2; // 0-2 seconds delay

        leaf.style.animationDuration = `${duration}s`;
        leaf.style.animationDelay = `${delay}s`;
    });
}

// Intersection Observer for animations
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);

    // Observe menu items
    document.querySelectorAll('.menu-item').forEach(item => {
        observer.observe(item);
    });

    // Observe contact cards
    document.querySelectorAll('.address-card, .social-links').forEach(card => {
        observer.observe(card);
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Ti FA Sentire A Casa - Website Initialized');

    // Initialize all components
    initLanguageSystem();
    initMenuItems();
    initSocialLinks();
    initLogoEffects();
    initFloatingElements();
    initIntersectionObserver();

    // Set up scroll listener
    window.addEventListener('scroll', requestTick, { passive: true });

    // Initial call to set up scroll effects
    updateScrollEffects();

    // Handle window resize
    window.addEventListener('resize', function() {
        requestTick();
    }, { passive: true });
});

// Fallback for Google Maps if API fails
window.initMap = initMap;

// Export functions for debugging (optional)
window.restaurantApp = {
    updateScrollEffects,
    initMap,
    initMenuItems,
    initSocialLinks,
    switchLanguage,
    translations
};