import { Router } from 'express';

import checkout from './checkout.js';
import complete from './complete.js';
import reviewOrder from './reviewOrder.js';

const router = Router();

/**
 * @swagger
 * /api/v1/orders/{id}:
 *   get:
 *     summary: Retrieve details of a specific order
 *     description: |
 *       Returns the full details of an order by its ID, including bricks grouped by property,
 *       the order status, total amount, and timestamps
 *        for terms acceptance, confirmation, and completion.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the order to review
 *     responses:
 *       200:
 *         description: Order details retrieved successfully
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
 *                 totalAmount:
 *                   type: number
 *                 termsAcceptedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 confirmedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 completedAt:
 *                   type: string
 *                   format: date-time
 *                   nullable: true
 *                 status:
 *                   type: string
 *                   enum: [PENDING, TERMS_ACCEPTED, CONFIRMED, COMPLETED, FAILED]
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
 *                               nullable: true
 *                             brickId:
 *                               type: string
 *                               format: uuid
 *                             propertyId:
 *                               type: string
 *                               format: uuid
 *                             finalPrice:
 *                               type: number
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: ORDER_NOT_FOUND
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.get('/:id', reviewOrder);

/**
 * @swagger
 * /api/v1/orders/checkout:
 *   post:
 *     summary: Initiates the checkout process for a user's cart
 *     description: |
 *       Reserves the bricks in the user's cart, creates an order with those bricks,
 *       and marks the terms as accepted. Returns the resulting order with its status
 *       and bricks grouped by property.
 *     tags:
 *       - Orders
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - acceptTerms
 *             properties:
 *               userId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the user performing the checkout
 *               acceptTerms:
 *                 type: boolean
 *                 description: Must be true if the user accepts the terms
 *     responses:
 *       200:
 *         description: Order successfully created
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
 *                 totalAmount:
 *                   type: number
 *                 termsAcceptedAt:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [PENDING, TERMS_ACCEPTED, CONFIRMED, COMPLETED, FAILED]
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
 *                               nullable: true
 *                             brickId:
 *                               type: string
 *                               format: uuid
 *                             propertyId:
 *                               type: string
 *                               format: uuid
 *                             finalPrice:
 *                               type: number
 *       422:
 *         description: Terms not accepted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: TERMS_NOT_ACCEPTED
 *                 message:
 *                   type: string
 *       404:
 *         description: Cart not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: CART_NOT_FOUND
 *                 message:
 *                   type: string
 *       409:
 *         description: Brick not available (already reserved or sold)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 code:
 *                   type: string
 *                   example: BRICK_NOT_AVAILABLE
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
router.post('/checkout', checkout);

/**
 * @swagger
 * /api/v1/orders/{id}/complete:
 *   post:
 *     summary: Complete an order
 *     description: Marks the order as CONFIRMED and COMPLETED.
 *     tags:
 *       - Orders
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the order to complete
 *     responses:
 *       200:
 *         description: Order successfully created
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
 *                 totalAmount:
 *                   type: number
 *                 termsAcceptedAt:
 *                   type: string
 *                   format: date-time
 *                 status:
 *                   type: string
 *                   enum: [PENDING, TERMS_ACCEPTED, CONFIRMED, COMPLETED, FAILED]
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
 *                               nullable: true
 *                             brickId:
 *                               type: string
 *                               format: uuid
 *                             propertyId:
 *                               type: string
 *                               format: uuid
 *                             finalPrice:
 *                               type: number
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
router.post('/:id/complete', complete);

export default router;
