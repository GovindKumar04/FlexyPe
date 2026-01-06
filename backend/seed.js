import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import Inventory from './models/Inventory.js';

const seedInventory = async () => {
  await connectDB();

  const items = [
    { sku: 'IPHONE_15', quantity: 1 },
    { sku: 'AIRPODS_PRO', quantity: 5 },
  ];

  for (const item of items) {
    const exists = await Inventory.findOne({ sku: item.sku });
    if (!exists) {
      await Inventory.create(item);
    } else {
      exists.quantity = item.quantity;
      await exists.save();
    }
  }

  console.log('✅ Inventory seeded');
  process.exit(0);
};

seedInventory();
