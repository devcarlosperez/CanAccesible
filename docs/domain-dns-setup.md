# Domain & DNS Configuration Guide

This document details the domain acquisition process, DNS record configuration, and the necessary adjustments in the development environment to allow access through the new domain.

---

## Domain Acquisition

The domain **`canaccesible.es`** was acquired through the registrar **Nominalia**.

---

## DNS Configuration

To link the domain with the server (DigitalOcean Droplet), an A record was configured in the DNS settings.

*   **DNS Provider:** Nominalia (Domain Control Panel).
*   **A Record:** An A record was created/modified to point directly to the public IP address of the DigitalOcean Droplet.
    *   Host: `@` (or `canaccesible.es`)
    *   Value/Destination: `[DROPLET_IP]`

This directs requests for `canaccesible.es` to the server hosting the application.

> **`http://canaccesible.es:5173`**

---

## Frontend Server Configuration (Vite)

When pointing the domain to the Droplet and accessing the development port (default 5173), Vite blocks requests that do not originate from `localhost` or local IPs for security reasons, displaying the error:
`Blocked request. This host ("canaccesible.es") is not allowed.`

To resolve this and allow traffic from the new domain, the `frontend/vite.config.js` configuration file was modified.

### Changes made to `vite.config.js`:

The `allowedHosts` property was added to the server configuration:

```javascript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true, // Allows listening on all network interfaces (0.0.0.0)
    allowedHosts: ['canaccesible.es', 'www.canaccesible.es', 'localhost']
  }
});
```

---

## Nginx Configuration (Reverse Proxy)

To improve user experience (removing the need to type port `:5173`) and prepare the server for SSL, **Nginx** is configured as a reverse proxy. This acts as an intermediary that forwards traffic from port 80 (standard HTTP) to the application running on port 5173.

### 1. Installation

First, ensure the package lists are updated and install Nginx:

```bash
sudo apt update
sudo apt install nginx
```

### 2. Handling Conflicts (Apache)

DigitalOcean Droplet come with Apache pre-installed, which may occupy port 80. If you encounter an error starting Nginx, check for Apache:

1.  **Stop Apache:**
    ```bash
    sudo systemctl stop apache2
    ```
2.  **Disable Apache from starting on boot:**
    ```bash
    sudo systemctl disable apache2
    ```

### 3. Configuration

A new configuration file is created for the site in `/etc/nginx/sites-available/`:

```bash
sudo nano /etc/nginx/sites-available/canaccesible
```

**Configuration Content:**

```nginx
server {
    listen 80;
    server_name canaccesible.es www.canaccesible.es;

    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Explanation of Configuration:**
*   `listen 80;`: Configures Nginx to listen for incoming HTTP traffic on port 80.
*   `server_name ...;`: Defines the domains this server block will respond to (`canaccesible.es` and `www...`).
*   `location / { ... }`: Defines how to handle requests to the root URL.
*   `proxy_pass http://localhost:5173;`: Forwards the request to the Vite development server running locally on port 5173.
*   `proxy_set_header ...;`: Passes necessary headers to the backend, ensuring WebSockets (used by Vite for HMR) and host information work correctly.

### 4. Enabling the Site and Verification

1.  **Enable the site** by creating a symbolic link to `sites-enabled`:
    ```bash
    sudo ln -s /etc/nginx/sites-available/canaccesible /etc/nginx/sites-enabled/
    ```

2.  **Verify configuration syntax:**
    ```bash
    sudo nginx -t
    ```
    *Expected output:* `syntax is ok`, `test is successful`.

3.  **Restart Nginx** to apply changes:
    ```bash
    sudo systemctl restart nginx
    ```

---

## Next Steps

*   **SSL/TLS:** Implementation of secure certificates via Let's Encrypt (Certbot) to enable HTTPS.
