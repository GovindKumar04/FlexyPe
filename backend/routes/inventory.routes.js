import express from 'express';
import { reserveInventory, getInventory } from '../controllers/inventory.controller.js';

const router = express.Router();

router.post('/reserve', reserveInventory);
router.get('/:sku', getInventory);

export default router;
