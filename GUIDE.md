# Guía de Configuración y Desarrollo - SENAMHI Fenologic System

Este documento detalla los pasos para poner en marcha el sistema y las reglas de contribución para mantener la calidad arquitectónica.

## 🚀 Inicio Rápido (Infraestructura)

El sistema ahora requiere una base de datos PostgreSQL. Se ha automatizado usando Docker.

1.  **Levantar Base de Datos**:
    ```bash
    docker compose up -d
    ```
    *Esto levantará un contenedor con PostgreSQL en el puerto 5432.*

2.  **Configuración de Entorno**:
    -   En `senamhi-backend/`: Copia `.env.example` a `.env` y ajusta si es necesario.
    -   En `senamhi-frontend/`: Copia `.env.example` a `.env` y verifica la URL de la API.

## 🛠️ Desarrollo Backend (NestJS)

1.  Instalar dependencias: `npm install`
2.  Correr en modo desarrollo: `npm run start:dev`
3.  **Nota**: La base de datos se sincroniza automáticamente en modo dev (`synchronize: true`).

## 💻 Desarrollo Frontend (React 19)

1.  Instalar dependencias: `npm install`
2.  Correr: `npm run dev`
3.  **Configuración API**: Todas las llamadas deben usar `API_CONFIG` de `src/config/api.config.ts`. No uses URLs hardcoded.

## 📜 Flujo de Trabajo (Git & Ramas)

Para mantener la rama `main` siempre funcional, seguiremos este flujo:

1.  **Nuevas Funcionalidades/Fixes**: Siempre crear una rama de feature:
    ```bash
    git checkout -b feature/nombre-de-la-mejora
    ```
2.  **Push a GitHub**: Sube tu rama para que sea visible y se pueda revisar:
    ```bash
    git push origin feature/nombre-de-la-mejora
    ```
3.  **Merge**: Solo una vez verificado que todo funciona (tests pasando y compilación exitosa), se mezcla a `main`.

## 🛡️ Seguridad

- **NUNCA** subas archivos `.env` al repositorio. Están incluidos en `.gitignore`.
- Usa siempre `.env.example` para documentar qué variables son necesarias.
