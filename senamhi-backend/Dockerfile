# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias primero (aprovechar cache de capas)
COPY package*.json ./
RUN npm install

# Copiar el resto del código y compilar
COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS runtime

WORKDIR /app

# Copiar solo lo necesario para ejecutar
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist

# Instalar solo dependencias de producción para ahorrar espacio
RUN npm install --omit=dev

# Exponer el puerto del backend (ajustar si usas otro)
EXPOSE 3000

CMD ["node", "dist/main"]
