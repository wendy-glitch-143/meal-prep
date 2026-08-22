import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/menu', async (_req, res) => {
  try {
    const [recipes] = await pool.query(
      `SELECT r.*, rc.label AS category_label
       FROM recipes r
       LEFT JOIN recipe_categories rc ON rc.slug = r.category
       WHERE r.available = 1
       ORDER BY r.category, r.name`
    );
    const [recipeCategories] = await pool.query(
      'SELECT slug, label, icon FROM recipe_categories ORDER BY sort_order, id'
    );
    res.json({ recipes, recipeCategories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load menu' });
  }
});

router.get('/recipes/:id', async (req, res) => {
  try {
    const [recipes] = await pool.query(
      `SELECT r.*, rc.label AS category_label
       FROM recipes r
       LEFT JOIN recipe_categories rc ON rc.slug = r.category
       WHERE r.id = ?`,
      [req.params.id]
    );
    if (!recipes[0]) return res.status(404).json({ error: 'Recipe not found' });

    const [ingredients] = await pool.query(
      `SELECT i.name, i.category, ri.quantity, ri.unit
       FROM recipe_ingredients ri
       JOIN ingredients i ON i.id = ri.ingredient_id
       WHERE ri.recipe_id = ?`,
      [req.params.id]
    );

    res.json({ ...recipes[0], ingredients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load recipe' });
  }
});

router.get('/plans/:weekStart', async (req, res) => {
  const { weekStart } = req.params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) {
    return res.status(400).json({ error: 'weekStart must be YYYY-MM-DD' });
  }

  try {
    const [mealTypes] = await pool.query(
      'SELECT slug, label, color FROM meal_types ORDER BY sort_order, id'
    );
    const [plans] = await pool.query(
      'SELECT id FROM meal_plans WHERE week_start = ? ORDER BY id DESC LIMIT 1',
      [weekStart]
    );

    if (!plans[0]) {
      return res.json({ weekStart, slots: [], mealTypes });
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

    res.json({ weekStart, slots, mealTypes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load meal plan' });
  }
});

export default router;
