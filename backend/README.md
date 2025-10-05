# Noson Backend

Backend API for Noson - Sonos Control Application

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL (production) / MySQL (local development)
- **ORM**: Sequelize
- **Authentication**: JWT + Sonos OAuth 2.0
- **Documentation**: Swagger/OpenAPI

## Prerequisites

- Node.js 18 or higher
- npm
- MySQL (for local development) or PostgreSQL (for Render deployment)
- Sonos Developer Account with registered integration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```bash
# Server
NODE_ENV=development
PORT=3000

# Database (Local MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=sonos_app
DB_USER=root
DB_PASSWORD=your_mysql_password

# JWT
JWT_SECRET=your_secure_random_jwt_secret
JWT_EXPIRES_IN=7d

# Sonos OAuth
SONOS_CLIENT_ID=your_sonos_client_id
SONOS_CLIENT_SECRET=your_sonos_client_secret
SONOS_REDIRECT_URI=https://your-app.onrender.com/auth/callback

# Encryption (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
ENCRYPTION_KEY=your_32_byte_hex_key

# CORS
FRONTEND_URL=http://localhost:5173
```

### 3. Generate Secrets

Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Generate Encryption Key:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Create Database

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE sonos_app;
exit
```

### 5. Run Migrations

```bash
npm run migrate
```

### 6. Start Development Server

```bash
npm run dev
```

The server will start on http://localhost:3000

### 7. View API Documentation

Open http://localhost:3000/api-docs in your browser to see the Swagger documentation.

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests
- `npm run migrate` - Run database migrations
- `npm run migrate:undo` - Undo last migration

## Project Structure

```
backend/
├── src/
│   ├── app.js              # Express app entry point
│   ├── config/             # Configuration files
│   │   ├── database.js     # Sequelize config
│   │   ├── swagger.js      # Swagger config
│   │   └── encryption.js   # Encryption utilities
│   ├── models/             # Sequelize models
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Token.js
│   │   └── UserSettings.js
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── householdController.js
│   │   ├── deviceController.js
│   │   └── serviceController.js
│   ├── routes/             # Express routes
│   │   ├── auth.js
│   │   ├── households.js
│   │   ├── devices.js
│   │   └── services.js
│   ├── services/           # Business logic
│   │   ├── sonosService.js
│   │   └── tokenService.js
│   ├── middleware/         # Express middleware
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   └── utils/              # Utility functions
│       ├── constants.js
│       └── logger.js
├── migrations/             # Database migrations
└── package.json
```

## API Endpoints

### Authentication
- `GET /auth/login` - Initiate Sonos OAuth flow
- `GET /auth/callback` - OAuth callback handler
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user info

### Households
- `GET /api/households` - Get user's households

### Devices
- `GET /api/households/:householdId/groups` - Get devices in household
- `GET /api/groups/:groupId/volume` - Get volume for device
- `POST /api/groups/:groupId/volume` - Set volume for device

### Services
- `GET /api/households/:householdId/services` - Get music services

## Deployment to Render

See [Render Deployment Guide](../docs/render-deployment.md) for detailed instructions.

Quick steps:
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repo
4. Add environment variables
5. Deploy

## Troubleshooting

### Database Connection Issues
- Verify MySQL is running: `mysql -u root -p`
- Check database exists: `SHOW DATABASES;`
- Verify credentials in `.env`

### OAuth Errors
- Verify `SONOS_REDIRECT_URI` matches exactly what's in Sonos Developer Portal
- Check `SONOS_CLIENT_ID` and `SONOS_CLIENT_SECRET` are correct

### Token Encryption Errors
- Ensure `ENCRYPTION_KEY` is exactly 64 hex characters (32 bytes)
- Generate new key if needed with the command above

## Development

### Adding New Endpoints
1. Create controller function in `src/controllers/`
2. Create route in `src/routes/`
3. Add Swagger documentation comments
4. Test with Postman or curl

### Database Changes
1. Create new migration: `npx sequelize-cli migration:generate --name your-migration-name`
2. Edit migration file in `migrations/`
3. Run migration: `npm run migrate`

## License

MIT
