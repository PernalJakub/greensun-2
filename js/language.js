// ===== LANGUAGE MODULE =====
// Handles multi-language support (PL/EN/FR) and content translation

// Global variables
let translations = {};
let formMessages = {};
let translationsReady = false;
let currentLanguage = 'pl';

// Promise that resolves when translations are loaded
const translationsLoadedPromise = (async function initTranslations() {
  try {
    // Load all languages
    await window.i18n.loadAllLanguages();

    // Populate translations object from i18n module
    translations = {
      pl: window.i18n.translations.pl || {},
      en: window.i18n.translations.en || {},
      fr: window.i18n.translations.fr || {}
    };

    // Extract form messages from translations
    formMessages = {
      pl: {
        sending: translations.pl['form-sending'] || 'Wysyłanie...',
        sent: translations.pl['form-sent'] || 'Wysłano!',
        error: translations.pl['form-error'] || 'Błąd',
        serverError: translations.pl['form-serverError'] || 'Błąd serwera',
        genericError: translations.pl['form-genericError'] || 'Wystąpił błąd',
        successFallback: translations.pl['form-successFallback'] || 'Wysłano pomyślnie!',
        valueMissing: translations.pl['form-valueMissing'] || 'Wypełnij to pole.',
        typeMismatch: translations.pl['form-typeMismatch'] || 'Wprowadź prawidłowy email.',
        tooShort: translations.pl['form-tooShort'] || 'Pole za krótkie.',
        checkboxRequired: translations.pl['form-checkboxRequired'] || 'Zaznacz to pole.'
      },
      en: {
        sending: translations.en['form-sending'] || 'Sending...',
        sent: translations.en['form-sent'] || 'Sent!',
        error: translations.en['form-error'] || 'Error',
        serverError: translations.en['form-serverError'] || 'Server error',
        genericError: translations.en['form-genericError'] || 'An error occurred',
        successFallback: translations.en['form-successFallback'] || 'Sent successfully!',
        valueMissing: translations.en['form-valueMissing'] || 'Please fill out this field.',
        typeMismatch: translations.en['form-typeMismatch'] || 'Please enter a valid email.',
        tooShort: translations.en['form-tooShort'] || 'Please lengthen this text.',
        checkboxRequired: translations.en['form-checkboxRequired'] || 'Please check this box.'
      },
      fr: {
        sending: translations.fr['form-sending'] || 'Envoi...',
        sent: translations.fr['form-sent'] || 'Envoyé !',
        error: translations.fr['form-error'] || 'Erreur',
        serverError: translations.fr['form-serverError'] || 'Erreur serveur',
        genericError: translations.fr['form-genericError'] || 'Une erreur s\'est produite',
        successFallback: translations.fr['form-successFallback'] || 'Envoyé avec succès !',
        valueMissing: translations.fr['form-valueMissing'] || 'Veuillez remplir ce champ.',
        typeMismatch: translations.fr['form-typeMismatch'] || 'Veuillez saisir un email valide.',
        tooShort: translations.fr['form-tooShort'] || 'Veuillez allonger ce texte.',
        checkboxRequired: translations.fr['form-checkboxRequired'] || 'Veuillez cocher cette case.'
      }
    };

    translationsReady = true;

    // Initialize the page after translations are loaded
    detectUserLanguage();

    return true;
  } catch (error) {
    console.error('Failed to load translations:', error);
    // Fallback to empty objects - user will see translation keys
    translations = { pl: {}, en: {}, fr: {} };
    formMessages = { pl: {}, en: {}, fr: {} };
    translationsReady = true;
    return false;
  }
})();

// Detect user's preferred language
async function detectUserLanguage() {
  // Check if user has a saved language preference
  const savedLang = localStorage.getItem('preferred-language');
  if (savedLang && ['pl', 'en', 'fr'].includes(savedLang)) {
    await setLanguage(savedLang);
    return;
  }

  // Otherwise, detect from browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'pl') {
    await setLanguage('pl');
  } else if (browserLang === 'fr') {
    await setLanguage('fr');
  } else {
    await setLanguage('en');
  }
}

// Set the current language
async function setLanguage(lang) {
  // Wait for translations to be loaded
  await translationsLoadedPromise;

  currentLanguage = lang;
  document.documentElement.lang = lang;
  updateContent();
  localStorage.setItem('preferred-language', lang);

  // Update carousel captions if carousel is initialized
  if (typeof window.updateCarouselLanguage === 'function') {
    window.updateCarouselLanguage();
  }

  // Update language switcher display
  const currentLangButtons = document.querySelectorAll('.current-lang');
  currentLangButtons.forEach(button => {
    const flag = button.querySelector('.flag');
    if (flag) {
      flag.className = `flag ${lang}`;
    }
    const text = button.querySelector('.lang-text');
    if (text) {
      text.textContent = lang.toUpperCase();
    }
  });

  // Update subject dropdown placeholder if no selection is made
  const subjectText = document.querySelector('.subject-text');
  const hiddenSubjectInput = document.getElementById('subject');
  if (subjectText && hiddenSubjectInput && !hiddenSubjectInput.value) {
    subjectText.textContent = translations[currentLanguage]['subject-placeholder'];
  }

  // Update HTML5 validation messages
  updateFormValidation(lang);
}

