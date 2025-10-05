# Complete Render Setup Guide for Sonos App

## Overview

This guide will help you deploy your Sonos backend to Render (free tier) and get a permanent URL for OAuth authentication. Your frontend will still run locally on your machine.

---

## Prerequisites

- [ ] GitHub account
- [ ] Your Sonos backend code ready
- [ ] Git installed on your machine

---

## Part 1: Prepare Your Backend for Deployment

### Step 1: Create Required Files

Make sure your backend has these files:

#### `package.json` - Check Your Scripts

```json
{
  "name": "sonos-backend",
  "version": "1.0.0",
  "scripts": {
    "start": "node src/app.js",
    "dev": "nodemon src/app.js"
  },
  "dependencies": {
    "express": "^4.18.0",
    "sequelize": "^6.35.0",
    "mysql2": "^3.6.0",
    "jsonwebtoken": "^9.0.0",
    "axios": "^1.6.0",
    "cors": "^2.8.5",
    "dotenv": "^16.3.0",
    "express-validator": "^7.0.0",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "swagger-jsdoc": "^6.2.0",
    "swagger-ui-express": "^5.0.0"
  }
}
```

**Important**: Render uses `npm start` to run your app.

#### `.env.example` - Template for Environment Variables

Create this file to document what environment variables are needed:

```bash
# Server
NODE_ENV=production
PORT=10000

# Database (Render will provide this)
DATABASE_URL=

# JWT
JWT_SECRET=
JWT_EXPIRES_IN=7d

# Sonos OAuth
SONOS_CLIENT_ID=
SONOS_CLIENT_SECRET=
SONOS_REDIRECT_URI=

# Encryption
ENCRYPTION_KEY=

# CORS
FRONTEND_URL=http://localhost:5173
```

#### Update `src/config/database.js` - Handle Render's DATABASE_URL

Render provides a single `DATABASE_URL` instead of separate host/user/password. Update your Sequelize config:

```javascript
require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sonos_app',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};
```

#### Update `src/app.js` - Use PORT from Environment

```javascript
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 2: Create `.gitignore`

Make sure you're not committing sensitive files:

```
node_modules/
.env
.DS_Store
*.log
```

### Step 3: Initialize Git Repository

```bash
cd backend

# Initialize git if you haven't already
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Sonos backend"
```

### Step 4: Push to GitHub

```bash
# Create a new repo on GitHub (go to github.com, click "+", "New repository")
# Name it something like "sonos-backend"
# Don't initialize with README (you already have code)

# Connect your local repo to GitHub
git remote add origin https://github.com/YOUR_USERNAME/sonos-backend.git

# Push your code
git branch -M main
git push -u origin main
```

---

## Part 2: Create Render Account & Deploy Backend

### Step 1: Sign Up for Render

1. Go to https://render.com
2. Click **"Get Started"** or **"Sign Up"**
3. Choose **"Sign up with GitHub"** (easiest - connects your repos automatically)
4. Authorize Render to access your GitHub repositories

### Step 2: Create a New Web Service

1. On Render dashboard, click **"New +"** button (top right)
2. Select **"Web Service"**
3. You'll see a list of your GitHub repositories
4. Find your `sonos-backend` repo and click **"Connect"**

### Step 3: Configure Your Web Service

Fill out the form:

#### Basic Settings
- **Name**: `sonos-backend` (or whatever you like)
  - This becomes part of your URL: `https://sonos-backend.onrender.com`
- **Region**: Choose closest to you (e.g., Oregon (US West))
- **Branch**: `main`
- **Root Directory**: Leave blank (unless your backend is in a subdirectory)

#### Build & Deploy Settings
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

#### Instance Type
- Select **"Free"** (this is important!)
  - Note: Free instances spin down after 15 min of inactivity

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section and click **"Add Environment Variable"**.

Add each of these (click "Add" after each one):

```
Key: NODE_ENV
Value: production

Key: JWT_SECRET
Value: [generate a random string - see below]

Key: SONOS_CLIENT_ID
Value: [your Sonos client ID]

Key: SONOS_CLIENT_SECRET
Value: [your Sonos client secret]

Key: SONOS_REDIRECT_URI
Value: https://sonos-backend.onrender.com/auth/callback
(Replace 'sonos-backend' with your actual service name)

Key: ENCRYPTION_KEY
Value: [generate 32-byte hex key - see below]

Key: FRONTEND_URL
Value: http://localhost:5173
```

**Generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Generate ENCRYPTION_KEY:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Deploy

