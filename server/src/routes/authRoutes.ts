import express from 'express';
import { register, login, logout } from '../Controllers/authController';

const router = express.Router();

// 📌 Register a new user
router.post('/register', register);

// 📌 User login
router.post('/login', login);

// 📌 User logout (optional route)
router.post('/logout', logout);

export default router;
