# Las Glorias de Azomalli · E-commerce de Panadería Artesanal

Primer esqueleto funcional del proyecto de e-commerce para la panadería artesanal **"Las Glorias de Azomalli"**, diseñado a partir del recurso oficial de [Figma (Node ID: 4:1609)](https://www.figma.com/design/nLH5BqQIaC1RCN2sDFFRpv/Azomalli?node-id=4-1609&t=DC6BFnXVbwZpIQAe-4).

---

## 📋 Cumplimiento de Requisitos

1. **Header y Barra de Navegación:**
   - **Nombre de la panadería:** *"Las Glorias de Azomalli"* con su logotipo original extraído del diseño.
   - **Catálogo:** Enlace con scroll automático y suave (`scroll-behavior: smooth`) hacia la sección del catálogo en la misma página.
   - **Mis pedidos:** Acceso modal con listado dinámico de pedidos realizados y estado del horneado en tiempo real.
   - **Mi perfil (estilo Amazon):** Dropdown con flecha superior estilo flyout de Amazon. Permite registrarse o iniciar sesión con nombre y correo. Si el usuario ya inició sesión, refleja el saludo y nombre de forma reactiva en el navbar (`"Hola, [Nombre]"` / `"Mi Cuenta"`), además de permitir ver pedidos y cerrar sesión.
   - **Ícono de carrito:** Contenedor de 54x54 px con badge interactivo que cuenta en tiempo real el total de piezas agregadas. Al hacer clic, despliega un **drawer lateral** con cantidades editables (+ / -), opción de eliminar producto, cálculo de subtotal y botón de confirmación de encargo.

2. **Catálogo con tres secciones:**
   - **Productos más vendidos:** Conchas tradicionales, Roles de canela, Panqué casero.
   - **Productos de temporada:** Conchas de vainilla, Pan de chocolate, Bolillo integral.
   - **Todos los productos:** Cuadrícula completa con filtros por botones tipo píldora (*Todos*, *Dulces*, *Rústicos*, *Especiales*).

3. **Al menos 2 Componentes Propios:**
   - `<product-card>` ([`ProductCard`](file:///D:/Cursos/Azomalli/static/js/components/product-card.js)): Web Component que encapsula la imagen, precio en MXN, etiqueta de ocasión, descripción y botón interactivo con feedback táctil y emisión de eventos `add-to-cart`.
   - `<user-profile-dropdown>` ([`UserProfileDropdown`](file:///D:/Cursos/Azomalli/static/js/components/profile-dropdown.js)): Web Component para la gestión de la sesión del usuario estilo Amazon.
   - `<cart-drawer>` ([`CartDrawer`](file:///D:/Cursos/Azomalli/static/js/components/cart-drawer.js)): Web Component que gestiona el panel lateral del carrito, operaciones de cantidad y simulación de compra.

4. **Manejo de Estado (Reactivo):**
   - Estado global (`AppState` en [`app.js`](file:///D:/Cursos/Azomalli/static/js/app.js)) que sincroniza en memoria y en `localStorage`:
     - Artículos y cantidades del carrito (`cart`).
     - Contador total en el badge del navbar.
     - Sesión activa del usuario (`user`).
     - Historial de pedidos generados (`orders`).
     - Categoría activa seleccionada (`activeCategory`).

5. **Eventos de Usuario:**
   - Clic en *"Agregar al carrito"* con animación y actualización de estado.
   - Scroll automático al presionar *"Catálogo"* o *"Explorar catálogo"*.
   - Toggle y cierre fuera de foco del dropdown *"Mi Perfil"*.
   - Envío de formulario para iniciar sesión o registrarse.
   - Filtro reactivo por categorías de pan.
   - Control de cantidades (+ / -) y vaciado de items en el carrito.
   - Clic en *"Volver arriba"* en el footer.

6. **Datos de Ejemplo y Backend Flask:**
   - Archivo local [`data/products.json`](file:///D:/Cursos/Azomalli/data/products.json) con los productos, precios, categorías y rutas a imágenes.
   - Backend Flask en [`app.py`](file:///D:/Cursos/Azomalli/app.py) con rutas:
     - `GET /`: Renderiza la landing page.
     - `GET /api/products`: Devuelve el catálogo en formato JSON (soporta filtros por query params).
     - `POST /api/orders`: Procesa el carrito y genera un número de pedido oficial (ej. `GLO-XXXXXX`).
   - Dependencias fijadas en [`requirements.txt`](file:///D:/Cursos/Azomalli/requirements.txt).

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Activar el entorno virtual

En PowerShell o terminal de Windows:
```powershell
.\.venv\Scripts\Activate.ps1
```

*(Si no tienes las dependencias instaladas, ejecuta: `pip install -r requirements.txt`)*

### 2. Iniciar el servidor de Flask

```powershell
flask --app app.py run --debug
```

### 3. Abrir en el navegador

Visita: [http://127.0.0.1:5000](http://127.0.0.1:5000)
