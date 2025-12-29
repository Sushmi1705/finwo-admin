import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

import adminRoutes from './routes/adminRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import shopRoutes from './routes/shopRoutes.js';
import menuRoutes from './routes/menuRoutes.js';

dotenv.config();

// ESM replacements for __filename / __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/shops', shopRoutes);
app.use('/api/menus', menuRoutes);

// TEMP: download the SQLite DB from Render
app.get('/api/debug/download-db', (req, res) => {
  const dbPath = path.join(__dirname, '../prisma/dev.db'); // adjust if prisma is elsewhere
  res.download(dbPath);
});

app.get('/', (req, res) => {
  res.send('Admin Backend Running');
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});