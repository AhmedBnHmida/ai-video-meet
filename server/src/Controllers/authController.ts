import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User'; // Import user models

const users: any[] = []; // Replace with DB later


// Register a new user
export const register = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ message: 'User already exists' });

  //const hashedPassword = await bcrypt.hash(password, 10); // Hash the password in the model
  const user = new User({
    email,
    //password: hashedPassword,
    role: 'CANDIDATE', // Default role, can be changed later
    password,
    isVerified: true,
  });

  try {
    await user.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<any> => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'User not found' });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: 'password incorrect' });

  // Example: Add a role (either 'CANDIDATE' or 'HR_MANAGER') to the payload
  const userRole = user.role || 'CANDIDATE'; // Default to 'CANDIDATE' if role is not set

  const token = jwt.sign(
    { email, role: userRole },
    process.env.JWT_SECRET as string,
    { expiresIn: '1h' }
  );
  
  res.json({ token, role: userRole });
};

// Logout user

export const logout = (_: Request, res: Response) => {
  res.json({ message: 'Logged out (remove token client-side)' });
};
