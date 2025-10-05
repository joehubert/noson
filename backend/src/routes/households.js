const express = require('express');
const router = express.Router();
const householdController = require('../controllers/householdController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/households:
 *   get:
 *     summary: Get user's Sonos households
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of households
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 */
router.get('/', authMiddleware, householdController.getHouseholds);

module.exports = router;
