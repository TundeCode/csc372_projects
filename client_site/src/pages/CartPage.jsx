import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import CheckoutForm from "../components/CheckoutForm";
import SectionHeading from "../components/SectionHeading";

export default function CartPage({ cartItems, onClearCart, onRemoveFromCart }) {
  const location = useLocation();
  const [showCheckout, setShowCheckout] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  useEffect(() => {
    document.title = "Cart - AURUM";
  }, [location.pathname]);

  useEffect(() => {
    if (cartItems.length === 0) {
      setShowCheckout(false);
    }
  }, [cartItems.length]);

  const total = cartItems.reduce((runningTotal, item) => runningTotal + item.price, 0);

  function handlePlaceOrder(orderValues) {
    setPlacedOrder(orderValues);
    setShowCheckout(false);
    onClearCart();
  }

  if (placedOrder) {
    return (
      <section className="content-section cart-section">
        <SectionHeading
          description={`Thank you, ${placedOrder.name}. A confirmation will be sent to ${placedOrder.email}.`}
          eyebrow="Order Placed"
          title="THE CALL WENT THROUGH"
        />
        <Link className="primary-button" to="/shop">
          KEEP SHOPPING
        </Link>
      </section>
    );
  }

  if (cartItems.length === 0) {
    return (
      <section className="content-section cart-section">
        <SectionHeading
          description="Your cart is empty right now, but the line to the collection is still open."
          eyebrow="Cart"
          title="YOUR CART IS EMPTY"
        />
        <Link className="primary-button" to="/shop">
          CONTINUE SHOPPING
        </Link>
      </section>
    );
  }

  return (
    <section className="content-section cart-section">
      <SectionHeading
        description="Review your picks, remove items, or open checkout to place the order."
        eyebrow="Cart"
        title="YOUR CART"
      />

      <div className="cart-layout">
        <div className="cart-items-panel">
          {cartItems.map((item) => (
            <article className="cart-item" key={item.cartId}>
              <img alt={item.name} className="cart-thumb" src={item.image} />
              <div className="cart-item-info">
                <span className="cart-item-name">{item.name}</span>
                {item.size ? <span className="cart-item-size">Size: {item.size}</span> : null}
              </div>
              <span className="cart-item-price">${item.price.toFixed(2)}</span>
              <button
                className="remove-btn"
                onClick={() => onRemoveFromCart(item.cartId)}
                type="button"
              >
                REMOVE
              </button>
            </article>
          ))}

          <div className="cart-actions">
            <button className="primary-button" onClick={() => setShowCheckout(true)} type="button">
              CHECKOUT
            </button>
            <button className="secondary-button" onClick={onClearCart} type="button">
              CLEAR CART
            </button>
          </div>
        </div>

        <div className="cart-summary">
          <h3>ORDER TOTAL</h3>
          <p>${total.toFixed(2)}</p>
          <span>{cartItems.length} items in the lineup</span>
        </div>
      </div>

      {showCheckout ? <CheckoutForm onPlaceOrder={handlePlaceOrder} total={total} /> : null}
    </section>
  );
}
