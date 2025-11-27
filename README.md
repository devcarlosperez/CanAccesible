# CANACCESIBLE

**CanAccesible** is a comprehensive web platform designed for the Canary Islands, empowering citizens to actively participate in improving accessibility across the archipelago.

The platform serves as a community-driven hub where users can:
- **Report Accessibility Incidents:** Document and share both **bad practices** (barriers) and **good practices** (exemplary accessibility) in public and private spaces.
- **Interactive Map:** Visualize all reported incidents on an interactive map, providing a clear overview of the accessibility landscape.
- **Community Interaction:** Engage with the community by commenting on and liking reports, fostering a collaborative environment.
- **User Support:** Access direct support channels, including chat functionality with administrators and contact information for assistance.
- **Stay Informed:** Read blog articles to stay updated on the latest accessibility trends, news, and improvements within the CanAccesible network.

Our mission is to build a strong community dedicated to transforming the islands into a more accessible place for everyone, combining modern technology with social awareness.

---

## Documentation

- [API Documentation in Postman](https://documenter.getpostman.com/view/48689306/2sB3Wnxhsu) - Complete API endpoint documentation.
- [Deployment Guide](./docs/deployment.md) - Complete step-by-step guide for deploying CanAccesible to production.
- [Domain & DNS Setup](./docs/domain-dns-setup.md) - Guide on domain acquisition and DNS configuration.
- [NGINX Log Rotation](./docs/nginx-log-rotation.md) - Technical guide on NGINX log management and rotation.
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

### Additional Technologies

- **React-Router-Dom:** Library for managing routes and navigation within the React application dynamically.
- **Axios:** HTTP client for making requests to the backend, handling APIs and receiving responses easily.
- **BCrypt:** Library for encrypting passwords and securing sensitive user information.
- **Motion (Framer Motion):** Library for animations and smooth transitions in React components, improving user experience.
- **Zustand:** Lightweight state management library for React applications, used for managing global application state.
- **Leaflet & React Leaflet:** Libraries for displaying interactive maps and handling geolocation.
- **Headless UI:** Unstyled, fully accessible UI components, designed to integrate beautifully with Tailwind CSS.
- **Embla Carousel:** A lightweight carousel library with fluid motion and great touch precision.
- **MUI Icons & Font Awesome:** Comprehensive icon libraries for visual elements.
- **Multer & Multer S3:** Middleware for handling file uploads, integrated with S3 storage.
- **Nodemailer:** Module for sending emails from the Node.js server.
- **DigitalOcean (Droplets, Spaces, Managed DB):** Cloud infrastructure for hosting, storage, and database management.
- **Nominatim API:** External geolocation API used for reverse geocoding to convert coordinates into location names.

---

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── assets/           # Images, logos, and static files
│   ├── components/       # Reusable React components
│   ├── layouts/          # Layout components
│   ├── pages/            # Page components
│   ├── services/         # API call logic
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── vite.config.js
├── eslint.config.js
└── package.json          # Frontend dependencies and scripts

backend/
├── config/               # Server and DB configuration
├── controllers/          # Route controllers
├── middlewares/          # Express middlewares (auth, uploads, etc.)
├── migrations/           # Database migrations
├── models/               # Sequelize models
├── routes/               # API route definitions
├── seeders/              # Initial database data
├── services/             # Business logic services
├── views/                # Server-side rendered views
├── db.js                 # Main database connection
├── index.js              # Express app entry point
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
└── package.json          # Backend dependencies and scripts

docs/
├── images/               # Diagrams and screenshots
├── deployment.md         # Deployment guide
└── diagrams.md           # System architecture diagrams
```
---

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed on your machine:

- **Node.js**
- **NPM**
- **MySQL**
- **Git**

### Clone the Repository

```bash
git clone https://github.com/devcarlosperez/CanAccesible.git
cd CanAccesible
```

### 1. Database Setup

First, you need to create the MySQL database manually:

**Open MySQL and execute:**

```sql
CREATE DATABASE db_canaccesible;
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
DB_USER=your_mysql_username                   # MySQL username
DB_PASS=your_mysql_password                   # MySQL password
DB_NAME=canaccesible_db                       # Database name to create and use
DB_SSL=false                                  # Enable SSL for database connection

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here    # Secret key for JWT token generation and validation

# DigitalOcean Spaces (Image Storage) - Optional for local development
DO_ACCESS_KEY=your_digitalocean_access_key   # DigitalOcean Spaces API access key
DO_SECRET_KEY=your_digitalocean_secret_key   # DigitalOcean Spaces API secret key
DO_SPACE_NAME=your_space_name                # DigitalOcean Spaces bucket name
DO_SPACE_ENDPOINT=your_endpoint_space        # DigitalOcean Spaces endpoint URL

# Email Configuration (Gmail SMTP)
SMTP_USER=your_email@gmail.com               # Gmail address for sending emails
SMTP_PASS=your_gmail_app_password            # Gmail App Password
```

**Install dependencies:**

```bash
npm install
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

- **Our teachers** for their guidance, mentorship, and valuable feedback throughout the project.
- **Our colleagues and classmates** for their constructive feedback, code reviews, and support.
- **DigitalOcean** for providing reliable cloud infrastructure and services.

---

## Authors

- Jonathan Morera Apaza
- Carlos Pérez Santana
- Iriome Matos González
