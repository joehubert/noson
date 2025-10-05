const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /auth/login:
 *   get:
 *     summary: Initiate Sonos OAuth flow
 *     description: Redirects user to Sonos login page
 *     responses:
 *       302:
 *         description: Redirect to Sonos OAuth
 */
router.get('/login', authController.getAuthorizationUrl);

/**
 * @swagger
 * /auth/callback:
 *   get:
 *     summary: OAuth callback endpoint
 *     description: Handles OAuth callback from Sonos
 *     parameters:
 *       - in: query
 *         name: code
 *         schema:
 *           type: string
 *         description: Authorization code from Sonos
 *       - in: query
 *         name: state
 *         schema:
 *           type: string
 *         description: State parameter
 *     responses:
 *       302:
 *         description: Redirect to frontend with JWT token
 */
router.get('/callback', authController.handleCallback);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/logout', authMiddleware, authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user info
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information
 */
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;
