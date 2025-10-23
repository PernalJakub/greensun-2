/*
========================================
GREENSUN NAVBAR JAVASCRIPT FUNCTIONALITY
========================================

Ten plik zawiera wszystkie funkcjonalności navbar'a:
- System motywów (jasny/ciemny) z localStorage
- System wielojęzyczny z tłumaczeniami
- Responsywne menu mobilne 
- Smooth scrolling do sekcji
- Auto-hide navbar przy scrollowaniu
- Aktywne linki nawigacyjne

INSTRUKCJA IMPLEMENTACJI:
1. Dołącz ten plik do swojej strony HTML
2. Dodaj swoje tłumaczenia do obiektu translations
3. Upewnij się że masz sekcje o odpowiednich ID
4. Dostosuj social media linki w HTML
5. Navbar automatycznie się zainicjalizuje

WYMAGANIA:
- HTML musi mieć odpowiednią strukturę navbar'a
- CSS musi być dołączony (navbar-styles.css)
- Sekcje muszą mieć odpowiednie ID (data-section)
*/

// ========================================
// 1. SYSTEM TŁUMACZEŃ
// ========================================

const translations = {
  pl: {
    // Meta tags
    'site-title': 'GreenSun - Profesjonalny montaż farm fotowoltaicznych',
    'site-description': 'GreenSun - specjalizujemy się w montażu farm fotowoltaicznych na lądzie i wodzie. Ponad 1000 MW zrealizowanych projektów w Europie.',
    'site-keywords': 'fotowoltaika, farmy PV, montaż paneli słonecznych, energia słoneczna, wodne farmy fotowoltaiczne',
    
    // Navigation
    'nav-about': 'O nas',
    'nav-services': 'Usługi',
    'nav-gallery': 'Wizualizacje',
    'nav-contact': 'Kontakt',
    
    // Przykładowe tłumaczenia - dodaj swoje własne
    'hero-title': 'Energia słoneczna dla <span class="green-simple">przyszłości.</span>',
    'hero-subtitle': 'Specjalizujemy się w montażu farm fotowoltaicznych na lądzie i na wodzie.<br>Tworzymy zrównoważoną przyszłość energetyczną.',
  },
  
  en: {
    // Meta tags
    'site-title': 'GreenSun - Professional photovoltaic farm installation',
    'site-description': 'GreenSun - we specialize in the installation of photovoltaic farms on land and water. Over 1000 MW of completed projects in Europe.',
    'site-keywords': 'photovoltaics, PV farms, solar panel installation, solar energy, floating solar farms',
    
    // Navigation
    'nav-about': 'About us',
    'nav-services': 'Services',
    'nav-gallery': 'Visualizations',
    'nav-contact': 'Contact',
    
    // Przykładowe tłumaczenia - dodaj swoje własne
    'hero-title': 'Solar energy for the <span class="green-simple">future.</span>',
    'hero-subtitle': 'We specialize in installing photovoltaic farms on land and water.<br>We create a sustainable energy future.',
  },
  
  fr: {
    // Meta tags
    'site-title': 'GreenSun - Installation professionnelle de fermes photovoltaïques',
    'site-description': 'GreenSun - nous nous spécialisons dans l\'installation de fermes photovoltaïques terrestres et flottantes. Plus de 1000 MW de projets réalisés en Europe.',
    'site-keywords': 'photovoltaïque, fermes PV, installation de panneaux solaires, énergie solaire, fermes solaires flottantes',
    
    // Navigation
    'nav-about': 'À propos',
    'nav-services': 'Services',
    'nav-gallery': 'Visualisations',
    'nav-contact': 'Contact',
    
    // Przykładowe tłumaczenia - dodaj swoje własne
    'hero-title': 'L\'énergie solaire pour l\'<span class="green-simple">avenir.</span>',
    'hero-subtitle': 'Nous nous spécialisons dans l\'installation de fermes photovoltaïques terrestres et aquatiques.<br>Nous créons un avenir énergétique durable.',
  }
};

