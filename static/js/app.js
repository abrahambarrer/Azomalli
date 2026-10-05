/**
 * APLICACIÓN PRINCIPAL - LAS GLORIAS DE AZOMALLI
 * Gestión de Estado, Carga de Datos y Eventos de Usuario
 */

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
  initPersistedState();
  initNavigationEvents();
  initUserDropdownEvents();
  initCartEvents();
  initOrdersModalEvents();
  initFilterEvents();
  
  await fetchProducts();
  renderCatalogSections();
});

/* ==========================================================================
   1. GESTIÓN Y PERSISTENCIA DE ESTADO
   ========================================================================== */

function initPersistedState() {
  // Cargar usuario guardado en localStorage si existe
  try {
    const savedUser = localStorage.getItem('azomalli_user');
    if (savedUser) {
      AppState.user = JSON.parse(savedUser);
      updateUserNavbarUI();
      const profileDropdown = document.querySelector('user-profile-dropdown');
      if (profileDropdown) profileDropdown.user = AppState.user;
    }
  } catch (e) {
    console.error('Error al cargar estado de usuario:', e);
  }

  // Cargar carrito persistido
  try {
    const savedCart = localStorage.getItem('azomalli_cart');
    if (savedCart) {
      AppState.cart = JSON.parse(savedCart);
      updateCartBadge();
      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer) cartDrawer.items = AppState.cart;
    }
  } catch (e) {
    console.error('Error al cargar estado del carrito:', e);
  }

  // Cargar historial de pedidos
  try {
    const savedOrders = localStorage.getItem('azomalli_orders');
    if (savedOrders) {
      AppState.orders = JSON.parse(savedOrders);
    }
  } catch (e) {
    console.error('Error al cargar pedidos:', e);
  }
}

function saveCartToStorage() {
  try {
    localStorage.setItem('azomalli_cart', JSON.stringify(AppState.cart));
  } catch (e) {
    console.error('Error guardando carrito:', e);
  }
}

function saveUserToStorage() {
  try {
    if (AppState.user.isLoggedIn) {
      localStorage.setItem('azomalli_user', JSON.stringify(AppState.user));
    } else {
      localStorage.removeItem('azomalli_user');
    }
  } catch (e) {
    console.error('Error guardando usuario:', e);
  }
}

function saveOrdersToStorage() {
  try {
    localStorage.setItem('azomalli_orders', JSON.stringify(AppState.orders));
  } catch (e) {
    console.error('Error guardando pedidos:', e);
  }
}

/* ==========================================================================
   2. OBTENCIÓN DE DATOS (API FLASK / JSON)
   ========================================================================== */

async function fetchProducts() {
  try {
    const res = await fetch('/api/products');
    if (!res.ok) throw new Error('Respuesta no satisfactoria de la API');
    const data = await res.json();
    AppState.products = data.products || [];
  } catch (err) {
    console.warn('Recuperando datos desde fallback JSON local...', err);
    // Fallback de respaldo con los datos de muestra del proyecto
    AppState.products = [
      {
        id: 1,
        name: "Conchas",
        description: "Una cubierta delicada y una miga suave. El clásico que siempre encuentra lugar en la mesa.",
        tag: "PARA ACOMPAÑAR TU CAFÉ",
        price: 18.00,
        image: "/static/images/pan_conchas.png",
        is_bestseller: true,
        is_seasonal: false,
        category: "Dulces"
      },
      {
        id: 2,
        name: "Roles de canela",
        description: "Capas de masa, un abrazo de canela y ese aroma que hace especial una pausa.",
        tag: "UN GUSTO SIN PRISA",
        price: 26.00,
        image: "/static/images/pan_roles.png",
        is_bestseller: true,
        is_seasonal: false,
        category: "Dulces"
      },
      {
        id: 3,
        name: "Panqué casero",
        description: "Una rebanada generosa, de textura tierna, para disfrutar a solas o partir entre todos.",
        tag: "MEJOR SI SE COMPARTE",
        price: 32.00,
        image: "/static/images/pan_panque.png",
        is_bestseller: true,
        is_seasonal: false,
        category: "Especiales"
      },
      {
        id: 4,
        name: "Conchas de vainilla",
        description: "Una versión especial con toque dulce y una presentación ideal para compartir en casa.",
        tag: "PARA UN MOMENTO ESPECIAL",
        price: 20.00,
        image: "/static/images/pan_vainilla.png",
        is_bestseller: false,
        is_seasonal: true,
        category: "Dulces"
      },
      {
        id: 5,
        name: "Pan de chocolate",
        description: "Un pan tierno con trozos de chocolate para acompañar el café, el té o un momento dulce.",
        tag: "PARA EL POSTRE CASERO",
        price: 24.00,
        image: "/static/images/pan_chocolate.png",
        is_bestseller: false,
        is_seasonal: true,
        category: "Dulces"
      },
      {
        id: 6,
        name: "Bolillo integral",
        description: "Una opción más rústica, con textura suave y un perfil ideal para acompañar o compartir.",
        tag: "PARA CADA DÍA",
        price: 12.00,
        image: "/static/images/pan_bolillo.png",
        is_bestseller: false,
        is_seasonal: true,
        category: "Rústicos"
      }
    ];
  }
}

