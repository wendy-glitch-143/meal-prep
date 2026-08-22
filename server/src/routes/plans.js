import { Router } from 'express';
import pool from '../db.js';

const router = Router();

function isWeekStart(value) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

router.get('/:weekStart', async (req, res) => {
  const { weekStart } = req.params;
  if (!isWeekStart(weekStart)) {
    return res.status(400).json({ error: 'weekStart must be YYYY-MM-DD' });
  }

  try {
    const [plans] = await pool.query(
      'SELECT id FROM meal_plans WHERE user_id = ? AND week_start = ?',
      [req.user.id, weekStart]
    );

    if (!plans[0]) {
      return res.json({ weekStart, slots: [] });
    }

    const [slots] = await pool.query(
      `SELECT ps.day_of_week, ps.meal_type, ps.recipe_id,
              r.name, r.emoji, r.color, r.prep_minutes
       FROM plan_slots ps
       JOIN recipes r ON r.id = ps.recipe_id
       WHERE ps.meal_plan_id = ?
       ORDER BY ps.day_of_week, FIELD(ps.meal_type, 'breakfast', 'lunch', 'dinner')`,
      [plans[0].id]
    );

    res.json({ weekStart, slots });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load meal plan' });
  }
});

router.put('/:weekStart', async (req, res) => {
  const { weekStart } = req.params;
  const slots = Array.isArray(req.body?.slots) ? req.body.slots : null;

  if (!isWeekStart(weekStart)) {
    return res.status(400).json({ error: 'weekStart must be YYYY-MM-DD' });
  }
  if (!slots) {
    return res.status(400).json({ error: 'slots array is required' });
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [existing] = await conn.query(
      'SELECT id FROM meal_plans WHERE user_id = ? AND week_start = ?',
      [req.user.id, weekStart]
    );

    let planId = existing[0]?.id;
    if (!planId) {
      const [created] = await conn.query(
        'INSERT INTO meal_plans (user_id, week_start) VALUES (?, ?)',
        [req.user.id, weekStart]
      );
      planId = created.insertId;
    }

    await conn.query('DELETE FROM plan_slots WHERE meal_plan_id = ?', [planId]);

    const [types] = await conn.query('SELECT slug FROM meal_types');
    const allowed = new Set(types.map((t) => t.slug));

    for (const slot of slots) {
      const day = Number(slot.day_of_week);
      if (day < 0 || day > 6 || !allowed.has(slot.meal_type) || !slot.recipe_id) {
        continue;
      }
      await conn.query(
        'INSERT INTO plan_slots (meal_plan_id, day_of_week, meal_type, recipe_id) VALUES (?, ?, ?, ?)',
        [planId, day, slot.meal_type, slot.recipe_id]
      );
    }

    await conn.commit();
    res.json({ ok: true });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Could not save meal plan' });
  } finally {
    conn.release();
  }
});

router.get('/:weekStart/grocery', async (req, res) => {
  const { weekStart } = req.params;
  if (!isWeekStart(weekStart)) {
    return res.status(400).json({ error: 'weekStart must be YYYY-MM-DD' });
  }

  try {
    const [rows] = await pool.query(
      `SELECT i.name, COALESCE(c.label, i.category) AS category_label
       FROM meal_plans mp
       JOIN plan_slots ps ON ps.meal_plan_id = mp.id
       JOIN recipe_ingredients ri ON ri.recipe_id = ps.recipe_id
       JOIN ingredients i ON i.id = ri.ingredient_id
       LEFT JOIN ingredient_categories c ON c.slug = i.category
       WHERE mp.user_id = ? AND mp.week_start = ?
       GROUP BY i.id, i.name, category_label, c.sort_order
       ORDER BY COALESCE(c.sort_order, 99), i.name`,
      [req.user.id, weekStart]
    );

    const groups = {};
    for (const row of rows) {
      const key = row.category_label;
      if (!groups[key]) groups[key] = [];
      groups[key].push({ name: row.name });
    }

    res.json({ weekStart, groups });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not build grocery list' });
  }
});

export default router;