let currentLanguage = 'pl'; // Domyślny język

// ========================================
// 2. FUNKCJE POMOCNICZE DLA MOBILE META TAGS
// ========================================

/**
 * Aktualizuje meta tagi dla przeglądarek mobilnych
 * @param {string} theme - 'light' lub 'dark'
 */
function updateMobileMetaTags(theme) {
  const color = theme === 'dark' ? '#1a1a1b' : '#f2f2f2';
  
  // Theme color dla Chrome Mobile
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

// ========================================
// 3. SYSTEM JĘZYKOWY
// ========================================

/**
 * Wykrywa język przeglądarki użytkownika
 */
function detectUserLanguage() {
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'pl') {
    setLanguage('pl');
  } else if (browserLang === 'fr') {
    setLanguage('fr');
  } else {
    setLanguage('en'); // Domyślnie angielski
  }
}

/**
 * Ustawia język i aktualizuje wszystkie tłumaczenia
 * @param {string} lang - Kod języka ('pl', 'en', 'fr')
 */
function setLanguage(lang) {
  if (!translations[lang]) return;
  
  currentLanguage = lang;
  localStorage.setItem('preferred-language', lang);
  
  // Aktualizuj HTML lang attribute
  document.documentElement.setAttribute('lang', lang);
  
  // Aktualizuj wszystkie elementy z data-i18n
  Object.entries(translations[lang]).forEach(([key, value]) => {
    const elements = document.querySelectorAll(`[data-i18n="${key}"]`);
    elements.forEach(element => {
      // Sprawdź czy to meta tag
      if (element.tagName === 'META') {
        if (element.hasAttribute('name') && element.getAttribute('name') === 'description') {
          element.setAttribute('content', value);
        } else if (element.hasAttribute('name') && element.getAttribute('name') === 'keywords') {
          element.setAttribute('content', value);
        }
      } 
      // Sprawdź czy to title
      else if (element.tagName === 'TITLE') {
        element.textContent = value;
      }
      // Standardowe elementy
      else {
        element.innerHTML = value;
      }
    });
  });
  
  // Aktualizuj przełączniki języka
  updateLanguageSwitchers(lang);
}

/**
 * Aktualizuje stan przełączników języka
 * @param {string} lang - Aktualny język
 */
function updateLanguageSwitchers(lang) {
  const switchers = document.querySelectorAll('.language-switcher, .mobile-language-switcher');
  const langNames = { pl: 'PL', en: 'EN', fr: 'FR' };
  
  switchers.forEach(switcher => {
    const currentButton = switcher.querySelector('.current-lang');
    const flagDiv = currentButton.querySelector('.flag');
    const langText = currentButton.querySelector('.lang-text');
    
    // Usuń wszystkie klasy flag
    flagDiv.className = 'flag';
    // Dodaj aktualną flagę
    flagDiv.classList.add(lang);
    
    // Aktualizuj tekst
    langText.textContent = langNames[lang];
  });
}

/**
 * Inicjalizuje język na podstawie localStorage lub wykrywa z przeglądarki
 */
function initializeLanguage() {
  const savedLanguage = localStorage.getItem('preferred-language');
  if (savedLanguage && translations[savedLanguage]) {
    setLanguage(savedLanguage);
  } else {
    detectUserLanguage();
  }
}

/**
 * Konfiguruje event listenery dla przełączników języka
 */
function setupLanguageSwitcher() {
  const languageSwitchers = document.querySelectorAll('.language-switcher, .mobile-language-switcher');
  
  languageSwitchers.forEach(switcher => {
    const currentLangButton = switcher.querySelector('.current-lang');
    const dropdown = switcher.querySelector('.dropdown');
    const languageButtons = dropdown.querySelectorAll('button');
    
    // Toggle dropdown
    currentLangButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });
    
    // Wybór języka
    languageButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const lang = button.getAttribute('data-lang');
        setLanguage(lang);
        dropdown.classList.remove('show');
      });
    });
  });
  
  // Zamknij dropdown gdy kliknięto poza nim
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-switcher') && !e.target.closest('.mobile-language-switcher')) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  });
}