1. Click **"Create Web Service"** at the bottom
2. Render will start building and deploying your app
3. Watch the logs in real-time - you'll see:
   ```
   ==> Downloading cache...
   ==> Installing dependencies
   ==> Build successful
   ==> Starting service
   ```
4. Wait for status to show **"Live"** (usually 2-5 minutes)

Your backend is now live at: `https://sonos-backend.onrender.com` (or whatever name you chose)

---

## Part 3: Create PostgreSQL Database

**Note**: Render's free tier includes PostgreSQL, not MySQL. But Sequelize works with both! We'll use PostgreSQL instead.

### Step 1: Update Your Database Config

First, install the PostgreSQL driver:

```bash
# In your local backend directory
npm install pg pg-hstore
```

Update `backend/package.json` dependencies:
```json
{
  "dependencies": {
    "pg": "^8.11.0",
    "pg-hstore": "^2.3.4"
  }
}
```

Update `backend/src/config/database.js`:
```javascript
module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sonos_app',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'DATABASE_URL',
    dialect: 'postgres',  // Changed from mysql
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    logging: false
  }
};
```

Commit and push these changes:
```bash
git add .
git commit -m "Add PostgreSQL support for Render"
git push
```

### Step 2: Create PostgreSQL Database on Render

1. On Render dashboard, click **"New +"** again
2. Select **"PostgreSQL"**
3. Fill out the form:
   - **Name**: `sonos-database`
   - **Database**: `sonos_db` (or any name)
   - **User**: `sonos_user` (or any name)
   - **Region**: Same as your web service (important!)
   - **PostgreSQL Version**: Latest (14 or newer)
   - **Instance Type**: **Free** (important!)

4. Click **"Create Database"**
5. Wait for it to provision (1-2 minutes)

### Step 3: Get Database Connection String

1. After database is created, click on it in your dashboard
2. Scroll down to **"Connections"** section
3. You'll see several connection strings - copy the **"Internal Database URL"**
   - It looks like: `postgres://user:pass@hostname/dbname`
   - Use the **Internal** URL (faster, free traffic between services)

### Step 4: Add DATABASE_URL to Your Web Service

