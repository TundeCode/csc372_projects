import { useState } from "react";

const initialForm = {
  agreement: false,
  email: "",
  message: "",
  name: "",
  orderTopic: "",
};

function validateForm(formValues) {
  const errors = {};

  if (!formValues.name.trim()) {
    errors.name = "Please enter your name.";
  }

  if (!formValues.email.trim()) {
    errors.email = "Please enter your email.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!formValues.orderTopic.trim()) {
    errors.orderTopic = "Please choose a topic for the hotline.";
  }

  if (formValues.message.trim().length < 10) {
    errors.message = "Please include at least 10 characters in your message.";
  }

  if (!formValues.agreement) {
    errors.agreement = "Please confirm that we can contact you back.";
  }

  return errors;
}

export default function ContactForm() {
  const [formValues, setFormValues] = useState(initialForm);
  const [formErrors, setFormErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  function handleChange(event) {
    const { checked, name, type, value } = event.target;

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const errors = validateForm(formValues);
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) {
      setFormSubmitted(false);
      return;
    }

    setFormSubmitted(true);
    setFormErrors({});
    setFormValues(initialForm);
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field">
          <span>FULL NAME</span>
          <input name="name" onChange={handleChange} type="text" value={formValues.name} />
          {formErrors.name ? <small className="field-error">{formErrors.name}</small> : null}
        </label>

        <label className="form-field">
          <span>EMAIL</span>
          <input name="email" onChange={handleChange} type="email" value={formValues.email} />
          {formErrors.email ? <small className="field-error">{formErrors.email}</small> : null}
        </label>

        <label className="form-field">
          <span>HOTLINE TOPIC</span>
          <input
            name="orderTopic"
            onChange={handleChange}
            placeholder="Sizing, shipping, order issue"
            type="text"
            value={formValues.orderTopic}
          />
          {formErrors.orderTopic ? (
            <small className="field-error">{formErrors.orderTopic}</small>
          ) : null}
        </label>

        <label className="form-field form-field-full">
          <span>MESSAGE</span>
          <textarea name="message" onChange={handleChange} rows="5" value={formValues.message} />
          {formErrors.message ? <small className="field-error">{formErrors.message}</small> : null}
        </label>
      </div>

      <label className="checkbox-field">
        <input
          checked={formValues.agreement}
          name="agreement"
          onChange={handleChange}
          type="checkbox"
        />
        <span>I agree to be contacted back about this request.</span>
      </label>
      {formErrors.agreement ? <small className="field-error">{formErrors.agreement}</small> : null}

      <button className="primary-button" type="submit">
        SEND TO HOTLINE
      </button>

      {formSubmitted ? (
        <p className="success-message">Your message was queued. Operators are standing by.</p>
      ) : null}
    </form>
  );
}
