// ===== UTILS MODULE =====
// Utility functions: animations, counters, cookies, service toggles

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Obserwowanie elementów z animacjami
  document.querySelectorAll('.fade-in-scroll, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
    observer.observe(el);
  });
}

function toggleService(button) {
  const card = button.closest('.service-card');
  const details = button.nextElementSibling;
  const isExpanded = details.classList.contains('expanded');

  // Get translations from language module
  const translations = window.languageModule ? window.languageModule.translations : {};
  const currentLanguage = window.languageModule ? window.languageModule.currentLanguage : 'pl';

  if (isExpanded) {
    card.classList.remove('expanded');
    details.classList.remove('expanded');
    button.setAttribute('data-i18n', 'learn-more');
    button.textContent = translations[currentLanguage] ? translations[currentLanguage]['learn-more'] : 'Dowiedz się więcej';
  } else {
    card.classList.add('expanded');
    details.classList.add('expanded');
    button.setAttribute('data-i18n', 'btn-collapse');
    button.textContent = translations[currentLanguage] ? translations[currentLanguage]['btn-collapse'] : 'Zwiń';
  }
}

const observeCounters = () => {
  const counters = document.querySelectorAll(".count");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const counter = entry.target;
        const updateCount = () => {
          const target = +counter.getAttribute("data-target");
          const current = parseInt(counter.innerText) || 0;
          const increment = Math.max(1, Math.ceil(target / 100));

          if (current < target) {
            counter.innerText = current + increment;
            setTimeout(updateCount, 25);
          } else {
            counter.innerText = target;
          }
        };
        updateCount();
      }
    });
  });

  counters.forEach(counter => counterObserver.observe(counter));
};

const observeStatCounters = () => {
  const statNumbers = document.querySelectorAll(".about-stat-number");

  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const element = entry.target;
        const text = element.textContent;

        // Extract number and suffix (like +, %)
        const match = text.match(/^(\d+)(.*)$/);
        if (match) {
          const targetNumber = parseInt(match[1]);
          const suffix = match[2];

          const duration = 2000; // 2 seconds
          const frameRate = 1000 / 60; // 60 FPS
          const totalFrames = Math.round(duration / frameRate);
          let currentFrame = 0;

          const counter = setInterval(() => {
            currentFrame++;
            const progress = currentFrame / totalFrames;
            // Easing function for smooth animation
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const currentNumber = Math.round(easeOutQuart * targetNumber);

            element.textContent = currentNumber + suffix;

            if (currentFrame >= totalFrames) {
              element.textContent = targetNumber + suffix;
              clearInterval(counter);
            }
          }, frameRate);
        }
      }
    });
  }, {
    threshold: 0.5,
    rootMargin: '0px'
  });

  statNumbers.forEach(stat => statObserver.observe(stat));
};

function showCookieBanner() {
  const banner = document.getElementById('cookieBanner');
  const hasConsent = localStorage.getItem('cookieConsent');

  if (!hasConsent) {
    setTimeout(() => {
      banner.classList.add('visible');
    }, 2000);
  }
}

function acceptCookies() {
  localStorage.setItem('cookieConsent', 'accepted');
  document.getElementById('cookieBanner').classList.remove('visible');

  // Tutaj możesz włączyć dodatkowe skrypty po zgodzie
  // np. Google Analytics, Meta Pixel itp.
}

function declineCookies() {
  localStorage.setItem('cookieConsent', 'declined');
  document.getElementById('cookieBanner').classList.remove('visible');
}

window.utilsModule = {
  initScrollAnimations,
  toggleService,
  observeCounters,
  observeStatCounters,
  showCookieBanner,
  acceptCookies,
  declineCookies
};
