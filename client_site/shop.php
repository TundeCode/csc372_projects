<?php
// ============================================================
// CLASS DEFINITION
// ============================================================
class Product {
    public string $name;
    public float $price;
    public string $imageUrl;
    public string $altText;
    protected ?float $originalPrice;
    protected string $stockStatus; // 'in_stock' | 'low_stock' | 'sold_out'

    public function __construct(
        string $name,
        float $price,
        string $imageUrl,
        string $altText,
        ?float $originalPrice = null,
        string $stockStatus = 'in_stock'
    ) {
        $this->name          = $name;
        $this->price         = $price;
        $this->imageUrl      = $imageUrl;
        $this->altText       = $altText;
        $this->originalPrice = $originalPrice;
        $this->stockStatus   = $stockStatus;
    }

    // Getter for originalPrice (protected property)
    public function getOriginalPrice(): ?float {
        return $this->originalPrice;
    }

    // Getter for stockStatus (protected property)
    public function getStockStatus(): string {
        return $this->stockStatus;
    }

    // Setter for stockStatus
    public function setStockStatus(string $status): void {
        $this->stockStatus = $status;
    }

    // Returns a formatted price string, showing strike-through original if on sale
    public function formatPrice(): string {
        $formatted = '$' . number_format($this->price, 0);
        if ($this->originalPrice !== null) {
            $formatted .= ' <span class="old-price">$' . number_format($this->originalPrice, 0) . '</span>';
        }
        return $formatted;
    }

    // Returns the stock badge HTML, or empty string if in stock
    public function getStockBadge(): string {
        return match ($this->stockStatus) {
            'low_stock'  => '<div class="stock-badge">LOW STOCK</div>',
            'sold_out'   => '<div class="stock-badge sold-out">SOLD OUT</div>',
            default      => '',
        };
    }
}

// ============================================================
// CREATE PRODUCT OBJECTS
// ============================================================
$products = [
    new Product(
        '1800 tee - black',
        35,
        'https://via.placeholder.com/400x400/1a1a1a/FFD700?text=1800+BLACK+TEE',
        '1800 tee - black'
    ),
    new Product(
        '1800 tee - white',
        35,
        'https://via.placeholder.com/400x400/1a1a1a/FFD700?text=1800+WHITE+TEE',
        '1800 tee - white'
    ),
    new Product(
        '1800 baby tee',
        35,
        'https://via.placeholder.com/400x400/1a1a1a/FFD700?text=1800+BABY+TEE',
        '1800 baby tee'
    ),
    new Product(
        'suneater tee - black',
        35,
        'https://via.placeholder.com/400x400/1a1a1a/FFD700?text=SUNEATER+BLACK',
        'suneater tee - black'
    ),
    new Product(
        'AURUM BEANIE',
        15,
        'https://via.placeholder.com/400x400/1a1a1a/FFD700?text=AURUM+BEANIE',
        'AURUM BEANIE',
        20.00           // originalPrice — on sale
    ),
    new Product(
        'suneater tee - white',
        35,
        'https://via.placeholder.com/400x400/1a1a1a/FFD700?text=SUNEATER+WHITE',
        'suneater tee - white',
        null,
        'low_stock'     // stockStatus
    ),
    new Product(
        'AURUM HOODIE',
        50,
        'https://via.placeholder.com/400x400/1a1a1a/FFD700?text=AURUM+HOODIE',
        'AURUM HOODIE'
    ),
    new Product(
        'AURUM CAP',
        20,
        'https://via.placeholder.com/400x400/1a1a1a/FFD700?text=AURUM+CAP',
        'AURUM CAP',
        25.00           // originalPrice — on sale
    ),
    new Product(
        'AURUM JACKET',
        75,
        'https://via.placeholder.com/400x400/1a1a1a/FFD700?text=AURUM+JACKET',
        'AURUM JACKET',
        null,
        'sold_out'      // stockStatus
    ),
];
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

    <!-- Scrolling Banner -->
    <div class="scroll-banner">
        <div class="scroll-content">
            CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - 
        </div>
    </div>

    <!-- Navigation -->
    <nav class="nav">
        <a href="home.html" class="logo">AURUM</a>
        <ul class="nav-links">
            <li><a href="home.html">HOME</a></li>
            <li><a href="shop.php" class="active">SHOP</a></li>
            <li><a href="faqs.html">FAQS</a></li>
            <li><a href="hotline.html">HOTLINE</a></li>
            <li><a href="cart.html" class="cart-link">CART <span id="cart-count" class="cart-count">0</span></a></li>
        </ul>
    </nav>

    <!-- SHOP PAGE -->
    <h2 class="section-header">Shop</h2>
    <div class="product-grid">
        <?php foreach ($products as $product): ?>
        <div class="product-card">
            <div class="product-image">
                <img src="<?php echo htmlspecialchars($product->imageUrl); ?>"
                     alt="<?php echo htmlspecialchars($product->altText); ?>"
                     style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="product-info">
                <div class="product-name"><?php echo htmlspecialchars($product->name); ?></div>
                <!-- Calls formatPrice() method — shows sale price + struck-through original if applicable -->
                <div class="product-price"><?php echo $product->formatPrice(); ?></div>
            </div>
            <!-- Calls getStockBadge() method — renders badge HTML or nothing -->
            <?php echo $product->getStockBadge(); ?>
        </div>
        <?php endforeach; ?>
    </div>

    <!-- Bottom Scrolling Banner -->
    <div class="scroll-banner" style="border-top: 3px solid var(--black); border-bottom: none;">
        <div class="scroll-content" style="animation-direction: reverse;">
            CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - CALL 1800-AURUM - 
        </div>
    </div>

    <script src="js/lookbook.js"></script>
</body>
</html>