import { Router } from 'express';
import pool from '../db.js';
import { parseVideo } from '../video.js';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const mealType = req.query.meal_type;
    const sql = mealType
      ? 'SELECT * FROM recipes WHERE meal_type = ? ORDER BY name'
      : 'SELECT * FROM recipes ORDER BY meal_type, name';
    const [rows] = mealType ? await pool.query(sql, [mealType]) : await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not load recipes' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [recipes] = await pool.query('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
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

function recipePayload(body) {
  const {
    name,
    description = '',
    meal_type,
    prep_minutes,
    servings = 2,
    emoji = '🍽️',
    color,
    video_url = '',
    ingredients = [],
  } = body || {};

  if (!name || !meal_type) {
    return { error: 'Name and meal type are required' };
  }

  const video = String(video_url || '').trim();
  if (video && !parseVideo(video)) {
    return { error: 'Use a YouTube, TikTok, Instagram, or Facebook video link' };
  }

  return {
    name: name.trim(),
    description: String(description).trim(),
    meal_type,
    prep_minutes: Number(prep_minutes) || 15,
    servings: Number(servings) || 2,
    emoji: String(emoji).trim() || '🍽️',
    color,
    video: video || null,
    ingredients,
  };
}

async function attachIngredients(conn, recipeId, ingredients) {
  for (const item of ingredients) {
    if (!item.name || !item.quantity) continue;
    const [cats] = await conn.query(
      'SELECT slug FROM ingredient_categories WHERE slug = ?',
      [item.category]
    );
    const category = cats[0]?.slug || 'other';
    const [existing] = await conn.query(
      'SELECT id FROM ingredients WHERE LOWER(name) = LOWER(?)',
      [item.name.trim()]
    );
    let ingredientId = existing[0]?.id;
    if (!ingredientId) {
      const [added] = await conn.query(
        'INSERT INTO ingredients (name, category) VALUES (?, ?)',
        [item.name.trim(), category]
      );
      ingredientId = added.insertId;
    }
    await conn.query(
      'INSERT INTO recipe_ingredients (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)',
      [recipeId, ingredientId, Number(item.quantity), item.unit || 'count']
    );
  }
}

router.post('/', async (req, res) => {
  const data = recipePayload(req.body);
  if (data.error) return res.status(400).json({ error: data.error });

  const conn = await pool.getConnection();
  try {
    const [types] = await conn.query('SELECT slug, color FROM meal_types WHERE slug = ?', [data.meal_type]);
    if (!types[0]) {
      conn.release();
      return res.status(400).json({ error: 'Unknown meal type' });
    }

    await conn.beginTransaction();
    const [created] = await conn.query(
      `INSERT INTO recipes (name, description, meal_type, prep_minutes, servings, emoji, color, video_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.name,
        data.description,
        data.meal_type,
        data.prep_minutes,
        data.servings,
        data.emoji,
        data.color || types[0].color,
        data.video,
      ]
    );
    await attachIngredients(conn, created.insertId, data.ingredients);
    await conn.commit();
    const [recipe] = await conn.query('SELECT * FROM recipes WHERE id = ?', [created.insertId]);
    res.status(201).json(recipe[0]);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Could not save recipe' });
  } finally {
    conn.release();
  }
});

router.put('/:id', async (req, res) => {
  const data = recipePayload(req.body);
  if (data.error) return res.status(400).json({ error: data.error });

  const conn = await pool.getConnection();
  try {
    const [existing] = await conn.query('SELECT id FROM recipes WHERE id = ?', [req.params.id]);
    if (!existing[0]) {
      conn.release();
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const [types] = await conn.query('SELECT slug, color FROM meal_types WHERE slug = ?', [data.meal_type]);
    if (!types[0]) {
      conn.release();
      return res.status(400).json({ error: 'Unknown meal type' });
    }

    await conn.beginTransaction();
    await conn.query(
      `UPDATE recipes
       SET name = ?, description = ?, meal_type = ?, prep_minutes = ?, servings = ?, emoji = ?, color = ?, video_url = ?
       WHERE id = ?`,
      [
        data.name,
        data.description,
        data.meal_type,
        data.prep_minutes,
        data.servings,
        data.emoji,
        data.color || types[0].color,
        data.video,
        req.params.id,
      ]
    );
    await conn.query('DELETE FROM recipe_ingredients WHERE recipe_id = ?', [req.params.id]);
    await attachIngredients(conn, req.params.id, data.ingredients);
    await conn.commit();
    const [recipe] = await conn.query('SELECT * FROM recipes WHERE id = ?', [req.params.id]);
    res.json(recipe[0]);
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ error: 'Could not update recipe' });
  } finally {
    conn.release();
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT id FROM recipes WHERE id = ?', [req.params.id]);
    if (!existing[0]) return res.status(404).json({ error: 'Recipe not found' });

    await pool.query('DELETE FROM plan_slots WHERE recipe_id = ?', [req.params.id]);
    await pool.query('DELETE FROM recipes WHERE id = ?', [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not delete recipe' });
  }
});

export default router;
