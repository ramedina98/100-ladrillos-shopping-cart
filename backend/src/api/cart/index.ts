import { Router } from 'express';

import addBrick from './addBrick.js';

const router = Router();

/**
 * @swagger
 * /api/v1/carts:
 *   post:
 *     summary: Add a brick to a user's active shopping cart
 *     description: >
 *       Adds a brick to the active cart of a given user. If the user does not
 *       have an active cart, a new one will be created automatically.
 *       Bricks are grouped by their property in the response.
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brickId
 *               - userId
 *             properties:
 *               brickId:
 *                 type: string
 *                 format: uuid
 *                 example: e62a914d-6713-44ec-bae2-76f09dd1fc78
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 example: bf58c9fd-c51c-4b7e-865f-c33f0197fbf5
 *     responses:
 *       201:
 *         description: Brick successfully added to the cart
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   format: uuid
 *                 userId:
 *                   type: string
 *                   format: uuid
 *                 status:
 *                   type: string
 *                 properties:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       bricks:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             brickId:
 *                               type: string
 *                               format: uuid
 *                             propertyId:
 *                               type: string
 *                               format: uuid
 *                             priceAtAddTime:
 *                               type: number
 *       404:
 *         description: Brick not found
 *       500:
 *         description: Internal server error
 */
router.post('/', addBrick);

export default router;
