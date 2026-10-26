import React, { useEffect, useState } from 'react';

export function Navbar({ cartCount, onOpenCart }) {
  const [bump, setBump] = useState(false);

  // Efecto bump cuando cambia el contador del carrito
  useEffect(() => {
    if (cartCount === 0) return;
    setBump(true);
    const timer = setTimeout(() => setBump(false), 300);
    return () => clearTimeout(timer);
  }, [cartCount]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const navbarOffset = 112;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header className="navbar-wrapper">
      <div className="navbar-container">
        {/* Identidad de la Panadería */}
        <a
          href="#top"
          className="brand-identity"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          <img
            src="/images/logo.png"
            alt="Logo Las Glorias de Azomalli"
            className="brand-logo"
          />
          <span className="brand-name">Las Glorias de Azomalli</span>
        </a>

        {/* Enlaces de Navegación */}
        <nav className="nav-links">
          <a
            href="#catalogo"
            className="nav-link"
            id="nav-catalogo-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('catalogo');
            }}
          >
            Catálogo
          </a>

          <a
            href="#catalogo"
            className="nav-link"
            id="nav-pedidos-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('seccion-mas-vendidos');
            }}
          >
            Favoritos
          </a>

          {/* Botón Carrito con Contador dinámico */}
          <button
            type="button"
            className="cart-btn"
            id="open-cart-btn"
            onClick={onOpenCart}
            aria-label="Ver carrito de compras"
          >
            <svg
              className="icon-svg"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="8" cy="21" r="1"></circle>
              <circle cx="19" cy="21" r="1"></circle>
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
            </svg>
            <span className={`cart-badge ${bump ? 'bump' : ''}`} id="cart-counter">
              {cartCount}
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
}
