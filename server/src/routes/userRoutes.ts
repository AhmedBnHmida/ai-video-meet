import express, { Request, Response } from 'express';
import { createUser, getUser, updateUser, deleteUser, getAllUsers } from '../Controllers/userController'; // Import user controller functions

const router = express.Router();

// User Routes
router.post('/users', createUser);
router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

export default router;
