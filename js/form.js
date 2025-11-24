// ===== FORM MODULE =====
// Handles contact form submission with CSRF protection

function initContactForm() {
function initContactForm() {
  const form = document.getElementById('contactForm');
  
  // Initialize subject switcher
  const subjectSwitcher = document.querySelector('.subject-switcher');
  const currentSubjectBtn = subjectSwitcher.querySelector('.current-subject');
  const subjectDropdown = subjectSwitcher.querySelector('.subject-dropdown');
  const subjectText = subjectSwitcher.querySelector('.subject-text');
  const hiddenSubjectInput = document.getElementById('subject');
  
  // Toggle dropdown
  currentSubjectBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    subjectSwitcher.classList.toggle('active');
  });
  
  // Handle subject selection
  subjectDropdown.addEventListener('click', (e) => {
    const button = e.target.closest('button');
    if (!button) return;
    
    const value = button.getAttribute('data-value');
    const text = button.querySelector('span').textContent;
    
    // Update display text and hidden input value
    subjectText.textContent = text;
    hiddenSubjectInput.value = value;
    
    // Close dropdown
    subjectSwitcher.classList.remove('active');
  });
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    if (!subjectSwitcher.contains(e.target)) {
      subjectSwitcher.classList.remove('active');
    }
  });
  
  // Funkcja do pobierania CSRF tokenu
  async function getCsrfToken() {
    try {
      const response = await fetch('https://greensun-backend.fly.dev/csrf-token', {
        method: 'GET',
        credentials: 'include' // Ważne dla ciasteczek
      });
      if (response.ok) {
        const data = await response.json();
        return data.csrfToken;
      }
    } catch (error) {
      console.error('Błąd pobierania CSRF tokenu:', error);
    }
    return null;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;

    // Pokaż loading
    submitBtn.disabled = true;
    const lang = currentLanguage || 'pl';
    submitBtn.textContent = formMessages[lang].sending;

    try {
      // Pobierz CSRF token
      const csrfToken = await getCsrfToken();
      if (!csrfToken) {
        throw new Error(lang === 'pl' ? 'Nie można uzyskać tokenu bezpieczeństwa' :
                      lang === 'fr' ? 'Impossible d\'obtenir le jeton de sécurité' :
                      'Unable to obtain security token');
      }

      const formData = new FormData(form);
      const data = {
        firstName: formData.get('firstName') || '',
        lastName: formData.get('company') || '',
        email: formData.get('email') || '',
        subject: formData.get('subject') || 'Zapytanie ze strony',
        message: formData.get('message') || '',
        privacy: !!formData.get('privacy'),
        marketing: !!formData.get('marketing'),
        language: lang
      };

      const response = await fetch('https://greensun-backend.fly.dev/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken
        },
        credentials: 'include', // Ważne dla ciasteczek
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const result = await response.json();
        // Sukces
        submitBtn.textContent = formMessages[lang].sent;
        submitBtn.style.background = 'var(--success)';
        form.reset();

        // Pokaż komunikat sukcesu z API
        showNotification(result.message || formMessages[lang].successFallback, 'success');
      } else {
        const result = await response.json();
        // Check if we have validation errors
        if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
          // Show first error or join all errors
          throw new Error(result.errors.join('. '));
        } else {
          throw new Error(result.message || formMessages[lang].serverError);
        }
      }
    } catch (error) {
      console.error('Błąd wysyłania formularza:', error);
      submitBtn.textContent = formMessages[lang].error;
      submitBtn.style.background = 'var(--error)';
      showNotification(error.message || formMessages[lang].genericError, 'error');
    }
    
    // Przywróć przycisk po 3 sekundach
    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
      submitBtn.style.background = '';
    }, 3000);
  });
}

function showNotification(message, type = 'info') {
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translate(-50%, -120%);
    padding: 16px 24px;
    border-radius: 8px;
    color: white;
    font-size: 14px;
    font-weight: 500;
    z-index: 10000;
    max-width: 90%;
    width: auto;
    text-align: center;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transition: transform 0.3s ease;
    background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary-base)'};
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.transform = 'translate(-50%, 0)';
  }, 100);

  setTimeout(() => {
    notification.style.transform = 'translate(-50%, -120%)';
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 4000);
}

window.formModule = {
  initContactForm,
  showNotification
};
