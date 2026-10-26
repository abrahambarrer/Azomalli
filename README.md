# Las Glorias de Azomalli · E-commerce de Panadería Artesanal

Plataforma de comercio electrónico para la panadería artesanal **"Las Glorias de Azomalli"**. El proyecto cuenta con una arquitectura desacoplada que separa claramente la interfaz de usuario (**Frontend en React**) de la lógica de negocio y persistencia (**Backend en Flask con PostgreSQL**).

---

## 🛠️ Tecnologías Utilizadas

### Backend
* **Python 3.12+** con **Flask 3.0** (Arquitectura REST API / Headless).
* **PostgreSQL** como motor de base de datos relacional (con soporte de ENUMs nativos y tipos JSONB).
* **SQLAlchemy 2.0** como ORM para el modelado de datos.
* **Alembic** para el control de versiones y migraciones del esquema.
* **psycopg 3** como adaptador de conexión a PostgreSQL.

### Frontend
* **React 18** (Single Page Application - SPA).
* **JavaScript (ES6+)** y **CSS3** nativo modular.
* Sistema de diseño basado en especificaciones de Figma con variables de tokens y tipografías Google Fonts (*DM Serif Display* e *Inter*).
* **Custom Hooks** para gestión desacoplada del estado del carrito (`useCart`), catálogo de productos (`useProducts`) y notificaciones flotantes (`useToast`).

### Almacenamiento y Medios
* **Cloudinary**: Distribución optimizada de imágenes del catálogo mediante URLs públicas HTTPS.

---

## 📁 Estructura del Proyecto

```text
Azomalli/
├── backend/                   # Capa de Negocio, Datos y API REST
│   ├── app/
│   │   ├── blueprints/        # Endpoints (api y health check)
│   │   ├── models/            # Modelos SQLAlchemy (Producto, Pedido, Cuenta, etc.)
│   │   ├── config.py          # Configuración y variables de entorno
│   │   ├── database.py        # Instancia de SQLAlchemy (db)
│   │   └── services.py        # Consultas y lógica de negocio
│   ├── migrations/            # Historial de migraciones con Alembic
│   ├── templates/             # Plantillas para correos transaccionales
│   ├── alembic.ini            # Configuración de migraciones
│   ├── requirements.txt       # Dependencias de Python
│   └── run.py                 # Punto de entrada de Flask
│
├── frontend/                  # Capa de Presentación e Interacción (React)
│   ├── public/                # Archivo base index.html y recursos estáticos
│   ├── src/
│   │   ├── assets/            # Estilos globales y tokens CSS
│   │   ├── components/        # Componentes UI (Navbar, Hero, ProductCard, CartDrawer...)
│   │   ├── hooks/             # Custom Hooks (useProducts, useCart, useToast)
│   │   ├── pages/             # Vistas de la aplicación (HomePage)
│   │   ├── App.js             # Componente raíz
│   │   └── index.js           # Montaje del DOM
│   └── package.json           # Dependencias, scripts y proxy a la API de Flask
│
└── README.md                  # Documentación general del repositorio
```

---

## Configuración Inicial

### Prerrequisitos
* **Python 3.10+**
* **Node.js 18+** y **npm**
* Servidor **PostgreSQL** en ejecución local

---

### Paso 1: Configurar y Levantar el Backend (Flask API)

1. Abre una terminal y dirígete a la carpeta `backend`:
   ```bash
   cd backend
   ```

2. Crea y activa el entorno virtual de Python:
   * **Windows (PowerShell):**
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```
   * **macOS / Linux:**
     ```bash
     python3 -m venv .venv
     source .venv/bin/activate
     ```

3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configura el archivo de variables de entorno `.env` (si aún no existe, crea una copia de `.env.example`):
   ```env
   DATABASE_URL=postgresql+psycopg://tu_usuario:tu_contraseña@localhost:5432/Azomalli
   SECRET_KEY=tu_clave_secreta_aqui
   FLASK_APP=run.py
   FLASK_DEBUG=1
   ```

5. Aplica las migraciones en PostgreSQL con Alembic:
   ```bash
   alembic upgrade head
   ```

6. Inicia el servidor de Flask:
   ```bash
   flask --app run.py run --debug
   ```
   * El backend quedará disponible en: `http://127.0.0.1:5000`
   * Puedes verificar que la API está lista abriendo en el navegador o con `curl`:
     * Estado: [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
     * Catálogo en JSON: [http://127.0.0.1:5000/api/products](http://127.0.0.1:5000/api/products)

---

### Paso 2: Configurar y Levantar el Frontend (React)

1. Abre una **segunda terminal** y dirígete al directorio `frontend`:
   ```bash
   cd frontend
   ```

2. Instala las dependencias de Node:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo de React:
   ```bash
   npm start
   ```
   * La aplicación se abrirá automáticamente en tu navegador en [http://localhost:3000](http://localhost:3000).
   * Las peticiones a `/api/...` se canalizan transparentemente hacia el puerto `5000` de Flask gracias a la configuración de proxy en `frontend/package.json`.

---

### Paso 3: Flujo de Pruebas de la Aplicación

Con ambos servidores corriendo, ingresa a [http://localhost:3000](http://localhost:3000) para comprobar la integración:

1. **Catálogo dinámico desde PostgreSQL**: Observa los productos cargados directamente desde la tabla `Producto`, incluyendo nombres, descripciones, precios en MXN e imágenes servidas desde Cloudinary.
2. **Filtros por categoría**: Selecciona las pestañas `Todos`, `Dulces` o `Salados` para filtrar el catálogo en tiempo real según el ENUM `categoria_producto`.
3. **Sección de temporada**: Los productos con `es_temporada: true` aparecerán destacados en su respectiva sección.
4. **Cesta de pan (Carrito reactivo)**:
   - Haz clic en *"Agregar al carrito"* en cualquier pan; verás la notificación flotante (*toast*) y la animación del contador en la cabecera.
   - Abre la cesta presionando el icono del carrito en el navbar.
   - Incrementa (+), disminuye (-) o elimina productos y observa la actualización del subtotal estimado.
   - Cierra o recarga el navegador: el estado de tu cesta persiste en `localStorage`.
