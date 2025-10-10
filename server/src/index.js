import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import itemsRouter from './routes/items.js';
import outfitsRouter from './routes/outfits.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/items', itemsRouter);
app.use('/api/outfits', outfitsRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