/* ==========================================================================
   3. RENDERIZADO DEL CATÁLOGO (3 SECCIONES)
   ========================================================================== */

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

/* ==========================================================================
   4. EVENTOS DE NAVEGACIÓN Y SCROLL SUAVE (REQUISITO CATÁLOGO)
   ========================================================================== */

function initNavigationEvents() {
  // Requisito: Al hacer clic en Catálogo, scrollea automáticamente hacia abajo a los productos
  const catalogoLink = document.getElementById('nav-catalogo-link');
  if (catalogoLink) {
    catalogoLink.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection('catalogo');
    });
  }

  const heroExploreBtn = document.getElementById('hero-explore-btn');
  if (heroExploreBtn) {
    heroExploreBtn.addEventListener('click', (e) => {
      e.preventDefault();
      scrollToSection('catalogo');
    });
  }

  const footerCtaBtn = document.getElementById('footer-cta-btn');
  if (footerCtaBtn) {
    footerCtaBtn.addEventListener('click', () => {
      scrollToSection('catalogo');
      showToast('¡Explora nuestros panes y elige los tuyos!');
    });
  }

  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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

/* ==========================================================================
   5. EVENTOS DEL DROPDOWN DE PERFIL (ESTILO AMAZON)
   ========================================================================== */

function initUserDropdownEvents() {
  const userBtn = document.getElementById('user-dropdown-btn');
  const dropdown = document.getElementById('profile-dropdown');

  if (userBtn && dropdown) {
    // Requisito: Toggle del dropdown al hacer clic
    userBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isExpanded = userBtn.getAttribute('aria-expanded') === 'true';
      userBtn.setAttribute('aria-expanded', !isExpanded);
      dropdown.classList.toggle('is-open');
    });

    // Cerrar si se hace clic fuera del menú
    document.addEventListener('click', (e) => {
      if (!userBtn.contains(e.target) && !dropdown.contains(e.target)) {
        userBtn.setAttribute('aria-expanded', 'false');
        dropdown.classList.remove('is-open');
      }
    });
  }

  // Escuchar evento personalizado: Usuario inició sesión
  window.addEventListener('user-login', (e) => {
    AppState.user = e.detail;
    saveUserToStorage();
    updateUserNavbarUI();
    showToast(`¡Bienvenido de vuelta, ${AppState.user.name}!`);
    if (dropdown) dropdown.classList.remove('is-open');
    if (userBtn) userBtn.setAttribute('aria-expanded', 'false');
  });

  // Escuchar evento personalizado: Cerrar sesión
  window.addEventListener('user-logout', () => {
    const prevName = AppState.user.name;
    AppState.user = { isLoggedIn: false, name: '', email: '' };
    saveUserToStorage();
    updateUserNavbarUI();
    showToast(`Hasta pronto, ${prevName}. Sesión cerrada.`);
    if (dropdown) dropdown.classList.remove('is-open');
    if (userBtn) userBtn.setAttribute('aria-expanded', 'false');
  });
}

