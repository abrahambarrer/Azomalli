# Las Glorias de Azomalli · E-commerce de Panadería Artesanal

Primer esqueleto funcional del proyecto de e-commerce para la panadería artesanal **"Las Glorias de Azomalli"**, diseñado a partir del recurso oficial de [Figma (Node ID: 4:1609)](https://www.figma.com/design/nLH5BqQIaC1RCN2sDFFRpv/Azomalli?node-id=4-1609&t=DC6BFnXVbwZpIQAe-4).

---

## 📋 Cumplimiento de Requisitos

1. **Header y Barra de Navegación:**
   - **Nombre de la panadería:** *"Las Glorias de Azomalli"* con su logo.
   - **Catálogo:** Enlace con scroll automático hacia la sección del catálogo en la misma página.
   - **Ícono de carrito:** Al hacer clic, despliega un **drawer lateral** con cantidades editables (+ / -), opción de eliminar producto, cálculo de subtotal y botón de confirmación de encargo.

2. **Catálogo con tres secciones:**
   - **Productos más vendidos**.
   - **Productos de temporada**.
   - **Todos los productos**.

3. **Componentes:**
   - `<product-card>` ([`ProductCard`](file:///D:/Cursos/Azomalli/static/js/components/product-card.js)): Web Component que encapsula la imagen, precio en MXN, etiqueta de ocasión, descripción y botón interactivo con feedback táctil y emisión de eventos `add-to-cart`.
   - `<cart-drawer>` ([`CartDrawer`](file:///D:/Cursos/Azomalli/static/js/components/cart-drawer.js)): Web Component que gestiona el panel lateral del carrito, operaciones de cantidad y simulación de compra.

4. **Eventos de Usuario:**
   - Clic en *"Agregar al carrito"* con animación y actualización de estado.
   - Scroll automático al presionar *"Catálogo"* o *"Explorar catálogo"*.
   - Filtro por categorías de pan.
   - Control de cantidades (+ / -) y vaciado de items en el carrito.

6. **Datos de Ejemplo y Backend Flask:**
   - Archivo local [`data/products.json`](file:///D:/Cursos/Azomalli/data/products.json) con los productos, precios, categorías y rutas a imágenes.
   - Backend Flask en [`app.py`](file:///D:/Cursos/Azomalli/app.py) con rutas:
     - `GET /`: Renderiza la landing page.
     - `GET /api/products`: Devuelve el catálogo en formato JSON (soporta filtros por query params).
   - Dependencias fijadas en [`requirements.txt`](file:///D:/Cursos/Azomalli/requirements.txt).

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Activar el entorno virtual

En PowerShell o terminal de Windows:
```shell
python -m venv .venv
.\.venv\Scripts\Activate
```

*(Si no tienes las dependencias instaladas, ejecuta: `pip install -r requirements.txt`)*

### 2. Iniciar el servidor de Flask

```powershell
flask --app run.py run --debug
```

### 3. Abrir en el navegador

Visita: [http://127.0.0.1:5000](http://127.0.0.1:5000)
