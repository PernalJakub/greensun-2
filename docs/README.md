# 🌞 GreenSun - Profesjonalny montaż farm fotowoltaicznych

Nowoczesna strona internetowa dla firmy GreenSun specjalizującej się w montażu konstrukcji fotowoltaicznych na lądzie i wodzie.

## 🎯 O projekcie

GreenSun to firma z ponad 5-letnim doświadczeniem w branży fotowoltaicznej, która zrealizowała projekty o łącznej mocy ponad 1000 MW we Francji, Polsce i innych krajach Europy. Największym osiągnięciem firmy jest realizacja największej farmy fotowoltaicznej na wodzie w Europie.

## 🚀 Funkcjonalności strony

### ✨ Sekcje
- **Hero Section** - Animowana sekcja główna z wideo w tle
- **O nas** - Prezentacja doświadczenia i osiągnięć firmy
- **Usługi** - Responsywna siatka usług z opcją rozwinięcia
- **Galeria** - Portfolio projektów z filtrami (lądowe/wodne, Europa/Polska)
- **Kontakt** - Formularz kontaktowy z walidacją
- **Stopka** - Kompletne informacje kontaktowe i linki

### 🎨 Design & UX
- **Mobile-first** - Responsywny design dostosowany do wszystkich urządzeń
- **Animacje scroll-based** - Subtelne animacje fade-in, slide-in, scale
- **Nowoczesny styl** - Jasny layout z dominacją bieli i zieleni (eco-tech)
- **Profesjonalne ikony SVG** - Ładowane dynamicznie z `/media/icons/`
- **Optymalizacja Lighthouse** - SEO i performance friendly

### 🔧 Technologie
- **HTML5** - Semantyczna struktura
- **CSS3** - Zmienne CSS, Grid, Flexbox, animacje
- **Vanilla JavaScript** - Bez zewnętrznych bibliotek
- **SVG Icons** - Skalowalne ikony
- **Backend** - Node.js + Express lub PHP

## 📁 Struktura projektu

```
GreenSun/
├── index-backup-test.html    # Główny plik strony
├── media/                    # Zasoby multimedialne
│   ├── GreenSun.webm        # Wideo hero section
│   └── icons/               # Ikony SVG
│       ├── facebook.svg
│       ├── instagram.svg
│       ├── tiktok.svg
│       ├── booksy.svg
│       ├── google-maps.svg
│       ├── lesson.svg
│       ├── narrowup.svg
│       └── narrowdown.svg
├── backend/                  # Backend API
│   ├── server.js            # Node.js server
│   ├── contact.php          # PHP handler
│   ├── package.json         # Node.js dependencies
│   ├── .env.example         # Przykład konfiguracji
│   └── README.md            # Dokumentacja backend
└── README.md                # Ta dokumentacja
```

## 🛠️ Instalacja i uruchomienie

### Frontend
1. Skopiuj pliki na serwer web
2. Dodaj zdjęcia do galerii w miejscach oznaczonych komentarzami:
   ```html
   <!-- Tutaj dodaj zdjęcie farm lądowych -->
   <!-- Tutaj dodaj zdjęcie farm wodnych -->
   ```

### Backend (Node.js - zalecane)
```bash
cd backend
npm install
```

Skonfiguruj email w `server.js`:
```javascript
const emailConfig = {
  host: 'smtp.gmail.com',
  auth: {
    user: 'your-email@gmail.com',     // TUTAJ WSTAW SWÓJ EMAIL
    pass: 'your-app-password'         // TUTAJ WSTAW HASŁO APLIKACJI
  }
};
```

Uruchom serwer:
```bash
npm run dev  # Development
npm start    # Production
```

### Backend (PHP - alternatywa)
1. Upload `backend/contact.php` na serwer
2. Skonfiguruj adresy email w pliku:
   ```php
   define('RECIPIENT_EMAIL', 'contact@greensun.pl');
   define('SENDER_EMAIL', 'noreply@greensun.pl');
   ```

## 📧 Konfiguracja Analytics

### Google Analytics 4
Znajdź w kodzie HTML:
```javascript
gtag('config', 'GA_MEASUREMENT_ID'); // Zamień na prawdziwy ID
```
Zastąp `GA_MEASUREMENT_ID` swoim ID z Google Analytics.

