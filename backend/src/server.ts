import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/db';
const PORT = process.env.PORT || 5000;
dotenv.config();
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
