import express from 'express';
import dotenv from 'dotenv';
import studentRoutes from './routes/student.routes'
import cookieParser from 'cookie-parser';
import cors from 'cors'
import adminRoutes from './routes/admin.routes'

dotenv.config();



const app = express();
app.use(cookieParser());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get('/', (req, res) => {
  res.send('Tuition backend is running');
});
app.use('/api/student',studentRoutes);
app.use('/api/admin',adminRoutes)
export default app;
