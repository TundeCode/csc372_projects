import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import {
  faqEntries,
  featuredMoments,
  lookbookEntries,
  products,
} from "./data/siteData";
import CartPage from "./pages/CartPage";
import FaqsPage from "./pages/FaqsPage";
import HomePage from "./pages/HomePage";
import HotlinePage from "./pages/HotlinePage";
import NotFoundPage from "./pages/NotFoundPage";
import ShopPage from "./pages/ShopPage";

function getStoredCart() {
  if (typeof window === "undefined") {
    return [];
  }

  const savedCart = window.localStorage.getItem("aurum-cart");

  if (!savedCart) {
    return [];
  }

  try {
    return JSON.parse(savedCart);
  } catch {
    return [];
  }
}

function createCartItem(product, size) {
  return {
    cartId: `${product.id}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    id: product.id,
    image: product.image,
    name: product.name,
    price: product.price,
    size: size || null,
  };
}

export default function App() {
  const [cartItems, setCartItems] = useState(getStoredCart);

  useEffect(() => {
    window.localStorage.setItem("aurum-cart", JSON.stringify(cartItems));
  }, [cartItems]);

  function handleAddToCart(product, size) {
    setCartItems((currentCart) => [...currentCart, createCartItem(product, size)]);
  }

  function handleRemoveFromCart(cartId) {
    setCartItems((currentCart) => currentCart.filter((item) => item.cartId !== cartId));
  }

  function handleClearCart() {
    setCartItems([]);
  }

  return (
    <Routes>
      <Route path="/" element={<Layout cartCount={cartItems.length} />}>
        <Route
          index
          element={
            <HomePage
              featuredMoments={featuredMoments}
              featuredProducts={products.slice(0, 3)}
            />
          }
        />
        <Route
          path="shop"
          element={
            <ShopPage
              lookbookEntries={lookbookEntries}
              onAddToCart={handleAddToCart}
              products={products}
            />
          }
        />
        <Route path="faqs" element={<FaqsPage faqEntries={faqEntries} />} />
        <Route path="hotline" element={<HotlinePage />} />
        <Route
          path="cart"
          element={
            <CartPage
              cartItems={cartItems}
              onClearCart={handleClearCart}
              onRemoveFromCart={handleRemoveFromCart}
            />
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
