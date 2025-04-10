import express, { Request, Response } from 'express';
import { createInterview, getAllInterviews, getInterview, updateInterviewStatus, deleteInterview } from '../Controllers/interviewController'; // Import interview controller functions

const router = express.Router();

// Interview Routes
router.post('/interviews', createInterview);
router.get('/interviews', getAllInterviews);
router.get('/interviews/:id', getInterview);
router.put('/interviews/:id/status', updateInterviewStatus);
router.delete('/delete/:id', deleteInterview); // Delete interview by ID

export default router;
