USE meal_prep;

CREATE TABLE IF NOT EXISTS meal_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(80) NOT NULL,
  color VARCHAR(16) NOT NULL DEFAULT '#E8D5B7',
  is_default TINYINT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS ingredient_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(80) NOT NULL,
  is_default TINYINT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

INSERT IGNORE INTO meal_types (slug, label, color, is_default, sort_order) VALUES
  ('breakfast', 'Breakfast', '#E8D5B7', 1, 1),
  ('lunch', 'Lunch', '#C9D4B8', 1, 2),
  ('dinner', 'Dinner', '#E8C4A0', 1, 3);

INSERT IGNORE INTO ingredient_categories (slug, label, is_default, sort_order) VALUES
  ('produce', 'Produce', 1, 1),
  ('protein', 'Protein', 1, 2),
  ('dairy', 'Dairy', 1, 3),
  ('pantry', 'Pantry', 1, 4),
  ('other', 'Other', 1, 5);

ALTER TABLE recipes MODIFY meal_type VARCHAR(50) NOT NULL;
ALTER TABLE plan_slots MODIFY meal_type VARCHAR(50) NOT NULL;
ALTER TABLE ingredients MODIFY category VARCHAR(50) NOT NULL;
