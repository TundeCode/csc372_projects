<?php
// hotline.php
// Author: [Your Name]
// Date: April 2026
// Description: AURUM Hotline contact form. Validates inputs, saves
//              submissions to the inquiries table (INSERT), and
//              provides a simple admin panel to update or delete
//              existing inquiries (UPDATE, DELETE). Uses cookies to
//              remember the visitor's name and sessions to track
//              visit count and last inquiry type.

// ============================================================
// SESSIONS — must be called before any output
// ============================================================
session_start();

// ============================================================
// INCLUDES
// ============================================================
require_once 'validate.php';
require_once 'db_connect.php';   // Part III — PDO connection

// ============================================================
// COOKIES — read saved name from browser
// ============================================================
$cookieName = '';
if (isset($_COOKIE['aurum_visitor_name'])) {
    $raw = $_COOKIE['aurum_visitor_name'];
    if (validateText($raw, 1, 60)) {
        $cookieName = htmlspecialchars(trim($raw), ENT_QUOTES, 'UTF-8');
    }
}

// ============================================================
// SESSION — track visit count and last inquiry type
// ============================================================
if (!isset($_SESSION['visit_count'])) {
    $_SESSION['visit_count'] = 0;
}
$_SESSION['visit_count']++;

// ============================================================
// SESSION TERMINATION — ?end_session=1 destroys the session
// ============================================================
if (isset($_GET['end_session'])) {
    $_SESSION = [];
    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000,
            $params['path'], $params['domain'],
            $params['secure'], $params['httponly']);
    }
    session_destroy();
    header('Location: hotline.php');
    exit;
}

// ============================================================
// ALLOWED VALUES
// ============================================================
$allowed_inquiry_types = ['sizing', 'shipping', 'order', 'other'];

// ============================================================
// FORM INITIAL VALUES & ERRORS
// ============================================================
$values = [
    'name'         => $cookieName,
    'order_number' => '',
    'inquiry_type' => '',
];
$errors = [
    'name'         => '',
    'order_number' => '',
    'inquiry_type' => '',
];
$formMessage  = '';   // 'success' | 'error' | ''
$adminMessage = '';   // feedback after UPDATE or DELETE

// ============================================================
// PART III — HANDLE UPDATE (POST with action=update)
// Allows admin to change the inquiry_type of an existing row.
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'update') {
    $updateId   = $_POST['inquiry_id']   ?? '';
    $updateType = $_POST['inquiry_type'] ?? '';

    // Validate
    $idValid   = filter_var($updateId,   FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);
    $typeValid = validateOption($updateType, $allowed_inquiry_types);

    if ($idValid && $typeValid) {
        try {
            // Prepared statement — UPDATE operation
            $stmt = $pdo->prepare(
                'UPDATE inquiries SET inquiry_type = :type WHERE id = :id'
            );
            $stmt->execute([':type' => $updateType, ':id' => (int) $updateId]);
            $adminMessage = $stmt->rowCount() > 0
                ? 'Inquiry #' . (int) $updateId . ' updated successfully.'
                : 'No inquiry found with that ID.';
        } catch (PDOException $e) {
            $adminMessage = 'Database error during update.';
        }
    } else {
        $adminMessage = 'Invalid update data. ID must be a positive integer and type must be valid.';
    }
}

// ============================================================
// PART III — HANDLE DELETE (POST with action=delete)
// Removes an inquiry row by primary key.
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === 'delete') {
    $deleteId = $_POST['inquiry_id'] ?? '';

    // Validate
    $idValid = filter_var($deleteId, FILTER_VALIDATE_INT, ['options' => ['min_range' => 1]]);

    if ($idValid) {
        try {
            // Prepared statement — DELETE operation
            $stmt = $pdo->prepare('DELETE FROM inquiries WHERE id = :id');
            $stmt->execute([':id' => (int) $deleteId]);
            $adminMessage = $stmt->rowCount() > 0
                ? 'Inquiry #' . (int) $deleteId . ' deleted.'
                : 'No inquiry found with that ID.';
        } catch (PDOException $e) {
            $adminMessage = 'Database error during delete.';
        }
    } else {
        $adminMessage = 'Invalid ID for delete.';
    }
}

