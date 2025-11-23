# Komendy testowe dla GreenSun

## Backend - testy API

### 1. Test podstawowy (sprawdź czy backend działa)
```bash
curl https://greensun-backend.fly.dev/health
```
**Oczekiwana odpowiedź:** `{"status":"ok"}`

---

### 2. Test formularza kontaktowego (pełny test)
```bash
curl -X POST https://greensun-backend.fly.dev/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jan",
    "lastName": "Testowy",
    "email": "test@example.com",
    "subject": "Test z konsoli",
    "message": "To jest testowa wiadomość z terminala",
    "privacy": true,
    "marketing": false,
    "language": "pl"
  }'
```
**Oczekiwana odpowiedź:** `{"success":true,"message":"Wiadomość została wysłana pomyślnie"}`

---

### 3. Test walidacji (brak wymaganych pól)
```bash
curl -X POST https://greensun-backend.fly.dev/contact \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```
**Oczekiwana odpowiedź:** `{"success":false,"errors":[...]}`

---

### 4. Test w języku angielskim
```bash
curl -X POST https://greensun-backend.fly.dev/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Test",
    "email": "test@example.com",
    "subject": "Test from console",
    "message": "This is a test message from terminal",
    "privacy": true,
    "marketing": false,
    "language": "en"
  }'
```

---

### 5. Test szczegółowy z pełnymi headerami (verbose)
```bash
curl -v -X POST https://greensun-backend.fly.dev/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jan",
    "lastName": "Kowalski",
    "email": "test@example.com",
    "subject": "Test",
    "message": "Testowa wiadomość",
    "privacy": true,
    "marketing": false,
    "language": "pl"
  }'
```
**Opcja `-v`** pokazuje szczegóły połączenia, nagłówki HTTP, kody odpowiedzi, itp.

---

## Fly.io - zarządzanie i monitoring

### Sprawdzenie statusu aplikacji
```bash
# Frontend
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025
/Users/jakubpernal/.fly/bin/flyctl status

# Backend
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend
/Users/jakubpernal/.fly/bin/flyctl status
```

---

### Podgląd logów na żywo
```bash
# Backend - logi na żywo
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend
/Users/jakubpernal/.fly/bin/flyctl logs

# Backend - ostatnie logi bez streamowania
/Users/jakubpernal/.fly/bin/flyctl logs --no-tail
```

**Wskazówka:** Naciśnij Ctrl+C aby zatrzymać streaming logów

---

### Sprawdzenie sekretów (zmiennych środowiskowych)
```bash
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend
/Users/jakubpernal/.fly/bin/flyctl secrets list
```

---

### Ustawienie nowego sekretu
```bash
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend
/Users/jakubpernal/.fly/bin/flyctl secrets set NAZWA_SEKRETU="wartość"
```

---

### Wdrożenie (deploy) po zmianach
```bash
# Frontend
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025
/Users/jakubpernal/.fly/bin/flyctl deploy

# Backend
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend
/Users/jakubpernal/.fly/bin/flyctl deploy
```

---

### Restart aplikacji
```bash
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend
/Users/jakubpernal/.fly/bin/flyctl apps restart greensun-backend
```

---

## Frontend - testy w przeglądarce

### Otwórz konsolę przeglądarki (Chrome/Firefox)
1. Naciśnij **F12** lub **Ctrl+Shift+I** (Windows/Linux) lub **Cmd+Option+I** (Mac)
2. Przejdź do zakładki **Console**
3. Przejdź do zakładki **Network** aby zobaczyć żądania HTTP

### Testowanie formularza
1. Otwórz https://greensun-2.fly.dev/
2. Przewiń do sekcji kontakt
3. Wypełnij formularz
4. W zakładce **Network** w konsoli znajdź żądanie do `greensun-backend.fly.dev/contact`
5. Kliknij na nie aby zobaczyć:
   - **Headers** - nagłówki żądania i odpowiedzi
   - **Payload** - dane wysłane do serwera
   - **Response** - odpowiedź serwera

---

## Debugowanie problemów

### Problem: Serwer nie odpowiada
```bash
# Sprawdź status
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend
/Users/jakubpernal/.fly/bin/flyctl status

# Sprawdź logi
/Users/jakubpernal/.fly/bin/flyctl logs --no-tail

# Restart jeśli potrzeba
/Users/jakubpernal/.fly/bin/flyctl apps restart greensun-backend
```

---

### Problem: Email nie jest wysyłany
```bash
# 1. Sprawdź czy sekrety są ustawione
/Users/jakubpernal/.fly/bin/flyctl secrets list

# 2. Zobacz logi błędów
/Users/jakubpernal/.fly/bin/flyctl logs --no-tail | grep "❌"

# 3. Test lokalny (uruchom backend lokalnie)
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend
node server.js

# W drugiej konsoli:
curl -X POST http://localhost:8080/contact \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "Local",
    "email": "test@example.com",
    "subject": "Test lokalny",
    "message": "Testowa wiadomość lokalnie",
    "privacy": true,
    "language": "pl"
  }'
```

---

### Problem: Rate limiting (za dużo żądań)
Jeśli widzisz błąd **429 Too Many Requests**:
```bash
# Poczekaj 1 godzinę lub:
# Zresetuj IP w rate limiter (wymaga restartu serwera)
cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend
/Users/jakubpernal/.fly/bin/flyctl apps restart greensun-backend
```

---

## Aliasy dla wygody (dodaj do ~/.zshrc lub ~/.bashrc)

```bash
# Dodaj do ~/.zshrc:
alias fly='/Users/jakubpernal/.fly/bin/flyctl'
alias fly-backend='cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025/backend && fly'
alias fly-frontend='cd /Users/jakubpernal/Programowanie/Strony\ i\ aplikacje/GreenSun./test\ 2\ -\ 12.10.2025 && fly'

# Użycie po restarcie terminala:
fly-backend status
fly-backend logs
fly-frontend deploy
```

---

## Przydatne linki

- **Frontend:** https://greensun-2.fly.dev/
- **Backend API:** https://greensun-backend.fly.dev/
- **Health Check:** https://greensun-backend.fly.dev/health
- **Fly.io Dashboard:** https://fly.io/dashboard
- **Dokumentacja Fly.io:** https://fly.io/docs/
