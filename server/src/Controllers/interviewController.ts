import { Request, Response } from 'express';
import Interview from '../models/Interview';
import { InterviewStatus, InterviewType } from '../models/types'; // Ensure InterviewStatus and InterviewType are correctly imported

interface ICreateInterviewRequest extends Request {
  body: {
    application: string;
    interviewer: string;
    candidate: string;
    type: InterviewType;
    status: InterviewStatus;
    scheduledDate: Date;
    duration: number;
    location: string;
    notes: string;
  };
}

// Create a new interview
export const createInterview = async (req: ICreateInterviewRequest, res: Response): Promise<void> => {
  try {
    const { application, interviewer, candidate, type, status, scheduledDate, duration, location, notes } = req.body;

    const interview = new Interview({
      application,
      interviewer,
      candidate,
      type,
      status,
      scheduledDate,
      duration,
      location,
      notes,
      feedback: [],
    });

    await interview.save();
    res.status(201).json({ message: 'Interview created successfully', interview });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get all interviews
export const getAllInterviews = async (req: Request, res: Response): Promise<void> => {
  try {
    const interviews = await Interview.find().populate('application interviewer candidate');
    res.status(200).json(interviews);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Get interview by ID
export const getInterview = async (req: Request, res: Response): Promise<any> => {
  try {
    const interview = await Interview.findById(req.params.id).populate('application interviewer candidate');
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    res.status(200).json(interview);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};

// Update interview status
export const updateInterviewStatus = async (req: Request, res: Response): Promise<any> => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Ensure that status is valid (InterviewStatus enum)
    if (!Object.values(InterviewStatus).includes(req.body.status)) {
      return res.status(400).json({ error: 'Invalid status value' });
    }

    await interview.updateStatus(req.body.status);
    res.status(200).json({ message: 'Interview status updated successfully', interview });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};


// Delete an interview by ID
export const deleteInterview = async (req: Request, res: Response): Promise<void> => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) {
      res.status(404).json({ error: 'Interview not found' });
      return;
    }
    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
};