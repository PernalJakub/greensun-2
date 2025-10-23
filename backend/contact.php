<?php
/**
 * ===== BACKEND PHP DLA FORMULARZA KONTAKTOWEGO =====
 * Autor: GreenSun Contact Form Handler
 * Opis: Prosty skrypt PHP do obsługi formularza kontaktowego
 */

// Włącz raportowanie błędów tylko w trybie development
// W produkcji ustaw error_reporting(0)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// ===== KONFIGURACJA =====
define('RECIPIENT_EMAIL', 'contact@greensun.pl'); // TUTAJ WSTAW DOCELOWY EMAIL
define('SENDER_EMAIL', 'noreply@greensun.pl');    // TUTAJ WSTAW EMAIL NADAWCY
define('SENDER_NAME', 'GreenSun Contact Form');
define('MAX_REQUESTS_PER_HOUR', 5);
define('RATE_LIMIT_FILE', 'rate_limit.json');

// ===== NAGŁÓWKI HTTP =====
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Obsługa preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Sprawdź metodę HTTP
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Metoda niedozwolona. Używaj POST.']);
    exit;
}

// ===== FUNKCJE POMOCNICZE =====

/**
 * Sprawdza rate limiting
 */
function checkRateLimit($ip) {
    $rateLimitFile = __DIR__ . '/' . RATE_LIMIT_FILE;
    $currentTime = time();
    $oneHourAgo = $currentTime - 3600;
    
    // Wczytaj istniejące dane
    $rateLimitData = [];
    if (file_exists($rateLimitFile)) {
        $rateLimitData = json_decode(file_get_contents($rateLimitFile), true) ?: [];
    }
    
    // Usuń stare wpisy
    $rateLimitData = array_filter($rateLimitData, function($timestamp) use ($oneHourAgo) {
        return $timestamp > $oneHourAgo;
    });
    
    // Sprawdź czy IP nie przekroczył limitu
    $ipRequests = array_filter($rateLimitData, function($timestamp, $requestIp) use ($ip) {
        return $requestIp === $ip;
    }, ARRAY_FILTER_USE_BOTH);
    
    if (count($ipRequests) >= MAX_REQUESTS_PER_HOUR) {
        return false;
    }
    
    // Dodaj nowy request
    $rateLimitData[$ip . '_' . $currentTime] = $currentTime;
    
    // Zapisz dane
    file_put_contents($rateLimitFile, json_encode($rateLimitData));
    
    return true;
}

/**
 * Waliduje dane formularza
 */
function validateFormData($data) {
    $errors = [];
    
    // Sprawdź imię
    if (empty($data['firstName']) || strlen(trim($data['firstName'])) < 2) {
        $errors[] = 'Imię musi mieć co najmniej 2 znaki';
    }
    
    // Sprawdź email
    if (empty($data['email']) || !filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Podaj prawidłowy adres email';
    }
    
    // Sprawdź wiadomość
    if (empty($data['message']) || strlen(trim($data['message'])) < 10) {
        $errors[] = 'Wiadomość musi mieć co najmniej 10 znaków';
    }
    
    // Sprawdź zgodę na przetwarzanie danych
    if (empty($data['privacy'])) {
        $errors[] = 'Musisz wyrazić zgodę na przetwarzanie danych osobowych';
    }
    
    return $errors;
}

/**
 * Czyści dane wejściowe
 */
function sanitizeInput($input) {
    return htmlspecialchars(trim($input), ENT_QUOTES, 'UTF-8');
}

/**
 * Generuje treść email
 */
function generateEmailContent($data) {
    $safeData = [
        'firstName' => sanitizeInput($data['firstName']),
        'lastName' => sanitizeInput($data['lastName'] ?? ''),
        'email' => filter_var($data['email'], FILTER_SANITIZE_EMAIL),
        'subject' => sanitizeInput($data['subject'] ?? 'Wiadomość ze strony GreenSun'),
        'message' => sanitizeInput($data['message']),
        'marketing' => !empty($data['marketing']) ? 'Tak' : 'Nie'
    ];
    
    $emailSubject = '[GreenSun] ' . $safeData['subject'];
    
    $emailBody = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='UTF-8'>
        <title>Nowa wiadomość GreenSun</title>
    </head>
    <body style='font-family: Arial, sans-serif; margin: 0; padding: 0;'>
        <div style='max-width: 600px; margin: 0 auto;'>
            <div style='background: #ceb37c; color: white; padding: 20px; text-align: center;'>
                <h1>Nowa wiadomość ze strony GreenSun</h1>
            </div>
            
            <div style='padding: 20px; background: #f9f9f9;'>
                <h2>Dane kontaktowe:</h2>
                <p><strong>Imię:</strong> {$safeData['firstName']}</p>
                <p><strong>Nazwisko:</strong> {$safeData['lastName']}</p>
                <p><strong>Email:</strong> {$safeData['email']}</p>
                <p><strong>Temat:</strong> {$safeData['subject']}</p>
                <p><strong>Zgoda marketing:</strong> {$safeData['marketing']}</p>
                
                <h2>Treść wiadomości:</h2>
                <div style='background: white; padding: 15px; border-left: 4px solid #ceb37c;'>
                    " . nl2br($safeData['message']) . "
                </div>
                
                <hr style='margin: 20px 0;'>
                <p style='font-size: 12px; color: #666;'>
                    Wiadomość została wysłana: " . date('Y-m-d H:i:s') . "
                </p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    return [
        'subject' => $emailSubject,
        'body' => $emailBody,
        'safe_data' => $safeData
    ];
}

