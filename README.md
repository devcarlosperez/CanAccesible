# CANACCESIBLE

**CanAccesible** is a comprehensive web platform designed for the Canary Islands, empowering citizens to actively participate in improving accessibility across the archipelago.

---

## Overview

The platform serves as a community-driven hub where users can:
- **Report and Interact with Accessibility Incidents:** Document and share both **bad practices** (barriers) and **good practices** (exemplary accessibility) in public and private spaces. Users can also interact with reported incidents by liking, commenting, and following them to stay updated on changes.
- **Interactive Map:** Visualize all reported incidents on an interactive map, providing a clear overview of the accessibility landscape.
- **User Dashboard:** View and manage their own reported incidents.
- **Community Interaction:** Engage with the community by commenting on and liking reports, fostering a collaborative environment.
- **User Support:** Access direct support channels, including chat functionality with administrators and contact information for assistance.
- **Real-time Notifications:** Receive instant push notifications for chat responses, incident updates, and important announcements.
- **Stay Informed:** Read blog articles to stay updated on the latest accessibility trends, news, and improvements within the CanAccesible network.

Our mission is to build a strong community dedicated to transforming the islands into a more accessible place for everyone, combining modern technology with social awareness.

---

## Key Approaches

CanAccesible incorporates several modern web development approaches to enhance functionality, security, and user experience. Below is an overview of the five main approaches used (or planned for future implementation):

### 1. JWT (JSON Web Tokens)

- **Description**: Used for stateless authentication. Tokens are issued upon login and included in API requests to verify user identity without maintaining server-side sessions.

### 2. Sessions

- **Description**: Server-side session management for maintaining user state across requests. Implemented using express-session with Sequelize store for database persistence.

### 3. Web Sockets

- **Description**: Enables real-time, bidirectional communication between client and server for live updates.

### 4. External APIs

- **Description**: Integration with third-party APIs for extended functionality, such as translation or geocoding.

### 5. Web Push Notifications

- **Description**: Server-initiated notifications sent to users for real-time updates, alerts, or interactions. Fully implemented using the Web Push API with VAPID authentication.

---

## Documentation

