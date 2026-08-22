import './load-env.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import recipeRoutes from './routes/recipes.js';
import planRoutes from './routes/plans.js';
import settingsRoutes from './routes/settings.js';
import { requireAuth } from './middleware/auth.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/recipes', requireAuth, recipeRoutes);
app.use('/api/plans', requireAuth, planRoutes);
app.use('/api/settings', requireAuth, settingsRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
