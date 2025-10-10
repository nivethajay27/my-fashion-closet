import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET all items
router.get('/', async (_req, res) => {
  const { rows } = await pool.query(
    'SELECT id, name, category, color, season, tags, image_url AS "imageUrl", created_at AS "createdAt" FROM clothing_items ORDER BY created_at DESC'
  );
  res.json(rows);
});

// CREATE item
router.post('/', async (req, res) => {
  const { name, category, color, season = [], tags = [], imageUrl } = req.body;
  const { rows } = await pool.query(
    `INSERT INTO clothing_items (name, category, color, season, tags, image_url)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING id, name, category, color, season, tags, image_url AS "imageUrl", created_at AS "createdAt"`,
    [name, category, color, season, tags, imageUrl]
  );
  res.status(201).json(rows[0]);
});

// UPDATE item
router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const { name, category, color, season = [], tags = [], imageUrl } = req.body;
  const { rows } = await pool.query(
    `UPDATE clothing_items
     SET name=$1, category=$2, color=$3, season=$4, tags=$5, image_url=$6
     WHERE id=$7
     RETURNING id, name, category, color, season, tags, image_url AS "imageUrl", created_at AS "createdAt"`,
    [name, category, color, season, tags, imageUrl, id]
  );
  res.json(rows[0]);
});

// DELETE item
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await pool.query('DELETE FROM clothing_items WHERE id=$1', [id]);
  res.status(204).end();
});

export default router;
