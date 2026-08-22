import { Router } from 'express';
import pool from '../db.js';

const router = Router();

router.get('/menu', async (_req, res) => {
  try {
    const [recipes] = await pool.query(
      `SELECT r.*, rc.label AS category_label
       FROM recipes r
       LEFT JOIN recipe_categories rc ON rc.slug = r.category
       ORDER BY r.category, r.name`
    );
    const [recipeCategories] = await pool.query(
      'SELECT slug, label FROM recipe_categories ORDER BY sort_order, id'
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

export default router;
