# CANACCESIBLE

## Descripción

**CanAccesible** es una plataforma web canaria que permite a los ciudadanos:

- **Reportar incidencias de accesibilidad** en espacios públicos o privados.
- **Compartir buenas prácticas de accesibilidad** para inspirar y mejorar la inclusión.

El proyecto busca promover una **sociedad más accesible** y consciente de las necesidades de todas las personas, combinando un diseño moderno y accesible con herramientas fáciles de usar para la comunidad.

## Tecnologías principales

- **Frontend:** ![React](https://img.shields.io/badge/React-19.1-blue?logo=react&logoColor=white)
- **Estilos:** ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-blue?logo=tailwind-css&logoColor=white)
- **Backend:** ![ExpressJS](https://img.shields.io/badge/Express-5.1-black?logo=express&logoColor=white)
- **ORM:** ![Sequelize](https://img.shields.io/badge/Sequelize-6.37-blue?logo=sequelize&logoColor=white)
- **Base de datos:** ![MySQL](https://img.shields.io/badge/MySQL-8-blue?logo=mysql&logoColor=white)
- **Control de versiones:** ![Git](https://img.shields.io/badge/Git-2.41-red?logo=git&logoColor=white)
- **Gestión de endpoints:** ![Postman](https://img.shields.io/badge/Postman-orange?logo=postman&logoColor=white)

### Tecnologías adicionales

- **React-Router-Dom:** Librería que permite gestionar rutas y navegación dentro de la aplicación React de manera dinámica.
- **Axios:** Cliente HTTP para hacer solicitudes al backend, manejar APIs y recibir respuestas de forma sencilla.
- **BCrypt:** Librería para encriptar contraseñas y asegurar la información sensible de los usuarios.
- **Motion (Framer Motion):** Librería para animaciones y transiciones fluidas en los componentes React, mejorando la experiencia de usuario.

## Estructura del proyecto

```
frontend/
├── public/
├── src/
│ ├── assets/ # Imágenes, logos, ...
│ ├── components/
│ ├── pages/
│ ├── services/ # Lógica de llamadas a APIs
│ ├── App.jsx
│ └── index.js
└── package.json # Dependencias y scripts del frontend

backend/
├── config/ # Configuración del servidor y DB
├── controllers/ # Controladores de rutas
├── migrations/ # Migraciones de base de datos
├── models/ # Modelos de Sequelize
├── routes/ # Definición de rutas
├── seeders/ # Datos iniciales de la DB
├── db.js # Conexión principal a la base de datos
└── package.json # Dependencias y scripts del backend

docs/ # Documentación, diagramas, o recursos adicionales
```

## Diagrama de casos de uso

![Diagrama de casos de uso](./docs/use-case-diagram.png)

## Diagrama Entidad-Relación

![Diagrama-ER](./docs/er-diagram.jpg)

## Instalación de proyecto

### Requisitos previos

- Tener descargado NodeJS, NPM y MySQL.

### Clonar repositorio

```
git clone https://github.com/devcarlosperez/CanAccesible
```

### Configuración del backend

- Entrar al directorio del backend

```
cd backend
```

- Instalar dependencias

```
npm install
```

- Ejecutar migraciones y seeders

```
NODE_ENV=development npx sequelize-cli db:migrate

NODE_ENV=development npx sequelize-cli db:seed:all
```

- Iniciar backend

```
node index.js
```

### Configuración del frontend

```

cd frontend

npm install

npm run dev

```

## Enlaces

- **Documentación de la API en Postman:** [Acceder aquí](https://documenter.getpostman.com/view/48689306/2sB3Wnxhsu)

## Autores

- Jonathan Morera Apaza
- Carlos Pérez Santana
- Iriome Matos González
