/**
 * COMPONENTE PROPIO 2: <user-profile-dropdown>
 * Dropdown modular interactivo tipo Amazon para autenticación y perfil de usuario.
 */
class UserProfileDropdown extends HTMLElement {
  constructor() {
    super();
    this._user = null;
    this._isRegister = false;
  }

  set user(val) {
    this._user = val;
    this.render();
  }

  get user() {
    return this._user;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (this._user && this._user.isLoggedIn) {
      this.renderAuthenticated();
    } else {
      this.renderGuest();
    }
  }

  renderGuest() {
    this.innerHTML = `
      <div class="dropdown-header-guest">
        <h4 style="font-family: var(--font-serif); font-size: 18px; margin-bottom: 8px; color: var(--color-primary);">
          ${this._isRegister ? 'Crear tu cuenta' : 'Tu cuenta de panadería'}
        </h4>
        <form class="dropdown-login-form" id="auth-form">
          <input 
            type="text" 
            class="dropdown-input" 
            id="auth-name-input" 
            placeholder="Tu nombre completo" 
            required
            autocomplete="name"
          >
          <input 
            type="email" 
            class="dropdown-input" 
            id="auth-email-input" 
            placeholder="Correo electrónico" 
            required
            autocomplete="email"
          >
          <button type="submit" class="dropdown-login-btn">
            ${this._isRegister ? 'Registrarse en Azomalli' : 'Iniciar sesión'}
          </button>
        </form>
        <p class="dropdown-subtext">
          ${this._isRegister ? '¿Ya tienes cuenta?' : '¿Cliente nuevo?'}
          <span class="dropdown-link-accent" id="toggle-auth-mode">
            ${this._isRegister ? 'Identifícate aquí' : 'Empieza aquí'}
          </span>
        </p>
      </div>

      <ul class="dropdown-menu-list">
        <li class="dropdown-menu-item">
          <a href="#catalogo" id="dropdown-link-catalog">
            <span>Explorar catálogo</span>
            <span style="color: var(--color-text-muted);">→</span>
          </a>
        </li>
        <li class="dropdown-menu-item">
          <a href="#mis-pedidos" id="dropdown-link-orders">
            <span>Rastrear un encargo</span>
            <span style="color: var(--color-text-muted);">→</span>
          </a>
        </li>
      </ul>
    `;

    // Eventos de usuario: Cambio de modo login / registro
    const toggleBtn = this.querySelector('#toggle-auth-mode');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this._isRegister = !this._isRegister;
        this.render();
      });
    }

    // Evento de usuario: Envío del formulario de autenticación
    const form = this.querySelector('#auth-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = this.querySelector('#auth-name-input').value.trim();
        const email = this.querySelector('#auth-email-input').value.trim();
        if (name && email) {
          this.handleLogin(name, email);
        }
      });
    }

    // Acciones de enlaces
    const catalogLink = this.querySelector('#dropdown-link-catalog');
    if (catalogLink) {
      catalogLink.addEventListener('click', () => {
        this.classList.remove('is-open');
      });
    }

    const ordersLink = this.querySelector('#dropdown-link-orders');
    if (ordersLink) {
      ordersLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.classList.remove('is-open');
        window.dispatchEvent(new CustomEvent('open-orders-modal'));
      });
    }
  }

  renderAuthenticated() {
    this.innerHTML = `
      <div class="dropdown-auth-user">
        <span class="dropdown-user-title">Sesión activa</span>
        <h4 class="dropdown-user-fullname">${this._user.name}</h4>
        <span style="font-size: 12px; color: var(--color-text-muted);">${this._user.email || ''}</span>
      </div>

      <ul class="dropdown-menu-list">
        <li class="dropdown-menu-item">
          <button type="button" id="auth-view-orders">
            <span>Mis pedidos recientes</span>
            <span style="color: var(--color-primary); font-weight: 600;">Ver</span>
          </button>
        </li>
        <li class="dropdown-menu-item">
          <button type="button" id="auth-view-cart">
            <span>Mi carrito de pan</span>
            <span style="color: var(--color-primary); font-weight: 600;">Abrir</span>
          </button>
        </li>
        <li class="dropdown-menu-item" style="border-top: 1px solid var(--color-border-beige); padding-top: 6px; margin-top: 4px;">
          <button type="button" id="auth-logout-btn" style="color: #a83232; font-weight: 600;">
            <span>Cerrar sesión</span>
            <span>✕</span>
          </button>
        </li>
      </ul>
    `;

    // Eventos
    const ordersBtn = this.querySelector('#auth-view-orders');
    if (ordersBtn) {
      ordersBtn.addEventListener('click', () => {
        this.classList.remove('is-open');
        window.dispatchEvent(new CustomEvent('open-orders-modal'));
      });
    }

    const cartBtn = this.querySelector('#auth-view-cart');
    if (cartBtn) {
      cartBtn.addEventListener('click', () => {
        this.classList.remove('is-open');
        window.dispatchEvent(new CustomEvent('open-cart-drawer'));
      });
    }

    const logoutBtn = this.querySelector('#auth-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        this.handleLogout();
      });
    }
  }

  handleLogin(name, email) {
    const userData = {
      isLoggedIn: true,
      name: name,
      email: email
    };
    this._user = userData;
    this.render();

    this.dispatchEvent(new CustomEvent('user-login', {
      bubbles: true,
      composed: true,
      detail: userData
    }));
  }

  handleLogout() {
    this._user = null;
    this.render();

    this.dispatchEvent(new CustomEvent('user-logout', {
      bubbles: true,
      composed: true
    }));
  }
}

customElements.define('user-profile-dropdown', UserProfileDropdown);
