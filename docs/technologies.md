# Project Technologies and Tools

This document details the technologies, libraries, and external services used in the development of **CanAccesible**, explaining the purpose of each within the project.

---

## Backend

The backend is built on **Node.js** using an architecture based on controllers, services, and models.

### Core & Framework

- **Express.js**: Web framework used to handle REST API routes, middlewares, and server logic.
- **Node.js**: Runtime environment for JavaScript on the server.

### Database & ORM

- **MySQL**: Relational database management system used to persist all system information (users, incidents, logs, etc.).
- **Sequelize**: ORM (Object-Relational Mapper) for Node.js. Used to interact with the MySQL database using models and abstractions instead of raw SQL.
- **Sequelize CLI**: Command-line tool for managing migrations (DB schema changes) and seeders (test data).

### Authentication & Security

- **JSON Web Token (JWT)**: Used for secure user authentication. Tokens are generated upon login and validated on each protected request.
- **LDAP JS**: Client library for interacting with LDAP servers, used for user authentication and directory operations.
- **SSHA Password Hashing**: Secure password hashing implemented in LDAP using the SSHA (Salted SHA) algorithm for credential security.
- **Express Session**: Middleware to handle user sessions.

### File Handling & Storage

- **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads (incident images, avatars, etc.).
- **Multer S3**: Multer extension to upload files directly to S3-compatible services.
- **AWS SDK Client S3**: Official AWS client to interact with object storage services compatible with the S3 API.

### Communication & Notifications

- **Resend**: Email API key platform used to send transactional emails (welcome emails, password resets, etc.) reliably.
- **Socket.io**: Library that enables real-time, bidirectional and event-based communication between the web client and the server.
- **Web Push API**: Browser API for sending push notifications to users. Implemented using the `web-push` library for server-side notification delivery.
- **VAPID (Voluntary Application Server Identification)**: Protocol for identifying the application server when sending push notifications, ensuring secure and authenticated delivery.
- **Service Workers**: JavaScript files that run in the background to handle push notification events and display them to users.
- **EJS**: Template engine used to render dynamic content, possibly for email bodies or simple administrative views.

### Utilities

- **Dotenv**: Loads environment variables from a `.env` file to manage sensitive configurations (API keys, DB credentials) outside the source code.
- **Axios**: Promise-based HTTP client, used if the backend needs to communicate with other external APIs.
- **Swagger UI Express**: Middleware that automatically generates and serves interactive API documentation from a JSON definition.

---

## Frontend

The frontend is a Single Page Application (SPA) built with **React** and **Vite**.

### Core

- **React (v19)**: Main library for building the component-based user interface.
- **Vite (v7)**: Fast build tool (bundler) and development server.
- **React Router DOM**: Handles client-side routing, allowing navigation between different views without page reloads.
- **React Helmet Async**: Component to manage changes to the document head (title, meta tags) dynamically for SEO and accessibility.

### State & Data Management

- **Zustand**: Lightweight and fast library for global application state management (e.g., authenticated user, preferences).
- **Axios**: HTTP client for making requests to the backend API.
- **Socket.io Client**: Client-side library to establish real-time connection with the backend Socket.io server.

### UI & Styles

- **Tailwind CSS (v4)**: "Utility-first" CSS framework for rapidly designing custom components directly in HTML/JSX.
- **Material UI (MUI)**: React component library implementing Material Design. Used for complex pre-built components (buttons, inputs, tables).
- **Emotion**: Library for writing CSS styles with JavaScript, used internally by MUI.
- **Headless UI**: Unstyled UI components (accessible and functional) that integrate well with Tailwind CSS.
- **MUI Icons, Font Awesome & Lucide React**: Comprehensive collections of icons, providing a wide range of SVG icons for the interface.
- **React Toastify**: Library for displaying toast notifications (popups) to provide user feedback (success, error, warning).

### Internationalization (i18n)

- **react-i18next**: Library for internationalization in React applications. Enables multi-language support by managing translations in JSON files. Used for static UI text (labels, buttons, messages) across the application, allowing users to switch between Spanish and English seamlessly.

### Maps & Visualization

- **Leaflet & React Leaflet**: Libraries for displaying interactive maps. Essential for incident geolocation in the project.

### Animations & Interactivity

- **Motion**: Animation library for React (formerly Framer Motion) for smooth transitions and visual effects.
- **Embla Carousel**: Lightweight and extensible carousel for image galleries.
- **OGL**: Minimalist WebGL library, possibly used for advanced visual effects or 3D.

---

## External Services

### Infrastructure & Hosting

- **DigitalOcean Droplet**: Virtual Private Server (VPS) used to host and deploy the backend application and frontend application.
- **DigitalOcean Managed Databases**: Managed MySQL database service, ensuring high availability.
- **Nginx**: High-performance web server used as a reverse proxy to serve the frontend and handle SSL connections.
- **Nominalia**: Domain registrar provider used for `canaccesible.es`.

### Security & SSL

- **Let's Encrypt**: Certificate Authority that provides free X.509 certificates for TLS encryption.

---

## Testing

### Backend Testing

- **Jest**: Delightful JavaScript Testing Framework with a focus on simplicity.
- **Supertest**: Library for testing HTTP servers using a fluent API.
- **Cross-Env**: Script to set environment variables across different platforms (used to set `NODE_ENV=test`).

### Frontend Testing

- **Vitest**: Blazing fast unit test framework powered by Vite.
- **React Testing Library**: Light-weight solution for testing React components.
- **JSDOM**: Implementations of web standards for use with Node.js, allowing DOM testing without a browser.

- **Certbot**: Tool used to automatically obtain and renew SSL certificates from Let's Encrypt.

### Cloud Storage

- **DigitalOcean Spaces**: S3-compatible object storage service. Used to host user-uploaded images (incident photos, profiles, etc.) scalably and externally to the application server.

### Email

- **Gmail SMTP**: Currently configured as the transport provider for sending transactional emails via `nodemailer`.

---

## External APIs

- **Nominatim API (OpenStreetMap)**: Used in the backend for **reverse geocoding**. It converts geographic coordinates (latitude and longitude) provided by the user (when reporting an incident) into a human-readable address (street, city, etc.), which is then stored with the incident details.
- **MyMemory API**: Used in the frontend to provide **automatic translation** of dynamic user-generated content, such as blog article titles and descriptions. It translates from Spanish to English on-demand, allowing users to view content in their preferred language without requiring pre-translated versions.

## Internationalization (i18n)

- **react-i18next**: Implements internationalization for static UI elements. Unlike the MyMemory API (which translates dynamic content in real-time), i18n manages pre-defined translations stored in JSON files (`public/locales/{lang}/translation.json`). This approach is used for interface text (buttons, labels, error messages) and provides instant loading without external API calls, ensuring better performance and offline capability for core UI elements.

---

## Version Control & Collaboration

- **Git**: Distributed version control system used to track changes in the source code during development.
- **GitHub**: Platform for hosting the Git repository, facilitating collaboration, code review, and project management (issues, pull requests).

---

## Development Tools

- **ESLint**: Linting tool to identify and report patterns in JavaScript/React code, ensuring consistency and avoiding errors.
- **Postman**: For testing REST API endpoints during development.
- **Cross-env**: Tool to set environment variables across different operating systems (Windows/Linux) consistently.
- **Docker & Docker Compose**: Containerization platform used to run the OpenLDAP server in an isolated environment, ensuring consistent deployment and easy setup for development.