import {
  confirm,
  cancel
} from '../services/reservation.service.js';

export const confirmCheckout = async (req, res) => {
  try {
    const result = await confirm(req.body.reservationId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const cancelCheckout = async (req, res) => {
  try {
    const result = await cancel(req.body.reservationId);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
