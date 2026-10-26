import React from 'react';

export function Footer() {
  return (
    <footer className="footer-wrapper">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <img
              src="/images/logo.png"
              alt="Logo Las Glorias de Azomalli"
              className="footer-logo"
            />
            <div className="footer-info">
              <span className="footer-title">Las Glorias de Azomalli</span>
              <p className="footer-subtitle">Panadería 100% casera y artesanal.</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span className="footer-copy">© {new Date().getFullYear()} Las Glorias de Azomalli. Todos los derechos reservados.</span>
          <div className="footer-links">
            <a
              href="#catalogo"
              className="footer-link"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('catalogo');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Nuestros panes
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
