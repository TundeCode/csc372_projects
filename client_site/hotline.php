<?php
// hotline.php
// Author: [Your Name]
// Date: March 2026
// Description: AURUM Hotline contact form page. Collects visitor name, order number,
//              and inquiry type. Validates all inputs server-side. Uses cookies to
//              remember the visitor's name and sessions to track visit count and last
//              inquiry type across page loads.

// ============================================================
// PART III — SESSIONS
// Must be called before any output.
// session_start() creates or resumes the session linked via PHPSESSID cookie.
// ============================================================
session_start();

// ============================================================
// PART II — INCLUDE VALIDATION FUNCTIONS
// ============================================================
require_once 'validate.php';

// ============================================================
// PART III — COOKIES: read saved name from browser cookie
// Validate and escape before use to prevent XSS.
// ============================================================
$cookieName = '';
if (isset($_COOKIE['aurum_visitor_name'])) {
    $raw = $_COOKIE['aurum_visitor_name'];
    // Validate: must be non-empty text up to 60 chars
    if (validateText($raw, 1, 60)) {
        $cookieName = htmlspecialchars(trim($raw), ENT_QUOTES, 'UTF-8');
    }
}

// ============================================================
// PART III — SESSION: track visit count and last inquiry
// ============================================================
if (!isset($_SESSION['visit_count'])) {
    $_SESSION['visit_count'] = 0;
}
$_SESSION['visit_count']++;

// ============================================================
// PART II — FORM INITIAL VALUES & ERROR ARRAYS
// ============================================================
$allowed_inquiry_types = ['sizing', 'shipping', 'order', 'other'];

// Initial values — pre-fill with cookie name if available
$values = [
    'name'         => $cookieName,
    'order_number' => '',
    'inquiry_type' => '',
];

// Error messages — blank by default
$errors = [
    'name'         => '',
    'order_number' => '',
    'inquiry_type' => '',
];

// Top-of-page success/error banner message
$formMessage = '';

// ============================================================
// PART II — PROCESS FORM SUBMISSION (POST)
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    // Step 1: Overwrite initial values with submitted data
    // Use null-coalescing for the select/options field
    $values['name']         = $_POST['name']         ?? '';
    $values['order_number'] = $_POST['order_number'] ?? '';
    $values['inquiry_type'] = $_POST['inquiry_type'] ?? '';  // options: use ?? ''

    // Step 2: Validate each input using the include-file functions

    // Validate name: 1–60 characters
    if (!validateText($values['name'], 1, 60)) {
        $errors['name'] = 'Name is required and must be between 1 and 60 characters.';
    }

    // Validate order number: numeric, 1000–9999999 (a plausible order number range)
    // Order number is optional — only validate if the visitor provides one
    if ($values['order_number'] !== '' && !validateNumber($values['order_number'], 1000, 9999999)) {
        $errors['order_number'] = 'Order number must be a number between 1000 and 9999999.';
    }

    // Validate inquiry type: must be one of the allowed options
    if (!validateOption($values['inquiry_type'], $allowed_inquiry_types)) {
        $errors['inquiry_type'] = 'Please select a valid inquiry type.';
    }

    // Step 3: Combine all errors to determine if form is valid
    $allErrors = implode('', $errors);

    if ($allErrors === '') {
        // ---- FORM IS VALID ----

        // PART III — COOKIES: save the visitor's name for 30 days
        // setcookie(name, value, expiry_timestamp, path)
        setcookie('aurum_visitor_name', trim($values['name']), time() + (86400 * 30), '/');

        // PART III — SESSION: store last inquiry type on the server
        $_SESSION['last_inquiry'] = $values['inquiry_type'];

        $formMessage = 'success';

        // Reset form fields after successful submission
        $values = [
            'name'         => htmlspecialchars(trim($values['name']), ENT_QUOTES, 'UTF-8'),
            'order_number' => '',
            'inquiry_type' => '',
        ];

    } else {
        // ---- FORM HAS ERRORS ----
        $formMessage = 'error';

        // Step 4: Escape text/number inputs before re-displaying (XSS prevention)
        $values['name']         = htmlspecialchars($values['name'],         ENT_QUOTES, 'UTF-8');
        $values['order_number'] = htmlspecialchars($values['order_number'], ENT_QUOTES, 'UTF-8');
        // inquiry_type is a select — validated against allowed list, no htmlspecialchars needed
        // but we escape for safety anyway
        $values['inquiry_type'] = htmlspecialchars($values['inquiry_type'], ENT_QUOTES, 'UTF-8');
    }

} else {
    // GET request — just escape the cookie-prefilled name for display
    $values['name'] = htmlspecialchars($values['name'], ENT_QUOTES, 'UTF-8');
}

