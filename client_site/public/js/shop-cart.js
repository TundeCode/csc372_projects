// shop-cart.js - handles Add to Cart on shop.html

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
  
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".product-card");
        const name = card.querySelector(".product-name").textContent.trim();
        // Parse price - grab first number from price text
        const priceText = card.querySelector(".product-price").textContent;
        const price = parseFloat(priceText.match(/\$(\d+)/)[1]);
  
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ name, price });
        localStorage.setItem("cart", JSON.stringify(cart));
  
        updateCartCount();
  
        // Button feedback
        btn.textContent = "ADDED ✓";
        btn.style.background = "#2a2a2a";
        setTimeout(() => {
          btn.textContent = "ADD TO CART";
          btn.style.background = "";
        }, 1200);
      });
    });
  
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const countEl = document.getElementById("cart-count");
      if (countEl) {
        countEl.textContent = cart.length;
        countEl.style.display = cart.length > 0 ? "inline-block" : "inline-block";
      }
    }
  });