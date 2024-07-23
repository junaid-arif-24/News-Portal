import express from 'express';
import mongoose from 'mongoose';

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect('mongodb+srv://junaidarif7078:junaid123@cluster0.1n1nswn.mongodb.net/').then(() => {
  console.log('Connected to MongoDB');
}).catch(err => {
  console.error('Failed to connect to MongoDB', err);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
