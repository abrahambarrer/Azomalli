# Las Glorias de Azomalli · Frontend en React

Aplicación frontend moderna y desacoplada construida con **React** para la panadería artesanal **"Las Glorias de Azomalli"**.

---

## 🏛️ Separación de Responsabilidades

El proyecto está dividido en dos capas independientes:

1. **`backend/` (Capa de API y Persistencia)**:
   - Framework: Flask + SQLAlchemy + Alembic + PostgreSQL.
   - Responsabilidad: Lógica de negocio, modelos de base de datos (`Persona`, `Cuenta`, `Producto`, `Pedido`, etc.), persistencia, migraciones y endpoints REST (`/api/products`, etc.).
   - No gestiona plantillas HTML ni assets de cliente.

2. **`frontend/` (Capa de Presentación e Interacción)**:
   - Framework: React 18.
   - Responsabilidad: Renderizado dinámico del catálogo, panel lateral de carrito (*drawer*), filtros por categoría, animación y estado de UI, almacenamiento local (`localStorage`) y consumo asíncrono de la API mediante hooks personalizados.

---

## 📁 Estructura del Directorio `frontend`

```text
frontend/
├── public/
│   ├── images/              # Imágenes públicas estáticas (logos, panes, hero)
│   └── index.html           # Plantilla base HTML con tipografías Google Fonts
├── src/
│   ├── assets/              # Recursos gráficos y hojas de estilo
│   │   ├── images/          # Assets de imagen para importación o fallback
│   │   └── styles/
│   │       └── styles.css   # Sistema de diseño, tokens de color y tipografías
│   ├── components/          # Componentes reutilizables de UI
│   │   ├── BrandBanner.js   # Banner de pilares artesanales
│   │   ├── CartDrawer.js    # Drawer lateral de carrito de compras
│   │   ├── CatalogSection.js# Secciones del catálogo (Más vendidos, Temporada, Todos)
│   │   ├── Footer.js        # Pie de página de la panadería
│   │   ├── Hero.js          # Hero banner principal con llamado a la acción
│   │   ├── Navbar.js        # Barra de navegación con contador y feedback táctil
│   │   ├── ProductCard.js   # Tarjeta de producto individual con precio en MXN
│   │   └── Toast.js         # Notificaciones flotantes interactivas
│   ├── hooks/               # Custom Hooks para lógica de estado desacoplada
│   │   ├── useCart.js       # Estado del carrito, persistencia y simulación/checkout
│   │   ├── useProducts.js   # Carga y filtrado de catálogo de productos
│   │   └── useToast.js      # Gestión de notificaciones en pantalla
│   ├── pages/               # Páginas o vistas principales
│   │   └── HomePage.js      # Página principal de la panadería
│   ├── App.js               # Componente raíz de React
│   └── index.js             # Punto de entrada y montaje en el DOM
├── .gitignore
└── package.json             # Dependencias, scripts y proxy hacia Flask (http://127.0.0.1:5000)
```

---

## 🚀 Puesta en Marcha

### 1. Requisitos
- **Node.js** (v18 o superior recomendado, detectado v22+)
- **npm** (v9 o superior)

### 2. Instalación de dependencias
Desde la raíz del proyecto o desde el directorio `frontend`:

```bash
cd frontend
npm install
```

### 3. Iniciar el servidor de desarrollo
```bash
npm start
```
La aplicación abrirá automáticamente en [http://localhost:3000](http://localhost:3000).

> **Nota sobre el Proxy**: En `package.json` está configurado `"proxy": "http://127.0.0.1:5000"`, lo cual permite que las peticiones a `/api/...` se redirijan automáticamente al backend de Flask cuando esté en ejecución sin problemas de CORS.

### 4. Compilar para producción
```bash
npm run build
```
Genera la carpeta optimizada `build/` lista para ser servida por cualquier servidor web o CDN.