// ========================================
// 4. SYSTEM MOTYWÓW (JASNY/CIEMNY)
// ========================================

/**
 * Inicjalizuje motyw na podstawie localStorage lub preferencji systemowych
 */
function initializeTheme() {
  // Sprawdź zapisane preferencje lub użyj domyślnych
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  let theme;
  if (savedTheme) {
    theme = savedTheme;
  } else {
    // Auto-wykrywanie na podstawie preferencji systemowych
    theme = prefersDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  }
  
  // Zastosuj motyw
  document.documentElement.setAttribute('data-theme', theme);
  
  // Aktualizuj mobile meta tags
  updateMobileMetaTags(theme);
  
  // Upewnij się że body ma odpowiedni kolor tła od razu
  document.body.style.backgroundColor = theme === 'dark' ? '#1a1a1b' : '#f2f2f2';
}

/**
 * Konfiguruje przełączniki motywów
 */
function setupThemeToggle() {
  const themeToggleButtons = document.querySelectorAll('.theme-toggle');
  
  themeToggleButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      
      // Zastosuj nowy motyw
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Aktualizuj mobile meta tags
      updateMobileMetaTags(newTheme);
      
      // Zapisz preferencje
      localStorage.setItem('theme', newTheme);
      
      // Dodaj smooth transition dla przełącznika
      button.style.transform = 'scale(0.95)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 150);
    });
  });
}

/**
 * Nasłuchuje zmian motywu systemowego
 */
function setupThemeWatcher() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  
  mediaQuery.addEventListener('change', function(e) {
    // Przełącz automatycznie tylko jeśli nie ma manualnych preferencji
    const savedTheme = localStorage.getItem('theme');
    if (!savedTheme) {
      const newTheme = e.matches ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', newTheme);
      
      // Aktualizuj mobile meta tags
      updateMobileMetaTags(newTheme);
      
      localStorage.setItem('theme', newTheme);
    }
  });
}

// ========================================
// 5. NAWIGACJA I SCROLLOWANIE
// ========================================

/**
 * Inicjalizuje nawigację navbar'a
 */