- [API Documentation in Postman](https://documenter.getpostman.com/view/48689306/2sB3dSP8Yt) - Complete API endpoint documentation.
- [Frontend Testing Documentation](docs/frontend-testing.md) - Guide for running and understanding frontend tests.
- [Backend Testing Documentation](docs/backend-testing.md) - Guide for running and understanding backend tests.
- [API Documentation in Swagger](https://canaccesible.es/api-docs) - Interactive API documentation.
- [Frontend Testing Guide](./docs/frontend-testing.md) - Complete testing documentation for React + Vitest.
- [OpenLDAP Setup](./docs/openldap-setup.md) - Technical documentation for the OpenLDAP server setup and configuration.
- [Deployment Guide](./docs/deployment.md) - Complete step-by-step guide for deploying CanAccesible to production.
- [Domain & DNS Setup](./docs/domain-dns-setup.md) - Guide on domain acquisition and DNS configuration.
- [Logging System & Rotation](./docs/logging-system.md) - Guide on server and application log management.
- [System Diagrams](./docs/diagrams.md) - Architecture, database, and component diagrams.
- [Technologies & Tools](./docs/technologies.md) - Detailed overview of the tech stack, libraries, and external services.
- [Team Workflow](./docs/workflow.md) - Guide on version control, branching strategy, and collaboration process.
- [Security Guide](./docs/security.md) - Overview of authentication, data protection, and security protocols.

---

## Main Technologies

- **Frontend:** ![React](https://img.shields.io/badge/React-19.1-blue?logo=react&logoColor=white)
- **Styles:** ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.1-blue?logo=tailwind-css&logoColor=white)
- **Backend:** ![ExpressJS](https://img.shields.io/badge/Express-5.1-black?logo=express&logoColor=white)
- **ORM:** ![Sequelize](https://img.shields.io/badge/Sequelize-6.37-blue?logo=sequelize&logoColor=white)
- **Database:** ![MySQL](https://img.shields.io/badge/MySQL-8-blue?logo=mysql&logoColor=white)
- **Version Control:** ![Git](https://img.shields.io/badge/Git-2.41-red?logo=git&logoColor=white)
- **API Endpoint Management:** ![Postman](https://img.shields.io/badge/Postman-orange?logo=postman&logoColor=white)
- **HTTP Client:** ![Axios](https://img.shields.io/badge/Axios-1.6-blue?logo=axios&logoColor=white)
- **Password Encryption:** ![LDAP SSHA](https://img.shields.io/badge/LDAP-SSHA-blue?logo=lock&logoColor=white)
- **State Management:** ![Zustand](https://img.shields.io/badge/Zustand-4.5-blue?logo=zustand&logoColor=white)
- **Maps:** ![Leaflet](https://img.shields.io/badge/Leaflet-1.9-blue?logo=leaflet&logoColor=white)
- **File Uploads:** ![Multer](https://img.shields.io/badge/Multer-1.4-blue?logo=multer&logoColor=white)
- **Email Service:** ![Nodemailer](https://img.shields.io/badge/Nodemailer-6.9-blue?logo=nodemailer&logoColor=white)
- **Translation API:** ![MyMemory](https://img.shields.io/badge/MyMemory-API-blue?logo=google-translate&logoColor=white)
- **Internationalization:** ![react-i18next](https://img.shields.io/badge/react--i18next-14.1-blue?logo=react&logoColor=white)

### Additional Technologies

- **React-Router-Dom:** Library for managing routes and navigation within the React application dynamically.
- **Motion (Framer Motion):** Library for animations and smooth transitions in React components, improving user experience.
- **Headless UI:** Unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.
- **Embla Carousel:** A lightweight carousel library with fluid motion and great touch precision.
- **MUI Icons & Font Awesome:** Comprehensive icon libraries for visual elements.
- **DigitalOcean (Droplets, Spaces, Managed DB):** Cloud infrastructure for hosting, storage, and database management.
- **Nominatim API:** External geolocation API used for reverse geocoding to convert coordinates into location names.
- **OpenLDAP:** Directory service for centralized user authentication and management.
- **LDAP JS:** Node.js library for interacting with LDAP servers.
- **Docker & Docker Compose:** Containerization tools used to run the OpenLDAP server in development.

---

## Project Structure

```
backend/
├── config/               # Configuration (DB, JWT, Mailer, Swagger, DO Spaces)
├── controllers/          # Controllers for API and Admin Dashboard
├── middlewares/          # Custom middlewares (Auth, Uploads)
├── migrations/           # Database migrations
├── models/               # Sequelize models
├── public/               # Static files (CSS, Images for Dashboard)
├── routes/               # Route definitions
├── scripts/              # Utility scripts
├── seeders/              # Database seeders
├── services/             # Business logic (Socket, LogCleanup, etc.)
├── sockets/              # Socket.io handlers
├── views/                # EJS views for Admin Dashboard
├── db.js                 # Database connection
├── index.js              # Server entry point
└── package.json          # Backend dependencies

frontend/
├── public/               # Public static assets
├── src/
│   ├── assets/           # Images and global styles
│   ├── components/       # Reusable React components
│   ├── layouts/          # Layout components
│   ├── pages/            # View components/Pages
│   ├── routes/           # Frontend routing configuration
│   ├── services/         # API service calls
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Entry point
├── vite.config.js        # Vite configuration
└── package.json          # Frontend dependencies

docs/                     # Documentation files
ldap/                     # OpenLDAP configuration and data
```
---

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js** (version 18 or higher)
- **NPM** (comes with Node.js)
- **MySQL** (version 8 or higher)
- **Docker** (for running the OpenLDAP server)
- **Git**

#### Installing Prerequisites on Windows

If you don't have these installed, you can install them using the following commands with Windows Package Manager (winget). If winget is not installed, download it from the Microsoft Store or GitHub.

**Install Node.js and NPM:**

```bash
winget install OpenJS.NodeJS
```

**Install MySQL:**

```bash
winget install Oracle.MySQL
```

**Install Docker:**

```bash
winget install Docker.DockerDesktop
```

**Install Git:**

```bash
winget install Git.Git
```

Alternatively, you can download and install them manually from their official websites:

- **Node.js:** Download the installer from [nodejs.org](https://nodejs.org/)
- **MySQL:** Download MySQL Community Server from [dev.mysql.com](https://dev.mysql.com/downloads/mysql/)
- **Git:** Download Git for Windows from [git-scm.com](https://git-scm.com/)

After installation, verify by running:

```bash
node --version
npm --version
mysql --version
git --version
```

For MySQL, you may need to set up a root password during installation. Remember this password as you'll need it for the database configuration.

### Clone the Repository

```bash
git clone https://github.com/devcarlosperez/CanAccesible.git
cd CanAccesible
```

### 1. Database Setup

First, you need to create the MySQL database manually:

**Open MySQL and execute:**

```sql
CREATE DATABASE canaccesible_db;
```

Make sure you have a MySQL user with appropriate permissions. You can use the default `root` user or create a new one.

### 2. Backend Configuration

Navigate to the backend directory:

```bash
cd backend
```

**Copy the environment file:**

```bash
cp .env.example .env.development
```

**Edit `.env.development` with your credentials:**

```env
# Application Environment
NODE_ENV=development                          # Environment mode (development or production)

# Database Configuration
DB_HOST=localhost                             # MySQL server host
DB_PORT=3306                                  # MySQL server port
DB_USER=root                                  # MySQL username
DB_PASS=******                                # MySQL password
DB_NAME=db_canaccesible                       # Database name
DB_SSL=false                                  # Enable SSL for database connection

FRONTEND_URL=http://localhost:5173            # Your frontend url

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here     # Secret key for JWT token generation and validation
SESSION_SECRET=your_super_secret_session_key_here  # Secret key for session generation and validation

# DigitalOcean Spaces (Image Storage) - Optional for local development
DO_ACCESS_KEY=your_digitalocean_access_key   # DigitalOcean Spaces API access key
DO_SECRET_KEY=your_digitalocean_secret_key   # DigitalOcean Spaces API secret key
DO_SPACE_NAME=your_space_name                # DigitalOcean Spaces bucket name
DO_SPACE_ENDPOINT=your_endpoint_space        # DigitalOcean Spaces endpoint URL

# Email Configuration (Gmail SMTP)
SMTP_USER=your_email@gmail.com               # Gmail address for sending emails
SMTP_PASS=your_gmail_app_password            # Gmail App Password (not your regular password)

# LDAP Configuration
LDAP_URL=ldap://localhost:389                # LDAP server URL
LDAP_BASE_DN=dc=canaccesible,dc=es           # Base DN for the LDAP directory
LDAP_ADMIN_DN=cn=admin,dc=canaccesible,dc=es # DN of the LDAP admin user
LDAP_ADMIN_PASSWORD=admin                    # Password for the LDAP admin user

# Web Push Notifications (VAPID Keys)
VAPID_PUBLIC_KEY=your_vapid_public_key       # Public key for web push notifications
VAPID_PRIVATE_KEY=your_vapid_private_key     # Private key for web push notifications
```

**Install dependencies:**

```bash
npm install
```

**Start the OpenLDAP server:**

Before running migrations and seeders, you need to start the OpenLDAP container for user authentication:

```bash
# From the project root directory
docker-compose up -d
```

Verify it's running:

```bash
docker ps
```

**Run database migrations and seeders:**

You can run the commands directly or use the npm scripts defined in `package.json`:

```bash
# Option 1: Using npm scripts (Recommended)
npm run db:migrate
npm run db:seed

# Option 2: Manual execution
NODE_ENV=development npx sequelize-cli db:migrate
NODE_ENV=development npx sequelize-cli db:seed:all
```
NODE_ENV=development npx sequelize-cli db:seed:all
```

**Start the backend server:**

```bash
NODE_ENV=development node index.js
```

The backend will be running on `http://localhost:85`

### 3. Frontend Configuration

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

**Copy the environment file:**

```bash
cp .env.example .env.development
```

**Edit `.env.development` with your configuration:**

```env
# Backend API URL
VITE_API_URL=http://localhost:85
```

**Install dependencies:**

```bash
npm install
```

**Start the development server:**

```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

### 4. Access the Application

Open your browser and navigate to:

```
http://localhost:5173
```

You should now see the CanAccesible application running locally!

---

## Acknowledgments

We would like to thank:

- **Samuel** and **Angelo** for their valuable recommendations and support throughout the project.
- **Our teachers** for their guidance, mentorship, and valuable feedback throughout the project.
- **Our colleagues and classmates** for their constructive feedback, code reviews, and support.
- **DigitalOcean** for providing reliable cloud infrastructure and services.

---

## Authors

- Jonathan Morera Apaza
- Carlos Pérez Santana
- Iriome Matos González
