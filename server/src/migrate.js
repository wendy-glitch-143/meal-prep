import pool from './db.js';

const DEFAULT_CATEGORIES = [
  ['chicken', 'Chicken', '#E8C4A0', 1],
  ['pork', 'Pork', '#E4B4A4', 2],
  ['beef', 'Beef', '#D4B896', 3],
  ['vegetables', 'Vegetables', '#C9D4B8', 4],
];

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recipe_categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      slug VARCHAR(50) NOT NULL UNIQUE,
      label VARCHAR(80) NOT NULL,
      color VARCHAR(16) NOT NULL DEFAULT '#E8D5B7',
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

  for (const [slug, label, color, sort] of DEFAULT_CATEGORIES) {
    await pool.query(
      `INSERT IGNORE INTO recipe_categories (slug, label, color, is_default, sort_order)
       VALUES (?, ?, ?, 1, ?)`,
      [slug, label, color, sort]
    );
  }
}
