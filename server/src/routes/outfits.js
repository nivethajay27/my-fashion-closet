import { Router } from 'express';
import { pool } from '../db.js';

const router = Router();

// GET all outfits with items
router.get('/', async (_req, res) => {
  const outfits = await pool.query(
    'SELECT id, name, rating, score_breakdown AS "scoreBreakdown", explanation, created_at AS "createdAt" FROM outfits ORDER BY created_at DESC'
  );
  const items = await pool.query(
    `SELECT oi.outfit_id, ci.id, ci.name, ci.category, ci.color, ci.material, ci.season, ci.occasion, ci.tags, ci.image_url AS "imageUrl"
     FROM outfit_items oi
     JOIN clothing_items ci ON ci.id = oi.clothing_item_id`
  );
  const byOutfit = items.rows.reduce((map, r) => {
    (map[r.outfit_id] ||= []).push({
      id: r.id,
      name: r.name,
      category: r.category,
      color: r.color,
      material: r.material,
      season: r.season,
      occasion: r.occasion,
      tags: r.tags,
      imageUrl: r.imageUrl
    });
    return map;
  }, {});
  res.json(outfits.rows.map(o => ({ ...o, items: byOutfit[o.id] || [] })));
});

// CREATE new outfit
router.post('/', async (req, res) => {
  const client = await pool.connect();
  try {
    const { name, items = [], rating = null, scoreBreakdown = {}, explanation = '' } = req.body;
    await client.query('BEGIN');
    const { rows } = await client.query(
      `INSERT INTO outfits (name, rating, score_breakdown, explanation)
       VALUES ($1,$2,$3,$4)
       RETURNING id, name, rating, score_breakdown AS "scoreBreakdown", explanation, created_at AS "createdAt"`,
      [name, rating, scoreBreakdown, explanation]
    );
    const outfit = rows[0];
    if (items.length) {
      const values = items.map((id, i) => `($1, $${i + 2})`).join(',');
      await client.query(`INSERT INTO outfit_items (outfit_id, clothing_item_id) VALUES ${values}`, [outfit.id, ...items]);
    }
    await client.query('COMMIT');
    res.status(201).json(outfit);
  } catch (e) {
    await client.query('ROLLBACK');
    res.status(500).json({ error: e.message });
  } finally {
    client.release();
  }
});

// DELETE outfit
router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);
  await pool.query('DELETE FROM outfits WHERE id=$1', [id]);
  res.status(204).end();
});

export default router;
