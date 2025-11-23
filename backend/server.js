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
const PORT = process.env.PORT || 8080;

// ===== MIDDLEWARE =====
// Trust proxy - wymagane dla Fly.io (za reverse proxy)
app.set('trust proxy', 1);

app.use(helmet()); // Bezpieczeństwo
app.use(cors()); // CORS dla frontend
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting - maksymalnie 5 wiadomości na godzinę z jednego IP
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 godzina
  max: 5, // maksymalnie 5 requestów
  handler: (req, res) => {
    // Detect language from request
    const lang = req.body?.language || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'pl';
    const validLang = ['pl', 'en', 'fr'].includes(lang) ? lang : 'pl';

    const rateLimitMessages = {
      pl: 'Zbyt wiele wiadomości wysłanych z tego adresu IP. Spróbuj ponownie za godzinę.',
      en: 'Too many messages sent from this IP address. Please try again in an hour.',
      fr: 'Trop de messages envoyés depuis cette adresse IP. Veuillez réessayer dans une heure.'
    };

    res.status(429).json({
      success: false,
      message: rateLimitMessages[validLang]
    });
  },
  standardHeaders: true,
  legacyHeaders: false
});

// ===== KONFIGURACJA EMAIL =====
// Używa zmiennych środowiskowych z Fly.io secrets
const emailConfig = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || 'your-email@gmail.com',
    pass: process.env.SMTP_PASS || 'your-app-password'
  }
};

// Utwórz transporter do wysyłania email
const transporter = nodemailer.createTransport(emailConfig);

// Test połączenia z serwerem email (opcjonalnie)
transporter.verify((error, success) => {
  if (error) {
    console.log('❌ Błąd konfiguracji email:', error);
  } else {
    console.log('✅ Serwer email gotowy do wysyłania wiadomości');
  }
});

// ===== FUNKCJE POMOCNICZE =====

// Tłumaczenia komunikatów
const messages = {
  pl: {
    validation: {
      firstName: 'Imię musi mieć co najmniej 2 znaki',
      email: 'Podaj prawidłowy adres email',
      message: 'Wiadomość musi mieć co najmniej 10 znaków',
      privacy: 'Musisz wyrazić zgodę na przetwarzanie danych osobowych'
    },
    success: 'Wiadomość została wysłana pomyślnie',
    error: 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.',
    rateLimit: 'Zbyt wiele wiadomości wysłanych z tego adresu IP. Spróbuj ponownie za godzinę.',
    confirmation: {
      subject: 'Potwierdzenie otrzymania wiadomości - GreenSun',
      title: 'Dziękujemy za kontakt!',
      greeting: 'Szanowny/a',
      body: 'Dziękujemy za wysłanie wiadomości przez naszą stronę internetową. Otrzymaliśmy Twoją wiadomość i skontaktujemy się z Tobą w ciągu 24 godzin.',
      urgent: 'Jeśli masz pilne pytania, możesz także skontaktować się z nami bezpośrednio:',
      email: 'Email',
      phone: 'Telefon',
      regards: 'Z poważaniem,<br>Zespół GreenSun'
    }
  },
  en: {
    validation: {
      firstName: 'First name must be at least 2 characters',
      email: 'Please provide a valid email address',
      message: 'Message must be at least 10 characters',
      privacy: 'You must agree to the processing of personal data'
    },
    success: 'Message sent successfully',
    error: 'An error occurred while sending the message. Please try again later.',
    rateLimit: 'Too many messages sent from this IP address. Please try again in an hour.',
    confirmation: {
      subject: 'Message confirmation - GreenSun',
      title: 'Thank you for contacting us!',
      greeting: 'Dear',
      body: 'Thank you for sending a message through our website. We have received your message and will contact you within 24 hours.',
      urgent: 'If you have urgent questions, you can also contact us directly:',
      email: 'Email',
      phone: 'Phone',
      regards: 'Best regards,<br>GreenSun Team'
    }
  },
  fr: {
    validation: {
      firstName: 'Le prénom doit comporter au moins 2 caractères',
      email: 'Veuillez fournir une adresse e-mail valide',
      message: 'Le message doit comporter au moins 10 caractères',
      privacy: 'Vous devez accepter le traitement des données personnelles'
    },
    success: 'Message envoyé avec succès',
    error: 'Une erreur s\'est produite lors de l\'envoi du message. Veuillez réessayer plus tard.',
    rateLimit: 'Trop de messages envoyés depuis cette adresse IP. Veuillez réessayer dans une heure.',
    confirmation: {
      subject: 'Confirmation de réception du message - GreenSun',
      title: 'Merci de nous avoir contactés !',
      greeting: 'Cher/Chère',
      body: 'Merci d\'avoir envoyé un message via notre site Web. Nous avons reçu votre message et vous contacterons dans les 24 heures.',
      urgent: 'Si vous avez des questions urgentes, vous pouvez également nous contacter directement :',
      email: 'E-mail',
      phone: 'Téléphone',
      regards: 'Cordialement,<br>L\'équipe GreenSun'
    }
  }
};

