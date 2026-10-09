import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import projectRoutes from './routes/projects.routes';
import taskRoutes from './routes/tasks.routes';
import adminRoutes from './routes/admin.routes';
import { db } from './data/db';
import { authMiddleware } from './middleware/auth.middleware';

const app = express();

if(process.env.NODE_ENV == 'production') {
 app.use(cors({
   origin: process.env.FRONTEND_URL
 }))
} else {
 app.use(
   cors({
     origin: "https://localhost:4200",
   }),
 );
}

app.use(express.json());

// Simula latência de rede (300ms)
app.use((req, res, next) => {
  setTimeout(next, 300);
});

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/admin', adminRoutes);

app.get('/api/members', authMiddleware, (req, res) => {
  res.json(db.users);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(`Backend rodando na porta ${PORT}`);
  console.log("esta em produção: ", process.env.NODE_ENV)
});