// ============================================================
// PART III — SESSION: provide session termination
// If ?end_session=1 is in the URL, destroy the session.
// ============================================================
if (isset($_GET['end_session'])) {
    // Unset all session variables
    $_SESSION = [];
    // Delete the PHPSESSID cookie from the browser
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']
        );
    }
    // Destroy the session on the server
    session_destroy();
    // Redirect to avoid re-destruction on refresh
    header('Location: hotline.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotline - AURUM</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Righteous&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">

  

    <!-- Top Scrolling Banner -->
    <div class="scroll-banner">
        <div class="scroll-content">
            CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM -
        </div>
    </div>

    <!-- Navigation -->
    <header>
        <nav class="nav">
            <a href="home.html" class="logo">AURUM</a>
            <ul class="nav-links">
                <li><a href="home.html">HOME</a></li>
                <li><a href="shop.php">SHOP</a></li>
                <li><a href="faqs.html">FAQS</a></li>
                <li><a href="hotline.php" class="active">HOTLINE</a></li>
                <li><a href="cart.html" class="cart-link">CART</a></li>
            </ul>
        </nav>
    </header>

    <main class="contact-section">
        <h1 class="section-header">HOTLINE</h1>

        <p style="text-align: center; font-size: 18px; margin-bottom: 40px;">
            OPERATORS ARE STANDING BY.
        </p>

        <!-- ================================================================
             PART III — DISPLAY COOKIE & SESSION DATA
             Shows returning visitor name (cookie), visit count, and last
             inquiry type (session). Data is validated & escaped before output.
        ================================================================ -->
        <div class="visitor-info">
            <strong>VISITOR INFO</strong><br>

            <!-- Cookie: saved name -->
            Returning as:
            <?php if ($cookieName !== ''): ?>
                <strong><?php echo $cookieName; ?></strong>
                &nbsp;(saved from your last visit)
            <?php else: ?>
                <em>unknown — submit the form to be remembered</em>
            <?php endif; ?>
            <br>

            <!-- Session: visit count for this session -->
            Pages viewed this session:
            <strong>
                <?php
                    // $_SESSION['visit_count'] is set server-side — safe to cast to int and echo
                    echo (int) ($_SESSION['visit_count'] ?? 1);
                ?>
            </strong>
            <br>

            <!-- Session: last inquiry type -->
            Last inquiry type:
            <strong>
                <?php
                    if (!empty($_SESSION['last_inquiry'])) {
                        // Escape session data before display
                        echo htmlspecialchars($_SESSION['last_inquiry'], ENT_QUOTES, 'UTF-8');
                    } else {
                        echo 'none yet';
                    }
                ?>
            </strong>
            <br><br>

            <!-- Terminate session link -->
            <a href="hotline.php?end_session=1">END SESSION &amp; CLEAR DATA</a>
        </div>

        <!-- ================================================================
             PART II — FORM BANNER MESSAGE
             Displayed after submission: success or error summary.
        ================================================================ -->
        <?php if ($formMessage === 'success'): ?>
            <div class="form-banner success">
                MESSAGE RECEIVED. WE'LL BE IN TOUCH.
            </div>
        <?php elseif ($formMessage === 'error'): ?>
            <div class="form-banner error">
                PLEASE CORRECT THE ERRORS BELOW AND RESUBMIT.
            </div>
        <?php endif; ?>

        <!-- ================================================================
             PART II — HTML FORM
             action: posts to this same PHP file (self-processing).
             method: POST — sends data in request body, not query string.
        ================================================================ -->
        <div class="hotline-form-wrapper">
            <form action="hotline.php" method="POST" novalidate>

                <!-- Text Input: Name -->
                <div class="form-group">
                    <label for="name">YOUR NAME *</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        maxlength="60"
                        placeholder="e.g. Alex"
                        value="<?php echo $values['name']; ?>"
                        class="<?php echo $errors['name'] !== '' ? 'has-error' : ''; ?>"
                    >
                    <?php if ($errors['name'] !== ''): ?>
                        <p class="field-error"><?php echo htmlspecialchars($errors['name'], ENT_QUOTES, 'UTF-8'); ?></p>
                    <?php endif; ?>
                </div>

                <!-- Number Input: Order Number (optional) -->
                <div class="form-group">
                    <label for="order_number">ORDER NUMBER (optional)</label>
                    <input
                        type="number"
                        id="order_number"
                        name="order_number"
                        min="1000"
                        max="9999999"
                        placeholder="e.g. 12345"
                        value="<?php echo $values['order_number']; ?>"
                        class="<?php echo $errors['order_number'] !== '' ? 'has-error' : ''; ?>"
                    >
                    <?php if ($errors['order_number'] !== ''): ?>
                        <p class="field-error"><?php echo htmlspecialchars($errors['order_number'], ENT_QUOTES, 'UTF-8'); ?></p>
                    <?php endif; ?>
                </div>

                <!-- Select / Options: Inquiry Type -->
                <div class="form-group">
                    <label for="inquiry_type">WHAT'S YOUR INQUIRY ABOUT? *</label>
                    <select
                        id="inquiry_type"
                        name="inquiry_type"
                        class="<?php echo $errors['inquiry_type'] !== '' ? 'has-error' : ''; ?>"
                    >
                        <option value="" <?php echo $values['inquiry_type'] === '' ? 'selected' : ''; ?>>— SELECT ONE —</option>
                        <option value="sizing"   <?php echo $values['inquiry_type'] === 'sizing'   ? 'selected' : ''; ?>>SIZING</option>
                        <option value="shipping" <?php echo $values['inquiry_type'] === 'shipping' ? 'selected' : ''; ?>>SHIPPING</option>
                        <option value="order"    <?php echo $values['inquiry_type'] === 'order'    ? 'selected' : ''; ?>>ORDER ISSUE</option>
                        <option value="other"    <?php echo $values['inquiry_type'] === 'other'    ? 'selected' : ''; ?>>OTHER</option>
                    </select>
                    <?php if ($errors['inquiry_type'] !== ''): ?>
                        <p class="field-error"><?php echo htmlspecialchars($errors['inquiry_type'], ENT_QUOTES, 'UTF-8'); ?></p>
                    <?php endif; ?>
                </div>

                <!-- Submit -->
                <button type="submit" class="btn-submit">SEND IT</button>

            </form>
        </div>

        <p style="text-align:center; margin-bottom:20px;">
            DM us on Instagram:
            <a href="https://instagram.com/aurum79.us" target="_blank">@aurum79.us</a>
        </p>

        <p style="margin-top: 40px; font-weight: 700; letter-spacing: 2px; text-align:center;">
            THE LINE IS OPEN.
        </p>
    </main>

    <!-- Bottom Scrolling Banner -->
    <div class="scroll-banner" style="border-top: 3px solid var(--black); border-bottom: none;">
        <div class="scroll-content" style="animation-direction: reverse;">
            CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM -
        </div>
    </div>

</body>
</html>