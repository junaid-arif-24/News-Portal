import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();
const SecretKey = process.env.JWT_SECRET || 'secretkey';


interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}

// Registration endpoint
router.post('/register', async (req: RegisterRequest, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword });

    await newUser.save();

    const token = jwt.sign({ email: newUser.email, id: newUser._id }, SecretKey, { expiresIn: '1h' });

    res.status(201).json({ result: newUser, token });
  } catch (error) {
    console.error("Error during registration:", error);  // Log the error for debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Login endpoint
router.post('/login', async (req: LoginRequest, res: Response) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SecretKey, { expiresIn: '1h' });

    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error("Error during login:", error);  // Log the error for debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
});


export default router;
