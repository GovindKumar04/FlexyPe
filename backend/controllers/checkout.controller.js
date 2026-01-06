import { confirmReservation, cancelReservation } from '../services/reservation.service.js';

export const confirmCheckout = async (req, res) => {
  try {
    const result = await confirmReservation(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const cancelCheckout = async (req, res) => {
  try {
    const result = await cancelReservation(req.body);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
