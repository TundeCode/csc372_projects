document.addEventListener("DOMContentLoaded", () => {
    const cartItemsEl = document.getElementById("cart-items");
    const cartTotalEl = document.getElementById("cart-total");
  
    renderCart();
  
    function renderCart() {
      let cart = JSON.parse(localStorage.getItem("cart")) || [];
      cartItemsEl.innerHTML = "";
      cartTotalEl.innerHTML = "";
  
      if (cart.length === 0) {
        cartItemsEl.innerHTML = `<p class="cart-empty">YOUR CART IS EMPTY</p>
          <a href="shop.html" class="continue-shopping">CONTINUE SHOPPING</a>`;
        return;
      }
  
      let total = 0;
  
      cart.forEach((item, index) => {
        total += item.price;
  
        const itemDiv = document.createElement("div");
        itemDiv.className = "cart-item";
        itemDiv.innerHTML = `
          <div class="cart-item-info">
            <span class="cart-item-name">${item.name}</span>
            ${item.size ? `<span class="cart-item-size">Size: ${item.size}</span>` : ""}
          </div>
          <span class="cart-item-price">$${item.price.toFixed(2)}</span>
          <button class="remove-btn" data-index="${index}">REMOVE</button>
        `;
        cartItemsEl.appendChild(itemDiv);
      });
  
      cartTotalEl.innerHTML = `TOTAL <span>$${total.toFixed(2)}</span>`;
  
      // Inject checkout + clear buttons after total
      const actionsDiv = document.createElement("div");
      actionsDiv.id = "cart-actions";
      actionsDiv.innerHTML = `
        <button class="checkout-btn" id="checkout-btn">CHECKOUT</button>
        <button class="clear-cart-btn" id="clear-cart-btn">CLEAR CART</button>
      `;
      cartTotalEl.after(actionsDiv);
  
      // Remove item
      cartItemsEl.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-btn")) {
          cart.splice(Number(e.target.dataset.index), 1);
          localStorage.setItem("cart", JSON.stringify(cart));
          // Remove stale actions div before re-render
          document.getElementById("cart-actions")?.remove();
          renderCart();
        }
      });
  
      // Clear cart
      document.getElementById("clear-cart-btn").addEventListener("click", () => {
        localStorage.removeItem("cart");
        document.getElementById("cart-actions")?.remove();
        renderCart();
      });
  
      // Checkout
      document.getElementById("checkout-btn").addEventListener("click", () => {
        showCheckout(total);
      });
    }
  
    function showCheckout(total) {
      // Remove actions div if present
      document.getElementById("cart-actions")?.remove();
      cartTotalEl.innerHTML = "";
  
      cartItemsEl.innerHTML = `
        <div style="max-width:500px; margin:0 auto;">
          <h3 style="text-align:center; font-family:'Bebas Neue',sans-serif; font-size:32px; letter-spacing:4px; color:var(--gold); margin-bottom:32px;">CHECKOUT</h3>
  
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:12px; letter-spacing:2px; margin-bottom:6px; color:var(--off-white);">FULL NAME</label>
            <input id="co-name" type="text" placeholder="Your Name" style="width:100%; padding:12px; border:1px solid #444; background:#111; color:var(--off-white); font-family:'Space Mono',monospace; font-size:14px; box-sizing:border-box;">
          </div>
  
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:12px; letter-spacing:2px; margin-bottom:6px; color:var(--off-white);">EMAIL</label>
            <input id="co-email" type="email" placeholder="you@example.com" style="width:100%; padding:12px; border:1px solid #444; background:#111; color:var(--off-white); font-family:'Space Mono',monospace; font-size:14px; box-sizing:border-box;">
          </div>
  
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:12px; letter-spacing:2px; margin-bottom:6px; color:var(--off-white);">SHIPPING ADDRESS</label>
            <input id="co-address" type="text" placeholder="Street, City, State, ZIP" style="width:100%; padding:12px; border:1px solid #444; background:#111; color:var(--off-white); font-family:'Space Mono',monospace; font-size:14px; box-sizing:border-box;">
          </div>
  
          <div style="margin-bottom:24px;">
            <label style="display:block; font-size:12px; letter-spacing:2px; margin-bottom:6px; color:var(--off-white);">CARD NUMBER (demo only)</label>
            <input id="co-card" type="text" placeholder="•••• •••• •••• ••••" maxlength="19" style="width:100%; padding:12px; border:1px solid #444; background:#111; color:var(--off-white); font-family:'Space Mono',monospace; font-size:14px; box-sizing:border-box;">
          </div>
  
          <div style="display:flex; justify-content:space-between; margin-bottom:24px; font-family:'Bebas Neue',sans-serif; font-size:24px; letter-spacing:3px; border-top:2px solid #333; padding-top:16px;">
            <span style="color:var(--off-white);">ORDER TOTAL</span>
            <span style="color:var(--gold);">$${total.toFixed(2)}</span>
          </div>
  
          <button id="place-order-btn" class="checkout-btn" style="display:block; width:100%;">PLACE ORDER</button>
          <button id="back-to-cart-btn" class="clear-cart-btn" style="display:block; width:100%; margin-top:10px;">← BACK TO CART</button>
        </div>
      `;
  
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
  
        localStorage.removeItem("cart");
        cartItemsEl.innerHTML = `
          <div style="text-align:center; padding:60px 20px;">
            <div style="font-size:64px; color:var(--gold); margin-bottom:20px;">✓</div>
            <h3 style="font-family:'Bebas Neue',sans-serif; font-size:40px; letter-spacing:4px; color:var(--gold); margin-bottom:16px;">ORDER PLACED</h3>
            <p style="letter-spacing:1px; margin-bottom:8px; color:var(--off-white);">Thank you, ${name}.</p>
            <p style="letter-spacing:1px; margin-bottom:32px; color:var(--light-gray);">A confirmation will be sent to ${email}.</p>
            <a href="shop.html" class="continue-shopping">KEEP SHOPPING</a>
          </div>
        `;
        cartTotalEl.innerHTML = "";
      });
    }
  });