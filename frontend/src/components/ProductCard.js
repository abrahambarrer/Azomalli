import React from 'react';

export function ProductCard({ product, onAddToCart }) {
  const { id, name, description, tag, price, image } = product;

  const formattedPrice = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(price || 0);

  return (
    <div className="product-card-wrapper">
      <article className="product-card-container" data-id={id}>
        <div className="product-image-box">
          <img
            src={image || '/images/pan_conchas.png'}
            alt={name}
            loading="lazy"
          />
          <span className="product-price-badge">{formattedPrice}</span>
        </div>

        <div className="product-details">
          <div className="product-title-row">
            <h4 className="product-name">{name}</h4>
            <svg
              className="icon-svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9C291D"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>

          <p className="product-desc">{description}</p>
          {tag && <span className="product-tag">{tag}</span>}

          <button
            className="btn-add-cart"
            type="button"
            aria-label={`Agregar ${name} al carrito`}
            onClick={() => onAddToCart && onAddToCart(product)}
          >
            <span className="btn-text">Agregar al carrito</span>
            <svg
              className="icon-svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>
        </div>
      </article>
    </div>
  );
}
