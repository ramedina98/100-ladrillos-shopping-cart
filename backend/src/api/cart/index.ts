import { Router } from 'express';

import addBrick from './addBrick.js';

const router = Router();

router.post('/', addBrick);

export default router;
