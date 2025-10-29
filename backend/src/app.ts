import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import morgan from 'morgan';
import tutorRoutes from './routes/TutorRoute';
import studentRoutes from './routes/StudentRoute';
import cookieParser from 'cookie-parser';
import adminRoutes from './routes/AdminRoute';
import path from 'path';
const app = express();
app.use(morgan('dev'));
import cors from 'cors';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN,
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  }),
);

app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));
app.use(cookieParser());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Tuition backend is running');
});

app.get('/health', (_req, res) => {
  res.json({ status: ' CI CD retry', time: new Date().toISOString() });
});

app.use('/api/v1/student', studentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/tutor', tutorRoutes);
app.use(notFound);
app.use(errorHandler);
export default app;
