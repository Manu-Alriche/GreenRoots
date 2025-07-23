import express from 'express';
import { createCheckoutSession, getSessionDetails, createOrderFromSession } from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create-checkout-session', authenticate, createCheckoutSession);
router.get('/session/:sessionId', authenticate, getSessionDetails);
router.post('/create-order-from-session', authenticate, createOrderFromSession);

export default router;