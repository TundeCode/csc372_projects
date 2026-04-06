-- ============================================================
-- AURUM Database Setup
-- Author: [Your Name]
-- Date: April 2026
-- Description: Creates and populates the two tables for the
--              AURUM client site: products and inquiries.
-- ============================================================

-- Create the database (run this in phpMyAdmin or via CLI)
-- CREATE DATABASE yourcpanelusername_aurum;
-- USE yourcpanelusername_aurum;

-- ============================================================
-- TABLE 1: products
-- Purpose: Stores all AURUM merchandise available in the shop.
-- Supports: shop.php — products are pulled from this table
--           instead of being hardcoded in PHP.
-- Relates to: inquiries.product_id references products.id
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
    id            INT(11)        NOT NULL AUTO_INCREMENT,
    name          VARCHAR(100)   NOT NULL,
    price         DECIMAL(10,2)  NOT NULL,
    original_price DECIMAL(10,2) DEFAULT NULL,   -- NULL means not on sale
    image_url     VARCHAR(255)   NOT NULL,
    alt_text      VARCHAR(150)   NOT NULL,
    stock_status  ENUM('in_stock','low_stock','sold_out') NOT NULL DEFAULT 'in_stock',
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- TABLE 2: inquiries
-- Purpose: Stores hotline form submissions from site visitors.
-- Supports: hotline.php — saves each form submission to the DB
--           so AURUM staff can review and respond.
-- Relates to: product_id is a foreign key referencing products.id
--             (optional — visitor may not reference a product)
-- ============================================================
CREATE TABLE IF NOT EXISTS inquiries (
    id            INT(11)        NOT NULL AUTO_INCREMENT,
    visitor_name  VARCHAR(60)    NOT NULL,
    order_number  INT(7)         DEFAULT NULL,    -- optional field
    inquiry_type  ENUM('sizing','shipping','order','other') NOT NULL,
    product_id    INT(11)        DEFAULT NULL,    -- FK to products.id (optional)
    submitted_at  DATETIME       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    CONSTRAINT fk_product
        FOREIGN KEY (product_id) REFERENCES products(id)
        ON DELETE SET NULL
        ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================================
-- SAMPLE DATA: products (9 rows matching shop.php)
-- ============================================================
INSERT INTO products (name, price, original_price, image_url, alt_text, stock_status) VALUES
('1800 tee - black',   35.00, NULL,  'images/Black1800Tee-Picsart-BackgroundRemover.png',     '1800 tee - black',   'in_stock'),
('1800 tee - white',   35.00, NULL,  'images/White1800Tee-Picsart-BackgroundRemover.png',     '1800 tee - white',   'in_stock'),
('1800 baby tee',      35.00, NULL,  'images/BabyTee-Picsart-BackgroundRemover.png',          '1800 baby tee',      'in_stock'),
('suneater tee - black',35.00,NULL,  'images/BlackSunEaterTee-Picsart-BackgroundRemover.png', 'suneater tee - black','in_stock'),
('AURUM BEANIE',       15.00, 20.00, 'images/BlackBeanie-Picsart-BackgroundRemover.png',      'AURUM BEANIE',       'in_stock'),
('suneater tee - white',35.00,NULL,  'images/WhiteSunEaterTee-Picsart-BackgroundRemover.png', 'suneater tee - white','low_stock'),
('AURUM HOODIE',       50.00, NULL,  'images/SweatSuit-Picsart-BackgroundRemover.png',        'AURUM HOODIE',       'in_stock'),
('AURUM CAP',          20.00, 25.00, 'images/WhiteAurumTee-Picsart-BackgroundRemover.png',    'AURUM CAP',          'in_stock'),
('AURUM JACKET',       75.00, NULL,  'images/brownbeanie-Picsart-BackgroundRemover.png',      'AURUM JACKET',       'sold_out');

-- ============================================================
-- SAMPLE DATA: inquiries (6 rows)
-- ============================================================
INSERT INTO inquiries (visitor_name, order_number, inquiry_type, product_id, submitted_at) VALUES
('Alex Rivera',   10234, 'sizing',   1, '2026-03-10 14:22:00'),
('Jordan Lee',    10891, 'shipping', 6, '2026-03-11 09:05:00'),
('Morgan Davis',  NULL,  'other',    NULL,'2026-03-12 16:45:00'),
('Casey Kim',     11002, 'order',    3, '2026-03-14 11:30:00'),
('Taylor Brooks', NULL,  'sizing',   5, '2026-03-15 18:10:00'),
('Sam Nguyen',    10567, 'shipping', 9, '2026-03-18 08:55:00');
