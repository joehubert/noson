require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Import routes
const authRoutes = require('./routes/auth');
const householdRoutes = require('./routes/households');
const deviceRoutes = require('./routes/devices');
const serviceRoutes = require('./routes/services');

// Import middleware
const errorHandler = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true 
}));
app.use(express.json());
app.use(morgan('dev'));

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Sonos Control API',
      version: '1.0.0',
      description: 'API for controlling Sonos devices'
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://your-app.onrender.com'
          : `http://localhost:${PORT}`
      }
    ]
  },
  apis: ['./src/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Sonos API is running' });
});

// Routes
app.use('/auth', authRoutes);
app.use('/api/households', householdRoutes);
app.use('/api/groups', deviceRoutes);
app.use('/api/households', serviceRoutes);

// Error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
});

module.exports = app;
