const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const authMiddleware = require('../middleware/auth');

/**
 * @swagger
 * /api/households/{householdId}/groups:
 *   get:
 *     summary: Get groups (devices) in a household
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
 *         description: List of groups
 */
router.get('/households/:householdId/groups', authMiddleware, deviceController.getGroups);

/**
 * @swagger
 * /api/groups/{groupId}/volume:
 *   get:
 *     summary: Get volume for a group
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Volume information
 */
router.get('/:groupId/volume', authMiddleware, deviceController.getVolume);

/**
 * @swagger
 * /api/groups/{groupId}/volume:
 *   post:
 *     summary: Set volume for a group
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: groupId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               volume:
 *                 type: integer
 *                 minimum: 0
 *                 maximum: 100
 *               volumeDelta:
 *                 type: integer
 *               muted:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Volume set successfully
 */
router.post('/:groupId/volume', authMiddleware, deviceController.setVolume);

module.exports = router;
