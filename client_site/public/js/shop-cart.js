// shop-cart.js - handles Add to Cart on shop.html

document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
  
    // Size picker toggle logic
    document.querySelectorAll(".size-picker").forEach((picker) => {
      picker.querySelectorAll(".size-pick-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          picker.querySelectorAll(".size-pick-btn").forEach((b) => b.classList.remove("selected"));
          btn.classList.add("selected");
          // Clear any error highlight when a size is selected
          picker.style.outline = "";
        });
      });
    });
  
    // Add to Cart logic
    document.querySelectorAll(".add-to-cart-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".product-card");
        const name = card.querySelector(".product-name").textContent.trim();
  
        // Parse price - grab first number from price text
        const priceText = card.querySelector(".product-price").textContent;
        const price = parseFloat(priceText.match(/\$(\d+)/)[1]);
  
        // Check if this product has a size picker
        const picker = card.querySelector(".size-picker");
        const selectedSize = picker ? picker.querySelector(".size-pick-btn.selected") : null;
  
        if (picker && !selectedSize) {
          // Flash red outline to indicate size must be selected
          picker.style.outline = "1px solid #ff4444";
          setTimeout(() => (picker.style.outline = ""), 1200);
          return;
        }
  
        const size = selectedSize ? selectedSize.dataset.size : null;
  
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push({ name, price, size });
        localStorage.setItem("cart", JSON.stringify(cart));
  
        updateCartCount();
  
        // Button feedback
        btn.textContent = "ADDED ✓";
        btn.style.background = "var(--gold)";
        btn.style.color = "var(--black)";
        setTimeout(() => {
          btn.textContent = "ADD TO CART";
          btn.style.background = "";
          btn.style.color = "";
        }, 1200);
      });
    });
  
    function updateCartCount() {
      const cart = JSON.parse(localStorage.getItem("cart")) || [];
      const countEl = document.getElementById("cart-count");
      if (countEl) {
        countEl.textContent = cart.length;
      }
    }
  });