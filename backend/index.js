import express from 'express';
import dotenv from 'dotenv';

import inventoryRoutes from './routes/inventory.routes.js';
import checkoutRoutes from './routes/checkout.routes.js';
import startExpiryJob from './jobs/expire.job.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/inventory', inventoryRoutes);
app.use('/checkout', checkoutRoutes);

startExpiryJob();

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
