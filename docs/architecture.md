# Project Architecture

This document provides a detailed overview of the software architecture and design decisions behind **CanAccesible**.

---

## Frontend Architecture

The frontend is built with **React**, utilizing a **Client-Side Routing** approach to manage multiple pages and views efficiently.

*   **Structure:** The application is organized into distinct **Pages** (located in `src/pages/`) corresponding to different routes (e.g., `/login`, `/dashboard`, `/map`).
*   **Routing:** `react-router-dom` handles the navigation between these pages instantly without triggering a full browser reload (SPA behavior), providing a fast and app-like experience.
*   **State Management:** `Zustand` is used for global state (e.g., user session, theme settings), while local state is managed with React Hooks.
*   **Styling:** `Tailwind CSS` for utility-first styling, combined with `Headless UI` for accessible components.
*   **Maps:** `Leaflet` integration for rendering interactive maps and incident markers.

---

## Backend Architecture

The backend implements a **RESTful API** following the **MVC (Model-View-Controller)** pattern (adapted for API use, where "View" is essentially the JSON response).

### Layers

1.  **Routes:** Define the API endpoints (e.g., `/api/incidents`) and map them to controllers.
2.  **Middlewares:** Intercept requests for tasks like Authentication (JWT), Validation, and File Uploading (Multer).
3.  **Controllers:** Handle the business logic, process requests, and determine the response.
4.  **Services:** (Optional/Implicit) Encapsulate complex business rules and database interactions.
5.  **Models (Sequelize):** Define the database schema and relationships.

### Security

*   **Authentication:** Stateless authentication using **JWT (JSON Web Tokens)**.
*   **Sessions:** `express-session` is used to manage user sessions securely.
*   **Password Hashing:** `bcrypt` is used to hash passwords before storage.
*   **CORS:** Configured to allow requests only from trusted domains.

*(For a detailed breakdown of security protocols, see [Security Guide](./security.md))*

---

## Database Design

We use a **Relational Database (RDBMS)** to ensure data integrity and structured storage.

*   **Engine:** MySQL (v8).
*   **ORM:** Sequelize is used to interact with the database using JavaScript objects, handling migrations and seeders.
*   **Key Entities:** Users, Incidents, Comments, Notifications, Logs.

*(See [System Diagrams](./diagrams.md) for the ER Diagram)*

---

## Infrastructure & Deployment

The application is hosted on **DigitalOcean**.

*   **Server:** Ubuntu Droplet.
*   **Web Server:** **Nginx** acts as a reverse proxy, handling SSL termination (HTTPS) and forwarding traffic to the application ports.
*   **Process Management:** **PM2** (Process Manager 2) keeps the Node.js backend running in the background and handles restarts.
*   **Storage:** **DigitalOcean Spaces** (S3-compatible) is used for storing user-uploaded images, keeping the application server stateless regarding file storage.