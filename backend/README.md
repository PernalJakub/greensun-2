# GreenSun Contact Form Backend

Backend API do obsługi formularza kontaktowego dla strony GreenSun.

## 🚀 Dostępne opcje backendu

### Option 1: Node.js + Express (Zalecane)

#### Instalacja
```bash
cd backend
npm install
```

#### Konfiguracja
1. Otwórz `server.js`
2. Znajdź sekcję `// ===== KONFIGURACJA EMAIL =====`
3. Uzupełnij dane SMTP:
   ```javascript
   const emailConfig = {
     host: 'smtp.gmail.com', // Twój serwer SMTP
     port: 587,
     secure: false,
     auth: {
       user: 'your-email@gmail.com', // TUTAJ WSTAW SWÓJ EMAIL
       pass: 'your-app-password' // TUTAJ WSTAW HASŁO APLIKACJI
     }
   };
   ```

#### Uruchomienie
```bash
# Development
npm run dev

# Production
npm start
```

Serwer będzie dostępny na `http://localhost:3000`

### Option 2: PHP

#### Konfiguracja
1. Otwórz `contact.php`
2. Znajdź sekcję `// ===== KONFIGURACJA =====`
3. Uzupełnij adresy email:
   ```php
   define('RECIPIENT_EMAIL', 'contact@greensun.pl'); // TUTAJ WSTAW DOCELOWY EMAIL
   define('SENDER_EMAIL', 'noreply@greensun.pl');    // TUTAJ WSTAW EMAIL NADAWCY
   ```

#### Uruchomienie
Skopiuj plik `contact.php` na serwer z PHP i ustaw endpoint w formularzu na:
```javascript
action="/backend/contact.php"
```

## 🔧 Funkcjonalności

### Bezpieczeństwo
- ✅ Rate limiting (5 wiadomości/godzinę z IP)
- ✅ Walidacja danych wejściowych
- ✅ Sanityzacja danych
- ✅ CORS headers
- ✅ Security headers (Node.js)

### Email
- ✅ Wysyłanie wiadomości do właściciela
- ✅ Automatyczne potwierdzenie dla nadawcy
- ✅ HTML templates
- ✅ Reply-to header

### Logowanie
- ✅ Logowanie aktywności (PHP)
- ✅ Error handling
- ✅ Health check endpoint (Node.js)

## 📧 Konfiguracja Email

### Gmail (Zalecane)
1. Włącz 2-factor authentication
2. Wygeneruj hasło aplikacji: https://myaccount.google.com/apppasswords
3. Użyj tego hasła w konfiguracji

### Inne dostawcy SMTP
- **SendGrid**: `smtp.sendgrid.net:587`
- **Mailgun**: `smtp.eu.mailgun.org:587`
- **Amazon SES**: `email-smtp.eu-west-1.amazonaws.com:587`

## 🚦 Testowanie

### Node.js
```bash
curl -X POST http://localhost:3000/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jan",
    "email": "test@example.com",
    "message": "Test message from API",
    "privacy": true
  }'
```

### PHP
```bash
curl -X POST http://yourdomain.com/backend/contact.php \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jan",
    "email": "test@example.com",
    "message": "Test message from API",
    "privacy": true
  }'
```

## 📁 Struktura plików

```
backend/
├── server.js          # Node.js server
├── contact.php        # PHP handler
├── package.json       # Node.js dependencies
├── README.md          # Ta dokumentacja
├── rate_limit.json    # Rate limiting data (auto-generated)
└── contact_log.txt    # PHP logs (auto-generated)
```

## 🔧 Deployment

### Node.js na Heroku
1. Utwórz plik `Procfile`: `web: node server.js`
2. Ustaw zmienne środowiskowe w Heroku Dashboard
3. Deploy przez Git

### Node.js na VPS
1. Użyj PM2: `pm2 start server.js --name greensun-api`
2. Skonfiguruj nginx jako reverse proxy
3. Ustaw SSL certificate

### PHP na shared hosting
1. Upload `contact.php` do folderu `/public_html/backend/`
2. Upewnij się, że hosting obsługuje funkcję `mail()`
3. Ustaw odpowiednie permissions (644)

## ⚠️ Uwagi bezpieczeństwa

1. **Nigdy nie commituj prawdziwych danych logowania do Git**
2. Użyj zmiennych środowiskowych w produkcji
3. Regularnie aktualizuj dependencies
4. Monitoruj logi pod kątem ataków
5. Skonfiguruj firewall na serwerze

## 📞 Wsparcie

W razie problemów sprawdź:
1. Logi serwera
2. Konfigurację SMTP
3. Firewall/security groups
4. DNS settings (SPF, DKIM)

## 📄 Licencja

MIT License - możesz swobodnie używać tego kodu w swoich projektach.