# CANACCESIBLE

## Description

**CanAccesible** is a Canary Islands web platform that enables citizens to:

- **Report accessibility incidents** in public or private spaces.
- **Share accessibility best practices** to inspire and improve inclusion.

The project aims to promote a **more accessible society** and awareness of the needs of all people, combining modern and accessible design with easy-to-use tools for the community.

---

## Documentation

- [API Documentation in Postman](https://documenter.getpostman.com/view/48689306/2sB3Wnxhsu) - Complete API endpoint documentation
- [Deployment Guide](./docs/deployment.md) - Complete step-by-step guide for deploying CanAccesible to production
- [System Diagrams](./docs/diagrams.md) - Architecture, database, and component diagrams

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
- **Nominatin API:** External geolocation API used for reverse geocoding to convert coordinates into location names.

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
├── middleware/           # Express middleware (auth, uploads, etc.)
├── migrations/           # Database migrations
├── models/               # Sequelize models
├── routes/               # API route definitions
├── seeders/              # Initial database data
├── db.js                 # Main database connection
├── index.js              # Express app entry point
├── .env.development      # Development environment variables
├── .env.production       # Production environment variables
└── package.json          # Backend dependencies and scripts

docs/
├── images/               # Diagrams and screenshots
├── deployment.md         # Deployment guide
├── diagrams.md           # System architecture diagrams
└── README.md             # Documentation index
```
---

## Project Installation

### Prerequisites

- Have NodeJS, NPM, and MySQL installed.

### Clone Repository

```
git clone https://github.com/devcarlosperez/CanAccesible
```

### Backend Configuration

- Enter the backend directory

```
cd backend
```

- Install dependencies

```
npm install
```

- Run migrations and seeders

```
NODE_ENV=development npx sequelize-cli db:migrate

NODE_ENV=development npx sequelize-cli db:seed:all
```

- Start backend

```
node index.js
```

### Frontend Configuration

```
cd frontend

npm install

npm run dev
```
---

## Acknowledgments

We would like to thank:

- **Our teachers and instructors** for their guidance, mentorship, and valuable feedback throughout the project.
- **Our colleagues and classmates** for their constructive feedback, code reviews, and support.
- **DigitalOcean** for providing reliable cloud infrastructure and services.

---

## Authors

- Jonathan Morera Apaza
- Carlos Pérez Santana
- Iriome Matos González