function updateUserNavbarUI() {
  const greetingEl = document.getElementById('nav-user-greeting');
  const nameEl = document.getElementById('nav-user-name');

  if (AppState.user && AppState.user.isLoggedIn) {
    // Requisito: Muestra el nombre del usuario si ya inició sesión
    if (greetingEl) greetingEl.textContent = `Hola, ${AppState.user.name.split(' ')[0]}`;
    if (nameEl) nameEl.textContent = 'Mi Cuenta';
  } else {
    if (greetingEl) greetingEl.textContent = 'Hola, Identifícate';
    if (nameEl) nameEl.textContent = 'Mi Perfil';
  }
}

/* ==========================================================================
   6. EVENTOS Y ESTADO DEL CARRITO DE COMPRAS
   ========================================================================== */

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
  window.addEventListener('order-completed', (e) => {
    const orderData = e.detail;
    AppState.cart = [];
    saveCartToStorage();
    updateCartBadge();

    // Guardar en el historial de pedidos
    const newOrder = {
      id: orderData.order_id,
      date: new Date().toLocaleDateString('es-MX', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      total: orderData.total,
      itemsCount: orderData.items_count,
      status: 'Horneando con amor'
    };
    AppState.orders.unshift(newOrder);
    saveOrdersToStorage();

    showToast(orderData.message || `¡Pedido ${orderData.order_id} registrado con éxito!`);
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

  // Actualizar drawer si ya está instanciado
  const cartDrawer = document.getElementById('cart-drawer-component');
  if (cartDrawer) {
    cartDrawer.items = AppState.cart;
  }

  showToast(`Añadido al carrito: ${product.name}`);
}

function updateCartBadge() {
  const badge = document.getElementById('cart-counter');
  if (!badge) return;

  // Requisito: Ícono de carrito cuenta el número de productos agregados
  const totalCount = AppState.cart.reduce((sum, item) => sum + item.quantity, 0);
  badge.textContent = totalCount;

  // Animación bump para feedback táctil
  badge.classList.remove('bump');
  void badge.offsetWidth; // Forzar reflujo
  badge.classList.add('bump');
}

/* ==========================================================================
   7. EVENTOS DE MIS PEDIDOS (MODAL)
   ========================================================================== */

function initOrdersModalEvents() {
  const ordersLink = document.getElementById('nav-pedidos-link');
  const modal = document.getElementById('orders-modal');
  const closeBtn = document.getElementById('close-orders-modal');

  if (ordersLink && modal) {
    ordersLink.addEventListener('click', (e) => {
      e.preventDefault();
      openOrdersModal();
    });
  }

  window.addEventListener('open-orders-modal', () => {
    openOrdersModal();
  });

  if (closeBtn && modal) {
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('is-open');
        modal.setAttribute('aria-hidden', 'true');
      }
    });
  }
}

function openOrdersModal() {
  const modal = document.getElementById('orders-modal');
  const modalBody = document.getElementById('orders-modal-body');
  if (!modal || !modalBody) return;

  if (AppState.orders.length === 0) {
    modalBody.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#79685C" stroke-width="1.5">
          <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
          <path d="M3 6h18"></path>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <p>No tienes pedidos en curso aún.</p>
        <small>¡Agrega tus panes preferidos al carrito y haz tu primer encargo!</small>
      </div>
    `;
  } else {
    modalBody.innerHTML = `
      <div class="orders-list">
        ${AppState.orders.map(order => `
          <div class="order-card-item">
            <div class="order-card-header">
              <span class="order-card-id">${order.id}</span>
              <span class="order-card-status">${order.status}</span>
            </div>
            <div style="font-size: 13px; color: var(--color-text-muted); margin-bottom: 6px;">
              <span>Fecha: ${order.date}</span>
            </div>
            <div style="display: flex; justify-content: space-between; font-weight: 600; font-size: 14px;">
              <span>${order.itemsCount} productos</span>
              <span style="color: var(--color-primary);">$${(order.total || 0).toFixed(2)} MXN</span>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
}

/* ==========================================================================
   8. EVENTOS DE FILTRADO DE CATEGORÍAS (TODOS LOS PRODUCTOS)
   ========================================================================== */

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

/* ==========================================================================
   9. SISTEMA DE TOAST NOTIFICATIONS
   ========================================================================== */

function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EFB587" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
