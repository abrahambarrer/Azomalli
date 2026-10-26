# Imagen base ligera de Python
FROM python:3.12-slim

# Evitar escritura de bytecode y habilitar salida en tiempo real
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

# Instalar dependencias del sistema requeridas para compilación y utilidades
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Copiar e instalar dependencias de Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copiar el código fuente del backend
COPY . .

# Exponer el puerto de Flask
EXPOSE 5000

# Arrancar: ejecutar migraciones con Alembic, poblar la BD si está vacía e iniciar Flask
CMD ["sh", "-c", "alembic upgrade head && python seed.py && flask run --host=0.0.0.0 --port=5000"]
