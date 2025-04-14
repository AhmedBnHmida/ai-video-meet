import { Request, Response } from 'express';
import Interview from '../models/Interview';

// ✅ Create a new interview
export const createInterview = async (req: Request, res: Response) => {
  try {
    console.log("Received data:", req.body);
    const interview = new Interview(req.body);
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    console.error("❌ Error creating interview:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};


// ✅ Get all interviews
export const getAllInterviews = async (_req: Request, res: Response) => {
  try {
    const interviews = await Interview.find().populate('candidate interviewer');
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interviews' });
  }
};

// ✅ Get interview by ID
export const getInterviewById = async (req: Request, res: Response): Promise<any> => {
  try {
    const interview = await Interview.findById(req.params.id).populate('candidate interviewer');
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.status(200).json(interview);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching interview' });
  }
};

// ✅ Get interviews by user
export const getInterviewsByUserId = async (req: Request, res: Response) => {
  try {
    const interviews = await Interview.find({
      $or: [{ candidate: req.params.userId }, { interviewer: req.params.userId }]
    });
    res.status(200).json(interviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user interviews' });
  }
};

// ✅ Accept interview
export const acceptInterview = async (req: Request, res: Response): Promise<any> => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, { status: 'accepted' }, { new: true });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.status(200).json({ message: 'Interview accepted', interview });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting interview' });
  }
};

// ✅ Reject interview
export const rejectInterview = async (req: Request, res: Response): Promise<any> => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.status(200).json({ message: 'Interview rejected', interview });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting interview' });
  }
};

// ✅ Update interview
export const updateInterview = async (req: Request, res: Response): Promise<any> => {
  try {
    const interview = await Interview.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.status(200).json({ message: 'Interview updated', interview });
  } catch (error) {
    res.status(500).json({ message: 'Error updating interview' });
  }
};

// ✅ Delete interview
export const deleteInterview = async (req: Request, res: Response): Promise<any> => {
  try {
    const interview = await Interview.findByIdAndDelete(req.params.id);
    if (!interview) return res.status(404).json({ message: 'Interview not found' });
    res.status(200).json({ message: 'Interview deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting interview' });
  }
};
