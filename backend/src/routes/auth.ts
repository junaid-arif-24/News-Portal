import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import auth from '../middleware/authMiddleware';
import { sendRegistrationWelcomeEmail,sendLoginWelcomeEmail,sendResetPasswordEmail } from '../utils/mailer';
const router = express.Router();
const SecretKey = process.env.JWT_SECRET || 'secretkey';

interface RegisterRequest extends Request {
  body: {
    name: string;
    email: string;
    password: string;
    role: string;
  };
}

interface LoginRequest extends Request {
  body: {
    email: string;
    password: string;
  };
}



interface ForgotPasswordRequest extends Request {
  body: {
    email: string;
  };
}

interface ResetPasswordRequest extends Request {
  body: {
    token: string;
    password: string;
  };
}

// Forgot Password - Request Password Reset
router.post('/forgot-password', async (req: ForgotPasswordRequest, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 12);

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration

    await user.save();

    await sendResetPasswordEmail(email,user.name);

    res.status(200).json({ message: 'Password reset token sent to email',resetToken});
  } catch (error) {
    console.error('Error in forgot-password:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

// Reset Password - Update the password
router.post('/reset-password', async (req: ResetPasswordRequest, res: Response) => {
  const {  password } = req.body;
  const token = req.headers.authorization?.split(' ')[1];
  try {
    if (!token) {
      return res.status(400).json({ message: 'Token not provided' });
    }
    const user = await User.findOne({
      resetPasswordToken: { $exists: true },
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token , please try again' });
    }

    const isTokenValid = await bcrypt.compare(token, user.resetPasswordToken!);
    if (!isTokenValid) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    res.status(200).json({ message: 'Password has been reset' });
  } catch (error) {
    console.error('Error in reset-password:', error);
    res.status(500).json({ message: 'Something went wrong' });
  }
});



// Registration endpoint
router.post('/register', async (req: RegisterRequest, res: Response) => {
  const { name, email, password, role } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ name, email, password: hashedPassword ,role});

    await newUser.save();

    const token = jwt.sign({ email: newUser.email, id: newUser._id }, SecretKey, { expiresIn: '12h' });
    await sendRegistrationWelcomeEmail(email, name);
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

    const token = jwt.sign({ email: existingUser.email, id: existingUser._id }, SecretKey, { expiresIn: '12h' });
    await sendLoginWelcomeEmail(email, existingUser.name);
    res.status(200).json({ result: existingUser, token });
  } catch (error) {
    console.error("Error during login:", error);  // Log the error for debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
});

//logout endpoint
router.post('/logout', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Logged out successfully' });
});

// Get current user endpoint
router.get('/user', auth, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId; // Get the userId from the request
    const user = await User.findById(userId).select('-password').populate('subscriptions', 'name').populate({
      path: 'savedNews',
      select: 'title date time images category',
      populate: {
        path: 'category',
        select: 'name',
      },
    }); // Exclude the password field

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);  // Log the error for debugging
    res.status(500).json({ message: 'Something went wrong' });
  }
});

export default router;