// ============================================================
// PART III — HANDLE CONTACT FORM SUBMISSION (INSERT)
// ============================================================
if ($_SERVER['REQUEST_METHOD'] === 'POST' && ($_POST['action'] ?? '') === '') {

    // Overwrite initial values with submitted data
    $values['name']         = $_POST['name']         ?? '';
    $values['order_number'] = $_POST['order_number'] ?? '';
    $values['inquiry_type'] = $_POST['inquiry_type'] ?? '';

    // Validate name
    if (!validateText($values['name'], 1, 60)) {
        $errors['name'] = 'Name is required and must be between 1 and 60 characters.';
    }

    // Validate order number (optional)
    if ($values['order_number'] !== '' && !validateNumber($values['order_number'], 1000, 9999999)) {
        $errors['order_number'] = 'Order number must be a number between 1000 and 9999999.';
    }

    // Validate inquiry type
    if (!validateOption($values['inquiry_type'], $allowed_inquiry_types)) {
        $errors['inquiry_type'] = 'Please select a valid inquiry type.';
    }

    $allErrors = implode('', $errors);

    if ($allErrors === '') {
        // ---- VALID — INSERT into inquiries table ----
        try {
            $orderNum = ($values['order_number'] !== '') ? (int) $values['order_number'] : null;

            // Prepared statement — INSERT operation
            $stmt = $pdo->prepare(
                'INSERT INTO inquiries (visitor_name, order_number, inquiry_type)
                 VALUES (:name, :order_number, :inquiry_type)'
            );
            $stmt->execute([
                ':name'         => trim($values['name']),
                ':order_number' => $orderNum,
                ':inquiry_type' => $values['inquiry_type'],
            ]);

            // Save name cookie for 30 days
            setcookie('aurum_visitor_name', trim($values['name']), time() + (86400 * 30), '/');

            // Save last inquiry type in session
            $_SESSION['last_inquiry'] = $values['inquiry_type'];

            $formMessage = 'success';

            // Reset form fields
            $values = [
                'name'         => htmlspecialchars(trim($values['name']), ENT_QUOTES, 'UTF-8'),
                'order_number' => '',
                'inquiry_type' => '',
            ];

        } catch (PDOException $e) {
            $formMessage = 'error';
            $errors['name'] = 'Could not save your inquiry. Please try again.';
        }

    } else {
        $formMessage = 'error';
        // Escape text inputs before re-displaying
        $values['name']         = htmlspecialchars($values['name'],         ENT_QUOTES, 'UTF-8');
        $values['order_number'] = htmlspecialchars($values['order_number'], ENT_QUOTES, 'UTF-8');
        $values['inquiry_type'] = htmlspecialchars($values['inquiry_type'], ENT_QUOTES, 'UTF-8');
    }

} else {
    // GET request — escape cookie-prefilled name
    $values['name'] = htmlspecialchars($values['name'], ENT_QUOTES, 'UTF-8');
}

// ============================================================
// PART III — RETRIEVE ALL INQUIRIES to display in admin panel
// SQL query: fetches all rows from inquiries table
// ============================================================
$inquiries = [];
$inquiryError = '';

