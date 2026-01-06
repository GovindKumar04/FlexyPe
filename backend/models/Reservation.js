import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  sku: { type: String, required: true, ref: 'Inventory' },
  quantity: { type: Number, required: true },
  status: { type: String, enum: ['RESERVED', 'CONFIRMED', 'CANCELLED', 'EXPIRED'], default: 'RESERVED' },
  expiresAt: { type: Date, required: true },
  idempotencyKey: { type: String, unique: true, required: true },
}, { timestamps: true });

export default mongoose.model('Reservation', reservationSchema);
