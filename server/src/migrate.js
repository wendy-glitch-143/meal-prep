import pool from './db.js';

const DEFAULT_CATEGORIES = [
  ['chicken', 'Chicken', '#E8C4A0', 1, 'chicken'],
  ['pork', 'Pork', '#E4B4A4', 2, 'pork'],
  ['beef', 'Beef', '#D4B896', 3, 'beef'],
  ['vegetables', 'Vegetables', '#C9D4B8', 4, 'vegan'],
];

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recipe_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(50) NOT NULL UNIQUE,
      label VARCHAR(80) NOT NULL,
      color VARCHAR(16) NOT NULL DEFAULT '#E8D5B7',
      icon VARCHAR(50) NOT NULL DEFAULT 'sides',
      is_default TINYINT NOT NULL DEFAULT 0,
      sort_order INT NOT NULL DEFAULT 0
    )
  `);

  try {
    await pool.query(
      "ALTER TABLE recipes ADD COLUMN category VARCHAR(50) NOT NULL DEFAULT 'chicken'"
    );
  } catch {
    // column already exists
  }

  try {
    await pool.query('ALTER TABLE recipes ADD COLUMN available TINYINT NOT NULL DEFAULT 1');
  } catch {
    // column already exists
  }

  try {
    await pool.query('ALTER TABLE recipes ADD COLUMN created_at TIMESTAMP NULL');
  } catch {
    // column already exists
  }

  try {
    await pool.query("UPDATE recipes SET created_at = '2020-01-01 00:00:00' WHERE created_at IS NULL");
  } catch {
    // ignore if column is missing
  }

  try {
    await pool.query("ALTER TABLE recipe_categories ADD COLUMN icon VARCHAR(50) NOT NULL DEFAULT 'sides'");
  } catch {
    // column already exists
  }

  for (const [slug, label, color, sort, icon] of DEFAULT_CATEGORIES) {
    await pool.query(
      `INSERT IGNORE INTO recipe_categories (slug, label, color, icon, is_default, sort_order)
       VALUES (?, ?, ?, ?, 1, ?)`,
      [slug, label, color, icon, sort]
    );
    await pool.query(
      "UPDATE recipe_categories SET icon = ? WHERE slug = ? AND (icon = '' OR icon = 'sides') AND is_default = 1",
      [icon, slug]
    );
  }
}
