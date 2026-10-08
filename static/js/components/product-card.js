/**
 * Componente: <product-card>
 */
class ProductCard extends HTMLElement {
  constructor() {
    super();
    this._product = null;
  }

  set product(data) {
    this._product = data;
    this.render();
  }

  get product() {
    return this._product;
  }

  connectedCallback() {
    if (this._product) {
      this.render();
    }
  }

  render() {
    if (!this._product) return;

    const { id, name, description, tag, price, image } = this._product;
    const formattedPrice = new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price || 0);

    this.innerHTML = `
      <article class="product-card-container" data-id="${id}">
        <div class="product-image-box">
          <img src="${image || '/static/images/pan_conchas.png'}" alt="${name}" loading="lazy">
          <span class="product-price-badge">${formattedPrice}</span>
        </div>
        <div class="product-details">
          <div class="product-title-row">
            <h4 class="product-name">${name}</h4>
            <svg class="icon-svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9C291D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </div>
          <p class="product-desc">${description}</p>
          <span class="product-tag">${tag}</span>
          
          <button class="btn-add-cart" type="button" aria-label="Agregar ${name} al carrito">
            <span class="btn-text">Agregar al carrito</span>
            <svg class="icon-svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="7" y1="17" x2="17" y2="7"></line>
              <polyline points="7 7 17 7 17 17"></polyline>
            </svg>
          </button>
        </div>
      </article>
    `;

    // Evento de usuario: Clic en "Agregar al carrito"
    const addBtn = this.querySelector('.btn-add-cart');
    addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      this.handleAddToCart(addBtn);
    });
  }

  handleAddToCart(button) {
    const originalText = button.querySelector('.btn-text').textContent;
    button.classList.add('added');
    button.querySelector('.btn-text').textContent = '¡Agregado! ✓';

    setTimeout(() => {
      button.classList.remove('added');
      button.querySelector('.btn-text').textContent = originalText;
    }, 1200);

    // Emisión de evento personalizado de estado
    const event = new CustomEvent('add-to-cart', {
      bubbles: true,
      composed: true,
      detail: { product: this._product }
    });
    this.dispatchEvent(event);
  }
}

customElements.define('product-card', ProductCard);