function initNavbarSection() {
  const links = document.querySelectorAll('.nav-link');
  
  // Funkcja aktualizująca aktywny link na podstawie scroll position
  function updateActiveLink() {
    const scrollPosition = window.scrollY + 100; // Offset dla navbar
    
    links.forEach(link => {
      const sectionId = link.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      
      if (section) {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      }
    });
  }
  
  // Nasłuchuj scroll events
  window.addEventListener('scroll', updateActiveLink);
  updateActiveLink(); // Wywołaj od razu
  
  // Smooth scrolling do sekcji po kliknięciu linku
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      
      // Zamknij menu mobilne jeśli otwarte
      const hamburger = document.querySelector('.hamburger-icon');
      const overlay = document.querySelector('.mobile-nav-overlay');
      const navbarContainer = document.querySelector('.navbar-container');
      
      if (overlay && overlay.classList.contains('active')) {
        overlay.classList.add('hiding');
        hamburger.classList.remove('active');
        navbarContainer.classList.remove('menu-open');
        document.body.classList.remove('no-scroll');
        
        setTimeout(() => {
          overlay.classList.remove('active', 'hiding');
        }, 300);
      }
      
      // Smooth scroll do sekcji
      const sectionId = link.getAttribute('data-section');
      const section = document.getElementById(sectionId);
      
      if (section) {
        const navbarHeight = document.querySelector('.navbar-container').offsetHeight;
        const targetPosition = section.offsetTop - navbarHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ========================================
// 6. MOBILNE MENU HAMBURGER
// ========================================

/**
 * Inicjalizuje mobilne menu hamburger
 */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger-icon');
  const overlay = document.querySelector('.mobile-nav-overlay');
  const navbarContainer = document.querySelector('.navbar-container');
  
  if (!hamburger || !overlay || !navbarContainer) return;
  
  hamburger.addEventListener('click', () => {
    if (overlay.classList.contains('active')) {
      // Zamknij menu
      overlay.classList.add('hiding');
      hamburger.classList.remove('active');
      navbarContainer.classList.remove('menu-open');
      document.body.classList.remove('no-scroll');
      
      setTimeout(() => {
        overlay.classList.remove('active', 'hiding');
      }, 300);
    } else {
      // Otwórz menu
      overlay.classList.add('active');
      hamburger.classList.add('active');
      navbarContainer.classList.add('menu-open');
      document.body.classList.add('no-scroll');
    }
  });
}

// ========================================
// 7. AUTO-HIDE NAVBAR PRZY SCROLLOWANIU
// ========================================

let lastScrollTop = 0;
let ticking = false;

/**
 * Obsługuje ukrywanie/pokazywanie navbar'a przy scrollowaniu
 */
function handleNavbarVisibility() {
  const navbar = document.querySelector('.navbar-container');
  if (!navbar) return;
  
  const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
  
  // Jeśli menu mobilne jest otwarte, nie ukrywaj navbar
  const overlay = document.querySelector('.mobile-nav-overlay');
  if (overlay && overlay.classList.contains('active')) {
    ticking = false;
    return;
  }
  
  if (currentScroll > lastScrollTop && currentScroll > 100) {
    // Scrollowanie w dół - ukryj navbar
    if (!navbar.classList.contains('disable-auto-hide')) {
      navbar.classList.add('hide-navbar');
    }
  } else {
    // Scrollowanie w górę - pokaż navbar
    navbar.classList.remove('hide-navbar');
  }
  
  lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
  ticking = false;
}

/**
 * Inicjalizuje auto-hide funkcjonalność
 */
function initNavbarAutoHide() {
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(handleNavbarVisibility);
      ticking = true;
    }
  });
}

// ========================================
// 8. INICJALIZACJA WSZYSTKICH FUNKCJI
// ========================================

/**
 * Inicjalizuje wszystkie funkcjonalności navbar'a
 * Wywołuje się automatycznie gdy DOM jest gotowy
 */
function initNavbar() {
  // Usuń początkowe klasy animacji - pokaż navbar od razu
  const navbar = document.querySelector('.navbar-container');
  if (navbar) {
    navbar.classList.remove('start-show-navbar', 'hide-navbar');
  }
  
  // Inicjalizuj wszystkie systemy
  initializeLanguage();
  setupLanguageSwitcher();
  initializeTheme();
  setupThemeToggle();
  setupThemeWatcher();
  initNavbarSection();
  initMobileMenu();
  initNavbarAutoHide();
  
  console.log('🎉 GreenSun Navbar zainicjalizowany pomyślnie!');
}

// ========================================
// 9. NATYCHMIASTOWA INICJALIZACJA MOTYWU
// ========================================

// Inicjalizuj motyw natychmiast aby uniknąć flash'a
(function() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  document.documentElement.setAttribute('data-theme', theme);
  
  // Aktualizuj mobile meta tags natychmiast
  updateMobileMetaTags(theme);
})();

// Inicjalizuj wszystko gdy DOM jest gotowy
document.addEventListener('DOMContentLoaded', initNavbar);

// ========================================
// 10. EKSPORT FUNKCJI (DLA UŻYCIA ZEWNĘTRZNEGO)
// ========================================

// Udostępnij funkcje globalnie jeśli potrzebne
if (typeof window !== 'undefined') {
  window.GreenSunNavbar = {
    setLanguage,
    initializeTheme,
    translations,
    currentLanguage: () => currentLanguage
  };
}