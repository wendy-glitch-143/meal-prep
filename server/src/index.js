import './load-env.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import planRoutes from './routes/plans.js';
import settingsRoutes from './routes/settings.js';
import publicRoutes from './routes/public.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
const port = process.env.PORT || 3001;

const frontend = process.env.FRONTEND_URL;
app.use(cors(frontend ? { origin: frontend.split(',').map((s) => s.trim()) } : undefined));
app.use(express.json());

app.use('/api/public', publicRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/recipes', requireAuth, recipeRoutes);
app.use('/api/plans', requireAuth, planRoutes);
app.use('/api/settings', requireAuth, settingsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

function start(tries = 0) {
  const server = app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE' && tries < 8) {
      setTimeout(() => start(tries + 1), 250);
      return;
    }
    console.error(err.code ? `${err.code}: ${err.message}` : err.message);
    process.exit(1);
  });
}

start();
