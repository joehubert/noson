const express = require('express');
const router = express.Router();
const serviceController = require('../controllers/serviceController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/households/{householdId}/services:
 *   get:
 *     summary: Get music services for a household
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: householdId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of music services
 */
router.get('/:householdId/services', authMiddleware, serviceController.getMusicServices);

module.exports = router;
