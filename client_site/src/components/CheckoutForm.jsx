import { useState } from "react";

const initialCheckoutValues = {
  address: "",
  card: "",
  email: "",
  name: "",
};

function validateCheckout(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = "Enter the name for this order.";
  }

  if (!values.email.trim()) {
    errors.email = "Enter an email for order updates.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (values.address.trim().length < 8) {
    errors.address = "Enter a full shipping address.";
  }

  if (values.card.replace(/\s/g, "").length < 16) {
    errors.card = "Use a 16-digit demo card number.";
  }

  return errors;
}

export default function CheckoutForm({ onPlaceOrder, total }) {
  const [checkoutValues, setCheckoutValues] = useState(initialCheckoutValues);
  const [checkoutErrors, setCheckoutErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setCheckoutValues((currentValues) => ({
      ...currentValues,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const errors = validateCheckout(checkoutValues);
    setCheckoutErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    onPlaceOrder(checkoutValues);
    setCheckoutValues(initialCheckoutValues);
    setCheckoutErrors({});
  }

  return (
    <form className="checkout-card" onSubmit={handleSubmit}>
      <h3>CHECKOUT</h3>

      <label className="form-field">
        <span>FULL NAME</span>
        <input name="name" onChange={handleChange} type="text" value={checkoutValues.name} />
        {checkoutErrors.name ? <small className="field-error">{checkoutErrors.name}</small> : null}
      </label>

      <label className="form-field">
        <span>EMAIL</span>
        <input name="email" onChange={handleChange} type="email" value={checkoutValues.email} />
        {checkoutErrors.email ? (
          <small className="field-error">{checkoutErrors.email}</small>
        ) : null}
      </label>

      <label className="form-field">
        <span>SHIPPING ADDRESS</span>
        <input
          name="address"
          onChange={handleChange}
          type="text"
          value={checkoutValues.address}
        />
        {checkoutErrors.address ? (
          <small className="field-error">{checkoutErrors.address}</small>
        ) : null}
      </label>

      <label className="form-field">
        <span>CARD NUMBER (DEMO)</span>
        <input name="card" onChange={handleChange} type="text" value={checkoutValues.card} />
        {checkoutErrors.card ? <small className="field-error">{checkoutErrors.card}</small> : null}
      </label>

      <div className="checkout-total">
        <span>ORDER TOTAL</span>
        <span>${total.toFixed(2)}</span>
      </div>

      <button className="primary-button" type="submit">
        PLACE ORDER
      </button>
    </form>
  );
}
