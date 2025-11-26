# Domain & DNS Configuration

This document details the domain acquisition process, DNS record configuration, and the necessary adjustments in the development environment to allow access through the new domain.

## 1. Domain Acquisition

The domain **`canaccesible.es`** was acquired through the registrar **Nominalia**.

## 2. DNS Configuration

To link the domain with the server (DigitalOcean Droplet), an A record was configured in the DNS settings.

*   **DNS Provider:** Nominalia (Domain Control Panel).
*   **A Record:** An A record was created/modified to point directly to the public IP address of the DigitalOcean Droplet.
    *   Host: `@` (or `canaccesible.es`)
    *   Value/Destination: `[DROPLET_IP]`

This directs requests for `canaccesible.es` to the server hosting the application.

> **`http://canaccesible.es:5173`**

## 3. Frontend Server Configuration (Vite)

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
