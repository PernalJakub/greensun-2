// ===== MAIN MODULE =====
// Application entry point - initializes all modules

// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", function() {
  // Initialize theme (already runs on page load via IIFE in theme.js)
  if (window.themeModule) {
    window.themeModule.initializeTheme();
    window.themeModule.setupThemeToggle();
    window.themeModule.setupThemeWatcher();
  }

  // Initialize language system (already runs via i18n.js)
  if (window.languageModule) {
    window.languageModule.initializeLanguage();
    window.languageModule.setupLanguageSwitcher();
  }

  // Initialize navbar
  if (window.navbarModule) {
    window.navbarModule.loadGlobalSVGIcons();
    window.navbarModule.initNavbarSection();
    window.navbarModule.setupHamburgerMenu();
    window.navbarModule.setupNavbarScroll();
    window.navbarModule.setupLogoClick();
  }

  // Initialize hero section
  if (window.heroModule) {
    window.heroModule.initHeroSection();
  }

  // Initialize utilities (animations, counters, cookies)
  if (window.utilsModule) {
    window.utilsModule.initScrollAnimations();
    window.utilsModule.observeCounters();
    window.utilsModule.observeStatCounters();
    window.utilsModule.showCookieBanner();
  }

  // Initialize gallery carousel
  if (window.galleryModule) {
    window.galleryModule.initGalleryCarousel();
  }

  // Initialize contact form
  if (window.formModule) {
    window.formModule.initContactForm();
  }

  console.log('✅ GreenSun application initialized');
});

// Make toggleService available globally for onclick handlers in HTML
window.toggleService = function(button) {
  if (window.utilsModule && window.utilsModule.toggleService) {
    window.utilsModule.toggleService(button);
  }
};

// Make cookie functions available globally for onclick handlers
window.acceptCookies = function() {
  if (window.utilsModule && window.utilsModule.acceptCookies) {
    window.utilsModule.acceptCookies();
  }
};

window.declineCookies = function() {
  if (window.utilsModule && window.utilsModule.declineCookies) {
    window.utilsModule.declineCookies();
  }
};
