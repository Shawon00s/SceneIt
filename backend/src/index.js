import express from 'express';
import cors from 'cors';
import "dotenv/config";

import authRoutes from './routes/authRoutes.js';
import { connectDB } from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});