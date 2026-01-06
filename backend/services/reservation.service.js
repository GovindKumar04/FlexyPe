import Inventory from '../models/Inventory.js';
import Reservation from '../models/Reservation.js';

export const reserve = async ({ sku, quantity, idempotencyKey }) => {
  if (!sku || !quantity || !idempotencyKey) throw new Error('Missing fields');

  // Check idempotency
  let existing = await Reservation.findOne({ idempotencyKey });
  if (existing) return existing;

  // Atomic update: decrement inventory if enough quantity
  const updated = await Inventory.findOneAndUpdate(
    { sku, quantity: { $gte: quantity } },
    { $inc: { quantity: -quantity } },
    { new: true }
  );

  if (!updated) throw new Error('Not enough inventory');

  const expiresAt = new Date(Date.now() + (process.env.RESERVATION_EXPIRY_MINUTES || 5) * 60 * 1000);

  const reservation = await Reservation.create({
    sku,
    quantity,
    idempotencyKey,
    expiresAt,
  });

  return reservation;
};

export const confirmReservation = async ({ id }) => {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.status !== 'RESERVED') throw new Error('Cannot confirm this reservation');

  reservation.status = 'CONFIRMED';
  await reservation.save();
  return reservation;
};

export const cancelReservation = async ({ id }) => {
  const reservation = await Reservation.findById(id);
  if (!reservation) throw new Error('Reservation not found');
  if (reservation.status !== 'RESERVED') throw new Error('Cannot cancel this reservation');

  reservation.status = 'CANCELLED';
  await reservation.save();

  // Add back inventory
  await Inventory.findOneAndUpdate({ sku: reservation.sku }, { $inc: { quantity: reservation.quantity } });

  return reservation;
};
