import express from 'express';
import {
  createInterview,
  getAllInterviews,
  getInterviewById,
  getInterviewsByUserId,
  updateInterview,
  acceptInterview,
  rejectInterview,
  deleteInterview
} from '../Controllers/interviewController';

const router = express.Router();

// 📌 CREATE a new interview
router.post('/Add', createInterview);

// 📌 READ all or specific interview
router.get('/GetAll', getAllInterviews);
router.get('/GetById/:id', getInterviewById);
router.get('/GetByUser/:userId', getInterviewsByUserId);

// 📌 UPDATE interview (general or candidate actions)
router.put('/Update/:id', updateInterview);
router.put('/Accept/:id', acceptInterview);
router.put('/Reject/:id', rejectInterview);

// 📌 DELETE interview
router.delete('/Delete/:id', deleteInterview);

export default router;
