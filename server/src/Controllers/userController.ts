import { Request, Response } from 'express';
import { User } from '../models/User';

// ✅ Create a user (admin only)
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json({ message: 'User created', user });
  } catch (error) {
    res.status(400).json({ message: 'Error creating user', error });
  }
};

// ✅ Get all users
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// ✅ Get user by ID
export const getUserById = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user' });
  }
};

// ✅ Update user
export const updateUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User updated', user });
  } catch (error) {
    res.status(400).json({ message: 'Error updating user', error });
  }
};

// ✅ Delete user
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};
