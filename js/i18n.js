/**
 * GreenSun i18n Module
 * Handles loading and managing translations from external JSON files
 */

class I18n {
  constructor() {
    this.translations = {};
    this.currentLanguage = 'pl';
    this.supportedLanguages = ['pl', 'en', 'fr'];
  }

  /**
   * Load translations for a specific language
   * @param {string} lang - Language code (pl, en, fr)
   * @returns {Promise<Object>} - Translation object
   */
  async loadLanguage(lang) {
    if (this.translations[lang]) {
      return this.translations[lang];
    }

    try {
      const response = await fetch(`./data/translations/${lang}.json`);
      if (!response.ok) {
        throw new Error(`Failed to load ${lang} translations`);
      }
      this.translations[lang] = await response.json();
      return this.translations[lang];
    } catch (error) {
      console.error(`Error loading translations for ${lang}:`, error);
      // Fallback to Polish if loading fails
      if (lang !== 'pl') {
        return this.loadLanguage('pl');
      }
      return {};
    }
  }

  /**
   * Load all translations at once
   * @returns {Promise<void>}
   */
  async loadAllLanguages() {
    const promises = this.supportedLanguages.map(lang => this.loadLanguage(lang));
    await Promise.all(promises);
  }

  /**
   * Get translation for a specific key
   * @param {string} key - Translation key
   * @param {string} lang - Language code (optional, uses current language)
   * @returns {string} - Translated text
   */
  t(key, lang = this.currentLanguage) {
    const langTranslations = this.translations[lang];
    if (!langTranslations) {
      console.warn(`Translations for ${lang} not loaded`);
      return key;
    }
    return langTranslations[key] || key;
  }

  /**
   * Set current language
   * @param {string} lang - Language code
   */
  setLanguage(lang) {
    if (this.supportedLanguages.includes(lang)) {
      this.currentLanguage = lang;
    } else {
      console.warn(`Unsupported language: ${lang}`);
    }
  }

  /**
   * Get current language
   * @returns {string} - Current language code
   */
  getLanguage() {
    return this.currentLanguage;
  }

  /**
   * Detect browser language and set it
   * @returns {string} - Detected language code
   */
  detectLanguage() {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'pl') {
      this.setLanguage('pl');
    } else if (browserLang === 'fr') {
      this.setLanguage('fr');
    } else {
      this.setLanguage('en');
    }
    return this.currentLanguage;
  }

  /**
   * Get all translations for current language
   * @returns {Object} - Translation object
   */
  getAll() {
    return this.translations[this.currentLanguage] || {};
  }

  /**
   * Check if translations are loaded for a language
   * @param {string} lang - Language code
   * @returns {boolean}
   */
  isLoaded(lang) {
    return !!this.translations[lang];
  }
}

// Create and export singleton instance
const i18n = new I18n();

// Make it globally available
if (typeof window !== 'undefined') {
  window.i18n = i18n;
}
