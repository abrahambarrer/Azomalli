// Estado Global de la Aplicación
const AppState = {
  products: [],
  cart: [],
  user: {
    isLoggedIn: false,
    name: '',
    email: ''
  },
  orders: [],
  activeCategory: 'Todos'
};

// Inicialización cuando el DOM está listo
document.addEventListener('DOMContentLoaded', async () => {
  initNavigationEvents();
  initFilterEvents();
  initCartEvents();

  await fetchProducts();
  renderCatalogSections();
});

// GESTION DE ESTADO

function saveCartToStorage() {
  try {
    localStorage.setItem('azomalli_cart', JSON.stringify(AppState.cart));
  } catch (e) {
    console.error('Error guardando carrito:', e);
  }
}

// OBTENCION DE DATOS

async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Respuesta no satisfactoria de la API');
    const data = await res.json();
    AppState.products = data.products || [];
  } catch (err) {
    console.warn('Error: ', err);
  }
}

// RENDERIZAR CATALOGO

function renderCatalogSections() {
  const bestsellersContainer = document.getElementById('bestsellers-grid');
  const seasonalContainer = document.getElementById('seasonal-grid');
  const allProductsContainer = document.getElementById('all-products-grid');

  // Sección 1: Más vendidos
  if (bestsellersContainer) {
    bestsellersContainer.innerHTML = '';
    const bestsellers = AppState.products.filter(p => p.is_bestseller);
    bestsellers.forEach(product => {
      const card = document.createElement('product-card');
      card.product = product;
      bestsellersContainer.appendChild(card);
    });
  }

  // Sección 2: Productos de temporada
  if (seasonalContainer) {
    seasonalContainer.innerHTML = '';
    const seasonal = AppState.products.filter(p => p.is_seasonal);
    seasonal.forEach(product => {
      const card = document.createElement('product-card');
      card.product = product;
      seasonalContainer.appendChild(card);
    });
  }

  // Sección 3: Todos los productos (con filtrado activo)
  renderAllProductsGrid();
}

function renderAllProductsGrid() {
  const allProductsContainer = document.getElementById('all-products-grid');
  if (!allProductsContainer) return;

  allProductsContainer.innerHTML = '';
  let filtered = AppState.products;

  if (AppState.activeCategory !== 'Todos') {
    filtered = AppState.products.filter(p => p.category === AppState.activeCategory);
  }

  if (filtered.length === 0) {
    allProductsContainer.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1;">
        <p>No se encontraron panes en esta categoría por el momento.</p>
      </div>
    `;
    return;
  }

  filtered.forEach(product => {
    const card = document.createElement('product-card');
    card.product = product;
    allProductsContainer.appendChild(card);
  });
}

// SCROLLEO Y NAVEGACION

function initNavigationEvents() {
  // Clic Catálogo en hero -> scrollea automáticamente hacia los productos
  const catalogoLink = document.getElementById('nav-catalogo-link');
  if (catalogoLink) {
    catalogoLink.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection('catalogo');
    });
  }

  // Clic Catálogo en navbar -> scrollea automáticamente hacia los productos
  const heroExploreBtn = document.getElementById('hero-explore-btn');
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection('catalogo');
    });
  }
}

function scrollToSection(sectionId) {
  const target = document.getElementById(sectionId);
  if (target) {
    const navbarOffset = 112;
    const elementPosition = target.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - navbarOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

// CARRITO DE COMPRA

function initCartEvents() {
  const cartBtn = document.getElementById('open-cart-btn');
  const heroCartLink = document.getElementById('hero-cart-link');
  const cartDrawer = document.getElementById('cart-drawer-component');

  // Abrir carrito desde botón del header
  if (cartBtn && cartDrawer) {
    cartBtn.addEventListener('click', () => {
      cartDrawer.items = AppState.cart;
      cartDrawer.open();
    });
  }

  // Abrir carrito desde enlace secundario del hero
  if (heroCartLink && cartDrawer) {
    heroCartLink.addEventListener('click', () => {
      cartDrawer.items = AppState.cart;
      cartDrawer.open();
    });
  }

  window.addEventListener('open-cart-drawer', () => {
    if (cartDrawer) {
      cartDrawer.items = AppState.cart;
      cartDrawer.open();
    }
  });

  // Requisito: Evento de agregar al carrito emitido por <product-card>
  window.addEventListener('add-to-cart', (e) => {
    const product = e.detail.product;
    addToCart(product);
  });

  // Evento emitido por el drawer cuando se modifica la cantidad o se elimina un item
  window.addEventListener('cart-changed', (e) => {
    AppState.cart = e.detail.items;
    saveCartToStorage();
    updateCartBadge();
  });

  // Evento emitido al finalizar pedido
  window.addEventListener('order-completed', () => {
    AppState.cart = [];
    saveCartToStorage();
    updateCartBadge();
  });
}

function addToCart(product) {
  const existingItem = AppState.cart.find(item => item.id === product.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    AppState.cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1
    });
  }

  saveCartToStorage();
  updateCartBadge();

  // Actualizar drawer
  const cartDrawer = document.getElementById('cart-drawer-component');
  if (cartDrawer) {
    cartDrawer.items = AppState.cart;
  }

  showToast(`Añadido al carrito: ${product.name}`);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-counter');
  if (!badge) return;

  // icono de carrito cuenta el número de productos agregados
  const totalCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalCount;

  // Animación bump para feedback táctil
  badge.classList.remove('bump');
  void badge.offsetWidth; // Forzar reflujo
  badge.classList.add('bump');
}
// FILTRADO DE CATEGORIAS

function initFilterEvents() {
  const pills = document.querySelectorAll('.filter-pill');
  pills.forEach(pill => {
    pill.addEventListener('click', (e) => {
      pills.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('aria-selected', 'false');
      });
      e.currentTarget.classList.add('active');
      e.currentTarget.setAttribute('aria-selected', 'true');

      AppState.activeCategory = e.currentTarget.getAttribute('data-category');
      renderAllProductsGrid();
    });
  });
}