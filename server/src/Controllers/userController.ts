import { Request, Response } from 'express';
import { User, IUser } from '../models/User'; // Import user models

// Create a new user
export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      isVerified: false, // or true based on your logic
    });

    await user.save();
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get a user by ID
export const getUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user: IUser | null = await User.findById(req.params.id).populate('profile');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Update a user
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user: IUser | null = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Delete a user
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user: IUser | null = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get all users
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users: IUser[] = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};