### Meta Pixel
Znajdź w kodzie HTML:
```javascript
fbq('init', 'YOUR_PIXEL_ID'); // Zamień na prawdziwy Pixel ID
```
Zastąp `YOUR_PIXEL_ID` swoim ID z Meta Business.

## 🎨 Personalizacja

### Kolory (zmienne CSS)
```css
:root {
  --primary-base: #ceb37c;      /* Główny kolor złoty */
  --primary-dark: #a58f63;      /* Ciemniejszy złoty */
  --secondary-base: #cca848;    /* Kolor akcentujący */
  --tertiary-base: #161619;     /* Ciemny tekst */
  --success: #67bd50;           /* Zielony sukces */
  --neutral-white: #ffffff;     /* Białe tło */
}
```

### Dodawanie zdjęć do galerii
1. Znajdź sekcję galerii w HTML
2. Dodaj nowe elementy `.gallery-item`:
```html
<div class="gallery-item" data-category="land europe">
  <img src="/media/gallery/your-image.jpg" alt="Opis">
  <div class="gallery-item-info">
    <div class="gallery-item-title">Tytuł projektu</div>
    <div class="gallery-item-location">200 MW • Lokalizacja</div>
  </div>
</div>
```

### Aktualizacja treści
- **Dane firmy**: Znajdź w HTML sekcje z komentarzami `<!-- Tutaj... -->`
- **Kontakt**: Aktualizuj email i telefon w stopce
- **Social media**: Zmień linki w navbar i stopce

## 🔒 Bezpieczeństwo

### Formularz kontaktowy
- ✅ Rate limiting (5 wiadomości/godzinę)
- ✅ Walidacja danych po stronie klienta i serwera
- ✅ Sanityzacja danych wejściowych
- ✅ CORS headers
- ✅ CSRF protection ready

### Cookies & GDPR
- ✅ Banner cookies z opcją akceptacji/odrzucenia
- ✅ LocalStorage do zapamiętania wyboru
- ✅ Linki do polityki prywatności

## 📱 Responsywność

### Breakpointy
- **Mobile**: `< 599px`
- **Tablet**: `600px - 991px`
- **Desktop**: `> 992px`

### Testowanie
Strona została przetestowana na:
- ✅ iPhone (Safari, Chrome)
- ✅ Android (Chrome, Samsung Browser)
- ✅ iPad (Safari)
- ✅ Desktop (Chrome, Firefox, Safari, Edge)

## 🚀 Deployment

### Hosting statyczny
1. Upload plików do `/public_html/`
2. Skonfiguruj backend na tym samym domenie lub subdomenie
3. Ustaw SSL certificate

### CDN (opcjonalnie)
Dla lepszej wydajności można użyć CDN dla zasobów statycznych:
- Cloudflare
- AWS CloudFront
- Google Cloud CDN

## 📊 Performance

### Optymalizacje
- ✅ Zoptymalizowane CSS (zmienne, minimal redundancy)
- ✅ Lazy loading dla animacji
- ✅ Compressed SVG icons
- ✅ Minimal JavaScript (vanilla, no frameworks)
- ✅ Semantic HTML5

### Lighthouse Score (cel)
- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 90+
- **SEO**: 95+

## 🔄 Aktualizacje

### v1.0.0 (Initial)
- ✅ Wszystkie podstawowe sekcje
- ✅ Responsywny design
- ✅ Formularz kontaktowy
- ✅ Backend (Node.js + PHP)
- ✅ Animacje scroll-based
- ✅ Analytics ready

### Planowane funkcjonalności
- [ ] Blog section
- [ ] Kalkulator oszczędności PV
- [ ] Mapa realizacji
- [ ] Wielojęzyczność (EN)
- [ ] PWA support

## 📞 Wsparcie

W razie pytań lub problemów:
1. Sprawdź dokumentację w `/backend/README.md`
2. Sprawdź logi przeglądarki (F12)
3. Sprawdź logi serwera

## 📄 Licencja

Ten projekt został stworzony dla firmy GreenSun. Kod może być wykorzystany zgodnie z ustaleniami umowy.

---

**Stworzone z ❤️ dla zrównoważonej przyszłości energetycznej**# greensun
