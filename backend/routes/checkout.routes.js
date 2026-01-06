import express from 'express';
import {
  confirmCheckout,
  cancelCheckout
} from '../controllers/checkout.controller.js';

const router = express.Router();

router.post('/confirm', confirmCheckout);
router.post('/cancel', cancelCheckout);

export default router;