1. Go back to your web service (sonos-backend)
2. Click **"Environment"** in the left sidebar
3. Find the `DATABASE_URL` variable (or add it if it doesn't exist)
4. Paste the **Internal Database URL** you just copied
5. Click **"Save Changes"**
6. Your service will automatically redeploy

---

## Part 4: Run Database Migrations

Now we need to create the database tables. You have two options:

### Option 1: Using Render Shell (Recommended)

1. In your web service dashboard, click **"Shell"** in the left sidebar
2. This opens a terminal connected to your running app
3. Run your migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```
4. You should see output like:
   ```
   == 20231201000000-create-users: migrating =======
   == 20231201000000-create-users: migrated (0.123s)
   ```

### Option 2: Using Build Command

Add migrations to your build command:

1. Go to **"Settings"** in your web service
2. Scroll to **"Build & Deploy"**
3. Update **Build Command** to:
   ```bash
   npm install && npx sequelize-cli db:migrate
   ```
4. Click **"Save Changes"**
5. Manually trigger a redeploy (or just push a new commit)

**Note**: This runs migrations on every deploy, which is fine since Sequelize skips already-run migrations.

---

## Part 5: Update Sonos Developer Portal

Now that you have a permanent URL, update your Sonos integration:

1. Go to https://integration.sonos.com/
2. Sign in and select your integration
3. Find the **Redirect URIs** section
4. Add your Render URL:
   ```
   https://sonos-backend.onrender.com/auth/callback
   ```
   (Replace with your actual service name)
5. Click **"Save"**

---

## Part 6: Test Your Backend

### Check if Backend is Running

Open your browser and go to:
```
https://sonos-backend.onrender.com/api-docs
```

You should see your Swagger documentation.

### Test Authentication Flow

1. Make sure your frontend is configured to use the Render backend
2. Update `frontend/.env`:
   ```
   VITE_API_URL=https://sonos-backend.onrender.com
   ```

3. Start your frontend:
   ```bash
   cd frontend
   npm run dev
   ```

4. Open http://localhost:5173
5. Click "Connect to Sonos"
6. You should be redirected to Sonos login
7. After authorizing, you should be redirected back and logged in

---

## Part 7: Monitor and Debug

### View Logs

1. In your web service dashboard, click **"Logs"** in the left sidebar
2. This shows real-time logs from your application
3. Look for errors, startup messages, API calls, etc.

### Common Issues & Solutions

#### Issue: "Application failed to respond"
**Solution**: Check your logs. Usually means:
- App crashed on startup
- Wrong start command
- Missing environment variables
- Database connection failed

#### Issue: "502 Bad Gateway"
**Solution**: Your app isn't starting properly. Check:
- Is `PORT` environment variable being read correctly?
- Are all dependencies installed?
- Check logs for errors

#### Issue: OAuth redirect fails
**Solution**: 
- Verify `SONOS_REDIRECT_URI` exactly matches what's in Sonos portal
- Check for typos in the URL
- Make sure it's using `https://` not `http://`

#### Issue: Database connection errors
**Solution**:
- Verify `DATABASE_URL` is set correctly
- Make sure it's the **Internal Database URL**
- Check that database is in the same region as web service

#### Issue: Slow first request (15-30 seconds)
**Solution**: This is normal for free tier! The app "spins down" after 15 minutes of inactivity. First request after that has to "wake it up."

### Keep Your App Warm (Optional)

To prevent spin-down, you can use a free service like:

**UptimeRobot** (https://uptimerobot.com):
1. Sign up free
2. Add a monitor for `https://sonos-backend.onrender.com`
3. Set to ping every 5 minutes
4. This keeps your app awake during development

**Note**: This uses more of Render's bandwidth, but should still be within free tier limits.

---

## Part 8: Ongoing Development Workflow

### Making Changes to Your Backend

```bash
# 1. Make your code changes locally
# Edit files in backend/

# 2. Test locally first
npm run dev

# 3. Commit and push
git add .
git commit -m "Add new feature"
git push

# 4. Render automatically redeploys!
# Watch the logs in Render dashboard
```

Auto-deploy takes about 2-3 minutes.

### Viewing Environment Variables

1. Go to your web service
2. Click **"Environment"** in sidebar
3. You can view, add, edit, or delete variables
4. Changes trigger an automatic redeploy

### Manual Redeploy

If you need to force a redeploy:
1. Go to your web service
2. Click **"Manual Deploy"** at top right
3. Select **"Clear build cache & deploy"** if you want a fresh build

---

## Part 9: Cost Monitoring

### Check Your Usage

1. Click your avatar (top right)
2. Select **"Account Settings"**
3. Click **"Billing"**
4. View your current usage

Free tier includes:
- 750 hours/month of runtime (plenty for one app)
- 100 GB bandwidth/month
- PostgreSQL database with 1 GB storage

You'll get email warnings if you approach limits.

---

## Summary: What You Have Now

✅ **Backend deployed**: `https://sonos-backend.onrender.com`

✅ **PostgreSQL database**: Running and connected

✅ **Permanent OAuth redirect**: Set in Sonos portal

✅ **Auto-deployment**: Push to GitHub = automatic deploy

✅ **Frontend local**: Still developing at `http://localhost:5173`

✅ **Environment variables**: All secrets stored securely on Render

---

## Architecture Diagram

```
┌─────────────────┐
│   Your Laptop   │
│                 │
│  Frontend       │ http://localhost:5173
│  (React + Vite) │
└────────┬────────┘
         │ API Calls
         ↓
┌─────────────────────────────────┐
│      Render (Cloud)             │
│                                 │
│  ┌──────────────────┐          │
│  │  Web Service     │          │
│  │  (Express API)   │          │  https://sonos-backend.onrender.com
│  │                  │          │
│  └────────┬─────────┘          │
│           │                     │
│           ↓                     │
│  ┌──────────────────┐          │
│  │  PostgreSQL DB   │          │
│  │  (User data)     │          │
│  └──────────────────┘          │
│                                 │
└─────────────────────────────────┘
         ↑
         │ OAuth Redirect
         │
┌────────┴────────┐
│   Sonos API     │
│   (OAuth)       │
└─────────────────┘
```

---

## Next Steps

1. ✅ Backend is deployed and running
2. ✅ Database is set up and connected
3. ✅ Sonos OAuth is configured
4. 🔄 Start building your frontend features
5. 🔄 Test the full authentication flow
6. 🔄 Add device listing and volume control

---

## Troubleshooting Checklist

If something isn't working:

- [ ] Is your web service status "Live" in Render?
- [ ] Are all environment variables set correctly?
- [ ] Did database migrations run successfully?
- [ ] Is `SONOS_REDIRECT_URI` exactly matching Sonos portal?
- [ ] Is `FRONTEND_URL` set to `http://localhost:5173`?
- [ ] Did you commit and push your latest changes?
- [ ] Are there any errors in the Render logs?
- [ ] Is your frontend `.env` pointing to the Render URL?

---

## Getting Help

- **Render Docs**: https://render.com/docs
- **Render Community**: https://community.render.com/
- **Your Logs**: Always check logs first - they usually tell you what's wrong

Good luck with your Sonos project! 🎵