// Pobierz język z requestu (domyślnie polski)
function getLanguage(req) {
  const lang = req.body.language || req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'pl';
  return ['pl', 'en', 'fr'].includes(lang) ? lang : 'pl';
}

// Walidacja danych formularza
function validateFormData(data, lang = 'pl') {
  const errors = [];
  const msg = messages[lang].validation;

  // Sprawdź imię
  if (!data.firstName || data.firstName.trim().length < 2) {
    errors.push(msg.firstName);
  }

  // Sprawdź email
  if (!data.email || !validator.isEmail(data.email)) {
    errors.push(msg.email);
  }

  // Sprawdź wiadomość
  if (!data.message || data.message.trim().length < 10) {
    errors.push(msg.message);
  }

  // Sprawdź zgodę na przetwarzanie danych
  if (!data.privacy) {
    errors.push(msg.privacy);
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
    console.log('📋 Dane z formularza:', JSON.stringify(req.body, null, 2));

    // Pobierz język
    const lang = getLanguage(req);

    // Walidacja danych
    const validationErrors = validateFormData(req.body, lang);
    if (validationErrors.length > 0) {
      console.log('❌ Błędy walidacji:', validationErrors);
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
      to: process.env.CONTACT_EMAIL || emailConfig.auth.user, // Domyślnie wysyła do tego samego adresu
      replyTo: req.body.email,
      subject: emailContent.subject,
      html: emailContent.html,
      text: emailContent.text
    };

    // Wysłanie wiadomości
    console.log('📧 Wysyłanie wiadomości do:', process.env.CONTACT_EMAIL || emailConfig.auth.user);
    const mainEmailResult = await transporter.sendMail(mailOptions);
    console.log('✅ Wiadomość główna wysłana. MessageId:', mainEmailResult.messageId);

    // Opcjonalne: Wyślij potwierdzenie do nadawcy
    if (req.body.email) {
      console.log('📧 Wysyłanie potwierdzenia do:', req.body.email);
      const conf = messages[lang].confirmation;
      const confirmationOptions = {
        from: `"GreenSun" <${emailConfig.auth.user}>`,
        to: req.body.email,
        subject: conf.subject,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #ceb37c; color: white; padding: 20px; text-align: center;">
              <h1>GreenSun</h1>
            </div>

            <div style="padding: 20px;">
              <h2>${conf.title}</h2>
              <p>${conf.greeting} ${sanitizeInput(req.body.firstName)},</p>

              <p>${conf.body}</p>

              <p>${conf.urgent}</p>
              <ul>
                <li>📧 ${conf.email}: contact@green-sun.net</li>
                <li>📞 ${conf.phone}: +33 749 78 48 56</li>
              </ul>

              <p>${conf.regards}</p>
            </div>
          </div>
        `
      };

      const confirmationResult = await transporter.sendMail(confirmationOptions);
      console.log('✅ Potwierdzenie wysłane. MessageId:', confirmationResult.messageId);
    }

    res.json({
      success: true,
      message: messages[lang].success
    });

  } catch (error) {
    console.error('❌ Błąd podczas wysyłania wiadomości:', error);

    const lang = getLanguage(req);
    res.status(500).json({
      success: false,
      message: messages[lang].error
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