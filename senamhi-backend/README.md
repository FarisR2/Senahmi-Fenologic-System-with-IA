## Deployment# 🚀 SENAMHI Backend - Manual de Cultivo

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository enfocado en la gestión fenológica agrícola.

## 📝 Descripción

Este backend está desarrollado con **NestJS (v11.x)** y **TypeScript**. El proyecto orquesta la relación entre Estaciones (**Station**), Cultivos (**Cultive**) y sus respectivas Fases Fenológicas (**Fenologic**).

> **Nota:** Actualmente, la persistencia se maneja **in-memory**, lo que lo hace ideal para prototipado rápido. Los datos se reinician al apagar el servidor.

---

## 🏗️ Arquitectura del Proyecto

El proyecto sigue una estructura modular para facilitar el mantenimiento y la escalabilidad:


* **Controllers**: Endpoints REST estandarizados.
* **Services**: Lógica de negocio y persistencia temporal.

* **DTOs**: Objetos de transferencia con validación mediante `class-validator`.
* **Interfaces**: Contratos de tipado para las entidades del sistema.

---

## 🛠️ Instalación y Ejecución


Para poner en marcha el servidor localmente, sigue estos pasos:


```bash
# 1. Instalar dependencias
$ npm install


# 2. Ejecutar en modo watch (desarrollo)
$ npm run start:dev

# 3. Compilar para producción
$ npm run build
Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