try {
    $stmt = $pdo->query(
        'SELECT id, visitor_name, order_number, inquiry_type, submitted_at
         FROM inquiries
         ORDER BY submitted_at DESC'
    );
    $inquiries = $stmt->fetchAll();

    if (empty($inquiries)) {
        $inquiryError = 'No inquiries found yet.';
    }
} catch (PDOException $e) {
    $inquiryError = 'Could not load inquiries.';
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
    <style>
        /* Admin table styles */
        .admin-section {
            max-width: 1100px;
            margin: 60px auto;
            padding: 0 40px 80px;
        }
        .admin-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
            letter-spacing: 1px;
        }
        .admin-table th {
            background: var(--gold);
            color: var(--black);
            padding: 12px 16px;
            text-align: left;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 16px;
            letter-spacing: 2px;
        }
        .admin-table td {
            padding: 12px 16px;
            border-bottom: 1px solid #333;
            color: var(--light-gray);
            vertical-align: middle;
        }
        .admin-table tr:hover td { background: #1a1a1a; }
        .admin-select {
            background: var(--black);
            color: var(--off-white);
            border: 1px solid #444;
            padding: 6px;
            font-family: 'Space Mono', monospace;
            font-size: 12px;
        }
        .btn-update, .btn-delete {
            padding: 7px 14px;
            border: none;
            cursor: pointer;
            font-family: 'Bebas Neue', sans-serif;
            font-size: 14px;
            letter-spacing: 1px;
            margin-left: 6px;
        }
        .btn-update { background: var(--gold); color: var(--black); }
        .btn-delete { background: #ff4444; color: white; }
        .admin-msg {
            text-align: center;
            color: var(--gold);
            letter-spacing: 2px;
            margin-bottom: 20px;
            font-size: 14px;
        }
        /* Hotline form wrapper */
        .hotline-form-wrapper {
            max-width: 600px;
            margin: 0 auto 60px;
        }
        .form-group { margin-bottom: 24px; }
        .form-group label {
            display: block;
            font-size: 12px;
            letter-spacing: 2px;
            margin-bottom: 8px;
            color: var(--off-white);
        }
        .form-group input,
        .form-group select {
            width: 100%;
            padding: 14px;
            background: #111;
            border: 2px solid #333;
            color: var(--off-white);
            font-family: 'Space Mono', monospace;
            font-size: 14px;
            transition: border-color 0.3s;
        }
        .form-group input:focus,
        .form-group select:focus { outline: none; border-color: var(--gold); }
        .form-group input.has-error,
        .form-group select.has-error { border-color: #ff4444; }
        .field-error { color: #ff4444; font-size: 12px; margin-top: 6px; letter-spacing: 1px; }
        .btn-submit {
            width: 100%;
            padding: 18px;
            background: var(--gold);
            border: none;
            color: var(--black);
            font-family: 'Bebas Neue', sans-serif;
            font-size: 20px;
            letter-spacing: 3px;
            cursor: pointer;
            transition: background 0.3s;
        }
        .btn-submit:hover { background: var(--dark-gold); }
        .form-banner {
            text-align: center;
            padding: 16px;
            margin: 0 auto 30px;
            max-width: 600px;
            font-size: 13px;
            letter-spacing: 2px;
            font-weight: 700;
        }
        .form-banner.success { background: #1a3a1a; color: #4caf50; border: 1px solid #4caf50; }
        .form-banner.error   { background: #3a1a1a; color: #ff4444; border: 1px solid #ff4444; }
        .visitor-info {
            max-width: 600px;
            margin: 0 auto 40px;
            padding: 20px;
            background: #111;
            border: 1px solid #333;
            font-size: 13px;
            color: var(--light-gray);
            line-height: 2;
        }
        .visitor-info a { color: var(--gold); font-size: 12px; letter-spacing: 1px; }
    </style>
</head>
<body>

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

        <p style="text-align:center; font-size:18px; margin-bottom:40px;">
            OPERATORS ARE STANDING BY.
        </p>

        <!-- ================================================================
             COOKIE & SESSION INFO
        ================================================================ -->
        <div class="visitor-info">
            <strong>VISITOR INFO</strong><br>
            Returning as:
            <?php if ($cookieName !== ''): ?>
                <strong><?php echo $cookieName; ?></strong> &nbsp;(saved from your last visit)
            <?php else: ?>
                <em>unknown — submit the form to be remembered</em>
            <?php endif; ?>
            <br>
            Pages viewed this session: <strong><?php echo (int) ($_SESSION['visit_count'] ?? 1); ?></strong><br>
            Last inquiry type: <strong>
                <?php echo !empty($_SESSION['last_inquiry'])
                    ? htmlspecialchars($_SESSION['last_inquiry'], ENT_QUOTES, 'UTF-8')
                    : 'none yet'; ?>
            </strong><br><br>
            <a href="hotline.php?end_session=1">END SESSION &amp; CLEAR DATA</a>
        </div>

        <!-- ================================================================
             FORM BANNER
        ================================================================ -->
        <?php if ($formMessage === 'success'): ?>
            <div class="form-banner success">MESSAGE RECEIVED. WE'LL BE IN TOUCH.</div>
        <?php elseif ($formMessage === 'error'): ?>
            <div class="form-banner error">PLEASE CORRECT THE ERRORS BELOW AND RESUBMIT.</div>
        <?php endif; ?>

        <!-- ================================================================
             CONTACT FORM (INSERT)
        ================================================================ -->
        <div class="hotline-form-wrapper">
            <form action="hotline.php" method="POST" novalidate>
                <!-- Hidden action field — empty means "contact form" (not update/delete) -->
                <input type="hidden" name="action" value="">

                <!-- Name -->
                <div class="form-group">
                    <label for="name">YOUR NAME *</label>
                    <input type="text" id="name" name="name" maxlength="60"
                           placeholder="e.g. Alex"
                           value="<?php echo $values['name']; ?>"
                           class="<?php echo $errors['name'] !== '' ? 'has-error' : ''; ?>">
                    <?php if ($errors['name'] !== ''): ?>
                        <p class="field-error"><?php echo htmlspecialchars($errors['name'], ENT_QUOTES, 'UTF-8'); ?></p>
                    <?php endif; ?>
                </div>

                <!-- Order Number (optional) -->
                <div class="form-group">
                    <label for="order_number">ORDER NUMBER (optional)</label>
                    <input type="number" id="order_number" name="order_number"
                           min="1000" max="9999999" placeholder="e.g. 12345"
                           value="<?php echo $values['order_number']; ?>"
                           class="<?php echo $errors['order_number'] !== '' ? 'has-error' : ''; ?>">
                    <?php if ($errors['order_number'] !== ''): ?>
                        <p class="field-error"><?php echo htmlspecialchars($errors['order_number'], ENT_QUOTES, 'UTF-8'); ?></p>
                    <?php endif; ?>
                </div>

                <!-- Inquiry Type -->
                <div class="form-group">
                    <label for="inquiry_type">WHAT'S YOUR INQUIRY ABOUT? *</label>
                    <select id="inquiry_type" name="inquiry_type"
                            class="<?php echo $errors['inquiry_type'] !== '' ? 'has-error' : ''; ?>">
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

                <button type="submit" class="btn-submit">SEND IT</button>
            </form>
        </div>

        <p style="text-align:center; margin-bottom:20px;">
            DM us on Instagram:
            <a href="https://instagram.com/aurum79.us" target="_blank">@aurum79.us</a>
        </p>
        <p style="margin-top:40px; font-weight:700; letter-spacing:2px; text-align:center;">
            THE LINE IS OPEN.
        </p>
    </main>

    <!-- ================================================================
         PART III — ADMIN PANEL: VIEW / UPDATE / DELETE INQUIRIES
         Displays all rows from the inquiries table.
         Each row has an UPDATE form (change inquiry type) and
         a DELETE button (remove the row entirely).
    ================================================================ -->
    <section class="admin-section">
        <h2 class="section-header" style="margin-top:0;">INQUIRY LOG</h2>

        <?php if ($adminMessage !== ''): ?>
            <p class="admin-msg"><?php echo htmlspecialchars($adminMessage, ENT_QUOTES, 'UTF-8'); ?></p>
        <?php endif; ?>

        <?php if ($inquiryError !== ''): ?>
            <p style="text-align:center; color:#ff4444; letter-spacing:2px;">
                <?php echo htmlspecialchars($inquiryError, ENT_QUOTES, 'UTF-8'); ?>
            </p>
        <?php else: ?>
        <table class="admin-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>NAME</th>
                    <th>ORDER #</th>
                    <th>TYPE</th>
                    <th>SUBMITTED</th>
                    <th>ACTIONS</th>
                </tr>
            </thead>
            <tbody>
            <?php foreach ($inquiries as $row): ?>
                <tr>
                    <td><?php echo (int) $row['id']; ?></td>
                    <td><?php echo htmlspecialchars($row['visitor_name'], ENT_QUOTES, 'UTF-8'); ?></td>
                    <td><?php echo $row['order_number'] !== null ? (int) $row['order_number'] : '—'; ?></td>
                    <td><?php echo htmlspecialchars($row['inquiry_type'], ENT_QUOTES, 'UTF-8'); ?></td>
                    <td><?php echo htmlspecialchars($row['submitted_at'], ENT_QUOTES, 'UTF-8'); ?></td>
                    <td>
                        <!-- UPDATE FORM -->
                        <form action="hotline.php" method="POST" style="display:inline;">
                            <input type="hidden" name="action"     value="update">
                            <input type="hidden" name="inquiry_id" value="<?php echo (int) $row['id']; ?>">
                            <select name="inquiry_type" class="admin-select">
                                <?php foreach ($allowed_inquiry_types as $type): ?>
                                    <option value="<?php echo $type; ?>"
                                        <?php echo $row['inquiry_type'] === $type ? 'selected' : ''; ?>>
                                        <?php echo strtoupper($type); ?>
                                    </option>
                                <?php endforeach; ?>
                            </select>
                            <button type="submit" class="btn-update">UPDATE</button>
                        </form>

                        <!-- DELETE FORM -->
                        <form action="hotline.php" method="POST" style="display:inline;"
                              onsubmit="return confirm('Delete inquiry #<?php echo (int) $row['id']; ?>?');">
                            <input type="hidden" name="action"     value="delete">
                            <input type="hidden" name="inquiry_id" value="<?php echo (int) $row['id']; ?>">
                            <button type="submit" class="btn-delete">DELETE</button>
                        </form>
                    </td>
                </tr>
            <?php endforeach; ?>
            </tbody>
        </table>
        <?php endif; ?>
    </section>

    <!-- Bottom Scrolling Banner -->
    <div class="scroll-banner" style="border-top: 3px solid var(--black); border-bottom: none;">
        <div class="scroll-content" style="animation-direction: reverse;">
            CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM -
        </div>
    </div>

</body>
</html>