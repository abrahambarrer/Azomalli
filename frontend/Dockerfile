# Imagen base de Node.js
FROM node:20-alpine

WORKDIR /app

# Copiar descriptores de paquetes
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el código fuente
COPY . .

# Variables de entorno por defecto
ENV PORT=3000 \
    CHOKIDAR_USEPOLLING=true

# Exponer el puerto de React
EXPOSE 3000

# Iniciar servidor de desarrollo de React
CMD ["npm", "start"]
