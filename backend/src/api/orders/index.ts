import { Router } from 'express';

import checkoutCart from './checkoutCart.js';

const router = Router();

router.post('/checkout', checkoutCart);

export default router;
