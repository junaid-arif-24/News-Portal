import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';
import categoryRoutes from './routes/category';
import newsRoutes from './routes/news';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json())

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL as string).then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});
// Routes
app.use('/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/news', newsRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});