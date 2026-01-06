import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import connectDB from './config/db.js';
import inventoryRoutes from './routes/inventory.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import startExpiryJob from './jobs/expire.job.js';

await connectDB();

const app = express();
app.use(express.json());

app.use('/inventory', inventoryRoutes);
app.use('/checkout', checkoutRoutes);

startExpiryJob();

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on port ${process.env.PORT || 3000}`);
});
