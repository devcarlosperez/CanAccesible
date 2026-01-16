# Deployment Guide

This document details the complete deployment process of the **CanAccesible** application to a production environment. The deployment evolved over four sprints, each adding layers of functionality, security, and optimization.

---

## Infrastructure Overview

*   **Provider:** DigitalOcean
*   **Server Type:** Droplet (Virtual Private Server)
*   **Operating System:** Ubuntu 24.04 LTS
*   **Web Server / Proxy:** Nginx
*   **Process Manager:** PM2 (for Node.js Backend)
*   **Containerization:** Docker (for OpenLDAP)
*   **Database:** Managed MySQL (DigitalOcean)
*   **Storage:** DigitalOcean Spaces (S3-compatible Object Storage)
*   **Security:** SSL/TLS via Let's Encrypt (Certbot)

---

## Sprint 1: Initial Deployment (Carlos)

**Objective:** Establish the basic server infrastructure and get the application running on the VPS.

### 1. Initial Droplet Setup

Access via the **DigitalOcean Console** and update the system:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 globally
sudo npm install -g pm2

# Install Git
sudo apt install -y git
```

### 2. Clone the Repository

```bash
git clone https://github.com/devcarlosperez/CanAccesible.git
cd CanAccesible
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

### 4. Backend Setup

```bash
cd ../backend
npm install
```

**Create `.env.production` file:**
```bash
nano .env.production
```

Add these environment variables to `.env.production`:
```env
# Node Environment
NODE_ENV=production

# Server Port
PORT=85

# Database Configuration
DB_HOST=your-db-cluster.db.ondigitalocean.com
DB_PORT=25060
DB_USER=doadmin
DB_PASSWORD=your_db_password
DB_NAME=canaccesible

# DigitalOcean Spaces Configuration
DO_SPACE_NAME=your-space-name
DO_REGION=fra1
DO_ACCESS_KEY=your_spaces_access_key
DO_SECRET_KEY=your_spaces_secret_key

# Frontend URL
FRONTEND_URL=http://<DROPLET_IP>:5173
```

### 5. Database Initialization

```bash
# Run migrations
NODE_ENV=production npx sequelize-cli db:migrate

# Run seeders
NODE_ENV=production npx sequelize-cli db:seed:all
```

### 6. Start Applications with PM2

**For the frontend:**
```bash
pm2 start "NODE_ENV=production npm run dev -- --host 0.0.0.0" --name frontend
```

**For the backend:**
```bash
pm2 start "NODE_ENV=production node index.js" --name backend
```

**Save PM2 configuration and enable startup on reboot:**
```bash
# Save current PM2 configuration
pm2 save

# Enable PM2 to start on system reboot
sudo pm2 startup
```

### 7. Verify Deployment

Check that both applications are running:

```bash
pm2 status
```

![PM2 Status](./images/pm2-status.png)

---

## Sprint 2: Production Hardening (Carlos)

**Objective:** Transition from a development setup to a production-ready configuration, securing the environment variables and connecting to the managed database.

### 1. Environment Variables

*   Created `.env.production` files for both backend and frontend with secure credentials.
*   **Backend:** Configured to connect to DigitalOcean Managed MySQL. Added Resend, JWT, Session, and DigitalOcean Spaces configurations.
    ```env
    # Email Configuration (Resend)
    RESEND_API=re_aULKe6uz_7CLFHMaAWcxPhrzGBYpHxJhX

    # Security Secrets
    JWT_SECRET=Canaccesible_ultra_super_secret_key_2025
    SESSION_SECRET=Canaccesible_ultra_super_secret_session_key_2025

    # DigitalOcean Spaces
    DO_ACCESS_KEY=DO00382BZ2C492XWJF8Q
    DO_SECRET_KEY=eeW6oJ6iNRYDkwgsq4w1oV+nqr7G6EeDF1PZxbEYZko
    DO_SPACE_NAME=images-cruds
    DO_SPACE_ENDPOINT=fra1.digitaloceanspaces.com
    ```
*   **Frontend:** Pointed `VITE_API_URL` to the production IP.

### 2. CORS Configuration

*   Updated `backend/index.js` to strictly allow requests only from the production IP and localhost, preventing unauthorized cross-origin requests.
    ```javascript
    // backend/index.js
    const allowedOrigins = [
      "http://localhost:5173",
      "http://localhost:85",
      "http://<DROPLET_IP>:5173",
    ];
    ```

