# Security Guide

This document outlines the security protocols, middlewares, and measures implemented in **CanAccesible** to protect user data, ensure system integrity, and prevent unauthorized access.

---

## Authentication & Authorization

The application implements a flexible **multi-strategy authentication system** to handle different client types (Web Frontend, Mobile App, Admin Dashboard):

### 1. API Security (Stateless)
- **Mechanism**: **JSON Web Tokens (JWT)**.
- **Usage**: Primary method for the React frontend and mobile clients.
- **Flow**: Clients receive a token upon login and must send it in the `Authorization: Bearer <token>` header for subsequent requests.

### 2. Admin Dashboard & Internal API (Stateful)
- **Mechanism**: **Server-Side Sessions** (Express Session with Sequelize Store).
- **Usage**: Used for the server-rendered Admin Dashboard (EJS views).
- **Flow**: A session cookie (`connect.sid`) is set in the browser. The session data is stored in the MySQL database.

### 3. Hybrid Authentication
- **Mechanism**: Dual-check strategy.
- **Usage**: For endpoints that need to be accessible by both the public frontend (via JWT) and the admin dashboard (via Session), such as incident management.

### Password Hashing
- **LDAP SSHA**: User passwords are **never stored in plain text**. We use LDAP's built-in SSHA (Salted SHA) hashing algorithm to securely hash passwords during user creation.

---

## Security Middlewares

The project uses a set of custom middlewares to protect API routes. These are located in `backend/middlewares/auth.middleware.js` and `backend/index.js`.

### `verifyToken`
- **Purpose**: Protects stateless API endpoints.
- **Logic**: 
  1. Extracts the token from the `Authorization` header.
  2. Verifies the token signature using the secret key.
  3. Decodes the user payload and attaches it to `req.user`.
- **Response**: Returns `403` if token is missing, or `401` if invalid.

### `verifySession`
- **Purpose**: Protects internal routes and dashboard views.
- **Logic**: Checks if `req.session.userId` exists.
- **Response**: Returns `403` if the session is invalid or expired.

### `verifyAdmin`
- **Purpose**: Role-based access control (RBAC) for administrative actions.
- **Logic**: 
  1. Verifies that a valid session exists.
  2. Checks if `req.session.role` is strictly equal to `'admin'`.
  3. Fetches fresh user data from the database to ensure permissions are up-to-date.
- **Response**: Redirects to home or shows an error page if the user is not an admin.

### `verifyTokenOrSession`
- **Purpose**: Provides flexibility for shared resources.
- **Logic**: 
  1. First, it checks for a Bearer token. If present and valid, it authenticates via JWT.
  2. If no token is found, it falls back to checking for an active session.
- **Use Case**: Used on routes like `POST /api/incidents` so that both a mobile app user (Token) and an admin on the dashboard (Session) can create incidents.

### Custom CORS Middleware
- **Location**: `backend/index.js`
- **Purpose**: Controls which domains can access the API.
- **Configuration**:
  - **Allowed Origins**: `http://localhost:5173`, `http://localhost:85`, `https://canaccesible.es`, `https://www.canaccesible.es`.
  - **Credentials**: `Access-Control-Allow-Credentials` is set to `true` to allow cookies/sessions.
  - **Methods**: Restricts allowed HTTP methods to `GET, POST, PUT, DELETE, OPTIONS`.

---

## Data Protection

### Environment Variables
- **Secrets Management**: Sensitive information (DB credentials, API keys, JWT secrets, SMTP passwords) is stored in `.env` files.
- **Exclusion**: These files are ignored by git to prevent leakage.

### Database Security
- **Managed Database**: Uses **DigitalOcean Managed MySQL Database** with automated backups.
- **SSL Connection**: The backend connects to the database using SSL (`DB_SSL=true`) to encrypt data in transit.
- **Session Storage**: Sessions are stored in the database (`Sessions` table) rather than in memory, ensuring persistence and security.

---

## Network Security

### SSL/TLS (HTTPS)
- **Encryption**: All traffic is encrypted using **TLS**.
- **Implementation**: Handled by the **Nginx Reverse Proxy** with a **Let's Encrypt** certificate.

### Cookie Security
- **HttpOnly**: Session cookies are set with `httpOnly: true` to prevent Cross-Site Scripting (XSS) attacks from accessing the cookie via JavaScript.
- **SameSite**: Configured to `lax` to provide a balance between security (CSRF protection) and usability.

---

## File Security

### Secure Uploads (Multer S3)
- **Off-Server Storage**: Files are uploaded directly to **DigitalOcean Spaces** (S3-compatible) using `multer-s3`.
- **Isolation**: User-uploaded content is never stored on the application server's file system, mitigating local file inclusion (LFI) risks.
- **Naming**: Files are renamed with a timestamp prefix (e.g., `Date.now() + "-" + originalName`) to prevent overwriting and guessing filenames.

---

## Monitoring & Alerts

### Login Notifications
- **Email Alerts**: The system sends email notifications upon login detection to alert users of potential unauthorized access.

### Logging
- **PM2**: Manages application logs in production.
- **Cleanup**: A scheduled task (`logCleanup.service`) automatically manages log retention to prevent storage exhaustion.