import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const router = Router();

function tokenFor(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

router.post('/signup', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO users (username, password_hash) VALUES (?, ?)',
      [username.trim(), hash]
    );
    const user = { id: result.insertId, username: username.trim() };
    res.status(201).json({ token: tokenFor(user), user });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'That username is already taken' });
    }
    console.error(err);
    res.status(500).json({ error: 'Could not create account' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const [rows] = await pool.query(
      'SELECT id, username, password_hash FROM users WHERE username = ?',
      [username.trim()]
    );
    const user = rows[0];
    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    res.json({
      token: tokenFor(user),
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not log in' });
  }
});

router.get('/me', async (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'Login required' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT id, username FROM users WHERE id = ?', [payload.id]);
    if (!rows[0]) return res.status(401).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
