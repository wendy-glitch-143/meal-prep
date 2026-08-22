CREATE DATABASE IF NOT EXISTS meal_prep;
USE meal_prep;

DROP TABLE IF EXISTS plan_slots;
DROP TABLE IF EXISTS meal_plans;
DROP TABLE IF EXISTS recipe_ingredients;
DROP TABLE IF EXISTS ingredients;
DROP TABLE IF EXISTS recipes;
DROP TABLE IF EXISTS meal_types;
DROP TABLE IF EXISTS ingredient_categories;
DROP TABLE IF EXISTS recipe_categories;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(100) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE meal_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(80) NOT NULL,
  color VARCHAR(16) NOT NULL DEFAULT '#E8D5B7',
  is_default TINYINT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE ingredient_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(80) NOT NULL,
  is_default TINYINT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE recipe_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(50) NOT NULL UNIQUE,
  label VARCHAR(80) NOT NULL,
  color VARCHAR(16) NOT NULL DEFAULT '#E8D5B7',
  is_default TINYINT NOT NULL DEFAULT 0,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE recipes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  meal_type VARCHAR(50) NOT NULL,
  category VARCHAR(50) NOT NULL,
  prep_minutes INT NOT NULL,
  servings INT NOT NULL DEFAULT 2,
  emoji VARCHAR(16) NOT NULL,
  color VARCHAR(16) NOT NULL,
  video_url VARCHAR(500) NULL
);

CREATE TABLE ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  category VARCHAR(50) NOT NULL
);

CREATE TABLE recipe_ingredients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  recipe_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity DECIMAL(8,2) NOT NULL,
  unit VARCHAR(32) NOT NULL,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE,
  FOREIGN KEY (ingredient_id) REFERENCES ingredients(id)
);

CREATE TABLE meal_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  week_start DATE NOT NULL,
  UNIQUE KEY unique_user_week (user_id, week_start),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE plan_slots (
  id INT AUTO_INCREMENT PRIMARY KEY,
  meal_plan_id INT NOT NULL,
  day_of_week TINYINT NOT NULL,
  meal_type VARCHAR(50) NOT NULL,
  recipe_id INT NOT NULL,
  UNIQUE KEY unique_slot (meal_plan_id, day_of_week, meal_type),
  FOREIGN KEY (meal_plan_id) REFERENCES meal_plans(id) ON DELETE CASCADE,
  FOREIGN KEY (recipe_id) REFERENCES recipes(id)
);

INSERT INTO meal_types (slug, label, color, is_default, sort_order) VALUES
  ('breakfast', 'Breakfast', '#E8D5B7', 1, 1),
  ('lunch', 'Lunch', '#C9D4B8', 1, 2),
  ('dinner', 'Dinner', '#E8C4A0', 1, 3);

INSERT INTO ingredient_categories (slug, label, is_default, sort_order) VALUES
  ('produce', 'Produce', 1, 1),
  ('protein', 'Protein', 1, 2),
  ('dairy', 'Dairy', 1, 3),
  ('pantry', 'Pantry', 1, 4),
  ('other', 'Other', 1, 5);

INSERT INTO recipe_categories (slug, label, color, is_default, sort_order) VALUES
  ('chicken', 'Chicken', '#E8C4A0', 1, 1),
  ('pork', 'Pork', '#E4B4A4', 1, 2),
  ('beef', 'Beef', '#D4B896', 1, 3),
  ('vegetables', 'Vegetables', '#C9D4B8', 1, 4);
