import express from 'express';
import {
  createUser,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser
} from '../Controllers/userController';

const router = express.Router();

// 📌 CREATE a new user (usually admin-only)
router.post('/Add', createUser);

// 📌 READ users
router.get('/GetAll', getAllUsers);
router.get('/GetById/:id', getUserById);

// 📌 UPDATE user info
router.put('/Update/:id', updateUser);

// 📌 DELETE user
router.delete('/Delete/:id', deleteUser);

export default router;
