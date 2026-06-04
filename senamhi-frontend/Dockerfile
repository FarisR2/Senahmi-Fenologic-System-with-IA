# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Instalar dependencias
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copiar código y build
COPY . .
RUN npm run build

# Stage 2: Production with Nginx
FROM nginx:alpine

# Copiar los archivos estáticos desde el builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de Nginx para manejar rutas de React
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
