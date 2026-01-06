import Inventory from '../models/Inventory.js';
import { reserve } from '../services/reservation.service.js';

export const reserveInventory = async (req, res) => {
  try {
    const reservation = await reserve(req.body);
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getInventory = async (req, res) => {
  try {
    const { sku } = req.params;
    const item = await Inventory.findOne({ sku });
    res.json(item || { sku, quantity: 0 });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
