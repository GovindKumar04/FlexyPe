import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  sku: { type: String, required: true, unique: true },
  quantity: { type: Number, required: true, min: 0 },
}, { timestamps: true });

export default mongoose.model('Inventory', inventorySchema);
