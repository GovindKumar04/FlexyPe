import {
  reserve
} from '../services/reservation.service.js';

export const reserveInventory = async (req, res) => {
  try {
    const result = await reserve(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getInventory = async (req, res) => {
  const { sku } = req.params;
  const { default: pool } = await import('../config/db.js');

  const [rows] = await pool.query(
    'SELECT sku, quantity FROM inventory WHERE sku = ?',
    [sku]
  );

  res.json(rows[0] || { sku, quantity: 0 });
};
