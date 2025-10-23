// ===== BACKEND NODE.JS DLA FORMULARZA KONTAKTOWEGO =====
// Autor: GreenSun Contact Form Handler
// Opis: Prosty serwer Express.js do obsługi formularza kontaktowego

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const validator = require('validator');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== MIDDLEWARE =====
app.use(helmet()); // Bezpieczeństwo
app.use(cors()); // CORS dla frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - maksymalnie 5 wiadomości na godzinę z jednego IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 godzina
  max: 5, // maksymalnie 5 requestów
  message: {
    error: 'Zbyt wiele wiadomości wysłanych z tego adresu IP. Spróbuj ponownie za godzinę.'
  }
});

// ===== KONFIGURACJA EMAIL =====
// UWAGA: Uzupełnij poniższe dane o prawdziwe dane SMTP
const emailConfig = {
  host: 'smtp.gmail.com', // Zamień na swój serwer SMTP
  port: 587,
  secure: false,
  auth: {
    user: 'your-email@gmail.com', // TUTAJ WSTAW SWÓJ EMAIL
    pass: 'your-app-password' // TUTAJ WSTAW HASŁO APLIKACJI
  }
};

// Utwórz transporter do wysyłania email
const transporter = nodemailer.createTransporter(emailConfig);

// Test połączenia z serwerem email (opcjonalnie)
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Błąd konfiguracji email:', error);
  } else {
    console.log('✅ Serwer email gotowy do wysyłania wiadomości');
  }
});

// ===== FUNKCJE POMOCNICZE =====

// Walidacja danych formularza
function validateFormData(data) {
  const errors = [];

  // Sprawdź imię
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push('Imię musi mieć co najmniej 2 znaki');
  }

  // Sprawdź email
  if (!data.email || !validator.isEmail(data.email)) {
    errors.push('Podaj prawidłowy adres email');
  }

  // Sprawdź wiadomość
  if (!data.message || data.message.trim().length < 10) {
    errors.push('Wiadomość musi mieć co najmniej 10 znaków');
  }

  // Sprawdź zgodę na przetwarzanie danych
  if (!data.privacy) {
    errors.push('Musisz wyrazić zgodę na przetwarzanie danych osobowych');
  }

  return errors;
}

// Sanityzacja danych wejściowych
function sanitizeInput(input) {
  if (typeof input !== 'string') return '';
  return validator.escape(input.trim());
}

// Generowanie treści email
function generateEmailContent(data) {
  const safeData = {
    firstName: sanitizeInput(data.firstName),
    lastName: sanitizeInput(data.lastName || ''),
    email: validator.normalizeEmail(data.email),
    subject: sanitizeInput(data.subject || 'Wiadomość ze strony GreenSun'),
    message: sanitizeInput(data.message),
    marketing: data.marketing ? 'Tak' : 'Nie'
  };

  return {
    subject: `[GreenSun] ${safeData.subject}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #ceb37c; color: white; padding: 20px; text-align: center;">
          <h1>Nowa wiadomość ze strony GreenSun</h1>
        </div>
        
        <div style="padding: 20px; background: #f9f9f9;">
          <h2>Dane kontaktowe:</h2>
          <p><strong>Imię:</strong> ${safeData.firstName}</p>
          <p><strong>Nazwisko:</strong> ${safeData.lastName}</p>
          <p><strong>Email:</strong> ${safeData.email}</p>
          <p><strong>Temat:</strong> ${safeData.subject}</p>
          <p><strong>Zgoda marketing:</strong> ${safeData.marketing}</p>
          
          <h2>Treść wiadomości:</h2>
          <div style="background: white; padding: 15px; border-left: 4px solid #ceb37c;">
            ${safeData.message.replace(/\n/g, '<br>')}
          </div>
          
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">
            Wiadomość została wysłana: ${new Date().toLocaleString('pl-PL')}
          </p>
        </div>
      </div>
    `,
    text: `
      Nowa wiadomość ze strony GreenSun
      
      Dane kontaktowe:
      Imię: ${safeData.firstName}
      Nazwisko: ${safeData.lastName}
      Email: ${safeData.email}
      Temat: ${safeData.subject}
      Zgoda marketing: ${safeData.marketing}
      
      Treść wiadomości:
      ${safeData.message}
      
      Wysłano: ${new Date().toLocaleString('pl-PL')}
    `
  };
}

// ===== ENDPOINTS =====

// Endpoint do obsługi formularza kontaktowego
app.post('/contact', contactLimiter, async (req, res) => {
  try {
    console.log('📨 Otrzymano nową wiadomość kontaktową');

    // Walidacja danych
    const validationErrors = validateFormData(req.body);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        errors: validationErrors
      });
    }

    // Generowanie treści email
    const emailContent = generateEmailContent(req.body);

    // Konfiguracja wiadomości
    const mailOptions = {
      from: `"GreenSun Contact Form" <${emailConfig.auth.user}>`,
      to: 'contact@greensun.pl', // TUTAJ WSTAW DOCELOWY ADRES EMAIL
      replyTo: req.body.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    // Wysłanie wiadomości
    await transporter.sendMail(mailOptions);

    console.log('✅ Wiadomość została wysłana pomyślnie');

    // Opcjonalne: Wyślij potwierdzenie do nadawcy
    if (req.body.email) {
      const confirmationOptions = {
        from: `"GreenSun" <${emailConfig.auth.user}>`,
        to: req.body.email,
        subject: 'Potwierdzenie otrzymania wiadomości - GreenSun',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #ceb37c; color: white; padding: 20px; text-align: center;">
              <h1>GreenSun</h1>
            </div>
            
            <div style="padding: 20px;">
              <h2>Dziękujemy za kontakt!</h2>
              <p>Szanowny/a ${sanitizeInput(req.body.firstName)},</p>
              
              <p>Dziękujemy za wysłanie wiadomości przez naszą stronę internetową. 
              Otrzymaliśmy Twoją wiadomość i skontaktujemy się z Tobą w ciągu 24 godzin.</p>
              
              <p>Jeśli masz pilne pytania, możesz także skontaktować się z nami bezpośrednio:</p>
              <ul>
                <li>📧 Email: contact@greensun.pl</li>
                <li>📞 Telefon: +48 123 456 789</li>
              </ul>
              
              <p>Z poważaniem,<br>Zespół GreenSun</p>
            </div>
          </div>
        `
      };

      await transporter.sendMail(confirmationOptions);
      console.log('✅ Potwierdzenie wysłane do nadawcy');
    }

    res.json({
      success: true,
      message: 'Wiadomość została wysłana pomyślnie'
    });

  } catch (error) {
    console.error('❌ Błąd podczas wysyłania wiadomości:', error);

    res.status(500).json({
      success: false,
      message: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.'
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    service: 'GreenSun Contact Form API'
  });
});

// Serwowanie plików statycznych (opcjonalnie)
app.use(express.static(path.join(__dirname, '../')));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found'
  });
});

// Error handler
app.use((error, req, res, next) => {
  console.error('💥 Błąd serwera:', error);
  res.status(500).json({
    error: 'Wewnętrzny błąd serwera'
  });
});

// ===== START SERWERA =====
app.listen(PORT, () => {
  console.log(`🚀 Serwer GreenSun uruchomiony na porcie ${PORT}`);
  console.log(`📝 Formularz kontaktowy dostępny na: http://localhost:${PORT}/contact`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

module.exports = app;