// Update form validation messages based on language
function updateFormValidation(lang) {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const messages = formMessages[lang];

  // Get all required fields
  const requiredInputs = form.querySelectorAll('input[required], textarea[required]');
  requiredInputs.forEach(input => {
    input.addEventListener('invalid', function() {
      if (this.validity.valueMissing) {
        this.setCustomValidity(messages.valueMissing);
      } else if (this.validity.typeMismatch) {
        this.setCustomValidity(messages.typeMismatch);
      } else if (this.validity.tooShort) {
        this.setCustomValidity(messages.tooShort);
      }
    });

    // Reset custom validity on input
    input.addEventListener('input', function() {
      this.setCustomValidity('');
    });
  });

  // Handle checkbox separately
  const privacyCheckbox = form.querySelector('input[name="privacy"]');
  if (privacyCheckbox) {
    privacyCheckbox.addEventListener('invalid', function() {
      this.setCustomValidity(messages.checkboxRequired);
    });

    privacyCheckbox.addEventListener('change', function() {
      this.setCustomValidity('');
    });
  }
}

// Update all translatable content on the page
function updateContent() {
  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(element => {
    const key = element.getAttribute('data-i18n');
    if (translations[currentLanguage] && translations[currentLanguage][key]) {
      // Handle placeholder attributes
      if (key.includes('placeholder') || element.hasAttribute('placeholder')) {
        element.placeholder = translations[currentLanguage][key];
      }
      // Handle input/textarea elements without placeholder
      else if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        element.placeholder = translations[currentLanguage][key];
      }
      // Handle title attributes
      else if (element.hasAttribute('title')) {
        element.title = translations[currentLanguage][key];
      }
      // Handle text content
      else {
        // Check if the translation contains HTML
        if (translations[currentLanguage][key].includes('<')) {
          element.innerHTML = translations[currentLanguage][key];
        } else {
          element.textContent = translations[currentLanguage][key];
        }
      }
    }
  });

  document.title = translations[currentLanguage]['site-title'];
  const descMeta = document.querySelector('meta[name="description"]');
  const keywordsMeta = document.querySelector('meta[name="keywords"]');

  if (descMeta) descMeta.content = translations[currentLanguage]['site-description'];
  if (keywordsMeta) keywordsMeta.content = translations[currentLanguage]['site-keywords'];
}

// Setup language switcher dropdowns
function setupLanguageSwitcher() {
  const languageSwitchers = document.querySelectorAll('.language-switcher, .mobile-language-switcher');

  languageSwitchers.forEach(switcher => {
    const currentLangButton = switcher.querySelector('.current-lang');
    const dropdown = switcher.querySelector('.dropdown');
    const languageButtons = dropdown.querySelectorAll('button');

    currentLangButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('show');
    });

    languageButtons.forEach(button => {
      button.addEventListener('click', async (e) => {
        e.preventDefault();
        const lang = button.getAttribute('data-lang');
        await setLanguage(lang);
        dropdown.classList.remove('show');
      });
    });
  });

  document.addEventListener('click', (e) => {
    if (!e.target.closest('.language-switcher') && !e.target.closest('.mobile-language-switcher')) {
      document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    }
  });
}

// Kept for compatibility but does nothing - initialization happens in initTranslations
function initializeLanguage() {
  // Language is initialized in initTranslations() after translations are loaded
  // This function is kept for compatibility but does nothing
  // Translation detection happens automatically in initTranslations
}

// Export functions and variables
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    translations,
    formMessages,
    currentLanguage,
    translationsReady,
    translationsLoadedPromise,
    detectUserLanguage,
    setLanguage,
    updateContent,
    setupLanguageSwitcher,
    initializeLanguage,
    updateFormValidation
  };
}

// Make available globally
window.languageModule = {
  get translations() { return translations; },
  get formMessages() { return formMessages; },
  get currentLanguage() { return currentLanguage; },
  get translationsReady() { return translationsReady; },
  translationsLoadedPromise,
  detectUserLanguage,
  setLanguage,
  updateContent,
  setupLanguageSwitcher,
  initializeLanguage,
  updateFormValidation
};
