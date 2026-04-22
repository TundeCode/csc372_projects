import { useState } from "react";

export default function ProductCard({ onAddToCart, product }) {
  const [selectedSize, setSelectedSize] = useState("");
  const [showSizeError, setShowSizeError] = useState(false);
  const [buttonLabel, setButtonLabel] = useState("ADD TO CART");

  const hasSizes = Array.isArray(product.sizes) && product.sizes.length > 0;

  function handleSelectSize(size) {
    setSelectedSize(size);
    setShowSizeError(false);
  }

  function handleAddClick() {
    if (hasSizes && !selectedSize) {
      setShowSizeError(true);
      return;
    }

    onAddToCart(product, selectedSize);
    setButtonLabel("ADDED ✓");

    window.setTimeout(() => {
      setButtonLabel("ADD TO CART");
    }, 1200);
  }

  return (
    <article className="product-card">
      <div className="product-image">
        <img alt={product.name} className="product-photo" src={product.image} />
      </div>

      {product.badge ? <div className="stock-badge">{product.badge}</div> : null}

      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-price">
          ${product.price}
          {product.compareAt ? <span className="old-price">${product.compareAt}</span> : null}
        </div>
        <p className="product-description">{product.description}</p>

        {hasSizes ? (
          <div className={`size-picker${showSizeError ? " size-picker-error" : ""}`}>
            {product.sizes.map((size) => (
              <button
                className={`size-pick-btn${selectedSize === size ? " selected" : ""}`}
                key={size}
                onClick={() => handleSelectSize(size)}
                type="button"
              >
                {size}
              </button>
            ))}
          </div>
        ) : (
          <p className="one-size-copy">One size / accessory item</p>
        )}

        {showSizeError ? <p className="field-error">Please select a size before adding.</p> : null}

        <button className="add-to-cart-btn" onClick={handleAddClick} type="button">
          {buttonLabel}
        </button>
      </div>
    </article>
  );
}
