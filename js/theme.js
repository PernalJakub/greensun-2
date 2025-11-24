// ===== THEME MODULE =====
// Handles theme switching (light/dark) and mobile meta tag updates

// Helper function to update all meta tags for mobile browsers
function updateMobileMetaTags(theme) {
  const color = theme === 'dark' ? '#1a1a1b' : '#f2f2f2';

  // Theme color for Chrome Mobile
  const themeColorMeta = document.getElementById('theme-color-meta');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', color);
  }

  // MS Application nav button color
  const msNavColor = document.getElementById('ms-nav-color');
  if (msNavColor) {
    msNavColor.setAttribute('content', color);
  }

  // Apple status bar style
  const appleStatusBar = document.getElementById('apple-status-bar');
  if (appleStatusBar) {
    appleStatusBar.setAttribute('content', theme === 'dark' ? 'black-translucent' : 'default');
  }
}

// Initialize theme immediately to prevent flash
function initializeTheme() {
  // Check for saved theme preference with expiration (1 hour)
  const savedTheme = localStorage.getItem('theme');
  const themeTimestamp = localStorage.getItem('themeTimestamp');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  let theme;

  // Check if saved theme has expired (1 hour = 3600000ms)
  const oneHour = 3600000;
  const isExpired = themeTimestamp && (Date.now() - parseInt(themeTimestamp)) > oneHour;

  if (savedTheme && !isExpired) {
    // Use saved theme if not expired
    theme = savedTheme;
  } else {
    // Auto-detect based on system preference (expired or no saved theme)
    theme = prefersDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    localStorage.setItem('themeTimestamp', Date.now().toString());
  }

  // Apply theme
  document.documentElement.setAttribute('data-theme', theme);

  // Update mobile meta tags
  updateMobileMetaTags(theme);

  // Ensure body has the proper background color immediately
  document.body.style.backgroundColor = theme === 'dark' ? '#1a1a1b' : '#f2f2f2';
}

// Setup theme toggle buttons
function setupThemeToggle() {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle');

  themeToggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

      // Apply new theme
      document.documentElement.setAttribute('data-theme', newTheme);

      // Update mobile meta tags
      updateMobileMetaTags(newTheme);

      // Save preference with timestamp
      localStorage.setItem('theme', newTheme);
      localStorage.setItem('themeTimestamp', Date.now().toString());

      // Add smooth transition for the switch
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

// Listen for system theme changes
function setupThemeWatcher() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  mediaQuery.addEventListener('change', function(e) {
    // Only auto-switch if no manual preference is set or if it expired
    const savedTheme = localStorage.getItem('theme');
    const themeTimestamp = localStorage.getItem('themeTimestamp');
    const oneHour = 3600000;
    const isExpired = themeTimestamp && (Date.now() - parseInt(themeTimestamp)) > oneHour;

    if (!savedTheme || isExpired) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);

      // Update mobile meta tags
      updateMobileMetaTags(newTheme);

      localStorage.setItem('theme', newTheme);
      localStorage.setItem('themeTimestamp', Date.now().toString());
    }
  });
}

// Initialize theme immediately (IIFE to prevent flash)
(function() {
  const savedTheme = localStorage.getItem('theme');
  const themeTimestamp = localStorage.getItem('themeTimestamp');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  // Check if saved theme has expired (1 hour)
  const oneHour = 3600000;
  const isExpired = themeTimestamp && (Date.now() - parseInt(themeTimestamp)) > oneHour;

  let theme;
  if (savedTheme && !isExpired) {
    theme = savedTheme;
  } else {
    theme = prefersDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
    localStorage.setItem('themeTimestamp', Date.now().toString());
  }

  document.documentElement.setAttribute('data-theme', theme);

  // Update mobile meta tags immediately
  updateMobileMetaTags(theme);
})();

// Export functions for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    initializeTheme,
    setupThemeToggle,
    setupThemeWatcher,
    updateMobileMetaTags
  };
}

// Make functions available globally for DOMContentLoaded
window.themeModule = {
  initializeTheme,
  setupThemeToggle,
  setupThemeWatcher
};
