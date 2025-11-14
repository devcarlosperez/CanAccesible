# Deployment

## Overview

CanAccesible is deployed on **DigitalOcean** with both frontend and backend running on a single Droplet (VPS) managed by **PM2**. We use DigitalOcean's managed MySQL database for data storage and Spaces for image storage.

---

## Deployment Process

### Step 1: Initial Droplet Setup

Connect via SSH and update the system:

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

### Step 2: Clone the Repository

```bash
git clone https://github.com/devcarlosperez/CanAccesible.git
cd CanAccesible
```

### Step 3: Frontend Setup

```bash
cd frontend
npm install
```

### Step 4: Backend Setup

```bash
cd ../backend
npm install

# Create .env file with environment variables
nano .env.production
```

**Add these environment variables to `.env.production`:**

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

# JWT Secret (if using authentication)
JWT_SECRET=your_jwt_secret_key
```

### Step 5: Database Initialization

```bash
# Run migrations
NODE_ENV=production npx sequelize-cli db:migrate

# Run seeders
NODE_ENV=production npx sequelize-cli db:seed:all
```

### Step 6: Start Applications with PM2

**For the frontend:**

```bash
pm2 start "npm run dev -- --host 0.0.0.0" --name frontend
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

### Step 7: Verify Deployment

Check that both applications are running:

```bash
pm2 status
```

![PM2 Status](./images/pm2-status.png)

Both applications should show status **"online"** in the PM2 list.

---

## Image Storage

Images are stored in **DigitalOcean Spaces** (Frankfurt region):

- **Upload**: Via Multer middleware in the backend.
- **Storage**: Persistent storage in Spaces.
- **Access**: Public URLs returned to frontend.
- **Lifecycle**: Automatic deletion when records are updated or deleted.

---

## Updating the Application

To update the code and restart applications:

```bash
cd /CanAccesible

# Pull latest changes
git pull origin main

# Update frontend
cd frontend
npm install

# Update backend
cd ../backend
npm install

# Restart all PM2 processes
pm2 restart all
```