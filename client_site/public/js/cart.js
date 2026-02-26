document.addEventListener("DOMContentLoaded", () => {
    const cartItemsEl = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
  
    renderCart();
  
    function renderCart() {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cartItemsEl.innerHTML = "";
  
      if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p style="text-align:center; margin: 40px 0;">Your cart is empty.</p>`;
        cartTotalEl.innerHTML = "";
        return;
      }
  
      let total = 0;
  
      cart.forEach((item, index) => {
        total += item.price;
  
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.style.cssText = "display:flex; justify-content:space-between; align-items:center; padding:16px 0; border-bottom:1px solid #ddd;";
        itemDiv.innerHTML = `
          <span style="font-weight:600; text-transform:uppercase; letter-spacing:1px;">${item.name}</span>
          <span>$${item.price.toFixed(2)}</span>
          <button data-index="${index}" style="background:none; border:1px solid #000; padding:6px 14px; cursor:pointer; font-family:inherit; letter-spacing:1px; font-size:11px;">REMOVE</button>
        `;
        cartItemsEl.appendChild(itemDiv);
      });
  
      cartTotalEl.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:24px; padding-top:16px; border-top:2px solid #000;">
          <span style="font-size:20px; letter-spacing:2px;">TOTAL</span>
          <span style="font-size:20px; font-weight:700;">$${total.toFixed(2)}</span>
        </div>
        <button id="checkout-btn" style="display:block; width:100%; margin-top:24px; padding:18px; background:#000; color:#fff; border:none; font-family:inherit; font-size:16px; letter-spacing:3px; cursor:pointer; text-transform:uppercase;">
          CHECKOUT
        </button>
        <button id="clear-cart-btn" style="display:block; width:100%; margin-top:10px; padding:12px; background:transparent; color:#000; border:1px solid #000; font-family:inherit; font-size:13px; letter-spacing:2px; cursor:pointer; text-transform:uppercase;">
          CLEAR CART
        </button>
      `;
  
      // Remove item
      cartItemsEl.addEventListener("click", (e) => {
        if (e.target.dataset.index !== undefined) {
          cart.splice(Number(e.target.dataset.index), 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          renderCart();
        }
      });
  
      // Clear cart
      document.getElementById("clear-cart-btn").addEventListener("click", () => {
        localStorage.removeItem("cart");
        renderCart();
      });
  
      // Checkout
      document.getElementById("checkout-btn").addEventListener("click", () => {
        showCheckout(total);
      });
    }
  
    function showCheckout(total) {
      cartItemsEl.innerHTML = `
        <div style="max-width:500px; margin:0 auto;">
          <h3 style="text-align:center; letter-spacing:3px; margin-bottom:32px;">CHECKOUT</h3>
  
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:12px; letter-spacing:2px; margin-bottom:6px;">FULL NAME</label>
            <input id="co-name" type="text" placeholder="Your Name" style="width:100%; padding:12px; border:1px solid #000; font-family:inherit; font-size:14px; box-sizing:border-box;">
          </div>
  
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:12px; letter-spacing:2px; margin-bottom:6px;">EMAIL</label>
            <input id="co-email" type="email" placeholder="you@example.com" style="width:100%; padding:12px; border:1px solid #000; font-family:inherit; font-size:14px; box-sizing:border-box;">
          </div>
  
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:12px; letter-spacing:2px; margin-bottom:6px;">SHIPPING ADDRESS</label>
            <input id="co-address" type="text" placeholder="Street, City, State, ZIP" style="width:100%; padding:12px; border:1px solid #000; font-family:inherit; font-size:14px; box-sizing:border-box;">
          </div>
  
          <div style="margin-bottom:24px;">
            <label style="display:block; font-size:12px; letter-spacing:2px; margin-bottom:6px;">CARD NUMBER (demo only)</label>
            <input id="co-card" type="text" placeholder="•••• •••• •••• ••••" maxlength="19" style="width:100%; padding:12px; border:1px solid #000; font-family:inherit; font-size:14px; box-sizing:border-box;">
          </div>
  
          <div style="display:flex; justify-content:space-between; margin-bottom:24px; font-size:18px; font-weight:700; letter-spacing:2px; border-top:2px solid #000; padding-top:16px;">
            <span>ORDER TOTAL</span>
            <span>$${total.toFixed(2)}</span>
          </div>
  
          <button id="place-order-btn" style="display:block; width:100%; padding:18px; background:#000; color:#fff; border:none; font-family:inherit; font-size:16px; letter-spacing:3px; cursor:pointer;">
            PLACE ORDER
          </button>
          <button id="back-to-cart-btn" style="display:block; width:100%; margin-top:10px; padding:12px; background:transparent; border:1px solid #000; font-family:inherit; font-size:13px; letter-spacing:2px; cursor:pointer;">
            ← BACK TO CART
          </button>
        </div>
      `;
  
      cartTotalEl.innerHTML = "";
  
      document.getElementById("back-to-cart-btn").addEventListener("click", renderCart);
  
      document.getElementById("place-order-btn").addEventListener("click", () => {
        const name = document.getElementById("co-name").value.trim();
        const email = document.getElementById("co-email").value.trim();
        const address = document.getElementById("co-address").value.trim();
        const card = document.getElementById("co-card").value.trim();
  
        if (!name || !email || !address || !card) {
          alert("Please fill in all fields.");
          return;
        }
  
        // Simulate order placed
        localStorage.removeItem("cart");
        cartItemsEl.innerHTML = `
          <div style="text-align:center; padding:60px 20px;">
            <div style="font-size:48px; margin-bottom:20px;">✓</div>
            <h3 style="letter-spacing:4px; margin-bottom:16px;">ORDER PLACED</h3>
            <p style="letter-spacing:1px; margin-bottom:8px;">Thank you, ${name}.</p>
            <p style="letter-spacing:1px; margin-bottom:32px;">A confirmation will be sent to ${email}.</p>
            <a href="shop.html" style="display:inline-block; padding:14px 32px; background:#000; color:#fff; text-decoration:none; letter-spacing:3px; font-size:13px;">KEEP SHOPPING</a>
          </div>
        `;
        cartTotalEl.innerHTML = "";
      });
    }
  });