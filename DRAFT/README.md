# GreenSun Navbar - Instrukcja Implementacji

Funkcjonalny navbar z kompletnym design systemem, wielojęzycznością i motywami jasny/ciemny.

## 🚀 Szybki Start

1. **Skopiuj pliki** do swojego projektu:
   - `navbar.html` - struktura HTML
   - `navbar-styles.css` - kompletne style
   - `navbar.js` - funkcjonalności

2. **Dodaj Google Fonts** do swojego HTML:
```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

3. **Dołącz meta tagi** (opcjonalnie, dla mobile):
```html
<meta name="theme-color" content="#f2f2f2" id="theme-color-meta">
<meta name="msapplication-navbutton-color" content="#f2f2f2" id="ms-nav-color">
<meta name="apple-mobile-web-app-status-bar-style" content="default" id="apple-status-bar">
```

## 📋 Co Zawiera

### ✨ Funkcjonalności
- **Responsywny design** - automatyczne dostosowanie desktop/mobile
- **System motywów** - jasny/ciemny z localStorage
- **Wielojęzyczność** - PL/EN/FR z auto-wykrywaniem
- **Smooth scrolling** - płynne przejścia między sekcjami
- **Auto-hide navbar** - ukrywa się przy scrollowaniu w dół
- **Aktywne linki** - highlight aktualnej sekcji
- **Social media** - linki z hover effects

### 🎨 Design System
- **CSS Variables** - łatwa personalizacja kolorów
- **Typography Scale** - spójna typografia
- **Spacing System** - konsystentne odstępy
- **Brand Colors** - kolory GreenSun
- **Dark Mode** - kompletny tryb ciemny

## 🔧 Implementacja Krok po Kroku

### 1. Struktura HTML

Skopiuj sekcję navbar z `navbar.html`:

```html
<section class="navbar-section">
  <!-- Cała zawartość navbar -->
</section>
```

### 2. Zaktualizuj Nawigację

Zmień `data-section` na ID swoich sekcji:

```html
<!-- PRZED -->
<button class="nav-link" data-section="about-section" data-i18n="nav-about">O nas</button>

<!-- PO ZMIANIE (przykład) -->
<button class="nav-link" data-section="moja-sekcja" data-i18n="nav-about">O nas</button>
```

### 3. Dodaj Tłumaczenia

W `navbar.js` dodaj swoje tłumaczenia:

```javascript
const translations = {
  pl: {
    'nav-about': 'O nas',
    'nav-services': 'Usługi',
    'moj-nowy-tekst': 'Mój nowy tekst',
    // ... dodaj więcej
  },
  en: {
    'nav-about': 'About us',
    'nav-services': 'Services', 
    'moj-nowy-tekst': 'My new text',
    // ... dodaj więcej
  }
}
```

### 4. Oznacz Elementy do Tłumaczenia

Dodaj `data-i18n` do elementów:

```html
<h1 data-i18n="moj-nowy-tekst">Mój nowy tekst</h1>
<p data-i18n="opis">Opis strony...</p>
```

### 5. Zaktualizuj Social Media

Zmień linki na swoje:

```html
<!-- Zaktualizuj href -->
<a href="https://www.facebook.com/twoja-strona" target="_blank" rel="noopener">
<a href="https://www.instagram.com/twoja-strona" target="_blank" rel="noopener">
```

## 🎨 Personalizacja

### Zmiana Kolorów

W `navbar-styles.css` edytuj CSS variables:

```css
:root {
  --primary-base: #1fc55c;        /* Główny kolor marki */
  --primary-dark: #16a049;        /* Ciemniejszy odcień */
  --neutral-very-light: #f2f2f2;  /* Tło navbar */
  /* ... inne kolory */
}
```

### Zmiana Czcionek

```css
:root {
  --font-display: 'Twoja-Czcionka', sans-serif;
  --font-rest: 'Inna-Czcionka', sans-serif;
}
```

### Dostosowanie Breakpointów

```css
@media (max-width: 991px) {
  /* Tablet styles */
}

@media (max-width: 599px) {
  /* Mobile styles */
}
```

## 🔧 API JavaScript

Navbar udostępnia funkcje globalnie:

```javascript
// Zmiana języka programowo
window.GreenSunNavbar.setLanguage('en');

// Aktualny język
console.log(window.GreenSunNavbar.currentLanguage());

// Reinicjalizacja motywu
window.GreenSunNavbar.initializeTheme();

// Dostęp do tłumaczeń
console.log(window.GreenSunNavbar.translations);
```

## 📱 Mobile Features

- **Auto-hide navbar** przy scrollowaniu
- **Hamburger menu** z smooth animations
- **Touch-friendly** przyciski i controls
- **Mobile meta tags** - automatyczna aktualizacja kolorów
- **Responsive typography** - skalowanie na małych ekranach

## 🌍 Wsparcie Przeglądarek

- ✅ Chrome/Edge 70+
- ✅ Firefox 65+  
- ✅ Safari 12+
- ✅ Mobile Safari (iOS)
- ✅ Chrome Mobile (Android)

## 🐛 Troubleshooting

### Navbar nie działa
- Sprawdź czy masz wszystkie 3 pliki (HTML, CSS, JS)
- Sprawdź console w Developer Tools
- Upewnij się że sekcje mają odpowiednie ID

### Motyw nie przełącza się
- Sprawdź czy masz `data-theme` attribute na `<html>`
- Sprawdź localStorage w Developer Tools
- Sprawdź czy CSS ma zmienne dla dark mode

### Tłumaczenia nie działają
- Sprawdź czy elementy mają `data-i18n` attribute
- Sprawdź czy klucze w translations obiekcie się zgadzają
- Sprawdź console pod kątem błędów

### Smooth scrolling nie działa
- Sprawdź czy sekcje mają poprawne ID
- Sprawdź czy `data-section` w linkach się zgadza z ID sekcji
- Upewnij się że CSS scroll-behavior jest ustawiony

## 📞 Wsparcie

Jeśli napotkasz problemy:

1. Sprawdź console w Developer Tools
2. Porównaj swoją implementację z `navbar.html`
3. Upewnij się że masz wszystkie wymagane pliki

## 📄 Licencja

Ten kod jest częścią projektu GreenSun i może być używany w projektach komercyjnych i niekomercyjnych.