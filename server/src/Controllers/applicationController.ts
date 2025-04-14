import { Request, Response } from "express";
import Application from "../models/Application";

// ✅ Create new application
export const createApplication = async (req: Request, res: Response) => {
    try {
      const application = new Application(req.body); 
      await application.save();
      res.status(201).json({
        message: "Application created successfully",
        data: application
      });
    } catch (error) {
      res.status(400).json({ error: "Error creating application", details: error });
    }
  };
  
  

// ✅ Get all applications
export const getAllApplications = async (_req: Request, res: Response) => {
  try {
    const applications = await Application.find()
      .populate("candidate", "firstName lastName email");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching applications" });
  }
};

// ✅ Get application by ID
export const getApplicationById = async (req: Request, res: Response): Promise<any> => {
  try {
    const application = await Application.findById(req.params.id)
      .populate("candidate")
      .populate("interviews");
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json(application);
  } catch (error) {
    res.status(500).json({ error: "Error fetching application" });
  }
};

// ✅ Get applications by candidate ID
export const getApplicationsByUserId = async (req: Request, res: Response) => {
  try {
    const applications = await Application.find({ candidate: req.params.userId }).populate("interviews");
    res.status(200).json(applications);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user applications" });
  }
};

// ✅ Update application
export const updateApplication = async (req: Request, res: Response): Promise<any> => { 
  try {
    const application = await Application.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({
      message: "Application updated successfully",
      data: application
    });
  } catch (error) {
    res.status(400).json({ error: "Error updating application", details: error });
  }
};

// ✅ Delete application
export const deleteApplication = async (req: Request, res: Response): Promise<any> => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }
    res.status(200).json({ message: "Application deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting application", details: error });
  }
};