### 3. Database Reset & Seeding

*   To ensure a clean state for production, the database was reset using Sequelize CLI with the `NODE_ENV=production` flag. This ensures the commands run against the managed database defined in `.env.production`.

    ```bash
    # 1. Drop existing tables (Clean slate)
    npx cross-env NODE_ENV=production sequelize-cli db:drop
    
    # 2. Run migrations (Create schema)
    npx cross-env NODE_ENV=production sequelize-cli db:migrate
    
    # 3. Seed initial data (Populate tables)
    npx cross-env NODE_ENV=production sequelize-cli db:seed:all
    ```

---

## Sprint 3: Domain, Proxy & Security (Jonathan)

**Objective:** Make the application accessible via a public domain (`canaccesible.es`), secure it with SSL/TLS, and implement Nginx as a reverse proxy to hide internal ports.

### 1. Domain & DNS

*   Acquired `canaccesible.es` via Nominalia.
*   Configured **A Records** in the DNS panel to point `@` and `www` to the Droplet's Public IP.

### 2. Nginx Reverse Proxy

*   **Installation:**
    ```bash
    sudo apt install nginx
    ```
*   **Configuration:**
    Created `/etc/nginx/sites-available/canaccesible.es` to forward traffic.
    
    **Initial Nginx Configuration (Proxy Mode):**
    ```nginx
    server {
        listen 80;
        server_name canaccesible.es www.canaccesible.es;

        # Proxy to Frontend (Vite Dev Server)
        location / {
            proxy_pass http://localhost:5173;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Proxy to Backend API
        location /api/ {
            proxy_pass http://localhost:85;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

*   **Enabling the Site:**
    ```bash
    sudo ln -s /etc/nginx/sites-available/canaccesible.es /etc/nginx/sites-enabled/
    sudo rm /etc/nginx/sites-enabled/default
    sudo systemctl restart nginx
    ```

### 3. SSL/TLS Encryption

*   Secured the connection using Let's Encrypt and Certbot.
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d canaccesible.es -d www.canaccesible.es
    ```
*   This automatically configured Nginx to listen on port 443 (HTTPS) and redirect all HTTP traffic to HTTPS.

### 4. Environment Variables Update

Update the `backend/.env.production` file to reflect the new domain:

```bash
nano backend/.env.production
```

Update the `FRONTEND_URL` variable:
```env
FRONTEND_URL=https://canaccesible.es
```

*   Updated `backend/index.js` CORS configuration to allow the new domain.

### 5. Database Maintenance

*   Performed another round of database reset (drop/migrate/seed) to ensure data integrity with the new domain configurations and verify that the production environment was stable.

---

## Sprint 4: Optimization & Dockerization (Iriome)

**Objective:** Optimize frontend performance by serving static files (removing the need for a Node process for frontend), containerize the LDAP service for security, and finalize real-time communication features.

### 1. Docker Implementation (OpenLDAP)

*   **Installation:**
    Installed Docker Engine and Docker Compose on the VPS.
    ```bash
    sudo apt install docker.io docker-compose-v2
    ```
*   **Deployment:**
    Deployed OpenLDAP using the `docker-compose.yml` file. This isolates the user directory service.
    ```bash
    # Start the container in detached mode
    docker compose up -d
    
    # Verify it's running
    docker ps
    ```
*   **Integration & Environment Updates:** 
    
    Edit `backend/.env.production` to include LDAP configuration and VAPID keys:
    
    ```bash
    nano backend/.env.production
    ```

    Add the following variables:
    ```env
    # LDAP Configuration
    LDAP_URL=ldap://localhost:389
    LDAP_BASE_DN=dc=canaccesible,dc=es
    LDAP_ADMIN_DN=cn=admin,dc=canaccesible,dc=es
    LDAP_ADMIN_PASSWORD=kjhslIOP9002NSILXO

    # Web Push VAPID Keys
    VAPID_PUBLIC_KEY=BERgLLd2_B1K-eW4DIiGHufqPzReM8dRIZwRD1JmgCwdvImZpvK1hRF0x9Bi6_175zylm6AZ9wxYgGhGEHZpP9s
    VAPID_PRIVATE_KEY=qyBspyIIQshY-D2nx2SvB3TQHQcg4XIJt78Qmepq7js
    ```

### 2. Frontend Optimization (Static Serving)

