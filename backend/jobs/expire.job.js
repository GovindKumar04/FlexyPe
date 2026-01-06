import Reservation from '../models/Reservation.js';
import Inventory from '../models/Inventory.js';

const expireReservations = async () => {
  const now = new Date();
  const expired = await Reservation.find({ status: 'RESERVED', expiresAt: { $lte: now } });

  for (const resv of expired) {
    resv.status = 'EXPIRED';
    await resv.save();
    await Inventory.findOneAndUpdate({ sku: resv.sku }, { $inc: { quantity: resv.quantity } });
  }
};

export default function startExpiryJob() {
  setInterval(expireReservations, 60 * 1000); // run every 1 min
}
