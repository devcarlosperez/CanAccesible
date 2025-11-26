# Security Guide

This document outlines the security protocols and measures implemented in **CanAccesible** to protect user data, ensure system integrity, and prevent unauthorized access.

---

## Authentication & Authorization

The application implements a **dual authentication strategy** to handle different parts of the system:

### A. API Security (React Frontend)

- **Mechanism**: **JSON Web Tokens (JWT)** sent via **Bearer Token**.
- **Usage**: All REST API endpoints consumed by the React frontend (e.g., creating incidents, fetching users) are stateless.
- **Protection**: The `verifyToken` middleware checks for the `Authorization: Bearer <token>` header on every request.

### B. Admin Dashboard & Internal API Security

- **Mechanism**: **Server-Side Sessions** (Express Session).
- **Usage**: Used for the administrative panel (EJS views) and specific backend operations performed by administrators (e.g., managing blog articles, viewing system logs).
- **Protection**:
    - **Session Validation**: The `verifySession` middleware protects specific API endpoints (like `/api/blogArticles` or `/api/logs`) ensuring that the request comes from an authenticated browser session, not an external client.
    - **Role Verification**: The `verifyAdmin` middleware adds an extra layer of security for critical routes, verifying that the session belongs to a user with the `admin` role before rendering views or processing requests.

### Password Hashing

- **Bcrypt**: User passwords are **never stored in plain text**. We use `bcrypt` to hash passwords with a salt before saving them to the database. During login, the provided password is hashed and compared against the stored hash.

---

## Data Protection

### Environment Variables

- **Secrets Management**: Sensitive information such as database credentials, API keys, JWT secrets, and SMTP passwords are stored in `.env` files.
- **Exclusion**: These files are included in `.gitignore` to prevent them from being committed to the version control system.

### Database Security

- **Managed Database**: In production, we use a **DigitalOcean Managed MySQL Database**, which provides automated backups and restricted access.
- **SSL Connection**: The application is configured to connect to the database using SSL (`DB_SSL=true`) to encrypt data in transit between the backend and the database server.

---

## Network Security

### SSL/TLS (HTTPS)

- **Encryption**: All data transmitted between the client and the server is encrypted using **TLS (Transport Layer Security)**.
- **Implementation**: This is handled by the **Nginx Reverse Proxy**, which terminates the SSL connection using a **Let's Encrypt** certificate.
- **Configuration**: For technical details on how this is set up, refer to the [Domain & SSL Guide](./domain-dns-setup.md).

### CORS (Cross-Origin Resource Sharing)

- **Configuration**: The backend is configured to only accept requests from trusted origins (e.g., the frontend application URL). This prevents malicious websites from making unauthorized requests to our API on behalf of a user.

---

## File Security

### Cloud Storage (DigitalOcean Spaces)

- **Off-Server Storage**: User-uploaded files (images) are not stored on the local server's file system. Instead, they are uploaded directly to **DigitalOcean Spaces** (S3-compatible object storage).
- **Benefit**: This mitigates risks associated with local file execution attacks and ensures the application server remains stateless and scalable.

---

## Monitoring & Alerts

### Login Notifications

- **Email Alerts**: The system automatically sends an email notification to the user whenever a login is detected on their account. This allows users to quickly identify and report unauthorized access.

### Logging

- **PM2 Logs**: In production, **PM2** manages application logs, allowing administrators to monitor server activity and debug issues without exposing error details to the end-user.