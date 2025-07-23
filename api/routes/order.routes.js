import express from 'express';
import { getAll, create, getByReference } from '../controllers/order.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', authenticate, getAll);
router.get('/:reference', authenticate, getByReference);
router.post('/', authenticate, create)

export default router;
