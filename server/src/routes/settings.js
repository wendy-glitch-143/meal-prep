import { Router } from 'express';
import pool from '../db.js';

const router = Router();
const EXTRA_COLORS = ['#C8D8E4', '#E4B4A4', '#D4B896', '#B8D4C8', '#F4C7C3'];

function slugify(label) {
  return String(label)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
    .slice(0, 50);
}

router.get('/', async (_req, res) => {
  try {
    const [mealTypes] = await pool.query('SELECT * FROM meal_types ORDER BY sort_order, id');
    const [categories] = await pool.query('SELECT * FROM ingredient_categories ORDER BY sort_order, id');
    res.json({ mealTypes, categories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load settings' });
  }
});

router.post('/meal-types', async (req, res) => {
  const label = String(req.body?.label || '').trim();
  const slug = slugify(label);
  if (!slug) return res.status(400).json({ error: 'Meal type name is required' });

  try {
    const [[{ maxSort }]] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) AS maxSort FROM meal_types');
    const color = EXTRA_COLORS[maxSort % EXTRA_COLORS.length];
    await pool.query(
      'INSERT INTO meal_types (slug, label, color, is_default, sort_order) VALUES (?, ?, ?, 0, ?)',
      [slug, label, color, maxSort + 1]
    );
    const [rows] = await pool.query('SELECT * FROM meal_types WHERE slug = ?', [slug]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'That meal type already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not add meal type' });
  }
});

router.delete('/meal-types/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM meal_types WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Meal type not found' });

    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM meal_types');
    if (total <= 1) return res.status(400).json({ error: 'Keep at least one meal type' });

    const [[{ used }]] = await pool.query(
      `SELECT
         (SELECT COUNT(*) FROM recipes WHERE meal_type = ?) +
         (SELECT COUNT(*) FROM plan_slots WHERE meal_type = ?) AS used`,
      [rows[0].slug, rows[0].slug]
    );
    if (used > 0) {
      return res.status(400).json({ error: 'This meal type is still used by a recipe or plan' });
    }

    await pool.query('DELETE FROM meal_types WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not remove meal type' });
  }
});

router.post('/ingredient-categories', async (req, res) => {
  const label = String(req.body?.label || '').trim();
  const slug = slugify(label);
  if (!slug) return res.status(400).json({ error: 'Category name is required' });

  try {
    const [[{ maxSort }]] = await pool.query(
      'SELECT COALESCE(MAX(sort_order), 0) AS maxSort FROM ingredient_categories'
    );
    await pool.query(
      'INSERT INTO ingredient_categories (slug, label, is_default, sort_order) VALUES (?, ?, 0, ?)',
      [slug, label, maxSort + 1]
    );
    const [rows] = await pool.query('SELECT * FROM ingredient_categories WHERE slug = ?', [slug]);
    res.status(201).json(rows[0]);
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'That category already exists' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not add category' });
  }
});

router.delete('/ingredient-categories/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ingredient_categories WHERE id = ?', [req.params.id]);
    if (!rows[0]) return res.status(404).json({ error: 'Category not found' });

    const [[{ total }]] = await pool.query('SELECT COUNT(*) AS total FROM ingredient_categories');
    if (total <= 1) return res.status(400).json({ error: 'Keep at least one ingredient type' });

    const [[{ used }]] = await pool.query(
      'SELECT COUNT(*) AS used FROM ingredients WHERE category = ?',
      [rows[0].slug]
    );
    if (used > 0) {
      return res.status(400).json({ error: 'This ingredient type is still used by a recipe' });
    }

    await pool.query('DELETE FROM ingredient_categories WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not remove category' });
  }
});

export default router;
