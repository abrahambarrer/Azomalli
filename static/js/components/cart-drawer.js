/**
 * COMPONENTE PROPIO 3: <cart-drawer>
 * Drawer lateral reactivo para el carrito de compras de Azomalli.
 */
class CartDrawer extends HTMLElement {
  constructor() {
    super();
    this._items = [];
    this._isOpen = false;
  }

  set items(val) {
    this._items = val || [];
    this.render();
  }

  get items() {
    return this._items;
  }

  connectedCallback() {
    this.render();
  }

  open() {
    this._isOpen = true;
    const backdrop = this.querySelector('.drawer-backdrop');
    const panel = this.querySelector('.drawer-panel');
    if (backdrop && panel) {
      backdrop.classList.add('is-open');
      panel.classList.add('is-open');
    }
  }

  close() {
    this._isOpen = false;
    const backdrop = this.querySelector('.drawer-backdrop');
    const panel = this.querySelector('.drawer-panel');
    if (backdrop && panel) {
      backdrop.classList.remove('is-open');
      panel.classList.remove('is-open');
    }
  }

  render() {
    const totalAmount = this._items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const formattedTotal = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(totalAmount);

    this.innerHTML = `
      <div class="drawer-backdrop ${this._isOpen ? 'is-open' : ''}" id="cart-backdrop"></div>
      <aside class="drawer-panel ${this._isOpen ? 'is-open' : ''}" aria-label="Carrito de compras" role="dialog" aria-modal="true">
        <div class="drawer-header">
          <h3 class="drawer-title">Tu Cesta de Pan</h3>
          <button class="drawer-close-btn" id="close-cart-btn" aria-label="Cerrar carrito">&times;</button>
        </div>

        <div class="drawer-body">
          ${this._items.length === 0 ? `
            <div class="empty-state">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#79685C" stroke-width="1.5">
                <circle cx="8" cy="21" r="1"></circle>
                <circle cx="19" cy="21" r="1"></circle>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"></path>
              </svg>
              <p>Tu carrito está vacío.</p>
              <small>Elige un pan recién salido del horno en nuestro catálogo.</small>
            </div>
          ` : `
            ${this._items.map(item => `
              <div class="cart-item" data-id="${item.id}">
                <img src="${item.image || '/static/images/pan_conchas.png'}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                  <h4 class="cart-item-name">${item.name}</h4>
                  <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)} MXN</span>
                  <div class="cart-item-controls">
                    <button class="qty-btn btn-decrease" data-id="${item.id}" aria-label="Disminuir cantidad">-</button>
                    <span class="cart-item-qty">${item.quantity}</span>
                    <button class="qty-btn btn-increase" data-id="${item.id}" aria-label="Aumentar cantidad">+</button>
                    <button class="cart-item-remove" data-id="${item.id}">Quitar</button>
                  </div>
                </div>
              </div>
            `).join('')}
          `}
        </div>

        ${this._items.length > 0 ? `
          <div class="drawer-footer">
            <div class="drawer-subtotal">
              <span>Subtotal estimado:</span>
              <span class="drawer-subtotal-val">${formattedTotal}</span>
            </div>
            <button class="drawer-checkout-btn" id="cart-checkout-btn">
              Proceder al pago de tu encargo
            </button>
          </div>
        ` : ''}
      </aside>
    `;

    // Eventos de usuario dentro del drawer
    const backdrop = this.querySelector('#cart-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', () => this.close());
    }

    const closeBtn = this.querySelector('#close-cart-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.close());
    }

    // Aumentar cantidad
    this.querySelectorAll('.btn-increase').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        this.updateItemQuantity(id, 1);
      });
    });

    // Disminuir cantidad
    this.querySelectorAll('.btn-decrease').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        this.updateItemQuantity(id, -1);
      });
    });

    // Quitar producto
    this.querySelectorAll('.cart-item-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = parseInt(e.currentTarget.getAttribute('data-id'), 10);
        this.removeItem(id);
      });
    });

    // Finalizar pedido (Checkout)
    const checkoutBtn = this.querySelector('#cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', () => this.handleCheckout());
    }
  }

  updateItemQuantity(id, change) {
    const item = this._items.find(i => i.id === id);
    if (!item) return;

    item.quantity += change;
    if (item.quantity <= 0) {
      this._items = this._items.filter(i => i.id !== id);
    }

    this.render();
    this.dispatchCartChange();
  }

  removeItem(id) {
    this._items = this._items.filter(i => i.id !== id);
    this.render();
    this.dispatchCartChange();
  }

  dispatchCartChange() {
    this.dispatchEvent(new CustomEvent('cart-changed', {
      bubbles: true,
      composed: true,
      detail: { items: this._items }
    }));
  }

  async handleCheckout() {
    const checkoutBtn = this.querySelector('#cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.disabled = true;
      checkoutBtn.textContent = 'Procesando encargo...';
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: this._items,
          user: localStorage.getItem('azomalli_user') ? JSON.parse(localStorage.getItem('azomalli_user')).name : 'Invitado'
        })
      });

      const data = await response.json();
      if (data.success) {
        this.dispatchEvent(new CustomEvent('order-completed', {
          bubbles: true,
          composed: true,
          detail: data
        }));
        this._items = [];
        this.render();
        this.close();
      }
    } catch (err) {
      console.warn('Backend call failed, simulating local order completion:', err);
      // Fallback local simulación si se corre offline
      const mockOrder = {
        success: true,
        order_id: `GLO-${Math.floor(1000 + Math.random() * 9000)}`,
        message: '¡Tu pedido ha sido recibido y comenzará a hornearse pronto!'
      };
      this.dispatchEvent(new CustomEvent('order-completed', {
        bubbles: true,
        composed: true,
        detail: mockOrder
      }));
      this._items = [];
      this.render();
      this.close();
    }
  }
}

customElements.define('cart-drawer', CartDrawer);