/**
 * Wysyła email
 */
function sendEmail($to, $subject, $body, $replyTo = null) {
    $headers = [
        'MIME-Version: 1.0',
        'Content-type: text/html; charset=UTF-8',
        'From: ' . SENDER_NAME . ' <' . SENDER_EMAIL . '>',
        'X-Mailer: PHP/' . phpversion()
    ];
    
    if ($replyTo) {
        $headers[] = 'Reply-To: ' . $replyTo;
    }
    
    return mail($to, $subject, $body, implode("\r\n", $headers));
}

/**
 * Loguje aktywność
 */
function logActivity($message, $data = []) {
    $logFile = __DIR__ . '/contact_log.txt';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    $logEntry = "[$timestamp] [$ip] $message";
    
    if (!empty($data)) {
        $logEntry .= ' | ' . json_encode($data, JSON_UNESCAPED_UNICODE);
    }
    
    $logEntry .= PHP_EOL;
    
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// ===== GŁÓWNA LOGIKA =====

try {
    // Sprawdź rate limiting
    $clientIP = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    if (!checkRateLimit($clientIP)) {
        http_response_code(429);
        echo json_encode([
            'success' => false,
            'error' => 'Zbyt wiele wiadomości wysłanych z tego adresu IP. Spróbuj ponownie za godzinę.'
        ]);
        exit;
    }
    
    // Pobierz dane z formularza
    $postData = [];
    if (isset($_POST['firstName'])) {
        // Dane z formularza HTML
        $postData = $_POST;
    } else {
        // Dane z JSON
        $input = file_get_contents('php://input');
        $postData = json_decode($input, true);
        
        if (json_last_error() !== JSON_ERROR_NONE) {
            throw new Exception('Nieprawidłowe dane JSON');
        }
    }
    
    logActivity('Otrzymano nową wiadomość', ['email' => $postData['email'] ?? 'brak']);
    
    // Walidacja danych
    $validationErrors = validateFormData($postData);
    if (!empty($validationErrors)) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'errors' => $validationErrors
        ]);
        exit;
    }
    
    // Generuj treść email
    $emailContent = generateEmailContent($postData);
    
    // Wyślij email do właściciela strony
    $emailSent = sendEmail(
        RECIPIENT_EMAIL,
        $emailContent['subject'],
        $emailContent['body'],
        $postData['email']
    );
    
    if (!$emailSent) {
        throw new Exception('Nie udało się wysłać wiadomości email');
    }
    
    // Opcjonalnie: wyślij potwierdzenie do nadawcy
    if (!empty($postData['email'])) {
        $confirmationSubject = 'Potwierdzenie otrzymania wiadomości - GreenSun';
        $confirmationBody = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <title>Potwierdzenie - GreenSun</title>
        </head>
        <body style='font-family: Arial, sans-serif; margin: 0; padding: 0;'>
            <div style='max-width: 600px; margin: 0 auto;'>
                <div style='background: #ceb37c; color: white; padding: 20px; text-align: center;'>
                    <h1>GreenSun</h1>
                </div>
                
                <div style='padding: 20px;'>
                    <h2>Dziękujemy za kontakt!</h2>
                    <p>Szanowny/a {$emailContent['safe_data']['firstName']},</p>
                    
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
        </body>
        </html>
        ";
        
        sendEmail($postData['email'], $confirmationSubject, $confirmationBody);
        logActivity('Potwierdzenie wysłane', ['email' => $postData['email']]);
    }
    
    logActivity('Wiadomość wysłana pomyślnie', ['email' => $postData['email']]);
    
    // Zwróć sukces
    echo json_encode([
        'success' => true,
        'message' => 'Wiadomość została wysłana pomyślnie'
    ]);
    
} catch (Exception $e) {
    logActivity('Błąd: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Wystąpił błąd podczas wysyłania wiadomości. Spróbuj ponownie później.'
    ]);
}
?>