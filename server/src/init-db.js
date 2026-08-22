import './load-env.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

async function run() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  await conn.query(fs.readFileSync(path.join(root, 'database/schema.sql'), 'utf8'));
  await conn.end();
  console.log('Database created.');
}

run().catch((err) => {
  console.error(err.code ? `${err.code}: ${err.message}` : err.message || err);
  process.exit(1);
});
