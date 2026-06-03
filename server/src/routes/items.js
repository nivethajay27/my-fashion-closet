import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

const ITEM_FIELDS = `
  id, name, category, color, material, season, occasion, tags,
  image_url AS "imageUrl", created_at AS "createdAt"
`;

const toArray = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string') return value.split(',').map((v) => v.trim()).filter(Boolean);
  return [];
};

// GET all items
router.get('/', async (req, res) => {
  try {
    const { category, color, season, occasion } = req.query;
    const clauses = [];
    const values = [];

    if (category) {
      values.push(category);
      clauses.push(`category = $${values.length}`);
    }
    if (color) {
      values.push(color);
      clauses.push(`LOWER(color) = LOWER($${values.length})`);
    }
    if (season) {
      values.push(season);
      clauses.push(`(season @> ARRAY[$${values.length}]::text[] OR season @> ARRAY['all']::text[])`);
    }
    if (occasion) {
      values.push(occasion);
      clauses.push(`occasion @> ARRAY[$${values.length}]::text[]`);
    }

    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const { rows } = await pool.query(
      `SELECT ${ITEM_FIELDS} FROM clothing_items ${where} ORDER BY created_at DESC`,
      values
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// CREATE item
router.post('/', async (req, res) => {
  try {
    const { name, category, color, material, imageUrl } = req.body;
    const season = toArray(req.body.season);
    const occasion = toArray(req.body.occasion);
    const tags = toArray(req.body.tags);

    if (!name || !category || !imageUrl) {
      return res.status(400).json({ error: 'name, category, and imageUrl are required' });
    }

    const { rows } = await pool.query(
      `INSERT INTO clothing_items (name, category, color, material, season, occasion, tags, image_url)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
       RETURNING ${ITEM_FIELDS}`,
      [name, category, color, material, season, occasion, tags, imageUrl]
    );
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// UPDATE item
router.put('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { name, category, color, material, imageUrl } = req.body;
    const season = toArray(req.body.season);
    const occasion = toArray(req.body.occasion);
    const tags = toArray(req.body.tags);
    const { rows } = await pool.query(
      `UPDATE clothing_items
       SET name=$1, category=$2, color=$3, material=$4, season=$5, occasion=$6, tags=$7, image_url=$8
       WHERE id=$9
       RETURNING ${ITEM_FIELDS}`,
      [name, category, color, material, season, occasion, tags, imageUrl, id]
    );
    if (!rows[0]) return res.status(404).json({ error: 'Item not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// DELETE item
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await pool.query('DELETE FROM clothing_items WHERE id=$1', [id]);
  res.status(204).end();
});

export default router;