*   **Build Process:**
    Instead of running `vite dev` or `vite preview`, we built the application for production. This generates optimized HTML, CSS, and JS files.
    ```bash
    cd frontend
    npm run build
    ```
*   **Deployment:**
    Moved the generated `dist` folder to a standard web directory.
    ```bash
    sudo mkdir -p /var/www/canaccesible
    sudo cp -r dist/* /var/www/canaccesible/
    ```

### 3. Final Nginx Configuration

*   Updated Nginx to serve the frontend **directly as static files** from `/var/www/canaccesible`. This significantly reduces server load and improves load times.
*   Added configuration for **Socket.io (WebSockets)** to enable real-time chat and notifications.

    **Full Nginx Configuration (`/etc/nginx/sites-available/canaccesible.es`):**
    ```nginx
    server {
        listen 80;
        server_name canaccesible.es www.canaccesible.es;
        return 301 https://$host$request_uri;
    }

    server {
        listen 443 ssl; # managed by Certbot
        server_name canaccesible.es www.canaccesible.es;

        ssl_certificate /etc/letsencrypt/live/canaccesible.es/fullchain.pem; # managed by Certbot
        ssl_certificate_key /etc/letsencrypt/live/canaccesible.es/privkey.pem; # managed by Certbot
        include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
        ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

        # Serve Static Frontend
        location / {
            root /var/www/canaccesible;
            index index.html;
            try_files $uri $uri/ /index.html;
        }

        # Proxy API Requests
        location /api/ {
            proxy_pass http://127.0.0.1:85;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # WebSocket Support
        location /socket.io/ {
            proxy_pass http://127.0.0.1:85;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
        }
    }
    ```
*   **Apply Changes:**
    ```bash
    sudo nginx -t
    sudo systemctl restart nginx
    ```

### 4. Final Deployment Steps

*   **Backend:** Running on PM2 in production mode.
    ```bash
    # Start backend in production mode
    NODE_ENV=production pm2 start index.js --name "backend"
    ```
*   **Database & LDAP:** Reset one final time to populate initial data into MySQL and create the admin users in the new OpenLDAP container.
    ```bash
    # Run migrations and seeders (populates MySQL and LDAP)
    npm run db:migrate
    npm run db:seed
    ```

---

## Sprint 5: Updates & Maintenance (Jonathan)

### 1. Update Codebase

Log in to the VPS and pull the latest changes from the main branch. Also, update dependencies.

```bash
cd CanAccesible
git pull origin main

# Install dependencies for backend
cd backend
npm install

# Install dependencies for frontend
cd ../frontend
npm install

# Return to root
cd ..
```

### 2. Configuration Updates

Update `backend/.env.production` to reflect new changes, such as adding Resend API keys and removing obsolete SMTP configurations.

```bash
nano backend/.env.production
```

### 3. Service Reset (Database & LDAP)

Due to schema changes, clean up the existing state (migrations) and restart the LDAP service to ensure a fresh environment.

**Reset OpenLDAP:**
Remove the existing OpenLDAP container and volume (if necessary) and recreate it.

```bash
# Stop and remove the OpenLDAP container
docker compose down

# Start the container again directly (detached)
docker compose up -d
```

### 4. Database Initialization

Run the migrations and seeders again to apply the new schema and populate the database (and the fresh LDAP instance).

```bash
cd backend

# Run migrations (ensure database is in sync with new schema)
NODE_ENV=production npx sequelize-cli db:migrate

# Run seeders (populate initial data)
NODE_ENV=production npx sequelize-cli db:seed:all
```

### 5. Frontend Redeployment

Build the updated frontend and deploy the static files to the Nginx web root.

```bash
cd ../frontend
npm run build

# Update the served files
sudo cp -r dist/* /var/www/canaccesible/
```

### 6. Restart Backend

Apply the changes to the running backend process.

```bash
pm2 restart backend
```

---

## Current Architecture Summary

1.  **User Request** -> **Nginx (Port 443)**
2.  **Nginx Routes:**
    *   `/` -> Serves **Static Files** (React Build) from `/var/www/canaccesible`
    *   `/api` -> Proxies to **Backend (PM2 Port 85)**
    *   `/socket.io` -> Proxies to **Backend (PM2 Port 85)** with Upgrade headers
3.  **Backend Connects to:**
    *   **MySQL Database** (Managed DigitalOcean)
    *   **OpenLDAP** (Docker Container on localhost:389)
