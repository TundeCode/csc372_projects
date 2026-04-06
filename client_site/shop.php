<?php
// shop.php
// Date: April 2026
// Description: Displays AURUM products dynamically from the products table.

// AI-assisted suggestion: ChatGPT helped convert this file
// from hardcoded product objects to a PDO database query.

require_once 'db_connect.php';

$products = [];
$message = '';

try {
    $sql = 'SELECT id, name, price, original_price, image_url, alt_text, stock_status
            FROM products
            ORDER BY id ASC';

    $stmt = $pdo->query($sql);
    $products = $stmt->fetchAll();

    if (!$products) {
        $message = 'No products found.';
    }
} catch (PDOException $e) {
    $message = 'Could not load products.';
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shop - AURUM</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Space+Mono:wght@400;700&family=Righteous&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>

    <div class="scroll-banner">
        <div class="scroll-content">
            CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM -
        </div>
    </div>

    <nav class="nav">
        <a href="home.html" class="logo">AURUM</a>
        <ul class="nav-links">
            <li><a href="home.html">HOME</a></li>
            <li><a href="shop.php" class="active">SHOP</a></li>
            <li><a href="faqs.html">FAQS</a></li>
            <li><a href="hotline.php">HOTLINE</a></li>
            <li><a href="cart.html" class="cart-link">CART <span id="cart-count" class="cart-count">0</span></a></li>
        </ul>
    </nav>

    <h2 class="section-header">Shop</h2>

    <?php if ($message !== ''): ?>
        <p style="text-align: center; margin-bottom: 40px; color: var(--light-gray);">
            <?php echo htmlspecialchars($message, ENT_QUOTES, 'UTF-8'); ?>
        </p>
    <?php else: ?>
        <div class="product-grid">
            <?php foreach ($products as $product): ?>
                <div class="product-card">
                    <div class="product-image">
                        <img
                            src="<?php echo htmlspecialchars($product['image_url'], ENT_QUOTES, 'UTF-8'); ?>"
                            alt="<?php echo htmlspecialchars($product['alt_text'], ENT_QUOTES, 'UTF-8'); ?>"
                            style="width: 100%; height: 100%; object-fit: cover;"
                        >
                    </div>

                    <div class="product-info">
                        <div class="product-name">
                            <?php echo htmlspecialchars($product['name'], ENT_QUOTES, 'UTF-8'); ?>
                        </div>

                        <div class="product-price">
                            $<?php echo number_format((float)$product['price'], 2); ?>
                            <?php if ($product['original_price'] !== null): ?>
                                <span class="old-price">
                                    $<?php echo number_format((float)$product['original_price'], 2); ?>
                                </span>
                            <?php endif; ?>
                        </div>
                    </div>

                    <?php if ($product['stock_status'] === 'low_stock'): ?>
                        <div class="stock-badge">LOW STOCK</div>
                    <?php elseif ($product['stock_status'] === 'sold_out'): ?>
                        <div class="stock-badge">SOLD OUT</div>
                    <?php endif; ?>
                </div>
            <?php endforeach; ?>
        </div>
    <?php endif; ?>

    <div class="scroll-banner" style="border-top: 3px solid var(--black); border-bottom: none;">
        <div class="scroll-content" style="animation-direction: reverse;">
            CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM -
        </div>
    </div>

</body>
</html>