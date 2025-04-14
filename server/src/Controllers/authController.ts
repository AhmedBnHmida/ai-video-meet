import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

// ✅ Register new user
export const register = async (req: Request, res: Response): Promise<any>  => {
  try {
    const { email, password} = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    //const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      email,
      password: password,
      isVerified: true,
    });

    await user.save();

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(201).json({ message: 'User registered successfully', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Registration error', error: err });
  }
};

// ✅ Login user
export const login = async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });

    res.status(200).json({ message: 'Login successful', token, user });
  } catch (err) {
    res.status(500).json({ message: 'Login error', error: err });
  }
};


// ✅ Logout user
export const logout = (_: Request, res: Response) => {
  res.json({ message: 'Logged out (remove token client-side)' });
};
