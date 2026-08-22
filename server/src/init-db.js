import './load-env.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

function dbConfig(includeDatabase) {
  return {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    ...(includeDatabase ? { database: process.env.DB_NAME || 'meal_prep' } : {}),
    multipleStatements: true,
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : undefined,
  };
}

async function run() {
  const full = fs.readFileSync(path.join(root, 'database/schema.sql'), 'utf8');
  const tablesOnly = full.replace(/CREATE DATABASE[\s\S]*?;/i, '').replace(/USE\s+\w+\s*;/i, '');

  try {
    const conn = await mysql.createConnection(dbConfig(false));
    await conn.query(full);
    await conn.end();
  } catch {
    const conn = await mysql.createConnection(dbConfig(true));
    await conn.query(tablesOnly);
    await conn.end();
  }
  console.log('Database created.');
}

run().catch((err) => {
  console.error(err.code ? `${err.code}: ${err.message}` : err.message || err);
  process.exit(1);
});
